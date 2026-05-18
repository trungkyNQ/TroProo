import React from 'react';
import { motion } from 'motion/react';
import { X, User, MapPin, Phone, Package, CreditCard, Clock, Banknote, Calendar } from 'lucide-react';

interface Order {
  id: string;
  user_id: string;
  items: any[];
  total_amount: number;
  phone: string;
  address: string;
  payment_method: 'vnpay' | 'cod';
  status: string;
  created_at: string;
  buyerInfo?: {
    full_name: string;
    avatar_url: string;
  };
}

interface AdminOrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  formatDate: (date: string) => string;
  getStatusStyle: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export const AdminOrderDetailsModal = ({ order, onClose, formatDate, getStatusStyle, getStatusLabel }: AdminOrderDetailsModalProps) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto w-full h-full">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl max-w-3xl w-full flex flex-col shadow-2xl relative my-8 overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Decorative Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 px-8 py-7 text-white relative shrink-0">
          <div className="absolute top-0 right-0 w-48 h-full bg-white/5 rounded-full blur-xl pointer-events-none"></div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <span>Chi tiết đơn hàng</span>
            <span className="px-3 py-1 text-xs font-mono font-black uppercase tracking-wider text-indigo-200 bg-indigo-500/20 border border-indigo-400/20 rounded-xl">
              #{order.id.substring(0,8).toUpperCase()}
            </span>
          </h2>
          <p className="text-slate-300 text-xs font-bold mt-1 tracking-wider uppercase opacity-80">
            Hóa đơn giao dịch hệ thống Marketplace
          </p>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors absolute right-6 top-6"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[65vh] space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* BUYER INFORMATION CARD */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/60 flex flex-col gap-4 shadow-inner relative overflow-hidden">
               <div className="absolute top-0 right-0 w-16 h-16 bg-slate-200/20 rounded-full pointer-events-none -mr-4 -mt-4"></div>
               <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2 mb-1">
                 <User className="w-3.5 h-3.5 text-primary" /> Thông tin Người mua
               </h3>
               
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 shadow-sm">
                    {order.buyerInfo?.avatar_url ? (
                      <img src={order.buyerInfo.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-base leading-tight">{order.buyerInfo?.full_name || 'Khách vãng lai'}</h4>
                    <p className="text-slate-400 text-[10px] font-bold mt-1">Mã KH: {order.user_id.substring(0,8)}</p>
                  </div>
               </div>

               <div className="flex items-center gap-3 mt-1 bg-white px-3 py-2.5 rounded-xl border border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                     <Phone className="w-3.5 h-3.5 text-orange-500" />
                  </div>
                  <p className="text-slate-700 font-bold text-xs">{order.phone}</p>
               </div>

               <div className="flex items-start gap-3 mt-1 bg-white px-3 py-2.5 rounded-xl border border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                     <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <p className="text-slate-700 font-bold text-xs leading-relaxed">{order.address}</p>
               </div>
            </div>

            {/* BILLING & PAYMENT STATUS CARD */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/60 flex flex-col gap-4 shadow-inner relative overflow-hidden">
               <div className="absolute top-0 right-0 w-16 h-16 bg-slate-200/20 rounded-full pointer-events-none -mr-4 -mt-4"></div>
               <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2 mb-1">
                 <CreditCard className="w-3.5 h-3.5 text-primary" /> Chi tiết Thanh toán
               </h3>

               <div className="flex items-center justify-between py-2 border-b border-slate-200/50">
                 <span className="text-slate-500 font-bold text-xs flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400"/> Ngày tạo đơn</span>
                 <span className="font-black text-slate-900 text-xs">{formatDate(order.created_at)}</span>
               </div>

               <div className="flex items-center justify-between py-2 border-b border-slate-200/50">
                 <span className="text-slate-500 font-bold text-xs flex items-center gap-2"><CreditCard className="w-4 h-4 text-slate-400"/> Phương thức</span>
                 {order.payment_method === 'vnpay' ? (
                   <span className="font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg text-[10px] uppercase tracking-wider border border-blue-100 flex items-center gap-1">
                     <CreditCard className="w-3 h-3" /> VNPay Online
                   </span>
                 ) : (
                   <span className="font-black text-slate-600 bg-white px-2.5 py-0.5 rounded-lg text-[10px] uppercase tracking-wider border border-slate-200 flex items-center gap-1">
                     <Banknote className="w-3 h-3" /> COD Tiền mặt
                   </span>
                 )}
               </div>

               <div className="flex items-center justify-between py-2">
                 <span className="text-slate-500 font-bold text-xs flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400"/> Trạng thái</span>
                 <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                   {getStatusLabel(order.status)}
                 </span>
               </div>
            </div>
          </div>

          {/* ITEM BREAKDOWN */}
          <div>
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2 mb-4 px-2">
               <Package className="w-4 h-4 text-primary" /> Danh mục sản phẩm ({order.items?.length || 0})
            </h3>
            
            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200/80">
                     <tr className="text-slate-500 text-[10px] font-black uppercase tracking-wider">
                        <th className="px-6 py-4">Sản phẩm</th>
                        <th className="px-6 py-4 text-center">Số lượng</th>
                        <th className="px-6 py-4 text-right">Đơn giá sản phẩm</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {order.items?.map((item: any, index: number) => (
                        <tr key={item.id || index} className="hover:bg-slate-50/30 transition-colors group">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                 <div className="w-14 h-14 rounded-2xl border border-slate-200/80 bg-white overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                    <img src={item.image_url || 'https://via.placeholder.com/150'} alt={item.title} className="w-full h-full object-cover" />
                                 </div>
                                 <div>
                                   <p className="font-black text-slate-900 text-xs md:text-sm line-clamp-2">{item.title}</p>
                                   <p className="text-[10px] text-slate-400 mt-1 font-bold">Mã sản phẩm: #{item.id?.substring(0,8) || index}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200/30 shadow-inner">
                                {item.quantity || 1}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <p className="font-black text-slate-900 text-xs md:text-sm">
                                 {Number(item.price || 0).toLocaleString('vi-VN')} đ
                              </p>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            {/* BILLING CALCULATOR TOTAL */}
            <div className="mt-6 flex flex-col items-end gap-3 px-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-200/40">
               <div className="flex justify-between w-full md:w-1/2 text-slate-500 font-bold text-xs">
                  <span>Tổng tiền hàng:</span>
                  <span className="font-black text-slate-800">{order.total_amount.toLocaleString('vi-VN')} đ</span>
               </div>
               <div className="flex justify-between w-full md:w-1/2 text-slate-500 font-bold text-xs">
                  <span>Phí vận chuyển:</span>
                  <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] uppercase border border-emerald-100">Trao đổi riêng</span>
               </div>
               <div className="w-full md:w-1/2 h-px bg-slate-200/60 my-1"></div>
               <div className="flex justify-between w-full md:w-1/2 items-center">
                  <span className="text-slate-900 font-black text-sm uppercase tracking-wider">Tổng thanh toán:</span>
                  <span className="text-xl md:text-2xl font-black text-rose-500 font-display">
                     {order.total_amount.toLocaleString('vi-VN')} đ
                  </span>
               </div>
            </div>
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end shrink-0">
           <button 
             onClick={onClose}
             className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-sm"
           >
             Đóng cửa sổ
           </button>
        </div>
      </motion.div>
    </div>
  );
};
