import React, { useState, useCallback, useEffect } from "react";
import FormSection from "./components/Layout/FormSection";
import PreviewSection from "./components/Layout/PreviewSection";
import Toast from "./components/UI/Toast";
import ErrorBoundary from "./components/UI/ErrorBoundary";
import { useCVData } from "./hooks/useCVData";
import { useAIEnhancement } from "./hooks/useAIEnhancement";
import { useToast } from "./hooks/useToast";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { exportToPdf } from "./services/pdfService";
import { CVData } from "./types/cv.types";

type Theme = 'default' | 'dark' | 'grey' | 'blue';

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
    undo,
    redo,
    canUndo,
    canRedo,
  } = useCVData();

  const ai = useAIEnhancement(cvData, setCVDataDirectly, showToast);

  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);
  const [exportRequest, setExportRequest] = useState<{
    data: CVData;
    fileName: string;
  } | null>(null);
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('cvBuilderTheme');
    return (savedTheme as Theme) || 'default';
  });

  useEffect(() => {
    localStorage.setItem('cvBuilderTheme', currentTheme);
  }, [currentTheme]);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
  };

  const requestExport = async (data: CVData, fileName: string) => {
    if (!isExportingPdf) {
      setExportRequest({ data, fileName });
    }
  };

  useEffect(() => {
    if (exportRequest) {
      const { data, fileName } = exportRequest;

      setIsExportingPdf(true);
      showToast("Gerando PDF...", "info");

      // Usamos um timeout para garantir que o DOM foi atualizado
      const timer = setTimeout(() => {
        exportToPdf(data, fileName)
          .then(() => {
            showToast("PDF gerado com sucesso!", "success");
          })
          .catch((error) => {
            console.error(error);
            showToast("Falha ao gerar o PDF.", "error");
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
    "control+p": (event) => {
      event.preventDefault();
      requestExport(
        cvData,
        `CV_${cvData.personalInfo.name?.replace(/\s+/g, "_") || "Candidato"}`
      );
    },
    "meta+p": (event) => {
      event.preventDefault();
      requestExport(
        cvData,
        `CV_${cvData.personalInfo.name?.replace(/\s+/g, "_") || "Candidato"}`
      );
    },
    "control+f": () => setIsFullScreenPreview((prev) => !prev),
    "meta+f": () => setIsFullScreenPreview((prev) => !prev),
    "control+z": undo,
    "meta+z": undo,
    "control+y": redo,
    "meta+y": redo,
    "control+shift+z": redo,
    "meta+shift+z": redo,
  });

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen bg-gray-200 font-sans text-gray-800 antialiased transition-colors duration-300">
        <header className="bg-white shadow-md p-4 z-20 transition-colors duration-300">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              CV Builder IA
            </h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Theme Switcher */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleThemeChange('default')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${currentTheme === 'default' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  Default
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${currentTheme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  Dark
                </button>
                <button
                  onClick={() => handleThemeChange('grey')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${currentTheme === 'grey' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  Grey
                </button>
                <button
                  onClick={() => handleThemeChange('blue')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${currentTheme === 'blue' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  Blue
                </button>
              </div>

              <button
                onClick={() => setIsFullScreenPreview((prev) => !prev)}
                className="px-3 py-1 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md transition-colors duration-200"
                title={
                  isFullScreenPreview
                    ? "Sair do modo tela cheia"
                    : "Entrar no modo tela cheia"
                }
              >
                {isFullScreenPreview ? "Sair da Tela Cheia" : "Tela Cheia"}
              </button>
              {/* Undo/Redo Buttons */}
              <button
                onClick={undo}
                disabled={!canUndo}
                className="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 disabled:bg-gray-400"
                title="Desfazer (Ctrl+Z)"
              >
                Desfazer
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 disabled:bg-gray-400"
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
            className={isFullScreenPreview ? "w-full" : "w-1/2"}
            theme={currentTheme} // Pass theme to PreviewSection
          />
        </main>

        {toast && <Toast message={toast.message} type={toast.type} />}
      </div>
    </ErrorBoundary>
  );
};

export default App;
