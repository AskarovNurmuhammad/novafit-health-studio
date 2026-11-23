import React from 'react';

interface MacroRingProps {
  current: number;
  target: number;
  label: string;
  unit?: string;
  color: 'emerald' | 'cyan' | 'amber' | 'rose' | 'purple';
  size?: number;
  strokeWidth?: number;
}

export default function MacroRing({
  current,
  target,
  label,
  unit = 'g',
  color,
  size = 110,
  strokeWidth = 9
}: MacroRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.round((current / (target || 1)) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorStyles = {
    emerald: {
      stroke: '#10b981',
      bgStroke: 'rgba(16, 185, 129, 0.15)',
      text: 'text-emerald-500',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    cyan: {
      stroke: '#06b6d4',
      bgStroke: 'rgba(6, 182, 212, 0.15)',
      text: 'text-cyan-500',
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    },
    amber: {
      stroke: '#f59e0b',
      bgStroke: 'rgba(245, 158, 11, 0.15)',
      text: 'text-amber-500',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    rose: {
      stroke: '#f43f5e',
      bgStroke: 'rgba(244, 63, 94, 0.15)',
      text: 'text-rose-500',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    },
    purple: {
      stroke: '#a855f7',
      bgStroke: 'rgba(168, 85, 247, 0.15)',
      text: 'text-purple-500',
      badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    }
  };

  const style = colorStyles[color];

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={style.bgStroke}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={style.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-sm font-extrabold font-mono leading-none">
            {percentage}%
          </span>
          <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
            {Math.round(current)}{unit}
          </span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className="text-xs font-bold block">{label}</span>
        <span className="text-[11px] text-slate-400 font-medium">
          Maqsad: {target}{unit}
        </span>
      </div>
    </div>
  );
}
