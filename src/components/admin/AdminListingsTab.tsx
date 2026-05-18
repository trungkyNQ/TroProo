import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Search, Edit, Trash2, MapPin, Loader2, CheckCircle, XCircle, ShoppingCart, UserCheck, Shield, Clock, AlertCircle, Home, Eye, X,
  Image as ImageIcon, Phone, Calendar, Filter, Building2, User
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
  handleApproveListingEdit?: (id: string) => void;
  handleRejectListingEdit?: (id: string, reason: string) => void;
}

export const AdminListingsTab = ({ 
  listingMode, setListingMode, activeTab, setActiveTab, currentListings, products, 
  loading, actionLoading, handleUpdateStatus, handleEditClick, handleDeleteListing,
  handleUpdateProductStatus, handleUpdateProductApproval, handleEditProductClick, handleDeleteProduct,
  highlightedListingId, getInitials, formatDate, listingStats,
  editingListing, setEditingListing, editForm, setEditForm, handleSaveEdit,
  editingProduct, setEditingProduct, productEditForm, setProductEditForm, handleSaveProductEdit,
  setHighlightedListingId, onNavigate, handleApproveListingEdit, handleRejectListingEdit
}: AdminListingsTabProps) => {
  const [rejectModal, setRejectModal] = useState<{isOpen: boolean, id: string, type: 'room'|'product'} | null>(null);
  const [rejectReasonType, setRejectReasonType] = useState<string>('Bài đăng thiếu thông tin');
  const [customReason, setCustomReason] = useState<string>('');
  const [viewingItem, setViewingItem] = useState<any>(null);

  const [compareItem, setCompareItem] = useState<any>(null);
  const [rejectEditModal, setRejectEditModal] = useState<{isOpen: boolean, id: string} | null>(null);
  const [rejectEditReasonType, setRejectEditReasonType] = useState<string>('Thông tin sửa đổi không chính xác');
  const [customEditReason, setCustomEditReason] = useState<string>('');

  // Local Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Reset type filter when changing mode
  useEffect(() => {
    setSelectedType('all');
  }, [listingMode]);

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

  // Extract unique categories from products
  const uniqueCategories = useMemo(() => {
    const categoriesSet = new Set<string>();
    products.forEach(p => {
      if (p.category) categoriesSet.add(p.category);
    });
    return Array.from(categoriesSet).sort();
  }, [products]);

  // Dynamic filter for rooms
  const filteredRooms = useMemo(() => {
    return currentListings.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q)) ||
        (item.ownerInfo?.full_name && item.ownerInfo.full_name.toLowerCase().includes(q)) ||
        (item.ownerInfo?.phone && item.ownerInfo.phone.toLowerCase().includes(q));
      
      const matchesType = selectedType === 'all' || 
        (item.type && item.type.toLowerCase().includes(selectedType.toLowerCase()));

      return matchesSearch && matchesType;
    });
  }, [currentListings, searchQuery, selectedType]);

  // Dynamic filter for products
  const filteredProducts = useMemo(() => {
    return products.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.ownerInfo?.full_name && item.ownerInfo.full_name.toLowerCase().includes(q)) ||
        (item.ownerInfo?.phone && item.ownerInfo.phone.toLowerCase().includes(q));

      const matchesCategory = selectedType === 'all' || 
        (item.category && item.category.toLowerCase() === selectedType.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedType]);

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col w-full h-full space-y-6">
        {/* Page Header */}
        <div className="shrink-0 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-1 font-display tracking-tight flex items-center gap-2">
              Quản lý Tin đăng
            </h2>
            <p className="text-slate-500 font-semibold text-sm">
              Kiểm duyệt, phê duyệt và cập nhật nội dung tin phòng trọ & hàng bán trên hệ thống.
            </p>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl w-fit border border-slate-200/50 dark:border-slate-700">
            <button 
              onClick={() => setListingMode('room')}
              className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${listingMode === 'room' ? 'bg-white dark:bg-slate-700 text-primary shadow-md shadow-slate-200/50 dark:shadow-none' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <Building2 className="w-4 h-4" />
              Phòng trọ
            </button>
            <button 
              onClick={() => setListingMode('product')}
              className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${listingMode === 'product' ? 'bg-white dark:bg-slate-700 text-primary shadow-md shadow-slate-200/50 dark:shadow-none' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <ShoppingCart className="w-4 h-4" />
              Góc Thanh lý
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 shrink-0">
          <div className={`bg-white dark:bg-slate-900 p-5 rounded-3xl border shadow-sm cursor-pointer hover:shadow-md transition-all flex items-center gap-4 ${activeTab === 'approved' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-800'}`}
               onClick={() => setActiveTab('approved')}>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Đã phê duyệt</p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white font-display mt-0.5">
                {loading ? '-' : (listingMode === 'room' ? listingStats.approved : listingStats.productApproved)} tin
              </h4>
            </div>
          </div>
          
          <div className={`bg-white dark:bg-slate-900 p-5 rounded-3xl border shadow-sm cursor-pointer hover:shadow-md transition-all flex items-center gap-4 ${activeTab === 'pending' ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-200 dark:border-slate-805'}`}
               onClick={() => setActiveTab('pending')}>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/30 flex items-center justify-center text-orange-600">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Chờ kiểm duyệt</p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white font-display mt-0.5">
                {loading ? '-' : (listingMode === 'room' ? listingStats.pending : listingStats.productPending)} tin
              </h4>
            </div>
          </div>

          <div className={`bg-white dark:bg-slate-900 p-5 rounded-3xl border shadow-sm cursor-pointer hover:shadow-md transition-all flex items-center gap-4 ${activeTab === 'rejected' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-200 dark:border-slate-805'}`}
               onClick={() => setActiveTab('rejected')}>
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 flex items-center justify-center text-red-600">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Đã từ chối</p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white font-display mt-0.5">
                {loading ? '-' : (listingMode === 'room' ? listingStats.rejected : listingStats.productRejected)} tin
              </h4>
            </div>
          </div>
        </div>

        {/* Search & Advanced Filters Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-4 shrink-0">
          {/* Search bar */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={listingMode === 'room' ? "Tìm theo tiêu đề tin, vị trí, tên hoặc SĐT chủ trọ..." : "Tìm theo tên sản phẩm, danh mục, tên hoặc SĐT người bán..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white bg-slate-50/50 hover:bg-white text-sm focus:border-primary focus:bg-white focus:outline-none transition-all placeholder-slate-400 font-medium"
            />
          </div>

          {/* Type filters */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-56">
              {listingMode === 'room' ? (
                <Home className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
              ) : (
                <ShoppingCart className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
              )}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white bg-white dark:bg-slate-800 text-sm focus:border-primary focus:outline-none transition-all appearance-none font-bold shadow-sm"
              >
                {listingMode === 'room' ? (
                  <>
                    <option value="all">Tất cả loại phòng</option>
                    <option value="ktx">Ký túc xá / Homestay</option>
                    <option value="phòng trọ">Phòng trọ</option>
                    <option value="căn hộ">Căn hộ</option>
                    <option value="nhà nguyên căn">Nhà nguyên căn</option>
                  </>
                ) : (
                  <>
                    <option value="all">Tất cả danh mục</option>
                    {uniqueCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </>
                )}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-l pl-2 border-slate-200 dark:border-slate-700">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Primary Data Display Container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col flex-1 min-h-0">
          <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 overflow-x-auto shrink-0 bg-slate-50/50 dark:bg-slate-800/30">
            {['approved', 'pending', 'rejected'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4.5 px-6 border-b-2 font-black text-xs whitespace-nowrap transition-all tracking-wider ${
                  activeTab === tab 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 font-bold'
                }`}
              >
                {tab === 'approved' ? 'ĐÃ PHÊ DUYỆT' : tab === 'pending' ? 'ĐANG CHỜ DUYỆT' : 'ĐÃ BỊ TỪ CHỐI'}
              </button>
            ))}
          </div>
          
          <div className="overflow-auto flex-1">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-6 py-3 border-b border-slate-100 dark:border-slate-800 animate-pulse">
                    <div className="w-16 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl shrink-0" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                    </div>
                    <div className="w-32 space-y-2 hidden md:block">
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                    </div>
                    <div className="w-24 space-y-2">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                    </div>
                    <div className="w-20 h-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
                    <div className="w-24 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg ml-auto" />
                  </div>
                ))}
              </div>
            ) : (listingMode === 'room' ? filteredRooms : filteredProducts).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-80 text-slate-400 p-8 text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-4 shadow-inner">
                  <AlertCircle className="w-8 h-8 text-slate-300" />
                </div>
                <p className="font-bold text-slate-800 dark:text-white text-base">
                  Không có {listingMode === 'room' ? 'tin đăng phòng trọ' : 'sản phẩm'} nào phù hợp.
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">Danh sách trống hoặc từ khóa lọc của bạn không mang lại kết quả phù hợp nào.</p>
              </div>
            ) : listingMode === 'room' ? (
              <table className="w-full text-sm text-left text-slate-500 border-collapse min-w-[1000px]">
                <thead className="text-[10px] text-slate-400 dark:text-slate-400 uppercase tracking-widest bg-slate-50/70 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 font-bold sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4">Hình ảnh</th>
                    <th className="px-6 py-4">Thông tin tin đăng</th>
                    <th className="px-6 py-4">Chủ trọ</th>
                    <th className="px-6 py-4 text-right">Giá thuê & Cọc</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredRooms.map((listing) => (
                    <tr key={listing.id} 
                        className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group ${
                          listing.id === highlightedListingId ? 'bg-orange-50/75 dark:bg-orange-950/20 shadow-[inset_4px_0_0_0_#f97316]' : ''
                        }`}>
                      <td className="px-6 py-4">
                        <div className="w-16 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/60 dark:border-slate-700 shadow-sm relative group">
                          {listing.image_url ? (
                            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={listing.title} src={listing.image_url}/>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400">
                              <Home className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-black text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">{listing.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase">
                            {listing.type}
                          </span>
                          {listing.area && (
                            <span className="text-[10px] font-bold text-slate-400">
                              {listing.area} m²
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-bold mt-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="line-clamp-1">{listing.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-xs font-bold text-primary overflow-hidden shrink-0">
                            {listing.ownerInfo?.avatar_url ? (
                              <img src={listing.ownerInfo.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                            ) : (
                              getInitials(listing.ownerInfo?.full_name)
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{listing.ownerInfo?.full_name || 'N/A'}</div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">{listing.ownerInfo?.phone || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-sm font-black text-primary mb-0.5">
                          {listing.price.toLocaleString('vi-VN')} đ
                        </div>
                        <div className="text-[10px] font-bold text-slate-400">
                          Cọc: {listing.deposit ? `${listing.deposit.toLocaleString('vi-VN')} đ` : 'Không có'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {listing.edit_approval_status === 'pending' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-600 border border-purple-100 animate-pulse">
                            📝 Chờ duyệt sửa
                          </span>
                        ) : (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            listing.approval_status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                            listing.approval_status === 'rejected' ? 'bg-red-50 text-red-600 border border-red-100' : 
                            'bg-orange-50 text-orange-600 border border-orange-100'
                          }`}>
                            {listing.approval_status === 'approved' ? 'Đã duyệt' : 
                             listing.approval_status === 'rejected' ? 'Đã từ chối' : 'Chờ duyệt'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {listing.edit_approval_status === 'pending' ? (
                            <button onClick={() => setCompareItem(listing)} 
                                    className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm" 
                                    title="So sánh thay đổi">
                              <Eye className="w-4 h-4" /> So sánh
                            </button>
                          ) : (
                            <>
                              {listing.approval_status === 'pending' && (
                                <>
                                  <button onClick={() => handleUpdateStatus(listing.id, 'approved')} 
                                          className="p-2 bg-emerald-50 hover:bg-emerald-105 hover:shadow text-emerald-600 rounded-xl transition-all flex items-center justify-center border border-emerald-100" title="Phê duyệt">
                                    <CheckCircle className="w-4.5 h-4.5" />
                                  </button>
                                  <button onClick={() => setRejectModal({ isOpen: true, id: listing.id, type: 'room' })} 
                                          className="p-2 bg-red-50 hover:bg-red-105 hover:shadow text-red-600 rounded-xl transition-all flex items-center justify-center border border-red-100" title="Từ chối">
                                    <XCircle className="w-4.5 h-4.5" />
                                  </button>
                                </>
                              )}
                              <button onClick={() => handleEditClick(listing)} 
                                      className="p-2 bg-slate-50 hover:bg-primary/10 hover:text-primary border border-slate-100 text-slate-500 rounded-xl transition-all flex items-center justify-center shadow-sm" title="Chỉnh sửa">
                                <Edit className="w-4.5 h-4.5" />
                              </button>
                              <button onClick={() => setViewingItem({ ...listing, _itemType: 'room' })} 
                                      className="p-2 bg-slate-50 hover:bg-primary/10 hover:text-primary border border-slate-100 text-slate-500 rounded-xl transition-all flex items-center justify-center shadow-sm" title="Xem chi tiết">
                                <Eye className="w-4.5 h-4.5" />
                              </button>
                            </>
                          )}
                          <button onClick={() => handleDeleteListing(listing.id)} 
                                  className="p-2 bg-slate-50 hover:bg-red-50 hover:text-red-600 border border-slate-100 text-slate-500 rounded-xl transition-all flex items-center justify-center shadow-sm" title="Xóa">
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm text-left text-slate-500 border-collapse min-w-[1000px]">
                <thead className="text-[10px] text-slate-400 dark:text-slate-400 uppercase tracking-widest bg-slate-50/70 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 font-bold sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4">Hình ảnh</th>
                    <th className="px-6 py-4">Thông tin sản phẩm</th>
                    <th className="px-6 py-4">Người bán</th>
                    <th className="px-6 py-4 text-right">Giá bán & Kho</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group animate-fadeIn">
                      <td className="px-6 py-4">
                        <div className="w-16 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/60 dark:border-slate-700 shadow-sm relative group">
                          {product.image_url ? (
                            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={product.title} src={product.image_url}/>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400">
                              <ShoppingCart className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-black text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">{product.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase">
                            DM: {product.category}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-100 uppercase">
                            Mới: {product.condition}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-xs font-bold text-primary overflow-hidden shrink-0">
                            {product.ownerInfo?.avatar_url ? (
                              <img src={product.ownerInfo.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                            ) : (
                              getInitials(product.ownerInfo?.full_name)
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{product.ownerInfo?.full_name || 'N/A'}</div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">{product.ownerInfo?.phone || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-sm font-black text-emerald-605 dark:text-emerald-400 mb-0.5">
                          {product.price.toLocaleString('vi-VN')} đ
                        </div>
                        <div className={`text-[10px] font-bold ${product.status === 'available' ? 'text-green-500' : 'text-slate-450'}`}>
                          {product.status === 'available' ? 'Còn hàng' : 'Đã bán'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          product.approval_status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          product.approval_status === 'rejected' ? 'bg-red-50 text-red-600 border border-red-100' :
                          'bg-orange-50 text-orange-600 border border-orange-100'
                        }`}>
                          {product.approval_status === 'approved' ? 'Đã duyệt' :
                           product.approval_status === 'rejected' ? 'Bị từ chối' : 'Chờ duyệt'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {product.approval_status === 'pending' && (
                            <>
                              <button onClick={() => handleUpdateProductApproval(product.id, 'approved')} 
                                      className="p-2 bg-emerald-50 hover:bg-emerald-105 hover:shadow text-emerald-600 rounded-xl transition-all flex items-center justify-center border border-emerald-100" title="Duyệt bài">
                                <CheckCircle className="w-4.5 h-4.5" />
                              </button>
                              <button onClick={() => setRejectModal({ isOpen: true, id: product.id, type: 'product' })} 
                                      className="p-2 bg-red-50 hover:bg-red-105 hover:shadow text-red-600 rounded-xl transition-all flex items-center justify-center border border-red-100" title="Từ chối">
                                <XCircle className="w-4.5 h-4.5" />
                              </button>
                            </>
                          )}
                          <button onClick={() => handleEditProductClick(product)} 
                                  className="p-2 bg-slate-50 hover:bg-primary/10 hover:text-primary border border-slate-100 text-slate-500 rounded-xl transition-all flex items-center justify-center shadow-sm" title="Chỉnh sửa">
                            <Edit className="w-4.5 h-4.5" />
                          </button>
                          <button onClick={() => setViewingItem({ ...product, _itemType: 'product' })} 
                                  className="p-2 bg-slate-50 hover:bg-primary/10 hover:text-primary border border-slate-100 text-slate-500 rounded-xl transition-all flex items-center justify-center shadow-sm" title="Xem chi tiết">
                            <Eye className="w-4.5 h-4.5" />
                          </button>
                          <button onClick={() => handleUpdateProductStatus(product.id, product.status === 'available' ? 'sold' : 'available')} 
                                  className={`p-2 rounded-xl transition-all flex items-center justify-center border border-slate-100 shadow-sm ${product.status === 'available' ? 'bg-slate-50 hover:bg-orange-50 hover:text-orange-605 text-slate-500' : 'bg-slate-50 hover:bg-emerald-50 hover:text-emerald-605 text-slate-500'}`}
                                  title={product.status === 'available' ? 'Đánh dấu đã bán' : 'Đánh dấu có sẵn'}>
                            <ShoppingCart className="w-4.5 h-4.5" />
                          </button>
                          <button onClick={() => handleDeleteProduct(product.id)} 
                                  className="p-2 bg-slate-50 hover:bg-red-50 hover:text-red-600 border border-slate-100 text-slate-500 rounded-xl transition-all flex items-center justify-center shadow-sm" title="Xóa">
                            <Trash2 className="w-4.5 h-4.5" />
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
                          className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white font-display">Chỉnh sửa Tin đăng</h3>
                  <button onClick={() => setEditingListing(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-4 font-bold">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Tiêu đề</label>
                    <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all dark:text-white" 
                      value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Giá thuê (VND)</label>
                      <input type="number" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all dark:text-white" 
                        value={editForm.price} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Loại phòng</label>
                      <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all dark:text-white" 
                        value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Vị trí</label>
                    <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all dark:text-white" 
                      value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} />
                  </div>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                  <button onClick={() => setEditingListing(null)} className="px-6 py-2.5 text-sm font-bold text-slate-650 hover:bg-slate-200 rounded-xl transition-colors">Hủy</button>
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
                          className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white font-display">Chỉnh sửa Sản phẩm</h3>
                  <button onClick={() => setEditingProduct(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-4 font-bold">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Tên sản phẩm</label>
                    <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all dark:text-white" 
                      value={productEditForm.title} onChange={e => setProductEditForm({...productEditForm, title: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Giá bán (VND)</label>
                      <input type="number" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all dark:text-white" 
                        value={productEditForm.price} onChange={e => setProductEditForm({...productEditForm, price: Number(e.target.value)})} />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Danh mục</label>
                      <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all dark:text-white" 
                        value={productEditForm.category} onChange={e => setProductEditForm({...productEditForm, category: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Tình trạng</label>
                    <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all dark:text-white" 
                      value={productEditForm.condition} onChange={e => setProductEditForm({...productEditForm, condition: e.target.value})} />
                  </div>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                  <button onClick={() => setEditingProduct(null)} className="px-6 py-2.5 text-sm font-bold text-slate-650 hover:bg-slate-200 rounded-xl transition-colors">Hủy</button>
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
                          className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative border border-slate-100">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <span className="p-1.5 bg-red-100 text-red-600 rounded-lg"><XCircle className="w-5 h-5" /></span>
                    <span className="text-slate-900">Từ chối bài đăng</span>
                  </h2>
                  <button onClick={() => setRejectModal(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-4 font-bold">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Lý lý do từ chối:</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
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
                      <label className="block text-sm font-bold text-slate-700 mb-2 mt-4 font-bold">Nhập lý do chi tiết:</label>
                      <textarea 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all min-h-[100px] resize-none"
                        placeholder="Nhập lý do từ chối..."
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                      ></textarea>
                    </motion.div>
                  )}
                  <p className="text-xs text-slate-400 font-medium mt-2">
                    Lý do này sẽ được gửi kèm trong thông báo đến người đăng bài.
                  </p>
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                  <button onClick={() => setRejectModal(null)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Hủy</button>
                  <button onClick={handleConfirmReject} 
                          disabled={rejectReasonType === 'Lí do khác' && !customReason.trim()}
                          className="px-6 py-2.5 text-sm font-black bg-red-650 text-white hover:bg-red-700 rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                    XÁC NHẬN TỪ CHỐI
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
                          className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-slate-100" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 relative shrink-0">
                  <div className="flex items-center gap-3">
                    <span className={`p-2 rounded-xl ${viewingItem._itemType === 'room' ? 'bg-primary/10 text-primary' : 'bg-blue-105 text-blue-600'}`}>
                      {viewingItem._itemType === 'room' ? <Building2 className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 leading-tight font-display">Chi tiết {viewingItem._itemType === 'room' ? 'tin đăng' : 'sản phẩm'}</h3>
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
                            {viewingItem.price.toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                      </div>

                      <div>
                        <h1 className="text-2xl font-black text-slate-900 leading-tight mb-3 font-display uppercase tracking-tight">{viewingItem.title}</h1>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 font-bold text-xs">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{viewingItem.location || viewingItem.category || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-605 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 font-bold text-xs">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>Đăng lúc: {formatDate(viewingItem.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <FileText className="w-4 h-4" /> Mô tả chi tiết
                        </h4>
                        <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-semibold">
                          {viewingItem.description || 'Không có mô tả chi tiết cho bài đăng này.'}
                        </div>
                      </div>
                    </div>

                    {/* Right: Detailed Specs & Owner */}
                    <div className="space-y-8 font-bold">
                      {/* Detailed Specs */}
                      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Thông tin chi tiết</h4>
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
                              <h3 className="text-lg font-black text-slate-900 leading-tight">{viewingItem.ownerInfo?.full_name || 'Không rõ tên'}</h3>
                              <Shield className="w-4 h-4 text-emerald-500 animate-pulse" />
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{viewingItem.ownerInfo?.role === 'landlord' ? 'Chủ trọ / Người bán' : 'Người dùng'}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-primary" /> Số điện thoại
                            </span>
                            <span className="text-sm font-mono font-black text-slate-900">{viewingItem.ownerInfo?.phone || 'Chưa cập nhật'}</span>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-primary" /> Ngày gia nhập
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

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setViewingItem(null)} className="px-6 py-2.5 text-sm font-bold text-slate-650 hover:bg-slate-200 rounded-xl transition-colors">Đóng lại</button>
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

        {/* COMPARISON MODAL FOR PENDING EDITS */}
        <AnimatePresence>
          {compareItem && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto" onClick={() => setCompareItem(null)}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                          className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-5xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded-xl">
                      <FileText className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight font-display">So sánh thay đổi chỉnh sửa</h3>
                      <p className="text-xs text-slate-500 font-medium">Bấm phê duyệt để áp dụng các thay đổi mới lên hệ thống công khai</p>
                    </div>
                  </div>
                  <button onClick={() => setCompareItem(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Comparison body */}
                <div className="overflow-y-auto flex-1 p-6 space-y-6 custom-scrollbar font-bold text-xs">
                  {/* Owner info */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-150 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center font-bold text-sm">
                        {getInitials(compareItem.ownerInfo?.full_name)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{compareItem.ownerInfo?.full_name || 'N/A'}</p>
                        <p className="text-[11px] text-slate-500 font-medium">Số điện thoại: {compareItem.ownerInfo?.phone || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">Mã tin đăng</p>
                      <p className="text-sm font-black text-slate-700 dark:text-slate-300">#{compareItem.id.substring(0, 8)}</p>
                    </div>
                  </div>

                  {/* Grid Layout Side-by-Side */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* COLUMN LEFT: OLD INFO */}
                    <div className="bg-slate-50/50 dark:bg-slate-800/10 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
                      <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                          🔴 Dữ liệu hiện tại (Công khai)
                        </span>
                      </div>
                      <div className="p-5 space-y-4 text-xs font-bold text-slate-600 dark:text-slate-300">
                        {/* Image */}
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Ảnh đại diện</p>
                          <div className="w-full aspect-video rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                            {compareItem.image_url ? (
                              <img src={compareItem.image_url} alt="old" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon className="w-10 h-10" /></div>
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                          <div className={`p-3 rounded-xl border ${compareItem.title !== compareItem.pending_edit_data?.title ? 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30' : 'border-slate-100 dark:border-slate-800'}`}>
                            <p className="text-[10px] text-slate-400 uppercase mb-1">Tiêu đề tin đăng</p>
                            <p className={`text-sm font-black text-slate-900 dark:text-white ${compareItem.title !== compareItem.pending_edit_data?.title ? 'line-through text-rose-700 dark:text-rose-400' : ''}`}>{compareItem.title}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className={`p-3 rounded-xl border ${compareItem.price !== compareItem.pending_edit_data?.price ? 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30' : 'border-slate-100 dark:border-slate-800'}`}>
                              <p className="text-[10px] text-slate-400 uppercase mb-1">Giá thuê / tháng</p>
                              <p className={`text-sm font-black text-slate-900 dark:text-white ${compareItem.price !== compareItem.pending_edit_data?.price ? 'line-through text-rose-700 dark:text-rose-400' : ''}`}>{compareItem.price.toLocaleString('vi-VN')} đ</p>
                            </div>
                            <div className={`p-3 rounded-xl border ${compareItem.area !== compareItem.pending_edit_data?.area ? 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30' : 'border-slate-100 dark:border-slate-800'}`}>
                              <p className="text-[10px] text-slate-400 uppercase mb-1">Diện tích</p>
                              <p className={`text-sm font-black text-slate-900 dark:text-white ${compareItem.area !== compareItem.pending_edit_data?.area ? 'line-through text-rose-700 dark:text-rose-400' : ''}`}>{compareItem.area || 'N/A'} m²</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className={`p-3 rounded-xl border ${compareItem.type !== compareItem.pending_edit_data?.type ? 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30' : 'border-slate-100 dark:border-slate-800'}`}>
                              <p className="text-[10px] text-slate-400 uppercase mb-1">Loại phòng</p>
                              <p className={`text-sm font-black text-slate-900 dark:text-white ${compareItem.type !== compareItem.pending_edit_data?.type ? 'line-through text-rose-700 dark:text-rose-400' : ''}`}>{compareItem.type}</p>
                            </div>
                            <div className={`p-3 rounded-xl border ${compareItem.location !== compareItem.pending_edit_data?.location ? 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30' : 'border-slate-100 dark:border-slate-800'}`}>
                              <p className="text-[10px] text-slate-400 uppercase mb-1">Vị trí (Quận)</p>
                              <p className={`text-sm font-black text-slate-900 dark:text-white ${compareItem.location !== compareItem.pending_edit_data?.location ? 'line-through text-rose-700 dark:text-rose-400' : ''}`}>{compareItem.location || 'N/A'}</p>
                            </div>
                          </div>

                          <div className={`p-3 rounded-xl border ${compareItem.street !== compareItem.pending_edit_data?.street ? 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30' : 'border-slate-100 dark:border-slate-800'}`}>
                            <p className="text-[10px] text-slate-400 uppercase mb-1">Đường / Số nhà</p>
                            <p className={`text-sm font-black text-slate-900 dark:text-white ${compareItem.street !== compareItem.pending_edit_data?.street ? 'line-through text-rose-700 dark:text-rose-400' : ''}`}>{compareItem.street || 'N/A'}</p>
                          </div>

                          {/* Utilities */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className={`p-3 rounded-xl border ${compareItem.electricity_price !== compareItem.pending_edit_data?.electricity_price ? 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30' : 'border-slate-100 dark:border-slate-800'}`}>
                              <p className="text-[10px] text-slate-400 uppercase mb-1">Giá điện / kwh</p>
                              <p className={`text-sm font-black text-slate-900 dark:text-white ${compareItem.electricity_price !== compareItem.pending_edit_data?.electricity_price ? 'line-through text-rose-700 dark:text-rose-400' : ''}`}>{compareItem.electricity_price?.toLocaleString('vi-VN') || 3500} đ</p>
                            </div>
                            <div className={`p-3 rounded-xl border ${compareItem.water_price !== compareItem.pending_edit_data?.water_price ? 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30' : 'border-slate-100 dark:border-slate-800'}`}>
                              <p className="text-[10px] text-slate-400 uppercase mb-1">Giá nước / m³</p>
                              <p className={`text-sm font-black text-slate-900 dark:text-white ${compareItem.water_price !== compareItem.pending_edit_data?.water_price ? 'line-through text-rose-700 dark:text-rose-400' : ''}`}>{compareItem.water_price?.toLocaleString('vi-VN') || 20000} đ</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className={`p-3 rounded-xl border ${compareItem.service_fee !== compareItem.pending_edit_data?.service_fee ? 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30' : 'border-slate-100 dark:border-slate-808'}`}>
                              <p className="text-[10px] text-slate-400 uppercase mb-1">Phí dịch vụ / phòng</p>
                              <p className={`text-sm font-black text-slate-900 dark:text-white ${compareItem.service_fee !== compareItem.pending_edit_data?.service_fee ? 'line-through text-rose-700 dark:text-rose-400' : ''}`}>{compareItem.service_fee?.toLocaleString('vi-VN') || 150000} đ</p>
                            </div>
                            <div className={`p-3 rounded-xl border ${compareItem.deposit !== compareItem.pending_edit_data?.deposit ? 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30' : 'border-slate-100 dark:border-slate-808'}`}>
                              <p className="text-[10px] text-slate-400 uppercase mb-1">Tiền đặt cọc</p>
                              <p className={`text-sm font-black text-slate-900 dark:text-white ${compareItem.deposit !== compareItem.pending_edit_data?.deposit ? 'line-through text-rose-700 dark:text-rose-400' : ''}`}>{compareItem.deposit?.toLocaleString('vi-VN') || 0} đ</p>
                            </div>
                          </div>

                          <div className={`p-3 rounded-xl border ${compareItem.description !== compareItem.pending_edit_data?.description ? 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30' : 'border-slate-100 dark:border-slate-808'}`}>
                            <p className="text-[10px] text-slate-400 uppercase mb-1">Mô tả phòng</p>
                            <p className={`text-xs leading-relaxed ${compareItem.description !== compareItem.pending_edit_data?.description ? 'line-through text-rose-700 dark:text-rose-400' : ''}`}>{compareItem.description || 'Không có mô tả'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* COLUMN RIGHT: PROPOSED NEW INFO */}
                    <div className="bg-slate-50/50 dark:bg-slate-800/10 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
                      <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                          🟢 Dữ liệu mới đề xuất (Chờ duyệt)
                        </span>
                        <span className="bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">Mới</span>
                      </div>
                      <div className="p-5 space-y-4 text-xs font-bold text-slate-600 dark:text-slate-300">
                        {/* Image */}
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Ảnh đại diện</p>
                          <div className="w-full aspect-video rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                            {compareItem.pending_edit_data?.image_url ? (
                              <img src={compareItem.pending_edit_data.image_url} alt="new" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon className="w-10 h-10" /></div>
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                          <div className={`p-3 rounded-xl border ${compareItem.title !== compareItem.pending_edit_data?.title ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60' : 'border-slate-100 dark:border-slate-808'}`}>
                            <p className="text-[10px] text-slate-400 uppercase mb-1">Tiêu đề tin đăng</p>
                            <p className={`text-sm font-black ${compareItem.title !== compareItem.pending_edit_data?.title ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>{compareItem.pending_edit_data?.title}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className={`p-3 rounded-xl border ${compareItem.price !== compareItem.pending_edit_data?.price ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60' : 'border-slate-100 dark:border-slate-808'}`}>
                              <p className="text-[10px] text-slate-400 uppercase mb-1">Giá thuê / tháng</p>
                              <p className={`text-sm font-black ${compareItem.price !== compareItem.pending_edit_data?.price ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>{compareItem.pending_edit_data?.price?.toLocaleString('vi-VN')} đ</p>
                            </div>
                            <div className={`p-3 rounded-xl border ${compareItem.area !== compareItem.pending_edit_data?.area ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60' : 'border-slate-100 dark:border-slate-808'}`}>
                              <p className="text-[10px] text-slate-400 uppercase mb-1">Diện tích</p>
                              <p className={`text-sm font-black ${compareItem.area !== compareItem.pending_edit_data?.area ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>{compareItem.pending_edit_data?.area || 'N/A'} m²</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className={`p-3 rounded-xl border ${compareItem.type !== compareItem.pending_edit_data?.type ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60' : 'border-slate-100 dark:border-slate-808'}`}>
                              <p className="text-[10px] text-slate-400 uppercase mb-1">Loại phòng</p>
                              <p className={`text-sm font-black ${compareItem.type !== compareItem.pending_edit_data?.type ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>{compareItem.pending_edit_data?.type}</p>
                            </div>
                            <div className={`p-3 rounded-xl border ${compareItem.location !== compareItem.pending_edit_data?.location ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60' : 'border-slate-100 dark:border-slate-808'}`}>
                              <p className="text-[10px] text-slate-400 uppercase mb-1">Vị trí (Quận)</p>
                              <p className={`text-sm font-black ${compareItem.location !== compareItem.pending_edit_data?.location ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>{compareItem.pending_edit_data?.location || 'N/A'}</p>
                            </div>
                          </div>

                          <div className={`p-3 rounded-xl border ${compareItem.street !== compareItem.pending_edit_data?.street ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60' : 'border-slate-100 dark:border-slate-808'}`}>
                            <p className="text-[10px] text-slate-400 uppercase mb-1">Đường / Số nhà</p>
                            <p className={`text-sm font-black ${compareItem.street !== compareItem.pending_edit_data?.street ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>{compareItem.pending_edit_data?.street || 'N/A'}</p>
                          </div>

                          {/* Utilities */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className={`p-3 rounded-xl border ${compareItem.electricity_price !== compareItem.pending_edit_data?.electricity_price ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60' : 'border-slate-100 dark:border-slate-808'}`}>
                              <p className="text-[10px] text-slate-400 uppercase mb-1">Giá điện / kwh</p>
                              <p className={`text-sm font-black ${compareItem.electricity_price !== compareItem.pending_edit_data?.electricity_price ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>{compareItem.pending_edit_data?.electricity_price?.toLocaleString('vi-VN') || 3500} đ</p>
                            </div>
                            <div className={`p-3 rounded-xl border ${compareItem.water_price !== compareItem.pending_edit_data?.water_price ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60' : 'border-slate-100 dark:border-slate-808'}`}>
                              <p className="text-[10px] text-slate-400 uppercase mb-1">Giá nước / m³</p>
                              <p className={`text-sm font-black ${compareItem.water_price !== compareItem.pending_edit_data?.water_price ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>{compareItem.pending_edit_data?.water_price?.toLocaleString('vi-VN') || 20000} đ</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className={`p-3 rounded-xl border ${compareItem.service_fee !== compareItem.pending_edit_data?.service_fee ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60' : 'border-slate-100 dark:border-slate-808'}`}>
                              <p className="text-[10px] text-slate-400 uppercase mb-1">Phí dịch vụ / phòng</p>
                              <p className={`text-sm font-black ${compareItem.service_fee !== compareItem.pending_edit_data?.service_fee ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>{compareItem.pending_edit_data?.service_fee?.toLocaleString('vi-VN') || 150000} đ</p>
                            </div>
                            <div className={`p-3 rounded-xl border ${compareItem.deposit !== compareItem.pending_edit_data?.deposit ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60' : 'border-slate-100 dark:border-slate-808'}`}>
                              <p className="text-[10px] text-slate-400 uppercase mb-1">Tiền đặt cọc</p>
                              <p className={`text-sm font-black ${compareItem.deposit !== compareItem.pending_edit_data?.deposit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>{compareItem.pending_edit_data?.deposit?.toLocaleString('vi-VN') || 0} đ</p>
                            </div>
                          </div>

                          <div className={`p-3 rounded-xl border ${compareItem.description !== compareItem.pending_edit_data?.description ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60' : 'border-slate-100 dark:border-slate-808'}`}>
                            <p className="text-[10px] text-slate-400 uppercase mb-1">Mô tả phòng</p>
                            <p className={`text-xs leading-relaxed ${compareItem.description !== compareItem.pending_edit_data?.description ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-900 dark:text-white'}`}>{compareItem.pending_edit_data?.description || 'Không có mô tả'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                  <button onClick={() => setCompareItem(null)} className="px-6 py-2.5 text-sm font-bold text-slate-650 hover:bg-slate-200 dark:hover:bg-slate-850 rounded-xl transition-colors">Đóng</button>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        setRejectEditModal({ isOpen: true, id: compareItem.id });
                        setCompareItem(null);
                      }}
                      className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30 rounded-xl text-sm font-black flex items-center gap-2 uppercase tracking-tight"
                    >
                      <XCircle className="w-4 h-4" /> Từ chối chỉnh sửa
                    </button>
                    <button 
                      onClick={() => {
                        if (handleApproveListingEdit) {
                          handleApproveListingEdit(compareItem.id);
                        }
                        setCompareItem(null);
                      }}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-black shadow-lg shadow-emerald-600/20 flex items-center gap-2 uppercase tracking-tight"
                    >
                      <CheckCircle className="w-4 h-4" /> Phê duyệt & Áp dụng
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL TỪ CHỐI CHỈNH SỬA */}
        <AnimatePresence>
          {rejectEditModal && (
            <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <span className="p-1.5 bg-red-100 dark:bg-red-950/30 text-red-600 rounded-lg"><XCircle className="w-5 h-5" /></span>
                    <span className="text-slate-900 dark:text-white font-display">Từ chối chỉnh sửa</span>
                  </h2>
                  <button onClick={() => setRejectEditModal(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-4 font-bold">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Lý do từ chối chỉnh sửa:</label>
                    <select 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                      value={rejectEditReasonType}
                      onChange={(e) => setRejectEditReasonType(e.target.value)}
                    >
                      <option value="Thông tin sửa đổi không chính xác">Thông tin sửa đổi không chính xác</option>
                      <option value="Hình ảnh không phù hợp hoặc mờ">Hình ảnh không phù hợp hoặc mờ</option>
                      <option value="Thay đổi giá thuê quá cao đột biến">Thay đổi giá thuê quá cao đột biến</option>
                      <option value="Lí do khác">Lí do khác...</option>
                    </select>
                  </div>
                  
                  {rejectEditReasonType === 'Lí do khác' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 mt-4">Nhập lý do chi tiết:</label>
                      <textarea 
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all min-h-[100px] resize-none"
                        placeholder="Nhập lý do từ chối chỉnh sửa..."
                        value={customEditReason}
                        onChange={(e) => setCustomEditReason(e.target.value)}
                      ></textarea>
                    </motion.div>
                  )}
                  <p className="text-xs text-slate-500 font-medium mt-2">
                    Lý do từ chối sẽ được gửi trực tiếp đến Chủ trọ để cập nhật lại tin đăng.
                  </p>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                  <button onClick={() => setRejectEditModal(null)} className="px-6 py-2.5 text-sm font-bold text-slate-655 hover:bg-slate-200 dark:hover:bg-slate-850 rounded-xl transition-colors">Hủy</button>
                  <button 
                    onClick={() => {
                      const finalReason = rejectEditReasonType === 'Lí do khác' ? customEditReason : rejectEditReasonType;
                      if (handleRejectListingEdit && rejectEditModal) {
                        handleRejectListingEdit(rejectEditModal.id, finalReason);
                      }
                      setRejectEditModal(null);
                      setCustomEditReason('');
                    }} 
                    disabled={rejectEditReasonType === 'Lí do khác' && !customEditReason.trim()}
                    className="px-6 py-2.5 text-sm font-bold bg-red-650 text-white hover:bg-red-700 rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Xác nhận từ chối
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
