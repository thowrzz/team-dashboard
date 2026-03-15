/**
 * Daily Summary Generator
 * Generates a formatted summary for WhatsApp
 * Run: npx tsx scripts/daily-summary.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Paths
const DATA_FILE = path.join(__dirname, '../data/team-data.json');
const MEMORY_FILE = path.join(__dirname, '../../../MEMORY.md');
const TRACKING_FILE = path.join(__dirname, '../../../learning/tracking.json');
const OUTPUT_FILE = path.join(__dirname, '../reports/daily-summary.json');

interface Task {
  id: number;
  title: string;
  assignedDate: string;
  deadline: string;
  priority: string;
  status: string;
  progress: number;
  checkIns?: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
}

interface TeamMember {
  id: number;
  name: string;
  phone: string;
  tasks: Task[];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

function calculateDaysRemaining(deadline: string): number {
  if (!deadline) return 0;
  try {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);
    return Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

function getStatusEmoji(status: string, daysRemaining: number): string {
  if (status === 'Completed' || status === 'Done') return '✅';
  if (daysRemaining < 0) return '🚨';
  if (daysRemaining === 0) return '⏰';
  if (daysRemaining <= 2) return '⚠️';
  return '📋';
}

function getCheckInEmoji(checkIns: any): string {
  const total = (checkIns?.morning ? 1 : 0) + (checkIns?.afternoon ? 1 : 0) + (checkIns?.evening ? 1 : 0);
  if (total === 3) return '🟢';
  if (total >= 1) return '🟡';
  return '🔴';
}

function getSystemUptime(): string {
  try {
    const uptime = execSync('uptime -p 2>/dev/null || echo "N/A"', { encoding: 'utf-8' }).trim();
    return uptime.replace('up ', '');
  } catch {
    return 'N/A';
  }
}

function getDiskUsage(): string {
  try {
    const df = execSync("df -h / | tail -1 | awk '{print $5}'", { encoding: 'utf-8' }).trim();
    return df;
  } catch {
    return 'N/A';
  }
}

function generateSummary(): void {
  console.log('📊 Generating Daily Summary...\n');
  
  const now = new Date();
  const todayStr = formatDate(now);
  const timeStr = formatTime(now);
  
  // Read team data
  let teamData: { lastUpdated: string; team: TeamMember[]; stats: any };
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    teamData = JSON.parse(rawData);
  } catch (error) {
    console.error('❌ Error reading team data:', error);
    teamData = { lastUpdated: 'N/A', team: [], stats: {} };
  }
  
  // Read corrections count
  let correctionsCount = 0;
  try {
    const trackingData = JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf-8'));
    correctionsCount = trackingData.stats?.totalCorrections || 0;
  } catch {
    correctionsCount = 0;
  }
  
  // Calculate team stats
  let totalTasks = 0;
  let completedTasks = 0;
  let inProgressTasks = 0;
  let overdueTasks = 0;
  const teamSummary: string[] = [];
  
  for (const member of teamData.team) {
    const task = member.tasks[0];
    if (task) {
      totalTasks++;
      const daysRemaining = calculateDaysRemaining(task.deadline);
      const emoji = getStatusEmoji(task.status, daysRemaining);
      const checkInEmoji = getCheckInEmoji(task.checkIns);
      
      if (task.progress >= 100 || task.status === 'Completed') {
        completedTasks++;
      } else if (task.progress > 0) {
        inProgressTasks++;
        if (daysRemaining < 0) overdueTasks++;
      }
      
      const deadlineText = daysRemaining < 0 
        ? `${Math.abs(daysRemaining)} days OVERDUE`
        : daysRemaining === 0 
          ? 'Due TODAY'
          : `${daysRemaining} days left`;
      
      teamSummary.push(
        `👤 *${member.name}*\n` +
        `   ${emoji} ${task.title}\n` +
        `   Progress: ${task.progress}% | ${deadlineText}\n` +
        `   Check-ins: ${checkInEmoji}`
      );
    }
  }
  
  // System health
  const uptime = getSystemUptime();
  const diskUsage = getDiskUsage();
  
  // Build summary
  const summary = {
    generatedAt: now.toISOString(),
    date: todayStr,
    time: timeStr,
    
    // Quick stats
    stats: {
      teamMembers: teamData.team.length,
      totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      overdue: overdueTasks,
      corrections: correctionsCount
    },
    
    // System health
    system: {
      uptime,
      diskUsage,
      status: 'Operational'
    },
    
    // WhatsApp formatted message
    whatsappMessage: 
`🌅 *Agent(I) Daily Summary*
📅 ${todayStr} | ⏰ ${timeStr}

📊 *TEAM STATUS*
👥 Team Members: ${teamData.team.length}
📋 Active Tasks: ${totalTasks}
✅ Completed: ${completedTasks}
🔄 In Progress: ${inProgressTasks}
${overdueTasks > 0 ? `🚨 Overdue: ${overdueTasks}` : ''}

${teamSummary.length > 0 ? teamSummary.join('\n\n') : '_No active tasks_'}

💻 *SYSTEM HEALTH*
🟢 Status: Operational
⏱️ Uptime: ${uptime}
💾 Disk: ${diskUsage} used

📚 Learning: ${correctionsCount} corrections tracked
`,
    
    // Short version for quick check
    quickMessage: 
`📊 *Quick Status*
✅ Tasks: ${completedTasks}/${totalTasks} done
👥 Team: ${teamData.team.length} members
🟢 System: OK | Up ${uptime}`
  };
  
  // Save to file
  try {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(summary, null, 2));
    console.log('✅ Summary generated!\n');
    console.log('━'.repeat(50));
    console.log(summary.whatsappMessage);
    console.log('━'.repeat(50));
    console.log(`\n📁 Saved to: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('❌ Error saving summary:', error);
  }
}

// Run
generateSummary();
