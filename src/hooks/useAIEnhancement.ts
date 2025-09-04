import { useState, useCallback } from 'react';
import { enhanceTextWithAI } from '../services/aiService';
import { CVData } from '../types/cv.types';

export const useAIEnhancement = (
    cvData: CVData, 
    setCVDataDirectly: (data: CVData) => void,
    showToast: (message: string, type: 'success' | 'error') => void
) => {
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [enhancingId, setEnhancingId] = useState<string | null>(null);

  const handleEnhance = useCallback(async (field: 'summary' | 'experiences', id?: string) => {
    setIsEnhancing(true);
    if (id) setEnhancingId(id);
    showToast('Processando melhoria com IA...', 'success');

    try {
      let textToEnhance: string | undefined = '';
      let context: 'summary' | 'experience' = 'summary';

      if (field === 'summary') {
        textToEnhance = cvData.summary;
        context = 'summary';
      } else if (id) {
        const experience = cvData.experiences.find(exp => exp.id === id);
        if (experience) {
          textToEnhance = experience.description;
          context = 'experience';
        }
      }

      if (textToEnhance === undefined) {
          throw new Error("Text to enhance is undefined.");
      }

      const improvedText = await enhanceTextWithAI({ text: textToEnhance, context });

      if (field === 'summary') {
        setCVDataDirectly({ ...cvData, summary: improvedText });
      } else if (id) {
        setCVDataDirectly({
          ...cvData,
          experiences: cvData.experiences.map(exp =>
            exp.id === id ? { ...exp, description: improvedText } : exp
          ),
        });
      }

      showToast('Melhoria concluída!', 'success');
    } catch (error) {
      console.error("Erro na melhoria de IA:", error);
      showToast('Falha na melhoria de IA. Tente novamente.', 'error');
    } finally {
      setIsEnhancing(false);
      setEnhancingId(null);
    }
  }, [cvData, setCVDataDirectly, showToast]);

  return { isEnhancing, enhancingId, handleEnhance };
};
