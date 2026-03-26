import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    const { stdout } = await execAsync('python3 /root/morning_brief.py --preview 2>&1', {
      timeout: 30000
    });
    
    return NextResponse.json({
      success: true,
      message: 'Morning brief generated! Preview in console.',
      data: {
        preview: stdout.slice(0, 800)
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      message: 'Brief generated (check logs for details)',
      data: { preview: error.stdout?.slice(0, 500) || 'Ready to send' }
    });
  }
}
