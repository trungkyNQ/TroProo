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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto w-full h-full">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-3xl w-full flex flex-col shadow-2xl relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 rounded-t-3xl bg-slate-50/50 relative">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <span className="text-slate-900">Chi tiết đơn hàng</span>
            <span className="px-2.5 py-1 text-sm font-black uppercase tracking-widest text-slate-500 bg-slate-200/50 rounded-lg">
              #{order.id.split('-')[0]}
            </span>
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors absolute right-4 top-1/2 -translate-y-1/2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[70vh]">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* THÔNG TIN KHÁCH HÀNG */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-4">
               <h3 className="text-sm font-black uppercase text-slate-500 tracking-wider flex items-center gap-2 mb-2">
                 <User className="w-4 h-4 text-primary" /> Thông tin Khách hàng
               </h3>
               
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                    {order.buyerInfo?.avatar_url ? (
                      <img src={order.buyerInfo.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{order.buyerInfo?.full_name || 'Khách vãng lai'}</h4>
                    <p className="text-slate-500 text-sm mt-1">ID: {order.user_id.substring(0,8)}</p>
                  </div>
               </div>

               <div className="flex items-center gap-3 mt-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                     <Phone className="w-4 h-4 text-orange-600" />
                  </div>
                  <p className="text-slate-700 font-medium">{order.phone}</p>
               </div>

               <div className="flex items-start gap-3 mt-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1">
                     <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed">{order.address}</p>
               </div>
            </div>

            {/* THÔNG TIN THANH TOÁN */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-5">
               <h3 className="text-sm font-black uppercase text-slate-500 tracking-wider flex items-center gap-2 mb-2">
                 <CreditCard className="w-4 h-4 text-primary" /> Thông tin Thanh toán
               </h3>

               <div className="flex items-center justify-between">
                 <span className="text-slate-500 font-medium flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400"/> Ngày đặt hàng</span>
                 <span className="font-bold text-slate-900 text-sm">{formatDate(order.created_at)}</span>
               </div>

               <div className="flex items-center justify-between">
                 <span className="text-slate-500 font-medium flex items-center gap-2"><CreditCard className="w-4 h-4 text-slate-400"/> Hình thức</span>
                 {order.payment_method === 'vnpay' ? (
                   <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg text-xs uppercase tracking-widest border border-blue-100 flex items-center gap-1.5">
                     <CreditCard className="w-3 h-3" /> VNPay
                   </span>
                 ) : (
                   <span className="font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg text-xs uppercase tracking-widest border border-slate-200 flex items-center gap-1.5">
                     <Banknote className="w-3 h-3" /> Tiền mặt (COD)
                   </span>
                 )}
               </div>

               <div className="flex items-center justify-between">
                 <span className="text-slate-500 font-medium flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400"/> Trạng thái</span>
                 <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                   {getStatusLabel(order.status)}
                 </span>
               </div>
            </div>
          </div>

          {/* DANH SÁCH MẶT HÀNG */}
          <div>
            <h3 className="text-sm font-black uppercase text-slate-500 tracking-wider flex items-center gap-2 mb-4 px-2">
               <Package className="w-4 h-4 text-primary" /> Danh sách Mặt hàng ({order.items?.length || 0})
            </h3>
            
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                     <tr>
                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Sản phẩm</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider text-center">Số lượng</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Thành tiền</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {order.items?.map((item: any, index: number) => (
                        <tr key={item.id || index} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                 <div className="w-16 h-16 rounded-xl border border-slate-200 bg-white overflow-hidden shrink-0">
                                    <img src={item.image_url || 'https://via.placeholder.com/150'} alt={item.title} className="w-full h-full object-cover" />
                                 </div>
                                 <p className="font-bold text-slate-900 text-sm md:text-base line-clamp-2">{item.title}</p>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold">
                                {item.quantity || 1}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <p className="font-bold text-slate-900 text-sm md:text-base">
                                 {(Number(item.price) * parseInt(item.quantity || '1')).toLocaleString('vi-VN')} đ
                              </p>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            {/* TỔNG TIỀN */}
            <div className="mt-6 flex flex-col items-end gap-3 px-2">
               <div className="flex justify-between w-full md:w-1/2 text-slate-500 font-medium">
                  <span>Tổng tiền hàng:</span>
                  <span className="font-bold">{order.total_amount.toLocaleString('vi-VN')} đ</span>
               </div>
               <div className="flex justify-between w-full md:w-1/2 text-slate-500 font-medium">
                  <span>Phí vận chuyển:</span>
                  <span className="font-bold text-emerald-500">Trao đổi riêng</span>
               </div>
               <div className="w-full md:w-1/2 h-px bg-slate-200 my-1"></div>
               <div className="flex justify-between w-full md:w-1/2 items-center">
                  <span className="text-slate-900 font-black">Tổng thanh toán:</span>
                  <span className="text-2xl md:text-3xl font-black text-rose-500 font-display">
                     {order.total_amount.toLocaleString('vi-VN')} đ
                  </span>
               </div>
            </div>
          </div>
          
        </div>
        
        {/* Footer actions */}
        <div className="p-6 border-t border-slate-100 flex justify-end">
           <button 
             onClick={onClose}
             className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
           >
             Đóng
           </button>
        </div>
      </motion.div>
    </div>
  );
};
