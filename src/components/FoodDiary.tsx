import React, { useState } from 'react';
import { Plus, Trash2, Search, Utensils, Sparkles, X, ChevronRight } from 'lucide-react';
import { FOOD_DATABASE } from '../data/mockData';
import type { FoodItem, LoggedMeal } from '../types';
import confetti from 'canvas-confetti';

interface FoodDiaryProps {
  loggedMeals: LoggedMeal[];
  onAddMeal: (meal: Omit<LoggedMeal, 'id' | 'timestamp'>) => void;
  onRemoveMeal: (id: string) => void;
  isDark: boolean;
}

const MEAL_SECTIONS = [
  { type: 'breakfast', title: 'Nonushta', icon: '🌅', color: 'text-amber-500' },
  { type: 'lunch', title: 'Tushlik', icon: '☀️', color: 'text-emerald-500' },
  { type: 'dinner', title: 'Kechki Ovqat', icon: '🌙', color: 'text-indigo-500' },
  { type: 'snack', title: 'Gazaklar & Qahva', icon: '🍎', color: 'text-rose-500' },
] as const;

export default function FoodDiary({ loggedMeals, onAddMeal, onRemoveMeal, isDark }: FoodDiaryProps) {
  const [activeModalMealType, setActiveModalMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [gramWeight, setGramWeight] = useState<number>(100);

  const categories = ['All', 'Proteins', 'Carbs', 'Fats', 'Fruits & Veggies', 'Snacks'];

  const filteredFoods = FOOD_DATABASE.filter(f => {
    const matchCat = selectedCategory === 'All' || f.category === selectedCategory;
    const matchSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleConfirmAdd = () => {
    if (!selectedFood || !activeModalMealType) return;
    const multiplier = gramWeight / 100;
    onAddMeal({
      mealType: activeModalMealType,
      food: selectedFood,
      servings: multiplier
    });
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
    setSelectedFood(null);
    setActiveModalMealType(null);
    setGramWeight(100);
  };

  const getMealTotal = (type: string) => {
    const items = loggedMeals.filter(m => m.mealType === type);
    const calories = items.reduce((acc, m) => acc + Math.round(m.food.calories * m.servings), 0);
    const protein = items.reduce((acc, m) => acc + Math.round(m.food.protein * m.servings), 0);
    const carbs = items.reduce((acc, m) => acc + Math.round(m.food.carbs * m.servings), 0);
    const fat = items.reduce((acc, m) => acc + Math.round(m.food.fat * m.servings), 0);
    return { calories, protein, carbs, fat, count: items.length };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Kunlik Taomnoma & Kaloriya Kundaligi</h2>
            <p className="text-xs text-slate-400">Har bir ovqatlanishdagi kaloriya va makrolarni aniq hisoblang</p>
          </div>
        </div>
      </div>

      {/* Meal Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MEAL_SECTIONS.map(section => {
          const stats = getMealTotal(section.type);
          const items = loggedMeals.filter(m => m.mealType === section.type);

          return (
            <div
              key={section.type}
              className={`p-5 rounded-3xl border transition-all ${
                isDark ? 'bg-[#121826] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-inherit">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{section.icon}</span>
                  <div>
                    <h3 className="font-extrabold text-sm">{section.title}</h3>
                    <p className="text-[11px] text-slate-400">
                      {stats.calories} kkal • {stats.protein}g oqsil
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModalMealType(section.type)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-xs font-extrabold border border-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Qo'shish</span>
                </button>
              </div>

              {/* Items List */}
              <div className="pt-3 space-y-2 min-h-[90px]">
                {items.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    Hozircha taom qo'shilmadi.
                  </div>
                ) : (
                  items.map(m => {
                    const cals = Math.round(m.food.calories * m.servings);
                    const prot = Math.round(m.food.protein * m.servings);
                    const carbs = Math.round(m.food.carbs * m.servings);
                    const fat = Math.round(m.food.fat * m.servings);

                    return (
                      <div
                        key={m.id}
                        className={`p-2.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-lg shrink-0">{m.food.icon}</span>
                          <div className="min-w-0">
                            <h4 className="font-bold truncate">{m.food.name}</h4>
                            <p className="text-[10px] text-slate-400">
                              {Math.round(m.servings * 100)}g • P: {prot}g | C: {carbs}g | F: {fat}g
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono font-extrabold text-emerald-500">
                            {cals} kkal
                          </span>
                          <button
                            onClick={() => onRemoveMeal(m.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                            title="O'chirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Food Modal */}
      {activeModalMealType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden ${
            isDark ? 'bg-[#121826] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="p-5 border-b border-inherit flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base">
                  Taom tanlash: {MEAL_SECTIONS.find(s => s.type === activeModalMealType)?.title}
                </h3>
                <p className="text-xs text-slate-400">Bazadagi 100% tabiiy oziq-ovqatlardan tanlang</p>
              </div>
              <button
                onClick={() => { setActiveModalMealType(null); setSelectedFood(null); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Taom nomini qidirish (masalan: tovuq, losos, suli, tuxum)..."
                  className={`w-full py-2.5 pl-10 pr-4 text-xs rounded-2xl border outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>

              {/* Categories */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategory === c
                        ? 'bg-emerald-500 text-white border-emerald-400 shadow-xs'
                        : isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Foods List */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {filteredFoods.map(f => {
                  const isSelected = selectedFood?.id === f.id;
                  return (
                    <div
                      key={f.id}
                      onClick={() => setSelectedFood(f)}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/10 shadow-xs'
                          : isDark ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-emerald-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{f.icon}</span>
                        <div>
                          <h4 className="font-bold text-xs">{f.name}</h4>
                          <p className="text-[10px] text-slate-400">
                            100g: {f.calories} kkal | P: {f.protein}g | C: {f.carbs}g | F: {f.fat}g
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-emerald-500' : 'text-slate-400'}`} />
                    </div>
                  );
                })}
              </div>

              {/* Gram Weight Slider if Selected */}
              {selectedFood && (
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50/70 border-emerald-200'
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold">Miqdorini belgilang:</span>
                    <span className="font-mono font-extrabold text-emerald-500 text-sm">{gramWeight} gramm</span>
                  </div>

                  <input
                    type="range"
                    min="25"
                    max="500"
                    step="25"
                    value={gramWeight}
                    onChange={(e) => setGramWeight(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />

                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono pt-1">
                    <div className="p-2 rounded-xl bg-slate-900/20">
                      <span className="block text-[10px] text-slate-400">Kaloriya</span>
                      <span className="font-extrabold text-emerald-400">{Math.round((selectedFood.calories * gramWeight) / 100)}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/20">
                      <span className="block text-[10px] text-slate-400">Oqsil</span>
                      <span className="font-extrabold text-cyan-400">{Math.round((selectedFood.protein * gramWeight) / 100)}g</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/20">
                      <span className="block text-[10px] text-slate-400">Uglevod</span>
                      <span className="font-extrabold text-amber-400">{Math.round((selectedFood.carbs * gramWeight) / 100)}g</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/20">
                      <span className="block text-[10px] text-slate-400">Yog'</span>
                      <span className="font-extrabold text-rose-400">{Math.round((selectedFood.fat * gramWeight) / 100)}g</span>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmAdd}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
                  >
                    Taomnoma Ro'yxatiga Qo'shish
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
