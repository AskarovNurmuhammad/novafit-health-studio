import type { FoodItem, Exercise, WorkoutRoutine, WeightEntry, DailyHabit, AchievementBadge, UserProfile } from '../types';

export const INITIAL_PROFILE: UserProfile = {
  name: 'Nurmuhammad',
  weight: 76.5,
  height: 180,
  age: 23,
  gender: 'male',
  activityLevel: 1.55,
  goal: 'cut',
  targetWeight: 72.0,
  dailyCalorieTarget: 2200,
  proteinTarget: 160,
  carbsTarget: 220,
  fatTarget: 60,
  waterTargetMl: 3000,
  dailyStepsTarget: 10000
};

export const FOOD_DATABASE: FoodItem[] = [
  { id: 'f-1', name: 'Tovuq ko\'kragi (pishirilgan)', category: 'Proteins', calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: '100g', icon: '🍗' },
  { id: 'f-2', name: 'Losos balig\'i (Salmon)', category: 'Proteins', calories: 208, protein: 22, carbs: 0, fat: 13, servingSize: '100g', icon: '🐟' },
  { id: 'f-3', name: 'Tuxum (qaynatilgan)', category: 'Proteins', calories: 155, protein: 13, carbs: 1.1, fat: 11, servingSize: '2 dona (100g)', icon: '🥚' },
  { id: 'f-4', name: 'Grek yogurti (0% yog\')', category: 'Proteins', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, servingSize: '100g', icon: '🥛' },
  { id: 'f-5', name: 'Whey Protein izolyati', category: 'Proteins', calories: 120, protein: 25, carbs: 2, fat: 1, servingSize: '1 qoshiq (30g)', icon: '🥤' },
  { id: 'f-6', name: 'Mol go\'shti (kam yog\'li)', category: 'Proteins', calories: 215, protein: 26, carbs: 0, fat: 12, servingSize: '100g', icon: '🥩' },
  { id: 'f-7', name: 'Tofu (tabiiy soya)', category: 'Proteins', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, servingSize: '100g', icon: '🧈' },

  { id: 'f-8', name: 'Suli yormasi (Oatmeal)', category: 'Carbs', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, servingSize: '100g quruq', icon: '🥣' },
  { id: 'f-9', name: 'Qo\'ng\'ir guruch (Brown Rice)', category: 'Carbs', calories: 112, protein: 2.6, carbs: 23.5, fat: 0.9, servingSize: '100g pishgan', icon: '🍚' },
  { id: 'f-10', name: 'Shirin kartoshka (Batat)', category: 'Carbs', calories: 86, protein: 1.6, carbs: 20.1, fat: 0.1, servingSize: '100g', icon: '🍠' },
  { id: 'f-11', name: 'Kinoa yormasi (Quinoa)', category: 'Carbs', calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, servingSize: '100g pishgan', icon: '🌾' },
  { id: 'f-12', name: 'Banan', category: 'Fruits & Veggies', calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, servingSize: '1 dona o\'rtacha', icon: '🍌' },
  { id: 'f-13', name: 'Yashil olma', category: 'Fruits & Veggies', calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2, servingSize: '1 dona (100g)', icon: '🍏' },
  { id: 'f-14', name: 'Brokkoli (bug\'da)', category: 'Fruits & Veggies', calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4, servingSize: '100g', icon: '🥦' },
  { id: 'f-15', name: 'Yangi ismaloq (Spinach)', category: 'Fruits & Veggies', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, servingSize: '100g', icon: '🥬' },

  { id: 'f-16', name: 'Bodom mag\'zi (Almonds)', category: 'Fats', calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9, servingSize: '30g hovuch', icon: '🥜' },
  { id: 'f-17', name: 'Yong\'oq moyi (Peanut butter)', category: 'Fats', calories: 588, protein: 25, carbs: 20, fat: 50, servingSize: '1 osh qoshiq (25g)', icon: '🍯' },
  { id: 'f-18', name: 'Avokado', category: 'Fats', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, servingSize: '100g', icon: '🥑' },
  { id: 'f-19', name: 'Zaytun moyi (Extra virgin)', category: 'Fats', calories: 884, protein: 0, carbs: 0, fat: 100, servingSize: '1 choy qoshiq (10ml)', icon: '🫒' },
  { id: 'f-20', name: 'Qora shokolad (85% kakao)', category: 'Snacks', calories: 598, protein: 7.8, carbs: 36, fat: 46, servingSize: '20g bo\'lak', icon: '🍫' }
];

export const EXERCISE_DATABASE: Exercise[] = [
  { id: 'ex-1', name: 'Shtanga bilan yotib siqish (Bench Press)', targetMuscle: 'Chest', defaultSets: 4, defaultReps: 8, estimatedCaloriesPerMin: 8, instructions: 'Ko\'krak mushaklarini to\'liq cho\'zib, shtangani nazorat bilan ko\'krak o\'rtasiga tushiring va portlovchi kuch bilan ko\'taring.', icon: '🏋️' },
  { id: 'ex-2', name: 'Gantel bilan qiyalikda siqish (Incline DB Press)', targetMuscle: 'Chest', defaultSets: 3, defaultReps: 10, estimatedCaloriesPerMin: 7.5, instructions: 'Skameykangizni 30-45 gradusga qo\'ying, yuqori ko\'krak qismini zo\'riqtiring.', icon: '💪' },
  { id: 'ex-3', name: 'Otjimaniya (Push-Ups)', targetMuscle: 'Chest', defaultSets: 3, defaultReps: 15, estimatedCaloriesPerMin: 6, instructions: 'Gavdani tekis tuting, qorinni taranglashtiring va ko\'krakni deyarli yerga tekkazing.', icon: '🤸' },

  { id: 'ex-4', name: 'Turnikda tortilish (Pull-Ups)', targetMuscle: 'Back', defaultSets: 4, defaultReps: 8, estimatedCaloriesPerMin: 8.5, instructions: 'Keng ushlash bilan gavdani iyak turnikdan o\'tgunicha yuqoriga torting, kuraklarni qisqartiring.', icon: '🧗' },
  { id: 'ex-5', name: 'Stanovaya tyaga (Barbell Deadlift)', targetMuscle: 'Back', defaultSets: 4, defaultReps: 6, estimatedCaloriesPerMin: 11, instructions: 'Orqa umurtqasini tekis tutib, oyoq va orqa quvvati bilan shtangani yerdan ko\'taring.', icon: '⚡' },
  { id: 'ex-6', name: 'Gorizontal blok tortish (Cable Row)', targetMuscle: 'Back', defaultSets: 3, defaultReps: 12, estimatedCaloriesPerMin: 7, instructions: 'Tutqichni qorin pastki qismiga torting va orqa mushaklarini 1 soniya qisib turing.', icon: '🚣' },

  { id: 'ex-7', name: 'Shtanga bilan o\'tirib-turish (Barbell Squat)', targetMuscle: 'Legs', defaultSets: 4, defaultReps: 8, estimatedCaloriesPerMin: 10, instructions: 'Oyoqlarni yelka kengligida qo\'ying, sonlar yerga parallel bo\'lguncha tizzalarni buking.', icon: '🦵' },
  { id: 'ex-8', name: 'Ruminiya tyagasi (Romanian Deadlift)', targetMuscle: 'Legs', defaultSets: 3, defaultReps: 10, estimatedCaloriesPerMin: 8, instructions: 'Tizzalarni biroz bukib, son orqa qismini cho\'zgan holda gavdani oldinga egiltiring.', icon: '🔥' },
  { id: 'ex-9', name: 'Leg Press trenajyori', targetMuscle: 'Legs', defaultSets: 4, defaultReps: 12, estimatedCaloriesPerMin: 7.5, instructions: 'Platformani to\'piqlar bilan itaring, eng yuqori nuqtada tizzalarni qulflamang.', icon: '🛡️' },

  { id: 'ex-10', name: 'Armiya siqishi (Overhead Press)', targetMuscle: 'Shoulders', defaultSets: 4, defaultReps: 8, estimatedCaloriesPerMin: 8, instructions: 'Tik turgan holda shtangani bosh uzra tekis ko\'taring, tanani tebratmaslikka intiling.', icon: '🎯' },
  { id: 'ex-11', name: 'Yonboshga gantel ko\'tarish (Lateral Raises)', targetMuscle: 'Shoulders', defaultSets: 4, defaultReps: 12, estimatedCaloriesPerMin: 6, instructions: 'Tirsaklarni yengil buking va gantellarni yelka balandligigacha sekin ko\'taring.', icon: '🦅' },

  { id: 'ex-12', name: 'Biceps shtanga ko\'tarish (Bicep Curl)', targetMuscle: 'Arms', defaultSets: 3, defaultReps: 12, estimatedCaloriesPerMin: 6, instructions: 'Tirsaklarni qovurg\'aga yopishtirib, faqat qo\'l kuchi bilan shtangani ko\'taring.', icon: '💪' },
  { id: 'ex-13', name: 'Brusda siqilish (Dips)', targetMuscle: 'Arms', defaultSets: 3, defaultReps: 10, estimatedCaloriesPerMin: 7, instructions: 'Gavdani tirsaklar 90 gradus burchak hosil qilguncha tushiring va triceps kuchi bilan qayting.', icon: '⛓️' },

  { id: 'ex-14', name: 'Planka (Core Plank)', targetMuscle: 'Core', defaultSets: 3, defaultReps: 60, estimatedCaloriesPerMin: 5, instructions: 'Tirsak va oyoq uchlariga tayanib, gavdani bir chiziqda 60 soniya tarang holatda ushlang.', icon: '🧘' },
  { id: 'ex-15', name: 'Turnikda oyoq ko\'tarish (Hanging Leg Raise)', targetMuscle: 'Core', defaultSets: 3, defaultReps: 12, estimatedCaloriesPerMin: 6.5, instructions: 'Turnikda osilib, tizzalarni yoki tekis oyoqlarni ko\'krak darajasiga ko\'taring.', icon: '⚡' },
  { id: 'ex-16', name: 'Arqon sakrash (Jump Rope HIIT)', targetMuscle: 'Cardio', defaultSets: 4, defaultReps: 100, estimatedCaloriesPerMin: 13, instructions: 'Yuqori tezlikda 1 daqiqa sakrang va 30 soniya dam oling.', icon: '🏃' }
];

export const WORKOUT_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'routine-1',
    title: 'Push Power (Ko\'krak, Yelka, Triceps)',
    category: 'Hypertrophy',
    durationMin: 50,
    difficulty: 'Intermediate',
    coverUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
    exercises: [
      { exercise: EXERCISE_DATABASE[0], sets: 4, reps: 8, weightKg: 75 },
      { exercise: EXERCISE_DATABASE[1], sets: 3, reps: 10, weightKg: 24 },
      { exercise: EXERCISE_DATABASE[9], sets: 4, reps: 8, weightKg: 45 },
      { exercise: EXERCISE_DATABASE[10], sets: 3, reps: 12, weightKg: 10 },
      { exercise: EXERCISE_DATABASE[12], sets: 3, reps: 10, weightKg: 0 }
    ]
  },
  {
    id: 'routine-2',
    title: 'Pull Strength (Orqa, Trapeziya, Biceps)',
    category: 'Strength',
    durationMin: 55,
    difficulty: 'Advanced',
    coverUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
    exercises: [
      { exercise: EXERCISE_DATABASE[4], sets: 4, reps: 6, weightKg: 110 },
      { exercise: EXERCISE_DATABASE[3], sets: 4, reps: 8, weightKg: 0 },
      { exercise: EXERCISE_DATABASE[5], sets: 3, reps: 12, weightKg: 55 },
      { exercise: EXERCISE_DATABASE[11], sets: 3, reps: 12, weightKg: 30 }
    ]
  },
  {
    id: 'routine-3',
    title: 'Leg Day Titan (Kvadriseps, Hamstring, Boldir)',
    category: 'Strength',
    durationMin: 50,
    difficulty: 'Advanced',
    coverUrl: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=600&auto=format&fit=crop&q=80',
    exercises: [
      { exercise: EXERCISE_DATABASE[6], sets: 4, reps: 8, weightKg: 95 },
      { exercise: EXERCISE_DATABASE[7], sets: 3, reps: 10, weightKg: 70 },
      { exercise: EXERCISE_DATABASE[8], sets: 3, reps: 12, weightKg: 160 }
    ]
  },
  {
    id: 'routine-4',
    title: 'Yog\' Erityuvchi Full-Body HIIT',
    category: 'HIIT',
    durationMin: 35,
    difficulty: 'Intermediate',
    coverUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    exercises: [
      { exercise: EXERCISE_DATABASE[15], sets: 5, reps: 100, weightKg: 0 },
      { exercise: EXERCISE_DATABASE[2], sets: 4, reps: 15, weightKg: 0 },
      { exercise: EXERCISE_DATABASE[13], sets: 3, reps: 60, weightKg: 0 },
      { exercise: EXERCISE_DATABASE[14], sets: 3, reps: 12, weightKg: 0 }
    ]
  }
];

export const INITIAL_WEIGHT_HISTORY: WeightEntry[] = [
  { id: 'w-1', date: '2026-11-10', weightKg: 78.4, bodyFatPercent: 18.2 },
  { id: 'w-2', date: '2026-11-13', weightKg: 77.9, bodyFatPercent: 17.8 },
  { id: 'w-3', date: '2026-11-16', weightKg: 77.3, bodyFatPercent: 17.5 },
  { id: 'w-4', date: '2026-11-19', weightKg: 76.9, bodyFatPercent: 17.1 },
  { id: 'w-5', date: '2026-11-23', weightKg: 76.5, bodyFatPercent: 16.8 }
];

export const INITIAL_HABITS: DailyHabit[] = [
  { id: 'h-1', title: '160g oqsil normasini to\'ldirish', target: '160g Protein', icon: '🥩', completed: true },
  { id: 'h-2', title: '3 Litr toza suv ichish', target: '3000 ml', icon: '💧', completed: true },
  { id: 'h-3', title: '10,000 qadam piyoda yurish', target: '10,000 qadam', icon: '👟', completed: false },
  { id: 'h-4', title: 'Kunlik 45 daqiqalik mashg\'ulot', target: 'Workout 45m', icon: '🏋️', completed: true },
  { id: 'h-5', title: '7.5 - 8 soat sifatli uyqu', target: '8 soat', icon: '🌙', completed: false }
];

export const INITIAL_BADGES: AchievementBadge[] = [
  { id: 'b-1', title: 'Gidratatsiya Ustasi', description: 'Kunlik 3 litr suv normasiga 5 kun ketma-ket erishildi', icon: '💧', unlocked: true, unlockedAt: '2026-11-20' },
  { id: 'b-2', title: 'Protein Snayperi', description: 'Kunlik oqsil normasini 100% aniqlik bilan yopildi', icon: '🎯', unlocked: true, unlockedAt: '2026-11-22' },
  { id: 'b-3', title: 'Titan Kuch', description: 'Birinchi 100kg shtanga bilan mashq bajarildi', icon: '⚡', unlocked: true, unlockedAt: '2026-11-18' },
  { id: 'b-4', title: '7-Kunlik Chempion', description: '7 kun davomida doimiy mashq va rejim uzilmadi', icon: '🔥', unlocked: true, unlockedAt: '2026-11-23' },
  { id: 'b-5', title: 'Target Vazan', description: 'Maqsadli 72kg vaznga to\'liq erishilganda ochiladi', icon: '🏆', unlocked: false }
];
