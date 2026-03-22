import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = "force-static";

export async function GET() {
  try {
    const teamPath = path.join(process.cwd(), 'data', 'team-data.json');
    const teamData = JSON.parse(fs.readFileSync(teamPath, 'utf-8'));
    
    // Calculate priority score based on team status
    let priorityScore = 5; // Base score
    let urgentItems = 0;
    const recommendations: string[] = [];
    const positiveNotes: string[] = [];
    let focusSummary = "All systems running smoothly";
    
    // Check for overdue tasks
    const overdueTasks: { member: string; task: string; daysOverdue: number }[] = [];
    
    for (const member of teamData.team || []) {
      for (const task of member.tasks || []) {
        if (task.status === 'Overdue' || (task.daysRemaining && task.daysRemaining < 0)) {
          overdueTasks.push({
            member: member.name,
            task: task.title,
            daysOverdue: Math.abs(task.daysRemaining || 0)
          });
          priorityScore += 2;
          urgentItems++;
        }
        
        // Check in-progress tasks near deadline
        if (task.status === 'In Progress' && task.daysRemaining !== undefined && task.daysRemaining <= 2 && task.daysRemaining >= 0) {
          priorityScore += 1;
          recommendations.push(`${member.name}'s task "${task.title}" due in ${task.daysRemaining} days`);
        }
      }
    }
    
    // Generate focus summary
    if (overdueTasks.length > 0) {
      const mostUrgent = overdueTasks.sort((a, b) => b.daysOverdue - a.daysOverdue)[0];
      focusSummary = `${mostUrgent.member} has overdue task - follow up needed`;
      recommendations.unshift(`Follow up with ${mostUrgent.member} about "${mostUrgent.task}"`);
    }
    
    // Check student progress
    const student = teamData.student;
    if (student) {
      if (student.streak > 0) {
        positiveNotes.push(`${student.name} on a ${student.streak}-day learning streak!`);
      }
      if (student.sessionActive) {
        positiveNotes.push(`${student.name} currently in learning session`);
      }
      if (student.progress < 10 && student.currentDay > 1) {
        priorityScore += 1;
        recommendations.push(`Check ${student.name}'s progress - may need support`);
      }
    }
    
    // Check outreach
    const outreach = teamData.outreach;
    if (outreach) {
      if (outreach.sentToday > 0) {
        positiveNotes.push(`${outreach.sentToday} outreach messages sent today`);
      }
      if (outreach.totalSent >= 20) {
        positiveNotes.push(`Outreach milestone: ${outreach.totalSent} total messages`);
      }
    }
    
    // Cap score at 10
    priorityScore = Math.min(10, priorityScore);
    
    // Determine urgency level
    let urgencyLevel = 'normal';
    if (priorityScore >= 8) urgencyLevel = 'critical';
    else if (priorityScore >= 6) urgencyLevel = 'high';
    else if (priorityScore >= 4) urgencyLevel = 'moderate';
    
    return NextResponse.json({
      success: true,
      data: {
        priorityScore,
        urgencyLevel,
        focusSummary,
        urgentItems,
        recommendations: recommendations.slice(0, 3),
        positiveNotes: positiveNotes.slice(0, 2),
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
