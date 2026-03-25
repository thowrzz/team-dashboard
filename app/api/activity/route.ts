import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = "force-static";

interface Activity {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  icon: string;
}

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'activity-log.json');
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json({ activities: [] });
    }
    const data = fs.readFileSync(dataPath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ activities: [] });
  }
}

export async function POST(request: Request) {
  try {
    const newActivity = await request.json();
    const dataPath = path.join(process.cwd(), 'data', 'activity-log.json');
    
    let data = { activities: [] };
    if (fs.existsSync(dataPath)) {
      data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    }
    
    // Add new activity at the beginning
    const activity: Activity = {
      id: Date.now(),
      type: newActivity.type || 'action',
      message: newActivity.message,
      timestamp: new Date().toISOString(),
      icon: newActivity.icon || 'zap'
    };
    
    data.activities.unshift(activity);
    
    // Keep only last 50 activities
    if (data.activities.length > 50) {
      data.activities = data.activities.slice(0, 50);
    }
    
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true, activity });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log activity' }, { status: 500 });
  }
}
