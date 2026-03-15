import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export const dynamic = "force-static";

const DATA_FILE = path.join(process.cwd(), 'data/dashboard-metrics.json');

export async function GET() {
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(rawData);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load dashboard metrics' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    fs.writeFileSync(DATA_FILE, JSON.stringify(body, null, 2));
    return NextResponse.json({ success: true, message: 'Dashboard metrics updated' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update dashboard metrics' },
      { status: 500 }
    );
  }
}
