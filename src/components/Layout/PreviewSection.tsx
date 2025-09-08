import React from 'react';
import CVPreview from '../Preview/CVPreview';
import { CVData } from '../../types/cv.types';

interface PreviewSectionProps {
  cvData: CVData;
  onExportPdf: (cvData: CVData, fileName: string) => Promise<void>;
  isExportingPdf: boolean;
  className?: string;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({ cvData, onExportPdf, isExportingPdf, className }) => {
  return (
    <div className={`p-8 overflow-y-auto bg-gray-200 flex justify-center items-start ${className}`}>
      <CVPreview cvData={cvData} onExportPdf={onExportPdf} isExportingPdf={isExportingPdf} />
    </div>
  );
};

export default PreviewSection;
