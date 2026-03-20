import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface TeamMember {
  id: number;
  name: string;
  phone: string;
  tasks?: Array<{
    id: number;
    title: string;
    status: string;
    progress: number;
    priority: string;
    checkIns?: { morning: boolean; afternoon: boolean; evening: boolean };
    streak?: { current: number; best: number; checkInsToday: number };
  }>;
}

interface TeamData {
  team: TeamMember[];
  stats: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
    teamHealthScore?: number;
  };
}

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'team-data.json');
    const teamData: TeamData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Calculate Team Pulse Score (0-100)
    let pulseScore = 100;
    let factors: { name: string; impact: number; status: 'good' | 'warning' | 'critical' }[] = [];
    
    // Factor 1: Task Completion Rate (-20 if low)
    const completionRate = teamData.stats.totalTasks > 0 
      ? (teamData.stats.completedTasks / teamData.stats.totalTasks) * 100 
      : 100;
    if (completionRate < 50) {
      pulseScore -= 20;
      factors.push({ name: 'Low Completion Rate', impact: -20, status: 'critical' });
    } else if (completionRate < 80) {
      pulseScore -= 10;
      factors.push({ name: 'Completion Rate Needs Attention', impact: -10, status: 'warning' });
    } else {
      factors.push({ name: 'Good Completion Rate', impact: 0, status: 'good' });
    }
    
    // Factor 2: Overdue Tasks (-15 per overdue task, max -30)
    const overduePenalty = Math.min(teamData.stats.overdueTasks * 15, 30);
    if (overduePenalty > 0) {
      pulseScore -= overduePenalty;
      factors.push({ 
        name: `${teamData.stats.overdueTasks} Overdue Task(s)`, 
        impact: -overduePenalty, 
        status: overduePenalty >= 30 ? 'critical' : 'warning' 
      });
    } else {
      factors.push({ name: 'No Overdue Tasks', impact: 0, status: 'good' });
    }
    
    // Factor 3: Team Activity (based on check-ins today)
    let activeMembers = 0;
    let totalMembers = teamData.team.length;
    
    for (const member of teamData.team) {
      const tasks = member.tasks || [];
      const hasActivityToday = tasks.some(t => 
        (t as any).activity?.some((a: any) => 
          a.date === new Date().toISOString().split('T')[0]
        )
      );
      if (hasActivityToday) activeMembers++;
    }
    
    const activityRate = totalMembers > 0 ? (activeMembers / totalMembers) * 100 : 100;
    if (activityRate < 50) {
      pulseScore -= 15;
      factors.push({ name: 'Low Team Activity Today', impact: -15, status: 'warning' });
    } else {
      factors.push({ name: 'Team is Active', impact: 0, status: 'good' });
    }
    
    // Factor 4: Pending Tasks Pressure (-5 per pending task, max -20)
    const pendingPenalty = Math.min(teamData.stats.pendingTasks * 5, 20);
    if (pendingPenalty > 0) {
      pulseScore -= pendingPenalty;
      factors.push({ 
        name: `${teamData.stats.pendingTasks} Pending Task(s)`, 
        impact: -pendingPenalty, 
        status: pendingPenalty >= 15 ? 'warning' : 'good' 
      });
    }
    
    // Clamp score between 0-100
    pulseScore = Math.max(0, Math.min(100, pulseScore));
    
    // Determine overall status
    let status: 'healthy' | 'attention' | 'critical';
    let statusEmoji: string;
    let recommendation: string;
    
    if (pulseScore >= 75) {
      status = 'healthy';
      statusEmoji = '💚';
      recommendation = 'Team is performing well! Keep up the momentum.';
    } else if (pulseScore >= 50) {
      status = 'attention';
      statusEmoji = '💛';
      recommendation = 'Some areas need attention. Focus on pending tasks.';
    } else {
      status = 'critical';
      statusEmoji = '❤️';
      recommendation = 'Immediate action needed. Address overdue tasks first.';
    }
    
    // Get quick stats
    const quickStats = {
      totalMembers: teamData.team.length,
      activeTasks: teamData.stats.totalTasks,
      completedTasks: teamData.stats.completedTasks,
      pendingTasks: teamData.stats.pendingTasks,
      overdueTasks: teamData.stats.overdueTasks
    };
    
    return NextResponse.json({
      success: true,
      pulse: {
        score: pulseScore,
        status,
        statusEmoji,
        recommendation,
        factors
      },
      quickStats,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      pulse: {
        score: 0,
        status: 'critical',
        statusEmoji: '❤️',
        recommendation: 'Unable to calculate team pulse',
        factors: []
      }
    }, { status: 500 });
  }
}
