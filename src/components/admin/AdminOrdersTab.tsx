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
  MapPin,
  FileText
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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'shipping': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'cancelled':
      case 'failed': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'confirmed': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-orange-50 text-orange-600 border-orange-100';
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

  // Search filtering
  const filteredOrders = orders.filter(o => {
    // 1. Tab filter
    if (activeTab === 'pending' && !(o.status === 'pending' || o.status === 'confirmed')) return false;
    if (activeTab === 'completed' && !(o.status === 'completed' || o.status === 'delivered')) return false;
    if (activeTab === 'failed' && !(o.status === 'cancelled' || o.status === 'failed')) return false;

    // 2. Search text filter
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const orderId = o.id.toLowerCase();
    const phone = o.phone.toLowerCase();
    const address = o.address.toLowerCase();
    const buyerName = o.buyerInfo?.full_name?.toLowerCase() || '';
    const payment = o.payment_method === 'vnpay' ? 'vnpay chuyển khoản' : 'cod tiền mặt';
    const statusText = getStatusLabel(o.status).toLowerCase();

    return orderId.includes(query) || 
           phone.includes(query) || 
           address.includes(query) || 
           buyerName.includes(query) ||
           payment.includes(query) ||
           statusText.includes(query);
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="flex flex-col w-full h-full pb-10"
    >
      {/* Header Section */}
      <div className="mb-8 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span className="bg-primary/10 text-primary p-2 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-primary/10">
              <Package className="w-7 h-7" />
            </span>
            Quản lý Đơn hàng
          </h2>
          <p className="text-slate-500 mt-1 font-medium">Giám sát các đơn giao dịch mua bán đồ cũ trên Marketplace toàn hệ thống.</p>
        </div>
      </div>

      {/* Stats Counter Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 shrink-0">
        
        {/* TOTAL ORDERS */}
        <div 
          className={`group bg-white p-6 rounded-3xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ${
            activeTab === 'all' ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200/80 hover:border-blue-300'
          }`}
          onClick={() => setActiveTab('all')}
        >
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Tổng đơn hàng</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{loading ? '-' : stats.total}</p>
          </div>
        </div>
        
        {/* PENDING ORDERS */}
        <div 
          className={`group bg-white p-6 rounded-3xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ${
            activeTab === 'pending' ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-200/80 hover:border-orange-300'
          }`}
          onClick={() => setActiveTab('pending')}
        >
          <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl border border-orange-100 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300 shrink-0">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Đang chờ xử lý</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{loading ? '-' : stats.pending}</p>
          </div>
        </div>

        {/* COMPLETED ORDERS */}
        <div 
          className={`group bg-white p-6 rounded-3xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ${
            activeTab === 'completed' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200/80 hover:border-emerald-300'
          }`}
          onClick={() => setActiveTab('completed')}
        >
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Thành công</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{loading ? '-' : stats.completed}</p>
          </div>
        </div>

        {/* CANCELLED ORDERS */}
        <div 
          className={`group bg-white p-6 rounded-3xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ${
            activeTab === 'failed' ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200/80 hover:border-rose-300'
          }`}
          onClick={() => setActiveTab('failed')}
        >
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300 shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Đã hủy/Lỗi</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{loading ? '-' : stats.failed}</p>
          </div>
        </div>
      </div>

      {/* Control Actions & Searching */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 shrink-0 bg-slate-50 p-4 rounded-3xl border border-slate-200/60">
        
        {/* Local Search Input */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Tìm theo mã đơn hàng (#), họ tên khách hàng, số điện thoại, địa chỉ, phương thức..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-10 py-3 text-sm font-bold text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>

        {/* Local Filter Info Badge */}
        <div className="flex items-center gap-2 self-stretch md:self-auto px-4 py-2 bg-white rounded-2xl border border-slate-200/80">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Hiển thị:</span>
          <span className="text-xs font-black text-primary uppercase bg-primary/5 px-2.5 py-1 rounded-xl border border-primary/10">
            {filteredOrders.length} đơn hàng
          </span>
        </div>
      </div>

      {/* Widescreen Order Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm flex-1 flex flex-col min-h-0">
        
        {/* Tabs internal navigation */}
        <div className="flex border-b border-slate-200/80 px-6 shrink-0 bg-slate-50/50">
          {['all', 'pending', 'completed', 'failed'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-6 border-b-2 font-black text-xs whitespace-nowrap uppercase tracking-wider transition-all relative ${
                activeTab === tab 
                  ? 'border-primary text-primary font-black' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 font-bold'
              }`}
            >
              {tab === 'all' ? 'Tất cả đơn' : tab === 'pending' ? 'Đang xử lý' : tab === 'completed' ? 'Thành công' : 'Đã hủy'}
              {activeTab === tab && (
                <motion.div layoutId="activeOrderTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Table Body Area */}
        <div className="overflow-auto flex-1">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-6 py-4 border-b border-slate-100 animate-pulse">
                  <div className="w-24 space-y-2 shrink-0">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                  <div className="w-48 shrink-0 flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-2/3" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="w-24 shrink-0">
                    <div className="h-5 bg-slate-200 rounded w-2/3" />
                  </div>
                  <div className="w-28 shrink-0">
                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                  </div>
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                  </div>
                  <div className="w-32 h-10 bg-slate-200 rounded-xl ml-auto shrink-0" />
                </div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Package className="w-8 h-8" />
              </div>
              <p className="text-slate-500 font-black uppercase text-xs tracking-wider">Không tìm thấy đơn hàng nào.</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Thay đổi bộ lọc hoặc từ khóa tìm kiếm thử lại.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 sticky top-0 z-10 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-6 py-4">Mã đơn hàng</th>
                  <th className="px-6 py-4">Khách hàng mua</th>
                  <th className="px-6 py-4">Thanh toán</th>
                  <th className="px-6 py-4">Trạng thái giao nhận</th>
                  <th className="px-6 py-4">Tổng tiền mặt hàng</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/40 transition-colors group">
                    
                    {/* Order Code & Time */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-black text-slate-900 uppercase font-mono tracking-wider group-hover:text-primary transition-colors">
                          #{order.id.substring(0,8)}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                          <Clock className="w-3.5 h-3.5 text-slate-300" />
                          {formatDate(order.created_at)}
                        </div>
                      </div>
                    </td>

                    {/* Buyer Avatar & Contact */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xs font-bold text-primary overflow-hidden border border-slate-200 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                          {order.buyerInfo?.avatar_url ? (
                            <img src={order.buyerInfo.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                          ) : (
                            getInitials(order.buyerInfo?.full_name)
                          )}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-xs font-black text-slate-900 leading-tight">{order.buyerInfo?.full_name || 'Khách vãng lai'}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-orange-500" /> {order.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Payment category */}
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        {order.payment_method === 'vnpay' ? (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-blue-100">
                            <CreditCard className="w-3 h-3" />
                            VNPay Online
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-200">
                            <Banknote className="w-3 h-3" />
                            Tiền mặt (COD)
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status badges */}
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>

                    {/* Total billing */}
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-slate-900 tracking-tight">
                        {order.total_amount.toLocaleString('vi-VN')} đ
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{order.items?.length || 0} sản phẩm</p>
                    </td>

                    {/* Action panel */}
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        
                        {/* Notify action seller */}
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => handleUpdateOrderStatus(order.id, 'remind')}
                            disabled={actionLoading === order.id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all hover:scale-105 shrink-0"
                            title="Nhắc nhở người bán chuẩn bị hàng"
                          >
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            Nhắc bán
                          </button>
                        )}

                        {/* Edit details */}
                        <button 
                          onClick={() => { 
                            setEditingOrder(order); 
                            setEditForm({ phone: order.phone, address: order.address, status: order.status }); 
                          }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Sửa thông tin cơ bản"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Viewer detail */}
                        <button 
                          onClick={() => setViewingOrder(order)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                          title="Xem chi tiết hóa đơn"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Delete order */}
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          disabled={actionLoading === order.id}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-50"
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

      {/* Modal viewing details */}
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
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Edit className="w-5 h-5" /></span>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">Chỉnh sửa đơn hàng</h3>
                    <p className="text-[10px] font-bold text-slate-400 font-mono mt-0.5">#{editingOrder.id.substring(0,8)}</p>
                  </div>
                </div>
                <button onClick={() => setEditingOrder(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form entries */}
              <div className="p-6 space-y-5">
                
                {/* phone field */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={editForm.phone}
                      onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* address field */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Địa chỉ giao hàng</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                    <textarea 
                      value={editForm.address}
                      onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all min-h-[90px] resize-none shadow-inner"
                    />
                  </div>
                </div>

                {/* status field */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Trạng thái đơn hàng</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select
                      value={editForm.status}
                      onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-10 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all appearance-none"
                    >
                      <option value="pending">Chờ xác nhận</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="shipping">Đang giao hàng</option>
                      <option value="delivered">Đã giao hàng</option>
                      <option value="completed">Hoàn tất thành công</option>
                      <option value="cancelled">Đã hủy bỏ</option>
                      <option value="failed">Lỗi/Giao thất bại</option>
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="px-6 pb-6 pt-2 flex justify-end gap-3 shrink-0">
                <button onClick={() => setEditingOrder(null)} className="px-5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                  Hủy bỏ
                </button>
                <button
                  onClick={() => {
                    handleUpdateOrderDetails(editingOrder.id, editForm);
                    setEditingOrder(null);
                  }}
                  disabled={actionLoading === editingOrder.id}
                  className="px-6 py-2.5 text-xs font-black bg-primary text-white hover:bg-primary-hover rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-wider"
                >
                  {actionLoading === editingOrder.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Lưu thay đổi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
