import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    
    // Read current team data to confirm it exists
    const teamDataPath = path.join(dataDir, 'team-data.json');
    const teamData = JSON.parse(await fs.readFile(teamDataPath, 'utf-8'));
    
    // Update lastUpdated timestamp
    teamData.lastUpdated = new Date().toISOString();
    await fs.writeFile(teamDataPath, JSON.stringify(teamData, null, 2));
    
    // Get stats
    const stats = teamData.stats || {};
    const outreach = teamData.outreach || {};
    const student = teamData.student || {};
    
    return NextResponse.json({
      success: true,
      message: "Dashboard data refreshed!",
      data: {
        lastUpdated: teamData.lastUpdated,
        teamHealth: stats.teamHealthScore || 0,
        totalTasks: stats.totalTasks || 0,
        outreachSent: outreach.totalSent || 0,
        studentProgress: student.progress || 0,
        studentStreak: student.streak || 0
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: `Refresh failed: ${error.message?.slice(0, 100)}`
    }, { status: 500 });
  }
}
