'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/custom/navbar';
import UserProfileComponent from '@/components/custom/user-profile';
import NutritionPlanComponent from '@/components/custom/nutrition-plan';
import WorkoutGenerator from '@/components/custom/workout-generator';
import ProgressDashboard from '@/components/custom/progress-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, Dumbbell, TrendingUp, Sparkles } from 'lucide-react';
import type { UserProfile } from '@/lib/types';

export default function FitIAApp() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Usuário',
    age: 25,
    gender: 'male',
    weight: 75,
    height: 175,
    activityLevel: 'moderate',
    goal: 'lose',
    targetWeight: 70,
  });

  useEffect(() => {
    // Verifica se usuário está logado
    const userEmail = localStorage.getItem('userEmail');
    const savedProfile = localStorage.getItem('userProfile');

    if (!userEmail) {
      router.push('/auth');
    } else {
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
      setIsLoading(false);
    }
  }, [router]);

  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
    alert('Perfil salvo com sucesso!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-emerald-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="pt-24 md:pt-20 pb-8 px-4 max-w-7xl mx-auto">
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Hero Section */}
            <Card className="border-none shadow-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <CardContent className="pt-8 pb-8">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-8 h-8" />
                    <h1 className="text-4xl md:text-5xl font-bold">Bem-vindo ao FitIA</h1>
                  </div>
                  <p className="text-xl md:text-2xl opacity-90">
                    Olá, {userProfile.name}! 👋
                  </p>
                  <p className="text-lg opacity-80 max-w-2xl mx-auto">
                    Seu assistente inteligente de fitness e nutrição
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-orange-200 shadow-lg hover:shadow-xl transition-all cursor-pointer" onClick={() => setActiveTab('nutrition')}>
                <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Utensils className="w-6 h-6" />
                    Plano Nutricional
                  </CardTitle>
                  <CardDescription>
                    Dieta personalizada criada por IA
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-purple-200 shadow-lg hover:shadow-xl transition-all cursor-pointer" onClick={() => setActiveTab('workout')}>
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Dumbbell className="w-6 h-6" />
                    Treinos Inteligentes
                  </CardTitle>
                  <CardDescription>
                    Exercícios personalizados para seus objetivos
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Profile Summary */}
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle className="text-blue-700">Seu Perfil</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Peso</p>
                    <p className="text-2xl font-bold text-gray-800">{userProfile.weight}kg</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Altura</p>
                    <p className="text-2xl font-bold text-gray-800">{userProfile.height}cm</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Idade</p>
                    <p className="text-2xl font-bold text-gray-800">{userProfile.age} anos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Objetivo</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {userProfile.goal === 'lose' ? '📉' : userProfile.goal === 'gain' ? '📈' : '➡️'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-teal-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-teal-700">Como Funciona</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                      <span className="text-gray-700">Configure seu perfil com seus dados e objetivos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                      <span className="text-gray-700">Receba planos alimentares personalizados</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                      <span className="text-gray-700">Obtenha treinos personalizados para seus objetivos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                      <span className="text-gray-700">Acompanhe seu progresso com gráficos detalhados</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-pink-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-pink-700">Recursos Principais</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <Utensils className="w-5 h-5 text-orange-600" />
                      <span className="text-gray-700">Planos nutricionais personalizados</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Dumbbell className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700">Treinos para casa e academia</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">Acompanhamento de progresso</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'nutrition' && <NutritionPlanComponent profile={userProfile} />}
        {activeTab === 'workout' && <WorkoutGenerator profile={userProfile} />}
        {activeTab === 'progress' && <ProgressDashboard profile={userProfile} />}
        {activeTab === 'profile' && (
          <UserProfileComponent profile={userProfile} onSave={handleSaveProfile} />
        )}
      </main>
    </div>
  );
}
