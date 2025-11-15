import { NextRequest, NextResponse } from 'next/server';

// Banco de dados de exercícios para casa
const homeExercises = [
  {
    name: 'Flexões',
    sets: 3,
    reps: '12-15',
    rest: '60s',
    calories: 35,
    description: 'Apoie as mãos no chão na largura dos ombros, corpo reto, desça até o peito quase tocar o chão e suba. Mantenha o core contraído.',
  },
  {
    name: 'Agachamento',
    sets: 3,
    reps: '15-20',
    rest: '60s',
    calories: 40,
    description: 'Pés na largura dos ombros, desça como se fosse sentar, joelhos não ultrapassam os pés. Mantenha o peso nos calcanhares.',
  },
  {
    name: 'Prancha',
    sets: 3,
    reps: '30-60s',
    rest: '45s',
    calories: 25,
    description: 'Apoie os antebraços e pontas dos pés no chão, corpo reto como uma prancha. Mantenha o abdômen contraído.',
  },
  {
    name: 'Burpees',
    sets: 3,
    reps: '10-12',
    rest: '90s',
    calories: 50,
    description: 'Agache, apoie as mãos no chão, jogue os pés para trás (prancha), faça uma flexão, volte os pés e pule. Movimento completo e explosivo.',
  },
  {
    name: 'Mountain Climbers',
    sets: 3,
    reps: '20-30',
    rest: '60s',
    calories: 45,
    description: 'Posição de prancha alta, traga alternadamente os joelhos em direção ao peito rapidamente. Mantenha o core estável.',
  },
  {
    name: 'Afundo',
    sets: 3,
    reps: '12-15 cada perna',
    rest: '60s',
    calories: 35,
    description: 'Dê um passo à frente e desça até ambos os joelhos formarem 90°. Alterne as pernas. Mantenha o tronco ereto.',
  },
  {
    name: 'Polichinelos',
    sets: 3,
    reps: '30-40',
    rest: '45s',
    calories: 30,
    description: 'Pule abrindo e fechando pernas e braços simultaneamente. Movimento aeróbico para aquecimento e cardio.',
  },
];

// Banco de dados de exercícios para academia
const gymExercises = [
  {
    name: 'Supino Reto',
    sets: 4,
    reps: '8-12',
    rest: '90s',
    calories: 50,
    description: 'Deitado no banco, desça a barra até o peito e empurre para cima. Controle o movimento na descida.',
  },
  {
    name: 'Agachamento Livre',
    sets: 4,
    reps: '8-12',
    rest: '120s',
    calories: 60,
    description: 'Barra nas costas, desça até as coxas ficarem paralelas ao chão. Mantenha a coluna neutra e o core contraído.',
  },
  {
    name: 'Levantamento Terra',
    sets: 4,
    reps: '6-10',
    rest: '120s',
    calories: 70,
    description: 'Pegue a barra do chão mantendo as costas retas, levante usando pernas e quadril. Movimento fundamental para força.',
  },
  {
    name: 'Remada Curvada',
    sets: 4,
    reps: '10-12',
    rest: '90s',
    calories: 45,
    description: 'Inclinado para frente, puxe a barra em direção ao abdômen. Mantenha as costas retas e contraia as escápulas.',
  },
  {
    name: 'Desenvolvimento com Halteres',
    sets: 3,
    reps: '10-12',
    rest: '90s',
    calories: 40,
    description: 'Sentado, empurre os halteres acima da cabeça. Controle o movimento e mantenha o core estável.',
  },
  {
    name: 'Rosca Direta',
    sets: 3,
    reps: '10-15',
    rest: '60s',
    calories: 30,
    description: 'Em pé, flexione os cotovelos trazendo a barra em direção aos ombros. Mantenha os cotovelos fixos.',
  },
  {
    name: 'Tríceps Pulley',
    sets: 3,
    reps: '12-15',
    rest: '60s',
    calories: 30,
    description: 'Empurre a barra para baixo estendendo os cotovelos. Mantenha os cotovelos próximos ao corpo.',
  },
  {
    name: 'Leg Press',
    sets: 4,
    reps: '12-15',
    rest: '90s',
    calories: 55,
    description: 'Empurre a plataforma com os pés, estendendo as pernas. Não trave os joelhos completamente.',
  },
];

function generateWorkoutPlan(profile: any, type: 'home' | 'gym') {
  const exercises = type === 'home' ? homeExercises : gymExercises;
  
  // Seleciona 5-7 exercícios
  const numExercises = Math.floor(Math.random() * 3) + 5; // 5 a 7 exercícios
  const selectedExercises = [];
  const usedIndices = new Set();
  
  while (selectedExercises.length < numExercises && selectedExercises.length < exercises.length) {
    const randomIndex = Math.floor(Math.random() * exercises.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      selectedExercises.push({ ...exercises[randomIndex] });
    }
  }
  
  // Calcula calorias totais e duração
  const totalCalories = selectedExercises.reduce((sum, ex) => sum + (ex.calories * ex.sets), 0);
  const estimatedMinutes = selectedExercises.length * 4; // ~4 min por exercício
  
  // Define objetivo baseado no perfil
  let goal = 'Manutenção da forma física';
  if (profile.goal === 'lose') {
    goal = 'Perda de peso e definição muscular';
  } else if (profile.goal === 'gain') {
    goal = 'Ganho de massa muscular';
  }
  
  return {
    type,
    goal,
    duration: `${estimatedMinutes}-${estimatedMinutes + 10} minutos`,
    totalCalories,
    exercises: selectedExercises,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { profile, type } = await request.json();

    // Simula um pequeno delay para parecer processamento real
    await new Promise(resolve => setTimeout(resolve, 1000));

    const workoutPlan = generateWorkoutPlan(profile, type);

    return NextResponse.json(workoutPlan);
  } catch (error) {
    console.error('Erro ao gerar treino:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar treino' },
      { status: 500 }
    );
  }
}
