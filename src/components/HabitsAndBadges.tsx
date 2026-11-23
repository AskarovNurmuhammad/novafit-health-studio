import React from 'react';
import { Flame, CheckSquare, Square, Award, Trophy, Sparkles, Lock } from 'lucide-react';
import type { DailyHabit, AchievementBadge } from '../types';
import confetti from 'canvas-confetti';

interface HabitsAndBadgesProps {
  habits: DailyHabit[];
  badges: AchievementBadge[];
  streakDays: number;
  onToggleHabit: (id: string) => void;
  isDark: boolean;
}

export default function HabitsAndBadges({
  habits,
  badges,
  streakDays,
  onToggleHabit,
  isDark
}: HabitsAndBadgesProps) {
  const completedCount = habits.filter(h => h.completed).length;
  const progressPercent = Math.round((completedCount / habits.length) * 100);

  const handleToggle = (id: string, currentState: boolean) => {
    onToggleHabit(id);
    if (!currentState) {
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Daily Habits Checklist */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isDark ? 'bg-[#121826] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
              <Flame className="w-5 h-5 fill-current animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Kunlik Odatlar & Streak ({streakDays} Kun)</h3>
              <p className="text-xs text-slate-400">Kunlik rejimni bajaring va 100% yopiq kun hosil qiling</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-extrabold px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span>{completedCount}/{habits.length}</span>
            <span>({progressPercent}%)</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-700/20 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Checklist */}
        <div className="space-y-2">
          {habits.map(h => (
            <div
              key={h.id}
              onClick={() => handleToggle(h.id, h.completed)}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                h.completed
                  ? 'bg-amber-500/5 border-amber-500/30'
                  : isDark ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{h.icon}</span>
                <div>
                  <h4 className={`text-xs font-bold ${h.completed ? 'line-through text-slate-400' : ''}`}>
                    {h.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">{h.target}</span>
                </div>
              </div>

              {h.completed ? (
                <CheckSquare className="w-5 h-5 text-amber-500 shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-400 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Achievement Badges */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isDark ? 'bg-[#121826] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Yutuqlar & Medal Kolleksiyasi</h3>
              <p className="text-xs text-slate-400">Doimiy intizom va mashqlar uchun ochiladigan nishonlar</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-purple-400">
            {badges.filter(b => b.unlocked).length}/{badges.length} Ochilgan
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {badges.map(b => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                b.unlocked
                  ? isDark ? 'bg-purple-950/20 border-purple-500/40 shadow-xs' : 'bg-purple-50/70 border-purple-200 shadow-xs'
                  : 'opacity-50 grayscale border-inherit bg-slate-900/10'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-slate-900/40 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                {b.unlocked ? b.icon : <Lock className="w-5 h-5 text-slate-400" />}
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-xs flex items-center gap-1.5">
                  <span>{b.title}</span>
                  {b.unlocked && <Sparkles className="w-3 h-3 text-purple-400" />}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  {b.description}
                </p>
                {b.unlockedAt && (
                  <span className="text-[9px] font-mono text-purple-400 mt-1 block">
                    Ochilgan sana: {b.unlockedAt}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
