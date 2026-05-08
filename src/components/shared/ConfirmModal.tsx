import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, HelpCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

type ModalType = 'danger' | 'warning' | 'info' | 'success';

interface ConfirmModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ModalType;
  loading?: boolean;
}

export const ConfirmModal = ({ 
  show, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'info',
  loading 
}: ConfirmModalProps) => {
  
  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-red-50',
          icon: 'text-red-500',
          btn: 'bg-red-500 hover:bg-red-600 shadow-red-100',
          ping: 'bg-red-400/20'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50',
          icon: 'text-amber-500',
          btn: 'bg-amber-500 hover:bg-amber-600 shadow-amber-100',
          ping: 'bg-amber-400/20'
        };
      case 'success':
        return {
          bg: 'bg-emerald-50',
          icon: 'text-emerald-500',
          btn: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100',
          ping: 'bg-emerald-400/20'
        };
      default:
        return {
          bg: 'bg-blue-50',
          icon: 'text-blue-500',
          btn: 'bg-primary hover:bg-primary-hover shadow-primary/20',
          ping: 'bg-blue-400/20'
        };
    }
  };

  const colors = getColors();

  const getIcon = () => {
    switch (type) {
      case 'danger': return <AlertCircle className="w-12 h-12 relative z-10" />;
      case 'warning': return <AlertTriangle className="w-12 h-12 relative z-10" />;
      case 'success': return <CheckCircle2 className="w-12 h-12 relative z-10" />;
      default: return <HelpCircle className="w-12 h-12 relative z-10" />;
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8 text-center">
              <div className={`w-24 h-24 ${colors.bg} rounded-full flex items-center justify-center ${colors.icon} mx-auto mb-6 relative`}>
                <div className={`absolute inset-0 ${colors.ping} rounded-full animate-ping`}></div>
                {getIcon()}
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-3 font-display">{title}</h3>
              <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed whitespace-pre-line">
                {message}
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
                  disabled={loading}
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white ${colors.btn} transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
