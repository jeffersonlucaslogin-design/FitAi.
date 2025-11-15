'use client';

import { TrendingUp, TrendingDown, Droplet, Flame, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { UserProfile, ProgressData } from '@/lib/types';

interface ProgressDashboardProps {
  profile: UserProfile;
}

export default function ProgressDashboard({ profile }: ProgressDashboardProps) {
  // Dados de exemplo para demonstração
  const progressData: ProgressData[] = [
    { date: '01/01', weight: 75, caloriesIn: 2000, caloriesOut: 500, waterIntake: 2.5 },
    { date: '02/01', weight: 74.8, caloriesIn: 1950, caloriesOut: 550, waterIntake: 2.8 },
    { date: '03/01', weight: 74.5, caloriesIn: 2100, caloriesOut: 600, waterIntake: 3.0 },
    { date: '04/01', weight: 74.3, caloriesIn: 1900, caloriesOut: 520, waterIntake: 2.7 },
    { date: '05/01', weight: 74.0, caloriesIn: 2050, caloriesOut: 580, waterIntake: 3.2 },
    { date: '06/01', weight: 73.8, caloriesIn: 1980, caloriesOut: 610, waterIntake: 3.0 },
    { date: '07/01', weight: 73.5, caloriesIn: 2020, caloriesOut: 590, waterIntake: 2.9 },
  ];

  const calculateIMC = () => {
    const heightInMeters = profile.height / 100;
    return (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getIMCCategory = (imc: number) => {
    if (imc < 18.5) return { label: 'Abaixo do peso', color: 'text-blue-600' };
    if (imc < 25) return { label: 'Peso normal', color: 'text-green-600' };
    if (imc < 30) return { label: 'Sobrepeso', color: 'text-yellow-600' };
    return { label: 'Obesidade', color: 'text-red-600' };
  };

  const imc = parseFloat(calculateIMC());
  const imcCategory = getIMCCategory(imc);

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-emerald-200 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Peso Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-emerald-700">{profile.weight}</p>
                <p className="text-sm text-gray-500">kg</p>
              </div>
              <TrendingDown className="w-8 h-8 text-emerald-500" />
            </div>
            {profile.targetWeight && (
              <p className="text-xs text-gray-600 mt-2">
                Meta: {profile.targetWeight}kg ({(profile.weight - profile.targetWeight).toFixed(1)}kg restantes)
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-200 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">IMC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-700">{imc}</p>
                <p className={`text-sm font-medium ${imcCategory.color}`}>{imcCategory.label}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Calorias Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-orange-700">2020</p>
                <p className="text-sm text-gray-500">kcal consumidas</p>
              </div>
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Meta: 2200 kcal
            </p>
          </CardContent>
        </Card>

        <Card className="border-cyan-200 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Hidratação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-cyan-700">2.9</p>
                <p className="text-sm text-gray-500">litros hoje</p>
              </div>
              <Droplet className="w-8 h-8 text-cyan-500" />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Meta: 3.0 litros
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Peso */}
      <Card className="border-emerald-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardTitle className="text-emerald-700">Evolução do Peso</CardTitle>
          <CardDescription>Últimos 7 dias</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Calorias */}
      <Card className="border-orange-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardTitle className="text-orange-700">Balanço Calórico</CardTitle>
          <CardDescription>Calorias consumidas vs queimadas</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="caloriesIn" fill="#f97316" name="Consumidas" radius={[8, 8, 0, 0]} />
              <Bar dataKey="caloriesOut" fill="#10b981" name="Queimadas" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Mensagem Motivacional */}
      <Card className="border-purple-200 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-2xl font-bold text-purple-700">🎉 Parabéns!</p>
            <p className="text-gray-700">
              Você está no caminho certo! Continue assim e alcance seus objetivos.
            </p>
            <p className="text-sm text-gray-600">
              Lembre-se de beber água e manter uma alimentação equilibrada.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
