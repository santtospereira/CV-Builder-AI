import React, { useState, useCallback, useEffect } from 'react';
import FormSection from './components/Layout/FormSection';
import PreviewSection from './components/Layout/PreviewSection';
import Toast from './components/UI/Toast';
import ErrorBoundary from './components/UI/ErrorBoundary';
import ThemeSwitcher from './components/UI/ThemeSwitcher';
import { useCVData } from './hooks/useCVData';
import { useAIEnhancement } from './hooks/useAIEnhancement';
import { useToast } from './hooks/useToast';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { exportToPdf } from './services/pdfService';
import { useCVHistory } from './hooks/useCVHistory';
import { CVData } from './types/cv.types';

const App: React.FC = () => {
  const { toast, showToast } = useToast();
  const {
    cvData,
    handleDataChange,
    handleListChange,
    handleAddListItem,
    handleRemoveListItem,
    setCVDataDirectly,
    saveCV,
    loadCV,
    deleteCV,
    savedCVs,
    currentCVName,
  } = useCVData();
  
  const ai = useAIEnhancement(cvData, setCVDataDirectly, showToast);

  const { undo, redo, canUndo, canRedo } = useCVHistory(cvData, setCVDataDirectly);

  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);
  const [exportRequest, setExportRequest] = useState<{ data: CVData; fileName: string } | null>(null);

  // Função para solicitar a exportação, apenas define o estado
  const requestExport = async (data: CVData, fileName: string) => {
    if (!isExportingPdf) {
      setExportRequest({ data, fileName });
    }
  };

  // useEffect para lidar com a exportação quando o estado de requisição muda
  useEffect(() => {
    if (exportRequest) {
      const { data, fileName } = exportRequest;
      
      setIsExportingPdf(true);
      showToast('Gerando PDF...', 'info');

      // Usamos um timeout para garantir que o DOM foi atualizado
      const timer = setTimeout(() => {
        exportToPdf(data, fileName)
          .then(() => {
            showToast('PDF gerado com sucesso!', 'success');
          })
          .catch((error) => {
            console.error(error);
            showToast('Falha ao gerar o PDF.', 'error');
          })
          .finally(() => {
            setIsExportingPdf(false);
            setExportRequest(null); // Limpa a requisição
          });
      }, 100); // Um pequeno delay de 100ms é geralmente suficiente

      return () => clearTimeout(timer);
    }
  }, [exportRequest, showToast]);

  useKeyboardShortcuts({
    'control+p': (event) => {
      event.preventDefault();
      requestExport(cvData, `CV_${cvData.personalInfo.name?.replace(/\s+/g, '_') || 'Candidato'}`);
    },
    'meta+p': (event) => {
      event.preventDefault();
      requestExport(cvData, `CV_${cvData.personalInfo.name?.replace(/\s+/g, '_') || 'Candidato'}`);
    },
    'control+f': () => setIsFullScreenPreview(prev => !prev),
    'meta+f': () => setIsFullScreenPreview(prev => !prev),
    'control+z': undo,
    'meta+z': undo,
    'control+y': redo,
    'meta+y': redo,
    'control+shift+z': redo,
    'meta+shift+z': redo,
  });

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen bg-gray-200 font-sans text-gray-800 antialiased">
        <header className="bg-white shadow-md p-4 z-20">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">CV Builder IA</h1>
            <div className="flex items-center space-x-4">
              <ThemeSwitcher />
              <button
                onClick={() => setIsFullScreenPreview(prev => !prev)}
                className="px-3 py-1 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md transition-colors duration-200"
                title={isFullScreenPreview ? 'Sair do modo tela cheia' : 'Entrar no modo tela cheia'}
              >
                {isFullScreenPreview ? 'Sair da Tela Cheia' : 'Tela Cheia'}
              </button>
              {/* Undo/Redo Buttons */}
              <button
                onClick={undo}
                disabled={!canUndo}
                className="px-3 py-1 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md transition-colors duration-200 disabled:bg-gray-400"
                title="Desfazer (Ctrl+Z)"
              >
                Desfazer
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="px-3 py-1 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md transition-colors duration-200 disabled:bg-gray-400"
                title="Refazer (Ctrl+Y ou Ctrl+Shift+Z)"
              >
                Refazer
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex flex-grow overflow-hidden">
          {!isFullScreenPreview && (
            <FormSection 
                cvData={cvData}
                handleDataChange={handleDataChange}
                handleListChange={handleListChange}
                handleAddListItem={handleAddListItem}
                handleRemoveListItem={handleRemoveListItem}
                ai={ai}
                setCVDataDirectly={setCVDataDirectly}
                saveCV={saveCV}
                loadCV={loadCV}
                deleteCV={deleteCV}
                savedCVs={savedCVs}
                currentCVName={currentCVName}
            />
          )}
          <PreviewSection 
            cvData={cvData} 
            onExportPdf={requestExport} 
            isExportingPdf={isExportingPdf} 
            className={isFullScreenPreview ? 'w-full' : 'w-1/2'} 
          />
        </main>

        {toast && <Toast message={toast.message} type={toast.type} />}
      </div>
    </ErrorBoundary>
  );
};

export default App;
