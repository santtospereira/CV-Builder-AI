import React from 'react';
import { Skill } from '../../types/cv.types';

interface SkillsSectionProps {
  skills: Skill[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  if (skills.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-gray-300 pb-1">Habilidades</h2>
      <ul className="mt-2 grid grid-cols-2 gap-2">
        {skills.map((skill, index) => (
          <li key={index} className="text-gray-700">
            <span className="font-medium">{skill.name}</span>: {skill.level}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SkillsSection;
