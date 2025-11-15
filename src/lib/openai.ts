// FitIA - AI Client (usando Lasy AI)

export async function analyzeFoodImage(imageUrl: string) {
  try {
    const response = await fetch('/api/analyze-food', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      throw new Error('Erro ao analisar imagem');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao analisar imagem:', error);
    throw error;
  }
}

export async function generateWeeklyNutritionPlan(profile: any) {
  try {
    const response = await fetch('/api/generate-nutrition', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profile, type: 'weekly' }),
    });

    if (!response.ok) {
      throw new Error('Erro ao gerar plano nutricional');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao gerar plano nutricional semanal:', error);
    throw error;
  }
}

export async function generateNutritionPlan(profile: any) {
  try {
    const response = await fetch('/api/generate-nutrition', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profile, type: 'daily' }),
    });

    if (!response.ok) {
      throw new Error('Erro ao gerar plano nutricional');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao gerar plano nutricional:', error);
    throw error;
  }
}

export async function generateWorkoutPlan(profile: any, type: 'home' | 'gym') {
  try {
    const response = await fetch('/api/generate-workout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profile, type }),
    });

    if (!response.ok) {
      throw new Error('Erro ao gerar treino');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao gerar treino:', error);
    throw error;
  }
}
