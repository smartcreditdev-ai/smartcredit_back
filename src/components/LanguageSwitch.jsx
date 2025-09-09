import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

const LanguageSwitch = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language);

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
        <Globe className="w-4 h-4" />
        <span className="hidden sm:block">{currentLanguage?.flag} {currentLanguage?.name}</span>
        <span className="sm:hidden">{currentLanguage?.flag}</span>
      </button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                i18n.language === lang.code ? 'text-primary-600 bg-primary-50' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
              {i18n.language === lang.code && (
                <Check className="w-4 h-4 text-primary-600" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitch;
