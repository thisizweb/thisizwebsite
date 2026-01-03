import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ShoppingBag, BookOpen, Shield, Zap, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: language === 'id' ? 'Murah' : 'Affordable',
      description: language === 'id'
        ? 'Harga terjangkau untuk semua kalangan'
        : 'Affordable prices for everyone',
      color: 'from-cyan-500 to-blue-500',
      link: '/market',
      type: 'internal'
    },
    {
      icon: Shield,
      title: language === 'id' ? 'Aman' : 'Secure',
      description: language === 'id'
        ? 'Transaksi dijamin aman dan terpercaya'
        : 'Guaranteed safe and trusted transactions',
      color: 'from-emerald-500 to-teal-500',
      link: 'https://www.instagram.com/p/CiB4xHOuNkr/?igsh=eGZpbzkxM2Fnc3c3',
      type: 'external'
    },
    {
      icon: Users,
      title: language === 'id' ? 'Terpercaya' : 'Trusted',
      description: language === 'id'
        ? 'Dipercaya oleh ribuan pengguna'
        : 'Trusted by thousands of users',
      color: 'from-purple-500 to-pink-500',
      link: 'https://www.instagram.com/reel/ClIBjbZuNL7/?igsh=MXJ6Nm9zYnB1ZTN6Mw==',
      type: 'external'
    }
  ];

  return (
    <div className="page-container">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center space-y-8">
            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tight">
              <span className="text-neon-gradient">THIS IZ STORE</span>
            </h1>

            {/* Tagline */}
            <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto">
              {t('tagline')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button
                onClick={() => navigate('/market')}
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl text-lg hover:from-cyan-400 hover:to-blue-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 flex items-center space-x-3"
              >
                <ShoppingBag className="w-6 h-6" />
                <span>{t('viewMarket')}</span>
              </button>

              <button
                onClick={() => navigate('/tutorial')}
                className="group relative px-8 py-4 bg-slate-800/80 border border-slate-700 text-white font-bold rounded-xl text-lg hover:bg-slate-700/80 hover:border-cyan-500/50 transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
              >
                <BookOpen className="w-6 h-6" />
                <span>{t('tutorial')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-2 md:px-4 py-8 md:py-16">
        <div className="grid grid-cols-3 gap-2 md:gap-6">
          {features.map((feature, index) => {
            const CardContent = () => (
              <div className="group card card-hover p-2 md:p-8 text-center h-full flex flex-col items-center justify-center">
                <div className={`inline-flex p-2 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br ${feature.color} mb-2 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-4 h-4 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-[10px] md:text-xl font-bold text-white mb-1 md:mb-3 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-[9px] md:text-base text-slate-400 leading-tight md:leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );

            return feature.type === 'internal' ? (
              <div
                key={index}
                onClick={() => navigate(feature.link)}
                className="cursor-pointer block h-full"
              >
                <CardContent />
              </div>
            ) : (
              <a
                key={index}
                href={feature.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                <CardContent />
              </a>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="card p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-neon-gradient mb-2">2000+</div>
              <div className="text-slate-400 text-sm">{language === 'id' ? 'Pengguna Aktif' : 'Active Users'}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-neon-gradient mb-2">1000+</div>
              <div className="text-slate-400 text-sm">{language === 'id' ? 'Transaksi Berhasil' : 'Successful Trades'}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-neon-gradient mb-2">50+</div>
              <div className="text-slate-400 text-sm">{language === 'id' ? 'Akun Didukung' : 'Account Supported'}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-neon-gradient mb-2">24/7</div>
              <div className="text-slate-400 text-sm">{language === 'id' ? 'Layanan Support' : 'Support Service'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;