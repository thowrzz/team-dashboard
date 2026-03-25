"use client";

import { useState, useEffect } from "react";
import { 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  Target,
  Flame,
  ArrowRight,
  Sparkles,
  Bell
} from "lucide-react";

interface FocusData {
  priorityScore: number;
  urgencyLevel: string;
  focusSummary: string;
  urgentItems: number;
  recommendations: string[];
  positiveNotes: string[];
}

interface TeamData {
  team: Array<{
    name: string;
    tasks: Array<{
      title: string;
      status: string;
      deadline?: string;
      note?: string;
    }>;
  }>;
  outreach: {
    totalSent: number;
    sentToday: number;
    leadsRemaining: number;
  };
  student: {
    name: string;
    streak: number;
    currentDay: number;
    todayTopic: string;
    sessionActive: boolean;
  };
}

export function TodayFocus() {
  const [focusData, setFocusData] = useState<FocusData | null>(null);
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [focusRes, teamRes] = await Promise.all([
          fetch('/team-dashboard/api/focus-score'),
          fetch('/team-dashboard/api/team-data')
        ]);
        
        if (focusRes.ok) {
          const focusJson = await focusRes.json();
          setFocusData(focusJson.data);
        }
        
        if (teamRes.ok) {
          const teamJson = await teamRes.json();
          setTeamData(teamJson);
        }
      } catch (error) {
        console.error('Error fetching focus data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-5 border border-gray-700/50 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getUrgencyColor = () => {
    if (!focusData) return 'text-green-400';
    switch (focusData.urgencyLevel) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'moderate': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

  const getUrgencyBg = () => {
    if (!focusData) return 'bg-green-900/20 border-green-500/30';
    switch (focusData.urgencyLevel) {
      case 'critical': return 'bg-red-900/20 border-red-500/30';
      case 'high': return 'bg-orange-900/20 border-orange-500/30';
      case 'moderate': return 'bg-yellow-900/20 border-yellow-500/30';
      default: return 'bg-green-900/20 border-green-500/30';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-5 border border-gray-700/50 backdrop-blur-sm">
      {/* Header with greeting */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">{getGreeting()}, Adarsh!</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyBg()} ${getUrgencyColor()}`}>
          {focusData?.urgencyLevel?.toUpperCase() || 'NORMAL'}
        </div>
      </div>

      {/* Priority Focus */}
      {focusData && (
        <div className="mb-4 p-3 rounded-xl bg-gray-700/30 border border-gray-600/50">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${focusData.urgentItems > 0 ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
              <Target className={`w-4 h-4 ${focusData.urgentItems > 0 ? 'text-red-400' : 'text-green-400'}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{focusData.focusSummary}</p>
              {focusData.recommendations.length > 0 && (
                <div className="mt-2 space-y-1">
                  {focusData.recommendations.slice(0, 2).map((rec, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                      <ArrowRight className="w-3 h-3" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Team Health */}
        <div className="bg-gray-700/30 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs text-gray-400">Focus</span>
          </div>
          <p className="text-xl font-bold text-white">{focusData?.priorityScore || 0}/10</p>
        </div>

        {/* Outreach */}
        <div className="bg-gray-700/30 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs text-gray-400">Outreach</span>
          </div>
          <p className="text-xl font-bold text-white">{teamData?.outreach?.sentToday || 0}<span className="text-sm text-gray-500">/{teamData?.outreach?.totalSent || 0}</span></p>
        </div>

        {/* Student */}
        <div className="bg-gray-700/30 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs text-gray-400">Panda</span>
          </div>
          <p className="text-xl font-bold text-white">{teamData?.student?.streak || 0}<span className="text-sm text-gray-500">🔥</span></p>
        </div>
      </div>

      {/* Positive Notes */}
      {focusData && focusData.positiveNotes.length > 0 && (
        <div className="p-3 rounded-xl bg-green-900/20 border border-green-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs font-medium text-green-400">Good News</span>
          </div>
          <div className="space-y-1">
            {focusData.positiveNotes.map((note, i) => (
              <p key={i} className="text-xs text-gray-300">• {note}</p>
            ))}
          </div>
        </div>
      )}

      {/* Urgent Items Alert */}
      {focusData && focusData.urgentItems > 0 && (
        <div className="mt-3 p-3 rounded-xl bg-red-900/20 border border-red-500/30">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-400">
              {focusData.urgentItems} urgent item{focusData.urgentItems > 1 ? 's' : ''} need{focusData.urgentItems === 1 ? 's' : ''} attention
            </span>
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="mt-4 flex items-center justify-end gap-1 text-xs text-gray-500">
        <Clock className="w-3 h-3" />
        <span>Updated {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
}
