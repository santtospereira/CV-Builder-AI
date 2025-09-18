import React from 'react';
import { CVData } from '../../types/cv.types';
import PersonalHeader from './PersonalHeader';
import SkillsSection from './SkillsSection';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection'; // Import EducationSection
import ExportButton from './ExportButton';

const SummarySection: React.FC<{ summary: string }> = ({ summary }) => {
    if (!summary) return null;
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--cv-section-title-color)] border-b-2 border-[var(--cv-border-color)] pb-2 mb-4">Resumo Profissional</h2>
            <p className="text-base text-[var(--cv-text-color)] whitespace-pre-wrap">{summary}</p>
        </section>
    );
};

interface CVPreviewProps {
  cvData: CVData;
  onExportPdf: (cvData: CVData, fileName: string) => Promise<void>;
  isExportingPdf: boolean;
  theme: 'default' | 'dark' | 'grey' | 'blue';
}

const CVPreview: React.FC<CVPreviewProps> = ({ cvData, onExportPdf, isExportingPdf, theme }) => {
  const fileName = `CV_${cvData.personalInfo.name?.replace(/\s+/g, '_') || 'Candidato'}`;

  const handleExport = () => onExportPdf(cvData, fileName);

  return (
    <div className="relative"> 
      <div className="absolute top-4 right-4 z-10">
        <ExportButton onExport={handleExport} isLoading={isExportingPdf} />
      </div>
      
      <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto h-full overflow-y-auto">
        <PersonalHeader data={cvData} />
        <main className="p-10">
          <SummarySection summary={cvData.summary} />
          <EducationSection education={cvData.education} />
          <SkillsSection skills={cvData.skills} />
          <ExperienceSection experiences={cvData.experiences} />
        </main>
      </div>
    </div>
  );
};

export default CVPreview;
