import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { usePopup } from '../contexts/PopupContext';
import { useData } from '../contexts/DataContext';
import { supabase } from '../lib/supabase';
import { PostingService, SearchService, GAME_ACCOUNTS } from '../types';
import { Check, X, Edit, Trash2, Eye, MessageCircle, ChevronLeft, ChevronRight, ShieldCheck, FileText, Search, Maximize2, Filter, ChevronDown } from 'lucide-react';

const AdminValidation: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { showSuccess, showError, showConfirm } = usePopup();
  const { postings: allPostings, searches: allSearches, loading: dataLoading, refreshData } = useData();

  const [postings, setPostings] = useState<PostingService[]>([]);
  const [searches, setSearches] = useState<SearchService[]>([]);
  const [activeTab, setActiveTab] = useState<'postings' | 'searches'>('postings');
  const [viewModal, setViewModal] = useState<PostingService | SearchService | null>(null);
  const [editModal, setEditModal] = useState<PostingService | SearchService | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [fullscreenImages, setFullscreenImages] = useState<string[]>([]);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Accounts');

  useEffect(() => {
    if (allPostings) setPostings(allPostings);
    if (allSearches) setSearches(allSearches);
  }, [allPostings, allSearches]);

  const handleApprove = async (id: string, type: 'posting' | 'search') => {
    try {
      const table = type === 'posting' ? 'posting_services' : 'search_services';
      await supabase
        .from(table)
        .update({ status: 'approved' })
        .eq('id', id);
      showSuccess(
        language === 'id' ? 'Berhasil disetujui!' : 'Successfully approved!',
        language === 'id' ? 'Disetujui' : 'Approved'
      );
      await refreshData();
    } catch (error) {
      showError(language === 'id' ? 'Gagal menyetujui' : 'Failed to approve');
    }
  };

  const handleReject = async (id: string, type: 'posting' | 'search') => {
    try {
      const table = type === 'posting' ? 'posting_services' : 'search_services';
      await supabase
        .from(table)
        .update({ status: 'pending' })
        .eq('id', id);
      showSuccess(
        language === 'id' ? 'Status dikembalikan ke pending' : 'Status reverted to pending',
        language === 'id' ? 'Dibatalkan' : 'Reverted'
      );
      await refreshData();
    } catch (error) {
      showError(language === 'id' ? 'Gagal membatalkan' : 'Failed to revert');
    }
  };

  const handleDelete = (id: string, type: 'posting' | 'search') => {
    showConfirm(
      language === 'id'
        ? 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.'
        : 'Are you sure you want to delete this? This action cannot be undone.',
      async () => {
        try {
          if (type === 'posting') {
            const posting = postings.find(p => p.id === id);
            if (posting?.images && posting.images.length > 0) {
              const filesToRemove = posting.images
                .filter(url => url.includes('acc-images'))
                .map(url => {
                  const parts = url.split('/');
                  return parts[parts.length - 1];
                });

              if (filesToRemove.length > 0) {
                await supabase.storage
                  .from('acc-images')
                  .remove(filesToRemove);
              }
            }
          }

          const table = type === 'posting' ? 'posting_services' : 'search_services';
          await supabase
            .from(table)
            .delete()
            .eq('id', id);
          showSuccess(
            language === 'id' ? 'Berhasil dihapus!' : 'Successfully deleted!',
            language === 'id' ? 'Terhapus' : 'Deleted'
          );
          await refreshData();
        } catch (error) {
          showError(language === 'id' ? 'Gagal menghapus' : 'Failed to delete');
        }
      },
      language === 'id' ? 'Konfirmasi Hapus' : 'Confirm Delete'
    );
  };

  const handleEdit = async () => {
    if (!editModal) return;

    try {
      const isPosting = 'price' in editModal;
      const table = isPosting ? 'posting_services' : 'search_services';

      await supabase
        .from(table)
        .update(editData)
        .eq('id', editModal.id);

      showSuccess(
        language === 'id' ? 'Berhasil diperbarui!' : 'Successfully updated!',
        language === 'id' ? 'Tersimpan' : 'Saved'
      );
      setEditModal(null);
      setEditData({});
      await refreshData();
    } catch (error) {
      showError(language === 'id' ? 'Gagal memperbarui' : 'Failed to update');
    }
  };

  const openEditModal = (item: PostingService | SearchService) => {
    setEditModal(item);
    setEditData(item);
  };

  const handleWhatsApp = (phone: string) => {
    window.open(`https://wa.me/62${phone.replace(/^0/, '')}`, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!user?.is_admin) {
    return (
      <div className="page-container flex items-center justify-center p-4">
        <div className="card p-8 text-center max-w-md">
          <ShieldCheck className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">{t('adminOnly')}</h2>
          <p className="text-slate-400">
            {language === 'id'
              ? 'Halaman ini hanya dapat diakses oleh admin'
              : 'This page can only be accessed by admins'}
          </p>
        </div>
      </div>
    );
  }

  if (dataLoading) {
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
          <h1 className="section-title">{t('adminValidation')}</h1>
          <p className="text-slate-400">
            {language === 'id'
              ? 'Kelola dan validasi posting dari pengguna'
              : 'Manage and validate user submissions'}
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
              <FileText className="w-5 h-5" />
              <span>{t('postingService')}</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-white/20">{postings.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('searches')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'searches'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              <Search className="w-5 h-5" />
              <span>{t('searchService')}</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-white/20">{searches.length}</span>
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
                  {account === 'Other' ? t('other') : account}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-2 md:gap-4">
          {activeTab === 'postings' ? (
            postings
              .filter(posting => {
                const matchesSearch =
                  posting.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  posting.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  posting.account.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory =
                  selectedCategory === 'All Accounts' || posting.account === selectedCategory;
                return matchesSearch && matchesCategory;
              })
              .map(posting => (
                <div
                  key={posting.id}
                  className="card p-3 md:p-5"
                >
                  <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
                    {/* Info Section */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm md:text-lg font-bold text-white truncate">
                          {posting.account} - {posting.code}
                        </h3>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] md:text-xs font-medium border ${posting.status === 'approved'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            }`}
                        >
                          {posting.status === 'approved' ? t('approved') : t('pending')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs md:text-sm">
                        <span className="text-neon-gradient font-bold">{formatPrice(posting.price)}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 truncate">{posting.name}</span>
                      </div>
                    </div>

                    {/* Actions Section */}
                    <div className="flex items-center gap-1 md:gap-2 self-end md:self-auto">
                      <button
                        onClick={() => setViewModal(posting)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg transition-colors"
                        title={t('details')}
                      >
                        <Eye className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <button
                        onClick={() => handleWhatsApp(posting.phone)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg transition-colors"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      {posting.status === 'pending' ? (
                        <button
                          onClick={() => handleApprove(posting.id, 'posting')}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg transition-colors"
                          title={t('approve')}
                        >
                          <Check className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReject(posting.id, 'posting')}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition-colors"
                          title={t('cancel')}
                        >
                          <X className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(posting)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-purple-400 rounded-lg transition-colors"
                        title={t('edit')}
                      >
                        <Edit className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(posting.id, 'posting')}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-red-400 rounded-lg transition-colors"
                        title={t('delete')}
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            searches
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
                  className="card p-3 md:p-5"
                >
                  <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
                    {/* Info Section */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm md:text-lg font-bold text-white truncate">
                          {search.account} - {search.code}
                        </h3>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] md:text-xs font-medium border ${search.status === 'approved'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            }`}
                        >
                          {search.status === 'approved' ? t('approved') : t('pending')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs md:text-sm">
                        <span className="text-neon-gradient font-bold">
                          {formatPrice(search.price_min)} - {formatPrice(search.price_max)}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 truncate">{search.name}</span>
                      </div>
                    </div>

                    {/* Actions Section */}
                    <div className="flex items-center gap-1 md:gap-2 self-end md:self-auto">
                      <button
                        onClick={() => setViewModal(search)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg transition-colors"
                        title={t('details')}
                      >
                        <Eye className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <button
                        onClick={() => handleWhatsApp(search.phone)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg transition-colors"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      {search.status === 'pending' ? (
                        <button
                          onClick={() => handleApprove(search.id, 'search')}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg transition-colors"
                          title={t('approve')}
                        >
                          <Check className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReject(search.id, 'search')}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition-colors"
                          title={t('cancel')}
                        >
                          <X className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(search)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-purple-400 rounded-lg transition-colors"
                        title={t('edit')}
                      >
                        <Edit className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(search.id, 'search')}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-red-400 rounded-lg transition-colors"
                        title={t('delete')}
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Empty States */}
        {
          activeTab === 'postings' && postings.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">
                {language === 'id' ? 'Tidak ada posting' : 'No postings'}
              </p>
            </div>
          )
        }
        {
          activeTab === 'searches' && searches.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">
                {language === 'id' ? 'Tidak ada pencarian' : 'No searches'}
              </p>
            </div>
          )
        }
      </div >

      {/* View Modal */}
      {
        viewModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center z-50">
                <h2 className="text-xl font-bold text-white">{t('details')}</h2>
                <button
                  onClick={() => setViewModal(null)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="p-6">
                {'price' in viewModal && viewModal.images && viewModal.images.length > 0 && (
                  <div className="mb-6">
                    <div className="relative rounded-xl overflow-hidden">
                      <img
                        src={viewModal.images[currentImageIndex]}
                        alt={`Image ${currentImageIndex + 1}`}
                        className="w-full h-64 object-contain bg-slate-900"
                      />
                      {viewModal.images.length > 1 && (
                        <>
                          <button
                            onClick={() =>
                              setCurrentImageIndex(
                                currentImageIndex === 0
                                  ? viewModal.images.length - 1
                                  : currentImageIndex - 1
                              )
                            }
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white text-slate-900 rounded-full transition-all shadow-lg"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              setCurrentImageIndex(
                                (currentImageIndex + 1) % viewModal.images.length
                              )
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white text-slate-900 rounded-full transition-all shadow-lg"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFullscreenImages(viewModal.images || []);
                          setFullscreenIndex(currentImageIndex);
                          setFullscreenImage(viewModal.images?.[currentImageIndex] || null);
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
                <div className="space-y-3 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t('code')}:</span>
                    <span className="font-bold text-cyan-400">{viewModal.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t('name')}:</span>
                    <span>{viewModal.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t('account')}:</span>
                    <span>{viewModal.account}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t('phoneNumber')}:</span>
                    <button
                      onClick={() => handleWhatsApp(viewModal.phone)}
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      {viewModal.phone}
                    </button>
                  </div>
                  {'price' in viewModal ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{t('price')}:</span>
                        <span className="font-bold text-neon-gradient">{formatPrice(viewModal.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{t('accountStatus')}:</span>
                        <span>{viewModal.status_type === 'secure' ? t('secureData') : t('lessSecureData')}</span>
                      </div>
                      {viewModal.additional_specs && (
                        <div className="pt-3 border-t border-slate-700">
                          <span className="text-slate-400">{t('additionalSpecs')}:</span>
                          <p className="mt-2 whitespace-pre-wrap">{viewModal.additional_specs}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{t('priceRange')}:</span>
                        <span className="font-bold text-neon-gradient">
                          {formatPrice(viewModal.price_min)} - {formatPrice(viewModal.price_max)}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-slate-700">
                        <span className="text-slate-400">{t('specifications')}:</span>
                        <p className="mt-2 whitespace-pre-wrap">{viewModal.specifications}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Edit Modal */}
      {
        editModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center z-50">
                <h2 className="text-xl font-bold text-white">{t('edit')}</h2>
                <button
                  onClick={() => setEditModal(null)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="input-label">{t('name')}</label>
                  <input
                    type="text"
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="input-label">{t('account')}</label>
                  <input
                    type="text"
                    value={editData.account || ''}
                    onChange={(e) => setEditData({ ...editData, account: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="input-label">{t('phoneNumber')}</label>
                  <input
                    type="text"
                    value={editData.phone || ''}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="input"
                  />
                </div>
                {'price' in editData ? (
                  <>
                    <div>
                      <label className="input-label">{t('price')}</label>
                      <input
                        type="number"
                        value={editData.price || ''}
                        onChange={(e) => setEditData({ ...editData, price: parseInt(e.target.value) })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="input-label">{t('additionalSpecs')}</label>
                      <textarea
                        value={editData.additional_specs || ''}
                        onChange={(e) =>
                          setEditData({ ...editData, additional_specs: e.target.value })
                        }
                        rows={4}
                        className="input resize-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="input-label">{t('priceRange')}</label>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="number"
                          value={editData.price_min || ''}
                          onChange={(e) =>
                            setEditData({ ...editData, price_min: parseInt(e.target.value) })
                          }
                          className="input"
                        />
                        <input
                          type="number"
                          value={editData.price_max || ''}
                          onChange={(e) =>
                            setEditData({ ...editData, price_max: parseInt(e.target.value) })
                          }
                          className="input"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="input-label">{t('specifications')}</label>
                      <textarea
                        value={editData.specifications || ''}
                        onChange={(e) =>
                          setEditData({ ...editData, specifications: e.target.value })
                        }
                        rows={4}
                        className="input resize-none"
                      />
                    </div>
                  </>
                )}
                <button
                  onClick={handleEdit}
                  className="w-full btn-primary"
                >
                  {t('submit')}
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-sm border border-white/20"
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-sm border border-white/20"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white font-medium">
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

export default AdminValidation;