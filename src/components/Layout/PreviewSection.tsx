import React from 'react';
import CVPreview from '../Preview/CVPreview';
import { CVData } from '../../types/cv.types';

interface PreviewSectionProps {
  cvData: CVData;
  onExportPdf: (ref: React.RefObject<HTMLDivElement>, fileName: string) => Promise<void>;
  isExportingPdf: boolean;
  previewRef: React.RefObject<HTMLDivElement | null>;
  className?: string; // Add this prop
}

const PreviewSection: React.FC<PreviewSectionProps> = ({ cvData, onExportPdf, isExportingPdf, previewRef, className }) => {
  return (
    <div className={`p-8 overflow-y-auto bg-gray-200 flex justify-center items-start ${className}`}>
      <CVPreview cvData={cvData} onExportPdf={onExportPdf} isExportingPdf={isExportingPdf} previewRef={previewRef} />
    </div>
  );
};

export default PreviewSection;
