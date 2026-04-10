import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Receipt, Zap, Droplets, ShieldCheck, Home } from 'lucide-react';

interface InvoiceDetailModalProps {
  show: boolean;
  onClose: () => void;
  invoice: any;
  onPay?: () => void;
  loading?: boolean;
}

export const InvoiceDetailModal = ({ show, onClose, invoice, onPay, loading }: InvoiceDetailModalProps) => {
  if (!invoice) return null;

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
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
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 font-display">
                    Chi tiết hóa đơn
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-1">
                    {invoice.title} - {invoice.rooms?.title}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content & Breakdown */}
            <div className="px-8 py-6 overflow-y-auto flex-1 space-y-6">
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hạn thanh toán</span>
                  <span className="font-bold text-slate-700">
                    {new Date(invoice.due_date).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</span>
                  <span className={`font-black uppercase tracking-widest text-xs ${
                    invoice.status === 'paid' ? 'text-green-600' :
                    invoice.status === 'pending_verification' ? 'text-blue-600' : 'text-orange-600'
                  }`}>
                    {invoice.status === 'paid' ? 'Đã thanh toán' :
                     invoice.status === 'pending_verification' ? 'Chờ xác nhận' : 'Chưa thanh toán'}
                  </span>
                </div>
              </div>

              {/* Phí phòng cố định */}
              <div>
                <h4 className="text-sm font-black text-slate-900 font-display mb-4">Chi phí cố định</h4>
                <div className="space-y-3">
                   <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <Home className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-700">Tiền phòng</p>
                        </div>
                      </div>
                      <span className="font-black text-slate-900">{(invoice.rent_fee || 0).toLocaleString()} đ</span>
                   </div>

                   <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-700">Phí dịch vụ chung</p>
                        </div>
                      </div>
                      <span className="font-black text-slate-900">{(invoice.service_fee || 0).toLocaleString()} đ</span>
                   </div>
                </div>
              </div>

              {/* Điện */}
              <div>
                <h4 className="text-sm font-black text-slate-900 font-display mb-4">Mức tiêu thụ</h4>
                <div className="space-y-3">
                   <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-500 flex items-center justify-center">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-700">Tiền điện</p>
                          <p className="text-[10px] font-bold text-slate-400">Tiêu thụ: {invoice.electricity_usage || 0} kwh</p>
                        </div>
                      </div>
                      <span className="font-black text-slate-900">{(invoice.electricity_fee || 0).toLocaleString()} đ</span>
                   </div>

                   <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center">
                          <Droplets className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-700">Tiền nước</p>
                          <p className="text-[10px] font-bold text-slate-400">Tiêu thụ: {invoice.water_usage || 0} khối</p>
                        </div>
                      </div>
                      <span className="font-black text-slate-900">{(invoice.water_fee || 0).toLocaleString()} đ</span>
                   </div>
                </div>
              </div>

            </div>

            {/* Footer Summary */}
            <div className="p-6 border-t border-slate-100 bg-slate-900 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng thanh toán</p>
                <p className="text-3xl font-black text-white font-display">
                  {(invoice.amount || 0).toLocaleString()} <span className="text-xl text-slate-400">VNĐ</span>
                </p>
              </div>
              {invoice.status === 'unpaid' && onPay && (
                <button
                  onClick={onPay}
                  disabled={loading}
                  className="bg-primary hover:bg-primary-hover text-white font-black uppercase tracking-widest text-sm py-4 px-8 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Đã CK'}
                </button>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
