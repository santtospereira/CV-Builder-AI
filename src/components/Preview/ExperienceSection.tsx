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
        <ul className="list-none p-0">
          {lines.map((line, idx) => (
            <li key={idx} className="mb-1.5 pl-5 relative custom-bullet text-body-md text-[var(--cv-text-color)]">
              {line.replace(/^(-|\*)\s*/, '')}
            </li>
          ))}
        </ul>
      );
    }
    return <p className="text-body-md text-[var(--cv-text-color)] whitespace-pre-wrap">{description}</p>;
  };

  return (
    <section className="mb-5">
      <h2 className="text-section-title font-semibold text-[var(--cv-section-title-color)] border-b border-[var(--cv-border-color)] pb-1.5 mb-4">Experiência Profissional</h2>
      <div className="mt-4 space-y-6">
        {experiences.map((exp, index) => (
          <div key={index} className="space-y-1">
            <h3 className="text-[1.1em] font-bold italic text-[var(--cv-text-color)]">{exp.position || 'Cargo'} em {exp.company || 'Empresa'}</h3>
            <p className="text-[0.9em] text-[var(--cv-text-color)] mb-1.5">{exp.period || 'Período'}</p>
            {renderDescription(exp.description || 'Descrição da experiência')}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;
