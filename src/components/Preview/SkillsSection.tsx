import React from 'react';
import { Skill } from '../../types/cv.types';

interface SkillsSectionProps {
  skills: Skill[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  if (skills.length === 0) return null;

  return (
    <section className="mb-5">
      <h2 className="text-section-title font-semibold text-[var(--cv-section-title-color)] border-b border-[var(--cv-border-color)] pb-1.5 mb-4">Habilidades</h2>
      <ul className="mt-0 grid grid-cols-2 gap-2">
        {skills.map((skill, index) => (
          <li key={index} className="text-body-md text-[var(--cv-text-color)] mb-1.5 pl-5 relative custom-bullet">
            <span className="font-medium">{skill.name}</span>: {skill.level}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SkillsSection;
