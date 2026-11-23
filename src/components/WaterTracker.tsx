import React from 'react';
import { Droplet, Plus, Minus, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WaterTrackerProps {
  currentMl: number;
  targetMl: number;
  onUpdate: (amount: number) => void;
  isDark: boolean;
}

export default function WaterTracker({ currentMl, targetMl, onUpdate, isDark }: WaterTrackerProps) {
  const percentage = Math.min(100, Math.round((currentMl / targetMl) * 100));

  const addWater = (amount: number) => {
    const next = currentMl + amount;
    if (currentMl < targetMl && next >= targetMl) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
    onUpdate(Math.max(0, next));
  };

  return (
    <div className={`p-6 rounded-3xl border transition-all ${
      isDark ? 'bg-[#121826] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
    }`}>
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
            <Droplet className="w-5 h-5 fill-current animate-bounce" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base">Gidratatsiya & Suv Rejimi</h3>
            <p className="text-[11px] text-slate-400">Kunlik maqsad: {targetMl} ml</p>
          </div>
        </div>

        {percentage >= 100 && (
          <div className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Maqsad Bajarildi!</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Animated Water Flask */}
        <div className="relative w-28 h-36 rounded-2xl border-2 border-cyan-400/40 bg-slate-900/30 overflow-hidden shrink-0 flex items-end justify-center shadow-inner">
          <div
            className="w-full bg-gradient-to-t from-cyan-600 via-cyan-500 to-sky-400 transition-all duration-700 ease-out relative"
            style={{ height: `${percentage}%` }}
          >
            {/* Wave animation line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/40 animate-pulse" />
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-white drop-shadow-md">
            <span className="font-mono text-xl font-extrabold">{currentMl}</span>
            <span className="text-[10px] font-bold opacity-80">/ {targetMl} ml</span>
            <span className="text-[11px] font-bold mt-1 text-cyan-200">{percentage}%</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex-1 space-y-3 w-full">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => addWater(250)}
              className="py-2.5 px-3 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 border border-cyan-500/30 text-xs font-extrabold flex flex-col items-center gap-0.5 active:scale-95 transition-all cursor-pointer"
            >
              <span>+250 ml</span>
              <span className="text-[10px] opacity-75">Stakan 🥛</span>
            </button>

            <button
              onClick={() => addWater(500)}
              className="py-2.5 px-3 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 border border-cyan-500/30 text-xs font-extrabold flex flex-col items-center gap-0.5 active:scale-95 transition-all cursor-pointer"
            >
              <span>+500 ml</span>
              <span className="text-[10px] opacity-75">Shisha 🫙</span>
            </button>

            <button
              onClick={() => addWater(1000)}
              className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-500/20 text-xs font-extrabold flex flex-col items-center gap-0.5 active:scale-95 transition-all cursor-pointer"
            >
              <span>+1000 ml</span>
              <span className="text-[10px] opacity-90">Katta idish 💧</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              onClick={() => addWater(-250)}
              disabled={currentMl <= 0}
              className="text-slate-400 hover:text-rose-500 flex items-center gap-1 disabled:opacity-30 cursor-pointer transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
              <span>250 ml kamaytirish</span>
            </button>

            <button
              onClick={() => onUpdate(0)}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
              title="Qayta tiklash"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nollashtirish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
