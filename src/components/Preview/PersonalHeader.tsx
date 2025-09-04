import React from 'react';
import { CVData } from '../../types/cv.types';

interface PersonalHeaderProps {
  data: CVData;
}

const PersonalHeader: React.FC<PersonalHeaderProps> = ({ data }) => {
  const { name, email, phone, linkedin } = data;

  return (
    <header className="bg-[var(--cv-header-bg-color)] text-[var(--cv-header-text-color)] -mx-10 -mt-10 mb-8 p-10 border-b-2 border-[var(--cv-border-color)]">
      <h1 className="text-4xl font-extrabold">{name || 'Nome Completo'}</h1>
      <div className="text-sm mt-2 opacity-90">
        <span>{email || 'email@exemplo.com'}</span>
        <span className="mx-2">|</span>
        <span>{phone || '(11) 98765-4321'}</span>
        <span className="mx-2">|</span>
        <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
          {linkedin || 'linkedin.com/in/seu-perfil'}
        </a>
      </div>
    </header>
  );
};

export default PersonalHeader;
