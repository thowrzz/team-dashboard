import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export async function POST() {
  try {
    // Generate daily intelligence brief (includes smart insights)
    const { stdout } = await execAsync('python3 /root/daily_intelligence_brief.py', {
      timeout: 60000
    });
    
    // Try to read smart insights
    try {
      const insightsPath = path.join(process.cwd(), 'data', 'smart-insights.json');
      const data = await fs.readFile(insightsPath, 'utf-8');
      const insights = JSON.parse(data);
      
      return NextResponse.json({
        success: true,
        message: "Smart insights generated!",
        data: {
          recommendations: insights.recommendations?.slice(0, 3) || [],
          optimalFocus: insights.optimal_focus || null,
          generatedAt: new Date().toISOString()
        }
      });
    } catch {
      return NextResponse.json({
        success: true,
        message: "Insights generated!",
        data: { preview: stdout.slice(-500) }
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: `Failed to generate insights: ${error.message?.slice(0, 100)}`
    }, { status: 500 });
  }
}
