import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Search, 
  Eye, 
  Truck, 
  CheckCircle, 
  XCircle, 
  CreditCard, 
  Banknote,
  Clock,
  ChevronRight,
  Loader2,
  Trash2,
  Edit,
  X,
  Phone,
  MapPin
} from 'lucide-react';
import { AdminOrderDetailsModal } from './AdminOrderDetailsModal';

interface Order {
  id: string;
  user_id: string;
  items: any[];
  total_amount: number;
  phone: string;
  address: string;
  payment_method: 'vnpay' | 'cod';
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  seller_note?: string;
  buyerInfo?: {
    full_name: string;
    avatar_url: string;
  };
}

interface AdminOrdersTabProps {
  orders: Order[];
  loading: boolean;
  actionLoading: string | null;
  handleUpdateOrderStatus: (id: string, status: string) => void;
  handleUpdateOrderDetails: (id: string, details: { phone: string, address: string, status: string }) => void;
  handleDeleteOrder: (id: string) => void;
  formatDate: (date: string) => string;
  getInitials: (name?: string) => string;
}

export const AdminOrdersTab = ({ 
  orders, 
  loading, 
  actionLoading, 
  handleUpdateOrderStatus,
  handleUpdateOrderDetails,
  handleDeleteOrder,
  formatDate,
  getInitials
}: AdminOrdersTabProps) => {

  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editForm, setEditForm] = useState({ phone: '', address: '', status: '' });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'shipping': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'cancelled':
      case 'failed': return 'bg-rose-100 text-rose-600 border-rose-200';
      case 'confirmed': return 'bg-purple-100 text-purple-600 border-purple-200';
      default: return 'bg-orange-100 text-orange-600 border-orange-200';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      shipping: 'Đang giao',
      delivered: 'Đã giao',
      completed: 'Hoàn tất',
      failed: 'Lỗi/Thất bại',
      cancelled: 'Đã hủy'
    };
    return labels[status] || status;
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
    completed: orders.filter(o => o.status === 'completed' || o.status === 'delivered').length,
    failed: orders.filter(o => o.status === 'cancelled' || o.status === 'failed').length
  };

  const [activeTab, setActiveTab] = React.useState('all');

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return o.status === 'pending' || o.status === 'confirmed';
    if (activeTab === 'completed') return o.status === 'completed' || o.status === 'delivered';
    if (activeTab === 'failed') return o.status === 'cancelled' || o.status === 'failed';
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col w-full h-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="text-primary w-8 h-8" />
            Quản lý Đơn hàng
          </h2>
          <p className="text-slate-500 mt-1">Theo dõi giao dịch và trạng thái vận chuyển hàng hóa.</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 shrink-0">
        <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${activeTab === 'all' ? 'border-primary ring-1 ring-primary' : 'border-slate-200'}`}
             onClick={() => setActiveTab('all')}>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Tổng đơn hàng</p>
            <p className="text-2xl font-black text-slate-900">{loading ? '-' : stats.total}</p>
          </div>
        </div>
        
        <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${activeTab === 'pending' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200'}`}
             onClick={() => setActiveTab('pending')}>
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Chờ xử lý</p>
            <p className="text-2xl font-black text-slate-900">{loading ? '-' : stats.pending}</p>
          </div>
        </div>

        <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${activeTab === 'completed' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200'}`}
             onClick={() => setActiveTab('completed')}>
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Thành công</p>
            <p className="text-2xl font-black text-slate-900">{loading ? '-' : stats.completed}</p>
          </div>
        </div>

        <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${activeTab === 'failed' ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200'}`}
             onClick={() => setActiveTab('failed')}>
          <div className="p-3 bg-rose-100 text-rose-600 rounded-lg">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Đã hủy/Lỗi</p>
            <p className="text-2xl font-black text-slate-900">{loading ? '-' : stats.failed}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex-1 flex flex-col min-h-0">
        <div className="flex border-b border-slate-200 px-6 shrink-0 bg-slate-50/50">
          {['all', 'pending', 'completed', 'failed'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-6 border-b-2 font-black text-sm whitespace-nowrap uppercase transition-all ${
                activeTab === tab 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 font-bold'
              }`}
            >
              {tab === 'all' ? 'Tất cả đơn' : tab === 'pending' ? 'Đang xử lý' : tab === 'completed' ? 'Thành công' : 'Đã hủy'}
            </button>
          ))}
        </div>

        <div className="overflow-auto flex-1">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-slate-500 font-black uppercase text-xs">Đang tải dữ liệu...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Package className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-black uppercase text-xs">Không tìm thấy đơn hàng nào.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 sticky top-0 z-10 text-slate-500 text-xs font-black uppercase tracking-wider">
                  <th className="px-6 py-4">Đơn hàng</th>
                  <th className="px-6 py-4">Người mua</th>
                  <th className="px-6 py-4">Thanh toán</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Tổng tiền</th>
                  <th className="px-4 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-black text-slate-900 uppercase">#{order.id.substring(0,8)}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                          <Clock className="w-3 h-3" />
                          {formatDate(order.created_at)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                          {order.buyerInfo?.avatar_url ? (
                            <img src={order.buyerInfo.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                          ) : (
                            getInitials(order.buyerInfo?.full_name)
                          )}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-bold text-slate-900">{order.buyerInfo?.full_name || 'Khách vãng lai'}</p>
                          <p className="text-xs text-slate-400">{order.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        {order.payment_method === 'vnpay' ? (
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-black uppercase tracking-wider border border-blue-100">
                            <CreditCard className="w-3 h-3" />
                            VNPay
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-slate-600 rounded text-[10px] font-black uppercase tracking-wider border border-slate-200">
                            <Banknote className="w-3 h-3" />
                            COD
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-sm font-black text-slate-900">
                        {order.total_amount.toLocaleString('vi-VN')}đ
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{order.items?.length || 0} sản phẩm</p>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => handleUpdateOrderStatus(order.id, 'remind')}
                            disabled={actionLoading === order.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-bold transition-all"
                            title="Nhắc nhở người bán xử lý đơn"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            Nhắc
                          </button>
                        )}
                        <button 
                          onClick={() => { 
                            setEditingOrder(order); 
                            setEditForm({ phone: order.phone, address: order.address, status: order.status }); 
                          }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Sửa thông tin đơn hàng"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setViewingOrder(order as any)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                          title="Xem chi tiết đơn hàng"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          disabled={actionLoading === order.id}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Xóa đơn hàng"
                        >
                          {actionLoading === order.id 
                            ? <Loader2 className="w-4 h-4 animate-spin" /> 
                            : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {viewingOrder && (
        <AdminOrderDetailsModal 
          order={viewingOrder} 
          onClose={() => setViewingOrder(null)} 
          formatDate={formatDate}
          getStatusStyle={getStatusStyle}
          getStatusLabel={getStatusLabel}
        />
      )}

      {/* MODAL SỬA THÔNG TIN ĐƠN HÀNG */}
      <AnimatePresence>
        {editingOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-900">Chỉnh sửa đơn hàng</h3>
                <button onClick={() => setEditingOrder(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Số điện thoại</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        value={editForm.phone}
                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Địa chỉ giao hàng</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                      <textarea 
                        value={editForm.address}
                        onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all min-h-[80px] resize-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Trạng thái đơn hàng</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={editForm.status}
                        onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all appearance-none"
                      >
                        <option value="pending">Chờ xác nhận</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="shipping">Đang giao</option>
                        <option value="delivered">Đã giao</option>
                        <option value="completed">Hoàn tất</option>
                        <option value="cancelled">Đã hủy</option>
                        <option value="failed">Lỗi/Thất bại</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 flex justify-end gap-3">
                <button onClick={() => setEditingOrder(null)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-sans">Hủy bỏ</button>
                <button
                  onClick={() => {
                    handleUpdateOrderDetails(editingOrder.id, editForm);
                    setEditingOrder(null);
                  }}
                  disabled={actionLoading === editingOrder.id}
                  className="px-6 py-2.5 text-sm font-black bg-primary text-white hover:bg-primary-hover rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2"
                >
                  {actionLoading === editingOrder.id && <Loader2 className="w-4 h-4 animate-spin" />}
                  LƯU THAY ĐỔI
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
