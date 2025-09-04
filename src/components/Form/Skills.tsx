import React from 'react';
import { Skill } from '../../types/cv.types';

interface SkillsFormProps {
  skills: Skill[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, key: keyof Skill, value: string) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ skills, onAdd, onRemove, onUpdate }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Habilidades</h2>
      {skills.map(skill => (
        <div key={skill.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
          <input
            type="text"
            placeholder="Nome da Habilidade"
            value={skill.name}
            onChange={(e) => onUpdate(skill.id, 'name', e.target.value)}
            className="flex-grow rounded-md border border-gray-300 p-2 text-sm"
          />
          <select
            value={skill.level}
            onChange={(e) => onUpdate(skill.id, 'level', e.target.value)}
            className="rounded-md border border-gray-300 p-2 text-sm"
          >
            <option>Básico</option>
            <option>Intermediário</option>
            <option>Avançado</option>
          </select>
          <button onClick={() => onRemove(skill.id)} className="rounded-md bg-red-500 px-3 py-2 text-white text-sm hover:bg-red-600">Remover</button>
        </div>
      ))}
      <button onClick={onAdd} className="w-full rounded-md bg-green-500 py-2 text-white font-semibold hover:bg-green-600 transition-colors">Adicionar Habilidade</button>
    </div>
  );
};

export default SkillsForm;
