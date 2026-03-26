import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const logPath = path.join(process.cwd(), '..', '..', 'outreach_log.json');
    const data = await fs.readFile(logPath, 'utf-8');
    const logs = JSON.parse(data);
    
    // Calculate analytics
    let totalSent = 0;
    let totalFailed = 0;
    const dailyStats: Record<string, { sent: number; failed: number }> = {};
    const categoryStats: Record<string, { sent: number; failed: number }> = {};
    
    logs.forEach((log: any) => {
      const date = log.date?.split(' ')[0] || 'Unknown';
      const sent = log.sent || 0;
      const failed = log.failed || 0;
      
      totalSent += sent;
      totalFailed += failed;
      
      if (!dailyStats[date]) {
        dailyStats[date] = { sent: 0, failed: 0 };
      }
      dailyStats[date].sent += sent;
      dailyStats[date].failed += failed;
      
      // Analyze results for category breakdown
      if (log.results) {
        log.results.forEach((result: any) => {
          const business = result.business || '';
          let category = 'Restaurant';
          if (business.toLowerCase().includes('clinic') || 
              business.toLowerCase().includes('hospital') ||
              business.toLowerCase().includes('dental') ||
              business.toLowerCase().includes('medical')) {
            category = 'Healthcare';
          } else if (business.toLowerCase().includes('hotel')) {
            category = 'Hotel';
          } else if (business.toLowerCase().includes('cafe') || 
                     business.toLowerCase().includes('cafeteria')) {
            category = 'Cafe';
          }
          
          if (!categoryStats[category]) {
            categoryStats[category] = { sent: 0, failed: 0 };
          }
          if (result.status === 'sent') {
            categoryStats[category].sent++;
          } else {
            categoryStats[category].failed++;
          }
        });
      }
    });
    
    // Calculate success rate
    const successRate = totalSent + totalFailed > 0 
      ? Math.round((totalSent / (totalSent + totalFailed)) * 100) 
      : 0;
    
    // Get last 7 days trend
    const last7Days = Object.entries(dailyStats)
      .slice(-7)
      .map(([date, stats]) => ({
        date,
        sent: stats.sent,
        failed: stats.failed
      }));
    
    // Category breakdown for pie chart
    const categoryBreakdown = Object.entries(categoryStats).map(([category, stats]) => ({
      name: category,
      value: stats.sent + stats.failed,
      sent: stats.sent,
      failed: stats.failed
    }));
    
    // Recent activity
    const recentActivity = logs
      .filter((log: any) => log.results && log.results.length > 0)
      .slice(-5)
      .reverse()
      .flatMap((log: any) => 
        (log.results || []).slice(0, 4).map((r: any) => ({
          business: r.business,
          phone: r.phone,
          status: r.status,
          date: log.date
        }))
      )
      .slice(0, 10);
    
    return NextResponse.json({
      generated_at: new Date().toISOString(),
      summary: {
        totalSent,
        totalFailed,
        successRate,
        totalAttempts: totalSent + totalFailed
      },
      dailyTrend: last7Days,
      categoryBreakdown,
      recentActivity,
      insights: generateInsights(totalSent, totalFailed, successRate, categoryBreakdown)
    });
  } catch (error) {
    return NextResponse.json({
      generated_at: new Date().toISOString(),
      summary: {
        totalSent: 0,
        totalFailed: 0,
        successRate: 0,
        totalAttempts: 0
      },
      dailyTrend: [],
      categoryBreakdown: [],
      recentActivity: [],
      insights: [],
      error: 'Unable to load outreach data'
    });
  }
}

function generateInsights(sent: number, failed: number, rate: number, categories: any[]) {
  const insights = [];
  
  if (sent >= 20) {
    insights.push({
      type: 'milestone',
      icon: '🎯',
      title: `${sent} Messages Sent!`,
      description: 'Great progress on outreach'
    });
  }
  
  if (rate >= 95) {
    insights.push({
      type: 'success',
      icon: '✅',
      title: 'High Success Rate',
      description: `${rate}% delivery success`
    });
  }
  
  const topCategory = categories.sort((a, b) => b.value - a.value)[0];
  if (topCategory) {
    insights.push({
      type: 'info',
      icon: '📊',
      title: `Top Category: ${topCategory.name}`,
      description: `${topCategory.value} businesses contacted`
    });
  }
  
  return insights;
}
