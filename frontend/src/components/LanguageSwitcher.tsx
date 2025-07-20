import React from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [langMenuOpen, setLangMenuOpen] = React.useState(false);
  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  React.useEffect(() => {
    if (!langMenuOpen) return;
    function closeMenu() { setLangMenuOpen(false); }
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, [langMenuOpen]);

  return (
    <div className="lang-switcher-root">
      <div
        className={`lang-switch${langMenuOpen ? ' open' : ''}`}
        onClick={e => {
          e.stopPropagation();
          setLangMenuOpen(v => !v);
        }}
      >
        <span>{currentLang.label}</span>
        <span className="lang-switch-arrow">▼</span>
      </div>
      {langMenuOpen && (
        <div
          className="lang-menu"
          onClick={e => e.stopPropagation()}
        >
          {LANGUAGES.filter(lang => lang.code !== currentLang.code)
            .map(lang => (
              <div
                key={lang.code}
                className="lang-menu-item"
                onClick={() => {
                  i18n.changeLanguage(lang.code);
                  setLangMenuOpen(false);
                }}
              >
                {lang.label}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
