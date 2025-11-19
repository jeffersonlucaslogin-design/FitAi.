'use client';

import { useState } from 'react';
import { Dumbbell, Loader2, Home as HomeIcon, Building2, Flame, Clock, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateWorkoutPlan } from '@/lib/openai';
import type { UserProfile, WorkoutPlan } from '@/lib/types';

interface WorkoutGeneratorProps {
  profile: UserProfile;
}

// Banco de imagens e vídeos de exercícios (URLs públicas reais)
const exerciseMedia: Record<string, { image: string; video: string }> = {
  // Exercícios de Casa
  'flexão': {
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop',
    video: 'https://www.youtube.com/embed/IODxDxX7oi4' // Push-ups tutorial
  },
  'flexao': {
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop',
    video: 'https://www.youtube.com/embed/IODxDxX7oi4'
  },
  'agachamento': {
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=400&fit=crop',
    video: 'https://www.youtube.com/embed/aclHkVaku9U' // Squat tutorial
  },
  'prancha': {
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    video: 'https://www.youtube.com/embed/pSHjTRCQxIw' // Plank tutorial
  },
  'abdominal': {
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    video: 'https://www.youtube.com/embed/1fbU_MkV7NE' // Abs tutorial
  },
  'burpee': {
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop',
    video: 'https://www.youtube.com/embed/dZgVxmf6jkA' // Burpee tutorial
  },
  'polichinelo': {
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop',
    video: 'https://www.youtube.com/embed/c4DAnQ6DtF8' // Jumping jacks tutorial
  },
  'mountain climber': {
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    video: 'https://www.youtube.com/embed/nmwgirgXLYM' // Mountain climbers tutorial
  },
  'afundo': {
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=400&fit=crop',
    video: 'https://www.youtube.com/embed/QOVaHwm-Q6U' // Lunges tutorial
  },
  
  // Exercícios de Academia
  'supino': {
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop',
    video: 'https://www.youtube.com/embed/rT7DgCr-3pg' // Bench press tutorial
  },
  'leg press': {
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=600&h=400&fit=crop',
    video: 'https://www.youtube.com/embed/IZxyjW7MPJQ' // Leg press tutorial
  },
  'rosca': {
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=400&fit=crop',
    video: 'https://www.youtube.com/embed/ykJmrZ5v0Oo' // Bicep curl tutorial
  },
  'desenvolvimento': {
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&h=400&fit=crop',
    video: 'https://www.youtube.com/embed/qEwKCR5JCog' // Shoulder press tutorial
  },
  'remada': {
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
    video: 'https://www.youtube.com/embed/kBWAon7ItDw' // Row tutorial
  },
  'stiff': {
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=400&fit=crop',
    video: 'https://www.youtube.com/embed/1uDiW5--rAE' // Stiff leg deadlift tutorial
  },
  'crucifixo': {
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop',
    video: 'https://www.youtube.com/embed/eozdVDA78K0' // Dumbbell fly tutorial
  },
  'tríceps': {
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=400&fit=crop',
    video: 'https://www.youtube.com/embed/d_KZxkY_0cM' // Triceps tutorial
  },
  'triceps': {
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=400&fit=crop',
    video: 'https://www.youtube.com/embed/d_KZxkY_0cM'
  },
  
  // Imagem e vídeo padrão
  'default': {
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop',
    video: 'https://www.youtube.com/embed/ixmxOlcrlUc' // General workout tutorial
  }
};

// Função para encontrar mídia do exercício
const getExerciseMedia = (exerciseName: string): { image: string; video: string } => {
  const nameLower = exerciseName.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove acentos
  
  // Procura por palavras-chave no nome do exercício
  for (const [key, media] of Object.entries(exerciseMedia)) {
    if (nameLower.includes(key)) {
      return media;
    }
  }
  
  return exerciseMedia.default;
};

export default function WorkoutGenerator({ profile }: WorkoutGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [workoutType, setWorkoutType] = useState<'home' | 'gym'>('home');
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [showVideo, setShowVideo] = useState<number | null>(null);

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
                {plan.exercises.map((exercise, index) => {
                  const media = getExerciseMedia(exercise.name);
                  const isVideoOpen = showVideo === index;
                  
                  return (
                    <div key={index} className="bg-white rounded-xl border-2 border-gray-200 hover:border-emerald-300 transition-all overflow-hidden">
                      {/* Imagem ou Vídeo do Exercício */}
                      <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200">
                        {!isVideoOpen ? (
                          <>
                            <img 
                              src={media.image}
                              alt={exercise.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = exerciseMedia.default.image;
                              }}
                            />
                            {/* Botão Play para abrir vídeo */}
                            <button
                              onClick={() => setShowVideo(index)}
                              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-all group"
                            >
                              <div className="bg-red-600 rounded-full p-4 group-hover:scale-110 transition-transform shadow-2xl">
                                <Play className="w-8 h-8 text-white fill-white" />
                              </div>
                            </button>
                          </>
                        ) : (
                          <iframe
                            src={media.video}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )}
                        
                        <div className="absolute top-3 left-3 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          {index + 1}
                        </div>
                        <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                          {exercise.calories} kcal
                        </div>
                        
                        {/* Botão para fechar vídeo */}
                        {isVideoOpen && (
                          <button
                            onClick={() => setShowVideo(null)}
                            className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all"
                          >
                            Ver Imagem
                          </button>
                        )}
                      </div>
                      
                      {/* Conteúdo do Exercício */}
                      <div className="p-4">
                        <div className="mb-3">
                          <h4 className="font-semibold text-lg text-gray-800 mb-2">{exercise.name}</h4>
                          <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                              {exercise.sets} séries
                            </span>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                              {exercise.reps} reps
                            </span>
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                              Descanso: {exercise.rest}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg leading-relaxed">
                          {exercise.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
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
