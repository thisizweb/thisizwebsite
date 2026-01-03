import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

// Popup types
export type PopupType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export interface PopupConfig {
    type: PopupType;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    autoClose?: boolean;
    duration?: number;
}

interface PopupContextType {
    showPopup: (config: PopupConfig) => void;
    hidePopup: () => void;
    showSuccess: (message: string, title?: string) => void;
    showError: (message: string, title?: string) => void;
    showWarning: (message: string, title?: string) => void;
    showInfo: (message: string, title?: string) => void;
    showConfirm: (message: string, onConfirm: () => void, title?: string) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const usePopup = () => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error('usePopup must be used within a PopupProvider');
    }
    return context;
};

// Popup Component
const Popup: React.FC<{ config: PopupConfig | null; onClose: () => void }> = ({ config, onClose }) => {
    if (!config) return null;

    const icons = {
        success: <CheckCircle className="w-12 h-12 text-emerald-400" />,
        error: <AlertCircle className="w-12 h-12 text-red-400" />,
        warning: <AlertTriangle className="w-12 h-12 text-amber-400" />,
        info: <Info className="w-12 h-12 text-cyan-400" />,
        confirm: <AlertTriangle className="w-12 h-12 text-amber-400" />,
    };

    const bgColors = {
        success: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
        error: 'from-red-500/20 to-red-600/10 border-red-500/30',
        warning: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
        info: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
        confirm: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
    };

    const handleConfirm = () => {
        config.onConfirm?.();
        onClose();
    };

    const handleCancel = () => {
        config.onCancel?.();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn"
                onClick={config.type !== 'confirm' ? onClose : undefined}
            />

            {/* Popup Card */}
            <div className={`relative w-full max-w-md bg-gradient-to-b ${bgColors[config.type]} bg-slate-800/95 border rounded-2xl shadow-2xl animate-popupIn`}>
                {/* Close button for non-confirm popups */}
                {config.type !== 'confirm' && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                {/* Content */}
                <div className="p-6 text-center">
                    {/* Icon with pulse animation */}
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-slate-800/80 animate-pulse-once">
                            {icons[config.type]}
                        </div>
                    </div>

                    {/* Title */}
                    {config.title && (
                        <h3 className="text-xl font-bold text-white mb-2">
                            {config.title}
                        </h3>
                    )}

                    {/* Message */}
                    <p className="text-slate-300 text-base leading-relaxed mb-6">
                        {config.message}
                    </p>

                    {/* Buttons */}
                    <div className={`flex gap-3 ${config.type === 'confirm' ? 'justify-center' : 'justify-center'}`}>
                        {config.type === 'confirm' ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all hover:scale-105"
                                >
                                    {config.cancelText || 'Cancel'}
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl transition-all hover:scale-105 shadow-lg shadow-red-500/25"
                                >
                                    {config.confirmText || 'Confirm'}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onClose}
                                className={`px-8 py-2.5 font-medium rounded-xl transition-all hover:scale-105 shadow-lg ${config.type === 'success'
                                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/25'
                                        : config.type === 'error'
                                            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/25'
                                            : config.type === 'warning'
                                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-500/25'
                                                : 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-cyan-500/25'
                                    } text-white`}
                            >
                                OK
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Provider Component
export const PopupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [popupConfig, setPopupConfig] = useState<PopupConfig | null>(null);

    const showPopup = useCallback((config: PopupConfig) => {
        setPopupConfig(config);

        // Auto close for non-confirm popups
        if (config.autoClose !== false && config.type !== 'confirm') {
            const duration = config.duration || 3000;
            setTimeout(() => {
                setPopupConfig(null);
            }, duration);
        }
    }, []);

    const hidePopup = useCallback(() => {
        setPopupConfig(null);
    }, []);

    const showSuccess = useCallback((message: string, title?: string) => {
        showPopup({ type: 'success', message, title: title || 'Success!', autoClose: true });
    }, [showPopup]);

    const showError = useCallback((message: string, title?: string) => {
        showPopup({ type: 'error', message, title: title || 'Error', autoClose: false });
    }, [showPopup]);

    const showWarning = useCallback((message: string, title?: string) => {
        showPopup({ type: 'warning', message, title: title || 'Warning', autoClose: false });
    }, [showPopup]);

    const showInfo = useCallback((message: string, title?: string) => {
        showPopup({ type: 'info', message, title: title || 'Info', autoClose: true });
    }, [showPopup]);

    const showConfirm = useCallback((message: string, onConfirm: () => void, title?: string) => {
        showPopup({
            type: 'confirm',
            message,
            title: title || 'Confirm Action',
            onConfirm,
            autoClose: false
        });
    }, [showPopup]);

    return (
        <PopupContext.Provider value={{ showPopup, hidePopup, showSuccess, showError, showWarning, showInfo, showConfirm }}>
            {children}
            <Popup config={popupConfig} onClose={hidePopup} />
        </PopupContext.Provider>
    );
};

export default PopupContext;
