import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Search, Edit, Trash2, Loader2, Phone, Mail, Shield, CheckCircle, 
  Eye, Plus, Home, UserCheck, XCircle, PhoneCall, Crown, Sparkles, 
  MessageSquare, Calendar, CreditCard, Fingerprint, MapPin, User, 
  ShieldCheck, Copy, Check, FilterX
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

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
  const { showToast } = useToast();
  
  // Local Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female' | 'other'>('all');
  const [selectedTier, setSelectedTier] = useState<'all' | 'free' | 'pro' | 'enterprise'>('all');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Copy to Clipboard Utility
  const handleCopy = (text: string, fieldKey: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    showToast(`Đã sao chép ${label}`, 'success');
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Reset all local filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGender('all');
    setSelectedTier('all');
    showToast('Đã đặt lại bộ lọc', 'info');
  };

  // Instant local filtering on currentUsers
  const filteredUsers = useMemo(() => {
    return currentUsers.filter(u => {
      // 1. Text Search Query
      const searchLower = searchQuery.toLowerCase().trim();
      const nameMatch = u.full_name?.toLowerCase().includes(searchLower);
      const phoneMatch = u.phone?.toLowerCase().includes(searchLower);
      const idMatch = u.id?.toLowerCase().includes(searchLower);
      const cccdMatch = u.id_card_number?.toLowerCase().includes(searchLower);
      const bankNumMatch = u.bank_account_number?.toLowerCase().includes(searchLower);
      const bankNameMatch = u.bank_account_name?.toLowerCase().includes(searchLower);
      const bankBrandMatch = u.bank_name?.toLowerCase().includes(searchLower);
      
      const matchesSearch = !searchLower || 
        nameMatch || 
        phoneMatch || 
        idMatch || 
        cccdMatch || 
        bankNumMatch || 
        bankNameMatch || 
        bankBrandMatch;

      // 2. Gender Match
      const matchesGender = selectedGender === 'all' || u.gender === selectedGender;

      // 3. Subscription Tier Match
      const matchesTier = selectedTier === 'all' || 
        (selectedTier === 'free' && (!u.subscription_tier || u.subscription_tier === 'free')) ||
        u.subscription_tier === selectedTier;

      return matchesSearch && matchesGender && matchesTier;
    });
  }, [currentUsers, searchQuery, selectedGender, selectedTier]);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex flex-col w-full h-full"
      >
        {/* Title Section */}
        <div className="mb-8 shrink-0 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-display">Quản lý Thành viên</h2>
            <p className="text-slate-500 font-medium mt-1">Phân quyền, tra cứu thông tin cá nhân và quản lý tài khoản người dùng hệ thống.</p>
          </div>
        </div>

        {/* Premium Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 shrink-0">
          {/* Card: All Users */}
          <div 
            className={`bg-white p-6 rounded-3xl border flex items-center gap-5 shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ${
              userFilter === 'all' 
                ? 'border-blue-500 ring-4 ring-blue-50' 
                : 'border-slate-100'
            }`}
            onClick={() => setUserFilter('all')}
          >
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold whitespace-nowrap uppercase tracking-widest">Tổng thành viên</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{loading ? '-' : userStats.total}</p>
            </div>
          </div>
          
          {/* Card: Landlords */}
          <div 
            className={`bg-white p-6 rounded-3xl border flex items-center gap-5 shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ${
              userFilter === 'landlord' 
                ? 'border-orange-500 ring-4 ring-orange-50' 
                : 'border-slate-100'
            }`}
            onClick={() => setUserFilter('landlord')}
          >
            <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold whitespace-nowrap uppercase tracking-widest">Chủ nhà trọ</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{loading ? '-' : userStats.landlord}</p>
            </div>
          </div>

          {/* Card: Tenants */}
          <div 
            className={`bg-white p-6 rounded-3xl border flex items-center gap-5 shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ${
              userFilter === 'tenant' 
                ? 'border-emerald-500 ring-4 ring-emerald-50' 
                : 'border-slate-100'
            }`}
            onClick={() => setUserFilter('tenant')}
          >
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold whitespace-nowrap uppercase tracking-widest">Khách thuê phòng</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{loading ? '-' : userStats.tenant}</p>
            </div>
          </div>

          {/* Card: Admins */}
          <div 
            className={`bg-white p-6 rounded-3xl border flex items-center gap-5 shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ${
              userFilter === 'admin' 
                ? 'border-purple-500 ring-4 ring-purple-50' 
                : 'border-slate-100'
            }`}
            onClick={() => setUserFilter('admin')}
          >
            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold whitespace-nowrap uppercase tracking-widest">Quản trị viên</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{loading ? '-' : userStats.admin}</p>
            </div>
          </div>
        </div>

        {/* Widescreen Filters and Controls Box */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm mb-6 flex flex-col lg:flex-row items-center justify-between gap-4 shrink-0">
          {/* Left Side: Advanced Search input */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Tìm theo tên, SĐT, ID, CCCD, Ngân hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-200"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Right Side: Filters Select Dropdowns */}
          <div className="flex flex-col sm:flex-row items-center w-full lg:w-auto gap-3">
            {/* Gender Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-400 whitespace-nowrap uppercase tracking-wider hidden xl:inline">Giới tính:</span>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value as any)}
                className="w-full sm:w-40 bg-slate-50/80 border border-slate-200/80 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 focus:bg-white focus:border-primary focus:ring-0 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="all">Tất cả giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            {/* Subscription Tier Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-400 whitespace-nowrap uppercase tracking-wider hidden xl:inline">Gói dịch vụ:</span>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value as any)}
                className="w-full sm:w-44 bg-slate-50/80 border border-slate-200/80 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 focus:bg-white focus:border-primary focus:ring-0 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="all">Tất cả gói</option>
                <option value="free">Gói Miễn Phí (Free)</option>
                <option value="pro">Gói Chuyên Nghiệp (Pro)</option>
                <option value="enterprise">Gói Doanh Nghiệp</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            {(searchQuery || selectedGender !== 'all' || selectedTier !== 'all') && (
              <button
                onClick={handleResetFilters}
                className="w-full sm:w-auto px-4 py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <FilterX className="w-4 h-4" />
                Đặt lại
              </button>
            )}
          </div>
        </div>

        {/* Widescreen 100% User Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col flex-1 min-h-0">
          <div className="overflow-auto flex-1">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-6 py-4 border-b border-slate-100 animate-pulse">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl shrink-0" />
                    <div className="flex-1 min-w-0 space-y-2.5">
                      <div className="h-4 bg-slate-100 rounded-lg w-1/3" />
                      <div className="h-3 bg-slate-50 rounded-lg w-1/4" />
                    </div>
                    <div className="w-24 h-6 bg-slate-100 rounded-full" />
                    <div className="w-36 space-y-2 hidden md:block">
                      <div className="h-3 bg-slate-100 rounded w-2/3" />
                    </div>
                    <div className="w-28 h-9 bg-slate-100 rounded-xl ml-auto" />
                  </div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[350px] text-slate-400 text-center p-8 bg-slate-50/20">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-slate-300" />
                </div>
                <p className="font-bold text-slate-600 text-base">Không tìm thấy thành viên nào phù hợp</p>
                <p className="text-slate-400 text-sm mt-1 max-w-sm">Hãy thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại các bộ lọc giới tính/gói dịch vụ.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200/80 sticky top-0 z-10 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-6 py-4.5">Thành viên</th>
                    <th className="px-6 py-4.5">Vai trò hệ thống</th>
                    <th className="px-6 py-4.5">Liên hệ</th>
                    <th className="px-6 py-4.5">Gói dịch vụ</th>
                    <th className="px-6 py-4.5">Ngày gia nhập</th>
                    <th className="px-6 py-4.5 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredUsers.map((user) => {
                    const isPremium = user.subscription_tier === 'pro' || user.subscription_tier === 'enterprise';
                    
                    return (
                      <tr 
                        key={user.id} 
                        className="hover:bg-slate-50/50 group transition-colors duration-200"
                      >
                        {/* Member Identity Column */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3.5">
                            {/* Modern squircle avatar with border & scale effects */}
                            <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-bold text-primary overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-300 shrink-0">
                              {user.avatar_url ? (
                                <img src={user.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                              ) : (
                                <span className="text-slate-500 font-extrabold">{getInitials(user.full_name)}</span>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                <span className="line-clamp-1">{user.full_name || 'Chưa cập nhật'}</span>
                                {user.role === 'admin' && (
                                  <Shield className="w-3.5 h-3.5 text-purple-500" />
                                )}
                              </div>
                              <div className="mt-1 flex items-center gap-1.5">
                                <span className="text-[9px] text-slate-400 font-mono py-0.5 px-1.5 bg-slate-50 border border-slate-100 rounded-md">
                                  ID: {user.id.substring(0, 8)}
                                </span>
                                {user.gender && (
                                  <span className="text-[9px] text-slate-400 font-medium capitalize">
                                    • {user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : 'Khác'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role System Badge Column */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-2xl text-[10px] font-black uppercase tracking-wider ${
                            user.role === 'admin' 
                              ? 'bg-purple-50 text-purple-600 border border-purple-100' : 
                            user.role === 'landlord' 
                              ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                              : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                            {user.role === 'admin' && <Shield className="w-3 h-3" />}
                            {user.role === 'landlord' && <Home className="w-3 h-3" />}
                            {user.role === 'tenant' && <UserCheck className="w-3 h-3" />}
                            {user.role === 'landlord' ? 'Chủ trọ' : user.role === 'tenant' ? 'Người thuê' : 'Quản trị'}
                          </span>
                        </td>

                        {/* Contact Details Column */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {user.phone ? (
                              <div className="flex items-center gap-2">
                                <a 
                                  href={`tel:${user.phone}`} 
                                  className="text-xs font-bold text-slate-700 hover:text-primary flex items-center gap-1 transition-colors"
                                  title="Gọi trực tiếp"
                                >
                                  <Phone className="w-3.5 h-3.5 text-primary" />
                                  <span>{user.phone}</span>
                                </a>
                                {user.zalo_phone && (
                                  <a 
                                    href={`https://zalo.me/${user.zalo_phone.replace('+', '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-0.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md text-[9px] font-extrabold flex items-center gap-0.5 transition-colors"
                                    title="Mở Chat Zalo"
                                  >
                                    <MessageSquare className="w-2.5 h-2.5" />
                                    <span>Zalo</span>
                                  </a>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs italic">Chưa cung cấp</span>
                            )}
                            <p className="text-[9px] text-slate-400 font-medium">Phương thức liên hệ chính</p>
                          </div>
                        </td>

                        {/* Subscription Tier Column */}
                        <td className="px-6 py-4">
                          {user.subscription_tier === 'enterprise' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-violet-500/10 to-indigo-500/10 text-violet-600 border border-violet-200/50">
                              <Crown className="w-3 h-3 text-violet-500 animate-bounce" style={{ animationDuration: '3s' }} />
                              Enterprise
                            </span>
                          ) : user.subscription_tier === 'pro' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-600 border border-orange-200/50">
                              <Sparkles className="w-3 h-3 text-orange-500" />
                              Pro Member
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-50 text-slate-500 border border-slate-200/60">
                              Mặc định (Free)
                            </span>
                          )}
                        </td>

                        {/* Date Joined Column */}
                        <td className="px-6 py-4 text-xs text-slate-500 font-semibold">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{formatDate(user.created_at).split(' ')[0]}</span>
                          </div>
                        </td>

                        {/* Actions Control Column */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Detail Action */}
                            <button 
                              onClick={() => setViewingUser(user)} 
                              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-primary/10 hover:text-primary text-slate-400 flex items-center justify-center transition-all duration-200" 
                              title="Xem chi tiết lý lịch"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Edit System Role Action */}
                            <button 
                              onClick={() => handleEditUserClick(user)} 
                              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-orange-50 hover:text-orange-500 text-slate-400 flex items-center justify-center transition-all duration-200" 
                              title="Thay đổi quyền truy cập"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {/* Delete User Action */}
                            <button 
                              onClick={() => handleDeleteUser(user.id)} 
                              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-400 flex items-center justify-center transition-all duration-200" 
                              title="Xóa vĩnh viễn"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </motion.div>

      {/* ================= MODAL SỬA NGƯỜI DÙNG ================= */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 relative">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Cập nhật tài khoản</h3>
                  <p className="text-xs text-slate-400 font-medium">Thay đổi thông tin cơ bản hoặc quyền hệ thống</p>
                </div>
                <button 
                  onClick={() => setEditingUser(null)} 
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Họ và tên thành viên</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50/80 border-2 border-slate-100 focus:bg-white focus:border-primary focus:ring-0 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:outline-none transition-all"
                    value={userEditForm.full_name} 
                    onChange={e => setUserEditForm({...userEditForm, full_name: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Số điện thoại liên hệ</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50/80 border-2 border-slate-100 focus:bg-white focus:border-primary focus:ring-0 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:outline-none transition-all"
                    value={userEditForm.phone} 
                    onChange={e => setUserEditForm({...userEditForm, phone: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Vai trò hệ thống (Role)</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-slate-50/80 border-2 border-slate-100 focus:bg-white focus:border-primary focus:ring-0 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:outline-none transition-all appearance-none cursor-pointer"
                      value={userEditForm.role} 
                      onChange={e => setUserEditForm({...userEditForm, role: e.target.value as any})}
                    >
                      <option value="tenant">Tenant (Khách thuê phòng)</option>
                      <option value="landlord">Landlord (Chủ nhà trọ)</option>
                      <option value="admin">Admin (Quản trị viên hệ thống)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={() => setEditingUser(null)} 
                  className="px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-500 hover:bg-slate-200/60 rounded-2xl transition-colors"
                >
                  Bỏ qua
                </button>
                <button 
                  onClick={handleSaveUserEdit} 
                  disabled={actionLoading === 'saving-user'} 
                  className="px-6 py-3 text-xs font-black uppercase tracking-widest bg-primary text-white hover:bg-primary-hover rounded-2xl flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-75"
                >
                  {actionLoading === 'saving-user' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin"/>
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>Lưu chỉnh sửa</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* ================= MODAL XEM CHI TIẾT NGƯỜI DÙNG ================= */}
      <AnimatePresence>
        {viewingUser && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto" 
            onClick={() => setViewingUser(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-100" 
              onClick={e => e.stopPropagation()}
            >
              {/* Upper Profile Visual Banner */}
              <div className="bg-gradient-to-r from-primary/10 via-orange-500/5 to-secondary/15 h-36 w-full relative flex-shrink-0">
                <button 
                  onClick={() => setViewingUser(null)} 
                  className="p-2 text-slate-600 hover:text-rose-500 hover:bg-white bg-white/80 rounded-full transition-colors absolute right-5 top-5 z-20 shadow-sm"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Profile Card Overlay */}
              <div className="px-8 pb-4 relative -mt-14 flex flex-col sm:flex-row items-center sm:items-end gap-5 flex-shrink-0 z-10">
                {/* Large Round Avatar */}
                <div className="w-24 h-24 rounded-3xl bg-white border-4 border-white flex items-center justify-center text-2xl font-black text-primary overflow-hidden shadow-lg shrink-0">
                  {viewingUser.avatar_url ? (
                    <img src={viewingUser.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                  ) : (
                    <span className="text-slate-500 font-extrabold">{getInitials(viewingUser.full_name)}</span>
                  )}
                </div>

                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{viewingUser.full_name || 'Chưa cập nhật họ tên'}</h2>
                  <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      viewingUser.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      viewingUser.role === 'landlord' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {viewingUser.role === 'admin' ? 'Quản trị viên' : viewingUser.role === 'landlord' ? 'Chủ nhà trọ' : 'Người thuê phòng'}
                    </span>
                    
                    {viewingUser.subscription_tier === 'enterprise' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-violet-500/10 to-indigo-500/10 text-violet-600 border border-violet-200/50">
                        <Crown className="w-3 h-3 text-violet-500" />
                        Enterprise
                      </span>
                    ) : viewingUser.subscription_tier === 'pro' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-600 border border-orange-200/50">
                        <Sparkles className="w-3 h-3 text-orange-500" />
                        Pro Member
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">
                        Gói cơ bản
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Scrollable Information Cards */}
              <div className="overflow-y-auto flex-1 p-8 pt-4 space-y-6">
                
                {/* 2x2 Clean Modern Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: Basic & Contacts */}
                  <div className="bg-slate-50/80 rounded-3xl p-5 border border-slate-100 relative group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Lý lịch cơ bản
                    </p>
                    <div className="space-y-3.5">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Số điện thoại</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {viewingUser.phone ? (
                            <>
                              <a href={`tel:${viewingUser.phone}`} className="text-sm font-bold text-slate-800 hover:text-primary transition-colors">{viewingUser.phone}</a>
                              <button 
                                onClick={() => handleCopy(viewingUser.phone, 'phone', 'số điện thoại')}
                                className="text-slate-400 hover:text-primary transition-colors p-0.5 rounded"
                                title="Sao chép"
                              >
                                {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </>
                          ) : (
                            <span className="text-slate-400 text-xs italic">Chưa khai báo</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Zalo</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {viewingUser.zalo_phone ? (
                            <>
                              <a 
                                href={`https://zalo.me/${viewingUser.zalo_phone.replace('+', '')}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors"
                              >
                                {viewingUser.zalo_phone}
                              </a>
                              <button 
                                onClick={() => handleCopy(viewingUser.zalo_phone, 'zalo', 'số Zalo')}
                                className="text-slate-400 hover:text-primary transition-colors p-0.5 rounded"
                                title="Sao chép"
                              >
                                {copiedField === 'zalo' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </>
                          ) : (
                            <span className="text-slate-400 text-xs italic">Chưa khai báo</span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm border-t border-slate-200/50 pt-2">
                        <span className="text-slate-500 font-semibold">Giới tính</span>
                        <span className="font-bold text-slate-800">
                          {viewingUser.gender === 'male' ? 'Nam' : viewingUser.gender === 'female' ? 'Nữ' : viewingUser.gender === 'other' ? 'Khác' : <span className="text-slate-400 font-normal italic">Chưa rõ</span>}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-semibold">Ngày sinh</span>
                        <span className="font-bold text-slate-800">
                          {viewingUser.birth_date ? formatDate(viewingUser.birth_date).split(' ')[0] : <span className="text-slate-400 font-normal italic">Chưa rõ</span>}
                        </span>
                      </div>

                      <div className="flex flex-col border-t border-slate-200/50 pt-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hộ khẩu thường trú</span>
                        <span className="text-xs font-bold text-slate-800 mt-1 leading-relaxed">
                          {viewingUser.permanent_address || <span className="text-slate-400 font-normal italic">Chưa khai báo</span>}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Identity Credentials */}
                  <div className="bg-slate-50/80 rounded-3xl p-5 border border-slate-100 relative group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-primary" />
                      Định danh cá nhân
                    </p>
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Số CCCD / CMND</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {viewingUser.id_card_number ? (
                            <>
                              <span className="text-sm font-mono font-bold tracking-wider text-slate-800">{viewingUser.id_card_number}</span>
                              <button 
                                onClick={() => handleCopy(viewingUser.id_card_number, 'id_card', 'số CCCD')}
                                className="text-slate-400 hover:text-primary transition-colors p-0.5 rounded"
                                title="Sao chép"
                              >
                                {copiedField === 'id_card' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </>
                          ) : (
                            <span className="text-slate-400 text-xs italic">Chưa cung cấp</span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm border-t border-slate-200/50 pt-3">
                        <span className="text-slate-500 font-semibold">Ngày cấp</span>
                        <span className="font-bold text-slate-800">
                          {viewingUser.id_card_date ? formatDate(viewingUser.id_card_date).split(' ')[0] : <span className="text-slate-400 font-normal italic">Chưa rõ</span>}
                        </span>
                      </div>

                      <div className="flex flex-col border-t border-slate-200/50 pt-3">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nơi cấp căn cước</span>
                        <span className="text-xs font-bold text-slate-800 mt-1 leading-relaxed">
                          {viewingUser.id_card_place || <span className="text-slate-400 font-normal italic">Chưa khai báo</span>}
                        </span>
                      </div>

                      <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-100 flex items-start gap-2.5 mt-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">Xác thực hệ thống</p>
                          <p className="text-[10px] text-emerald-700/90 font-medium mt-0.5">Dữ liệu định danh được mã hóa và bảo mật nghiêm ngặt dưới chuẩn RLS.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Bank Transfer Account */}
                  <div className="bg-slate-50/80 rounded-3xl p-5 border border-slate-100 relative group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-primary" />
                      Tài khoản ngân hàng
                    </p>
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-semibold">Tên ngân hàng</span>
                        <span className="font-bold text-slate-800">
                          {viewingUser.bank_name || <span className="text-slate-400 font-normal italic">Chưa liên kết</span>}
                        </span>
                      </div>

                      <div className="flex flex-col border-t border-slate-200/50 pt-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Số tài khoản</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {viewingUser.bank_account_number ? (
                            <>
                              <span className="text-sm font-mono font-bold tracking-wider text-slate-800">{viewingUser.bank_account_number}</span>
                              <button 
                                onClick={() => handleCopy(viewingUser.bank_account_number, 'bank_acc', 'số tài khoản')}
                                className="text-slate-400 hover:text-primary transition-colors p-0.5 rounded"
                                title="Sao chép"
                              >
                                {copiedField === 'bank_acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </>
                          ) : (
                            <span className="text-slate-400 text-xs italic">Chưa khai báo</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col border-t border-slate-200/50 pt-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tên chủ tài khoản</span>
                        <span className="text-xs font-black uppercase text-slate-800 mt-1">
                          {viewingUser.bank_account_name || <span className="text-slate-400 font-normal italic normal-case">Chưa khai báo</span>}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Emergency Contacts */}
                  <div className="bg-slate-50/80 rounded-3xl p-5 border border-slate-100 relative group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-primary" />
                      Liên hệ khẩn cấp
                    </p>
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Người liên hệ khẩn cấp</span>
                        <span className="text-sm font-bold text-slate-800 mt-0.5">
                          {viewingUser.emergency_contact_name || <span className="text-slate-400 font-normal italic">Chưa đăng ký</span>}
                        </span>
                      </div>

                      <div className="flex flex-col border-t border-slate-200/50 pt-3">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Số điện thoại khẩn cấp</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {viewingUser.emergency_contact_phone ? (
                            <>
                              <a href={`tel:${viewingUser.emergency_contact_phone}`} className="text-sm font-bold text-slate-800 hover:text-primary transition-colors">{viewingUser.emergency_contact_phone}</a>
                              <button 
                                onClick={() => handleCopy(viewingUser.emergency_contact_phone, 'emerg_phone', 'số điện thoại khẩn cấp')}
                                className="text-slate-400 hover:text-primary transition-colors p-0.5 rounded"
                                title="Sao chép"
                              >
                                {copiedField === 'emerg_phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </>
                          ) : (
                            <span className="text-slate-400 text-xs italic">Chưa đăng ký</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info: Account registration time */}
                <div className="bg-slate-50/50 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-400 font-semibold shrink-0">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Tài khoản lập lúc:</span>
                  <span className="text-slate-600 font-bold">{formatDate(viewingUser.created_at)}</span>
                </div>
              </div>

              {/* Modal Footer actions */}
              <div className="border-t border-slate-100 p-6 bg-slate-50/50 flex gap-3 flex-shrink-0">
                <button 
                  onClick={() => { handleEditUserClick(viewingUser); setViewingUser(null); }} 
                  className="flex-1 py-3.5 rounded-2xl border-2 border-primary/20 text-primary hover:bg-primary hover:text-white font-black text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Sửa phân quyền
                </button>
                <button 
                  onClick={() => setViewingUser(null)} 
                  className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
