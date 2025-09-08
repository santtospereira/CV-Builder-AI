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

export interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  skills: Skill[];
  experiences: Experience[];
}
