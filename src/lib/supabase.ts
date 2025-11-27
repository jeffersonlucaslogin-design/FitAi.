import { createClient } from '@supabase/supabase-js';

// Verificar se as variáveis de ambiente estão disponíveis
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente do Supabase não configuradas');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

// Tipos do banco de dados
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  activity_level: string;
  goal: string;
  target_weight: number;
  created_at: string;
  updated_at: string;
}

export interface ProgressEntry {
  id: string;
  user_id: string;
  date: string;
  weight: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  workout_completed: boolean;
  notes: string;
  created_at: string;
}

export interface NutritionPlan {
  id: string;
  user_id: string;
  plan_data: any;
  created_at: string;
}

export interface Workout {
  id: string;
  user_id: string;
  workout_data: any;
  created_at: string;
}
