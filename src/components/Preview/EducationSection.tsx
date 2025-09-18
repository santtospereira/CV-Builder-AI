import React from 'react';
import { EducationEntry } from '../../../src/types/cv.types';

interface EducationSectionProps {
  education: EducationEntry[];
}

const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  if (!education || education.length === 0) {
    return null;
  }

  return (
    <div className="my-4">
      <h3 className="text-lg font-bold border-b-2 border-[var(--cv-border-color)] pb-1 mb-2 text-[var(--cv-section-title-color)]">
        Formação Acadêmica
      </h3>
      {education.map((edu) => (
        <div key={edu.id} className="mb-2">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-[var(--cv-text-color)]">{edu.degree}</p>
            <p className="text-sm text-[var(--cv-text-color)]">
              {edu.startDate} - {edu.endDate}
            </p>
          </div>
          <p className="text-sm italic text-[var(--cv-text-color)]">{edu.institution}</p>
          {edu.description && (
            <p className="text-sm text-[var(--cv-text-color)]">{edu.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default EducationSection;
