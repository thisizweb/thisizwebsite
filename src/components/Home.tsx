import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ShoppingBag, BookOpen } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-4xl">
        <h1
          className="text-6xl md:text-8xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
          style={{ fontFamily: '"Press Start 2P", cursive, monospace' }}
        >
          {t('appTitle')}
        </h1>

        <p className="text-2xl md:text-3xl text-gray-300 font-semibold">
          {t('tagline')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <button
            onClick={() => onNavigate('market')}
            className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-lg text-lg hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-2xl flex items-center space-x-2"
          >
            <ShoppingBag className="w-6 h-6" />
            <span>{t('viewMarket')}</span>
          </button>

          <button
            onClick={() => onNavigate('tutorial')}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg text-lg hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-2xl flex items-center space-x-2"
          >
            <BookOpen className="w-6 h-6" />
            <span>{t('tutorial')}</span>
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-yellow-500 transition-colors">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">
              Murah
            </h3>
            <p className="text-gray-400">
              Harga terjangkau untuk semua kalangan
            </p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-orange-500 transition-colors">
            <h3 className="text-xl font-bold text-orange-400 mb-2">
              Aman
            </h3>
            <p className="text-gray-400">
              Transaksi dijamin aman dan terpercaya
            </p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-red-500 transition-colors">
            <h3 className="text-xl font-bold text-red-400 mb-2">
              Terpercaya
            </h3>
            <p className="text-gray-400">
              Dipercaya oleh ribuan pengguna
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;