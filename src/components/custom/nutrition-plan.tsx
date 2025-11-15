'use client';

import { useState } from 'react';
import { Utensils, Loader2, Clock, Flame, Calendar, Droplets, Pill, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateWeeklyNutritionPlan } from '@/lib/openai';
import type { UserProfile, WeeklyNutritionPlan } from '@/lib/types';

interface NutritionPlanProps {
  profile: UserProfile;
}

export default function NutritionPlanComponent({ profile }: NutritionPlanProps) {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<WeeklyNutritionPlan | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateWeeklyNutritionPlan(profile);
      setPlan(result);
      setExpandedDay(1); // Expande o primeiro dia por padrão
    } catch (error) {
      console.error('Erro ao gerar plano:', error);
      alert('Erro ao gerar plano nutricional. Verifique sua chave da OpenAI.');
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (dayNumber: number) => {
    setExpandedDay(expandedDay === dayNumber ? null : dayNumber);
  };

  return (
    <div className="space-y-6">
      <Card className="border-emerald-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <Calendar className="w-6 h-6" />
            Dieta Semanal Personalizada
          </CardTitle>
          <CardDescription>
            Plano nutricional completo para 7 dias focado em perda de peso saudável
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {!plan ? (
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-6 rounded-2xl">
                <Utensils className="w-16 h-16 mx-auto mb-4 text-emerald-600" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Nutricionista IA Especializada
                </h3>
                <p className="text-gray-600 mb-4">
                  Gere uma dieta completa para a semana baseada em:
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm text-left max-w-md mx-auto">
                  <div className="bg-white/60 p-3 rounded-lg">
                    <p className="font-semibold text-emerald-700">Seus Dados</p>
                    <p className="text-gray-600">Peso, altura, idade</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg">
                    <p className="font-semibold text-emerald-700">Objetivo</p>
                    <p className="text-gray-600">Perda de peso</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg">
                    <p className="font-semibold text-emerald-700">Nutrientes</p>
                    <p className="text-gray-600">Dieta balanceada</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg">
                    <p className="font-semibold text-emerald-700">Variedade</p>
                    <p className="text-gray-600">7 dias diferentes</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={loading}
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-6 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Gerando dieta semanal...
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5 mr-2" />
                    Gerar Dieta para a Semana
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Metas Diárias */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border-2 border-emerald-200">
                <h3 className="font-bold text-lg text-emerald-800 mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5" />
                  Metas Nutricionais Diárias
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl text-center shadow-sm">
                    <Flame className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                    <p className="text-sm text-gray-600 font-medium">Calorias</p>
                    <p className="text-2xl font-bold text-orange-600">{plan.dailyCalories}</p>
                    <p className="text-xs text-gray-500">kcal/dia</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl text-center shadow-sm">
                    <p className="text-sm text-gray-600 font-medium">Proteínas</p>
                    <p className="text-2xl font-bold text-blue-600">{plan.protein}g</p>
                    <p className="text-xs text-gray-500">por dia</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl text-center shadow-sm">
                    <p className="text-sm text-gray-600 font-medium">Carboidratos</p>
                    <p className="text-2xl font-bold text-yellow-600">{plan.carbs}g</p>
                    <p className="text-xs text-gray-500">por dia</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl text-center shadow-sm">
                    <p className="text-sm text-gray-600 font-medium">Gorduras</p>
                    <p className="text-2xl font-bold text-purple-600">{plan.fat}g</p>
                    <p className="text-xs text-gray-500">por dia</p>
                  </div>
                </div>
              </div>

              {/* Hidratação e Suplementos */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">Hidratação</h4>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">{plan.waterIntake}</p>
                  <p className="text-sm text-blue-600">de água por dia</p>
                </div>
                {plan.supplements && plan.supplements.length > 0 && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Pill className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-800">Suplementos</h4>
                    </div>
                    <ul className="space-y-1">
                      {plan.supplements.map((supp, idx) => (
                        <li key={idx} className="text-sm text-purple-700 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                          {supp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Plano Semanal */}
              <div className="space-y-3">
                <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                  Cardápio da Semana
                </h3>
                {plan.weekPlan.map((dayPlan) => (
                  <div key={dayPlan.dayNumber} className="border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleDay(dayPlan.dayNumber)}
                      className="w-full bg-gradient-to-r from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 p-4 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                          {dayPlan.dayNumber}
                        </div>
                        <span className="font-bold text-lg text-gray-800">{dayPlan.day}</span>
                      </div>
                      {expandedDay === dayPlan.dayNumber ? (
                        <ChevronUp className="w-6 h-6 text-emerald-700" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-emerald-700" />
                      )}
                    </button>
                    
                    {expandedDay === dayPlan.dayNumber && (
                      <div className="p-4 space-y-3 bg-white">
                        {dayPlan.meals.map((meal, mealIdx) => (
                          <div key={mealIdx} className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-emerald-600" />
                                <h4 className="font-semibold text-gray-800">{meal.name}</h4>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 font-medium">{meal.time}</span>
                                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                                  {meal.calories} kcal
                                </span>
                              </div>
                            </div>
                            <ul className="space-y-2">
                              {meal.foods.map((food, foodIdx) => (
                                <li key={foodIdx} className="text-sm text-gray-700 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></span>
                                  <span>{food}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                          <p className="text-sm font-semibold text-emerald-800">
                            Total do dia: {dayPlan.meals.reduce((sum, meal) => sum + meal.calories, 0)} kcal
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Dicas da Nutricionista */}
              {plan.tips && plan.tips.length > 0 && (
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl border-2 border-teal-200">
                  <h3 className="font-bold text-lg text-teal-800 mb-4 flex items-center gap-2">
                    <Utensils className="w-5 h-5" />
                    Dicas da Nutricionista IA
                  </h3>
                  <ul className="space-y-3">
                    {plan.tips.map((tip, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-3 bg-white/60 p-3 rounded-lg">
                        <span className="text-teal-600 font-bold text-lg flex-shrink-0">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                onClick={handleGenerate}
                variant="outline"
                className="w-full border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold py-6"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Gerar Nova Dieta Semanal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
