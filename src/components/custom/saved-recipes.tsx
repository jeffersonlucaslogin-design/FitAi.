'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Clock } from 'lucide-react'
import { getUserRecipes, deleteRecipe, getDaysRemaining, type Recipe } from '@/lib/recipes'
import { Badge } from '@/components/ui/badge'

interface SavedRecipesProps {
  userId: string
}

export function SavedRecipes({ userId }: SavedRecipesProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  useEffect(() => {
    loadRecipes()
  }, [userId])

  async function loadRecipes() {
    try {
      setLoading(true)
      const data = await getUserRecipes(userId)
      setRecipes(data)
    } catch (error) {
      console.error('Erro ao carregar receitas:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(recipeId: string) {
    try {
      await deleteRecipe(recipeId, userId)
      setRecipes(recipes.filter(r => r.id !== recipeId))
      if (selectedRecipe?.id === recipeId) {
        setSelectedRecipe(null)
      }
    } catch (error) {
      console.error('Erro ao deletar receita:', error)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Carregando receitas salvas...</p>
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Nenhuma receita salva ainda. Gere sua primeira receita!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Minhas Receitas Salvas</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Lista de Receitas */}
        <div className="space-y-4">
          {recipes.map((recipe) => {
            const daysRemaining = getDaysRemaining(recipe.expires_at)
            
            return (
              <Card 
                key={recipe.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedRecipe?.id === recipe.id ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => setSelectedRecipe(recipe)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{recipe.food_name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4" />
                        {daysRemaining === 0 ? (
                          <span className="text-red-600 font-medium">Expira hoje</span>
                        ) : daysRemaining === 1 ? (
                          <span className="text-orange-600 font-medium">Expira amanhã</span>
                        ) : (
                          <span>Expira em {daysRemaining} dias</span>
                        )}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(recipe.id)
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{recipe.calories} kcal</Badge>
                    <Badge variant="secondary">{recipe.proteins}g proteína</Badge>
                    <Badge variant="secondary">{recipe.carbs}g carbo</Badge>
                    <Badge variant="secondary">{recipe.fats}g gordura</Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Detalhes da Receita Selecionada */}
        {selectedRecipe && (
          <Card className="sticky top-4 h-fit">
            <CardHeader>
              <CardTitle>{selectedRecipe.food_name}</CardTitle>
              <CardDescription>
                Criada em {new Date(selectedRecipe.created_at).toLocaleDateString('pt-BR')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Calorias</p>
                  <p className="text-xl font-bold text-green-600">{selectedRecipe.calories}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Proteínas</p>
                  <p className="text-xl font-bold text-blue-600">{selectedRecipe.proteins}g</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Carboidratos</p>
                  <p className="text-xl font-bold text-orange-600">{selectedRecipe.carbs}g</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Gorduras</p>
                  <p className="text-xl font-bold text-purple-600">{selectedRecipe.fats}g</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Receita Completa:</h3>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedRecipe.recipe_text}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
