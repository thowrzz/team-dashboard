import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';


export const dynamic = "force-static";

export async function GET() {
  try {
    // Read outreach log
    const outreachLogPath = '/root/outreach_log.json';
    let outreachStats = {
      totalSent: 0,
      totalFailed: 0,
      lastRun: null as string | null,
      todaySent: 0,
      thisWeekSent: 0
    };
    
    if (fs.existsSync(outreachLogPath)) {
      const logData = JSON.parse(fs.readFileSync(outreachLogPath, 'utf-8'));
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      logData.forEach((entry: { date: string; sent: number; failed: number }) => {
        outreachStats.totalSent += entry.sent || 0;
        outreachStats.totalFailed += entry.failed || 0;
        
        if (entry.date && entry.date.startsWith(today)) {
          outreachStats.todaySent += entry.sent || 0;
        }
        if (entry.date && entry.date >= weekAgo) {
          outreachStats.thisWeekSent += entry.sent || 0;
        }
      });
      
      if (logData.length > 0) {
        outreachStats.lastRun = logData[logData.length - 1].date;
      }
    }
    
    // Company metrics
    const companyData = {
      daysActive: Math.ceil((Date.now() - new Date('2026-02-26').getTime()) / (1000 * 60 * 60 * 24)),
      teamSize: 3,
      activeProjects: 1,
      automationsRunning: 8,
      lastUpdated: new Date().toISOString()
    };
    
    // Milestones
    const milestones = [
      { id: 1, title: "Company Founded", date: "2026-02-26", completed: true, icon: "🎉" },
      { id: 2, title: "Team Dashboard Live", date: "2026-02-26", completed: true, icon: "📊" },
      { id: 3, title: "Agent(I) AI Active", date: "2026-02-26", completed: true, icon: "🤖" },
      { id: 4, title: "First Team Member Onboarded", date: "2026-02-26", completed: true, icon: "👥" },
      { id: 5, title: "Cold Outreach System Live", date: "2026-03-04", completed: true, icon: "📧" },
      { id: 6, title: "Automated Check-ins Started", date: "2026-03-01", completed: true, icon: "⏰" },
      { id: 7, title: "Kerala Sellers MVP Launch", date: "2026-04-01", completed: false, icon: "🚀", target: true },
      { id: 8, title: "Team Growth (5 Members)", date: "2026-06-01", completed: false, icon: "📈", target: true },
    ];
    
    return NextResponse.json({
      outreach: outreachStats,
      company: companyData,
      milestones,
      integrations: {
        gmail: { status: 'connected', lastSync: 'Active' },
        sheets: { status: 'connected', lastSync: 'Active' },
        calendar: { status: 'connected', lastSync: 'Active' },
        telegram: { status: 'connected', lastSync: 'Active' },
        github: { status: 'connected', lastSync: 'Active' }
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
