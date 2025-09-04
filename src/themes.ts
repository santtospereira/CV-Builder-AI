// src/themes.ts

export interface Theme {
  name: string;
  colors: {
    '--cv-bg-color': string;
    '--cv-text-color': string;
    '--cv-header-bg-color': string;
    '--cv-header-text-color': string;
    '--cv-section-title-color': string;
    '--cv-border-color': string;
  };
}

export const themes: Theme[] = [
  {
    name: 'Classic',
    colors: {
      '--cv-bg-color': '#ffffff',
      '--cv-text-color': '#374151', // gray-700
      '--cv-header-bg-color': '#f3f4f6', // gray-100
      '--cv-header-text-color': '#111827', // gray-900
      '--cv-section-title-color': '#374151', // gray-700
      '--cv-border-color': '#d1d5db', // gray-300
    },
  },
  {
    name: 'Modern',
    colors: {
      '--cv-bg-color': '#ffffff',
      '--cv-text-color': '#2d3748', // gray-800
      '--cv-header-bg-color': '#2d3748', // gray-800
      '--cv-header-text-color': '#ffffff',
      '--cv-section-title-color': '#2c5282', // blue-800
      '--cv-border-color': '#e2e8f0', // gray-200
    },
  },
  {
    name: 'Dark',
    colors: {
      '--cv-bg-color': '#1a202c', // gray-900
      '--cv-text-color': '#e2e8f0', // gray-200
      '--cv-header-bg-color': '#2d3748', // gray-800
      '--cv-header-text-color': '#ffffff',
      '--cv-section-title-color': '#63b3ed', // blue-300
      '--cv-border-color': '#4a5568', // gray-600
    },
  },
];
