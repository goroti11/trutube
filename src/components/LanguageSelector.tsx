import { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentLanguage = languages.find(l => l.code === language);

  const filteredLanguages = languages.filter(lang =>
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLanguage = (code: string) => {
    setLanguage(code as any);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
        title="Change Language"
      >
        <Globe className="w-5 h-5" />
        <span className="hidden md:inline text-sm font-medium">{currentLanguage?.nativeName}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden flex flex-col">
            <div className="p-3 border-b border-neutral-800">
              <input
                type="text"
                placeholder="Search languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                autoFocus
              />
            </div>

            <div className="overflow-y-auto">
              {filteredLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-800 transition-colors ${
                    language === lang.code ? 'bg-neutral-800' : ''
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-white font-medium">{lang.nativeName}</span>
                    <span className="text-xs text-neutral-400">{lang.name}</span>
                  </div>
                  {language === lang.code && (
                    <Check className="w-5 h-5 text-red-500" />
                  )}
                </button>
              ))}
            </div>

            {filteredLanguages.length === 0 && (
              <div className="p-4 text-center text-neutral-400 text-sm">
                No languages found
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
