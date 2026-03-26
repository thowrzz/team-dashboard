import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    
    // Read team data
    const teamDataPath = path.join(dataDir, 'team-data.json');
    const teamData = JSON.parse(await fs.readFile(teamDataPath, 'utf-8'));
    
    const stats = teamData.stats || {};
    const outreach = teamData.outreach || {};
    const student = teamData.student || {};
    const focus = teamData.focusScore || {};
    
    // Generate quick snapshot
    const snapshot = {
      timestamp: new Date().toISOString(),
      team: {
        healthScore: stats.teamHealthScore || 0,
        totalTasks: stats.totalTasks || 0,
        completedTasks: stats.completedTasks || 0,
        pendingTasks: stats.pendingTasks || 0,
        overdueTasks: stats.overdueTasks || 0
      },
      outreach: {
        totalSent: outreach.totalSent || 0,
        sentToday: outreach.sentToday || 0,
        remaining: outreach.leadsRemaining || 0,
        progress: outreach.totalSent > 0 
          ? Math.round((outreach.totalSent / (outreach.totalSent + outreach.leadsRemaining)) * 100) 
          : 0
      },
      student: {
        name: student.name || 'N/A',
        day: student.currentDay || 0,
        progress: student.progress || 0,
        streak: student.streak || 0,
        todayTopic: student.todayTopic || 'N/A'
      },
      focus: {
        urgency: focus.urgencyLevel || 'low',
        score: focus.priorityScore || 0,
        urgentItems: focus.urgentItems || 0
      },
      alerts: []
    };
    
    // Add alerts
    if (stats.overdueTasks > 0) {
      snapshot.alerts.push(`⚠️ ${stats.overdueTasks} overdue task(s)`);
    }
    if (student.streak >= 5) {
      snapshot.alerts.push(`🔥 ${student.name} on ${student.streak}-day streak!`);
    }
    if (outreach.totalSent >= 25) {
      snapshot.alerts.push(`🚀 ${outreach.totalSent} outreach messages sent`);
    }
    
    return NextResponse.json(snapshot);
  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to load snapshot',
      message: error.message
    }, { status: 500 });
  }
}
