import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const insightsPath = path.join(process.cwd(), 'data', 'smart-insights.json');
    const data = await fs.readFile(insightsPath, 'utf-8');
    const insights = JSON.parse(data);
    
    return NextResponse.json(insights);
  } catch (error) {
    // Return default insights if file doesn't exist
    return NextResponse.json({
      generated_at: new Date().toISOString(),
      recommendations: [],
      bottlenecks: [],
      predictions: [],
      optimal_focus: {
        focus: "Loading insights...",
        why: "Generating AI recommendations",
        action: "Check back in a moment",
        urgency: "info"
      },
      metrics: {
        total_recommendations: 0,
        critical_bottlenecks: 0,
        avg_velocity: 0
      }
    });
  }
}
