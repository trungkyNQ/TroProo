import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Search, Edit, Trash2, Loader2, Phone, Mail, Shield, CheckCircle, Eye, Plus, Home, UserCheck, XCircle, PhoneCall
} from 'lucide-react';

interface AdminUsersTabProps {
  userFilter: 'all' | 'landlord' | 'tenant' | 'admin';
  setUserFilter: (filter: 'all' | 'landlord' | 'tenant' | 'admin') => void;
  currentUsers: any[];
  userStats: any;
  loading: boolean;
  actionLoading: string | null;
  handleEditUserClick: (user: any) => void;
  handleDeleteUser: (id: string) => void;
  setViewingUser: (user: any) => void;
  getInitials: (name?: string) => string;
  formatDate: (date: string) => string;
  editingUser: any;
  setEditingUser: (user: any) => void;
  userEditForm: any;
  setUserEditForm: (form: any) => void;
  handleSaveUserEdit: () => void;
  viewingUser: any;
}

export const AdminUsersTab = ({ 
  userFilter, setUserFilter, currentUsers, userStats, loading, actionLoading,
  handleEditUserClick, handleDeleteUser, setViewingUser,
  getInitials, formatDate,
  editingUser, setEditingUser, userEditForm, setUserEditForm, handleSaveUserEdit,
  viewingUser
}: AdminUsersTabProps) => {
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col w-full h-full">
                <div className="mb-8 shrink-0 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Quản lý Thành viên</h2>
                    <p className="text-slate-500">Xem và quản lý tất cả người dùng trong hệ thống.</p>
                  </div>
                </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 shrink-0">
          <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${userFilter === 'all' ? 'border-primary ring-1 ring-primary' : 'border-slate-200'}`}
               onClick={() => setUserFilter('all')}>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Tổng cộng</p>
              <p className="text-2xl font-black text-slate-900">{loading ? '-' : userStats.total}</p>
            </div>
          </div>
          
          <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${userFilter === 'landlord' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200'}`}
               onClick={() => setUserFilter('landlord')}>
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Chủ trọ</p>
              <p className="text-2xl font-black text-slate-900">{loading ? '-' : userStats.landlord}</p>
            </div>
          </div>

          <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${userFilter === 'tenant' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200'}`}
               onClick={() => setUserFilter('tenant')}>
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Người thuê</p>
              <p className="text-2xl font-black text-slate-900">{loading ? '-' : userStats.tenant}</p>
            </div>
          </div>

          <div className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${userFilter === 'admin' ? 'border-purple-500 ring-1 ring-purple-500' : 'border-slate-200'}`}
               onClick={() => setUserFilter('admin')}>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">Quản trị</p>
              <p className="text-2xl font-black text-slate-900">{loading ? '-' : userStats.admin}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col flex-1 min-h-0">
          <div className="flex border-b border-slate-200 px-6 shrink-0 bg-slate-50/50">
            {['all', 'landlord', 'tenant', 'admin'].map((filter) => (
              <button 
                key={filter}
                onClick={() => setUserFilter(filter as any)}
                className={`py-4 px-6 border-b-2 font-black text-sm whitespace-nowrap uppercase transition-all ${
                  userFilter === filter 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 font-bold'
                }`}
              >
                {filter === 'all' ? 'Tất cả' : filter === 'landlord' ? 'Chủ trọ' : filter === 'tenant' ? 'Người thuê' : 'Quản trị'}
              </button>
            ))}
          </div>
          <div className="overflow-auto flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="font-bold">Đang tải danh sách...</p>
              </div>
            ) : currentUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400 text-center p-8">
                <Users className="w-12 h-12 mb-4 text-slate-200 mx-auto" />
                <p className="font-bold">Không tìm thấy thành viên nào phù hợp.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 sticky top-0 z-10 text-slate-500 text-xs font-black uppercase tracking-wider">
                    <th className="px-6 py-4">Người dùng</th>
                    <th className="px-6 py-4">Vai trò</th>
                    <th className="px-6 py-4">Liên hệ</th>
                    <th className="px-6 py-4">Ngày tham gia</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                        <tbody className="divide-y divide-slate-200">
                          {currentUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                                    {user.avatar_url ? (
                                      <img src={user.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                                    ) : (
                                      getInitials(user.full_name)
                                    )}
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-slate-900 line-clamp-1">{user.full_name || 'Chưa cập nhật'}</div>
                                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{user.id.substring(0,8)}...</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold capitalize ${
                                  user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 
                                  user.role === 'landlord' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                                }`}>
                                  {user.role === 'admin' && <Shield className="w-3 h-3" />}
                                  {user.role === 'landlord' && <Home className="w-3 h-3" />}
                                  {user.role === 'tenant' && <UserCheck className="w-3 h-3" />}
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-600 border-b border-slate-100 pb-1 mb-1">
                                  <Phone className="w-4 h-4 text-primary" /> {user.phone || 'Chưa cung cấp'}
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium">SĐT liên hệ chính</p>
                              </td>
                              <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                                {formatDate(user.created_at)}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button onClick={() => setViewingUser(user)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded transition-all" title="Xem thông tin chi tiết">
                                    <Eye className="w-5 h-5" />
                                  </button>
                                  <button onClick={() => handleEditUserClick(user)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded transition-all" title="Sửa thông tin">
                                    <Edit className="w-5 h-5" />
                                  </button>
                                  <button onClick={() => handleDeleteUser(user.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded transition-all" title="Xóa người dùng">
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

                {/* MODAL SỬA NGƯỜI DÙNG */}
                {editingUser && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 relative">
                        <h3 className="text-xl font-bold text-slate-900">Sửa thông tin người dùng</h3>
                        <button onClick={() => setEditingUser(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Họ và tên</label>
                          <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                            value={userEditForm.full_name} onChange={e => setUserEditForm({...userEditForm, full_name: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Số điện thoại</label>
                          <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                            value={userEditForm.phone} onChange={e => setUserEditForm({...userEditForm, phone: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Vai trò hệ thống</label>
                          <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all appearance-none"
                            value={userEditForm.role} onChange={e => setUserEditForm({...userEditForm, role: e.target.value as any})}>
                            <option value="tenant">Tenant (Người thuê)</option>
                            <option value="landlord">Landlord (Chủ trọ)</option>
                            <option value="admin">Admin (Quản trị viên)</option>
                          </select>
                        </div>
                      </div>
                      <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                        <button onClick={() => setEditingUser(null)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Hủy</button>
                        <button onClick={handleSaveUserEdit} disabled={actionLoading === 'saving-user'} className="px-6 py-2.5 text-sm font-black bg-primary text-white hover:bg-primary-hover rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95">
                          {actionLoading === 'saving-user' && <Loader2 className="w-4 h-4 animate-spin"/>}
                          Lưu chỉnh sửa
                        </button>
                      </div>
                    </div>
                  </div>
                )}


                {/* MODAL XEM CHI TIẾT NGƯỜI DÙNG */}
                {viewingUser && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto" onClick={() => setViewingUser(null)}>
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                      {/* Modal Header */}
                      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 rounded-t-3xl bg-slate-50/50 relative flex-shrink-0">
                        <h2 className="text-xl font-bold flex items-center gap-3">
                          <span className="text-slate-900">Chi tiết người dùng</span>
                          <span className="px-2.5 py-1 text-sm font-black uppercase tracking-widest text-primary bg-primary/10 rounded-lg">
                            {viewingUser.role}
                          </span>
                        </h2>
                        <button onClick={() => setViewingUser(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors absolute right-4 top-1/2 -translate-y-1/2">
                          <XCircle className="w-6 h-6" />
                        </button>
                      </div>

                      {/* Modal Body - Scrollable */}
                      <div className="overflow-y-auto flex-1 p-8 space-y-6">
                        
                        {/* Section: Liên hệ & Cơ bản */}
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5" />Thông tin cơ bản
                          </p>
                          <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500 font-medium">Số điện thoại</span>
                              <span className="font-bold text-slate-900">{viewingUser.phone || <span className="text-slate-400 font-normal italic">Chưa có</span>}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500 font-medium">Zalo</span>
                              <span className="font-bold text-slate-900">{viewingUser.zalo_phone || <span className="text-slate-400 font-normal italic">Chưa có</span>}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500 font-medium">Giới tính</span>
                              <span className="font-bold text-slate-900">{viewingUser.gender === 'male' ? 'Nam' : viewingUser.gender === 'female' ? 'Nữ' : viewingUser.gender === 'other' ? 'Khác' : <span className="text-slate-400 font-normal italic">Chưa có</span>}</span>
                            </div>
                            <div className="flex justify-between text-sm gap-4">
                              <span className="text-slate-500 font-medium flex-shrink-0">Thường trú</span>
                              <span className="font-bold text-slate-900 text-right">{viewingUser.permanent_address || <span className="text-slate-400 font-normal italic">Chưa có</span>}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500 font-medium">Ngày sinh</span>
                              <span className="font-bold text-slate-900">{viewingUser.birth_date ? formatDate(viewingUser.birth_date).split(' ')[0] : <span className="text-slate-400 font-normal italic">Chưa có</span>}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500 font-medium">Ngày gia nhập</span>
                              <span className="font-bold text-slate-900">{formatDate(viewingUser.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Section: Định danh */}
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5" />Định danh (CCCD/CMND)
                          </p>
                          <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500 font-medium">Số CCCD</span>
                              <span className="font-bold text-slate-900 font-mono tracking-wider">{viewingUser.id_card_number || <span className="text-slate-400 font-normal italic tracking-normal">Chưa có</span>}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500 font-medium">Ngày cấp</span>
                              <span className="font-bold text-slate-900">{viewingUser.id_card_date ? formatDate(viewingUser.id_card_date).split(' ')[0] : <span className="text-slate-400 font-normal italic">Chưa có</span>}</span>
                            </div>
                            <div className="flex justify-between text-sm gap-4">
                              <span className="text-slate-500 font-medium flex-shrink-0">Nơi cấp</span>
                              <span className="font-bold text-slate-900 text-right">{viewingUser.id_card_place || <span className="text-slate-400 font-normal italic">Chưa có</span>}</span>
                            </div>
                          </div>
                        </div>

                        {/* Section: Ngân hàng */}
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <UserCheck className="w-3.5 h-3.5" />Thông tin thanh toán
                          </p>
                          <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500 font-medium">Ngân hàng</span>
                              <span className="font-bold text-slate-900">{viewingUser.bank_name || <span className="text-slate-400 font-normal italic">Chưa có</span>}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500 font-medium">Số tài khoản</span>
                              <span className="font-bold text-slate-900 font-mono tracking-wider">{viewingUser.bank_account_number || <span className="text-slate-400 font-normal italic tracking-normal">Chưa có</span>}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500 font-medium">Chủ tài khoản</span>
                              <span className="font-bold text-slate-900 uppercase">{viewingUser.bank_account_name || <span className="text-slate-400 font-normal italic normal-case">Chưa có</span>}</span>
                            </div>
                          </div>
                        </div>

                        {/* Section: Liên hệ khẩn cấp */}
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <PhoneCall className="w-3.5 h-3.5" />Liên hệ khẩn cấp
                          </p>
                          <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500 font-medium">Người liên hệ</span>
                              <span className="font-bold text-slate-900">{viewingUser.emergency_contact_name || <span className="text-slate-400 font-normal italic">Chưa có</span>}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500 font-medium">SĐT Khẩn cấp</span>
                              <span className="font-bold text-slate-900">{viewingUser.emergency_contact_phone || <span className="text-slate-400 font-normal italic">Chưa có</span>}</span>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Modal Footer */}
                      <div className="border-t border-slate-100 p-6 flex gap-3 flex-shrink-0">
                        <button onClick={() => { handleEditUserClick(viewingUser); setViewingUser(null); }} className="flex-1 py-3 rounded-xl border border-primary/20 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
                          <Edit className="w-4 h-4" />Sửa quyền / Cơ bản
                        </button>
                        <button onClick={() => setViewingUser(null)} className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                          Đóng
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
    </>
  );
};
