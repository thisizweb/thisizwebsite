import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { generateCode } from '../utils/captcha';
import { compressImage } from '../utils/imageCompressor';
import { Upload, X } from 'lucide-react';

const PostingService: React.FC = () => {
  const { t, language } = useLanguage();
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [customAccount, setCustomAccount] = useState('');
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const [price, setPrice] = useState('');
  const [statusType, setStatusType] = useState<'secure' | 'less_secure'>('secure');
  const [images, setImages] = useState<string[]>([]);
  const [additionalSpecs, setAdditionalSpecs] = useState('');
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
        .from('posting_services')
        .select('code');

      const existingCodes = data?.map(item => item.code) || [];
      const newCode = generateCode('JP', existingCodes);
      setCode(newCode);
    } catch (error) {
      console.error('Error generating code:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      setMessage(
        language === 'id'
          ? 'Maksimal 5 gambar'
          : 'Maximum 5 images'
      );
      return;
    }

    setLoading(true);
    try {
      const compressedImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const compressed = await compressImage(files[i], 100);
        compressedImages.push(compressed);
      }
      setImages([...images, ...compressedImages]);
    } catch (error) {
      setMessage(
        language === 'id'
          ? 'Gagal mengupload gambar'
          : 'Failed to upload images'
      );
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!name || (!account && !customAccount) || !phone || !price) {
      setMessage(
        language === 'id'
          ? 'Mohon lengkapi semua field yang wajib'
          : 'Please fill in all required fields'
      );
      return;
    }

    const priceNum = parseInt(price);
    if (priceNum < 10000) {
      setMessage(
        language === 'id'
          ? 'Harga minimal Rp. 10.000'
          : 'Minimum price is Rp. 10,000'
      );
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('posting_services').insert([
        {
          code,
          name,
          account: customAccount || account,
          phone,
          price: priceNum,
          status_type: statusType,
          images,
          additional_specs: additionalSpecs,
          status: 'pending'
        }
      ]);

      if (error) throw error;

      setMessage(t('submittedSuccess') + ' ' + t('awaitingValidation'));
      setName('');
      setAccount('');
      setCustomAccount('');
      setPhone('');
      setPrice('');
      setImages([]);
      setAdditionalSpecs('');
      setCode('');
    } catch (error) {
      setMessage(
        language === 'id'
          ? 'Gagal mengirim posting'
          : 'Failed to submit posting'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          {t('postingService')}
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
              {t('price')} (Rp) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="10000"
              placeholder="10000"
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              {t('accountStatus')} *
            </label>
            <div className="space-y-2">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="secure"
                  checked={statusType === 'secure'}
                  onChange={(e) => setStatusType(e.target.value as 'secure')}
                  className="mt-1"
                />
                <span className="text-gray-300">{t('secureData')}</span>
              </label>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="less_secure"
                  checked={statusType === 'less_secure'}
                  onChange={(e) => setStatusType(e.target.value as 'less_secure')}
                  className="mt-1"
                />
                <span className="text-gray-300">{t('lessSecureData')}</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              {t('uploadImages')} ({t('maxImages')})
            </label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={images.length >= 5}
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer flex flex-col items-center ${
                  images.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-gray-400">
                  {language === 'id'
                    ? 'Klik untuk upload gambar'
                    : 'Click to upload images'}
                </span>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              {t('additionalSpecs')}
            </label>
            <textarea
              value={additionalSpecs}
              onChange={(e) => setAdditionalSpecs(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-700 text-white"
            />
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

export default PostingService;