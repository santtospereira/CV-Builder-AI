import React from 'react';
import { Experience } from '../../types/cv.types';

interface ExperienceSectionProps {
  experiences: Experience[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  if (experiences.length === 0) return null;

  const renderDescription = (description: string) => {
    const lines = description.split('\n').filter(line => line.trim() !== '');
    const isBulletList = lines.some(line => line.trim().startsWith('- ') || line.trim().startsWith('* '));

    if (isBulletList) {
      return (
        <ul className="list-none p-0 mt-2">
          {lines.map((line, idx) => (
            <li key={idx} className="mb-1 pl-5 relative custom-bullet text-base text-[var(--cv-text-color)]">
              {line.replace(/^(-|\*)\s*/, '')}
            </li>
          ))}
        </ul>
      );
    }
    return <p className="text-base text-[var(--cv-text-color)] whitespace-pre-wrap mt-2">{description}</p>;
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-[var(--cv-section-title-color)] border-b-2 border-[var(--cv-border-color)] pb-2 mb-4">Experiência Profissional</h2>
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div key={index}> 
            <h3 className="text-lg font-semibold text-[var(--cv-text-color)]">{exp.position || 'Cargo'}</h3>
            <p className="text-sm text-[var(--cv-text-color)]">{exp.company || 'Empresa'} | {exp.period || 'Período'}</p>
            {renderDescription(exp.description || 'Descrição da experiência')}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;
