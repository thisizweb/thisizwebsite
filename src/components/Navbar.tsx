import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/home', label: t('home') },
    { path: '/tutorial', label: t('tutorial') },
    { path: '/posting-service', label: t('postingService') },
    { path: '/search-service', label: t('searchService') },
    { path: '/market', label: t('market') }
  ];

  if (user?.is_admin) {
    menuItems.push({ path: '/admin', label: t('adminValidation') });
  }

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate('/home');
  };

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md text-white shadow-lg sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16">
          {/* Logo */}
          <div
            className="text-xl font-display font-bold cursor-pointer text-neon-gradient hover:opacity-80 transition-opacity"
            onClick={() => navigate('/home')}
          >
            THIS IZ STORE
          </div>

          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex items-center justify-center space-x-1">
            {menuItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(item.path)
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Section - Language & User */}
          <div className="hidden md:flex items-center justify-self-end">
            {/* Language Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
              >
                <span>{language === 'id' ? '🇮🇩 ID' : '🇺🇸 US'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                  <button
                    onClick={() => { setLanguage('id'); setIsLangOpen(false); }}
                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center space-x-2 transition-colors ${language === 'id' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-slate-700'
                      }`}
                  >
                    <span>🇮🇩</span>
                    <span>Indonesia</span>
                  </button>
                  <button
                    onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center space-x-2 transition-colors ${language === 'en' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-slate-700'
                      }`}
                  >
                    <span>🇺🇸</span>
                    <span>English</span>
                  </button>
                </div>
              )}
            </div>

            {/* User Section */}
            {user ? (
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-slate-700">
                <span className="text-sm flex items-center text-slate-300">
                  {user.username}
                  {user.is_admin && (
                    <ShieldCheck className="w-4 h-4 ml-1 text-cyan-400" />
                  )}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 rounded-lg text-sm font-medium transition-all"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="ml-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg hover:shadow-cyan-500/25"
              >
                {t('login')}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden col-start-3 justify-self-end p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full md:hidden bg-slate-900 border-b border-slate-800 shadow-xl z-50">
          <div className="px-4 pt-3 pb-4 space-y-2">
            {menuItems.map(item => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all ${isActive(item.path)
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
                  }`}
              >
                {item.label}
              </button>
            ))}

            {/* Mobile Language Selection */}
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setLanguage('id')}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors ${language === 'id' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-300'
                  }`}
              >
                <span>🇮🇩</span>
                <span>Indonesia</span>
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors ${language === 'en' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-300'
                  }`}
              >
                <span>🇺🇸</span>
                <span>English</span>
              </button>
            </div>

            {/* Mobile User Section */}
            {user ? (
              <div className="pt-3 border-t border-slate-800 mt-3">
                <div className="px-4 py-2 text-sm flex items-center text-slate-300">
                  {user.username}
                  {user.is_admin && (
                    <ShieldCheck className="w-4 h-4 ml-1 text-cyan-400" />
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 px-4 py-3 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 rounded-lg font-medium transition-all"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
                className="w-full mt-3 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-400 hover:to-blue-500 transition-all"
              >
                {t('login')}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;