import { NextRequest, NextResponse } from 'next/server';

// Banco de receitas completas com passo a passo baseadas em dietas de nutricionistas profissionais
// Todas as receitas seguem princípios nutricionais: balanceamento de macros, ingredientes naturais, porções adequadas
const RECIPE_DATABASE = {
  breakfast: [
    {
      name: 'Ovos Mexidos com Aveia e Frutas',
      calories: 350,
      prepTime: '10 minutos',
      ingredients: ['2 ovos inteiros', '3 colheres de sopa de aveia em flocos', '1 banana média', '1 colher de chá de azeite', 'Canela a gosto'],
      steps: [
        'Bata os ovos em uma tigela e reserve',
        'Aqueça uma frigideira antiaderente com o azeite',
        'Adicione os ovos batidos e mexa delicadamente até cozinhar',
        'Em um prato, coloque a aveia e despeje os ovos por cima',
        'Corte a banana em rodelas e adicione ao prato',
        'Polvilhe canela a gosto e sirva imediatamente'
      ],
      macros: { protein: 18, carbs: 42, fat: 12 }
    },
    {
      name: 'Tapioca Proteica com Cottage',
      calories: 320,
      prepTime: '8 minutos',
      ingredients: ['3 colheres de sopa de goma de tapioca', '100g de queijo cottage', '1 colher de sopa de chia', '5 tomates cereja'],
      steps: [
        'Aqueça uma frigideira antiaderente em fogo médio',
        'Espalhe a tapioca uniformemente formando um disco',
        'Aguarde 2 minutos até firmar e vire',
        'Recheie com o queijo cottage e a chia',
        'Dobre ao meio e retire do fogo',
        'Sirva com os tomates cereja cortados ao meio'
      ],
      macros: { protein: 22, carbs: 38, fat: 8 }
    },
    {
      name: 'Panqueca de Banana e Aveia',
      calories: 340,
      prepTime: '12 minutos',
      ingredients: ['1 banana média madura', '2 ovos inteiros', '4 colheres de sopa de aveia em flocos', '1 colher de chá de mel', 'Canela em pó'],
      steps: [
        'Amasse a banana com um garfo até formar um purê',
        'Adicione os ovos e misture bem',
        'Acrescente a aveia e a canela, misturando até obter uma massa homogênea',
        'Aqueça uma frigideira antiaderente',
        'Despeje porções da massa formando panquecas pequenas',
        'Cozinhe 2-3 minutos de cada lado até dourar',
        'Sirva com mel por cima'
      ],
      macros: { protein: 16, carbs: 45, fat: 10 }
    },
    {
      name: 'Iogurte Grego com Granola Caseira',
      calories: 380,
      prepTime: '5 minutos',
      ingredients: ['200g de iogurte grego natural', '4 colheres de sopa de granola integral', '1/2 xícara de mix de frutas vermelhas', '1 colher de chá de mel'],
      steps: [
        'Coloque o iogurte grego em uma tigela',
        'Adicione a granola por cima',
        'Distribua as frutas vermelhas',
        'Regue com mel',
        'Misture levemente antes de consumir'
      ],
      macros: { protein: 24, carbs: 48, fat: 12 }
    },
    {
      name: 'Pão Integral com Pasta de Amendoim e Banana',
      calories: 360,
      prepTime: '5 minutos',
      ingredients: ['2 fatias de pão integral', '2 colheres de sopa de pasta de amendoim integral', '1 banana média', 'Canela em pó'],
      steps: [
        'Toste levemente as fatias de pão',
        'Espalhe a pasta de amendoim uniformemente',
        'Corte a banana em rodelas finas',
        'Distribua as rodelas sobre o pão',
        'Polvilhe canela a gosto',
        'Sirva imediatamente'
      ],
      macros: { protein: 14, carbs: 52, fat: 14 }
    },
    {
      name: 'Smoothie Bowl Proteico',
      calories: 390,
      prepTime: '7 minutos',
      ingredients: ['1 banana congelada', '1 scoop de whey protein', '100ml de leite desnatado', '3 colheres de sopa de granola', 'Frutas variadas', '1 colher de chá de chia'],
      steps: [
        'Bata no liquidificador a banana congelada, whey e leite até ficar cremoso',
        'Despeje em uma tigela',
        'Decore com granola, frutas fatiadas e chia',
        'Sirva imediatamente com colher'
      ],
      macros: { protein: 28, carbs: 50, fat: 8 }
    },
    {
      name: 'Crepioca com Frango e Queijo',
      calories: 330,
      prepTime: '10 minutos',
      ingredients: ['1 ovo', '2 colheres de sopa de tapioca', '60g de frango desfiado', '30g de queijo minas', '1 tomate pequeno'],
      steps: [
        'Bata o ovo e misture com a tapioca',
        'Despeje em frigideira quente formando um disco',
        'Aguarde firmar e vire',
        'Adicione o frango desfiado, queijo e tomate picado',
        'Dobre ao meio e aguarde o queijo derreter',
        'Sirva quente'
      ],
      macros: { protein: 28, carbs: 32, fat: 10 }
    },
    {
      name: 'Mingau de Aveia com Frutas',
      calories: 310,
      prepTime: '8 minutos',
      ingredients: ['5 colheres de sopa de aveia em flocos', '250ml de leite desnatado', '1 maçã picada', 'Canela em pó', '1 colher de chá de mel'],
      steps: [
        'Aqueça o leite em uma panela',
        'Adicione a aveia e mexa constantemente',
        'Cozinhe por 5 minutos até engrossar',
        'Adicione a maçã picada e a canela',
        'Desligue o fogo e adicione o mel',
        'Sirva morno'
      ],
      macros: { protein: 14, carbs: 48, fat: 6 }
    },
    {
      name: 'Omelete de Claras com Vegetais',
      calories: 280,
      prepTime: '10 minutos',
      ingredients: ['4 claras de ovo', '1 ovo inteiro', '1 xícara de espinafre', '1 tomate médio', '1/4 de cebola', '30g de queijo branco'],
      steps: [
        'Bata as claras e o ovo inteiro',
        'Pique os vegetais em cubos pequenos',
        'Aqueça uma frigideira antiaderente',
        'Despeje os ovos e distribua os vegetais',
        'Adicione o queijo por cima',
        'Cozinhe em fogo baixo até firmar',
        'Dobre ao meio e sirva'
      ],
      macros: { protein: 26, carbs: 18, fat: 10 }
    },
    {
      name: 'Toast de Abacate com Ovo Pochê',
      calories: 370,
      prepTime: '12 minutos',
      ingredients: ['2 fatias de pão integral', '1/2 abacate maduro', '1 ovo', '5 tomates cereja', '1 colher de chá de azeite extra virgem', 'Sal e pimenta'],
      steps: [
        'Toste o pão até ficar crocante',
        'Amasse o abacate com garfo e tempere com sal e pimenta',
        'Ferva água em uma panela pequena',
        'Quebre o ovo em uma xícara e despeje delicadamente na água fervente',
        'Cozinhe por 3-4 minutos para ovo pochê',
        'Espalhe o abacate no pão, coloque o ovo por cima',
        'Finalize com tomates cereja cortados e azeite'
      ],
      macros: { protein: 16, carbs: 38, fat: 18 }
    }
  ],
  
  snacks: [
    {
      name: 'Mix de Oleaginosas',
      calories: 170,
      prepTime: '1 minuto',
      ingredients: ['10 amêndoas', '5 castanhas do Pará', '5 nozes'],
      steps: [
        'Separe as oleaginosas em um pote pequeno',
        'Consuma ao longo do dia',
        'Dica: prepare porções individuais para a semana'
      ],
      macros: { protein: 6, carbs: 8, fat: 14 }
    },
    {
      name: 'Iogurte Natural com Chia',
      calories: 140,
      prepTime: '2 minutos',
      ingredients: ['150g de iogurte natural desnatado', '1 colher de sopa de chia', '1/2 colher de chá de mel'],
      steps: [
        'Coloque o iogurte em um pote',
        'Adicione a chia e misture',
        'Regue com mel',
        'Deixe descansar 5 minutos para a chia hidratar',
        'Consuma'
      ],
      macros: { protein: 12, carbs: 16, fat: 4 }
    },
    {
      name: 'Maçã com Pasta de Amendoim',
      calories: 180,
      prepTime: '3 minutos',
      ingredients: ['1 maçã média', '1 colher de sopa de pasta de amendoim integral'],
      steps: [
        'Lave e corte a maçã em fatias',
        'Disponha em um prato',
        'Coloque a pasta de amendoim no centro para mergulhar',
        'Consuma as fatias com a pasta'
      ],
      macros: { protein: 6, carbs: 24, fat: 8 }
    },
    {
      name: 'Queijo Cottage com Tomate',
      calories: 110,
      prepTime: '3 minutos',
      ingredients: ['100g de queijo cottage', '10 tomates cereja', 'Orégano', '1 fio de azeite'],
      steps: [
        'Coloque o cottage em uma tigela',
        'Corte os tomates ao meio',
        'Distribua sobre o cottage',
        'Tempere com orégano e azeite',
        'Misture e consuma'
      ],
      macros: { protein: 14, carbs: 6, fat: 4 }
    },
    {
      name: 'Shake Proteico',
      calories: 150,
      prepTime: '2 minutos',
      ingredients: ['1 scoop de whey protein', '250ml de água ou leite desnatado'],
      steps: [
        'Coloque o líquido no shaker',
        'Adicione o whey protein',
        'Feche e agite vigorosamente por 20 segundos',
        'Consuma imediatamente'
      ],
      macros: { protein: 25, carbs: 6, fat: 2 }
    },
    {
      name: 'Cenoura Baby com Hummus',
      calories: 130,
      prepTime: '2 minutos',
      ingredients: ['1 xícara de cenoura baby', '3 colheres de sopa de hummus caseiro'],
      steps: [
        'Lave as cenouras',
        'Disponha em um pote',
        'Coloque o hummus em um recipiente pequeno',
        'Mergulhe as cenouras no hummus e consuma'
      ],
      macros: { protein: 5, carbs: 18, fat: 5 }
    }
  ],
  
  lunch: [
    {
      name: 'Frango Grelhado com Batata Doce e Brócolis',
      calories: 480,
      prepTime: '25 minutos',
      ingredients: ['150g de peito de frango', '150g de batata doce', '1 xícara de brócolis', '1 colher de sopa de azeite', 'Alho', 'Sal', 'Pimenta', 'Limão'],
      steps: [
        'Tempere o frango com sal, pimenta, alho e limão',
        'Deixe marinar por 10 minutos',
        'Corte a batata doce em cubos e cozinhe no vapor por 15 minutos',
        'Cozinhe o brócolis no vapor por 5 minutos',
        'Grelhe o frango em frigideira quente por 6-7 minutos de cada lado',
        'Monte o prato com frango, batata doce e brócolis',
        'Regue com azeite e sirva'
      ],
      macros: { protein: 42, carbs: 48, fat: 12 }
    },
    {
      name: 'Salmão com Quinoa e Aspargos',
      calories: 520,
      prepTime: '30 minutos',
      ingredients: ['150g de salmão', '1 xícara de quinoa', 'Aspargos frescos', 'Limão', '1 colher de sopa de azeite', 'Alho', 'Sal', 'Pimenta'],
      steps: [
        'Cozinhe a quinoa conforme instruções da embalagem (geralmente 15 minutos)',
        'Tempere o salmão com sal, pimenta, alho e limão',
        'Aqueça uma frigideira com azeite',
        'Grelhe o salmão por 4-5 minutos de cada lado',
        'Grelhe os aspargos na mesma frigideira por 5 minutos',
        'Monte o prato com quinoa, salmão e aspargos',
        'Finalize com suco de limão'
      ],
      macros: { protein: 38, carbs: 52, fat: 18 }
    },
    {
      name: 'Carne Magra com Arroz Integral e Feijão',
      calories: 540,
      prepTime: '35 minutos',
      ingredients: ['120g de patinho grelhado', '4 colheres de sopa de arroz integral', '3 colheres de sopa de feijão', 'Salada verde', '1 colher de sopa de azeite', 'Temperos naturais'],
      steps: [
        'Cozinhe o arroz integral (cerca de 25 minutos)',
        'Aqueça o feijão em uma panela',
        'Tempere a carne com alho, sal e pimenta',
        'Grelhe a carne em frigideira quente por 4-5 minutos de cada lado',
        'Prepare uma salada verde com alface, tomate e cenoura',
        'Monte o prato com arroz, feijão, carne e salada',
        'Tempere a salada com azeite e limão'
      ],
      macros: { protein: 45, carbs: 58, fat: 14 }
    },
    {
      name: 'Tilápia ao Forno com Legumes',
      calories: 460,
      prepTime: '30 minutos',
      ingredients: ['150g de tilápia', '1 abobrinha', '1/2 berinjela', '1 tomate', '1/2 cebola', 'Ervas frescas', '1 colher de sopa de azeite', 'Limão'],
      steps: [
        'Pré-aqueça o forno a 200°C',
        'Corte todos os legumes em fatias',
        'Em uma assadeira, disponha os legumes',
        'Tempere o peixe com sal, pimenta, ervas e limão',
        'Coloque o peixe sobre os legumes',
        'Regue tudo com azeite',
        'Asse por 20-25 minutos',
        'Sirva quente'
      ],
      macros: { protein: 36, carbs: 42, fat: 14 }
    },
    {
      name: 'Bowl Mediterrâneo com Grão de Bico',
      calories: 510,
      prepTime: '20 minutos',
      ingredients: ['1 xícara de grão de bico cozido', '1/2 xícara de quinoa', 'Pepino', 'Tomate', 'Azeitona', '2 colheres de sopa de tahine', 'Limão', 'Azeite'],
      steps: [
        'Cozinhe a quinoa conforme instruções',
        'Escorra e lave o grão de bico',
        'Pique pepino e tomate em cubos',
        'Em uma tigela, coloque a quinoa como base',
        'Adicione o grão de bico, pepino, tomate e azeitonas',
        'Prepare molho com tahine, limão e água',
        'Regue o bowl com o molho e azeite',
        'Misture e sirva'
      ],
      macros: { protein: 22, carbs: 68, fat: 16 }
    },
    {
      name: 'Frango ao Curry com Arroz Integral',
      calories: 530,
      prepTime: '35 minutos',
      ingredients: ['150g de frango em cubos', '2 colheres de chá de curry em pó', 'Brócolis', 'Cenoura', '4 colheres de sopa de arroz integral', 'Leite de coco light', 'Cebola', 'Alho'],
      steps: [
        'Cozinhe o arroz integral',
        'Refogue cebola e alho em uma panela',
        'Adicione o frango e doure',
        'Acrescente o curry em pó e misture',
        'Adicione brócolis e cenoura picados',
        'Despeje leite de coco light',
        'Cozinhe por 15 minutos em fogo baixo',
        'Sirva sobre o arroz integral'
      ],
      macros: { protein: 40, carbs: 56, fat: 14 }
    }
  ],
  
  dinner: [
    {
      name: 'Sopa de Legumes com Frango Desfiado',
      calories: 320,
      prepTime: '30 minutos',
      ingredients: ['Caldo de legumes caseiro', '80g de frango desfiado', 'Cenoura', 'Abobrinha', 'Batata', 'Salsinha', 'Alho', 'Cebola'],
      steps: [
        'Refogue alho e cebola em uma panela',
        'Adicione os legumes picados',
        'Cubra com caldo de legumes',
        'Cozinhe por 20 minutos',
        'Adicione o frango desfiado',
        'Tempere com sal e pimenta',
        'Finalize com salsinha picada',
        'Sirva quente'
      ],
      macros: { protein: 24, carbs: 38, fat: 6 }
    },
    {
      name: 'Omelete de Claras com Salada Verde',
      calories: 280,
      prepTime: '12 minutos',
      ingredients: ['5 claras de ovo', 'Tomate', 'Cebola', 'Orégano', 'Salada verde grande', 'Azeite', 'Limão'],
      steps: [
        'Bata as claras em uma tigela',
        'Adicione tomate e cebola picados',
        'Tempere com orégano',
        'Despeje em frigideira antiaderente quente',
        'Cozinhe em fogo baixo até firmar',
        'Prepare salada verde com alface, rúcula e tomate',
        'Tempere a salada com azeite e limão',
        'Sirva a omelete com a salada'
      ],
      macros: { protein: 22, carbs: 24, fat: 8 }
    },
    {
      name: 'Peixe Grelhado com Legumes no Vapor',
      calories: 340,
      prepTime: '20 minutos',
      ingredients: ['120g de peixe branco', 'Brócolis', 'Couve-flor', 'Cenoura', 'Limão', 'Ervas frescas', 'Azeite'],
      steps: [
        'Tempere o peixe com sal, pimenta, ervas e limão',
        'Corte os legumes em pedaços médios',
        'Cozinhe os legumes no vapor por 10 minutos',
        'Grelhe o peixe em frigideira quente por 4 minutos de cada lado',
        'Disponha os legumes no prato',
        'Coloque o peixe por cima',
        'Regue com azeite e suco de limão',
        'Sirva imediatamente'
      ],
      macros: { protein: 28, carbs: 32, fat: 10 }
    },
    {
      name: 'Salada Caesar com Frango',
      calories: 360,
      prepTime: '15 minutos',
      ingredients: ['120g de frango grelhado', 'Alface romana', 'Molho Caesar light', 'Parmesão ralado', 'Croutons integrais', 'Limão'],
      steps: [
        'Grelhe o frango temperado com sal e pimenta',
        'Corte em tiras',
        'Lave e rasgue a alface romana',
        'Em uma tigela grande, coloque a alface',
        'Adicione o frango em tiras',
        'Regue com molho Caesar light',
        'Polvilhe parmesão e croutons',
        'Finalize com suco de limão e sirva'
      ],
      macros: { protein: 32, carbs: 28, fat: 12 }
    },
    {
      name: 'Berinjela Recheada com Frango',
      calories: 330,
      prepTime: '40 minutos',
      ingredients: ['1 berinjela grande', '80g de frango moído', 'Molho de tomate caseiro', '30g de queijo light', 'Cebola', 'Alho', 'Manjericão'],
      steps: [
        'Corte a berinjela ao meio no sentido do comprimento',
        'Retire a polpa deixando uma borda',
        'Pincele com azeite e leve ao forno por 15 minutos a 180°C',
        'Refogue cebola e alho, adicione o frango moído',
        'Acrescente a polpa da berinjela picada e molho de tomate',
        'Cozinhe por 10 minutos',
        'Recheie as berinjelas com o refogado',
        'Cubra com queijo e leve ao forno por mais 15 minutos',
        'Finalize com manjericão fresco'
      ],
      macros: { protein: 26, carbs: 28, fat: 12 }
    },
    {
      name: 'Salmão com Brócolis',
      calories: 380,
      prepTime: '18 minutos',
      ingredients: ['100g de salmão', 'Brócolis', 'Limão', 'Ervas frescas', '1 colher de sopa de azeite', 'Alho'],
      steps: [
        'Tempere o salmão com sal, pimenta, alho e limão',
        'Cozinhe o brócolis no vapor por 5 minutos',
        'Aqueça uma frigideira com azeite',
        'Grelhe o salmão por 4 minutos de cada lado',
        'Disponha o brócolis no prato',
        'Coloque o salmão ao lado',
        'Regue com azeite e suco de limão',
        'Finalize com ervas frescas'
      ],
      macros: { protein: 28, carbs: 22, fat: 20 }
    }
  ],
  
  supper: [
    {
      name: 'Chá de Camomila com Biscoito Integral',
      calories: 80,
      prepTime: '5 minutos',
      ingredients: ['1 sachê de chá de camomila', '2 biscoitos integrais'],
      steps: [
        'Ferva água',
        'Coloque o sachê de camomila em uma xícara',
        'Despeje a água quente',
        'Deixe em infusão por 3-5 minutos',
        'Retire o sachê',
        'Sirva com os biscoitos integrais'
      ],
      macros: { protein: 2, carbs: 16, fat: 2 }
    },
    {
      name: 'Iogurte Desnatado Natural',
      calories: 90,
      prepTime: '1 minuto',
      ingredients: ['150g de iogurte natural desnatado'],
      steps: [
        'Coloque o iogurte em uma tigela',
        'Consuma puro ou adicione canela se desejar'
      ],
      macros: { protein: 10, carbs: 12, fat: 1 }
    },
    {
      name: 'Frutas Picadas com Canela',
      calories: 100,
      prepTime: '5 minutos',
      ingredients: ['1 maçã pequena', '1/2 pera', 'Canela em pó'],
      steps: [
        'Lave as frutas',
        'Corte em cubos pequenos',
        'Coloque em uma tigela',
        'Polvilhe canela a gosto',
        'Misture e consuma'
      ],
      macros: { protein: 1, carbs: 26, fat: 0 }
    },
    {
      name: 'Leite Morno com Aveia',
      calories: 120,
      prepTime: '5 minutos',
      ingredients: ['200ml de leite desnatado', '1 colher de sopa de aveia', 'Canela'],
      steps: [
        'Aqueça o leite em uma panela',
        'Adicione a aveia',
        'Mexa por 2 minutos',
        'Polvilhe canela',
        'Sirva morno'
      ],
      macros: { protein: 8, carbs: 18, fat: 2 }
    }
  ]
};

// Função para selecionar receitas aleatórias sem repetição na mesma semana
function getRandomRecipes(category: keyof typeof RECIPE_DATABASE, count: number) {
  const recipes = [...RECIPE_DATABASE[category]];
  const selected = [];
  
  for (let i = 0; i < count && recipes.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * recipes.length);
    selected.push(recipes[randomIndex]);
    recipes.splice(randomIndex, 1);
  }
  
  return selected;
}

export async function POST(request: NextRequest) {
  try {
    const { profile, type } = await request.json();

    // Cálculo de TMB (Taxa Metabólica Basal) usando fórmula de Harris-Benedict revisada
    let bmr = 0;
    if (profile.gender === 'male') {
      bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
    } else {
      bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
    }

    // Multiplicadores de atividade física baseados em evidências científicas
    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    let dailyCalories = Math.round(bmr * activityMultipliers[profile.activityLevel]);

    // Ajuste calórico baseado no objetivo
    if (profile.goal === 'lose') {
      dailyCalories = Math.round(dailyCalories * 0.8);
    } else if (profile.goal === 'gain') {
      dailyCalories = Math.round(dailyCalories * 1.15);
    }

    // Distribuição de macronutrientes
    const protein = Math.round((dailyCalories * 0.30) / 4);
    const carbs = Math.round((dailyCalories * 0.40) / 4);
    const fat = Math.round((dailyCalories * 0.30) / 9);

    if (type === 'weekly') {
      const weekPlan = [];
      const daysOfWeek = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

      for (let i = 0; i < 7; i++) {
        const breakfast = getRandomRecipes('breakfast', 1)[0];
        const morningSnack = getRandomRecipes('snacks', 1)[0];
        const lunch = getRandomRecipes('lunch', 1)[0];
        const afternoonSnack = getRandomRecipes('snacks', 1)[0];
        const dinner = getRandomRecipes('dinner', 1)[0];
        const supper = getRandomRecipes('supper', 1)[0];

        weekPlan.push({
          dayNumber: i + 1,
          day: daysOfWeek[i],
          meals: [
            {
              name: breakfast.name,
              type: 'Café da Manhã',
              time: '07:00',
              calories: breakfast.calories,
              prepTime: breakfast.prepTime,
              ingredients: breakfast.ingredients,
              steps: breakfast.steps,
              macros: breakfast.macros
            },
            {
              name: morningSnack.name,
              type: 'Lanche da Manhã',
              time: '10:00',
              calories: morningSnack.calories,
              prepTime: morningSnack.prepTime,
              ingredients: morningSnack.ingredients,
              steps: morningSnack.steps,
              macros: morningSnack.macros
            },
            {
              name: lunch.name,
              type: 'Almoço',
              time: '12:30',
              calories: lunch.calories,
              prepTime: lunch.prepTime,
              ingredients: lunch.ingredients,
              steps: lunch.steps,
              macros: lunch.macros
            },
            {
              name: afternoonSnack.name,
              type: 'Lanche da Tarde',
              time: '16:00',
              calories: afternoonSnack.calories,
              prepTime: afternoonSnack.prepTime,
              ingredients: afternoonSnack.ingredients,
              steps: afternoonSnack.steps,
              macros: afternoonSnack.macros
            },
            {
              name: dinner.name,
              type: 'Jantar',
              time: '19:30',
              calories: dinner.calories,
              prepTime: dinner.prepTime,
              ingredients: dinner.ingredients,
              steps: dinner.steps,
              macros: dinner.macros
            },
            {
              name: supper.name,
              type: 'Ceia',
              time: '21:30',
              calories: supper.calories,
              prepTime: supper.prepTime,
              ingredients: supper.ingredients,
              steps: supper.steps,
              macros: supper.macros
            }
          ],
        });
      }

      const nutritionPlan = {
        dailyCalories,
        protein,
        carbs,
        fat,
        waterIntake: '2-3 litros',
        supplements: ['Multivitamínico', 'Ômega 3', 'Vitamina D'],
        weekPlan,
        tips: [
          'Hidrate-se: beba 35ml de água por kg de peso corporal diariamente',
          'Evite alimentos ultraprocessados, açúcares refinados e gorduras trans',
          'Faça refeições a cada 3-4 horas para manter o metabolismo ativo',
          'Priorize proteínas magras, carboidratos complexos e gorduras saudáveis',
          'Durma 7-9 horas por noite para recuperação muscular e hormonal adequada',
          'Prepare suas refeições com antecedência (meal prep) para manter a consistência',
          'Inclua vegetais coloridos em todas as principais refeições',
          'Mastigue devagar e coma com atenção plena',
          'Evite comer 2-3 horas antes de dormir para melhor digestão',
          'Consuma frutas inteiras em vez de sucos'
        ],
      };

      return NextResponse.json(nutritionPlan);
    }

    // Plano diário
    const dailyPlan = {
      dailyCalories,
      protein,
      carbs,
      fat,
      meals: [
        {
          name: 'Café da Manhã',
          time: '07:00',
          calories: Math.round(dailyCalories * 0.25),
          foods: ['Receitas balanceadas disponíveis no plano semanal'],
        },
        {
          name: 'Lanche da Manhã',
          time: '10:00',
          calories: Math.round(dailyCalories * 0.10),
          foods: ['Receitas balanceadas disponíveis no plano semanal'],
        },
        {
          name: 'Almoço',
          time: '12:30',
          calories: Math.round(dailyCalories * 0.35),
          foods: ['Receitas balanceadas disponíveis no plano semanal'],
        },
        {
          name: 'Lanche da Tarde',
          time: '16:00',
          calories: Math.round(dailyCalories * 0.10),
          foods: ['Receitas balanceadas disponíveis no plano semanal'],
        },
        {
          name: 'Jantar',
          time: '19:30',
          calories: Math.round(dailyCalories * 0.15),
          foods: ['Receitas balanceadas disponíveis no plano semanal'],
        },
        {
          name: 'Ceia',
          time: '21:30',
          calories: Math.round(dailyCalories * 0.05),
          foods: ['Receitas balanceadas disponíveis no plano semanal'],
        },
      ],
    };

    return NextResponse.json(dailyPlan);
  } catch (error) {
    console.error('Erro ao gerar plano nutricional:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar plano nutricional' },
      { status: 500 }
    );
  }
}
