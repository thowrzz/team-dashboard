"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
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
} from "recharts";

// Team members data
const teamMembers = [
  {
    id: 1,
    name: "Aromal V G",
    phone: "+918281783052",
    email: "aromalvijayan448@gmail.com",
    avatar: "/team-dashboard/aromal.jpg",
    role: "SEO Specialist",
    task: "SEO - Product Solutions",
    deadline: "March 1, 2026",
    daysRemaining: 3,
    priority: "High",
    status: "In Progress",
    progress: 25,
    efficiency: 0,
    tasksCompleted: 0,
    tasksThisWeek: 1,
    checkIns: {
      morning: false,
      afternoon: false,
      evening: false,
    },
    lastActive: "2026-02-26T23:30:00+05:30",
  },
];

// Overview stats
const getOverviewStats = () => ({
  totalTasks: teamMembers.length,
  completedTasks: teamMembers.filter(m => m.progress === 100).length,
  pendingTasks: teamMembers.filter(m => m.progress < 100 && m.progress > 0).length,
  overdueTasks: teamMembers.filter(m => m.daysRemaining <= 0 && m.progress < 100).length,
});

// Daily completion
const dailyCompletion = [
  { day: "Mon", completed: 0 },
  { day: "Tue", completed: 0 },
  { day: "Wed", completed: 0 },
  { day: "Thu", completed: 0 },
  { day: "Fri", completed: 0 },
  { day: "Sat", completed: 0 },
  { day: "Sun", completed: 0 },
];

const weeklyEfficiency = [
  { week: "Week 1", efficiency: 0 },
];

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

const getRecentActivity = () => {
  const now = new Date();
  return [
    { timestamp: now.toISOString(), event: "Dashboard deployed and shared with team", type: "update" },
    { timestamp: new Date(now.getTime() - 11 * 60 * 60 * 1000).toISOString(), event: "Task assigned to Aromal: SEO - Product Solutions", type: "task" },
    { timestamp: new Date(now.getTime() - 11.5 * 60 * 60 * 1000).toISOString(), event: "Aromal V G added to team", type: "member" },
    { timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(), event: "Team management system initialized", type: "system" },
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
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Team Performance Dashboard</h1>
            <p className="text-gray-400">Real-time task tracking and team metrics</p>
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

      {/* Section 1: Overview Cards */}
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
            <span className="text-gray-400">Pending</span>
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
            <Link key={member.id} href={`/team/${member.id}`} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors">
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
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Daily Task Completion</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyCompletion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }} />
              <Bar dataKey="completed" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Weekly Efficiency Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyEfficiency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }} />
              <Line type="monotone" dataKey="efficiency" stroke="#10B981" strokeWidth={3} dot={{ fill: "#10B981", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Section 4: Recent Activity */}
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
      <footer className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-500 text-sm">
        <p>Team Dashboard • Last updated: {lastUpdated.toLocaleString('en-IN', { timeZone: 'Asia/Calcutta' })}</p>
        <p className="mt-1">Auto-updates daily at 12:30 PM IST</p>
      </footer>
    </div>
  );
}
