import React, { useState } from 'react';
import { Scale, Plus, TrendingDown, TrendingUp, Sparkles, X } from 'lucide-react';
import type { WeightEntry } from '../types';
import confetti from 'canvas-confetti';

interface WeightChartProps {
  entries: WeightEntry[];
  targetWeight: number;
  heightCm: number;
  onAddEntry: (entry: WeightEntry) => void;
  isDark: boolean;
}

export default function WeightChart({ entries, targetWeight, heightCm, onAddEntry, isDark }: WeightChartProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWeight, setNewWeight] = useState<number>(entries[entries.length - 1]?.weightKg || 75);
  const [newBodyFat, setNewBodyFat] = useState<number>(17);

  const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latestWeight = sorted[sorted.length - 1]?.weightKg || 75;
  const initialWeight = sorted[0]?.weightKg || 75;
  const weightDiff = Number((latestWeight - initialWeight).toFixed(1));

  // BMI = weight / (height/100)^2
  const heightM = heightCm / 100;
  const currentBmi = Number((latestWeight / (heightM * heightM)).toFixed(1));

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Kam vazn', color: 'text-amber-400' };
    if (bmi < 25) return { text: 'Normal Sog\'lom', color: 'text-emerald-400' };
    if (bmi < 30) return { text: 'Ortiqcha vazn', color: 'text-amber-500' };
    return { text: 'Semizlik', color: 'text-rose-500' };
  };

  const bmiCat = getBmiCategory(currentBmi);

  // SVG Chart points calculation
  const minW = Math.min(targetWeight, ...sorted.map(e => e.weightKg)) - 1;
  const maxW = Math.max(targetWeight, ...sorted.map(e => e.weightKg)) + 1;
  const chartWidth = 500;
  const chartHeight = 160;

  const points = sorted.map((e, idx) => {
    const x = (idx / Math.max(1, sorted.length - 1)) * (chartWidth - 60) + 30;
    const y = chartHeight - ((e.weightKg - minW) / (maxW - minW || 1)) * (chartHeight - 40) - 20;
    return { x, y, weight: e.weightKg, date: e.date };
  });

  const pathD = points.length > 0
    ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`
    : '';

  const targetY = chartHeight - ((targetWeight - minW) / (maxW - minW || 1)) * (chartHeight - 40) - 20;

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    onAddEntry({
      id: `w-${Date.now()}`,
      date: today,
      weightKg: Number(newWeight),
      bodyFatPercent: Number(newBodyFat)
    });
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    setIsModalOpen(false);
  };

  return (
    <div className={`p-6 rounded-3xl border transition-all ${
      isDark ? 'bg-[#121826] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base">Vazn Dinamikasi & BMI Tahlili</h3>
            <p className="text-xs text-slate-400">Oxirgi haftalardagi tana vazni o'zgarishi</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Vazn Kiritish</span>
        </button>
      </div>

      {/* Stats Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-center text-xs">
        <div className={`p-3 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <span className="text-[10px] text-slate-400 block font-semibold">Hozirgi Vazn</span>
          <span className="font-mono text-lg font-extrabold text-purple-400">{latestWeight} kg</span>
        </div>

        <div className={`p-3 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <span className="text-[10px] text-slate-400 block font-semibold">Maqsad</span>
          <span className="font-mono text-lg font-extrabold text-emerald-400">{targetWeight} kg</span>
        </div>

        <div className={`p-3 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <span className="text-[10px] text-slate-400 block font-semibold">Umumiy O'zgarish</span>
          <span className={`font-mono text-lg font-extrabold flex items-center justify-center gap-0.5 ${
            weightDiff <= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {weightDiff <= 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            <span>{weightDiff > 0 ? `+${weightDiff}` : weightDiff} kg</span>
          </span>
        </div>

        <div className={`p-3 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <span className="text-[10px] text-slate-400 block font-semibold">BMI Indeksi</span>
          <span className={`font-mono text-lg font-extrabold ${bmiCat.color}`}>{currentBmi}</span>
          <span className="text-[9px] block text-slate-400 font-bold mt-0.5">{bmiCat.text}</span>
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 overflow-visible">
          {/* Target Line */}
          <line
            x1="20"
            y1={targetY}
            x2={chartWidth - 20}
            y2={targetY}
            stroke="#10b981"
            strokeDasharray="4 4"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <text x={chartWidth - 15} y={targetY - 4} fill="#10b981" fontSize="10" textAnchor="end" fontWeight="bold">
            Maqsad: {targetWeight}kg
          </text>

          {/* Area fill */}
          {points.length > 1 && (
            <path
              d={`${pathD} L ${points[points.length - 1].x},${chartHeight} L ${points[0].x},${chartHeight} Z`}
              fill="url(#weightGrad)"
              opacity="0.25"
            />
          )}

          {/* Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#c084fc"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r="5"
                fill="#a855f7"
                stroke="#fff"
                strokeWidth="2"
                className="hover:scale-125 transition-transform cursor-pointer"
              />
              <text
                x={p.x}
                y={p.y - 10}
                fill={isDark ? '#e2e8f0' : '#1e293b'}
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                {p.weight}
              </text>
              <text
                x={p.x}
                y={chartHeight - 4}
                fill="#94a3b8"
                fontSize="9"
                textAnchor="middle"
              >
                {p.date.split('-').slice(1).join('/')}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-sm rounded-3xl border shadow-2xl p-6 ${
            isDark ? 'bg-[#121826] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-inherit mb-4">
              <h4 className="font-extrabold text-base">Yangi Vazn Kiritish</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWeight} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-400 mb-1">Vazn (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(Number(e.target.value))}
                  className={`w-full py-2.5 px-3 rounded-xl border outline-none font-mono ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tana Yog'i % (Ixtiyoriy)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newBodyFat}
                  onChange={(e) => setNewBodyFat(Number(e.target.value))}
                  className={`w-full py-2.5 px-3 rounded-xl border outline-none font-mono ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-extrabold shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Vazn Tarixiga Saqlash
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
