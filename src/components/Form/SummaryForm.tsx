import React from 'react';
import { CVData } from '../../types/cv.types';
import AIEnhanceButton from './AIEnhanceButton';

interface SummaryFormProps {
  cvData: CVData;
  onUpdate: (value: string) => void;
  onEnhance: () => void;
  isEnhancing: boolean;
}

const SummaryForm: React.FC<SummaryFormProps> = ({ cvData, onUpdate, onEnhance, isEnhancing }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Resumo Profissional</h2>
      <textarea
        placeholder="Escreva um resumo sobre sua carreira e objetivos."
        value={cvData.summary}
        onChange={(e) => onUpdate(e.target.value)}
        className="w-full rounded-md border border-gray-300 p-3 min-h-[150px] shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        maxLength={500}
      />
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{cvData.summary.length}/500 caracteres</span>
        <AIEnhanceButton onClick={onEnhance} loading={isEnhancing} label="Melhorar Resumo com IA" />
      </div>
    </div>
  );
};

export default SummaryForm;
