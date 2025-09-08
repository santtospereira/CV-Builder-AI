import React from 'react';
import { CVData } from '../../types/cv.types';

interface PersonalHeaderProps {
  data: CVData;
}

const PersonalHeader: React.FC<PersonalHeaderProps> = ({ data }) => {
  const { name, email, phone, linkedin } = data.personalInfo;

  return (
    <header className="bg-[var(--cv-header-bg-color)] text-[var(--cv-header-text-color)] text-center p-8 rounded-t-lg">
      <h1 className="text-4xl font-bold">{name || 'Nome Completo'}</h1>
      <div className="flex justify-center items-center space-x-4 mt-3 text-sm">
        <span>{email || 'email@exemplo.com'}</span>
        <span>&bull;</span>
        <span>{phone || '(11) 98765-4321'}</span>
        {linkedin && (
          <>
            <span>&bull;</span>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {linkedin.replace(/^(https?:\/\/)?(www\.)?/, '')}
            </a>
          </>
        )}
      </div>
    </header>
  );
};

export default PersonalHeader;
