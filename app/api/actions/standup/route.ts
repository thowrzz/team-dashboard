import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    // Generate team standup messages
    const { stdout } = await execAsync('python3 /root/team_standup.py', {
      timeout: 30000
    });
    
    return NextResponse.json({
      success: true,
      message: "Team standup messages generated!",
      data: {
        preview: stdout.slice(-800),
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: `Failed to generate standup: ${error.message?.slice(0, 100)}`
    }, { status: 500 });
  }
}
