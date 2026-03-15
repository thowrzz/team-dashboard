import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'team-data.json');
    const data = fs.readFileSync(dataPath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load team data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newData = await request.json();
    const dataPath = path.join(process.cwd(), 'data', 'team-data.json');
    
    // Update timestamp
    newData.lastUpdated = new Date().toISOString();
    
    fs.writeFileSync(dataPath, JSON.stringify(newData, null, 2));
    return NextResponse.json({ success: true, data: newData });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save team data' }, { status: 500 });
  }
}
