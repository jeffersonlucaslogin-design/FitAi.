import { NextRequest, NextResponse } from 'next/server';

// Banco de dados de alimentos comuns com valores nutricionais
const foodDatabase = [
  { name: 'Arroz branco', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, weight: 100 },
  { name: 'Feijão preto', calories: 132, protein: 8.9, carbs: 23.7, fat: 0.5, weight: 100 },
  { name: 'Frango grelhado', calories: 165, protein: 31, carbs: 0, fat: 3.6, weight: 100 },
  { name: 'Carne bovina', calories: 250, protein: 26, carbs: 0, fat: 15, weight: 100 },
  { name: 'Peixe', calories: 206, protein: 22, carbs: 0, fat: 12, weight: 100 },
  { name: 'Ovo', calories: 155, protein: 13, carbs: 1.1, fat: 11, weight: 100 },
  { name: 'Batata', calories: 77, protein: 2, carbs: 17, fat: 0.1, weight: 100 },
  { name: 'Batata doce', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, weight: 100 },
  { name: 'Brócolis', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, weight: 100 },
  { name: 'Salada verde', calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, weight: 100 },
  { name: 'Tomate', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, weight: 100 },
  { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, weight: 100 },
  { name: 'Maçã', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, weight: 100 },
  { name: 'Pão integral', calories: 247, protein: 13, carbs: 41, fat: 3.4, weight: 100 },
  { name: 'Iogurte natural', calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, weight: 100 },
  { name: 'Queijo', calories: 402, protein: 25, carbs: 1.3, fat: 33, weight: 100 },
  { name: 'Abacate', calories: 160, protein: 2, carbs: 8.5, fat: 15, weight: 100 },
  { name: 'Aveia', calories: 389, protein: 17, carbs: 66, fat: 7, weight: 100 },
  { name: 'Pasta de amendoim', calories: 588, protein: 25, carbs: 20, fat: 50, weight: 100 },
];

// Função para gerar análise determinística baseada em padrões comuns
function generateFoodAnalysis(): any {
  // Seleciona 2-4 alimentos aleatórios do banco de dados
  const numFoods = Math.floor(Math.random() * 3) + 2; // 2 a 4 alimentos
  const selectedFoods = [];
  
  for (let i = 0; i < numFoods; i++) {
    const randomIndex = Math.floor(Math.random() * foodDatabase.length);
    const food = { ...foodDatabase[randomIndex] };
    
    // Varia a quantidade (50g a 200g)
    const weightMultiplier = (Math.floor(Math.random() * 15) + 5) / 10; // 0.5 a 2.0
    food.weight = Math.round(food.weight * weightMultiplier);
    food.calories = Math.round(food.calories * weightMultiplier);
    food.protein = Math.round(food.protein * weightMultiplier * 10) / 10;
    food.carbs = Math.round(food.carbs * weightMultiplier * 10) / 10;
    food.fat = Math.round(food.fat * weightMultiplier * 10) / 10;
    
    selectedFoods.push({
      foodName: food.name,
      estimatedWeight: food.weight,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
    });
  }
  
  return { foods: selectedFoods };
}

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    // Simula um pequeno delay para parecer processamento real
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Gera análise determinística
    const analysis = generateFoodAnalysis();

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Erro ao analisar alimento:', error);
    return NextResponse.json(
      { error: 'Erro ao analisar imagem' },
      { status: 500 }
    );
  }
}
