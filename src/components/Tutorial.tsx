import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Youtube, ExternalLink } from 'lucide-react';

const Tutorial: React.FC = () => {
  const { t, language } = useLanguage();

  const tutorials = [
    {
      title: t('tutorialPosting'),
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description:
        language === 'id'
          ? 'Pelajari cara posting jasa akun game dengan mudah'
          : 'Learn how to post game account services easily'
    },
    {
      title: t('tutorialSearch'),
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description:
        language === 'id'
          ? 'Cara mencari jasa akun game yang Anda inginkan'
          : 'How to search for the game account services you want'
    },
    {
      title: t('tutorialMarket'),
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description:
        language === 'id'
          ? 'Panduan lengkap jual beli akun melalui market'
          : 'Complete guide to buying and selling accounts via market'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          {t('tutorial')}
        </h1>

        <p className="text-center text-gray-400 mb-12">
          {language === 'id'
            ? 'Tonton video tutorial untuk memahami cara menggunakan platform kami'
            : 'Watch video tutorials to understand how to use our platform'}
        </p>

        <div className="space-y-6">
          {tutorials.map((tutorial, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-yellow-500 transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-red-600 p-3 rounded-lg flex-shrink-0">
                  <Youtube className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {tutorial.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{tutorial.description}</p>
                  <a
                    href={tutorial.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <span>
                      {language === 'id' ? 'Tonton Video' : 'Watch Video'}
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-yellow-400 mb-3">
            {language === 'id' ? 'Butuh Bantuan?' : 'Need Help?'}
          </h3>
          <p className="text-gray-400 mb-4">
            {language === 'id'
              ? 'Jika Anda masih memiliki pertanyaan, jangan ragu untuk menghubungi admin kami melalui WhatsApp.'
              : "If you still have questions, don't hesitate to contact our admin via WhatsApp."}
          </p>
          <a
            href="https://wa.me/6283136224221"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {language === 'id' ? 'Hubungi Admin' : 'Contact Admin'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;