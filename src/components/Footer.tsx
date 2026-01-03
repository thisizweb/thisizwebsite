import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Instagram, MessageCircle, Heart, Mail, Users, Send, ShieldCheck, Star } from 'lucide-react';
import storeLogo from '../assets/logo-store.png';
import { Link, useLocation } from 'react-router-dom';
import { usePopup } from '../contexts/PopupContext';

const Footer: React.FC = () => {
    const { language } = useLanguage();
    const { pathname } = useLocation();
    const { showSuccess } = usePopup();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const inactiveLink = "text-slate-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2";
    const sectionTitle = "text-white font-bold text-base mb-4 relative inline-block";

    return (
        <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
                {/* Changed grid-cols-6 to 12 for finer control. Adjusted gap for desktop. */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 mb-10">

                    {/* Brand Section (3 columns / 12) */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-3">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-slate-700 p-0.5 shadow-lg shadow-cyan-500/10">
                                <img
                                    src={storeLogo}
                                    alt="THIS IZ STORE"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div>
                                <span className="text-xl font-display font-bold text-white tracking-tight block">THIS IZ STORE</span>
                                <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500 to-transparent rounded-full" />
                            </div>
                        </div>
                        {/* Description wrapped nicely */}
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-[260px]">
                            {language === 'id'
                                ? 'Platform jual beli akun game terpercaya dengan sistem keamanan terjamin dan transaksi yang transparan.'
                                : 'Trusted game account marketplace with guaranteed security and transparent transactions.'}
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => window.open('https://instagram.com', '_blank')}
                                className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-pink-500 hover:bg-slate-700 transition-all duration-300 border border-slate-700"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => window.open('https://tiktok.com', '_blank')}
                                className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-black transition-all duration-300 border border-slate-700"
                                aria-label="TikTok"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Quick Links (2 col) */}
                    <div className="lg:col-span-2">
                        <h3 className={sectionTitle}>
                            {language === 'id' ? 'Menu' : 'Menu'}
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-cyan-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-2">
                            <li><Link to="/home" className={inactiveLink}>{language === 'id' ? 'Beranda' : 'Home'}</Link></li>
                            <li><Link to="/market" className={inactiveLink}>Market</Link></li>
                            <li><Link to="/posting-service" className={inactiveLink}>{language === 'id' ? 'Jual Akun' : 'Sell Account'}</Link></li>
                            <li><Link to="/search-service" className={inactiveLink}>{language === 'id' ? 'Cari Akun' : 'Search Account'}</Link></li>
                        </ul>
                    </div>

                    {/* Community (2 col) */}
                    <div className="lg:col-span-2">
                        <h3 className={sectionTitle}>
                            {language === 'id' ? 'Komunitas' : 'Community'}
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-cyan-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="https://chat.whatsapp.com/D8TMBNlLT09KXWCWJM3lkw" target="_blank" rel="noopener noreferrer" className={inactiveLink}>
                                    <Users className="w-4 h-4 text-emerald-400" />
                                    <span>Grup WA</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://t.me/xxx" target="_blank" rel="noopener noreferrer" className={inactiveLink}>
                                    <Send className="w-4 h-4 text-sky-400" />
                                    <span>Telegram</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Testimonials (2 col) */}
                    <div className="lg:col-span-2">
                        <h3 className={sectionTitle}>
                            {language === 'id' ? 'Testimoni' : 'Testimonials'}
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-cyan-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="https://www.instagram.com/p/CiB4xHOuNkr/?igsh=eGZpbzkxM2Fnc3c3" target="_blank" rel="noopener noreferrer" className={inactiveLink}>
                                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                                    <span>{language === 'id' ? 'Keamanan' : 'Security'}</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.instagram.com/reel/ClIBjbZuNL7/?igsh=MXJ6Nm9zYnB1ZTN6Mw==" target="_blank" rel="noopener noreferrer" className={inactiveLink}>
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span>{language === 'id' ? 'Rekomendasi' : 'Reviews'}</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact (3 col - Increased space for Email) */}
                    <div className="lg:col-span-3">
                        <h3 className={sectionTitle}>
                            {language === 'id' ? 'Kontak' : 'Contact'}
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-cyan-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3 text-slate-400 text-sm">
                                <MessageCircle className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="block text-white font-medium">WhatsApp</span>
                                    <a href="https://wa.me/6283136224221" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                                        +62 831-3622-4221
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start space-x-3 text-slate-400 text-sm">
                                <Mail className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="block text-white font-medium">Email</span>
                                    {/* Removed break-all to prevent ugpy breaks. Width is now sufficient. */}
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText('thisizstore@gmail.com');
                                            showSuccess(
                                                language === 'id' ? 'Email berhasil disalin!' : 'Email copied successfully!',
                                                language === 'id' ? 'Disalin' : 'Copied'
                                            );
                                        }}
                                        className="hover:text-cyan-400 transition-colors text-left"
                                    >
                                        thisizstore@gmail.com
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                    <p className="mb-2 md:mb-0">
                        &copy; 2026 THIS IZ STORE. All Rights Reserved.
                    </p>
                    <div className="flex items-center space-x-1">
                        <span>Made</span>
                        <span>for Gamers</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
