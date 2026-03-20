import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';


export const dynamic = "force-static";

export async function GET() {
  try {
    const achievementsPath = path.join(process.cwd(), 'data', 'achievements.json');
    const teamPath = path.join(process.cwd(), 'data', 'team-data.json');
    
    const achievementsData = JSON.parse(fs.readFileSync(achievementsPath, 'utf8'));
    const teamData = JSON.parse(fs.readFileSync(teamPath, 'utf8'));
    
    // Calculate additional metrics
    const totalPoints = Object.values(achievementsData.memberAchievements || {})
      .reduce((sum: number, m: any) => sum + (m.points || 0), 0);
    
    const totalBadges = Object.values(achievementsData.memberAchievements || {})
      .reduce((sum: number, m: any) => sum + (m.badges?.length || 0), 0);
    
    // Get top achievements
    const topAchievements = achievementsData.achievements
      .sort((a: any, b: any) => b.points - a.points)
      .slice(0, 5);
    
    return NextResponse.json({
      success: true,
      data: {
        ...achievementsData,
        stats: {
          totalPoints,
          totalBadges,
          totalMembers: Object.keys(achievementsData.memberAchievements || {}).length,
          totalAchievementTypes: achievementsData.achievements?.length || 0
        },
        topAchievements,
        teamSize: teamData.team?.length || 0
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
