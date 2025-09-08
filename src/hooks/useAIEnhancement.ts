import { useState, useCallback, useRef } from 'react';
import { enhanceText } from '../services/aiService';
import { CVData, Experience } from '../types/cv.types';

const getSystemPrompt = (context: 'summary' | 'experience'): string => {
  switch (context) {
    case 'summary':
      return 'Aprimore o seguinte resumo de currículo para ser mais profissional, conciso e impactante. Destaque as principais qualificações e use palavras-chave relevantes para a área de atuação do candidato. O texto a ser aprimorado é: ';
    case 'experience':
      return 'Reescreva a seguinte descrição de experiência profissional, utilizando verbos de ação fortes, quantificando conquistas sempre que possível e focando nos resultados e no impacto gerado. O texto a ser aprimorado é: ';
    default:
      return 'Melhore o seguinte texto: ';
  }
};

export const useAIEnhancement = (
    cvData: CVData,
    setCVDataDirectly: (data: CVData) => void,
    showToast: (message: string, type: 'success' | 'error') => void
) => {
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [enhancingId, setEnhancingId] = useState<string | null>(null);
  const cvDataRef = useRef(cvData);
  cvDataRef.current = cvData;

  const handleEnhance = useCallback(async (textToEnhance: string, context: 'summary' | 'experience', id?: string) => {
    console.log(`handleEnhance called with context: ${context}, id: ${id}`);
    setIsEnhancing(true);
    if (id) setEnhancingId(id);
    showToast('Processando melhoria com IA...', 'success');

    try {
      if (textToEnhance === undefined || textToEnhance.trim() === '') {
          throw new Error("O texto para melhoria não pode estar vazio.");
      }

      const prompt = getSystemPrompt(context) + textToEnhance;
      const improvedText = await enhanceText(prompt);
      const currentCvData = cvDataRef.current;

      if (improvedText === "Não foi possível melhorar o texto no momento.") {
        throw new Error(improvedText);
      }

      if (context === 'summary') {
        setCVDataDirectly({ ...currentCvData, summary: improvedText });
      } else if (id) {
        setCVDataDirectly({
          ...currentCvData,
          experiences: currentCvData.experiences.map((exp: Experience) =>
            exp.id === id ? { ...exp, description: improvedText } : exp
          ),
        });
      }

      showToast('Melhoria concluída!', 'success');
    } catch (error) {
      console.error("Erro na melhoria de IA:", error);
      showToast(`Falha na melhoria de IA: ${error instanceof Error ? error.message : 'Erro desconhecido.'}`, 'error');
    } finally {
      setIsEnhancing(false);
      setEnhancingId(null);
    }
  }, [setCVDataDirectly, showToast]);

  return { isEnhancing, enhancingId, handleEnhance };
};
