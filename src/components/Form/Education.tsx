import React from 'react';
import { EducationEntry } from '../../../src/types/cv.types';

interface EducationFormProps {
  education: EducationEntry[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, key: keyof EducationEntry, value: string) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ education, onAdd, onRemove, onUpdate }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Formação Acadêmica</h2>
      {education.map((edu) => (
        <div key={edu.id} className="mb-4 p-3 border rounded-md bg-gray-50">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Grau/Curso
            </label>
            <input
              type="text"
              value={edu.degree}
              onChange={(e) => onUpdate(edu.id, 'degree', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Instituição
            </label>
            <input
              type="text"
              value={edu.institution}
              onChange={(e) =>
                onUpdate(edu.id, 'institution', e.target.value)
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data de Início
              </label>
              <input
                type="text"
                placeholder="mm/yyyy"
                value={edu.startDate}
                onChange={(e) =>
                  onUpdate(edu.id, 'startDate', e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data de Término
              </label>
              <input
                type="text"
                placeholder="mm/yyyy"
                value={edu.endDate}
                onChange={(e) =>
                  onUpdate(edu.id, 'endDate', e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Descrição (Opcional)
            </label>
            <textarea
              value={edu.description}
              onChange={(e) =>
                onUpdate(edu.id, 'description', e.target.value)
              }
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <button
            type="button"
            onClick={() => onRemove(edu.id)}
            className="mt-2 px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Remover Formação
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="mt-4 rounded-md bg-green-500 px-4 py-2 text-white font-semibold hover:bg-green-600 transition-colors"
      >
        Adicionar Formação
      </button>
    </div>
  );
};

export default EducationForm;
