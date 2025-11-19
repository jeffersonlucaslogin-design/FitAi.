'use client';

import { useState } from 'react';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { analyzeFoodImage } from '@/lib/openai';
import type { MealAnalysis } from '@/lib/types';

export default function FoodAnalyzer() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<MealAnalysis | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      
      setAnalyzing(true);
      try {
        // Envia a imagem em base64 (data URL) para a API
        const analysis = await analyzeFoodImage(base64);
        
        if (analysis && analysis.foods) {
          const totalCalories = analysis.foods.reduce((sum: number, f: any) => sum + f.calories, 0);
          const totalProtein = analysis.foods.reduce((sum: number, f: any) => sum + f.protein, 0);
          const totalCarbs = analysis.foods.reduce((sum: number, f: any) => sum + f.carbs, 0);
          const totalFat = analysis.foods.reduce((sum: number, f: any) => sum + f.fat, 0);

          setResult({
            foods: analysis.foods,
            totalCalories,
            totalProtein,
            totalCarbs,
            totalFat,
            timestamp: new Date()
          });
        }
      } catch (error: any) {
        console.error('Erro na análise:', error);
        const errorMessage = error.message || 'Erro ao analisar imagem. Tente novamente.';
        alert(errorMessage);
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <Card className="border-emerald-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <Camera className="w-6 h-6" />
            Análise de Alimentos por Foto
          </CardTitle>
          <CardDescription>
            Tire uma foto do seu prato e a IA identificará os alimentos e nutrientes
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <label htmlFor="food-image" className="cursor-pointer w-full">
              <div className="w-full max-w-md mx-auto h-64 border-2 border-dashed border-emerald-300 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-emerald-500" />
                    <div className="text-center">
                      <p className="text-lg font-medium text-emerald-700">Clique para enviar foto</p>
                      <p className="text-sm text-gray-500">ou arraste e solte aqui</p>
                    </div>
                  </>
                )}
              </div>
            </label>
            <input
              id="food-image"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {analyzing && (
              <div className="flex items-center gap-2 text-emerald-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analisando imagem com IA...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-teal-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50">
            <CardTitle className="text-teal-700">Resultado da Análise</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Resumo Nutricional */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-xl text-center">
                <p className="text-sm text-orange-700 font-medium">Calorias</p>
                <p className="text-2xl font-bold text-orange-800">{Math.round(result.totalCalories)}</p>
                <p className="text-xs text-orange-600">kcal</p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl text-center">
                <p className="text-sm text-blue-700 font-medium">Proteínas</p>
                <p className="text-2xl font-bold text-blue-800">{result.totalProtein.toFixed(1)}</p>
                <p className="text-xs text-blue-600">g</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-4 rounded-xl text-center">
                <p className="text-sm text-yellow-700 font-medium">Carboidratos</p>
                <p className="text-2xl font-bold text-yellow-800">{result.totalCarbs.toFixed(1)}</p>
                <p className="text-xs text-yellow-600">g</p>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-xl text-center">
                <p className="text-sm text-purple-700 font-medium">Gorduras</p>
                <p className="text-2xl font-bold text-purple-800">{result.totalFat.toFixed(1)}</p>
                <p className="text-xs text-purple-600">g</p>
              </div>
            </div>

            {/* Detalhes dos Alimentos */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-gray-800">Alimentos Identificados:</h3>
              {result.foods.map((food, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{food.foodName}</h4>
                    <span className="text-sm text-gray-600">{food.estimatedWeight}g</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Cal</p>
                      <p className="font-medium">{Math.round(food.calories)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Prot</p>
                      <p className="font-medium">{food.protein.toFixed(1)}g</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Carb</p>
                      <p className="font-medium">{food.carbs.toFixed(1)}g</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Gord</p>
                      <p className="font-medium">{food.fat.toFixed(1)}g</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              onClick={() => {
                setResult(null);
                setImagePreview('');
              }}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            >
              Analisar Nova Foto
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
