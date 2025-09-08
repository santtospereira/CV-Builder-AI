import React from 'react';
import { CVData } from '../../types/cv.types';

interface PersonalHeaderProps {
  data: CVData;
}

const PersonalHeader: React.FC<PersonalHeaderProps> = ({ data }) => {
  const { name, email, phone, linkedin } = data.personalInfo;

  return (
    <header className="text-center mb-5 pb-2.5 border-b-2 border-[var(--cv-border-color)]">
      <h1 className="text-[2.5em] font-extrabold text-[var(--cv-header-text-color)]">{name || 'Nome Completo'}</h1>
      <div className="text-[1.2em] font-normal mt-2 text-[var(--cv-text-color)]">
        <span>{email || 'email@exemplo.com'}</span>
        <span className="mx-2">|</span>
        <span>{phone || '(11) 98765-4321'}</span>
        <span className="mx-2">|</span>
        <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--cv-section-title-color)] no-underline hover:underline">
          {linkedin || 'linkedin.com/in/seu-perfil'}
        </a>
      </div>
    </header>
  );
};

export default PersonalHeader;