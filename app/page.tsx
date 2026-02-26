"use client";

import { useState } from "react";
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
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  TrendingUp,
  Calendar,
  Activity,
} from "lucide-react";

// Real team data - Updated Feb 26, 2026
const overviewStats = {
  totalTasks: 1,
  completedTasks: 0,
  pendingTasks: 1,
  overdueTasks: 0,
};

const teamMembers = [
  {
    name: "Aromal V G",
    task: "SEO - Product Solutions",
    deadline: "Mar 1, 2026 (3 Days)",
    priority: "High",
    status: "In Progress",
    efficiency: 0,
    tasksCompleted: 0,
  },
];

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
  { week: "Week 2", efficiency: 0 },
  { week: "Week 3", efficiency: 0 },
  { week: "Week 4", efficiency: 0 },
];

const checkInStatus = {
  morning: false,
  afternoon: false,
  evening: false,
};

const recentActivity = [
  { time: "Feb 26, 2026", event: "Dashboard link sent to Aromal V G", type: "update" },
  { time: "Feb 26, 2026", event: "Task assigned: SEO - Product Solutions (High Priority)", type: "task" },
  { time: "Feb 26, 2026", event: "Daily check-ins scheduled: 9AM, 2PM, 7PM", type: "checkin" },
  { time: "Feb 26, 2026", event: "Deadline set: March 1, 2026", type: "alert" },
  { time: "Feb 26, 2026", event: "Team member Aromal V G onboarded", type: "member" },
];

export default function Dashboard() {
  const [selectedMember, setSelectedMember] = useState(teamMembers[0]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Team Performance Dashboard</h1>
        <p className="text-gray-400">Real-time task tracking and team metrics</p>
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

      {/* Section 2: Team Member Stats */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Team Member Stats
        </h2>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Member</p>
              <p className="text-lg font-semibold">{selectedMember.name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Current Task</p>
              <p className="text-lg font-semibold text-blue-400">{selectedMember.task}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Deadline</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">{selectedMember.deadline}</span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Priority</p>
              <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
                {selectedMember.priority}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-700">
            <div>
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                {selectedMember.status}
              </span>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Efficiency Score</p>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-2xl font-bold text-green-400">{selectedMember.efficiency}%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Tasks This Week</p>
              <p className="text-2xl font-bold">{selectedMember.tasksCompleted}</p>
            </div>
          </div>
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
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }}
              />
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
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }}
              />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: "#10B981", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Section 4: Daily Check-in Status */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Today's Check-in Status
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`rounded-xl p-6 border ${checkInStatus.morning ? "bg-green-500/10 border-green-500" : "bg-gray-800 border-gray-700"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Morning Check</p>
                <p className="text-lg font-semibold mt-1">9:00 AM</p>
              </div>
              {checkInStatus.morning ? (
                <CheckCircle className="w-8 h-8 text-green-400" />
              ) : (
                <Clock className="w-8 h-8 text-gray-500" />
              )}
            </div>
          </div>

          <div className={`rounded-xl p-6 border ${checkInStatus.afternoon ? "bg-green-500/10 border-green-500" : "bg-gray-800 border-gray-700"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Afternoon Check</p>
                <p className="text-lg font-semibold mt-1">2:00 PM</p>
              </div>
              {checkInStatus.afternoon ? (
                <CheckCircle className="w-8 h-8 text-green-400" />
              ) : (
                <Clock className="w-8 h-8 text-gray-500" />
              )}
            </div>
          </div>

          <div className={`rounded-xl p-6 border ${checkInStatus.evening ? "bg-green-500/10 border-green-500" : "bg-gray-800 border-gray-700"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Evening Check</p>
                <p className="text-lg font-semibold mt-1">7:00 PM</p>
              </div>
              {checkInStatus.evening ? (
                <CheckCircle className="w-8 h-8 text-green-400" />
              ) : (
                <Clock className="w-8 h-8 text-gray-500" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Recent Activity Feed */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-gray-800 rounded-xl border border-gray-700 divide-y divide-gray-700">
          {recentActivity.map((item, index) => (
            <div key={index} className="p-4 flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${
                item.type === "update" ? "bg-blue-400" :
                item.type === "checkin" ? "bg-green-400" :
                item.type === "task" ? "bg-purple-400" :
                item.type === "alert" ? "bg-red-400" : "bg-gray-400"
              }`} />
              <div className="flex-1">
                <p className="text-white">{item.event}</p>
                <p className="text-gray-500 text-sm">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-500 text-sm">
        <p>Team Dashboard • Last updated: {new Date().toLocaleString()}</p>
      </footer>
    </div>
  );
}
