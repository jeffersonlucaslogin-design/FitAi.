'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Mail, Lock, User, Calendar, Weight, Ruler, Target, Activity } from 'lucide-react';
import type { UserProfile } from '@/lib/types';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 25,
    gender: 'male',
    weight: 70,
    height: 170,
    activityLevel: 'moderate',
    goal: 'maintain',
    targetWeight: 70,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Simula login
      if (email && password) {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userProfile', JSON.stringify(profile));
        router.push('/');
      }
    } else {
      // Simula cadastro
      if (email && password && profile.name) {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userProfile', JSON.stringify(profile));
        alert('Cadastro realizado com sucesso!');
        router.push('/');
      } else {
        alert('Preencha todos os campos obrigatórios');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-none">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-8 h-8" />
            <CardTitle className="text-3xl">FitIA</CardTitle>
          </div>
          <CardDescription className="text-white/90 text-center">
            {isLogin ? 'Entre na sua conta' : 'Crie sua conta e configure seu perfil'}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Credenciais */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Perfil (apenas no cadastro) */}
            {!isLogin && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  Configure seu Perfil
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      placeholder="Seu nome"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      required
                      className="border-emerald-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      Idade
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min="10"
                      max="120"
                      value={profile.age}
                      onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                      className="border-emerald-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Sexo</Label>
                    <Select
                      value={profile.gender}
                      onValueChange={(value: 'male' | 'female') => setProfile({ ...profile, gender: value })}
                    >
                      <SelectTrigger className="border-emerald-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight" className="flex items-center gap-2">
                      <Weight className="w-4 h-4 text-orange-600" />
                      Peso (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      min="30"
                      max="300"
                      value={profile.weight}
                      onChange={(e) => setProfile({ ...profile, weight: parseFloat(e.target.value) })}
                      className="border-emerald-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height" className="flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-purple-600" />
                      Altura (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      min="100"
                      max="250"
                      value={profile.height}
                      onChange={(e) => setProfile({ ...profile, height: parseFloat(e.target.value) })}
                      className="border-emerald-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetWeight" className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-pink-600" />
                      Peso Alvo (kg)
                    </Label>
                    <Input
                      id="targetWeight"
                      type="number"
                      min="30"
                      max="300"
                      value={profile.targetWeight}
                      onChange={(e) => setProfile({ ...profile, targetWeight: parseFloat(e.target.value) })}
                      className="border-emerald-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activityLevel" className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-teal-600" />
                      Nível de Atividade
                    </Label>
                    <Select
                      value={profile.activityLevel}
                      onValueChange={(value: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active') =>
                        setProfile({ ...profile, activityLevel: value })
                      }
                    >
                      <SelectTrigger className="border-emerald-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentário</SelectItem>
                        <SelectItem value="light">Levemente Ativo</SelectItem>
                        <SelectItem value="moderate">Moderadamente Ativo</SelectItem>
                        <SelectItem value="active">Muito Ativo</SelectItem>
                        <SelectItem value="very_active">Extremamente Ativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal">Objetivo</Label>
                    <Select
                      value={profile.goal}
                      onValueChange={(value: 'lose' | 'maintain' | 'gain') =>
                        setProfile({ ...profile, goal: value })
                      }
                    >
                      <SelectTrigger className="border-emerald-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lose">Perder Peso</SelectItem>
                        <SelectItem value="maintain">Manter Peso</SelectItem>
                        <SelectItem value="gain">Ganhar Peso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-6 text-lg"
              >
                {isLogin ? 'Entrar' : 'Criar Conta'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
