export type SkillLevel = 'Básico' | 'Intermediário' | 'Avançado';

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string;
  isCurrent: boolean;
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
}

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  skills: Skill[];
  experiences: ExperienceEntry[];
  education: EducationEntry[];
}
