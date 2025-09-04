import { AIEnhancementRequest } from '../types/api.types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

// Mapeia o contexto para uma instrução mais detalhada para a IA
const getSystemPrompt = (context: 'summary' | 'experience'): string => {
  switch (context) {
    case 'summary':
      return 'Você é um especialista em recrutamento. Aprimore o resumo de currículo a seguir para ser mais profissional, conciso e impactante. Destaque as principais qualificações e use palavras-chave relevantes para a área de atuação do candidato.';
    case 'experience':
      return 'Você é um especialista em recrutamento. Reescreva a descrição da experiência profissional a seguir, utilizando verbos de ação fortes, quantificando conquistas sempre que possível e focando nos resultados e no impacto gerado.';
    default:
      return 'Você é um assistente de escrita útil.';
  }
};

export const enhanceTextWithAI = async (
  payload: AIEnhancementRequest,
  retries = 3,
  delay = 1000
): Promise<string> => {
  if (!OPENAI_API_KEY) {
    throw new Error('A chave da API da OpenAI não foi configurada no arquivo .env');
  }

  const { text, context } = payload;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: getSystemPrompt(context),
            },
            {
              role: 'user',
              content: text,
            },
          ],
          temperature: 0.7,
          max_tokens: 150,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        }),
      });

      if (!response.ok) {
        // Para erros 5xx (server errors), vale a pena tentar novamente.
        // Para erros 4xx (client errors), não, mas simplificamos aqui.
        const errorData = await response.json();
        console.error(`Erro na API da OpenAI (tentativa ${i + 1}/${retries}):`, errorData);
        throw new Error(`Erro na API da OpenAI: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        return data.choices[0].message.content.trim(); // Sucesso, retorna o resultado
      }

      throw new Error('A resposta da API da OpenAI não contém o formato esperado.');

    } catch (error) {
      console.error(`Falha ao chamar a API da OpenAI (tentativa ${i + 1}/${retries}):`, error);
      if (i === retries - 1) {
        // Se for a última tentativa, lança o erro para o chamador
        throw error;
      }
      // Espera antes de tentar novamente
      await new Promise(res => setTimeout(res, delay));
    }
  }

  // Se o loop terminar sem sucesso (improvável com o throw acima, mas para segurança do TS)
  throw new Error('Falha ao obter resposta da API da OpenAI após múltiplas tentativas.');
};
