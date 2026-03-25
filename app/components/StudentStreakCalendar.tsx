"use client";

import { useState, useEffect } from 'react';
import { Flame, Trophy, Star, CheckCircle, Clock, BookOpen, Target, Zap, Award, TrendingUp, Calendar } from 'lucide-react';

interface StudentData {
  name: string;
  currentDay: number;
  totalDays: number;
  currentWeek: number;
  progress: number;
  streak: number;
  streakStatus: string;
  todayTopic: string;
  topicsCovered: string[];
  upcomingTopics: string[];
  quizScores: number[];
  avgQuizScore: number | null;
  attendance: {
    total: number;
    present: number;
    percentage: number;
  };
  tasksToday: {
    total: number;
    completed: number;
    pending: number;
  };
  status: string;
  sessionActive: boolean;
}

export default function StudentStreakCalendar() {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/team-dashboard/api/student')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStudent(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 animate-pulse">
        <div className="h-32 bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (!student) return null;

  // Generate calendar days (30 days)
  const calendarDays = Array.from({ length: student.totalDays }, (_, i) => ({
    day: i + 1,
    completed: i + 1 < student.currentDay,
    current: i + 1 === student.currentDay,
    upcoming: i + 1 > student.currentDay
  }));

  // Week rows
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  // Streak emoji based on length
  const getStreakEmoji = (streak: number) => {
    if (streak >= 21) return '🔥🔥🔥';
    if (streak >= 14) return '🔥🔥';
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '⭐';
    return '✨';
  };

  // Motivation message
  const getMotivation = (streak: number, progress: number) => {
    if (streak >= 21) return "Incredible dedication! You're unstoppable! 💪";
    if (streak >= 14) return "Amazing consistency! Keep the momentum! 🚀";
    if (streak >= 7) return "One week streak! You're building a habit! 🌟";
    if (streak >= 3) return "Great start! 3-day streak is building! 💫";
    if (streak >= 1) return "You've started! Keep going! 💪";
    return "Start your learning streak today! 🎯";
  };

  return (
    <div className="space-y-4">
      {/* Streak Header */}
      <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 rounded-xl p-5 border border-orange-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-3xl">
              {getStreakEmoji(student.streak)}
            </div>
            <div>
              <p className="text-3xl font-bold text-white flex items-center gap-2">
                {student.streak}
                <span className="text-lg text-orange-400">day streak</span>
              </p>
              <p className="text-orange-300 text-sm">{student.streakStatus}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Current Day</p>
            <p className="text-2xl font-bold text-white">{student.currentDay} <span className="text-gray-500 text-lg">/ {student.totalDays}</span></p>
          </div>
        </div>
        <p className="text-orange-200 text-sm mt-3">{getMotivation(student.streak, student.progress)}</p>
      </div>

      {/* 30-Day Calendar */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-purple-400" />
          <h3 className="text-md font-semibold">30-Day Learning Journey</h3>
        </div>
        
        {/* Week labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-[10px] text-gray-500 py-1">{day}</div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="space-y-1">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 gap-1">
              {week.map((day) => (
                <div
                  key={day.day}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-xs font-medium
                    transition-all cursor-pointer
                    ${day.completed 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20' 
                      : day.current 
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-800 animate-pulse'
                        : 'bg-gray-700/50 text-gray-500 hover:bg-gray-700'
                    }
                  `}
                  title={`Day ${day.day}${day.completed ? ' ✓' : day.current ? ' (Today)' : ''}`}
                >
                  {day.completed ? (
                    <span className="text-sm">✓</span>
                  ) : day.current ? (
                    <span className="text-sm">📍</span>
                  ) : (
                    day.day
                  )}
                </div>
              ))}
              {/* Fill remaining days if week is incomplete */}
              {week.length < 7 && Array.from({ length: 7 - week.length }, (_, i) => (
                <div key={`empty-${i}`} className="aspect-square rounded-lg bg-gray-800/30"></div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-green-500 to-emerald-600"></div>
            <span className="text-gray-400">Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-cyan-600 ring-2 ring-blue-400"></div>
            <span className="text-gray-400">Today</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-gray-700/50"></div>
            <span className="text-gray-400">Upcoming</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Progress */}
        <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-4 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-purple-400" />
            <span className="text-gray-400 text-xs">Progress</span>
          </div>
          <p className="text-2xl font-bold text-purple-400">{student.progress}%</p>
          <div className="h-1.5 bg-gray-700 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all"
              style={{ width: `${student.progress}%` }}
            />
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-4 border border-green-500/30">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-gray-400 text-xs">Attendance</span>
          </div>
          <p className="text-2xl font-bold text-green-400">{student.attendance.percentage}%</p>
          <p className="text-xs text-gray-500 mt-1">{student.attendance.present}/{student.attendance.total} sessions</p>
        </div>

        {/* Quiz Score */}
        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-4 border border-blue-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400 text-xs">Quiz Avg</span>
          </div>
          <p className="text-2xl font-bold text-blue-400">
            {student.avgQuizScore !== null ? `${student.avgQuizScore}%` : 'N/A'}
          </p>
          <p className="text-xs text-gray-500 mt-1">{student.quizScores.length} quizzes taken</p>
        </div>

        {/* Today's Tasks */}
        <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl p-4 border border-amber-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-gray-400 text-xs">Today's Tasks</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">
            {student.tasksToday.completed}/{student.tasksToday.total}
          </p>
          <p className="text-xs text-gray-500 mt-1">{student.tasksToday.pending} pending</p>
        </div>
      </div>

      {/* Today's Topic */}
      <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-4 border border-cyan-500/30">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span className="text-gray-400 text-sm">Today's Topic</span>
        </div>
        <p className="text-lg font-semibold text-white">{student.todayTopic}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            student.sessionActive 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-gray-700 text-gray-400'
          }`}>
            {student.sessionActive ? '🟢 Session Active' : '⚪ Session Pending'}
          </span>
        </div>
      </div>

      {/* Topics Progress */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            Topics Roadmap
          </h3>
          <span className="text-xs text-gray-400">{student.topicsCovered.length} of {student.topicsCovered.length + student.upcomingTopics.length} covered</span>
        </div>
        
        <div className="space-y-2">
          {student.topicsCovered.map((topic, i) => (
            <div key={i} className="flex items-center gap-2 text-sm bg-green-500/10 rounded-lg px-3 py-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-green-400">{topic}</span>
            </div>
          ))}
          {student.upcomingTopics.slice(0, 3).map((topic, i) => (
            <div key={i} className="flex items-center gap-2 text-sm bg-gray-700/30 rounded-lg px-3 py-2">
              <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-400">{topic}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
