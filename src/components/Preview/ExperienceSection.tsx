import React from 'react';
import { Experience } from '../../types/cv.types';

interface ExperienceSectionProps {
  experiences: Experience[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  if (experiences.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-gray-300 pb-1">Experiência Profissional</h2>
      <div className="mt-4 space-y-6">
        {experiences.map((exp, index) => (
          <div key={index} className="space-y-1">
            <h3 className="text-lg font-bold text-gray-800">{exp.position || 'Cargo'} em {exp.company || 'Empresa'}</h3>
            <p className="text-sm text-gray-500">{exp.period || 'Período'}</p>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{exp.description || 'Descrição da experiência'}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;
