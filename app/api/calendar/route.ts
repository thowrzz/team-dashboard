import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Try to get calendar events from the Python script
    const { stdout } = await execAsync('python3 /root/calendar_cmd.py list 2>/dev/null || echo "[]"');
    
    try {
      const events = JSON.parse(stdout);
      return NextResponse.json({ events, hasCalendar: true });
    } catch {
      // If parsing fails, return mock data or empty
      return NextResponse.json({ 
        events: [],
        hasCalendar: false,
        message: 'Calendar integration not available'
      });
    }
  } catch (error) {
    return NextResponse.json({ 
      events: [],
      hasCalendar: false,
      message: 'Unable to fetch calendar'
    });
  }
}
