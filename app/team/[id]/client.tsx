"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  Activity,
  FileText,
  MessageSquare,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const getMemberData = (id: number) => {
  const members: Record<number, any> = {
    1: {
      id: 1,
      name: "Aromal V G",
      phone: "+918281783052",
      email: "aromalvijayan448@gmail.com",
      avatar: "/team-dashboard/aromal.jpg",
      role: "SEO Specialist",
      joinedDate: "2026-02-26",
      tasks: [
        {
          id: 1,
          title: "SEO - Product Solutions",
          deadline: "March 1, 2026",
          daysRemaining: 3,
          priority: "High",
          status: "In Progress",
          progress: 25,
          description: "Optimize product pages for search engines",
        },
      ],
      checkIns: {
        morning: { time: "9:00 AM", status: false },
        afternoon: { time: "2:00 PM", status: false },
        evening: { time: "7:00 PM", status: false },
      },
      activityLog: [
        { timestamp: "2026-02-27T19:30:00+05:30", event: "Profile updated with photo and email", type: "update" },
        { timestamp: "2026-02-26T23:30:00+05:30", event: "Dashboard link sent", type: "update" },
        { timestamp: "2026-02-26T12:14:00+05:30", event: "Task assigned: SEO - Product Solutions", type: "task" },
        { timestamp: "2026-02-26T12:10:00+05:30", event: "Added to team", type: "member" },
      ],
      stats: {
        totalTasks: 1,
        completedTasks: 0,
        inProgress: 1,
        efficiency: 0,
      },
    },
    2: {
      id: 2,
      name: "Adarsh B S",
      phone: "+919400355185",
      email: "adarshsarachandran@gmail.com",
      avatar: null,
      role: "Manager",
      joinedDate: "2026-01-01",
      tasks: [
        {
          id: 1,
          title: "Team Management",
          deadline: "Ongoing",
          daysRemaining: 0,
          priority: "High",
          status: "Active",
          progress: 100,
          description: "Manage team members and track progress",
        },
      ],
      checkIns: {
        morning: { time: "9:00 AM", status: true },
        afternoon: { time: "2:00 PM", status: true },
        evening: { time: "7:00 PM", status: true },
      },
      activityLog: [
        { timestamp: "2026-02-27T19:35:00+05:30", event: "Added to team dashboard", type: "member" },
        { timestamp: "2026-02-26T12:00:00+05:30", event: "Team management system created", type: "system" },
      ],
      stats: {
        totalTasks: 5,
        completedTasks: 12,
        inProgress: 1,
        efficiency: 95,
      },
    },
  };
  return members[id] || null;
};

const dailyProgress = [
  { day: "Mon", hours: 0 },
  { day: "Tue", hours: 0 },
  { day: "Wed", hours: 0 },
  { day: "Thu", hours: 0 },
  { day: "Fri", hours: 0 },
  { day: "Sat", hours: 0 },
  { day: "Sun", hours: 0 },
];

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

export default function MemberClient({ memberId }: { memberId: number }) {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const member = getMemberData(memberId);

  useEffect(() => {
    setLastUpdated(new Date());
  }, [memberId]);

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <p>Member not found</p>
        <Link href="/team" className="text-blue-400 hover:underline">Back to Team</Link>
      </div>
    );
  }

  const currentTask = member.tasks[0];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/team" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">{member.name}</h1>
            <p className="text-gray-400">{member.role}</p>
          </div>
        </div>
      </header>

      {/* Member Info Card */}
      <section className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {member.avatar ? (
            <img 
              src={member.avatar} 
              alt={member.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 flex-shrink-0"
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-white" />
            </div>
          )}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Phone className="w-4 h-4" />
              <span>{member.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Mail className="w-4 h-4" />
              <span>{member.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Joined {formatTimeIST(member.joinedDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Last active: {formatTimeIST(member.activityLog[0].timestamp)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Total Tasks</p>
          <p className="text-2xl font-bold">{member.stats.totalTasks}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Completed</p>
          <p className="text-2xl font-bold text-green-400">{member.stats.completedTasks}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">In Progress</p>
          <p className="text-2xl font-bold text-blue-400">{member.stats.inProgress}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Efficiency</p>
          <p className="text-2xl font-bold text-yellow-400">{member.stats.efficiency}%</p>
        </div>
      </section>

      {/* Current Task */}
      <section className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Current Task
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">{currentTask.title}</h3>
            <p className="text-gray-400 mt-1">{currentTask.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
              {currentTask.status}
            </span>
            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
              {currentTask.priority} Priority
            </span>
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
              {currentTask.daysRemaining} days left
            </span>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="font-medium">{currentTask.progress}%</span>
            </div>
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                style={{ width: `${currentTask.progress}%` }}
              />
            </div>
          </div>
          <p className="text-gray-500 text-sm">Deadline: {currentTask.deadline}</p>
        </div>
      </section>

      {/* Check-in Status */}
      <section className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Today&apos;s Check-ins
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(member.checkIns).map(([key, checkIn]: [string, any]) => (
            <div
              key={key}
              className={`p-4 rounded-lg border ${
                checkIn.status ? "bg-green-500/10 border-green-500" : "bg-gray-700 border-gray-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm capitalize">{key} Check</p>
                  <p className="font-semibold">{checkIn.time}</p>
                </div>
                {checkIn.status ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <Clock className="w-6 h-6 text-gray-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activity Chart */}
      <section className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
        <h2 className="text-lg font-semibold mb-4">Daily Activity</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dailyProgress}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }} />
            <Bar dataKey="hours" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Activity Log */}
      <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Activity Log
        </h2>
        <div className="space-y-3">
          {member.activityLog.map((item: any, index: number) => (
            <div key={index} className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                item.type === "update" ? "bg-blue-400" :
                item.type === "task" ? "bg-purple-400" :
                "bg-cyan-400"
              }`} />
              <div>
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
      </footer>
    </div>
  );
}
