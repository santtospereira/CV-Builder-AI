import { useState, useCallback, useEffect } from 'react';
import { CVData, Skill, Experience, SkillLevel, PersonalInfo } from '../types/cv.types';

const CV_NAMES_KEY = 'cvBuilderNames';
const CURRENT_CV_KEY = 'currentCVName'; // To remember which CV was last loaded

const initialCVData: CVData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    linkedin: '',
  },
  summary: '',
  skills: [],
  experiences: [],
};

// Helper to get all saved CV names
const getSavedCVNames = (): string[] => {
  try {
    const names = localStorage.getItem(CV_NAMES_KEY);
    return names ? JSON.parse(names) : [];
  } catch (error) {
    console.error("Failed to load CV names from localStorage:", error);
    return [];
  }
};

// Helper to save CV names
const saveCVNames = (names: string[]) => {
  try {
    localStorage.setItem(CV_NAMES_KEY, JSON.stringify(names));
  } catch (error) {
    console.error("Failed to save CV names to localStorage:", error);
  }
};

export const useCVData = () => {
  const [cvData, setCvData] = useState<CVData>(initialCVData);
  const [currentCVName, setCurrentCVName] = useState<string | null>(null);
  const [savedCVs, setSavedCVs] = useState<string[]>([]);

  // Load initial CV data and names on mount
  useEffect(() => {
    const names = getSavedCVNames();
    setSavedCVs(names);

    const lastLoadedName = localStorage.getItem(CURRENT_CV_KEY);
    if (lastLoadedName && names.includes(lastLoadedName)) {
      loadCV(lastLoadedName);
    } else if (names.length > 0) {
      loadCV(names[0]); // Load the first one if no last loaded
    } else {
      setCvData(initialCVData); // Start with empty if no saved CVs
    }
  }, []); // Run only once on mount

  // Save current CV data whenever it changes, under its current name
  useEffect(() => {
    if (currentCVName && cvData) {
      try {
        localStorage.setItem(`cvBuilderData_${currentCVName}`, JSON.stringify(cvData));
      } catch (error) {
        console.error(`Failed to save CV data for ${currentCVName} to localStorage:`, error);
      }
    }
  }, [cvData, currentCVName]);

  const saveCV = useCallback((name: string) => {
    if (!name) return;
    const newNames = Array.from(new Set([...savedCVs, name])); // Add new name if not exists
    saveCVNames(newNames);
    setSavedCVs(newNames);
    setCurrentCVName(name);
    localStorage.setItem(`cvBuilderData_${name}`, JSON.stringify(cvData)); // Save current data
    localStorage.setItem(CURRENT_CV_KEY, name); // Set as current
  }, [savedCVs, cvData]);

  const loadCV = useCallback((name: string) => {
    try {
      const storedData = localStorage.getItem(`cvBuilderData_${name}`);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        
        // Merge with initial data to ensure all fields are present
        const mergedData: CVData = {
          ...initialCVData,
          ...parsedData,
          personalInfo: {
            ...initialCVData.personalInfo,
            ...(parsedData.personalInfo || {}),
          },
          skills: parsedData.skills || [],
          experiences: parsedData.experiences || [],
        };

        setCvData(mergedData);
        setCurrentCVName(name);
        localStorage.setItem(CURRENT_CV_KEY, name);
      } else {
        console.warn(`CV '${name}' not found in localStorage.`);
      }
    } catch (error) {
      console.error(`Failed to load CV '${name}' from localStorage:`, error);
    }
  }, []);

  const deleteCV = useCallback((name: string) => {
    try {
      localStorage.removeItem(`cvBuilderData_${name}`);
      const newNames = savedCVs.filter(n => n !== name);
      saveCVNames(newNames);
      setSavedCVs(newNames);
      if (currentCVName === name) {
        // If deleted current CV, load first available or reset
        if (newNames.length > 0) {
          loadCV(newNames[0]);
        } else {
          setCvData(initialCVData);
          setCurrentCVName(null);
          localStorage.removeItem(CURRENT_CV_KEY);
        }
      }
    } catch (error) {
      console.error(`Failed to delete CV '${name}' from localStorage:`, error);
    }
  }, [savedCVs, currentCVName, loadCV]);

  const handleDataChange = useCallback((key: keyof PersonalInfo | 'summary', value: string) => {
    setCvData(prevData => {
      if (key === 'summary') {
        return {
          ...prevData,
          summary: value,
        };
      }
      
      // Type guard to ensure key is in PersonalInfo
      if (key in prevData.personalInfo) {
        return {
          ...prevData,
          personalInfo: {
            ...prevData.personalInfo,
            [key]: value,
          },
        };
      }

      return prevData;
    });
  }, []);

  const handleListChange = useCallback((listName: 'skills' | 'experiences', id: string, key: string, value: string | boolean) => {
    setCvData(prevData => {
      const list = (prevData[listName] as Array<any>).map(item =>
        item.id === id ? { ...item, [key]: value } : item
      );
      return { ...prevData, [listName]: list as any };
    });
  }, []);

  const handleAddListItem = useCallback((listName: 'skills' | 'experiences') => {
    const newItem = listName === 'skills'
      ? { id: crypto.randomUUID(), name: '', level: 'Básico' as SkillLevel }
      : { id: crypto.randomUUID(), company: '', position: '', period: '', description: '', isCurrent: false };
    
    setCvData(prevData => ({
      ...prevData,
      [listName]: [...prevData[listName] as Array<any>, newItem] as any,
    }));
  }, []);

  const handleRemoveListItem = useCallback((listName: 'skills' | 'experiences', id: string) => {
    setCvData(prevData => ({
      ...prevData,
      [listName]: (prevData[listName] as Array<any>).filter(item => item.id !== id) as any,
    }));
  }, []);
  
  const setCVDataDirectly = useCallback((data: CVData) => {
      setCvData(data);
      // When setting directly, we assume it's a new or loaded CV, so update current name
      if (data.personalInfo.name && !savedCVs.includes(data.personalInfo.name)) {
        setCurrentCVName(data.personalInfo.name);
        localStorage.setItem(CURRENT_CV_KEY, data.personalInfo.name);
      } else if (data.personalInfo.name && savedCVs.includes(data.personalInfo.name)) {
        setCurrentCVName(data.personalInfo.name);
        localStorage.setItem(CURRENT_CV_KEY, data.personalInfo.name);
      } else {
        setCurrentCVName(null);
        localStorage.removeItem(CURRENT_CV_KEY);
      }
  }, [savedCVs]);

  return {
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
  };
};
