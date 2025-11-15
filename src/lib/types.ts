// FitIA - Types
export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number; // kg
  height: number; // cm
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  goal: 'lose' | 'maintain' | 'gain';
  targetWeight?: number;
}

export interface FoodAnalysis {
  foodName: string;
  estimatedWeight: number; // gramas
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealAnalysis {
  foods: FoodAnalysis[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  timestamp: Date;
}

export interface DailyMeal {
  name: string;
  time: string;
  foods: string[];
  calories: number;
}

export interface WeeklyNutritionPlan {
  dailyCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  weekPlan: {
    day: string;
    dayNumber: number;
    meals: DailyMeal[];
  }[];
  tips: string[];
  waterIntake: string;
  supplements?: string[];
}

export interface NutritionPlan {
  dailyCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: {
    name: string;
    time: string;
    foods: string[];
    calories: number;
  }[];
  tips: string[];
}

export interface WorkoutPlan {
  type: 'home' | 'gym';
  goal: string;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    rest: string;
    calories: number;
    description: string;
  }[];
  totalCalories: number;
  duration: string;
}

export interface ProgressData {
  date: string;
  weight: number;
  caloriesIn: number;
  caloriesOut: number;
  waterIntake: number;
}
