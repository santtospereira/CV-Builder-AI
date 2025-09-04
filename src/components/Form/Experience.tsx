import React from 'react';
import { Experience } from '../../types/cv.types';
import AIEnhanceButton from './AIEnhanceButton';

interface ExperienceFormProps {
  experiences: Experience[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, key: keyof Experience, value: string | boolean) => void;
  onEnhance: (id: string) => void;
  isEnhancing: boolean;
  enhancingId: string | null;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ experiences, onAdd, onRemove, onUpdate, onEnhance, isEnhancing, enhancingId }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Experiências Profissionais</h2>
      {experiences.map(exp => (
        <div key={exp.id} className="space-y-2 rounded-md border border-gray-300 p-4 shadow-sm bg-gray-50">
          <input
            type="text"
            placeholder="Empresa"
            value={exp.company}
            onChange={(e) => onUpdate(exp.id, 'company', e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
          />
          <input
            type="text"
            placeholder="Cargo"
            value={exp.position}
            onChange={(e) => onUpdate(exp.id, 'position', e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
          />
          <input
            type="text"
            placeholder="Período (ex: Jan 2020 - Dez 2022)"
            value={exp.period}
            onChange={(e) => onUpdate(exp.id, 'period', e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
          />
          <div className="flex items-center space-x-2">
            <input type="checkbox" checked={exp.isCurrent} onChange={(e) => onUpdate(exp.id, 'isCurrent', e.target.checked)} className="rounded-md text-blue-600" />
            <label className="text-sm">Trabalho atual</label>
          </div>
          <textarea
            placeholder="Descrição das responsabilidades e conquistas."
            value={exp.description}
            onChange={(e) => onUpdate(exp.id, 'description', e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
          />
          <div className="flex justify-between items-center text-sm">
            <button onClick={() => onRemove(exp.id)} className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600">Remover</button>
            <AIEnhanceButton onClick={() => onEnhance(exp.id)} loading={isEnhancing && enhancingId === exp.id} label="Melhorar com IA" />
          </div>
        </div>
      ))}
      <button onClick={onAdd} className="w-full rounded-md bg-green-500 py-2 text-white font-semibold hover:bg-green-600 transition-colors">Adicionar Experiência</button>
    </div>
  );
};

export default ExperienceForm;
