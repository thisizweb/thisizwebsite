import React, { useState } from 'react';
import { Menu, X, Globe, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'home', label: t('home') },
    { id: 'tutorial', label: t('tutorial') },
    { id: 'posting', label: t('postingService') },
    { id: 'search', label: t('searchService') },
    { id: 'market', label: t('market') }
  ];

  if (user?.is_admin) {
    menuItems.push({ id: 'admin', label: t('adminValidation') });
  }

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="text-2xl font-bold cursor-pointer bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
            onClick={() => onNavigate('home')}
          >
            THIS IZ STORE
          </div>

          <div className="hidden md:flex space-x-4 items-center">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-yellow-500 text-black'
                    : 'hover:bg-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              className="p-2 hover:bg-gray-700 rounded-md transition-colors"
              title={language === 'id' ? 'Switch to English' : 'Ganti ke Indonesia'}
            >
              <Globe className="w-5 h-5" />
            </button>

            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm flex items-center">
                  {user.username}
                  {user.is_admin && (
                    <ShieldCheck className="w-4 h-4 ml-1 text-yellow-400" title="Admin" />
                  )}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium transition-colors"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium transition-colors"
              >
                {t('login')}
              </button>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-700"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === item.id
                    ? 'bg-yellow-500 text-black'
                    : 'hover:bg-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded-md flex items-center"
            >
              <Globe className="w-5 h-5 mr-2" />
              {language === 'id' ? 'English' : 'Indonesia'}
            </button>

            {user ? (
              <>
                <div className="px-3 py-2 text-sm flex items-center">
                  {user.username}
                  {user.is_admin && (
                    <ShieldCheck className="w-4 h-4 ml-1 text-yellow-400" title="Admin" />
                  )}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md font-medium"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onNavigate('login');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 bg-green-600 hover:bg-green-700 rounded-md font-medium"
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