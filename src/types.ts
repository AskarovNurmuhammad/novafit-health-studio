export type UserGoal = 'cut' | 'bulk' | 'maintain';

export interface UserProfile {
  name: string;
  weight: number; // kg
  height: number; // cm
  age: number;
  gender: 'male' | 'female';
  activityLevel: 1.2 | 1.375 | 1.55 | 1.725 | 1.9;
  goal: UserGoal;
  targetWeight: number; // kg
  dailyCalorieTarget: number;
  proteinTarget: number; // g
  carbsTarget: number; // g
  fatTarget: number; // g
  waterTargetMl: number; // ml
  dailyStepsTarget: number;
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'Proteins' | 'Carbs' | 'Fats' | 'Fruits & Veggies' | 'Snacks' | 'Drinks';
  calories: number; // per 100g or serving
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  servingSize: string;
  icon: string;
}

export interface LoggedMeal {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food: FoodItem;
  servings: number; // multiplier e.g. 1.5 = 150g
  timestamp: string;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Cardio';
  defaultSets: number;
  defaultReps: number;
  estimatedCaloriesPerMin: number;
  instructions: string;
  icon: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  category: 'Strength' | 'HIIT' | 'Hypertrophy' | 'Cardio' | 'Mobility';
  durationMin: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  coverUrl: string;
  exercises: {
    exercise: Exercise;
    sets: number;
    reps: number;
    weightKg?: number;
  }[];
}

export interface WeightEntry {
  id: string;
  date: string;
  weightKg: number;
  bodyFatPercent?: number;
}

export interface DailyHabit {
  id: string;
  title: string;
  target: string;
  icon: string;
  completed: boolean;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}
