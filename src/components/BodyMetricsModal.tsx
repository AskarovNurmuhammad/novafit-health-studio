import React, { useState } from 'react';
import { X, Scale, Calculator, Check, Sparkles, Activity } from 'lucide-react';
import type { UserProfile, UserGoal } from '../types';
import confetti from 'canvas-confetti';

interface BodyMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
  isDark: boolean;
}

export default function BodyMetricsModal({ isOpen, onClose, profile, onSave, isDark }: BodyMetricsModalProps) {
  const [weight, setWeight] = useState(profile.weight);
  const [height, setHeight] = useState(profile.height);
  const [age, setAge] = useState(profile.age);
  const [gender, setGender] = useState<'male' | 'female'>(profile.gender);
  const [activityLevel, setActivityLevel] = useState<number>(profile.activityLevel);
  const [goal, setGoal] = useState<UserGoal>(profile.goal);
  const [targetWeight, setTargetWeight] = useState(profile.targetWeight);

  if (!isOpen) return null;

  // Mifflin-St Jeor formula
  // BMR for men = (10 * weight) + (6.25 * height) - (5 * age) + 5
  // BMR for women = (10 * weight) + (6.25 * height) - (5 * age) - 161
  const bmr = gender === 'male'
    ? Math.round(10 * weight + 6.25 * height - 5 * age + 5)
    : Math.round(10 * weight + 6.25 * height - 5 * age - 161);

  const tdee = Math.round(bmr * activityLevel);

  let targetCals = tdee;
  if (goal === 'cut') targetCals = Math.round(tdee - 450);
  if (goal === 'bulk') targetCals = Math.round(tdee + 350);

  // Macros:
  // Protein: 2.1g per kg
  const proteinGrams = Math.round(weight * 2.1);
  // Fat: 0.8g per kg
  const fatGrams = Math.round(weight * 0.85);
  // Carbs: remaining
  const carbsGrams = Math.max(50, Math.round((targetCals - (proteinGrams * 4 + fatGrams * 9)) / 4));
  const waterTarget = Math.round(weight * 38);

  const handleSave = () => {
    onSave({
      ...profile,
      weight,
      height,
      age,
      gender,
      activityLevel: activityLevel as any,
      goal,
      targetWeight,
      dailyCalorieTarget: targetCals,
      proteinTarget: proteinGrams,
      carbsTarget: carbsGrams,
      fatTarget: fatGrams,
      waterTargetMl: waterTarget
    });
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden ${
        isDark ? 'bg-[#121826] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="p-6 border-b border-inherit flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Tana Parametrlari & Kaloriya Kalkulyatori</h3>
              <p className="text-xs text-slate-400">Mifflin-St Jeor ilmiy formulasi asosida TDEE hisoblash</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Inputs Row 1: Weight & Target Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Hozirgi Vazn (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className={`w-full py-2.5 px-3.5 text-xs font-mono font-bold rounded-xl border outline-none ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Maqsadli Vazn (kg)</label>
              <input
                type="number"
                step="0.1"
                value={targetWeight}
                onChange={(e) => setTargetWeight(Number(e.target.value))}
                className={`w-full py-2.5 px-3.5 text-xs font-mono font-bold rounded-xl border outline-none ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                }`}
              />
            </div>
          </div>

          {/* Inputs Row 2: Height & Age */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Bo'y (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className={`w-full py-2.5 px-3.5 text-xs font-mono font-bold rounded-xl border outline-none ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Yosh</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className={`w-full py-2.5 px-3.5 text-xs font-mono font-bold rounded-xl border outline-none ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                }`}
              />
            </div>
          </div>

          {/* Gender & Goal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Jins</label>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2 rounded-xl border transition-all cursor-pointer ${
                    gender === 'male'
                      ? 'bg-emerald-500 text-white border-emerald-400'
                      : isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  Erkak 👨
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2 rounded-xl border transition-all cursor-pointer ${
                    gender === 'female'
                      ? 'bg-emerald-500 text-white border-emerald-400'
                      : isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  Ayol 👩
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Maqsad</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as UserGoal)}
                className={`w-full py-2 px-3 text-xs font-bold rounded-xl border outline-none cursor-pointer ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="cut">🔥 Ozish (Fat Loss / Cut)</option>
                <option value="maintain">⚖️ Vaznni ushlash (Maintain)</option>
                <option value="bulk">💪 Mushak o'stirish (Lean Bulk)</option>
              </select>
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">Kunlik Jismoniy Faollik</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(Number(e.target.value))}
              className={`w-full py-2.5 px-3 text-xs font-bold rounded-xl border outline-none cursor-pointer ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value={1.2}>Kam harakatli (Ofis, harakatsiz rejim) [x1.2]</option>
              <option value={1.375}>Yengil mashqlar (haftasiga 1-3 kun) [x1.375]</option>
              <option value={1.55}>O'rtacha faol (haftasiga 3-5 kun sport) [x1.55]</option>
              <option value={1.725}>Yuqori faol (haftasiga 6-7 kun og'ir mashq) [x1.725]</option>
            </select>
          </div>

          {/* Calculated Results Banner */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hisoblangan Yangi Kunlik Me'yor:</span>
              </span>
              <span className="font-mono text-xs text-slate-400">BMR: {bmr} kkal • TDEE: {tdee} kkal</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950/20">
                <span className="text-[10px] block text-slate-400 font-sans">Kaloriya</span>
                <span className="font-extrabold text-emerald-400 text-sm">{targetCals}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/20">
                <span className="text-[10px] block text-slate-400 font-sans">Oqsil</span>
                <span className="font-extrabold text-cyan-400 text-sm">{proteinGrams}g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/20">
                <span className="text-[10px] block text-slate-400 font-sans">Uglevod</span>
                <span className="font-extrabold text-amber-400 text-sm">{carbsGrams}g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/20">
                <span className="text-[10px] block text-slate-400 font-sans">Yog'</span>
                <span className="font-extrabold text-rose-400 text-sm">{fatGrams}g</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 active:scale-98 transition-all cursor-pointer"
          >
            Maqsadlarni Saqlash va Qo'llash
          </button>
        </div>
      </div>
    </div>
  );
}
