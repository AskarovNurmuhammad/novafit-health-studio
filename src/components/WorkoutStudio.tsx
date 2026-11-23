import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, Play, Pause, RotateCcw, CheckCircle2, Clock, Flame, Award, ChevronRight, X, Sparkles, Volume2 } from 'lucide-react';
import { WORKOUT_ROUTINES, EXERCISE_DATABASE } from '../data/mockData';
import type { WorkoutRoutine, Exercise } from '../types';
import confetti from 'canvas-confetti';

interface WorkoutStudioProps {
  onCompleteWorkout: (caloriesBurned: number, durationMin: number) => void;
  isDark: boolean;
}

export default function WorkoutStudio({ onCompleteWorkout, isDark }: WorkoutStudioProps) {
  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine | null>(null);
  const [activeSession, setActiveSession] = useState<{
    routine: WorkoutRoutine;
    currentExerciseIndex: number;
    completedSets: Record<string, boolean[]>; // exerciseId -> [true, false, ...]
    elapsedSeconds: number;
  } | null>(null);

  // Dam olish taymeri (Rest Timer)
  const [restSeconds, setRestSeconds] = useState<number>(60);
  const [restRunning, setRestRunning] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play audio beep when timer finishes
  const playBeep = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // ignore
    }
  };

  // Session stopwatch
  useEffect(() => {
    let timer: any = null;
    if (activeSession) {
      timer = setInterval(() => {
        setActiveSession(prev => prev ? { ...prev, elapsedSeconds: prev.elapsedSeconds + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeSession !== null]);

  // Rest countdown
  useEffect(() => {
    let timer: any = null;
    if (restRunning && restSeconds > 0) {
      timer = setInterval(() => {
        setRestSeconds(prev => {
          if (prev <= 1) {
            playBeep();
            setRestRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [restRunning, restSeconds]);

  const startRoutineSession = (routine: WorkoutRoutine) => {
    const initialSets: Record<string, boolean[]> = {};
    routine.exercises.forEach(item => {
      initialSets[item.exercise.id] = Array(item.sets).fill(false);
    });

    setActiveSession({
      routine,
      currentExerciseIndex: 0,
      completedSets: initialSets,
      elapsedSeconds: 0
    });
    setSelectedRoutine(null);
  };

  const toggleSetComplete = (exerciseId: string, setIndex: number) => {
    if (!activeSession) return;
    const currentList = [...(activeSession.completedSets[exerciseId] || [])];
    currentList[setIndex] = !currentList[setIndex];

    setActiveSession({
      ...activeSession,
      completedSets: {
        ...activeSession.completedSets,
        [exerciseId]: currentList
      }
    });

    // Start rest timer automatically when set completed
    if (currentList[setIndex]) {
      setRestSeconds(60);
      setRestRunning(true);
    }
  };

  const handleFinishWorkout = () => {
    if (!activeSession) return;
    const minutes = Math.max(1, Math.round(activeSession.elapsedSeconds / 60));
    const estimatedCals = minutes * 8.5; // ~8.5 kcal/min average
    onCompleteWorkout(Math.round(estimatedCals), minutes);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    setActiveSession(null);
  };

  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Active Workout Session Mode (Live Fullscreen Overlay/Card) */}
      {activeSession ? (
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
          isDark ? 'bg-[#121826] border-emerald-500/30' : 'bg-white border-emerald-300 shadow-md'
        }`}>
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-inherit">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Jonli Mashg'ulot Rejimi</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold">{activeSession.routine.title}</h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Mashq Vaqti</span>
                <span className="font-mono text-xl font-extrabold text-emerald-500">
                  {formatTime(activeSession.elapsedSeconds)}
                </span>
              </div>

              <button
                onClick={handleFinishWorkout}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
              >
                Mashg'ulotni Yakunlash
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
            {/* Exercises Checklist */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-wider">Mashqlar va Podxodlar:</h3>
              <div className="space-y-3">
                {activeSession.routine.exercises.map((item, idx) => {
                  const setStates = activeSession.completedSets[item.exercise.id] || [];
                  const isAllCompleted = setStates.length > 0 && setStates.every(Boolean);

                  return (
                    <div
                      key={item.exercise.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isAllCompleted
                          ? 'bg-emerald-500/5 border-emerald-500/30'
                          : isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{item.exercise.icon}</span>
                          <div>
                            <h4 className="font-bold text-sm">{item.exercise.name}</h4>
                            <p className="text-[11px] text-slate-400">
                              Mushak: {item.exercise.targetMuscle} • Og'irlik: {item.weightKg || 'Tana vazni'} kg
                            </p>
                          </div>
                        </div>
                        {isAllCompleted && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        )}
                      </div>

                      {/* Sets buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {Array.from({ length: item.sets }).map((_, sIdx) => {
                          const isDone = setStates[sIdx] || false;
                          return (
                            <button
                              key={sIdx}
                              onClick={() => toggleSetComplete(item.exercise.id, sIdx)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer active:scale-95 ${
                                isDone
                                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-xs'
                                  : isDark
                                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-emerald-500'
                                    : 'bg-white border-slate-300 text-slate-700 hover:border-emerald-500'
                              }`}
                            >
                              Set {sIdx + 1}: {item.reps}x {isDone ? '✓' : ''}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rest Interval Timer Sidebar */}
            <div className={`p-6 rounded-3xl border flex flex-col items-center justify-between text-center ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-full">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Dam Olish Taymeri (Rest)
                </span>
                <p className="text-[11px] text-slate-400 mb-6">Podxodlar oralig'ida mushaklarni tiklang</p>

                {/* Big Timer Display */}
                <div className="relative w-36 h-36 rounded-full border-4 border-emerald-500/30 flex items-center justify-center mx-auto mb-6 bg-slate-950/20 shadow-inner">
                  <div className="text-center">
                    <span className="font-mono text-4xl font-extrabold text-emerald-400">
                      {restSeconds}
                    </span>
                    <span className="text-[10px] block font-bold text-slate-400 mt-1">soniya</span>
                  </div>
                </div>

                {/* Presets */}
                <div className="grid grid-cols-4 gap-1.5 mb-6 text-xs font-mono font-bold">
                  {[30, 60, 90, 120].map(sec => (
                    <button
                      key={sec}
                      onClick={() => { setRestSeconds(sec); setRestRunning(true); }}
                      className={`py-1.5 rounded-xl border transition-all cursor-pointer ${
                        restSeconds === sec
                          ? 'bg-emerald-500 text-white border-emerald-400'
                          : isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setRestRunning(!restRunning)}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  {restRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  <span>{restRunning ? 'To\'xtatish' : 'Boshlash'}</span>
                </button>

                <button
                  onClick={() => { setRestSeconds(60); setRestRunning(false); }}
                  className="p-3 rounded-2xl border border-inherit text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Qayta o'rnatish"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Routines Catalog View */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight">Mashg'ulot Rejalari & Jonli Taymer</h2>
                <p className="text-xs text-slate-400">Mashg'ulotni tanlang va jonli taymer yordamida bajaring</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WORKOUT_ROUTINES.map(routine => (
              <div
                key={routine.id}
                className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all group ${
                  isDark ? 'bg-[#121826] border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-emerald-200 shadow-xs'
                }`}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={routine.coverUrl}
                    alt={routine.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider mb-2 inline-block">
                      {routine.category}
                    </span>
                    <h3 className="font-extrabold text-lg leading-tight">{routine.title}</h3>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      <span>{routine.durationMin} daqiqa</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-500" />
                      <span>~{routine.durationMin * 8} kkal</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-purple-500" />
                      <span>{routine.difficulty}</span>
                    </span>
                  </div>

                  <div className="space-y-1.5 border-t border-inherit pt-3">
                    <span className="text-[11px] font-bold text-slate-400">Tarkibidagi mashqlar:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {routine.exercises.map(ex => (
                        <span
                          key={ex.exercise.id}
                          className="px-2.5 py-1 rounded-xl bg-slate-500/10 text-slate-400 text-[11px] font-medium"
                        >
                          {ex.exercise.icon} {ex.exercise.name.split('(')[0].trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => startRoutineSession(routine)}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span>Mashg'ulotni Boshlash (Start Workout)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
