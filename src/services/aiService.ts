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
  let lastError: Error | undefined;

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

      if (response.ok) {
        const data = await response.json();
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
          return data.choices[0].message.content.trim(); // Sucesso
        }
        lastError = new Error('A resposta da API da OpenAI não contém o formato esperado.');
        break; // Não tente novamente para dados malformados
      }

      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : delay * Math.pow(2, i);
        lastError = new Error(`Você atingiu o limite de requisições da API. Tentando novamente em ${waitTime / 1000} segundos.`);
        await new Promise(res => setTimeout(res, waitTime));
        continue;
      }

      // Erros de cliente (4xx) que não devem ser repetidos (exceto 429)
      if (response.status >= 400 && response.status < 500) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro de cliente na API da OpenAI (não haverá nova tentativa):', { status: response.status, data: errorData });
        lastError = new Error(`Erro na API: ${response.statusText}`);
        break; // Sai do loop
      }

      // Para erros de servidor (5xx), ou outros, vamos tentar novamente.
      const errorData = await response.json().catch(() => ({}));
      lastError = new Error(`Erro na API: ${response.statusText}`);
      console.error(`Erro na API da OpenAI (tentativa ${i + 1}/${retries}):`, { status: response.status, data: errorData });

    } catch (error) { // Captura erros de rede (ex: falha no fetch)
      lastError = error instanceof Error ? error : new Error('Ocorreu um erro de rede desconhecido');
      console.error(`Falha de rede ao chamar a API da OpenAI (tentativa ${i + 1}/${retries}):`, error);
    }

    // Espera antes da próxima tentativa
    if (i < retries - 1) {
      await new Promise(res => setTimeout(res, delay * Math.pow(2, i))); // Backoff exponencial
    }
  }

  // Se o loop terminar, lança o último erro que ocorreu.
  throw lastError ?? new Error('Falha ao obter resposta da API da OpenAI após múltiplas tentativas.');
};
