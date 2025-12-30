import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { PostingService, SearchService } from '../types';
import { Check, X, Edit, Trash2, Eye, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminValidation: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [postings, setPostings] = useState<PostingService[]>([]);
  const [searches, setSearches] = useState<SearchService[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'postings' | 'searches'>('postings');
  const [viewModal, setViewModal] = useState<PostingService | SearchService | null>(null);
  const [editModal, setEditModal] = useState<PostingService | SearchService | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (user?.is_admin) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postingsData, searchesData] = await Promise.all([
        supabase
          .from('posting_services')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('search_services')
          .select('*')
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

  const handleApprove = async (id: string, type: 'posting' | 'search') => {
    try {
      const table = type === 'posting' ? 'posting_services' : 'search_services';
      await supabase
        .from(table)
        .update({ status: 'approved' })
        .eq('id', id);
      fetchData();
    } catch (error) {
      console.error('Error approving:', error);
    }
  };

  const handleReject = async (id: string, type: 'posting' | 'search') => {
    try {
      const table = type === 'posting' ? 'posting_services' : 'search_services';
      await supabase
        .from(table)
        .update({ status: 'pending' })
        .eq('id', id);
      fetchData();
    } catch (error) {
      console.error('Error rejecting:', error);
    }
  };

  const handleDelete = async (id: string, type: 'posting' | 'search') => {
    if (!confirm(language === 'id' ? 'Yakin ingin menghapus?' : 'Are you sure you want to delete?')) {
      return;
    }

    try {
      const table = type === 'posting' ? 'posting_services' : 'search_services';
      await supabase
        .from(table)
        .delete()
        .eq('id', id);
      fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
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

      setEditModal(null);
      setEditData({});
      fetchData();
    } catch (error) {
      console.error('Error updating:', error);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <div className="text-white text-xl">{t('adminOnly')}</div>
      </div>
    );
  }

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
          {t('adminValidation')}
        </h1>

        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('postings')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'postings'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            {t('postingService')} ({postings.length})
          </button>
          <button
            onClick={() => setActiveTab('searches')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'searches'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            {t('searchService')} ({searches.length})
          </button>
        </div>

        <div className="space-y-4">
          {activeTab === 'postings' ? (
            postings.map(posting => (
              <div
                key={posting.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {posting.account} - {posting.code}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          posting.status === 'approved'
                            ? 'bg-green-600 text-white'
                            : 'bg-yellow-600 text-black'
                        }`}
                      >
                        {posting.status === 'approved' ? t('approved') : t('pending')}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{posting.name}</p>
                    <p className="text-yellow-400 font-bold">{formatPrice(posting.price)}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setViewModal(posting)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      title={t('details')}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleWhatsApp(posting.phone)}
                      className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    {posting.status === 'pending' ? (
                      <button
                        onClick={() => handleApprove(posting.id, 'posting')}
                        className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                        title={t('approve')}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReject(posting.id, 'posting')}
                        className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                        title={t('cancel')}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(posting)}
                      className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                      title={t('edit')}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(posting.id, 'posting')}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                      title={t('delete')}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            searches.map(search => (
              <div
                key={search.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {search.account} - {search.code}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          search.status === 'approved'
                            ? 'bg-green-600 text-white'
                            : 'bg-yellow-600 text-black'
                        }`}
                      >
                        {search.status === 'approved' ? t('approved') : t('pending')}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{search.name}</p>
                    <p className="text-yellow-400 font-bold">
                      {formatPrice(search.price_min)} - {formatPrice(search.price_max)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setViewModal(search)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      title={t('details')}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleWhatsApp(search.phone)}
                      className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    {search.status === 'pending' ? (
                      <button
                        onClick={() => handleApprove(search.id, 'search')}
                        className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                        title={t('approve')}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReject(search.id, 'search')}
                        className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                        title={t('cancel')}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(search)}
                      className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                      title={t('edit')}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(search.id, 'search')}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                      title={t('delete')}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {activeTab === 'postings' && postings.length === 0 && (
          <p className="text-gray-400 text-center py-8">
            {language === 'id' ? 'Tidak ada posting' : 'No postings'}
          </p>
        )}
        {activeTab === 'searches' && searches.length === 0 && (
          <p className="text-gray-400 text-center py-8">
            {language === 'id' ? 'Tidak ada pencarian' : 'No searches'}
          </p>
        )}
      </div>

      {viewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{t('details')}</h2>
              <button
                onClick={() => setViewModal(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {'price' in viewModal && viewModal.images && viewModal.images.length > 0 && (
                <div className="mb-4">
                  <div className="relative">
                    <img
                      src={viewModal.images[currentImageIndex]}
                      alt={`Image ${currentImageIndex + 1}`}
                      className="w-full h-64 object-contain bg-gray-900 rounded-lg"
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
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() =>
                            setCurrentImageIndex(
                              (currentImageIndex + 1) % viewModal.images.length
                            )
                          }
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
              <div className="space-y-3 text-gray-300">
                <div>
                  <span className="font-semibold">{t('code')}:</span> {viewModal.code}
                </div>
                <div>
                  <span className="font-semibold">{t('name')}:</span> {viewModal.name}
                </div>
                <div>
                  <span className="font-semibold">{t('account')}:</span> {viewModal.account}
                </div>
                <div>
                  <span className="font-semibold">{t('phoneNumber')}:</span>{' '}
                  <button
                    onClick={() => handleWhatsApp(viewModal.phone)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {viewModal.phone}
                  </button>
                </div>
                {'price' in viewModal ? (
                  <>
                    <div>
                      <span className="font-semibold">{t('price')}:</span>{' '}
                      {formatPrice(viewModal.price)}
                    </div>
                    <div>
                      <span className="font-semibold">{t('accountStatus')}:</span>{' '}
                      {viewModal.status_type === 'secure' ? t('secureData') : t('lessSecureData')}
                    </div>
                    {viewModal.additional_specs && (
                      <div>
                        <span className="font-semibold">{t('additionalSpecs')}:</span>
                        <p className="mt-1 whitespace-pre-wrap">{viewModal.additional_specs}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <span className="font-semibold">{t('priceRange')}:</span>{' '}
                      {formatPrice(viewModal.price_min)} - {formatPrice(viewModal.price_max)}
                    </div>
                    <div>
                      <span className="font-semibold">{t('specifications')}:</span>
                      <p className="mt-1 whitespace-pre-wrap">{viewModal.specifications}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{t('edit')}</h2>
              <button
                onClick={() => setEditModal(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  {t('name')}
                </label>
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  {t('account')}
                </label>
                <input
                  type="text"
                  value={editData.account || ''}
                  onChange={(e) => setEditData({ ...editData, account: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  {t('phoneNumber')}
                </label>
                <input
                  type="text"
                  value={editData.phone || ''}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                />
              </div>
              {'price' in editData ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      {t('price')}
                    </label>
                    <input
                      type="number"
                      value={editData.price || ''}
                      onChange={(e) => setEditData({ ...editData, price: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      {t('additionalSpecs')}
                    </label>
                    <textarea
                      value={editData.additional_specs || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, additional_specs: e.target.value })
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      {t('priceRange')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={editData.price_min || ''}
                        onChange={(e) =>
                          setEditData({ ...editData, price_min: parseInt(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                      />
                      <input
                        type="number"
                        value={editData.price_max || ''}
                        onChange={(e) =>
                          setEditData({ ...editData, price_max: parseInt(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">
                      {t('specifications')}
                    </label>
                    <textarea
                      value={editData.specifications || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, specifications: e.target.value })
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                    />
                  </div>
                </>
              )}
              <button
                onClick={handleEdit}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-3 px-4 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all"
              >
                {t('submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminValidation;