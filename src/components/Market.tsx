import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { PostingService, SearchService, GAME_ACCOUNTS } from '../types';
import { MessageCircle, ChevronLeft, ChevronRight, X, ShieldCheck, ShieldAlert, Eye, Search, ShoppingBag, Maximize2, Filter, ChevronDown } from 'lucide-react';


const ITEMS_PER_PAGE = 24;

const Market: React.FC = () => {
  const { t, language } = useLanguage();
  const { postings: allPostings, searches: allSearches, loading } = useData();

  // Local state for pagination and filtering
  const [postings, setPostings] = useState<PostingService[]>([]);
  const [searches, setSearches] = useState<SearchService[]>([]);
  const [page, setPage] = useState(0);
  const [hasMorePostings, setHasMorePostings] = useState(true);
  const [hasMoreSearches, setHasMoreSearches] = useState(true);

  const [selectedPosting, setSelectedPosting] = useState<PostingService | null>(null);
  const [selectedSearch, setSelectedSearch] = useState<SearchService | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'postings' | 'searches'>('postings');
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [fullscreenImages, setFullscreenImages] = useState<string[]>([]);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Accounts');

  // Filter and Paginate Data
  useEffect(() => {
    updateDisplayedData();
  }, [allPostings, allSearches, page, activeTab]); // Re-run when data or page changes

  const updateDisplayedData = () => {

    const to = (page + 1) * ITEMS_PER_PAGE;

    // We can just slice the full array since we have it all
    if (activeTab === 'postings') {
      const currentPostings = allPostings.slice(0, to);
      setPostings(currentPostings);
      setHasMorePostings(to < allPostings.length);
    } else {
      const currentSearches = allSearches.slice(0, to);
      setSearches(currentSearches);
      setHasMoreSearches(to < allSearches.length);
    }
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
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
      <div className="page-container flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-slate-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container p-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="section-title">{t('market')}</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {language === 'id'
              ? 'Temukan akun game impian Anda atau tawarkan akun Anda'
              : 'Find your dream game account or offer your account'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-slate-800/50 border border-slate-700 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('postings')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'postings'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{language === 'id' ? 'Akun Dijual' : 'For Sale'}</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-white/20">{allPostings.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('searches')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'searches'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              <Search className="w-5 h-5" />
              <span>{language === 'id' ? 'Dicari' : 'Wanted'}</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-white/20">{allSearches.length}</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'id'
                  ? 'Cari kode, nama, atau akun...'
                  : 'Search code, name, or account...'
              }
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-8 py-3 text-white focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer transition-colors"
            >
              {GAME_ACCOUNTS.map(account => (
                <option key={account} value={account} className="bg-slate-800">
                  {account}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {/* Content */}
        {activeTab === 'postings' ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {postings
              .filter(posting => {
                const matchesSearch =
                  posting.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  posting.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  posting.account.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory =
                  selectedCategory === 'All Accounts' || posting.account === selectedCategory;
                return matchesSearch && matchesCategory;
              })
              .map((posting, index) => (
                <div
                  key={posting.id}
                  className="card card-hover overflow-hidden group"
                >
                  {/* Image */}
                  {posting.images && posting.images.length > 0 ? (
                    <div className="relative h-32 md:h-48 overflow-hidden">
                      <img
                        src={posting.images[0]}
                        alt={posting.account}
                        loading={index < 6 ? "eager" : "lazy"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                        <span className="text-white font-bold text-lg">{posting.account}</span>
                        {posting.status_type === 'secure' ? (
                          <span className="flex items-center space-x-1 px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs">
                            <ShieldCheck className="w-3 h-3" />
                            <span>{language === 'id' ? 'Aman' : 'Secure'}</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1 px-2 py-1 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 text-xs">
                            <ShieldAlert className="w-3 h-3" />
                            <span>{language === 'id' ? 'Kurang Aman' : 'Less Secure'}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-32 md:h-48 bg-slate-800 flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 md:w-12 md:h-12 text-slate-600" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-3 md:p-5">
                    <p className="text-slate-400 text-xs md:text-sm mb-1 md:mb-2">{t('code')}: {posting.code}</p>
                    <p className="text-sm md:text-2xl font-bold text-neon-gradient mb-2 md:mb-4">
                      {formatPrice(posting.price)}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedPosting(posting);
                        setCurrentImageIndex(0);
                      }}
                      className="w-full btn-secondary flex items-center justify-center space-x-1 md:space-x-2 text-xs md:text-base py-1.5 md:py-2"
                    >
                      <Eye className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{t('viewDetails')}</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {searches
              .filter(search => {
                const matchesSearch =
                  search.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  search.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  search.account.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory =
                  selectedCategory === 'All Accounts' || search.account === selectedCategory;
                return matchesSearch && matchesCategory;
              })
              .map(search => (
                <div
                  key={search.id}
                  className="card card-hover p-3 md:p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2 md:mb-4 gap-2">
                    <h3 className="text-sm md:text-lg font-bold text-white line-clamp-1">{search.account}</h3>
                    <span className="self-start px-1.5 py-0.5 md:px-2 md:py-1 bg-cyan-500/20 border border-cyan-500/30 rounded md:rounded-lg text-cyan-400 text-[10px] md:text-xs whitespace-nowrap">
                      {language === 'id' ? 'Dicari' : 'Wanted'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs md:text-sm mb-1 md:mb-2">{t('code')}: {search.code}</p>
                  <p className="text-xs md:text-lg font-bold text-neon-gradient mb-2 md:mb-4 truncate">
                    {formatPrice(search.price_min)} - {formatPrice(search.price_max)}
                  </p>
                  <button
                    onClick={() => setSelectedSearch(search)}
                    className="w-full btn-secondary flex items-center justify-center space-x-1 md:space-x-2 text-xs md:text-base py-1.5 md:py-2"
                  >
                    <Eye className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{t('viewDetails')}</span>
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* Load More Button */}
        {activeTab === 'postings' && hasMorePostings && postings.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-medium rounded-full transition-colors border border-slate-700"
            >
              {language === 'id' ? 'Lihat Lebih Banyak' : 'Load More'}
            </button>
          </div>
        )}
        {activeTab === 'searches' && hasMoreSearches && searches.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-medium rounded-full transition-colors border border-slate-700"
            >
              {language === 'id' ? 'Lihat Lebih Banyak' : 'Load More'}
            </button>
          </div>
        )}

        {/* Empty States */}
        {activeTab === 'postings' && postings.length === 0 && (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">
              {language === 'id' ? 'Belum ada akun yang dijual' : 'No accounts for sale yet'}
            </p>
          </div>
        )}
        {activeTab === 'searches' && searches.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">
              {language === 'id' ? 'Belum ada pencarian akun' : 'No account searches yet'}
            </p>
          </div>
        )}
      </div>

      {/* Posting Detail Modal */}
      {
        selectedPosting && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center z-50">
                <h2 className="text-xl font-bold text-white">{t('details')}</h2>
                <button
                  onClick={() => setSelectedPosting(null)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="p-6">
                {/* Images */}
                {selectedPosting.images && selectedPosting.images.length > 0 && (
                  <div className="mb-6">
                    <div className="relative rounded-xl overflow-hidden">
                      <img
                        src={selectedPosting.images[currentImageIndex]}
                        alt={`Image ${currentImageIndex + 1}`}
                        className="w-full h-64 object-contain bg-slate-900"
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
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white text-slate-900 rounded-full transition-all shadow-lg z-10"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              setCurrentImageIndex(
                                (currentImageIndex + 1) % selectedPosting.images.length
                              )
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white text-slate-900 rounded-full transition-all shadow-lg z-10"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full text-sm text-white z-10">
                            {currentImageIndex + 1} / {selectedPosting.images.length}
                          </div>
                        </>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFullscreenImages(selectedPosting.images || []);
                          setFullscreenIndex(currentImageIndex);
                          setFullscreenImage(selectedPosting.images?.[currentImageIndex] || null);
                          setIsZoomed(false);
                        }}
                        className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white text-slate-900 rounded-full transition-all shadow-lg"
                        title="Preview Fullscreen"
                      >
                        <Maximize2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{t('code')}</span>
                    <span className="font-bold text-cyan-400">{selectedPosting.code}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{t('name')}</span>
                    <span className="text-white">{selectedPosting.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{t('account')}</span>
                    <span className="text-white">{selectedPosting.account}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{t('price')}</span>
                    <span className="text-2xl font-bold text-neon-gradient">{formatPrice(selectedPosting.price)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{t('accountStatus')}</span>
                    {selectedPosting.status_type === 'secure' ? (
                      <span className="flex items-center space-x-1 text-emerald-400">
                        <ShieldCheck className="w-4 h-4" />
                        <span>{language === 'id' ? 'Aman' : 'Secure'}</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-amber-400">
                        <ShieldAlert className="w-4 h-4" />
                        <span>{language === 'id' ? 'Kurang Aman' : 'Less Secure'}</span>
                      </span>
                    )}
                  </div>
                  {selectedPosting.additional_specs && (
                    <div className="pt-4 border-t border-slate-700">
                      <span className="text-slate-400 text-sm">{t('additionalSpecs')}</span>
                      <p className="text-white mt-2 whitespace-pre-wrap">{selectedPosting.additional_specs}</p>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleWhatsAppPosting(selectedPosting.code)}
                  className="w-full mt-6 btn-success flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{t('interestedBuy')}</span>
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Search Detail Modal */}
      {
        selectedSearch && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center z-50">
                <h2 className="text-xl font-bold text-white">{t('details')}</h2>
                <button
                  onClick={() => setSelectedSearch(null)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{t('code')}</span>
                    <span className="font-bold text-cyan-400">{selectedSearch.code}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{t('name')}</span>
                    <span className="text-white">{selectedSearch.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{t('account')}</span>
                    <span className="text-white">{selectedSearch.account}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{t('priceRange')}</span>
                    <span className="text-xl font-bold text-neon-gradient">
                      {formatPrice(selectedSearch.price_min)} - {formatPrice(selectedSearch.price_max)}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-slate-700">
                    <span className="text-slate-400 text-sm">{t('specifications')}</span>
                    <p className="text-white mt-2 whitespace-pre-wrap">{selectedSearch.specifications}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleWhatsAppSearch(selectedSearch.code)}
                  className="w-full mt-6 btn-success flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{t('interestedOffer')}</span>
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Fullscreen Image Preview */}
      {
        fullscreenImage && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-50"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="relative w-full h-full flex items-center justify-center p-4">
              <img
                src={fullscreenImage}
                alt="Preview"
                className={`transition-all duration-300 ${isZoomed
                  ? 'w-auto h-auto max-w-none cursor-zoom-out'
                  : 'max-w-full max-h-full object-contain cursor-zoom-in'
                  }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />

              {fullscreenImages.length > 1 && !isZoomed && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newIndex = fullscreenIndex === 0 ? fullscreenImages.length - 1 : fullscreenIndex - 1;
                      setFullscreenIndex(newIndex);
                      setFullscreenImage(fullscreenImages[newIndex]);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-sm border border-white/20 z-50"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newIndex = (fullscreenIndex + 1) % fullscreenImages.length;
                      setFullscreenIndex(newIndex);
                      setFullscreenImage(fullscreenImages[newIndex]);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-sm border border-white/20 z-50"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white font-medium z-50">
                    {fullscreenIndex + 1} / {fullscreenImages.length}
                  </div>
                </>
              )}
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Market;