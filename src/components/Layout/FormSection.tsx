import React, { useRef, useState } from 'react'; // Import useState
import PersonalInfoForm from '../Form/PersonalInfo';
import SummaryForm from '../Form/SummaryForm';
import SkillsForm from '../Form/Skills';
import ExperienceForm from '../Form/Experience';
import EducationForm from '../Form/Education'; // Import EducationForm
import { CVData, PersonalInfo } from '../../types/cv.types';
import { useToast } from '../../hooks/useToast'; // Import useToast

interface FormSectionProps {
    cvData: CVData;
        handleDataChange: (key: keyof PersonalInfo | 'summary', value: string) => void;
    handleListChange: (listName: 'skills' | 'experiences' | 'education', id: string, key: string, value: string | boolean) => void;
    handleAddListItem: (listName: 'skills' | 'experiences' | 'education') => void;
    handleRemoveListItem: (listName: 'skills' | 'experiences' | 'education', id: string) => void;
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
      a.download = `cv_data_${cvData.personalInfo.name.replace(/\s+/g, '_') || 'untitled'}.json`;
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
        education: [],
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
        <button
          onClick={handleNewCV}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Novo CV
        </button>
        <button
          onClick={handleSaveCurrentCV}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Salvar CV {currentCVName ? `(${currentCVName})` : ''}
        </button>
        <button
          onClick={() => setShowLoadModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Carregar/Excluir CV
        </button>
        <button
          onClick={handleExportJson}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Exportar JSON
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImportJson}
          accept=".json"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Importar JSON
        </button>
      </div>

      {/* Load/Delete CV Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">Carregar/Excluir CV</h2>
            {savedCVs.length === 0 ? (
              <p>Nenhum CV salvo ainda.</p>
            ) : (
              <ul className="space-y-2">
                {savedCVs.map((name) => (
                  <li key={name} className="flex justify-between items-center p-2 border rounded-md">
                    <span className="font-medium">{name} {name === currentCVName && '(Atual)'}</span>
                    <div>
                      <button
                        onClick={() => { loadCV(name); setShowLoadModal(false); showToast(`CV "${name}" carregado!`, 'success'); }}
                        className="ml-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        Carregar
                      </button>
                      <button
                        onClick={() => { if (window.confirm(`Tem certeza que deseja excluir "${name}"?`)) { deleteCV(name); showToast(`CV "${name}" excluído!`, 'info'); } }}
                        className="ml-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        Excluir
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setShowLoadModal(false)}
              className="mt-6 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Fechar
            </button>
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
        <EducationForm
          education={cvData.education}
          onAdd={() => handleAddListItem('education')}
          onRemove={(id) => handleRemoveListItem('education', id)}
          onUpdate={(id, key, value) => handleListChange('education', id, key, value)}
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
