import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Search, Edit, Trash2, MapPin, Loader2, CheckCircle, XCircle, ShoppingCart, UserCheck, Shield, Clock, AlertCircle, Home, Eye
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
  handleUpdateStatus: (id: string, status: 'approved' | 'rejected') => void;
  handleEditClick: (item: any) => void;
  handleDeleteListing: (id: string) => void;
  handleUpdateProductStatus: (id: string, status: string) => void;
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
  Page: any;
}

export const AdminListingsTab = ({ 
  listingMode, setListingMode, activeTab, setActiveTab, currentListings, products, 
  loading, actionLoading, handleUpdateStatus, handleEditClick, handleDeleteListing,
  handleUpdateProductStatus, handleEditProductClick, handleDeleteProduct,
  highlightedListingId, getInitials, formatDate, listingStats,
  editingListing, setEditingListing, editForm, setEditForm, handleSaveEdit,
  editingProduct, setEditingProduct, productEditForm, setProductEditForm, handleSaveProductEdit,
  setHighlightedListingId, onNavigate, Page
}: AdminListingsTabProps) => {
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col w-full h-full">
                <div className="mb-8 shrink-0 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Danh sách Tin đăng</h2>
                    <p className="text-slate-500">Quản lý và kiểm duyệt các nội dung đăng tải trên hệ thống.</p>
                  </div>
                  <div className="flex bg-slate-200/50 p-1 rounded-xl w-fit">
                    <button 
                      onClick={() => setListingMode('room')}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${listingMode === 'room' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Phòng trọ
                    </button>
                    <button 
                      onClick={() => setListingMode('product')}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${listingMode === 'product' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Bán hàng
                    </button>
                  </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
                  {listingMode === 'room' ? (
                    <>
                      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                           onClick={() => setActiveTab('pending')}>
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                          <Clock className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">Chờ duyệt</p>
                          <p className="text-2xl font-bold">{loading ? '-' : listingStats.pending}</p>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                           onClick={() => setActiveTab('approved')}>
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">Đã đăng</p>
                          <p className="text-2xl font-bold">{loading ? '-' : listingStats.approved}</p>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                           onClick={() => setActiveTab('rejected')}>
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                          <XCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">Đã từ chối</p>
                          <p className="text-2xl font-bold">{loading ? '-' : listingStats.rejected}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                          <ShoppingCart className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">Tổng sản phẩm</p>
                          <p className="text-2xl font-bold">{loading ? '-' : listingStats.totalProducts}</p>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">Có sẵn</p>
                          <p className="text-2xl font-bold">{loading ? '-' : listingStats.availableProducts}</p>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
                        <div className="p-3 bg-slate-100 text-slate-600 rounded-lg">
                          <XCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">Đã bán</p>
                          <p className="text-2xl font-bold">{loading ? '-' : listingStats.soldProducts}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Filters & Tabs */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col flex-1">
                  {listingMode === 'room' ? (
                    <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 overflow-x-auto shrink-0">
                      <button 
                        onClick={() => setActiveTab('pending')}
                        className={`py-4 px-4 border-b-2 font-bold text-sm whitespace-nowrap ${activeTab === 'pending' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 font-medium'}`}
                      >
                        Chờ duyệt ({loading ? '-' : listingStats.pending})
                      </button>
                      <button 
                        onClick={() => setActiveTab('approved')}
                        className={`py-4 px-4 border-b-2 font-bold text-sm whitespace-nowrap ${activeTab === 'approved' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 font-medium'}`}
                      >
                        Đã đăng ({loading ? '-' : listingStats.approved})
                      </button>
                      <button 
                        onClick={() => setActiveTab('rejected')}
                        className={`py-4 px-4 border-b-2 font-bold text-sm whitespace-nowrap ${activeTab === 'rejected' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 font-medium'}`}
                      >
                        Đã từ chối ({loading ? '-' : listingStats.rejected})
                      </button>
                    </div>
                  ) : (
                    <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 overflow-x-auto shrink-0">
                      <div className="py-4 px-4 font-bold text-sm text-primary">
                        Tất cả bài đăng bán hàng ({loading ? '-' : products.length})
                      </div>
                    </div>
                  )}
                  
                  <div className="overflow-x-auto min-h-[300px] flex-1">
                    {loading ? (
                      <div className="flex items-center justify-center h-64 text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    ) : (listingMode === 'room' ? currentListings : products).length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <AlertCircle className="w-12 h-12 mb-4 text-slate-300" />
                        <p>Không có {listingMode === 'room' ? 'tin đăng' : 'sản phẩm'} nào ở trạng thái này.</p>
                      </div>
                    ) : listingMode === 'room' ? (
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hình ảnh</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tiêu đề</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Người đăng</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày đăng</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                          {currentListings.map((listing) => (
                            <tr key={listing.id} 
                                onClick={() => listing.id === highlightedListingId && setHighlightedListingId(null)}
                                className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all ${
                                  listing.id === highlightedListingId ? 'bg-orange-50/80 dark:bg-orange-900/20 ring-2 ring-inset ring-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : ''
                                }`}>
                              <td className="px-6 py-4">
                                <div className="w-16 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                                  {listing.image_url ? (
                                    <img className="w-full h-full object-cover" alt={listing.title} src={listing.image_url}/>
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                                      <Home className="w-5 h-5" />
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{listing.title}</div>
                                <div className="text-xs text-slate-500 italic mt-0.5">{listing.type} • {listing.location}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 overflow-hidden border border-white">
                                    {listing.ownerInfo?.avatar_url ? (
                                      <img src={listing.ownerInfo.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                                    ) : (
                                      getInitials(listing.ownerInfo?.full_name)
                                    )}
                                  </div>
                                  <div className="text-xs">
                                    <div className="font-bold text-slate-900">{listing.ownerInfo?.full_name || 'N/A'}</div>
                                    <div className="text-slate-500">{listing.ownerInfo?.phone || 'N/A'}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                                {formatDate(listing.created_at)}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                  listing.approval_status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                                  listing.approval_status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                  'bg-orange-100 text-orange-700'
                                }`}>
                                  {listing.approval_status === 'approved' ? 'Đã duyệt' : 
                                   listing.approval_status === 'rejected' ? 'Đã từ chối' : 'Chờ duyệt'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                {actionLoading === listing.id ? (
                                  <Loader2 className="w-5 h-5 animate-spin text-primary ml-auto" />
                                ) : (
                                  <div className="flex items-center justify-end gap-1">
                                    <button onClick={() => handleEditClick(listing)} 
                                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded transition-all" title="Chỉnh sửa nhanh">
                                      <Edit className="w-5 h-5" />
                                    </button>
                                    <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded transition-all" title="Xem chi tiết"
                                            onClick={() => onNavigate('listing-detail')}>
                                      <Eye className="w-5 h-5" />
                                    </button>
                                    {listing.approval_status !== 'approved' && (
                                      <button onClick={() => handleUpdateStatus(listing.id, 'approved')} 
                                              className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-100 rounded transition-all" title="Phê duyệt">
                                        <CheckCircle className="w-5 h-5" />
                                      </button>
                                    )}
                                    {listing.approval_status === 'pending' && (
                                      <button onClick={() => handleUpdateStatus(listing.id, 'rejected')} 
                                              className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-100 rounded transition-all" title="Từ chối">
                                        <XCircle className="w-5 h-5" />
                                      </button>
                                    )}
                                    <button onClick={() => handleDeleteListing(listing.id)} 
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded transition-all" title="Xóa">
                                      <Trash2 className="w-5 h-5" />
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hình ảnh</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tên sản phẩm</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Danh mục</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Giá bán</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Người bán</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                          {products.map((product) => (
                            <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all">
                              <td className="px-6 py-4">
                                <div className="w-16 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                                  {product.image_url ? (
                                    <img className="w-full h-full object-cover" alt={product.title} src={product.image_url}/>
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                                      <Home className="w-5 h-5" />
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{product.title}</div>
                                <div className="text-xs text-slate-500 italic mt-0.5">{product.condition}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">
                                  {product.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm font-bold text-primary">
                                {product.price.toLocaleString('vi-VN')}đ
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 overflow-hidden border border-white">
                                      {product.ownerInfo?.avatar_url ? (
                                        <img src={product.ownerInfo.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                                      ) : (
                                        getInitials(product.ownerInfo?.full_name)
                                      )}
                                    </div>
                                    <div className="text-xs">
                                      <div className="font-bold text-slate-900">{product.ownerInfo?.full_name || 'N/A'}</div>
                                      <div className="text-slate-500">{product.ownerInfo?.phone || 'N/A'}</div>
                                    </div>
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                    product.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    {product.status === 'available' ? 'Có sẵn' : 'Đã bán'}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex items-center justify-end gap-1">
                                    <button onClick={() => handleEditProductClick(product)} 
                                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded transition-all" title="Chỉnh sửa sản phẩm">
                                      <Edit className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleUpdateProductStatus(product.id, product.status === 'available' ? 'sold' : 'available')} 
                                            className={`p-1.5 rounded transition-all ${product.status === 'available' ? 'text-slate-400 hover:text-orange-600 hover:bg-orange-100' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-100'}`}
                                            title={product.status === 'available' ? 'Đánh dấu đã bán' : 'Đánh dấu có sẵn'}>
                                      {product.status === 'available' ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                    </button>
                                    <button onClick={() => handleDeleteProduct(product.id)} 
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded transition-all" title="Xóa">
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
                {editingListing && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
                      <div className="p-6 border-b border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900">Chỉnh sửa Tin đăng</h3>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Tiêu đề</label>
                          <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" 
                            value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Giá thuê (VND)</label>
                          <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" 
                            value={editForm.price} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Loại phòng</label>
                          <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" 
                            placeholder="Ví dụ: Phòng trọ, Căn hộ..."
                            value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Vị trí (Khu vực)</label>
                          <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" 
                            placeholder="Ví dụ: Quận Thanh Khê, Đà Nẵng"
                            value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} />
                        </div>
                      </div>
                      <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                        <button onClick={() => setEditingListing(null)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Hủy</button>
                        <button onClick={handleSaveEdit} disabled={actionLoading === 'saving'} className="px-4 py-2 text-sm font-bold bg-primary text-white hover:bg-primary-hover rounded-lg flex items-center gap-2 transition-colors">
                          {actionLoading === 'saving' && <Loader2 className="w-4 h-4 animate-spin"/>}
                          Lưu thay đổi
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODAL SỬA SẢN PHẨM */}
                {editingProduct && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
                      <div className="p-6 border-b border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900">Chỉnh sửa Sản phẩm</h3>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Tên sản phẩm</label>
                          <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" 
                            value={productEditForm.title} onChange={e => setProductEditForm({...productEditForm, title: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Giá bán (VND)</label>
                          <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" 
                            value={productEditForm.price} onChange={e => setProductEditForm({...productEditForm, price: Number(e.target.value)})} />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Danh mục</label>
                          <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" 
                            value={productEditForm.category} onChange={e => setProductEditForm({...productEditForm, category: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Tình trạng</label>
                          <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" 
                            value={productEditForm.condition} onChange={e => setProductEditForm({...productEditForm, condition: e.target.value})} />
                        </div>
                      </div>
                      <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                        <button onClick={() => setEditingProduct(null)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Hủy</button>
                        <button onClick={handleSaveProductEdit} disabled={actionLoading === 'saving-product'} className="px-4 py-2 text-sm font-bold bg-primary text-white hover:bg-primary-hover rounded-lg flex items-center gap-2 transition-colors">
                          {actionLoading === 'saving-product' && <Loader2 className="w-4 h-4 animate-spin"/>}
                          Lưu thay đổi
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
    </>
  );
};
