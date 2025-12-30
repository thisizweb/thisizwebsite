import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { PostingService, SearchService } from '../types';
import { MessageCircle, ChevronLeft, ChevronRight, X, ShieldCheck, ShieldAlert } from 'lucide-react';

const Market: React.FC = () => {
  const { t, language } = useLanguage();
  const [postings, setPostings] = useState<PostingService[]>([]);
  const [searches, setSearches] = useState<SearchService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosting, setSelectedPosting] = useState<PostingService | null>(null);
  const [selectedSearch, setSelectedSearch] = useState<SearchService | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postingsData, searchesData] = await Promise.all([
        supabase
          .from('posting_services')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false }),
        supabase
          .from('search_services')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
      ]);

      if (postingsData.data) setPostings(postingsData.data);
      if (searchesData.data) setSearches(searchesData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleWhatsAppPosting = (code: string) => {
    const message = encodeURIComponent(
      language === 'id'
        ? `Tertarik Membeli Akun ${code}`
        : `Interested in Buying Account ${code}`
    );
    window.open(`https://wa.me/6283136224221?text=${message}`, '_blank');
  };

  const handleWhatsAppSearch = (code: string) => {
    const message = encodeURIComponent(
      language === 'id'
        ? `Mau Menawarkan Akun ke ${code}`
        : `Want to Offer Account to ${code}`
    );
    window.open(`https://wa.me/6283136224221?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          {t('market')}
        </h1>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            {language === 'id' ? 'Akun Dijual' : 'Accounts for Sale'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postings.map(posting => (
              <div
                key={posting.id}
                className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-yellow-500 transition-all duration-200 hover:shadow-lg"
              >
                {posting.images && posting.images.length > 0 && (
                  <img
                    src={posting.images[0]}
                    alt={posting.account}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white">{posting.account}</h3>
                    {posting.status_type === 'secure' ? (
                      <ShieldCheck className="w-5 h-5 text-green-500" title={t('secureData')} />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-yellow-500" title={t('lessSecureData')} />
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{t('code')}: {posting.code}</p>
                  <p className="text-yellow-400 font-bold text-xl mb-3">
                    {formatPrice(posting.price)}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedPosting(posting);
                      setCurrentImageIndex(0);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg mb-2 transition-colors"
                  >
                    {t('viewDetails')}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {postings.length === 0 && (
            <p className="text-gray-400 text-center py-8">
              {language === 'id' ? 'Belum ada akun yang dijual' : 'No accounts for sale yet'}
            </p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {language === 'id' ? 'Pencarian Akun' : 'Account Searches'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searches.map(search => (
              <div
                key={search.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-yellow-500 transition-all duration-200 hover:shadow-lg"
              >
                <h3 className="text-lg font-bold text-white mb-2">{search.account}</h3>
                <p className="text-gray-400 text-sm mb-2">{t('code')}: {search.code}</p>
                <p className="text-yellow-400 font-bold mb-3">
                  {formatPrice(search.price_min)} - {formatPrice(search.price_max)}
                </p>
                <button
                  onClick={() => setSelectedSearch(search)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg mb-2 transition-colors"
                >
                  {t('viewDetails')}
                </button>
              </div>
            ))}
          </div>
          {searches.length === 0 && (
            <p className="text-gray-400 text-center py-8">
              {language === 'id' ? 'Belum ada pencarian akun' : 'No account searches yet'}
            </p>
          )}
        </div>
      </div>

      {selectedPosting && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{t('details')}</h2>
              <button
                onClick={() => setSelectedPosting(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {selectedPosting.images && selectedPosting.images.length > 0 && (
                <div className="mb-4">
                  <div className="relative">
                    <img
                      src={selectedPosting.images[currentImageIndex]}
                      alt={`Image ${currentImageIndex + 1}`}
                      className="w-full h-64 object-contain bg-gray-900 rounded-lg"
                    />
                    {selectedPosting.images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setCurrentImageIndex(
                              currentImageIndex === 0
                                ? selectedPosting.images.length - 1
                                : currentImageIndex - 1
                            )
                          }
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() =>
                            setCurrentImageIndex(
                              (currentImageIndex + 1) % selectedPosting.images.length
                            )
                          }
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {selectedPosting.images.length}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
              <div className="space-y-3 text-gray-300">
                <div>
                  <span className="font-semibold text-gray-400">{t('code')}:</span>{' '}
                  <span className="font-bold text-yellow-400">{selectedPosting.code}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-400">{t('name')}:</span>{' '}
                  {selectedPosting.name}
                </div>
                <div>
                  <span className="font-semibold text-gray-400">{t('account')}:</span>{' '}
                  {selectedPosting.account}
                </div>
                <div>
                  <span className="font-semibold text-gray-400">{t('price')}:</span>{' '}
                  <span className="text-yellow-400 font-bold">
                    {formatPrice(selectedPosting.price)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-400 mr-2">{t('accountStatus')}:</span>
                  {selectedPosting.status_type === 'secure' ? (
                    <span className="flex items-center text-green-500">
                      <ShieldCheck className="w-4 h-4 mr-1" />
                      {language === 'id' ? 'Aman' : 'Secure'}
                    </span>
                  ) : (
                    <span className="flex items-center text-yellow-500">
                      <ShieldAlert className="w-4 h-4 mr-1" />
                      {language === 'id' ? 'Kurang Aman' : 'Less Secure'}
                    </span>
                  )}
                </div>
                {selectedPosting.additional_specs && (
                  <div>
                    <span className="font-semibold text-gray-400">{t('additionalSpecs')}:</span>
                    <p className="mt-1 text-gray-300 whitespace-pre-wrap">
                      {selectedPosting.additional_specs}
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleWhatsAppPosting(selectedPosting.code)}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t('interestedBuy')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{t('details')}</h2>
              <button
                onClick={() => setSelectedSearch(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-3 text-gray-300">
                <div>
                  <span className="font-semibold text-gray-400">{t('code')}:</span>{' '}
                  <span className="font-bold text-yellow-400">{selectedSearch.code}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-400">{t('name')}:</span>{' '}
                  {selectedSearch.name}
                </div>
                <div>
                  <span className="font-semibold text-gray-400">{t('account')}:</span>{' '}
                  {selectedSearch.account}
                </div>
                <div>
                  <span className="font-semibold text-gray-400">{t('priceRange')}:</span>{' '}
                  <span className="text-yellow-400 font-bold">
                    {formatPrice(selectedSearch.price_min)} - {formatPrice(selectedSearch.price_max)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-400">{t('specifications')}:</span>
                  <p className="mt-1 text-gray-300 whitespace-pre-wrap">
                    {selectedSearch.specifications}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleWhatsAppSearch(selectedSearch.code)}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t('interestedOffer')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Market;