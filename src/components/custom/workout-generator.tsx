'use client';

import { useState } from 'react';
import { Dumbbell, Loader2, Home as HomeIcon, Building2, Flame, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateWorkoutPlan } from '@/lib/openai';
import type { UserProfile, WorkoutPlan } from '@/lib/types';

interface WorkoutGeneratorProps {
  profile: UserProfile;
}

export default function WorkoutGenerator({ profile }: WorkoutGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [workoutType, setWorkoutType] = useState<'home' | 'gym'>('home');
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);

  const handleGenerate = async (type: 'home' | 'gym') => {
    setWorkoutType(type);
    setLoading(true);
    try {
      const result = await generateWorkoutPlan(profile, type);
      setPlan(result);
    } catch (error) {
      console.error('Erro ao gerar treino:', error);
      alert('Erro ao gerar treino. Verifique sua chave da OpenAI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-emerald-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <Dumbbell className="w-6 h-6" />
            Gerador de Treinos Inteligente
          </CardTitle>
          <CardDescription>
            IA cria treinos personalizados para casa ou academia
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {!plan ? (
            <div className="space-y-4">
              <p className="text-center text-gray-600">
                Escolha onde você quer treinar:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => handleGenerate('home')}
                  disabled={loading}
                  className="h-32 flex flex-col gap-3 bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                >
                  <HomeIcon className="w-12 h-12" />
                  <div>
                    <p className="text-lg font-bold">Treino em Casa</p>
                    <p className="text-sm opacity-90">Sem equipamentos</p>
                  </div>
                </Button>
                <Button
                  onClick={() => handleGenerate('gym')}
                  disabled={loading}
                  className="h-32 flex flex-col gap-3 bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                  <Building2 className="w-12 h-12" />
                  <div>
                    <p className="text-lg font-bold">Treino na Academia</p>
                    <p className="text-sm opacity-90">Com equipamentos</p>
                  </div>
                </Button>
              </div>
              {loading && (
                <div className="flex items-center justify-center gap-2 text-emerald-600 py-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Gerando treino personalizado...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Info do Treino */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-emerald-700 flex items-center gap-2">
                    {plan.type === 'home' ? <HomeIcon className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                    {plan.type === 'home' ? 'Treino em Casa' : 'Treino na Academia'}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700">{plan.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Flame className="w-4 h-4 text-orange-600" />
                      <span className="text-orange-700 font-medium">{plan.totalCalories} kcal</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{plan.goal}</p>
              </div>

              {/* Exercícios */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-800">Exercícios:</h3>
                {plan.exercises.map((exercise, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-emerald-300 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{exercise.name}</h4>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                            <span>{exercise.sets} séries</span>
                            <span>•</span>
                            <span>{exercise.reps} reps</span>
                            <span>•</span>
                            <span>Descanso: {exercise.rest}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                        {exercise.calories} kcal
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {exercise.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => handleGenerate('home')}
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Gerar Treino em Casa
                </Button>
                <Button
                  onClick={() => handleGenerate('gym')}
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Gerar Treino na Academia
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
