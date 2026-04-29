import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Search, Edit, Trash2, MapPin, Loader2, CheckCircle, XCircle, ShoppingCart, UserCheck, Shield, Clock, AlertCircle, Home, Eye, X,
  Image as ImageIcon, Phone, Calendar
} from 'lucide-react';

interface AdminListingsTabProps {
  listingMode: 'room' | 'product';
  setListingMode: (mode: 'room' | 'product') => void;
  activeTab: 'pending' | 'approved' | 'rejected';
  setActiveTab: (tab: 'pending' | 'approved' | 'rejected') => void;
  currentListings: any[];
  products: any[];
  loading: boolean;
  actionLoading: string | null;
  handleUpdateStatus: (id: string, status: 'approved' | 'rejected', reason?: string) => void;
  handleEditClick: (item: any) => void;
  handleDeleteListing: (id: string) => void;
  handleUpdateProductStatus: (id: string, status: string) => void;
  handleUpdateProductApproval: (id: string, status: 'approved' | 'rejected', reason?: string) => void;
  handleEditProductClick: (product: any) => void;
  handleDeleteProduct: (id: string) => void;
  highlightedListingId: string | null;
  getInitials: (name?: string) => string;
  formatDate: (date: string) => string;
  listingStats: any;
  editingListing: any;
  setEditingListing: (listing: any) => void;
  editForm: any;
  setEditForm: (form: any) => void;
  handleSaveEdit: () => void;
  editingProduct: any;
  setEditingProduct: (product: any) => void;
  productEditForm: any;
  setProductEditForm: (form: any) => void;
  handleSaveProductEdit: () => void;
  setHighlightedListingId: (id: string | null) => void;
  onNavigate: (page: any) => void;
}

export const AdminListingsTab = ({ 
  listingMode, setListingMode, activeTab, setActiveTab, currentListings, products, 
  loading, actionLoading, handleUpdateStatus, handleEditClick, handleDeleteListing,
  handleUpdateProductStatus, handleUpdateProductApproval, handleEditProductClick, handleDeleteProduct,
  highlightedListingId, getInitials, formatDate, listingStats,
  editingListing, setEditingListing, editForm, setEditForm, handleSaveEdit,
  editingProduct, setEditingProduct, productEditForm, setProductEditForm, handleSaveProductEdit,
  setHighlightedListingId, onNavigate
}: AdminListingsTabProps) => {
  const [rejectModal, setRejectModal] = useState<{isOpen: boolean, id: string, type: 'room'|'product'} | null>(null);
  const [rejectReasonType, setRejectReasonType] = useState<string>('Bài đăng thiếu thông tin');
  const [customReason, setCustomReason] = useState<string>('');
  const [viewingItem, setViewingItem] = useState<any>(null);

  const handleConfirmReject = () => {
    if (!rejectModal) return;
    const finalReason = rejectReasonType === 'Lí do khác' ? customReason : rejectReasonType;
    if (rejectModal.type === 'room') {
      handleUpdateStatus(rejectModal.id, 'rejected', finalReason);
    } else {
      handleUpdateProductApproval(rejectModal.id, 'rejected', finalReason);
    }
    setRejectModal(null);
    setCustomReason('');
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col w-full h-full">
        <div className="mb-8 shrink-0 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Danh sách Tin đăng</h2>
            <p className="text-slate-500">Quản lý và kiểm duyệt các nội dung đăng tải trên hệ thống.</p>
          </div>
          <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => setListingMode('room')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${listingMode === 'room' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Phòng trọ
            </button>
            <button 
              onClick={() => setListingMode('product')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${listingMode === 'product' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Bán hàng
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
          <div className={`bg-white dark:bg-slate-900 p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${activeTab === 'approved' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-800'}`}
               onClick={() => setActiveTab('approved')}>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium whitespace-nowrap">Đã đăng</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {loading ? '-' : (listingMode === 'room' ? listingStats.approved : listingStats.productApproved)}
              </p>
            </div>
          </div>
          
          <div className={`bg-white dark:bg-slate-900 p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${activeTab === 'pending' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 dark:border-slate-800'}`}
               onClick={() => setActiveTab('pending')}>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium whitespace-nowrap">Chờ duyệt</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {loading ? '-' : (listingMode === 'room' ? listingStats.pending : listingStats.productPending)}
              </p>
            </div>
          </div>

          <div className={`bg-white dark:bg-slate-900 p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${activeTab === 'rejected' ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 dark:border-slate-800'}`}
               onClick={() => setActiveTab('rejected')}>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium whitespace-nowrap">Đã từ chối</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {loading ? '-' : (listingMode === 'room' ? listingStats.rejected : listingStats.productRejected)}
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Tabs Container */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col flex-1 min-h-0">
          <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 overflow-x-auto shrink-0 bg-slate-50/50 dark:bg-slate-800/30">
            {['approved', 'pending', 'rejected'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-6 border-b-2 font-black text-sm whitespace-nowrap transition-all ${
                  activeTab === tab 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold'
                }`}
              >
                {tab === 'approved' ? 'ĐÃ ĐĂNG' : tab === 'pending' ? 'CHỜ DUYỆT' : 'ĐÃ TỪ CHỐI'}
              </button>
            ))}
          </div>
          
          <div className="overflow-auto flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="font-bold">Đang tải dữ liệu...</p>
              </div>
            ) : (listingMode === 'room' ? currentListings : products).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-slate-300" />
                </div>
                <p className="font-bold text-slate-500">
                  Không có {listingMode === 'room' ? 'tin đăng phòng trọ' : 'sản phẩm'} nào trong mục này.
                </p>
                <p className="text-sm text-slate-400 mt-1">Danh sách trống hoặc không tìm thấy kết quả phù hợp.</p>
              </div>
            ) : listingMode === 'room' ? (
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-wider">
                    <th className="px-6 py-4">Hình ảnh</th>
                    <th className="px-6 py-4">Thông tin tin đăng</th>
                    <th className="px-6 py-4">Chủ trọ</th>
                    <th className="px-6 py-4">Giá & Loại</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {currentListings.map((listing) => (
                    <tr key={listing.id} 
                        className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all ${
                          listing.id === highlightedListingId ? 'bg-orange-50 dark:bg-orange-900/20 shadow-[inset_4px_0_0_0_#f97316]' : ''
                        }`}>
                      <td className="px-6 py-4">
                        <div className="w-16 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                          {listing.image_url ? (
                            <img className="w-full h-full object-cover" alt={listing.title} src={listing.image_url}/>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                              <Home className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-black text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">{listing.title}</div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="line-clamp-1">{listing.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-sm flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                            {listing.ownerInfo?.avatar_url ? (
                              <img src={listing.ownerInfo.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                            ) : (
                              getInitials(listing.ownerInfo?.full_name)
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{listing.ownerInfo?.full_name || 'N/A'}</div>
                            <div className="text-[11px] text-slate-500 font-medium">{listing.ownerInfo?.phone || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-black text-primary mb-1">
                          {listing.price.toLocaleString('vi-VN')} đ
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          {listing.type}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          listing.approval_status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 
                          listing.approval_status === 'rejected' ? 'bg-red-100 text-red-600' : 
                          'bg-orange-100 text-orange-600'
                        }`}>
                          {listing.approval_status === 'approved' ? 'Đã duyệt' : 
                           listing.approval_status === 'rejected' ? 'Đã từ chối' : 'Chờ duyệt'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {listing.approval_status === 'pending' && (
                            <>
                              <button onClick={() => handleUpdateStatus(listing.id, 'approved')} 
                                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Phê duyệt">
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button onClick={() => setRejectModal({ isOpen: true, id: listing.id, type: 'room' })} 
                                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Từ chối">
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          <button onClick={() => handleEditClick(listing)} 
                                  className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="Chỉnh sửa">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button onClick={() => setViewingItem({ ...listing, _itemType: 'room' })} 
                                  className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="Xem chi tiết">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDeleteListing(listing.id)} 
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Xóa">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-wider">
                    <th className="px-6 py-4">Hình ảnh</th>
                    <th className="px-6 py-4">Thông tin sản phẩm</th>
                    <th className="px-6 py-4">Người bán</th>
                    <th className="px-6 py-4">Giá & Danh mục</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all group">
                      <td className="px-6 py-4">
                        <div className="w-16 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                          {product.image_url ? (
                            <img className="w-full h-full object-cover" alt={product.title} src={product.image_url}/>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                              <ShoppingCart className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-black text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">{product.title}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase">
                            Tình trạng: {product.condition}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-sm flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                            {product.ownerInfo?.avatar_url ? (
                              <img src={product.ownerInfo.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                            ) : (
                              getInitials(product.ownerInfo?.full_name)
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{product.ownerInfo?.full_name || 'N/A'}</div>
                            <div className="text-[11px] text-slate-500 font-medium">{product.ownerInfo?.phone || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mb-1">
                          {product.price.toLocaleString('vi-VN')} đ
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          DM: {product.category}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider w-fit ${
                            product.approval_status === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                            product.approval_status === 'rejected' ? 'bg-red-100 text-red-600' :
                            'bg-orange-100 text-orange-600'
                          }`}>
                            {product.approval_status === 'approved' ? 'Đã duyệt' :
                             product.approval_status === 'rejected' ? 'Bị từ chối' : 'Chờ duyệt'}
                          </span>
                          <div className="text-[9px] font-bold text-slate-400 pl-1 uppercase">
                            Kho: {product.status === 'available' ? 'Còn hàng' : 'Đã bán'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {product.approval_status === 'pending' && (
                            <>
                              <button onClick={() => handleUpdateProductApproval(product.id, 'approved')} 
                                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Duyệt bài">
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button onClick={() => setRejectModal({ isOpen: true, id: product.id, type: 'product' })} 
                                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Từ chối">
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          <button onClick={() => handleEditProductClick(product)} 
                                  className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="Chỉnh sửa">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button onClick={() => setViewingItem({ ...product, _itemType: 'product' })} 
                                  className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="Xem chi tiết">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleUpdateProductStatus(product.id, product.status === 'available' ? 'sold' : 'available')} 
                                  className={`p-1.5 rounded-lg transition-all ${product.status === 'available' ? 'text-slate-400 hover:text-orange-600 hover:bg-orange-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                                  title={product.status === 'available' ? 'Đánh dấu đã bán' : 'Đánh dấu có sẵn'}>
                            <ShoppingCart className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDeleteProduct(product.id)} 
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Xóa">
                            <Trash2 className="w-5 h-5" />
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

        {/* MODAL SỬA TIN ĐĂNG */}
        <AnimatePresence>
          {editingListing && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-xl font-bold text-slate-900">Chỉnh sửa Tin đăng</h3>
                  <button onClick={() => setEditingListing(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Tiêu đề</label>
                    <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" 
                      value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Giá thuê (VND)</label>
                      <input type="number" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" 
                        value={editForm.price} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Loại phòng</label>
                      <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" 
                        value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Vị trí</label>
                    <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" 
                      value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} />
                  </div>
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                  <button onClick={() => setEditingListing(null)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Hủy</button>
                  <button onClick={handleSaveEdit} disabled={actionLoading === 'saving'} className="px-6 py-2.5 text-sm font-black bg-primary text-white hover:bg-primary-hover rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95">
                    {actionLoading === 'saving' && <Loader2 className="w-4 h-4 animate-spin"/>}
                    LƯU THAY ĐỔI
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL SỬA SẢN PHẨM */}
        <AnimatePresence>
          {editingProduct && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-xl font-bold text-slate-900">Chỉnh sửa Sản phẩm</h3>
                  <button onClick={() => setEditingProduct(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Tên sản phẩm</label>
                    <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" 
                      value={productEditForm.title} onChange={e => setProductEditForm({...productEditForm, title: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Giá bán (VND)</label>
                      <input type="number" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" 
                        value={productEditForm.price} onChange={e => setProductEditForm({...productEditForm, price: Number(e.target.value)})} />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Danh mục</label>
                      <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" 
                        value={productEditForm.category} onChange={e => setProductEditForm({...productEditForm, category: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Tình trạng</label>
                    <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" 
                      value={productEditForm.condition} onChange={e => setProductEditForm({...productEditForm, condition: e.target.value})} />
                  </div>
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                  <button onClick={() => setEditingProduct(null)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Hủy</button>
                  <button onClick={handleSaveProductEdit} disabled={actionLoading === 'saving-product'} className="px-6 py-2.5 text-sm font-black bg-primary text-white hover:bg-primary-hover rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95">
                    {actionLoading === 'saving-product' && <Loader2 className="w-4 h-4 animate-spin"/>}
                    LƯU THAY ĐỔI
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL TỪ CHỐI */}
        <AnimatePresence>
          {rejectModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <span className="p-1.5 bg-red-100 text-red-600 rounded-lg"><XCircle className="w-5 h-5" /></span>
                    <span className="text-slate-900">Từ chối bài đăng</span>
                  </h2>
                  <button onClick={() => setRejectModal(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Lý do từ chối:</label>
                    <select 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                      value={rejectReasonType}
                      onChange={(e) => setRejectReasonType(e.target.value)}
                    >
                      <option value="Bài đăng thiếu thông tin">Bài đăng thiếu thông tin</option>
                      <option value="Bài đăng khả nghi">Bài đăng khả nghi</option>
                      <option value="Bài đăng chứa nội dung không phù hợp">Bài đăng chứa nội dung không phù hợp</option>
                      <option value="Lí do khác">Lí do khác...</option>
                    </select>
                  </div>
                  
                  {rejectReasonType === 'Lí do khác' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 mt-4">Nhập lý do chi tiết:</label>
                      <textarea 
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all min-h-[100px] resize-none"
                        placeholder="Nhập lý do từ chối..."
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                      ></textarea>
                    </motion.div>
                  )}
                  <p className="text-xs text-slate-500 font-medium mt-2">
                    Lý do này sẽ được gửi kèm trong thông báo đến người đăng bài.
                  </p>
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                  <button onClick={() => setRejectModal(null)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Hủy</button>
                  <button onClick={handleConfirmReject} 
                          disabled={rejectReasonType === 'Lí do khác' && !customReason.trim()}
                          className="px-6 py-2.5 text-sm font-bold bg-red-600 text-white hover:bg-red-700 rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                    Xác nhận từ chối
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        {/* MODAL XEM CHI TIẾT (PREVIEW) */}
        <AnimatePresence>
          {viewingItem && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setViewingItem(null)}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                          className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 relative shrink-0">
                  <div className="flex items-center gap-3">
                    <span className={`p-2 rounded-xl ${viewingItem._itemType === 'room' ? 'bg-primary/10 text-primary' : 'bg-blue-100 text-blue-600'}`}>
                      {viewingItem._itemType === 'room' ? <Home className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 leading-tight">Chi tiết {viewingItem._itemType === 'room' ? 'tin đăng' : 'sản phẩm'}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                          viewingItem.approval_status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 
                          viewingItem.approval_status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                          {viewingItem.approval_status === 'approved' ? 'Đã duyệt' : viewingItem.approval_status === 'rejected' ? 'Bị từ chối' : 'Đang chờ duyệt'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{viewingItem.id.substring(0,8)}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setViewingItem(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="overflow-y-auto flex-1 p-8 custom-scrollbar">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left: Image & Main Info */}
                    <div className="space-y-6">
                      <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner group relative">
                        {viewingItem.image_url ? (
                          <img src={viewingItem.image_url} alt={viewingItem.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon className="w-16 h-16 opacity-20" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-lg font-black text-primary shadow-lg border border-white/20">
                            {viewingItem.price.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      </div>

                      <div>
                        <h1 className="text-2xl font-black text-slate-900 leading-tight mb-3 font-display uppercase tracking-tight">{viewingItem.title}</h1>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold">{viewingItem.location || viewingItem.category || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold">Đăng lúc: {formatDate(viewingItem.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <FileText className="w-4 h-4" /> Mô tả chi tiết
                        </h4>
                        <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                          {viewingItem.description || 'Không có mô tả chi tiết cho bài đăng này.'}
                        </div>
                      </div>
                    </div>

                    {/* Right: Detailed Specs & Owner */}
                    <div className="space-y-8">
                      {/* Detailed Specs */}
                      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Thông tin kỹ thuật</h4>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Loại bài đăng</p>
                            <p className="text-sm font-black text-slate-900">{viewingItem._itemType === 'room' ? 'Cho thuê phòng' : 'Bán hàng'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{viewingItem._itemType === 'room' ? 'Loại phòng' : 'Danh mục'}</p>
                            <p className="text-sm font-black text-slate-900">{viewingItem.type || viewingItem.category || 'N/A'}</p>
                          </div>
                          {viewingItem.condition && (
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Tình trạng</p>
                              <p className="text-sm font-black text-slate-900 uppercase">{viewingItem.condition}</p>
                            </div>
                          )}
                          {viewingItem.area && (
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Diện tích</p>
                              <p className="text-sm font-black text-slate-900">{viewingItem.area} m²</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Owner Information */}
                      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Thông tin người đăng</h4>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-black text-primary overflow-hidden border-2 border-white shadow-md">
                            {viewingItem.ownerInfo?.avatar_url ? (
                              <img src={viewingItem.ownerInfo.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                            ) : (
                              getInitials(viewingItem.ownerInfo?.full_name)
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-black text-slate-900">{viewingItem.ownerInfo?.full_name || 'Không rõ tên'}</h3>
                              <Shield className="w-4 h-4 text-emerald-500" />
                            </div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{viewingItem.ownerInfo?.role === 'landlord' ? 'Chủ trọ / Người bán' : 'Người dùng'}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5" /> Số điện thoại
                            </span>
                            <span className="text-sm font-black text-slate-900">{viewingItem.ownerInfo?.phone || 'Chưa cập nhật'}</span>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5" /> Ngày gia nhập
                            </span>
                            <span className="text-sm font-black text-slate-900">{formatDate(viewingItem.ownerInfo?.created_at) || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Rejected Reason (if any) */}
                      {viewingItem.approval_status === 'rejected' && viewingItem.rejection_reason && (
                        <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
                          <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> Lý do bị từ chối trước đó
                          </h4>
                          <p className="text-sm font-bold text-rose-700 leading-relaxed italic">
                            "{viewingItem.rejection_reason}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setViewingItem(null)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Đóng lại</button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {viewingItem.approval_status === 'pending' && (
                      <>
                        <button 
                          onClick={() => { 
                            if (viewingItem._itemType === 'room') {
                              handleUpdateStatus(viewingItem.id, 'approved');
                            } else {
                              handleUpdateProductApproval(viewingItem.id, 'approved');
                            }
                            setViewingItem(null); 
                          }}
                          className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-black shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-2 uppercase tracking-tight"
                        >
                          <CheckCircle className="w-4 h-4" /> Phê duyệt ngay
                        </button>
                        <button 
                          onClick={() => { setRejectModal({ isOpen: true, id: viewingItem.id, type: viewingItem._itemType === 'room' ? 'room' : 'product' }); setViewingItem(null); }}
                          className="px-6 py-2.5 bg-white text-rose-600 border border-rose-200 rounded-xl text-sm font-black hover:bg-rose-50 transition-all flex items-center gap-2 uppercase tracking-tight"
                        >
                          <XCircle className="w-4 h-4" /> Từ chối bài
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
