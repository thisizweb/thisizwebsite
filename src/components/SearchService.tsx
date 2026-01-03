import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePopup } from '../contexts/PopupContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { generateCode } from '../utils/captcha';
import { Search, CheckCircle } from 'lucide-react';

const SearchService: React.FC = () => {
  const { t, language } = useLanguage();
  const { showSuccess, showError, showWarning } = usePopup();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [customAccount, setCustomAccount] = useState('');
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const initialized = useRef(false);

  // Auto-fill user data
  useEffect(() => {
    if (user && !initialized.current) {
      setName(user.username);
      setPhone(user.phone_number);
      initialized.current = true;
    }
  }, [user]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [loading, setLoading] = useState(false);

  const accountOptions = [
    'Free Fire',
    'Mobile Legend',
    'Efootball',
    'FC Mobile',
    'PUBG',
    'Roblox',
    'Genshin Impact',
    'Clash of Clans',
    'Other'
  ];

  useEffect(() => {
    if (name && (account || customAccount)) {
      generateUniqueCode();
    }
  }, [name, account, customAccount]);

  const generateUniqueCode = async () => {
    try {
      const { data } = await supabase
        .from('search_services')
        .select('code');

      const existingCodes = data?.map(item => item.code) || [];
      const newCode = generateCode('JC', existingCodes);
      setCode(newCode);
    } catch (error) {
      console.error('Error generating code:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || (!account && !customAccount) || !phone || !priceMin || !priceMax || !specifications) {
      showWarning(
        language === 'id'
          ? 'Mohon lengkapi semua field yang wajib diisi'
          : 'Please fill in all required fields',
        language === 'id' ? 'Data Belum Lengkap' : 'Incomplete Data'
      );
      return;
    }

    const wordCount = specifications.trim().split(/\s+/).length;
    if (wordCount < 5) {
      showWarning(
        language === 'id'
          ? 'Spesifikasi minimal harus 5 kata'
          : 'Specifications must be at least 5 words',
        language === 'id' ? 'Spesifikasi Kurang' : 'Insufficient Specifications'
      );
      return;
    }

    const minPrice = parseInt(priceMin);
    const maxPrice = parseInt(priceMax);

    if (minPrice < 10000) {
      showWarning(
        language === 'id'
          ? 'Harga minimal Rp. 10.000'
          : 'Minimum price is Rp. 10,000',
        language === 'id' ? 'Harga Terlalu Rendah' : 'Price Too Low'
      );
      return;
    }

    if (maxPrice < minPrice) {
      showWarning(
        language === 'id'
          ? 'Harga maksimal harus lebih besar atau sama dengan harga minimal'
          : 'Maximum price must be greater than or equal to minimum price',
        language === 'id' ? 'Range Harga Salah' : 'Invalid Price Range'
      );
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('search_services').insert([
        {
          code,
          name,
          account: customAccount || account,
          phone,
          price_min: minPrice,
          price_max: maxPrice,
          specifications,
          status: 'pending',
          user_id: user?.id
        }
      ]);

      if (error) throw error;

      showSuccess(
        language === 'id'
          ? 'Pencarian berhasil dikirim! Menunggu validasi admin.'
          : 'Search submitted successfully! Awaiting admin validation.',
        language === 'id' ? 'Berhasil!' : 'Success!'
      );
      setName('');
      setAccount('');
      setCustomAccount('');
      setPhone('');
      setPriceMin('');
      setPriceMax('');
      setSpecifications('');
      setCode('');
    } catch (error) {
      console.error('Submission Error:', error);
      showError(
        language === 'id'
          ? 'Gagal mengirim pencarian. Silakan coba lagi.'
          : 'Failed to submit search. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const wordCount = specifications.trim() ? specifications.trim().split(/\s+/).length : 0;

  return (
    <div className="page-container p-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="section-title">{t('searchService')}</h1>
          <p className="text-slate-400">
            {language === 'id'
              ? 'Cari akun game yang Anda inginkan'
              : 'Search for game accounts you want'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-6">
          {/* Name */}
          <div>
            <label className="input-label">{t('name')} *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder={language === 'id' ? 'Masukkan nama Anda' : 'Enter your name'}
              required
            />
          </div>

          {/* Account */}
          <div>
            <label className="input-label">{t('account')} *</label>
            <select
              value={account}
              onChange={(e) => {
                setAccount(e.target.value);
                if (e.target.value !== 'Other') setCustomAccount('');
              }}
              className="input"
            >
              <option value="">
                {language === 'id' ? 'Pilih akun' : 'Select account'}
              </option>
              {accountOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {account === 'Other' && (
              <input
                type="text"
                value={customAccount}
                onChange={(e) => setCustomAccount(e.target.value)}
                placeholder={language === 'id' ? 'Masukkan nama akun' : 'Enter account name'}
                className="input mt-3"
              />
            )}
          </div>

          {/* Code */}
          <div>
            <label className="input-label">
              {t('code')} ({language === 'id' ? 'Otomatis' : 'Automatic'})
            </label>
            <input
              type="text"
              value={code}
              readOnly
              placeholder={language === 'id' ? 'Akan digenerate otomatis' : 'Will be auto-generated'}
              className="input bg-slate-900 text-cyan-400 font-mono font-bold"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="input-label">{t('phoneNumber')} *</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08123456789"
              className="input"
              required
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="input-label">{t('priceRange')} (Rp) *</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                min="10000"
                placeholder={language === 'id' ? 'Harga Min' : 'Min Price'}
                className="input"
                required
              />
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                min={priceMin || '10000'}
                placeholder={language === 'id' ? 'Harga Max' : 'Max Price'}
                className="input"
                required
              />
            </div>
          </div>

          {/* Specifications */}
          <div>
            <label className="input-label">
              {t('specifications')} * ({t('minWords')})
            </label>
            <textarea
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
              rows={4}
              placeholder={
                language === 'id'
                  ? 'Jelaskan spesifikasi akun yang Anda cari (minimal 5 kata)'
                  : 'Describe the account specifications you are looking for (minimum 5 words)'
              }
              className="input resize-none"
              required
            />
            <div className="flex justify-between mt-2">
              <p className={`text-sm ${wordCount >= 5 ? 'text-emerald-400' : 'text-slate-400'}`}>
                {language === 'id' ? 'Jumlah kata' : 'Word count'}: {wordCount}
              </p>
              {wordCount >= 5 && (
                <span className="text-emerald-400 text-sm flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>{language === 'id' ? 'Cukup' : 'Sufficient'}</span>
                </span>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Loading...' : t('submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchService;