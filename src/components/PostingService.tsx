import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePopup } from '../contexts/PopupContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { generateCode } from '../utils/captcha';
import { compressImage, compressImageToBlob } from '../utils/imageCompressor';
import { Upload, X, FileText } from 'lucide-react';

const PostingService: React.FC = () => {
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
  const [price, setPrice] = useState('');
  const [statusType, setStatusType] = useState<'secure' | 'less_secure'>('secure');
  const [images, setImages] = useState<string[]>([]);
  const [imageBlobs, setImageBlobs] = useState<Blob[]>([]);
  const [additionalSpecs, setAdditionalSpecs] = useState('');
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
      showWarning(
        language === 'id'
          ? 'Maksimal 5 gambar yang dapat diupload'
          : 'Maximum 5 images can be uploaded',
        language === 'id' ? 'Batas Gambar' : 'Image Limit'
      );
      return;
    }

    setLoading(true);
    setLoading(true);
    try {
      const compressedPreviews: string[] = [];
      const compressedBlobs: Blob[] = [];

      for (let i = 0; i < files.length; i++) {
        // Create preview
        const preview = await compressImage(files[i], 100);
        compressedPreviews.push(preview);

        // Create blob for upload
        const blob = await compressImageToBlob(files[i], 100);
        compressedBlobs.push(blob);
      }

      setImages([...images, ...compressedPreviews]);
      setImageBlobs([...imageBlobs, ...compressedBlobs]);
    } catch (error) {
      showError(
        language === 'id'
          ? 'Gagal mengupload gambar. Silakan coba lagi.'
          : 'Failed to upload images. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImageBlobs(imageBlobs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || (!account && !customAccount) || !phone || !price) {
      showWarning(
        language === 'id'
          ? 'Mohon lengkapi semua field yang wajib diisi'
          : 'Please fill in all required fields',
        language === 'id' ? 'Data Belum Lengkap' : 'Incomplete Data'
      );
      return;
    }

    if (images.length === 0) {
      showWarning(
        language === 'id'
          ? 'Mohon upload minimal 1 gambar'
          : 'Please upload at least 1 image',
        language === 'id' ? 'Gambar Wajib' : 'Image Required'
      );
      return;
    }

    const priceNum = parseInt(price);
    if (priceNum < 10000) {
      showWarning(
        language === 'id'
          ? 'Harga minimal Rp. 10.000'
          : 'Minimum price is Rp. 10,000',
        language === 'id' ? 'Harga Terlalu Rendah' : 'Price Too Low'
      );
      return;
    }

    setLoading(true);
    try {
      // 1. Upload images to Supabase Storage
      const uploadedUrls: string[] = [];

      for (const blob of imageBlobs) {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
        const { error: uploadError } = await supabase.storage
          .from('acc-images')
          .upload(fileName, blob, {
            contentType: blob.type
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('acc-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      // 2. Insert data with public URLs
      const { error } = await supabase.from('posting_services').insert([
        {
          code,
          name,
          account: customAccount || account,
          phone,
          price: priceNum,
          status_type: statusType,
          images: uploadedUrls,
          additional_specs: additionalSpecs,
          status: 'pending',
          user_id: user?.id
        }
      ]);

      if (error) throw error;

      showSuccess(
        language === 'id'
          ? 'Posting berhasil dikirim! Menunggu validasi admin.'
          : 'Posting submitted successfully! Awaiting admin validation.',
        language === 'id' ? 'Berhasil!' : 'Success!'
      );
      setName('');
      setAccount('');
      setCustomAccount('');
      setPhone('');
      setPrice('');
      setImages([]);
      setImageBlobs([]);
      setAdditionalSpecs('');
      setCode('');
    } catch (error) {
      console.error('Submission Error:', error);
      showError(
        language === 'id'
          ? 'Gagal mengirim posting. Silakan coba lagi.'
          : 'Failed to submit posting. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container p-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="section-title">{t('postingService')}</h1>
          <p className="text-slate-400">
            {language === 'id'
              ? 'Posting akun game Anda untuk dijual'
              : 'Post your game account for sale'}
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
                  {option === 'Other' ? t('other') : option}
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

          {/* Price */}
          <div>
            <label className="input-label">{t('price')} (Rp) *</label>
            <input
              type="text"
              value={price.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
              onChange={(e) => {
                const value = e.target.value.replace(/\./g, "");
                if (!isNaN(Number(value))) {
                  setPrice(value);
                }
              }}
              placeholder="10.000"
              className="input"
              required
            />
          </div>

          {/* Account Status */}
          <div>
            <label className="input-label">{t('accountStatus')} *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label
                className={`flex items-start space-x-3 p-4 rounded-lg cursor-pointer border transition-all ${statusType === 'secure'
                  ? 'bg-emerald-500/10 border-emerald-500/50'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }`}
              >
                <input
                  type="radio"
                  value="secure"
                  checked={statusType === 'secure'}
                  onChange={(e) => setStatusType(e.target.value as 'secure')}
                  className="mt-1"
                />
                <span className={`text-sm ${statusType === 'secure' ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {t('secureData')}
                </span>
              </label>
              <label
                className={`flex items-start space-x-3 p-4 rounded-lg cursor-pointer border transition-all ${statusType === 'less_secure'
                  ? 'bg-amber-500/10 border-amber-500/50'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }`}
              >
                <input
                  type="radio"
                  value="less_secure"
                  checked={statusType === 'less_secure'}
                  onChange={(e) => setStatusType(e.target.value as 'less_secure')}
                  className="mt-1"
                />
                <span className={`text-sm ${statusType === 'less_secure' ? 'text-amber-400' : 'text-slate-300'}`}>
                  {t('lessSecureData')}
                </span>
              </label>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="input-label">
              {t('uploadImages')} ({t('maxImages')}) *
            </label>
            <div className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-colors">
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
                className={`cursor-pointer flex flex-col items-center ${images.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                <div className="p-3 rounded-full bg-slate-800 mb-3">
                  <Upload className="w-8 h-8 text-slate-400" />
                </div>
                <span className="text-slate-400 text-sm">
                  {language === 'id'
                    ? 'Klik untuk upload gambar'
                    : 'Click to upload images'}
                </span>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={img}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Specs */}
          <div>
            <label className="input-label">{t('additionalSpecs')}</label>
            <textarea
              value={additionalSpecs}
              onChange={(e) => setAdditionalSpecs(e.target.value)}
              rows={4}
              className="input resize-none"
              placeholder={language === 'id' ? 'Tambahkan spesifikasi tambahan (opsional)' : 'Add additional specifications (optional)'}
            />
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

export default PostingService;