"use client";

import { useState, useEffect } from "react";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Flame,
  Target,
  Zap,
  Clock,
  Users,
  Rocket,
  Sparkles
} from "lucide-react";

interface TeamData {
  lastUpdated: string;
  team: Array<{
    id: number;
    name: string;
    role: string;
    tasks: Array<{
      id: number;
      title: string;
      status: string;
      progress: number;
      deadline?: string;
      priority?: string;
      note?: string;
    }>;
  }>;
  stats: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
    teamHealthScore: number;
  };
  outreach: {
    totalSent: number;
    sentToday: number;
    leadsRemaining: number;
  };
  student?: {
    name: string;
    project: string;
    currentDay: number;
    streak: number;
    progress: number;
    status: string;
    todayTopic: string;
  };
  focusScore?: {
    urgencyLevel: string;
    focusSummary: string;
    urgentItems: number;
    positiveNotes: string[];
  };
}

export default function SmartIntelligencePanel() {
  const [data, setData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState("");

  useEffect(() => {
    fetchData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/team-data');
      const json = await res.json();
      setData(json);
      generateInsight(json);
    } catch (e) {
      console.error('Failed to fetch team data:', e);
    } finally {
      setLoading(false);
    }
  };

  const generateInsight = (d: TeamData) => {
    const insights = [];
    
    // Check for wins
    if (d.stats.completedTasks > 0) {
      insights.push(`🎉 ${d.stats.completedTasks} tasks completed!`);
    }
    
    // Check student progress
    if (d.student && d.student.streak > 0) {
      insights.push(`📚 ${d.student.name} on a ${d.student.streak}-day learning streak!`);
    }
    
    // Check outreach
    if (d.outreach.sentToday > 0) {
      insights.push(`📧 ${d.outreach.sentToday} outreach messages sent today`);
    }
    
    // Check for urgent items
    if (d.focusScore?.urgentItems && d.focusScore.urgentItems > 0) {
      insights.push(`⚠️ ${d.focusScore.urgentItems} items need attention`);
    }
    
    // Pick random insight or default
    if (insights.length > 0) {
      setInsight(insights[Math.floor(Math.random() * insights.length)]);
    } else {
      setInsight("✨ All systems running smoothly!");
    }
  };

  if (loading) {
    return (
      <div className="mb-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700">
        <div className="animate-pulse flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const healthScore = data.stats.teamHealthScore;
  const healthColor = healthScore >= 80 ? 'text-green-400' : healthScore >= 60 ? 'text-yellow-400' : 'text-red-400';
  const healthBg = healthScore >= 80 ? 'from-green-900/30 to-emerald-900/30' : healthScore >= 60 ? 'from-yellow-900/30 to-orange-900/30' : 'from-red-900/30 to-pink-900/30';
  
  // Find in-progress tasks
  const activeTasks = data.team.flatMap(m => 
    m.tasks.filter(t => t.status === 'In Progress').map(t => ({ ...t, member: m.name }))
  );
  
  // Find student info
  const student = data.student;

  return (
    <section className="mb-6">
      {/* AI Intelligence Banner */}
      <div className={`bg-gradient-to-r ${healthBg} border border-gray-700 rounded-xl p-4 mb-4`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold flex items-center gap-2">
                🧠 Smart Intelligence
                <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">
                  Live Data
                </span>
              </p>
              <p className="text-gray-400 text-sm">{insight}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className={`text-2xl font-bold ${healthColor}`}>{healthScore}</p>
              <p className="text-xs text-gray-400">Health Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{data.stats.completedTasks}/{data.stats.totalTasks}</p>
              <p className="text-xs text-gray-400">Tasks Done</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {/* Team Progress */}
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-blue-500/50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Team Status</span>
          </div>
          <p className="text-lg font-bold text-white">{data.team.length} Active</p>
          <p className="text-xs text-green-400">{data.stats.completedTasks} tasks completed</p>
        </div>

        {/* Outreach */}
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-green-500/50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Rocket className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">Outreach</span>
          </div>
          <p className="text-lg font-bold text-white">{data.outreach.totalSent} Sent</p>
          <p className="text-xs text-green-400">+{data.outreach.sentToday} today</p>
        </div>

        {/* Student */}
        {student && (
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-purple-500/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-gray-400">{student.name}</span>
            </div>
            <p className="text-lg font-bold text-white">Day {student.currentDay}</p>
            <p className="text-xs text-orange-400">🔥 {student.streak}-day streak</p>
          </div>
        )}

        {/* Focus */}
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-yellow-500/50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">Focus Level</span>
          </div>
          <p className="text-lg font-bold text-white capitalize">{data.focusScore?.urgencyLevel || 'Normal'}</p>
          <p className="text-xs text-gray-400">{data.focusScore?.urgentItems || 0} urgent items</p>
        </div>
      </div>

      {/* Active Tasks Panel */}
      {activeTasks.length > 0 && (
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-yellow-400" />
            <h3 className="font-semibold text-white">Active Tasks</h3>
            <span className="text-xs text-gray-400">({activeTasks.length} in progress)</span>
          </div>
          <div className="space-y-2">
            {activeTasks.map((task, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                <div className="flex-1">
                  <p className="text-white font-medium">{task.title}</p>
                  <p className="text-xs text-gray-400">Assigned to: {task.member}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-white font-medium">{task.progress}%</span>
                  </div>
                  {task.note && (
                    <p className="text-xs text-gray-400 mt-1">{task.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Positive Notes */}
      {data.focusScore?.positiveNotes && data.focusScore.positiveNotes.length > 0 && (
        <div className="mt-4 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-xl p-4 border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">Today's Wins</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.focusScore.positiveNotes.map((note, i) => (
              <span key={i} className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
                {note}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="mt-3 flex items-center justify-end gap-2 text-xs text-gray-500">
        <Clock className="w-3 h-3" />
        <span>Updated: {new Date(data.lastUpdated).toLocaleString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit',
          day: 'numeric',
          month: 'short'
        })}</span>
      </div>
    </section>
  );
}
