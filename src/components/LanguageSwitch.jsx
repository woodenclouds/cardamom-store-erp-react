import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitch = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
      aria-label="Switch language"
      title={`Current: ${language === 'en' ? 'English' : 'മലയാളം'}`}
    >
      <Languages className="w-5 h-5 text-slate-600 dark:text-slate-400" />
      <span className="text-xs font-medium text-slate-600 dark:text-slate-400 hidden sm:inline">
        {language === 'en' ? 'EN' : 'ML'}
      </span>
    </button>
  );
};

export default LanguageSwitch;

