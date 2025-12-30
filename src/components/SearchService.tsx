import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { generateCode } from '../utils/captcha';

const SearchService: React.FC = () => {
  const { t, language } = useLanguage();
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [customAccount, setCustomAccount] = useState('');
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const accountOptions = [
    'Free Fire',
    'Mobile Legend',
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
    setMessage('');

    if (!name || (!account && !customAccount) || !phone || !priceMin || !priceMax || !specifications) {
      setMessage(
        language === 'id'
          ? 'Mohon lengkapi semua field yang wajib'
          : 'Please fill in all required fields'
      );
      return;
    }

    const wordCount = specifications.trim().split(/\s+/).length;
    if (wordCount < 5) {
      setMessage(
        language === 'id'
          ? 'Spesifikasi minimal 5 kata'
          : 'Specifications minimum 5 words'
      );
      return;
    }

    const minPrice = parseInt(priceMin);
    const maxPrice = parseInt(priceMax);

    if (minPrice < 10000) {
      setMessage(
        language === 'id'
          ? 'Harga minimal Rp. 10.000'
          : 'Minimum price is Rp. 10,000'
      );
      return;
    }

    if (maxPrice < minPrice) {
      setMessage(
        language === 'id'
          ? 'Harga maksimal harus lebih besar atau sama dengan harga minimal'
          : 'Maximum price must be greater than or equal to minimum price'
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
          status: 'pending'
        }
      ]);

      if (error) throw error;

      setMessage(t('submittedSuccess') + ' ' + t('awaitingValidation'));
      setName('');
      setAccount('');
      setCustomAccount('');
      setPhone('');
      setPriceMin('');
      setPriceMax('');
      setSpecifications('');
      setCode('');
    } catch (error) {
      setMessage(
        language === 'id'
          ? 'Gagal mengirim pencarian'
          : 'Failed to submit search'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          {t('searchService')}
        </h1>

        {message && (
          <div
            className={`mb-4 px-4 py-3 rounded-lg ${
              message.includes('Berhasil') || message.includes('success')
                ? 'bg-green-500'
                : 'bg-red-500'
            } text-white`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              {t('name')} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              {t('account')} *
            </label>
            <select
              value={account}
              onChange={(e) => {
                setAccount(e.target.value);
                if (e.target.value !== 'Other') setCustomAccount('');
              }}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-700 text-white"
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
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-700 text-white mt-2"
              />
            )}
          </div>

          {code && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                {t('code')} ({language === 'id' ? 'Otomatis' : 'Automatic'})
              </label>
              <input
                type="text"
                value={code}
                readOnly
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-600 text-white font-bold"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              {t('phoneNumber')} *
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0812345678"
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              {t('priceRange')} (Rp) *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                min="10000"
                placeholder={language === 'id' ? 'Harga Min' : 'Min Price'}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-700 text-white"
                required
              />
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                min={priceMin || '10000'}
                placeholder={language === 'id' ? 'Harga Max' : 'Max Price'}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-700 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
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
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-700 text-white"
              required
            />
            <p className="text-sm text-gray-400 mt-1">
              {language === 'id' ? 'Jumlah kata' : 'Word count'}:{' '}
              {specifications.trim() ? specifications.trim().split(/\s+/).length : 0}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-3 px-4 rounded-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Loading...' : t('submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchService;