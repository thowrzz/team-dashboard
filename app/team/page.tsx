"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  ChevronRight,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Activity,
} from "lucide-react";

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
    daysRemaining: 3,
    priority: "High",
    status: "In Progress",
    progress: 25,
    efficiency: 0,
    tasksCompleted: 0,
    tasksThisWeek: 1,
    totalTasks: 1,
    checkIns: {
      morning: false,
      afternoon: false,
      evening: false,
    },
    lastActive: "2026-02-26T23:30:00+05:30",
    joinedDate: "2026-02-26",
  },
  {
    id: 2,
    name: "Adarsh B S",
    phone: "+919400355185",
    email: "adarshsarachandran@gmail.com",
    avatar: "/team-dashboard/adarsh.jpg",
    slug: "adarsh",
    role: "Developer",
    task: "Team Management",
    deadline: "Ongoing",
    daysRemaining: 0,
    priority: "High",
    status: "Active",
    progress: 100,
    efficiency: 95,
    tasksCompleted: 12,
    tasksThisWeek: 5,
    totalTasks: 5,
    checkIns: {
      morning: true,
      afternoon: true,
      evening: true,
    },
    lastActive: "2026-02-27T19:30:00+05:30",
    joinedDate: "2026-01-01",
  },
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

export default function TeamPage() {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  const totalTasks = teamMembers.reduce((sum, m) => sum + m.totalTasks, 0);
  const completedTasks = teamMembers.filter(m => m.progress === 100).length;
  const inProgressTasks = teamMembers.filter(m => m.status === "In Progress").length;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="text-blue-400 text-sm font-medium">Digital Product Solutions</p>
            <h1 className="text-3xl font-bold text-white">Team Members</h1>
            <p className="text-gray-400">Manage and track individual performance</p>
          </div>
        </div>
      </header>

      {/* Stats Summary */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Total Members</span>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">{teamMembers.length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Active Tasks</span>
            <Activity className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-yellow-400">{inProgressTasks}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Completed</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-green-400">{completedTasks}</p>
        </div>
      </section>

      {/* Team Members List */}
      <section>
        <h2 className="text-xl font-semibold mb-4">All Team Members</h2>
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <Link
              key={member.id}
              href={`/team/${member.slug}`}
              className="block bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Member Info */}
                <div className="flex items-center gap-4">
                  {member.avatar ? (
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-gray-400">{member.role}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {member.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-wrap items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    member.status === "Completed" ? "bg-green-500/20 text-green-400" :
                    member.status === "In Progress" ? "bg-blue-500/20 text-blue-400" :
                    "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {member.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    member.priority === "High" ? "bg-red-500/20 text-red-400" :
                    member.priority === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-gray-500/20 text-gray-400"
                  }`}>
                    {member.priority} Priority
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{member.task}</span>
                  <span className="text-white font-medium">{member.progress}%</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${member.progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-500">Deadline: {member.deadline}</span>
                  <span className={`${member.daysRemaining <= 1 ? "text-red-400" : "text-yellow-400"}`}>
                    {member.daysRemaining} days remaining
                  </span>
                </div>
              </div>
            </Link>
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
            Last updated: {lastUpdated.toLocaleString('en-IN', { timeZone: 'Asia/Calcutta' })}
          </p>
        </div>
      </footer>
    </div>
  );
}
