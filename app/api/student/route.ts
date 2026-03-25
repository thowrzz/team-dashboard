import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const teamPath = path.join(process.cwd(), 'data', 'team-data.json');
    const teamData = JSON.parse(fs.readFileSync(teamPath, 'utf-8'));
    
    const student = teamData.student;
    
    if (!student) {
      return NextResponse.json({ 
        success: false, 
        error: 'No student data found' 
      }, { status: 404 });
    }
    
    // Calculate additional stats
    const startDate = new Date(student.startDate);
    const now = new Date();
    const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Calculate week progress
    const currentDayInWeek = ((student.currentDay - 1) % 7) + 1;
    const weekProgress = (currentDayInWeek / 7) * 100;
    
    // Determine streak status
    const streakStatus = student.streak >= 5 ? '🔥 On Fire!' : 
                         student.streak >= 3 ? '⭐ Great Streak!' : 
                         student.streak >= 1 ? '✨ Building Streak' : 'Start Streak';
    
    // Get today's activity
    const todayTopics = student.topics?.covered?.slice(-1) || [];
    const upcomingTopics = student.topics?.upcoming?.slice(0, 3) || [];
    
    return NextResponse.json({
      success: true,
      data: {
        name: student.name,
        phone: student.phone,
        project: student.project,
        
        // Progress
        currentDay: student.currentDay,
        totalDays: student.totalDays || 30,
        currentWeek: student.currentWeek,
        progress: student.progress,
        weekProgress: Math.round(weekProgress),
        dayInWeek: currentDayInWeek,
        
        // Streak
        streak: student.streak,
        streakStatus: streakStatus,
        
        // Status
        status: student.status,
        sessionActive: student.sessionActive,
        sessionStartTime: student.sessionStartTime,
        nextCheckIn: student.nextCheckIn,
        
        // Topics
        todayTopic: student.todayTopic,
        topicsCovered: student.topics?.covered || [],
        upcomingTopics: upcomingTopics,
        
        // Quiz
        quizScores: student.quizScores || [],
        avgQuizScore: student.quizScores?.length > 0 
          ? Math.round(student.quizScores.reduce((a: number, b: number) => a + b, 0) / student.quizScores.length)
          : null,
        
        // Attendance
        attendance: student.attendance,
        
        // Today's tasks
        tasksToday: student.tasksToday,
        
        // Notes
        notes: student.notes,
        
        // Metadata
        startDate: student.startDate,
        daysSinceStart: daysSinceStart,
        lastUpdated: student.lastUpdated || new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
