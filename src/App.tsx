import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Flame,
  Utensils,
  Dumbbell,
  Scale,
  Award,
  Sun,
  Moon,
  Settings,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Droplet,
  Plus,
  Play,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Footprints
} from 'lucide-react';
import confetti from 'canvas-confetti';
import MacroRing from './components/MacroRing';
import WaterTracker from './components/WaterTracker';
import FoodDiary from './components/FoodDiary';
import WorkoutStudio from './components/WorkoutStudio';
import WeightChart from './components/WeightChart';
import HabitsAndBadges from './components/HabitsAndBadges';
import BodyMetricsModal from './components/BodyMetricsModal';
import {
  INITIAL_PROFILE,
  INITIAL_WEIGHT_HISTORY,
  INITIAL_HABITS,
  INITIAL_BADGES,
  FOOD_DATABASE
} from './data/mockData';
import type { UserProfile, LoggedMeal, WeightEntry, DailyHabit, AchievementBadge } from './types';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const isDark = theme === 'dark';

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'nutrition' | 'workouts' | 'weight' | 'habits'>('dashboard');

  // User Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('novafit_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  // Logged Meals
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>(() => {
    const saved = localStorage.getItem('novafit_meals');
    if (saved) return JSON.parse(saved);
    // Initial sample meal
    return [
      {
        id: 'm-init-1',
        mealType: 'breakfast',
        food: FOOD_DATABASE[7], // Oatmeal
        servings: 1,
        timestamp: new Date().toISOString()
      },
      {
        id: 'm-init-2',
        mealType: 'breakfast',
        food: FOOD_DATABASE[2], // Eggs
        servings: 1.5,
        timestamp: new Date().toISOString()
      },
      {
        id: 'm-init-3',
        mealType: 'lunch',
        food: FOOD_DATABASE[0], // Chicken Breast
        servings: 2,
        timestamp: new Date().toISOString()
      },
      {
        id: 'm-init-4',
        mealType: 'lunch',
        food: FOOD_DATABASE[8], // Brown Rice
        servings: 1.5,
        timestamp: new Date().toISOString()
      }
    ];
  });

  // Water intake
  const [waterIntakeMl, setWaterIntakeMl] = useState<number>(() => {
    const saved = localStorage.getItem('novafit_water');
    return saved ? Number(saved) : 1750;
  });

  // Active calories burned
  const [activeCaloriesBurned, setActiveCaloriesBurned] = useState<number>(() => {
    const saved = localStorage.getItem('novafit_burned');
    return saved ? Number(saved) : 420;
  });

  // Daily steps
  const [stepsCount, setStepsCount] = useState<number>(() => {
    const saved = localStorage.getItem('novafit_steps');
    return saved ? Number(saved) : 7480;
  });

  // Weight entries
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(() => {
    const saved = localStorage.getItem('novafit_weights');
    return saved ? JSON.parse(saved) : INITIAL_WEIGHT_HISTORY;
  });

  // Habits
  const [habits, setHabits] = useState<DailyHabit[]>(() => {
    const saved = localStorage.getItem('novafit_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  // Badges
  const [badges, setBadges] = useState<AchievementBadge[]>(() => {
    const saved = localStorage.getItem('novafit_badges');
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  // Metrics Modal state
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('novafit_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('novafit_meals', JSON.stringify(loggedMeals));
  }, [loggedMeals]);

  useEffect(() => {
    localStorage.setItem('novafit_water', waterIntakeMl.toString());
  }, [waterIntakeMl]);

  useEffect(() => {
    localStorage.setItem('novafit_burned', activeCaloriesBurned.toString());
  }, [activeCaloriesBurned]);

  useEffect(() => {
    localStorage.setItem('novafit_steps', stepsCount.toString());
  }, [stepsCount]);

  useEffect(() => {
    localStorage.setItem('novafit_weights', JSON.stringify(weightEntries));
  }, [weightEntries]);

  useEffect(() => {
    localStorage.setItem('novafit_habits', JSON.stringify(habits));
  }, [habits]);

  // Total Calories and Macros from Logged Meals
  const totals = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    loggedMeals.forEach(m => {
      calories += Math.round(m.food.calories * m.servings);
      protein += Math.round(m.food.protein * m.servings);
      carbs += Math.round(m.food.carbs * m.servings);
      fat += Math.round(m.food.fat * m.servings);
    });

    return { calories, protein, carbs, fat };
  }, [loggedMeals]);

  const caloriesRemaining = Math.max(0, profile.dailyCalorieTarget - totals.calories);
  const netCalories = totals.calories - activeCaloriesBurned;

  // Handlers
  const handleAddMeal = (meal: Omit<LoggedMeal, 'id' | 'timestamp'>) => {
    const newMeal: LoggedMeal = {
      ...meal,
      id: `meal-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setLoggedMeals(prev => [newMeal, ...prev]);
  };

  const handleRemoveMeal = (id: string) => {
    setLoggedMeals(prev => prev.filter(m => m.id !== id));
  };

  const handleCompleteWorkout = (caloriesBurned: number, durationMin: number) => {
    setActiveCaloriesBurned(prev => prev + caloriesBurned);
    // Automatically tick workout habit
    setHabits(prev => prev.map(h => h.id === 'h-4' ? { ...h, completed: true } : h));
  };

  const handleToggleHabit = (id: string) => {
    setHabits(prev =>
      prev.map(h => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  const handleAddWeight = (entry: WeightEntry) => {
    setWeightEntries(prev => [...prev, entry]);
    setProfile(prev => ({ ...prev, weight: entry.weightKg }));
  };

  const themeClasses = {
    appBg: isDark ? 'bg-[#0a0d14] text-slate-100' : 'bg-[#f8fafc] text-slate-900',
    headerBg: isDark ? 'bg-[#0f1422]/90 border-slate-800' : 'bg-white/90 border-slate-200 shadow-xs',
    card: isDark ? 'bg-[#121826] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-xs',
    panelBg: isDark ? 'bg-[#0f1422] border-slate-800' : 'bg-slate-100 border-slate-200',
    activeTab: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20',
    inactiveTab: isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900',
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${themeClasses.appBg}`}>

      {/* TOP HEADER BAR */}
      <header className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 lg:px-8 py-3 transition-colors ${themeClasses.headerBg}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  NovaFit
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase">
                  Studio Pro
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                Smart Fitness, Macro Nutrition & Workout Analytics
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className={`hidden md:flex items-center gap-1 p-1 rounded-2xl border text-xs font-bold ${themeClasses.panelBg}`}>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dashboard' ? themeClasses.activeTab : themeClasses.inactiveTab
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Boshqaruv</span>
            </button>

            <button
              onClick={() => setActiveTab('nutrition')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'nutrition' ? themeClasses.activeTab : themeClasses.inactiveTab
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Taomnoma</span>
            </button>

            <button
              onClick={() => setActiveTab('workouts')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'workouts' ? themeClasses.activeTab : themeClasses.inactiveTab
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Mashg'ulotlar</span>
            </button>

            <button
              onClick={() => setActiveTab('weight')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'weight' ? themeClasses.activeTab : themeClasses.inactiveTab
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Vazn & Tahlil</span>
            </button>

            <button
              onClick={() => setActiveTab('habits')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'habits' ? themeClasses.activeTab : themeClasses.inactiveTab
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Odatlar</span>
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMetricsModalOpen(true)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isDark ? 'bg-slate-900 border-slate-700 hover:border-emerald-500' : 'bg-white border-slate-300 hover:border-emerald-500 shadow-xs'
              }`}
              title="Tana parametrlari kalkulyatori"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Kalkulyator</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDark ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-white border-slate-200 text-slate-700 shadow-xs'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-between gap-1 pt-2.5 border-t border-inherit mt-2 text-xs font-bold overflow-x-auto scrollbar-none">
          <button onClick={() => setActiveTab('dashboard')} className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-emerald-500 text-white' : themeClasses.inactiveTab}`}>Boshqaruv</button>
          <button onClick={() => setActiveTab('nutrition')} className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'nutrition' ? 'bg-emerald-500 text-white' : themeClasses.inactiveTab}`}>Taomnoma</button>
          <button onClick={() => setActiveTab('workouts')} className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'workouts' ? 'bg-emerald-500 text-white' : themeClasses.inactiveTab}`}>Mashqlar</button>
          <button onClick={() => setActiveTab('weight')} className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'weight' ? 'bg-emerald-500 text-white' : themeClasses.inactiveTab}`}>Vazn</button>
          <button onClick={() => setActiveTab('habits')} className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'habits' ? 'bg-emerald-500 text-white' : themeClasses.inactiveTab}`}>Odatlar</button>
        </div>
      </header>

      {/* MAIN BODY VIEW */}
      <main className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-8 space-y-8 flex-1">

        {/* 1. DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">

            {/* HERO CALORIE & MACRO TRACKER BANNER */}
            <div className={`${themeClasses.card} rounded-3xl p-6 sm:p-8 border shadow-xl relative overflow-hidden`}>
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">

                {/* Left: Overall Calories Highlight */}
                <div className="space-y-3 text-center lg:text-left max-w-sm">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Bugungi Balans: {profile.goal === 'cut' ? 'Ozish Rejimi (Defitsit)' : profile.goal === 'bulk' ? 'Mushak Yig\'ish (Profitsit)' : 'Vaznni Ushlash'}</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    {totals.calories} <span className="text-lg font-bold text-slate-400">/ {profile.dailyCalorieTarget} kkal</span>
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Kunlik me'yorni to'ldirish uchun yana <span className="font-bold text-emerald-400 font-mono">{caloriesRemaining} kkal</span> qoldi.
                  </p>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs font-mono">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-900/30 border border-inherit">
                      <span className="text-[10px] text-slate-400 block font-sans">Mashqda Yongan</span>
                      <span className="font-extrabold text-amber-400">-{activeCaloriesBurned} kkal</span>
                    </div>

                    <div className="px-3 py-1.5 rounded-xl bg-slate-900/30 border border-inherit">
                      <span className="text-[10px] text-slate-400 block font-sans">Net Balans</span>
                      <span className="font-extrabold text-emerald-400">{netCalories} kkal</span>
                    </div>

                    <div className="px-3 py-1.5 rounded-xl bg-slate-900/30 border border-inherit">
                      <span className="text-[10px] text-slate-400 block font-sans">Qadamlar</span>
                      <span className="font-extrabold text-cyan-400">{stepsCount} / {profile.dailyStepsTarget}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Macro Progress Rings */}
                <div className="grid grid-cols-3 gap-6 sm:gap-10">
                  <MacroRing
                    current={totals.protein}
                    target={profile.proteinTarget}
                    label="Oqsil (Protein)"
                    unit="g"
                    color="cyan"
                    size={115}
                  />

                  <MacroRing
                    current={totals.carbs}
                    target={profile.carbsTarget}
                    label="Uglevod (Carbs)"
                    unit="g"
                    color="amber"
                    size={115}
                  />

                  <MacroRing
                    current={totals.fat}
                    target={profile.fatTarget}
                    label="Yog'lar (Fats)"
                    unit="g"
                    color="rose"
                    size={115}
                  />
                </div>
              </div>

              {/* Ambient Glow */}
              <div className="absolute right-[-5%] top-[-20%] w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* 2-COLUMN SECTION: WATER TRACKER & QUICK ACTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Water Card */}
              <WaterTracker
                currentMl={waterIntakeMl}
                targetMl={profile.waterTargetMl}
                onUpdate={setWaterIntakeMl}
                isDark={isDark}
              />

              {/* Quick Actions Card */}
              <div className={`${themeClasses.card} rounded-3xl p-6 border flex flex-col justify-between`}>
                <div>
                  <h3 className="font-extrabold text-base mb-1">Tezkor Amallar & Mashq Holati</h3>
                  <p className="text-xs text-slate-400 mb-4">Bir bosish orqali kundalikka yangi ma'lumot kiriting</p>

                  <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                    <button
                      onClick={() => setActiveTab('nutrition')}
                      className="p-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 flex items-center gap-2.5 transition-all cursor-pointer active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Taom Qo'shish</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('workouts')}
                      className="p-3.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 border border-cyan-500/20 flex items-center gap-2.5 transition-all cursor-pointer active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                      <span>Mashq Boshlash</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('weight')}
                      className="p-3.5 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 flex items-center gap-2.5 transition-all cursor-pointer active:scale-95"
                    >
                      <Scale className="w-4 h-4" />
                      <span>Vazn Kiritish</span>
                    </button>

                    <button
                      onClick={() => {
                        setStepsCount(prev => prev + 1000);
                        confetti({ particleCount: 20, spread: 35, origin: { y: 0.8 } });
                      }}
                      className="p-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 flex items-center gap-2.5 transition-all cursor-pointer active:scale-95"
                    >
                      <Footprints className="w-4 h-4" />
                      <span>+1,000 Qadam</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-inherit flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>Hozirgi Vazn: <strong className="text-white font-mono">{profile.weight} kg</strong></span>
                  <span>Maqsad: <strong className="text-emerald-400 font-mono">{profile.targetWeight} kg</strong></span>
                </div>
              </div>
            </div>

            {/* RECENT LOGGED MEALS PREVIEW */}
            <div className={`${themeClasses.card} rounded-3xl p-6 border space-y-4`}>
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-emerald-400" />
                  <span>Bugun Eslangan Taomlar ({loggedMeals.length})</span>
                </h3>
                <button
                  onClick={() => setActiveTab('nutrition')}
                  className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
                >
                  Hammasini ko'rish & Qo'shish →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {loggedMeals.slice(0, 4).map(m => (
                  <div
                    key={m.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                      isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl">{m.food.icon}</span>
                      <div className="min-w-0">
                        <h4 className="font-bold truncate">{m.food.name}</h4>
                        <p className="text-[10px] text-slate-400">{Math.round(m.servings * 100)}g</p>
                      </div>
                    </div>
                    <span className="font-mono font-extrabold text-emerald-400">
                      {Math.round(m.food.calories * m.servings)} kkal
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. NUTRITION & FOOD DIARY */}
        {activeTab === 'nutrition' && (
          <div className="animate-fadeIn">
            <FoodDiary
              loggedMeals={loggedMeals}
              onAddMeal={handleAddMeal}
              onRemoveMeal={handleRemoveMeal}
              isDark={isDark}
            />
          </div>
        )}

        {/* 3. WORKOUTS & LIVE TIMER */}
        {activeTab === 'workouts' && (
          <div className="animate-fadeIn">
            <WorkoutStudio
              onCompleteWorkout={handleCompleteWorkout}
              isDark={isDark}
            />
          </div>
        )}

        {/* 4. WEIGHT TRACKER & BMI */}
        {activeTab === 'weight' && (
          <div className="animate-fadeIn">
            <WeightChart
              entries={weightEntries}
              targetWeight={profile.targetWeight}
              heightCm={profile.height}
              onAddEntry={handleAddWeight}
              isDark={isDark}
            />
          </div>
        )}

        {/* 5. HABITS & BADGES */}
        {activeTab === 'habits' && (
          <div className="animate-fadeIn">
            <HabitsAndBadges
              habits={habits}
              badges={badges}
              streakDays={7}
              onToggleHabit={handleToggleHabit}
              isDark={isDark}
            />
          </div>
        )}
      </main>

      {/* METRICS & CALORIE CALCULATOR MODAL */}
      <BodyMetricsModal
        isOpen={isMetricsModalOpen}
        onClose={() => setIsMetricsModalOpen(false)}
        profile={profile}
        onSave={setProfile}
        isDark={isDark}
      />
    </div>
  );
}
