"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Rocket,
  GraduationCap,
  Target,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Loader2
} from "lucide-react";

interface SnapshotData {
  timestamp: string;
  team: {
    healthScore: number;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
  };
  outreach: {
    totalSent: number;
    sentToday: number;
    remaining: number;
    progress: number;
  };
  student: {
    name: string;
    day: number;
    progress: number;
    streak: number;
    todayTopic: string;
  };
  focus: {
    urgency: string;
    score: number;
    urgentItems: number;
  };
  alerts: string[];
}

export function StatusSnapshot() {
  const [data, setData] = useState<SnapshotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchSnapshot = async () => {
    try {
      const res = await fetch('/api/snapshot');
      const json = await res.json();
      setData(json);
      setLastUpdate(new Date());
    } catch (e) {
      console.error('Failed to fetch snapshot');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnapshot();
    const interval = setInterval(fetchSnapshot, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 flex items-center justify-center h-32">
        <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-4 border border-gray-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold">Live Status</h3>
        </div>
        <span className="text-xs text-gray-500">
          {lastUpdate?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {/* Team Health */}
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Team Health</span>
          </div>
          <p className="text-xl font-bold text-blue-400">{data.team.healthScore}%</p>
          <p className="text-xs text-gray-500">{data.team.completedTasks}/{data.team.totalTasks} tasks</p>
        </div>

        {/* Outreach */}
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Rocket className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">Outreach</span>
          </div>
          <p className="text-xl font-bold text-green-400">{data.outreach.totalSent}</p>
          <p className="text-xs text-gray-500">+{data.outreach.sentToday} today</p>
        </div>

        {/* Student Progress */}
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">{data.student.name}</span>
          </div>
          <p className="text-xl font-bold text-purple-400">Day {data.student.day}</p>
          <p className="text-xs text-gray-500">🔥 {data.student.streak} day streak</p>
        </div>

        {/* Focus Score */}
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">Focus</span>
          </div>
          <p className="text-xl font-bold text-yellow-400 capitalize">{data.focus.urgency}</p>
          <p className="text-xs text-gray-500">{data.focus.urgentItems} urgent items</p>
        </div>
      </div>

      {/* Alerts */}
      {data.alerts.length > 0 && (
        <div className="space-y-2">
          {data.alerts.map((alert, i) => (
            <div key={i} className="flex items-center gap-2 text-sm bg-gray-700/30 rounded-lg px-3 py-2">
              {alert.includes('⚠️') ? (
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
              ) : alert.includes('🔥') || alert.includes('🚀') ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Activity className="w-4 h-4 text-blue-400" />
              )}
              <span className="text-gray-300">{alert.replace(/[⚠️🔥🚀]/g, '').trim()}</span>
            </div>
          ))}
        </div>
      )}

      {/* Today's Topic */}
      {data.student.todayTopic && (
        <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
          <span>📚 Today:</span>
          <span className="text-gray-400">{data.student.todayTopic}</span>
        </div>
      )}
    </div>
  );
}
