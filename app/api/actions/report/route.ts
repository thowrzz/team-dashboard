import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    // Generate weekly digest
    const { stdout } = await execAsync('python3 /root/weekly_digest.py --preview', {
      timeout: 60000
    });
    
    return NextResponse.json({
      success: true,
      message: "Weekly report generated!",
      data: {
        preview: stdout.slice(-1000),
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: `Failed to generate report: ${error.message?.slice(0, 100)}`
    }, { status: 500 });
  }
}
