import React from 'react';
import { Skill } from '../../types/cv.types';

interface SkillsSectionProps {
  skills: Skill[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  if (skills.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-[var(--cv-section-title-color)] border-b-2 border-[var(--cv-border-color)] pb-2 mb-4">Habilidades</h2>
      <ul className="columns-2 gap-x-8">
        {skills.map((skill, index) => (
          <li key={index} className="text-base text-[var(--cv-text-color)] mb-2 break-inside-avoid">
            <span className="font-semibold">{skill.name}</span>
            {skill.level && <span className="text-gray-600"> - {skill.level}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SkillsSection;
