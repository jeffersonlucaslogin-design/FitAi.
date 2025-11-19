'use client';

import { Home, Utensils, Dumbbell, TrendingUp, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const router = useRouter();

  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'nutrition', label: 'Nutrição', icon: Utensils },
    { id: 'workout', label: 'Treino', icon: Dumbbell },
    { id: 'progress', label: 'Progresso', icon: TrendingUp },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userProfile');
    router.push('/auth');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-white">FitIA</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => onTabChange(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'bg-white text-emerald-600 hover:bg-white/90'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white hover:bg-white/20 ml-2"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-around pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-all text-white/70 hover:text-white"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs">Sair</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
