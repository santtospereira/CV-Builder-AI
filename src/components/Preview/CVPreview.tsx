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
            <h2 className="text-section-title font-semibold text-[var(--cv-section-title-color)] border-b-2 border-[var(--cv-border-color)] pb-1">Resumo</h2>
            <p className="mt-2 text-body-md text-[var(--cv-text-color)] whitespace-pre-wrap">{summary}</p>
        </section>
    );
};

interface CVPreviewProps {
  cvData: CVData;
  onExportPdf: (cvData: CVData, fileName: string) => Promise<void>;
  isExportingPdf: boolean;
}

const CVPreview: React.FC<CVPreviewProps> = ({ cvData, onExportPdf, isExportingPdf }) => { // Removed previewRef
  const fileName = `CV_${cvData.name?.replace(/\s+/g, '_') || 'Candidato'}`;

  const handleExport = () => onExportPdf(cvData, fileName);

  return (
    <div className="relative"> 
      <div className="absolute top-4 right-4 z-10">
        <ExportButton onExport={handleExport} isLoading={isExportingPdf} />
      </div>
      
      <div className="bg-[var(--cv-bg-color)] px-10 py-5 rounded-lg shadow-md max-w-[800px] mx-auto h-full overflow-y-auto">
        <PersonalHeader data={cvData} />
        <SummarySection summary={cvData.summary} />
        <SkillsSection skills={cvData.skills} />
        <ExperienceSection experiences={cvData.experiences} />
      </div>
    </div>
  );
};

export default CVPreview;