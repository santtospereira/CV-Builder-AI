import React from 'react'; // Removed useRef
import { CVData } from '../../types/cv.types';
import PersonalHeader from './PersonalHeader';
import SkillsSection from './SkillsSection';
import ExperienceSection from './ExperienceSection';
import ExportButton from './ExportButton';

const SummarySection: React.FC<{ summary: string }> = ({ summary }) => {
    if (!summary) return null;
    return (
        <section className="mb-6">
            <h2 className="text-2xl font-semibold text-[var(--cv-section-title-color)] border-b-2 border-[var(--cv-border-color)] pb-1">Resumo</h2>
            <p className="mt-2 text-[var(--cv-text-color)] whitespace-pre-wrap">{summary}</p>
        </section>
    );
};

interface CVPreviewProps {
  cvData: CVData;
  onExportPdf: (ref: React.RefObject<HTMLDivElement>, fileName: string) => Promise<void>;
  isExportingPdf: boolean;
  previewRef: React.RefObject<HTMLDivElement>; // Add this prop
}

const CVPreview: React.FC<CVPreviewProps> = ({ cvData, onExportPdf, isExportingPdf, previewRef }) => { // Added previewRef
  const fileName = `CV_${cvData.personalInfo?.name?.replace(/\s+/g, '_') || 'Candidato'}`;

  const handleExport = () => onExportPdf(previewRef, fileName);

  return (
    <div className="relative"> 
      <div className="absolute top-4 right-4 z-10">
        <ExportButton onExport={handleExport} isLoading={isExportingPdf} />
      </div>
      
      <div ref={previewRef} className="bg-[var(--cv-bg-color)] p-10 rounded-lg shadow-xl w-[700px] h-full overflow-y-auto">
        <PersonalHeader data={cvData} />
        <SummarySection summary={cvData.summary} />
        <SkillsSection skills={cvData.skills} />
        <ExperienceSection experiences={cvData.experiences} />
      </div>
    </div>
  );
};

export default CVPreview;
