export const dynamic = "force-static";

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { memberId, taskId, updates } = await request.json();
    const dataPath = path.join(process.cwd(), 'data', 'team-data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    
    // Find member and update task
    const member = data.team.find((m: any) => m.id === memberId);
    if (member) {
      const task = member.tasks.find((t: any) => t.id === taskId);
      if (task) {
        Object.assign(task, updates);
        data.lastUpdated = new Date().toISOString();
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return NextResponse.json({ success: true, task });
      }
    }
    
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
