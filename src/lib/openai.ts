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

    const data = await response.json();

    if (!response.ok) {
      // Retorna a mensagem de erro específica da API
      throw new Error(data.error || 'Erro ao analisar imagem');
    }

    return data;
  } catch (error: any) {
    console.error('Erro ao analisar imagem:', error);
    throw new Error(error.message || 'Erro ao analisar imagem');
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao gerar plano nutricional');
    }

    return data;
  } catch (error: any) {
    console.error('Erro ao gerar plano nutricional semanal:', error);
    throw new Error(error.message || 'Erro ao gerar plano nutricional semanal');
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao gerar plano nutricional');
    }

    return data;
  } catch (error: any) {
    console.error('Erro ao gerar plano nutricional:', error);
    throw new Error(error.message || 'Erro ao gerar plano nutricional');
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao gerar treino');
    }

    return data;
  } catch (error: any) {
    console.error('Erro ao gerar treino:', error);
    throw new Error(error.message || 'Erro ao gerar treino');
  }
}
