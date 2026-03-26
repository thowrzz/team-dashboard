export const dynamic = "force-static";

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Task {
  title: string;
  status: string;
  progress?: number;
  deadline?: string;
}

interface TeamMember {
  name: string;
  tasks: Task[];
}

interface Student {
  name: string;
  currentDay: number;
  progress: number;
  streak: number;
  attendance: { percentage: number };
  project: string;
}

interface TeamData {
  team: TeamMember[];
  outreach: {
    totalSent: number;
    leadsRemaining: number;
  };
  student: Student;
  stats: {
    teamHealthScore: number;
  };
}

interface Recommendation {
  type: string;
  priority: string;
  message: string;
}

function calculateInsights(data: TeamData) {
  const insights = {
    team: {
      totalTasks: 0,
      completed: 0,
      inProgress: 0,
      completionRate: 0,
      healthScore: data.stats?.teamHealthScore || 0
    },
    outreach: {
      totalSent: data.outreach?.totalSent || 0,
      remaining: data.outreach?.leadsRemaining || 0,
      progressPercent: 0,
      daysToComplete: 0
    },
    student: {
      name: data.student?.name || "Student",
      currentDay: data.student?.currentDay || 0,
      progress: data.student?.progress || 0,
      streak: data.student?.streak || 0,
      attendance: data.student?.attendance?.percentage || 0,
      project: data.student?.project || ""
    },
    recommendations: [] as Recommendation[],
    highlights: [] as string[]
  };

  // Calculate team stats
  for (const member of data.team || []) {
    for (const task of member.tasks || []) {
      insights.team.totalTasks++;
      if (task.status === "Completed") {
        insights.team.completed++;
      } else if (task.status === "In Progress") {
        insights.team.inProgress++;
      }
    }
  }

  insights.team.completionRate = insights.team.totalTasks > 0 
    ? Math.round((insights.team.completed / insights.team.totalTasks) * 100) 
    : 0;

  // Calculate outreach projections
  insights.outreach.progressPercent = Math.round((insights.outreach.totalSent / 5000) * 100 * 100) / 100;
  insights.outreach.daysToComplete = Math.ceil(insights.outreach.remaining / 20);

  // Generate recommendations
  const recommendations: Recommendation[] = [];
  const highlights: string[] = [];

  for (const member of data.team || []) {
    for (const task of member.tasks || []) {
      if (task.status === "In Progress" && (task.progress || 0) > 70) {
        recommendations.push({
          type: "momentum",
          priority: "high",
          message: `${member.name}'s "${task.title}" at ${task.progress}% - final push needed!`
        });
      }
      if (task.status === "Completed") {
        highlights.push(`${member.name} completed "${task.title}"`);
      }
    }
  }

  // Student highlights
  if (insights.student.streak >= 5) {
    highlights.push(`${insights.student.name} on ${insights.student.streak}-day learning streak!`);
  }

  // Outreach recommendations
  if (insights.outreach.totalSent < 100) {
    recommendations.push({
      type: "growth",
      priority: "medium",
      message: `Outreach at ${insights.outreach.totalSent}/5000 - ramp up for better reach`
    });
  }

  insights.recommendations = recommendations;
  insights.highlights = highlights;

  return insights;
}

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'team-data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const data: TeamData = JSON.parse(rawData);
    
    const insights = calculateInsights(data);
    
    return NextResponse.json({
      success: true,
      generatedAt: new Date().toISOString(),
      insights
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate insights' 
    }, { status: 500 });
  }
}
