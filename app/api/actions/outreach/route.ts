import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    const { stdout, stderr } = await execAsync('python3 /root/outreach.py --dry-run 2>&1', {
      timeout: 30000
    });
    
    // Parse output for stats
    const sentMatch = stdout.match(/sent[:\s]+(\d+)/i);
    const remainingMatch = stdout.match(/remaining[:\s]+(\d+)/i);
    
    return NextResponse.json({
      success: true,
      message: `Outreach preview: ${sentMatch ? sentMatch[1] + ' ready' : 'Check logs'}`,
      data: {
        preview: true,
        output: stdout.slice(0, 500)
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Outreach preview generated (dry run)',
      data: { note: 'Use /outreach command to send actual messages' }
    });
  }
}
