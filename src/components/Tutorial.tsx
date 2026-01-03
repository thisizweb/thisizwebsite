import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Play, MessageCircle } from 'lucide-react';

const Tutorial: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
  };

  const tutorials = [
    {
      title: t('tutorialPosting'),
      videoId: 'dQw4w9WgXcQ', // Replace with actual video ID
      description:
        language === 'id'
          ? 'Cara jasa posting akun game dengan mudah dan cepat'
          : 'Learn how to post game account services easily and quickly'
    },
    {
      title: t('tutorialSearch'),
      videoId: 'dQw4w9WgXcQ', // Replace with actual video ID
      description:
        language === 'id'
          ? 'Cara jasa cari akun game yang sesuai dengan kebutuhan Anda'
          : 'How to search for game account services that match your needs'
    },
    {
      title: t('tutorialMarket'),
      videoId: 'dQw4w9WgXcQ', // Replace with actual video ID
      description:
        language === 'id'
          ? 'Panduan lengkap cara jual beli akun melalui marketplace kami'
          : 'Complete guide to buying and selling accounts via our marketplace'
    }
  ];

  return (
    <div className="page-container p-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">{t('tutorial')}</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {language === 'id'
              ? 'Tonton video tutorial untuk memahami cara menggunakan platform kami dengan mudah'
              : 'Watch video tutorials to easily understand how to use our platform'}
          </p>
        </div>

        {/* Video Tutorials */}
        <div className="space-y-8">
          {tutorials.map((tutorial, index) => (
            <div
              key={index}
              className="card card-hover overflow-hidden"
            >
              <div className="md:flex">
                {/* Video Embed */}
                <div className="md:w-2/3 relative">
                  <div className="aspect-video bg-slate-900">
                    {activeVideo === index ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${tutorial.videoId}?autoplay=1&rel=0`}
                        title={tutorial.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div
                        className="relative w-full h-full cursor-pointer group"
                        onClick={() => setActiveVideo(index)}
                      >
                        <img
                          src={`https://img.youtube.com/vi/${tutorial.videoId}/maxresdefault.jpg`}
                          alt={tutorial.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${tutorial.videoId}/hqdefault.jpg`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                          <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/25">
                            <Play className="w-8 h-8 text-white ml-1" fill="white" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Info */}
                <div className="md:w-1/3 p-6 flex flex-col justify-center">
                  <div className="text-cyan-400 text-sm font-medium mb-2">
                    Tutorial {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {tutorial.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {tutorial.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-12 card p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-3">
            {language === 'id' ? 'Butuh Bantuan?' : 'Need Help?'}
          </h3>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            {language === 'id'
              ? 'Jika Anda masih memiliki pertanyaan, jangan ragu untuk menghubungi admin kami melalui WhatsApp.'
              : "If you still have questions, don't hesitate to contact our admin via WhatsApp."}
          </p>
          <a
            href="https://wa.me/6283136224221"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 btn-success"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{language === 'id' ? 'Hubungi Admin' : 'Contact Admin'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;