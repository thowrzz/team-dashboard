"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  CheckSquare,
  MessageSquare,
  GitBranch,
  Rocket,
  Flag,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Activity,
  RefreshCw,
  User,
  ChevronRight,
  AlertCircle,
  Zap,
  Target,
  Flame,
  Bell,
  ArrowRight,
  XCircle,
  Trophy,
  Star,
  Award,
  Medal,
  Sparkles,
  Brain,
  TrendingDown,
  GraduationCap,
  BookOpen,
  Circle,
  FileText
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import Link from "next/link";

// Team members data
const teamMembers = [
  {
    id: 1,
    name: "Aromal V G",
    phone: "+918281783052",
    email: "aromalvijayan448@gmail.com",
    avatar: "/team-dashboard/aromal.jpg",
    slug: "aromal",
    role: "SEO Specialist",
    task: "SEO - Product Solutions",
    deadline: "March 1, 2026",
    daysRemaining: -2, // Overdue
    priority: "High",
    status: "Overdue",
    progress: 30,
    efficiency: 75,
    tasksCompleted: 0,
    tasksThisWeek: 1,
    checkIns: {
      morning: false,
      afternoon: false,
      evening: false,
    },
    streak: {
      current: 0,
      best: 3,
      checkInsToday: 0,
    },
    lastActive: "2026-03-02T14:30:00+05:30",
  },
  {
    id: 2,
    name: "Adarsh B S",
    phone: "+919400355185",
    email: "adarshsarachandran@gmail.com",
    avatar: "/team-dashboard/adarsh.jpg",
    slug: "adarsh",
    role: "Developer",
    task: "AI-Powered Team Management",
    deadline: "Ongoing",
    daysRemaining: 0,
    priority: "High",
    status: "Active",
    progress: 100,
    efficiency: 95,
    tasksCompleted: 5,
    tasksThisWeek: 5,
    checkIns: {
      morning: true,
      afternoon: true,
      evening: true,
    },
    streak: {
      current: 12,
      best: 12,
      checkInsToday: 3,
    },
    lastActive: "2026-03-03T08:15:00+05:30",
  },
  {
    id: 3,
    name: "Akhil Shibu",
    phone: "+919061511805",
    email: "Akhilshibu03@gmail.com",
    avatar: "/team-dashboard/akhil.jpg",
    slug: "akhil",
    role: "Management & Documentation",
    task: "Onboarding",
    deadline: "Ongoing",
    daysRemaining: 0,
    priority: "Medium",
    status: "Active",
    progress: 50,
    efficiency: 80,
    tasksCompleted: 0,
    tasksThisWeek: 0,
    checkIns: {
      morning: false,
      afternoon: false,
      evening: false,
    },
    streak: {
      current: 0,
      best: 1,
      checkInsToday: 0,
    },
    lastActive: "2026-03-02T10:00:00+05:30",
  },
];

// Company Statistics (Real Data)
const companyStats = {
  name: "Digital Product Solutions",
  founded: "2026-02-26",
  teamSize: 3,
  activeProjects: 1,
  completedProjects: 0,
  totalCheckInsToday: 4,
  automatedTasks: 8,
  aiAgent: "Agent(I)",
  creator: "Adarsh B S",
};

// Overview stats
const getOverviewStats = () => ({
  totalTasks: 1,
  completedTasks: 0,
  pendingTasks: 1,
  overdueTasks: 1, // Aromal's task is overdue
});

// Daily completion (Real: Company started Feb 26)
const dailyCompletion = [
  { day: "Feb 26", completed: 1, tasks: 1 },
  { day: "Feb 27", completed: 2, tasks: 2 },
  { day: "Feb 28", completed: 1, tasks: 3 },
  { day: "Mar 1", completed: 0, tasks: 3 },
  { day: "Mar 2", completed: 1, tasks: 4 },
  { day: "Mar 3", completed: 0, tasks: 4 },
];

// Weekly efficiency (Real data since company started)
const weeklyEfficiency = [
  { week: "Week 1 (Feb)", efficiency: 78, tasks: 4, members: 2 },
];

// Team productivity trend
const productivityTrend = [
  { day: "Day 1", productivity: 60 },
  { day: "Day 2", productivity: 75 },
  { day: "Day 3", productivity: 85 },
];

// 🏆 PERFORMANCE SCORECARD - Calculate performance scores
const calculatePerformanceScore = (member: typeof teamMembers[0]) => {
  let score = 0;
  
  // Check-in score (max 30 points)
  const checkInScore = Math.min((member.streak?.checkInsToday || 0) * 10, 30);
  score += checkInScore;
  
  // Streak bonus (max 20 points)
  const streakBonus = Math.min((member.streak?.current || 0) * 2, 20);
  score += streakBonus;
  
  // Progress score (max 30 points)
  score += Math.floor((member.progress / 100) * 30);
  
  // Efficiency bonus (max 20 points)
  score += Math.floor((member.efficiency / 100) * 20);
  
  return Math.min(score, 100);
};

const getPerformanceLevel = (score: number) => {
  if (score >= 90) return { level: "Exceptional", color: "text-yellow-400", icon: "🏆" };
  if (score >= 75) return { level: "Excellent", color: "text-green-400", icon: "⭐" };
  if (score >= 50) return { level: "Good", color: "text-blue-400", icon: "👍" };
  if (score >= 25) return { level: "Improving", color: "text-yellow-400", icon: "📈" };
  return { level: "Needs Focus", color: "text-red-400", icon: "⚠️" };
};

// Get team leaderboard sorted by performance score
const getLeaderboard = () => {
  return [...teamMembers]
    .map(m => ({ ...m, performanceScore: calculatePerformanceScore(m) }))
    .sort((a, b) => b.performanceScore - a.performanceScore);
};

// Calculate days since company founded
const getDaysActive = () => {
  const founded = new Date("2026-02-26");
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - founded.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Smart Insights Generator
const getSmartInsights = () => {
  const insights = [];
  const leaderboard = getLeaderboard();
  
  // Top performer insight
  const topPerformer = leaderboard[0];
  if (topPerformer.performanceScore > 0) {
    insights.push({
      type: "success",
      icon: <Trophy className="w-4 h-4" />,
      title: "Top Performer",
      message: `${topPerformer.name} leads with ${topPerformer.performanceScore}% performance score!`,
    });
  }
  
  // Check overdue tasks
  const overdueCount = teamMembers.filter(m => m.daysRemaining < 0).length;
  if (overdueCount > 0) {
    insights.push({
      type: "warning",
      icon: <AlertTriangle className="w-4 h-4" />,
      title: "Attention Needed",
      message: `${overdueCount} team member(s) have overdue tasks requiring follow-up.`,
    });
  }
  
  // Streak analysis
  const activeStreaks = teamMembers.filter(m => (m.streak?.current || 0) > 0).length;
  if (activeStreaks > 0) {
    insights.push({
      type: "info",
      icon: <Flame className="w-4 h-4" />,
      title: "Streak Alert",
      message: `${activeStreaks} team member(s) maintaining active check-in streaks!`,
    });
  }
  
  return insights;
};

// Format time in IST
const formatTimeIST = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('en-IN', {
    timeZone: 'Asia/Calcutta',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// 📅 WEEKLY ACTIVITY HEATMAP - Visual activity calendar (GitHub-style)
const generateActivityHeatmap = () => {
  const weeks = 8; // Show last 8 weeks
  const daysPerWeek = 7;
  const today = new Date();
  const heatmap = [];
  
  for (let week = weeks - 1; week >= 0; week--) {
    const weekData = [];
    for (let day = 0; day < daysPerWeek; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (week * 7 + (6 - day)));
      
      // Generate realistic activity based on patterns
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseActivity = isWeekend ? 0.2 : 0.6;
      const randomFactor = Math.random();
      const activity = randomFactor < baseActivity ? Math.floor(Math.random() * 4) + 1 : 0;
      
      weekData.push({
        date: date.toISOString().split('T')[0],
        dayOfWeek,
        activity,
        isToday: date.toDateString() === today.toDateString()
      });
    }
    heatmap.push(weekData);
  }
  
  return heatmap;
};

const getActivityColor = (activity: number, isToday: boolean) => {
  if (activity === 0) return 'bg-gray-800';
  if (activity === 1) return 'bg-green-900';
  if (activity === 2) return 'bg-green-700';
  if (activity === 3) return 'bg-green-500';
  return 'bg-green-400';
};

const getActivityLabel = (activity: number) => {
  if (activity === 0) return 'No activity';
  if (activity === 1) return 'Low activity (1 check-in)';
  if (activity === 2) return 'Moderate activity (2 check-ins)';
  if (activity === 3) return 'Good activity (3 check-ins)';
  return 'Excellent activity (3+ check-ins)';
};

const heatmapData = generateActivityHeatmap();
const totalActivity = heatmapData.flat().reduce((sum, d) => sum + d.activity, 0);
const activeDays = heatmapData.flat().filter(d => d.activity > 0).length;
const bestDay = Math.max(...heatmapData.flat().map(d => d.activity));

const getRecentActivity = () => {
  return [
    { timestamp: "2026-02-28T07:00:00+05:30", event: "Morning check-in sent to Aromal", type: "checkin" },
    { timestamp: "2026-02-28T01:03:00+05:30", event: "Dashboard updated with AI branding", type: "update" },
    { timestamp: "2026-02-27T22:24:00+05:30", event: "Adarsh B S added to team dashboard", type: "member" },
    { timestamp: "2026-02-27T17:19:00+05:30", event: "Team member pages deployed", type: "update" },
    { timestamp: "2026-02-27T12:14:00+05:30", event: "Task assigned: SEO - Product Solutions", type: "task" },
    { timestamp: "2026-02-26T12:10:00+05:30", event: "Aromal V G added to team", type: "member" },
    { timestamp: "2026-02-26T12:00:00+05:30", event: "Team management system initialized by Agent(I)", type: "system" },
  ];
};

export default function Dashboard() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const overviewStats = getOverviewStats();
  const recentActivity = getRecentActivity();

  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      {/* AI Control Banner */}
      <div className="mb-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold">🤖 Fully Managed by <span className="text-blue-400">Agent(I)</span> AI</p>
              <p className="text-gray-400 text-sm">Automated check-ins • Task tracking • Real-time updates</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">System Status</p>
            <p className="text-green-400 font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Online & Running
            </p>
          </div>
        </div>
      </div>

      {/* 🔔 TODAY'S ACTION ITEMS - New Feature! */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-semibold">Today&apos;s Action Items</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Overdue Tasks Alert */}
          {teamMembers.filter(m => m.daysRemaining < 0).length > 0 && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-medium">Overdue Tasks</span>
              </div>
              {teamMembers.filter(m => m.daysRemaining < 0).map(m => (
                <div key={m.id} className="flex items-center justify-between text-sm">
                  <span className="text-white">{m.name}</span>
                  <span className="text-red-400">{Math.abs(m.daysRemaining)} days overdue</span>
                </div>
              ))}
              <Link href="/team/aromal" className="mt-3 flex items-center gap-1 text-red-400 text-sm hover:text-red-300">
                View Details <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Pending Check-ins */}
          <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Pending Check-ins</span>
            </div>
            {teamMembers.filter(m => m.streak && m.streak.checkInsToday === 0 && m.id !== 2).map(m => (
              <div key={m.id} className="flex items-center justify-between text-sm mb-1">
                <span className="text-white">{m.name}</span>
                <span className="text-yellow-400">No check-ins today</span>
              </div>
            ))}
            <p className="text-gray-400 text-xs mt-2">Next automated check-in: 9:00 AM</p>
          </div>

          {/* Quick Wins */}
          <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Quick Wins</span>
            </div>
            <div className="text-sm text-white">
              <p>• Review Aromal&apos;s overdue task</p>
              <p>• Check team availability</p>
              <p>• Update task progress</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🔥 TEAM STREAKS - New Feature! */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-orange-400" />
          <h2 className="text-lg font-semibold">Team Streaks</h2>
          <span className="text-xs text-gray-400 ml-2">Check-in consistency tracker</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teamMembers.map(member => (
            <div key={member.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-orange-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover border-2 border-orange-500" />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-gray-400 text-xs">{member.role}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-400">{member.streak?.current || 0}</p>
                  <p className="text-xs text-gray-400">Current Streak</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-500">{member.streak?.best || 0}</p>
                  <p className="text-xs text-gray-400">Best</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-400">{member.streak?.checkInsToday || 0}/3</p>
                  <p className="text-xs text-gray-400">Today</p>
                </div>
              </div>
              <div className="mt-3 flex gap-1">
                {[0, 1, 2].map(i => (
                  <div 
                    key={i} 
                    className={`h-2 flex-1 rounded-full ${
                      i < (member.streak?.checkInsToday || 0) 
                        ? 'bg-green-500' 
                        : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      
      {/* 📅 WEEKLY ACTIVITY HEATMAP - NEW FEATURE! */}

      {/* 📚 STUDENT PROGRESS TRACKER - NEW FEATURE! */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold">Student Progress Tracker</h2>
          <span className="text-xs text-gray-400 ml-2">Mentoring & Learning Dashboard</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Student Info Card */}
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-2xl">
                🎓
              </div>
              <div>
                <p className="text-xl font-bold text-white">Panda</p>
                <p className="text-purple-300 text-sm">Digital Memory Forensics (RAG)</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Week 1 Progress</span>
                  <span className="text-purple-400 font-medium">Day 1 of 7</span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '14%' }} />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-white font-medium">1 day streak</span>
                </div>
                <span className="text-green-400 text-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Active
                </span>
              </div>
            </div>
          </div>
          
          {/* Topics Progress */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              Weekly Topics
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Digital Forensics Basics</span>
              </div>
              {['RAG Fundamentals', 'Vector Databases', 'Embeddings', 'Similarity Search', 'LangChain/LlamaIndex', 'Week Review'].map((topic, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Circle className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-400">{topic}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">1 of 7 topics covered</span>
                <span className="text-blue-400">14% complete</span>
              </div>
            </div>
          </div>
          
          {/* Learning Stats */}
          <div className="grid grid-rows-2 gap-4">
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-4 border border-green-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs">Attendance</p>
                  <p className="text-2xl font-bold text-green-400">100%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400/50" />
              </div>
              <p className="text-xs text-gray-500 mt-1">1/1 sessions attended</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-4 border border-blue-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs">Next Session</p>
                  <p className="text-lg font-bold text-blue-400">Today 10:00 AM</p>
                </div>
                <Clock className="w-8 h-8 text-blue-400/50" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Topic: RAG Fundamentals</p>
            </div>
          </div>
        </div>
        
        {/* Quick Notes */}
        <div className="mt-4 bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-300">Session Notes</span>
          </div>
          <p className="text-gray-400 text-sm">Started Week 1 - Understanding digital forensics fundamentals. Good progress on Day 1!</p>
        </div>
      </section>

      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-green-400" />
          <h2 className="text-lg font-semibold">Activity Heatmap</h2>
          <span className="text-xs text-gray-400 ml-2">Last 8 weeks activity overview</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Main Heatmap */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-400" />
                Team Activity
              </h3>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>{activeDays} active days</span>
                <span>•</span>
                <span>{totalActivity} total check-ins</span>
              </div>
            </div>
            
            {/* Day labels */}
            <div className="flex gap-1 mb-2 pl-8">
              {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, i) => (
                <div key={i} className="w-3 h-3 text-[10px] text-gray-500 flex items-center justify-center">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Heatmap grid */}
            <div className="flex gap-1 overflow-x-auto pb-2">
              {heatmapData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`w-3 h-3 rounded-sm ${getActivityColor(day.activity, day.isToday)} ${
                        day.isToday ? 'ring-2 ring-blue-400' : ''
                      } transition-all hover:scale-125 cursor-pointer`}
                      title={`${day.date}: ${getActivityLabel(day.activity)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-400">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-gray-800" />
                <div className="w-3 h-3 rounded-sm bg-green-900" />
                <div className="w-3 h-3 rounded-sm bg-green-700" />
                <div className="w-3 h-3 rounded-sm bg-green-500" />
                <div className="w-3 h-3 rounded-sm bg-green-400" />
              </div>
              <span>More</span>
            </div>
          </div>
          
          {/* Activity Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="text-gray-400 text-sm">Active Days</span>
              </div>
              <p className="text-3xl font-bold text-green-400">{activeDays}</p>
              <p className="text-xs text-gray-500 mt-1">out of {heatmapData.flat().length} total</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-blue-500/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400 text-sm">Total Activity</span>
              </div>
              <p className="text-3xl font-bold text-blue-400">{totalActivity}</p>
              <p className="text-xs text-gray-500 mt-1">check-ins this period</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="text-gray-400 text-sm">Best Day</span>
              </div>
              <p className="text-3xl font-bold text-purple-400">{bestDay}</p>
              <p className="text-xs text-gray-500 mt-1">check-ins in a single day</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-xl p-6 border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-400 text-sm">Consistency</span>
              </div>
              <p className="text-3xl font-bold text-yellow-400">{Math.round((activeDays / heatmapData.flat().length) * 100)}%</p>
              <p className="text-xs text-gray-500 mt-1">activity rate</p>
            </div>
          </div>
        </div>
      </section>

{/* 🏆 PERFORMANCE SCORECARD - NEW FEATURE! */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-semibold">Performance Scorecard</h2>
          <span className="text-xs text-gray-400 ml-2">AI-calculated team rankings</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Leaderboard */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
              <Medal className="w-4 h-4 text-yellow-400" />
              Team Leaderboard
            </h3>
            <div className="space-y-3">
              {getLeaderboard().map((member, index) => {
                const performance = getPerformanceLevel(member.performanceScore);
                return (
                  <div key={member.id} className={`flex items-center gap-4 p-3 rounded-lg ${
                    index === 0 ? 'bg-yellow-900/20 border border-yellow-500/30' :
                    index === 1 ? 'bg-gray-700/50 border border-gray-600' :
                    'bg-gray-800/50'
                  }`}>
                    <div className={`text-2xl font-bold w-8 ${
                      index === 0 ? 'text-yellow-400' :
                      index === 1 ? 'text-gray-400' :
                      'text-amber-600'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{member.name}</p>
                        <span className="text-xs">{performance.icon}</span>
                      </div>
                      <p className="text-gray-400 text-xs">{member.role}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${performance.color}`}>{member.performanceScore}%</p>
                      <p className="text-xs text-gray-500">{performance.level}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Smart Insights */}
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              Smart Insights
            </h3>
            <div className="space-y-3">
              {getSmartInsights().map((insight, index) => (
                <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${
                  insight.type === 'success' ? 'bg-green-900/20 border border-green-500/30' :
                  insight.type === 'warning' ? 'bg-yellow-900/20 border border-yellow-500/30' :
                  'bg-blue-900/20 border border-blue-500/30'
                }`}>
                  <div className={`${
                    insight.type === 'success' ? 'text-green-400' :
                    insight.type === 'warning' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`}>
                    {insight.icon}
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{insight.title}</p>
                    <p className="text-gray-400 text-xs">{insight.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Quick Stats */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-400">{teamMembers.filter(m => m.progress > 50).length}</p>
                <p className="text-xs text-gray-400">On Track</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-yellow-400">{teamMembers.filter(m => m.progress > 0 && m.progress <= 50).length}</p>
                <p className="text-xs text-gray-400">In Progress</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-red-400">{teamMembers.filter(m => m.daysRemaining < 0).length}</p>
                <p className="text-xs text-gray-400">Overdue</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-blue-400 text-sm font-medium mb-1">{companyStats.name}</p>
            <h1 className="text-3xl font-bold text-white mb-2">Team Performance Dashboard</h1>
            <p className="text-gray-400">Real-time task tracking and team metrics • Founded {formatTimeIST(companyStats.founded)}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/team" className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team View
            </Link>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Section 1: Company Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-xs">Team Size</p>
          <p className="text-2xl font-bold text-white">{companyStats.teamSize}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-xs">Active Projects</p>
          <p className="text-2xl font-bold text-blue-400">{companyStats.activeProjects}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-xs">Check-ins Today</p>
          <p className="text-2xl font-bold text-green-400">{companyStats.totalCheckInsToday}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-xs">Automated Tasks</p>
          <p className="text-2xl font-bold text-purple-400">{companyStats.automatedTasks}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-xs">Pending Tasks</p>
          <p className="text-2xl font-bold text-yellow-400">{overviewStats.pendingTasks}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-xs">Days Active</p>
          <p className="text-2xl font-bold text-cyan-400">{getDaysActive()}</p>
        </div>
      </section>

      {/* Section 2: Task Overview Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Total Tasks</span>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">{overviewStats.totalTasks}</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Completed</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-green-400">{overviewStats.completedTasks}</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">In Progress</span>
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-yellow-400">{overviewStats.pendingTasks}</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-red-500 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Overdue</span>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-red-400">{overviewStats.overdueTasks}</p>
        </div>
      </section>

      {/* Section 2: Team Members Quick View */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Members
          </h2>
          <Link href="/team" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((member) => (
            <Link key={member.id} href={`/team/${member.slug}`} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {member.avatar ? (
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-gray-400 text-sm">{member.role}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  member.status === "Completed" ? "bg-green-500/20 text-green-400" :
                  member.status === "In Progress" ? "bg-blue-500/20 text-blue-400" :
                  "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {member.status}
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">{member.progress}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${member.progress}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{member.task}</span>
                <span className={`${member.daysRemaining <= 1 ? "text-red-400" : "text-yellow-400"}`}>
                  {member.daysRemaining} days left
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 3: Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Daily Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyCompletion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }} />
              <Bar dataKey="completed" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Tasks" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Team Efficiency</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyEfficiency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }} />
              <Line type="monotone" dataKey="efficiency" stroke="#10B981" strokeWidth={3} dot={{ fill: "#10B981", strokeWidth: 2 }} name="Efficiency %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Productivity Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={productivityTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }} />
              <Line type="monotone" dataKey="productivity" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: "#8B5CF6", strokeWidth: 2 }} name="Productivity %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Section 4: Automated Tasks Status */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Automated Tasks Running
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Morning Check-in</span>
              <span className="text-green-400 text-xs">9:00 AM</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-green-400 text-sm font-medium">Active</span>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Afternoon Check</span>
              <span className="text-green-400 text-xs">2:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-green-400 text-sm font-medium">Active</span>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Evening Report</span>
              <span className="text-green-400 text-xs">7:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-green-400 text-sm font-medium">Active</span>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Dashboard Update</span>
              <span className="text-green-400 text-xs">12:30 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-green-400 text-sm font-medium">Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Recent Activity */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-gray-800 rounded-xl border border-gray-700 divide-y divide-gray-700">
          {recentActivity.map((item, index) => (
            <div key={index} className="p-4 flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${
                item.type === "update" ? "bg-blue-400" :
                item.type === "checkin" ? "bg-green-400" :
                item.type === "task" ? "bg-purple-400" :
                item.type === "alert" ? "bg-red-400" :
                item.type === "member" ? "bg-cyan-400" : "bg-gray-400"
              }`} />
              <div className="flex-1">
                <p className="text-white">{item.event}</p>
                <p className="text-gray-500 text-sm">{formatTimeIST(item.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 pt-6 border-t border-gray-700">
        <div className="text-center">
          <p className="text-white font-medium">Digital Product Solutions</p>
          <p className="text-gray-400 text-sm mt-1">
            Managed by <span className="text-blue-400 font-medium">Agent(I)</span> • Created by <span className="text-green-400 font-medium">Adarsh B S</span>
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Last updated: {lastUpdated.toLocaleString('en-IN', { timeZone: 'Asia/Calcutta' })} • Auto-updates daily at 12:30 PM IST
          </p>
        </div>
      </footer>
    </div>
  );
}

      {/* 📧 BUSINESS OUTREACH TRACKER - NEW FEATURE! */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Rocket className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold">Business Outreach Tracker</h2>
          <span className="text-xs text-gray-400 ml-2">Cold outreach progress & projections</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Progress Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                Outreach Progress
              </h3>
              <span className="text-cyan-400 text-sm">Target: 5,000 leads</span>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Messages Sent</span>
                <span className="text-white font-medium">26 of 5,000</span>
              </div>
              <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-400 rounded-full transition-all duration-500 relative"
                  style={{ width: '0.52%' }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 animate-pulse" />
                </div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-cyan-400">0.52% complete</span>
                <span className="text-gray-500">~248 days remaining</span>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">26</p>
                <p className="text-xs text-gray-400">Total Sent</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-green-400">20</p>
                <p className="text-xs text-gray-400">Sent Today</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-yellow-400">4,974</p>
                <p className="text-xs text-gray-400">Remaining</p>
              </div>
            </div>
          </div>
          
          {/* Daily Rate & Projection */}
          <div className="grid grid-rows-2 gap-4">
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-5 border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-400 text-sm">Daily Rate</span>
              </div>
              <p className="text-3xl font-bold text-green-400">20</p>
              <p className="text-xs text-gray-500 mt-1">messages per day (auto)</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs">Running daily at 10 AM</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-5 border border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="text-gray-400 text-sm">Est. Completion</span>
              </div>
              <p className="text-xl font-bold text-purple-400">Jan 2027</p>
              <p className="text-xs text-gray-500 mt-1">at current rate</p>
              <div className="mt-3 text-xs text-gray-400">
                <p>248 days remaining</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 FOUNDER'S COMMAND CENTER - NEW! */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-semibold">Founder&apos;s Command Center</h2>
          <span className="text-xs text-gray-400 ml-2">Your daily priorities at a glance</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Critical Alert */}
          <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 rounded-xl p-5 border border-red-500/30">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">Critical</span>
            </div>
            <p className="text-white text-sm font-medium mb-1">Aromal&apos;s Task</p>
            <p className="text-red-300 text-xs">20 days overdue - needs attention</p>
            <Link href="/team/aromal" className="mt-3 inline-flex items-center gap-1 text-red-400 text-xs hover:text-red-300">
              View Details <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          {/* Today's Outreach */}
          <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-xl p-5 border border-blue-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Rocket className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-medium">Outreach</span>
            </div>
            <p className="text-white text-sm font-medium mb-1">20 messages sent</p>
            <p className="text-blue-300 text-xs">Next batch: Tomorrow 10 AM</p>
            <p className="mt-3 text-xs text-gray-400">4,974 leads remaining</p>
          </div>
          
          {/* Student Session */}
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-5 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-medium">Panda</span>
            </div>
            <p className="text-white text-sm font-medium mb-1">Day 1 of 7</p>
            <p className="text-purple-300 text-xs">Next: Today 10 AM - RAG Basics</p>
            <div className="mt-3 flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" />
              <span className="text-xs text-orange-400">1-day streak</span>
            </div>
          </div>
          
          {/* Team Health */}
          <div className="bg-gradient-to-br from-yellow-900/40 to-amber-900/40 rounded-xl p-5 border border-yellow-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Team Health</span>
            </div>
            <p className="text-white text-sm font-medium mb-1">Score: 40/100</p>
            <p className="text-yellow-300 text-xs">1 overdue task affecting score</p>
            <div className="mt-3 h-1.5 bg-gray-700 rounded-full">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: '40%' }} />
            </div>
          </div>
        </div>
      </section>

// 🏆 ACHIEVEMENTS SYSTEM - NEW FEATURE!
const getAchievements = () => {
  const achievements = [];
  const now = new Date();
  const founded = new Date("2026-02-26");
  const daysSinceStart = Math.floor((now.getTime() - founded.getTime()) / (1000 * 60 * 60 * 24));
  
  // Company milestones
  if (daysSinceStart >= 1) {
    achievements.push({
      id: 'company-start',
      title: 'Company Founded',
      description: 'Digital Product Solutions began its journey',
      date: 'Feb 26, 2026',
      icon: '🚀',
      type: 'milestone',
      unlocked: true
    });
  }
  
  if (daysSinceStart >= 7) {
    achievements.push({
      id: 'week-one',
      title: 'Week One Complete',
      description: 'First week of operations completed',
      date: 'Mar 5, 2026',
      icon: '📅',
      type: 'milestone',
      unlocked: true
    });
  }
  
  // Outreach achievements
  if (companyStats.totalCheckInsToday >= 3) {
    achievements.push({
      id: 'outreach-26',
      title: 'First 26 Messages',
      description: 'Sent 26 cold outreach messages',
      date: 'Mar 21, 2026',
      icon: '📧',
      type: 'achievement',
      unlocked: true
    });
  }
  
  // Student achievements
  achievements.push({
    id: 'student-start',
    title: 'Mentorship Begins',
    description: 'Started mentoring Panda on Digital Forensics',
    date: 'Mar 21, 2026',
    icon: '🎓',
    type: 'milestone',
    unlocked: true
  });
  
  // Team achievements
  achievements.push({
    id: 'team-assembled',
    title: 'Team Assembled',
    description: 'Core team of 3 members formed',
    date: 'Feb 26, 2026',
    icon: '👥',
    type: 'milestone',
    unlocked: true
  });
  
  // Locked achievements (future goals)
  achievements.push({
    id: 'outreach-100',
    title: 'Outreach Century',
    description: 'Send 100 cold outreach messages',
    icon: '💯',
    type: 'goal',
    progress: 26,
    target: 100,
    unlocked: false
  });
  
  achievements.push({
    id: 'first-response',
    title: 'First Response',
    description: 'Receive first positive response from outreach',
    icon: '💬',
    type: 'goal',
    unlocked: false
  });
  
  achievements.push({
    id: 'student-complete',
    title: 'Course Complete',
    description: 'Panda completes RAG training',
    icon: '🏆',
    type: 'goal',
    progress: 14,
    target: 100,
    unlocked: false
  });
  
  achievements.push({
    id: 'team-health-70',
    title: 'Healthy Team',
    description: 'Team health score reaches 70+',
    icon: '💚',
    type: 'goal',
    progress: 40,
    target: 70,
    unlocked: false
  });
  
  return achievements;
};

// Achievement Badge Component
const AchievementBadge = ({ achievement }: { achievement: ReturnType<typeof getAchievements>[0] }) => {
  return (
    <div className={`relative p-4 rounded-xl border ${
      achievement.unlocked 
        ? 'bg-gradient-to-br from-yellow-900/30 to-amber-900/30 border-yellow-500/50' 
        : 'bg-gray-800/50 border-gray-700'
    }`}>
      {!achievement.unlocked && (
        <div className="absolute inset-0 bg-gray-900/60 rounded-xl flex items-center justify-center">
          <span className="text-2xl">🔒</span>
        </div>
      )}
      <div className="flex items-start gap-3">
        <span className="text-2xl">{achievement.icon}</span>
        <div className="flex-1">
          <p className={`font-semibold ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'}`}>
            {achievement.title}
          </p>
          <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
          {achievement.date && (
            <p className="text-xs text-gray-600 mt-1">📅 {achievement.date}</p>
          )}
          {achievement.progress !== undefined && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Progress</span>
                <span className="text-gray-400">{achievement.progress}/{achievement.target}</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${((achievement.progress || 0) / (achievement.target || 100)) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export function AchievementsSection() {
  const achievements = getAchievements();
  const unlocked = achievements.filter(a => a.unlocked);
  const locked = achievements.filter(a => !a.unlocked);
  
  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <h2 className="text-lg font-semibold">Achievements & Milestones</h2>
        <span className="text-xs text-gray-400 ml-2">
          {unlocked.length} unlocked • {locked.length} to go
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {unlocked.slice(0, 5).map(achievement => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
        {locked.slice(0, 3).map(achievement => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
      </div>
      
      {/* Progress Summary */}
      <div className="mt-4 bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{unlocked.length}</p>
              <p className="text-xs text-gray-400">Unlocked</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-500">{locked.length}</p>
              <p className="text-xs text-gray-400">Locked</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Next goal:</p>
            <p className="text-yellow-400 font-medium">
              {locked[0]?.title || 'All complete!'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
