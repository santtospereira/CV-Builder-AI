import React, { useRef, useState } from 'react'; // Import useState
import PersonalInfoForm from '../Form/PersonalInfo';
import SummaryForm from '../Form/SummaryForm';
import SkillsForm from '../Form/Skills';
import ExperienceForm from '../Form/Experience';
import { CVData, PersonalInfo } from '../../types/cv.types';
import { useToast } from '../../hooks/useToast'; // Import useToast
import { Button } from '../UI/Button';
import { Plus, Save, FolderOpen, Download, Upload } from "lucide-react";


interface FormSectionProps {
    cvData: CVData;
        handleDataChange: (key: keyof PersonalInfo | 'summary', value: string) => void;
    handleListChange: (listName: 'skills' | 'experiences', id: string, key: string, value: string | boolean) => void;
    handleAddListItem: (listName: 'skills' | 'experiences') => void;
    handleRemoveListItem: (listName: 'skills' | 'experiences', id: string) => void;
    ai: {
        isEnhancing: boolean;
        enhancingId: string | null;
        handleEnhance: (textToEnhance: string, context: 'summary' | 'experience', id?: string) => Promise<void>;
    };
    setCVDataDirectly: (data: CVData) => void;
    saveCV: (name: string) => void; // New prop
    loadCV: (name: string) => void; // New prop
    deleteCV: (name: string) => void; // New prop
    savedCVs: string[]; // New prop
    currentCVName: string | null; // New prop
}

const FormSection: React.FC<FormSectionProps> = ({
    cvData,
    handleDataChange,
    handleListChange,
    handleAddListItem,
    handleRemoveListItem,
    ai,
    setCVDataDirectly,
    saveCV,
    loadCV,
    deleteCV,
    savedCVs,
    currentCVName,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const [showLoadModal, setShowLoadModal] = useState(false); // State for load modal

  const handleExportJson = () => {
    try {
      const dataStr = JSON.stringify(cvData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cv_data_${cvData.personalInfo.name?.replace(/\s+/g, '_') || 'untitled'}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Dados do CV exportados com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao exportar dados do CV:', error);
      showToast('Falha ao exportar dados do CV.', 'error');
    }
  };

  const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData: CVData = JSON.parse(e.target?.result as string);
          if (importedData && importedData.personalInfo && importedData.personalInfo.name !== undefined && importedData.skills !== undefined) {
            setCVDataDirectly(importedData);
            showToast('Dados do CV importados com sucesso!', 'success');
          } else {
            throw new Error('Formato de arquivo JSON inválido para CV.');
          }
        } catch (error) {
          console.error('Erro ao importar dados do CV:', error);
          showToast(`Falha ao importar dados do CV: ${error instanceof Error ? error.message : 'Formato inválido.'}`, 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleNewCV = () => {
    if (window.confirm('Tem certeza que deseja criar um novo CV? As alterações não salvas serão perdidas.')) {
      setCVDataDirectly({
        personalInfo: { name: '', email: '', phone: '', linkedin: '' },
        summary: '',
        skills: [],
        experiences: [],
      });
      showToast('Novo CV criado!', 'info');
    }
  };

  const handleSaveCurrentCV = () => {
    let nameToSave = currentCVName;
    if (!nameToSave) {
      nameToSave = window.prompt('Digite um nome para salvar este CV:');
    }
    if (nameToSave) {
      saveCV(nameToSave);
      showToast(`CV "${nameToSave}" salvo com sucesso!`, 'success');
    } else {
      showToast('Nome do CV inválido.', 'error');
    }
  };

  return (
    <div className="w-1/2 p-8 overflow-y-auto">
      <h1 className="text-4xl font-extrabold mb-4 text-gray-900">CV Builder AI</h1>
      
      {/* CV Management Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button variant="primary" onClick={handleNewCV}>
          Novo CV
        </Button>

        <Button variant="secondary" onClick={handleSaveCurrentCV}>
          {currentCVName ? `Salvar CV (${currentCVName})` : "Salvar CV"}
        </Button>

        <Button variant="outline" onClick={() => setShowLoadModal(true)}>
          Carregar/Excluir CV
        </Button>

        <Button variant="outline" onClick={handleExportJson}>
          Exportar JSON
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImportJson}
          accept=".json"
          className="hidden"
        />
        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          Importar JSON
        </Button>

      </div>

      {/* Load/Delete CV Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-96"
            role="dialog"
            aria-modal="true"
            aria-labelledby="loadcv-title"
          >
            <h2 id="loadcv-title" className="text-xl font-bold mb-4">
              Carregar/Excluir CV
            </h2>

            {savedCVs.length === 0 ? (
              <p>Nenhum CV salvo ainda.</p>
            ) : (
              <ul className="space-y-2">
                {savedCVs.map((name) => (
                  <li key={name} className="flex justify-between items-center p-2 border rounded-md">
                    <span className="font-medium">
                      {name} {name === currentCVName && '(Atual)'}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        loadCV(name);
                        setShowLoadModal(false);
                        showToast(`CV "${name}" carregado!`, 'success');
                      }}
                    >
                      Carregar
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (window.confirm(`Tem certeza que deseja excluir "${name}"?`)) {
                          deleteCV(name);
                          showToast(`CV "${name}" excluído!`, 'info');
                        }
                      }}
                    >
                      Excluir
                  </Button>
                </div>
              </li>

                ))}
              </ul>
            )}
            <Button variant="outline" className="mt-6" onClick={() => setShowLoadModal(false)}>
              Fechar
            </Button>

          </div>
        </div>
      )}

      <div className="space-y-8">
        <PersonalInfoForm personalInfo={cvData.personalInfo} onUpdate={handleDataChange} />
        <SummaryForm
          cvData={cvData}
          onUpdate={(value) => handleDataChange('summary', value)}
          onEnhance={() => ai.handleEnhance(cvData.summary, 'summary')}
          isEnhancing={ai.isEnhancing && ai.enhancingId === null}
        />
        <SkillsForm
          skills={cvData.skills}
          onAdd={() => handleAddListItem('skills')}
          onRemove={(id) => handleRemoveListItem('skills', id)}
          onUpdate={(id, key, value) => handleListChange('skills', id, key, value)}
        />
        <ExperienceForm
          experiences={cvData.experiences}
          onAdd={() => handleAddListItem('experiences')}
          onRemove={(id) => handleRemoveListItem('experiences', id)}
          onUpdate={(id, key, value) => handleListChange('experiences', id, key, value)}
          onEnhance={(id, description) => ai.handleEnhance(description, 'experience', id)}
          isEnhancing={ai.isEnhancing}
          enhancingId={ai.enhancingId}
        />
      </div>
    </div>
  );
};

export default FormSection;
