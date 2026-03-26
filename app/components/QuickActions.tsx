"use client";

import { useState } from "react";
import {
  Rocket,
  Mail,
  Calendar,
  BarChart3,
  Send,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2,
  Brain,
  Zap,
  FileText,
  Users
} from "lucide-react";

interface ActionResult {
  success: boolean;
  message: string;
  data?: any;
}

export function QuickActions() {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<ActionResult | null>(null);

  const actions = [
    {
      id: "outreach",
      icon: Rocket,
      label: "Run Outreach",
      description: "Send 20 cold messages",
      color: "from-green-500 to-emerald-600",
      endpoint: "/api/actions/outreach"
    },
    {
      id: "brief",
      icon: Mail,
      label: "Daily Brief",
      description: "Generate morning summary",
      color: "from-blue-500 to-cyan-600",
      endpoint: "/api/actions/brief"
    },
    {
      id: "standup",
      icon: Users,
      label: "Team Standup",
      description: "Check-in messages",
      color: "from-purple-500 to-pink-600",
      endpoint: "/api/actions/standup"
    },
    {
      id: "insights",
      icon: Brain,
      label: "Smart Insights",
      description: "AI recommendations",
      color: "from-orange-500 to-amber-600",
      endpoint: "/api/actions/insights"
    },
    {
      id: "report",
      icon: FileText,
      label: "Weekly Report",
      description: "Performance summary",
      color: "from-indigo-500 to-violet-600",
      endpoint: "/api/actions/report"
    },
    {
      id: "refresh",
      icon: RefreshCw,
      label: "Refresh Data",
      description: "Sync all systems",
      color: "from-gray-500 to-slate-600",
      endpoint: "/api/actions/refresh"
    }
  ];

  const handleAction = async (actionId: string, endpoint: string) => {
    setLoading(actionId);
    setResult(null);
    
    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();
      
      setResult({
        success: data.success,
        message: data.message || "Action completed!",
        data: data.data
      });
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to execute action. Try again?"
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-5 border border-gray-700/50 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full ml-auto">
          One-Click
        </span>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {actions.map((action) => {
          const Icon = action.icon;
          const isLoading = loading === action.id;
          
          return (
            <button
              key={action.id}
              onClick={() => handleAction(action.id, action.endpoint)}
              disabled={loading !== null}
              className={`relative overflow-hidden p-4 rounded-xl bg-gradient-to-br ${action.color} 
                hover:opacity-90 transition-all duration-200 disabled:opacity-50 
                disabled:cursor-not-allowed group text-left`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{action.label}</p>
                  <p className="text-white/70 text-xs mt-0.5">{action.description}</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
            </button>
          );
        })}
      </div>

      {/* Result Message */}
      {result && (
        <div className={`p-3 rounded-xl flex items-center gap-2 ${
          result.success 
            ? "bg-green-900/30 border border-green-500/30" 
            : "bg-red-900/30 border border-red-500/30"
        }`}>
          {result.success ? (
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          )}
          <p className={`text-sm ${result.success ? "text-green-300" : "text-red-300"}`}>
            {result.message}
          </p>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        <AlertCircle className="w-3 h-3" />
        <span>Actions run in background. Results shown above.</span>
      </div>
    </div>
  );
}
