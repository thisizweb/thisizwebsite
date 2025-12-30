import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { generateCaptcha } from '../utils/captcha';

interface CaptchaProps {
  onVerify: (isValid: boolean) => void;
  reset?: boolean;
}

const Captcha: React.FC<CaptchaProps> = ({ onVerify, reset }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    refreshCaptcha();
  }, [reset]);

  const refreshCaptcha = () => {
    setCaptchaText(generateCaptcha());
    setUserInput('');
    onVerify(false);
  };

  const handleInputChange = (value: string) => {
    setUserInput(value);
    onVerify(value === captchaText);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-4 py-3 rounded-lg font-mono text-xl tracking-widest select-none border-2 border-gray-500 text-white">
          {captchaText}
        </div>
        <button
          type="button"
          onClick={refreshCaptcha}
          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          title="Refresh Captcha"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
      <input
        type="text"
        value={userInput}
        onChange={(e) => handleInputChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black"
        placeholder="Masukkan captcha / Enter captcha"
      />
    </div>
  );
};

export default Captcha;