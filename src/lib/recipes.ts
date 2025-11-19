import { createClient } from '@/lib/supabase'

export interface Recipe {
  id: string
  user_id: string
  food_name: string
  calories: number
  proteins: number
  carbs: number
  fats: number
  recipe_text: string
  created_at: string
  expires_at: string
}

export async function saveRecipe(
  userId: string,
  foodName: string,
  calories: number,
  proteins: number,
  carbs: number,
  fats: number,
  recipeText: string
) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('recipes')
    .insert({
      user_id: userId,
      food_name: foodName,
      calories,
      proteins,
      carbs,
      fats,
      recipe_text: recipeText
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserRecipes(userId: string) {
  const supabase = createClient()
  
  // Busca apenas receitas que ainda não expiraram
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('user_id', userId)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Recipe[]
}

export async function deleteExpiredRecipes() {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('recipes')
    .delete()
    .lt('expires_at', new Date().toISOString())

  if (error) throw error
}

export async function deleteRecipe(recipeId: string, userId: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', recipeId)
    .eq('user_id', userId)

  if (error) throw error
}

export function getDaysRemaining(expiresAt: string): number {
  const now = new Date()
  const expires = new Date(expiresAt)
  const diffTime = expires.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}
