import { NextRequest, NextResponse } from 'next/server';

// Função para calcular TDEE (Total Daily Energy Expenditure)
function calculateTDEE(profile: any): number {
  const { weight, height, age, gender, activityLevel } = profile;
  
  // Fórmula de Harris-Benedict
  let bmr: number;
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
  
  // Multiplicadores de atividade
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  
  return Math.round(bmr * (activityMultipliers[activityLevel] || 1.55));
}

// Função para calcular macros
function calculateMacros(calories: number, goal: string) {
  let proteinPercent = 0.30;
  let carbsPercent = 0.40;
  let fatPercent = 0.30;
  
  if (goal === 'lose') {
    proteinPercent = 0.35;
    carbsPercent = 0.35;
    fatPercent = 0.30;
  } else if (goal === 'gain') {
    proteinPercent = 0.30;
    carbsPercent = 0.45;
    fatPercent = 0.25;
  }
  
  return {
    protein: Math.round((calories * proteinPercent) / 4),
    carbs: Math.round((calories * carbsPercent) / 4),
    fat: Math.round((calories * fatPercent) / 9),
  };
}

// Banco de dados expandido de refeições
const mealDatabase = {
  breakfast: [
    {
      name: 'Café da Manhã Proteico',
      foods: ['2 ovos mexidos', '2 fatias de pão integral', '1/2 abacate', 'Café sem açúcar'],
      calories: 380,
    },
    {
      name: 'Café da Manhã Energético',
      foods: ['1 xícara de aveia', '1 banana', '1 colher de pasta de amendoim', 'Leite desnatado'],
      calories: 420,
    },
    {
      name: 'Café da Manhã Leve',
      foods: ['1 iogurte grego natural', '1 colher de granola', 'Frutas vermelhas', 'Chá verde'],
      calories: 280,
    },
    {
      name: 'Panquecas Proteicas',
      foods: ['3 panquecas de aveia e banana', '1 colher de mel', 'Morangos frescos', 'Café'],
      calories: 390,
    },
    {
      name: 'Tapioca Recheada',
      foods: ['2 tapiocas com queijo branco', '1 fatia de peito de peru', 'Suco verde natural'],
      calories: 350,
    },
    {
      name: 'Bowl de Açaí Fit',
      foods: ['1 tigela de açaí', 'Granola', 'Banana', 'Morango', '1 colher de pasta de amendoim'],
      calories: 450,
    },
    {
      name: 'Omelete Completa',
      foods: ['Omelete de 3 ovos com espinafre e tomate', '1 fatia de pão integral', 'Suco de laranja'],
      calories: 410,
    },
    {
      name: 'Smoothie Bowl',
      foods: ['Smoothie de banana e mamão', 'Chia', 'Coco ralado', 'Castanhas', 'Mel'],
      calories: 380,
    },
    {
      name: 'Café da Manhã Brasileiro',
      foods: ['Cuscuz com ovo', 'Queijo coalho', 'Café com leite', 'Mamão'],
      calories: 400,
    },
    {
      name: 'Wrap Matinal',
      foods: ['Wrap integral com ovos, queijo e tomate', 'Abacate', 'Chá de hibisco'],
      calories: 370,
    },
    {
      name: 'Mingau Proteico',
      foods: ['Mingau de aveia com whey', 'Canela', 'Maçã picada', 'Nozes'],
      calories: 360,
    },
    {
      name: 'Pão Francês Fit',
      foods: ['2 pães francês integral', 'Requeijão light', 'Peito de peru', 'Café'],
      calories: 340,
    },
  ],
  snack: [
    {
      name: 'Lanche Proteico',
      foods: ['1 iogurte grego', '10 amêndoas'],
      calories: 180,
    },
    {
      name: 'Lanche Natural',
      foods: ['1 maçã', '1 colher de pasta de amendoim'],
      calories: 200,
    },
    {
      name: 'Lanche Rápido',
      foods: ['1 banana', '15 castanhas'],
      calories: 220,
    },
    {
      name: 'Mix de Frutas',
      foods: ['Salada de frutas com chia', 'Iogurte natural'],
      calories: 190,
    },
    {
      name: 'Sanduíche Natural',
      foods: ['Pão integral com atum', 'Alface', 'Tomate'],
      calories: 240,
    },
    {
      name: 'Vitamina Proteica',
      foods: ['Vitamina de banana com whey', 'Aveia'],
      calories: 250,
    },
    {
      name: 'Barra de Cereal Caseira',
      foods: ['1 barra de cereal integral', '1 tangerina'],
      calories: 170,
    },
    {
      name: 'Queijo com Frutas',
      foods: ['Queijo cottage', 'Uvas', 'Nozes'],
      calories: 210,
    },
    {
      name: 'Crepioca',
      foods: ['Crepioca com queijo', 'Suco de limão'],
      calories: 230,
    },
    {
      name: 'Pasta de Grão-de-Bico',
      foods: ['Homus com palitos de cenoura', 'Torradas integrais'],
      calories: 200,
    },
  ],
  lunch: [
    {
      name: 'Almoço Balanceado',
      foods: ['150g de frango grelhado', '4 colheres de arroz integral', 'Brócolis no vapor', 'Salada verde'],
      calories: 520,
    },
    {
      name: 'Almoço Leve',
      foods: ['150g de peixe assado', '3 colheres de quinoa', 'Legumes refogados', 'Salada'],
      calories: 480,
    },
    {
      name: 'Almoço Completo',
      foods: ['150g de carne magra', '4 colheres de batata doce', 'Feijão', 'Salada variada'],
      calories: 550,
    },
    {
      name: 'Prato Fitness',
      foods: ['Filé de tilápia grelhado', 'Purê de abóbora', 'Vagem refogada', 'Salada de rúcula'],
      calories: 490,
    },
    {
      name: 'Almoço Brasileiro',
      foods: ['Bife grelhado', 'Arroz integral', 'Feijão preto', 'Couve refogada', 'Salada'],
      calories: 580,
    },
    {
      name: 'Prato Mediterrâneo',
      foods: ['Salmão grelhado', 'Arroz de couve-flor', 'Abobrinha grelhada', 'Salada grega'],
      calories: 510,
    },
    {
      name: 'Almoço Vegetariano',
      foods: ['Grão-de-bico assado', 'Quinoa', 'Mix de legumes', 'Salada colorida'],
      calories: 470,
    },
    {
      name: 'Prato Oriental',
      foods: ['Frango teriyaki', 'Arroz integral', 'Brócolis', 'Cenoura', 'Gergelim'],
      calories: 530,
    },
    {
      name: 'Almoço Light',
      foods: ['Peito de frango desfiado', 'Salada Caesar fit', 'Batata doce assada'],
      calories: 450,
    },
    {
      name: 'Prato Proteico',
      foods: ['Carne moída magra', 'Purê de batata doce', 'Espinafre refogado', 'Salada'],
      calories: 560,
    },
    {
      name: 'Almoço Tropical',
      foods: ['Peixe ao molho de maracujá', 'Arroz integral', 'Legumes grelhados', 'Salada'],
      calories: 500,
    },
    {
      name: 'Prato Italiano Fit',
      foods: ['Frango parmegiana light', 'Macarrão integral', 'Abobrinha', 'Salada'],
      calories: 540,
    },
    {
      name: 'Almoço Caseiro',
      foods: ['Frango ensopado', 'Arroz integral', 'Feijão', 'Abóbora cozida', 'Salada'],
      calories: 520,
    },
    {
      name: 'Prato do Mar',
      foods: ['Camarão grelhado', 'Arroz de brócolis', 'Legumes ao vapor', 'Salada'],
      calories: 480,
    },
    {
      name: 'Almoço Nutritivo',
      foods: ['Carne de panela magra', 'Purê de mandioquinha', 'Couve-flor', 'Salada'],
      calories: 550,
    },
  ],
  dinner: [
    {
      name: 'Jantar Leve',
      foods: ['150g de frango grelhado', 'Salada verde abundante', 'Legumes grelhados'],
      calories: 380,
    },
    {
      name: 'Jantar Proteico',
      foods: ['150g de salmão', 'Aspargos grelhados', 'Salada de folhas'],
      calories: 420,
    },
    {
      name: 'Jantar Balanceado',
      foods: ['Omelete de 3 ovos', 'Salada de tomate e pepino', 'Abobrinha refogada'],
      calories: 350,
    },
    {
      name: 'Sopa Nutritiva',
      foods: ['Sopa de legumes com frango', 'Torradas integrais', 'Salada verde'],
      calories: 360,
    },
    {
      name: 'Jantar Oriental',
      foods: ['Peixe ao molho shoyu', 'Legumes no vapor', 'Salada de algas'],
      calories: 390,
    },
    {
      name: 'Wrap Noturno',
      foods: ['Wrap integral com atum', 'Salada', 'Guacamole'],
      calories: 410,
    },
    {
      name: 'Jantar Vegetariano',
      foods: ['Hambúrguer de grão-de-bico', 'Salada completa', 'Batata doce assada'],
      calories: 400,
    },
    {
      name: 'Peixe Assado',
      foods: ['Filé de pescada', 'Purê de couve-flor', 'Brócolis', 'Salada'],
      calories: 370,
    },
    {
      name: 'Jantar Rápido',
      foods: ['Peito de frango desfiado', 'Salada Caesar', 'Tomate cereja'],
      calories: 380,
    },
    {
      name: 'Jantar Mediterrâneo',
      foods: ['Frango com ervas', 'Berinjela grelhada', 'Salada grega', 'Azeite'],
      calories: 430,
    },
    {
      name: 'Sopa Detox',
      foods: ['Sopa de abóbora com gengibre', 'Peito de frango', 'Salada verde'],
      calories: 340,
    },
    {
      name: 'Jantar Fit',
      foods: ['Omelete de claras com legumes', 'Salada de rúcula', 'Tomate'],
      calories: 320,
    },
  ],
  supper: [
    {
      name: 'Ceia Leve',
      foods: ['1 xícara de chá de camomila', '3 castanhas'],
      calories: 90,
    },
    {
      name: 'Ceia Proteica',
      foods: ['1 iogurte natural', '1 colher de chia'],
      calories: 120,
    },
    {
      name: 'Ceia Relaxante',
      foods: ['Chá de erva-doce', '5 amêndoas'],
      calories: 80,
    },
    {
      name: 'Ceia Nutritiva',
      foods: ['Iogurte desnatado', 'Linhaça'],
      calories: 110,
    },
    {
      name: 'Ceia Simples',
      foods: ['Chá verde', '1 banana pequena'],
      calories: 100,
    },
    {
      name: 'Ceia Proteica Plus',
      foods: ['Queijo cottage', 'Nozes'],
      calories: 130,
    },
  ],
};

const daysOfWeek = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

function generateDailyPlan(targetCalories: number, dayNumber: number) {
  const meals = [
    {
      name: 'Café da Manhã',
      time: '07:00',
      ...mealDatabase.breakfast[dayNumber % mealDatabase.breakfast.length],
    },
    {
      name: 'Lanche da Manhã',
      time: '10:00',
      ...mealDatabase.snack[dayNumber % mealDatabase.snack.length],
    },
    {
      name: 'Almoço',
      time: '12:30',
      ...mealDatabase.lunch[dayNumber % mealDatabase.lunch.length],
    },
    {
      name: 'Lanche da Tarde',
      time: '15:30',
      ...mealDatabase.snack[(dayNumber + 1) % mealDatabase.snack.length],
    },
    {
      name: 'Jantar',
      time: '19:00',
      ...mealDatabase.dinner[dayNumber % mealDatabase.dinner.length],
    },
    {
      name: 'Ceia',
      time: '21:30',
      ...mealDatabase.supper[dayNumber % mealDatabase.supper.length],
    },
  ];

  return meals;
}

export async function POST(request: NextRequest) {
  try {
    const { profile, type } = await request.json();

    const tdee = calculateTDEE(profile);
    let targetCalories = tdee;

    // Ajustar calorias baseado no objetivo
    if (profile.goal === 'lose') {
      targetCalories = tdee - 500; // Déficit de 500 kcal
    } else if (profile.goal === 'gain') {
      targetCalories = tdee + 300; // Superávit de 300 kcal
    }

    const macros = calculateMacros(targetCalories, profile.goal);

    if (type === 'weekly') {
      // Gerar plano semanal
      const weekPlan = daysOfWeek.map((day, index) => ({
        day,
        dayNumber: index + 1,
        meals: generateDailyPlan(targetCalories, index),
      }));

      return NextResponse.json({
        dailyCalories: targetCalories,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
        weekPlan,
        tips: [
          'Beba pelo menos 2-3 litros de água por dia',
          'Evite alimentos processados e açúcares refinados',
          'Faça as refeições em horários regulares',
          'Mastigue bem os alimentos',
          'Durma 7-8 horas por noite para melhor recuperação',
          'Pratique atividade física regularmente',
        ],
        waterIntake: '2.5 litros por dia',
        supplements: ['Vitamina D3', 'Ômega-3', 'Multivitamínico (opcional)'],
      });
    } else {
      // Gerar plano diário
      const meals = generateDailyPlan(targetCalories, 0);

      return NextResponse.json({
        dailyCalories: targetCalories,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
        meals,
        tips: [
          'Beba água regularmente ao longo do dia',
          'Evite pular refeições',
          'Prefira alimentos naturais e integrais',
          'Controle o tamanho das porções',
        ],
      });
    }
  } catch (error) {
    console.error('Erro no endpoint:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar plano nutricional' },
      { status: 500 }
    );
  }
}
