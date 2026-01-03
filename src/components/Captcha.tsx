import React, { useState, useEffect } from 'react';
import { RefreshCw, Check, X } from 'lucide-react';
import { generateCaptcha } from '../utils/captcha';

interface CaptchaProps {
  onVerify: (valid: boolean) => void;
}

const Captcha: React.FC<CaptchaProps> = ({ onVerify }) => {
  const [captcha, setCaptcha] = useState('');
  const [input, setInput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setInput('');
    setIsValid(null);
    onVerify(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.length === captcha.length) {
      const valid = value === captcha;
      setIsValid(valid);
      onVerify(valid);
    } else {
      setIsValid(null);
      onVerify(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        {/* Captcha Display */}
        <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 font-mono text-lg tracking-widest text-center select-none">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-bold">
            {captcha}
          </span>
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={refreshCaptcha}
          className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all hover:border-cyan-500/50 group"
          title="Refresh Captcha"
        >
          <RefreshCw className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
        </button>
      </div>

      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter captcha"
          className={`input pr-10 ${isValid === true
              ? 'border-emerald-500 focus:ring-emerald-500/50'
              : isValid === false
                ? 'border-red-500 focus:ring-red-500/50'
                : ''
            }`}
          maxLength={6}
        />

        {/* Validation Icon */}
        {isValid !== null && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid ? (
              <Check className="w-5 h-5 text-emerald-500" />
            ) : (
              <X className="w-5 h-5 text-red-500" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Captcha;