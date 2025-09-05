import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { themes } from '../../themes';

const ThemeSwitcher: React.FC = () => {
  const { setTheme } = useTheme();

  return (
    <div className="flex items-center p-4 bg-gray-100 rounded-lg shadow">
      <span className="mr-4 font-semibold text-gray-700">Tema:</span>
      <div className="flex space-x-2">
        {themes.map((themeOption) => (
          <button
            key={themeOption.name}
            onClick={() => setTheme(themeOption)}
            className={`px-3 py-1 text-sm font-medium ${themeOption.name === 'Classic' ? 'text-gray-800' : 'text-white'} rounded-md transition-colors duration-200 border border-gray-300`}
            style={{ backgroundColor: themeOption.colors['--cv-header-bg-color'] }}
            title={`Mudar para o tema ${themeOption.name}`}
          >
            {themeOption.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
