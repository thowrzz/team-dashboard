import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const focusPath = path.join(process.cwd(), 'data', 'smart-focus.json');
    
    if (!fs.existsSync(focusPath)) {
      return NextResponse.json({
        success: false,
        error: 'No focus data available. Run smart_focus.py first.',
        data: null
      });
    }
    
    const focusData = JSON.parse(fs.readFileSync(focusPath, 'utf8'));
    
    return NextResponse.json({
      success: true,
      data: focusData
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    const { execSync } = require('child_process');
    
    // Run the smart focus generator
    execSync('python3 /root/smart_focus.py', { timeout: 30000 });
    
    // Read the updated data
    const focusPath = path.join(process.cwd(), 'data', 'smart-focus.json');
    const focusData = JSON.parse(fs.readFileSync(focusPath, 'utf8'));
    
    return NextResponse.json({
      success: true,
      message: 'Focus data refreshed',
      data: focusData
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
