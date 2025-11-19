import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'URL da imagem é obrigatória' },
        { status: 400 }
      );
    }

    // Verifica se a chave da API está configurada
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Chave da API OpenAI não configurada. Configure OPENAI_API_KEY nas variáveis de ambiente.' },
        { status: 500 }
      );
    }

    // Analisa a imagem usando GPT-4 Vision
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Você é um nutricionista especializado em análise de alimentos. Analise a imagem fornecida e identifique TODOS os alimentos visíveis com precisão.

Para cada alimento identificado, forneça:
- Nome específico do alimento (em português)
- Peso estimado em gramas (seja realista com porções visuais)
- Calorias totais (baseado no peso estimado)
- Proteínas em gramas
- Carboidratos em gramas
- Gorduras em gramas

IMPORTANTE:
- Seja preciso e detalhado
- Se houver múltiplos alimentos no prato, liste cada um separadamente
- Use valores nutricionais reais e precisos
- Estime o peso baseado no tamanho visual dos alimentos
- Se não conseguir identificar claramente, informe "Alimento não identificado"

Responda APENAS com um JSON válido neste formato exato (sem markdown, sem explicações):
{
  "foods": [
    {
      "foodName": "nome do alimento em português",
      "estimatedWeight": 150,
      "calories": 200,
      "protein": 25.5,
      "carbs": 30.2,
      "fat": 8.5
    }
  ]
}`
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analise esta imagem de alimento e forneça os valores nutricionais detalhados de cada item visível:'
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
                detail: 'high'
              }
            }
          ]
        }
      ],
      max_tokens: 1500,
      temperature: 0.2,
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Resposta vazia da IA');
    }

    // Parse da resposta JSON
    let analysis;
    try {
      // Remove possíveis marcadores de código markdown
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Erro ao fazer parse da resposta:', content);
      throw new Error('Formato de resposta inválido da IA');
    }

    // Valida a estrutura da resposta
    if (!analysis.foods || !Array.isArray(analysis.foods) || analysis.foods.length === 0) {
      throw new Error('Nenhum alimento identificado na imagem');
    }

    // Valida e normaliza cada alimento
    analysis.foods = analysis.foods.map((food: any) => ({
      foodName: food.foodName || 'Alimento não identificado',
      estimatedWeight: Number(food.estimatedWeight) || 0,
      calories: Number(food.calories) || 0,
      protein: Number(food.protein) || 0,
      carbs: Number(food.carbs) || 0,
      fat: Number(food.fat) || 0,
    }));

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('Erro ao analisar alimento:', error);
    
    // Mensagens de erro mais específicas
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'Chave da API OpenAI não configurada. Configure OPENAI_API_KEY nas variáveis de ambiente.' },
        { status: 500 }
      );
    }
    
    if (error.message?.includes('Nenhum alimento')) {
      return NextResponse.json(
        { error: 'Não foi possível identificar alimentos na imagem. Tente uma foto mais clara do prato.' },
        { status: 400 }
      );
    }

    if (error.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'Chave da API OpenAI inválida. Verifique sua configuração.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Erro ao analisar imagem. Tente novamente.' },
      { status: 500 }
    );
  }
}
