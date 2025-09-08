import React, { useState, useCallback, ChangeEvent } from 'react';
import { CVData, PersonalInfo } from '../../types/cv.types';
import { validateEmail, validatePhone } from '../../utils/validation';

interface PersonalInfoFormProps {
  personalInfo: PersonalInfo;
  onUpdate: (key: keyof PersonalInfo, value: string) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ personalInfo, onUpdate }) => {
  const [errors, setErrors] = useState({ email: '', phone: '', });

  const validate = useCallback((field: 'email' | 'phone', value: string) => {
    let message = '';
    if (field === 'email') {
      message = validateEmail(value);
    } else if (field === 'phone') {
      message = validatePhone(value);
    }
    setErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  const handleChange = (field: keyof PersonalInfo, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onUpdate(field, value);
    if (field === 'email' || field === 'phone') {
      validate(field, value);
    }
  };

  if (!personalInfo) {
    return null; // or a loading indicator
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Dados Pessoais</h2>
      <div>
        <input type="text" placeholder="Nome Completo" value={personalInfo.name} onChange={(e) => handleChange('name', e)} className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
      </div>
      <div>
        <input type="email" placeholder="Email" value={personalInfo.email} onChange={(e) => handleChange('email', e)} className={`w-full rounded-md p-3 shadow-sm focus:ring focus:ring-opacity-50 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`} />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
      <div>
        <input type="tel" placeholder="Telefone" value={personalInfo.phone} onChange={(e) => handleChange('phone', e)} className={`w-full rounded-md p-3 shadow-sm focus:ring focus:ring-opacity-50 ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`} />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>
      <div>
        <input type="url" placeholder="URL do LinkedIn" value={personalInfo.linkedin} onChange={(e) => handleChange('linkedin', e)} className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
      </div>
    </div>
  );
};

export default PersonalInfoForm;
