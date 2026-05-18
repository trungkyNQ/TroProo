import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home, BadgeCheck, Phone, AlertCircle,
  Users, ChevronRight, Building2, Search,
  Filter, Eye, X, Mail, MapPin, Calendar,
  CreditCard, ShieldAlert, FileText, User,
  Copy, Check, RefreshCw
} from 'lucide-react';

interface TenantsTabProps {
  contractsData: any[];
  setActiveTab: (tab: string) => void;
  loading?: boolean;
}

interface TenantRow {
  contractId: string;
  tenantId: string;
  name: string;
  phone: string | null;
  zalo_phone: string | null;
  avatar: string;
  gender: string | null;
  birth_date: string | null;
  permanent_address: string | null;
  id_card_number: string | null;
  id_card_date: string | null;
  id_card_place: string | null;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_account_name: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  contract_start: string;
  contract_end: string;
  deposit: number;
  isProfileComplete: boolean;
}

export const TenantsTab = ({ contractsData, setActiveTab, loading = false }: TenantsTabProps) => {
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('all');
  const [filterCompleteness, setFilterCompleteness] = useState<string>('all');
  
  // Selected Tenant for the Detailed Modal
  const [activeDetailTenant, setActiveDetailTenant] = useState<(TenantRow & { roomId: string; roomTitle: string }) | null>(null);
  
  // Copy feedback state
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  // 1. Flatten all active tenants
  const allTenants = useMemo(() => {
    const list: (TenantRow & { roomId: string; roomTitle: string })[] = [];

    contractsData.forEach(c => {
      if (c.status !== 'active' || !c.profiles || !c.rooms) return;
      const p = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;
      if (!p) return;

      const roomId = c.room_id;
      const roomTitle = c.rooms?.title || 'Phòng không rõ';

      list.push({
        contractId: c.id,
        tenantId: c.tenant_id,
        roomId,
        roomTitle,
        name: p.full_name || 'Người thuê',
        phone: p.phone || null,
        zalo_phone: p.zalo_phone || null,
        avatar: p.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.full_name || 'U')}&background=FF8A00&color=fff`,
        gender: p.gender || null,
        birth_date: p.birth_date || null,
        permanent_address: p.permanent_address || null,
        id_card_number: p.id_card_number || null,
        id_card_date: p.id_card_date || null,
        id_card_place: p.id_card_place || null,
        bank_name: p.bank_name || null,
        bank_account_number: p.bank_account_number || null,
        bank_account_name: p.bank_account_name || null,
        emergency_contact_name: p.emergency_contact_name || null,
        emergency_contact_phone: p.emergency_contact_phone || null,
        contract_start: c.start_date,
        contract_end: c.end_date,
        deposit: c.deposit || 0,
        isProfileComplete: !!(p.id_card_number && p.permanent_address && p.birth_date && p.emergency_contact_name),
      });
    });

    return list.sort((a, b) => a.roomTitle.localeCompare(b.roomTitle));
  }, [contractsData]);

  // 2. Get list of unique rooms for filter dropdown
  const uniqueRooms = useMemo(() => {
    const map = new Map<string, string>();
    allTenants.forEach(t => {
      map.set(t.roomId, t.roomTitle);
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [allTenants]);

  // 3. Filter tenants based on search and selected options
  const filteredTenants = useMemo(() => {
    return allTenants.filter(t => {
      // Search matches
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        t.name.toLowerCase().includes(query) ||
        (t.phone && t.phone.toLowerCase().includes(query)) ||
        (t.zalo_phone && t.zalo_phone.toLowerCase().includes(query)) ||
        (t.id_card_number && t.id_card_number.toLowerCase().includes(query)) ||
        t.roomTitle.toLowerCase().includes(query);

      // Room filter matches
      const matchesRoom = selectedRoomId === 'all' || t.roomId === selectedRoomId;

      // Completeness matches
      const matchesCompleteness = filterCompleteness === 'all' ||
        (filterCompleteness === 'complete' && t.isProfileComplete) ||
        (filterCompleteness === 'incomplete' && !t.isProfileComplete);

      return matchesSearch && matchesRoom && matchesCompleteness;
    });
  }, [allTenants, searchQuery, selectedRoomId, filterCompleteness]);

  // Stats computation
  const stats = useMemo(() => {
    const total = allTenants.length;
    const roomsCount = new Set(allTenants.map(t => t.roomId)).size;
    const incomplete = allTenants.filter(t => !t.isProfileComplete).length;
    return { total, roomsCount, incomplete };
  }, [allTenants]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  const fmtDate = (val: string | null) =>
    val ? new Date(val).toLocaleDateString('vi-VN') : <span className="text-slate-300 italic text-xs">—</span>;

  const fmtMoney = (val: number) =>
    val > 0 ? `${Number(val).toLocaleString()}đ` : <span className="text-slate-300 italic text-xs">—</span>;

  // ───── Loading Skeleton ─────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
        <div className="h-12 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="bg-slate-100 rounded-3xl h-96 animate-pulse" />
      </div>
    );
  }

  // ───── Empty State (No contracts total) ─────
  if (allTenants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto">
        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6 shadow-inner">
          <Users className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 font-display">Chưa có người thuê nào</h3>
        <p className="text-slate-500 max-w-md px-6 text-sm">
          Người thuê sẽ tự động xuất hiện ở bảng này ngay khi bạn tạo các Hợp đồng thuê phòng có trạng thái đang hiệu lực (Active).
        </p>
        <button
          onClick={() => setActiveTab('contracts')}
          className="mt-6 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-primary/30 transition-all hover:scale-[1.02] flex items-center gap-2"
        >
          <FileText className="w-4 h-4" /> Tạo hợp đồng thuê ngay
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-1 font-display tracking-tight flex items-center gap-2">
            Quản Lý Người Thuê
          </h2>
          <p className="text-slate-500 font-semibold text-sm">
            Thông tin chi tiết và hồ sơ pháp lý của những khách đang lưu trú tại khu trọ.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-slate-300 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tổng người thuê</p>
            <h4 className="text-2xl font-black text-slate-900 font-display mt-0.5">{stats.total} khách</h4>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-slate-300 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Phòng đang có người</p>
            <h4 className="text-2xl font-black text-slate-900 font-display mt-0.5">{stats.roomsCount} phòng</h4>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-slate-300 transition-all">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
            stats.incomplete > 0 
              ? 'bg-amber-50 border-amber-100 text-amber-600 animate-pulse' 
              : 'bg-green-50 border-green-100 text-green-600'
          }`}>
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Hồ sơ thiếu thông tin</p>
            <h4 className={`text-2xl font-black font-display mt-0.5 ${stats.incomplete > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {stats.incomplete} hồ sơ
            </h4>
          </div>
        </div>
      </div>

      {/* Search & Advanced Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên khách hàng, số điện thoại, số CCCD..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 bg-slate-50/50 hover:bg-white text-sm focus:border-primary focus:bg-white focus:outline-none transition-all placeholder-slate-400 font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Room Filter */}
          <div className="relative w-full sm:w-56">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-2xl border border-slate-200 text-slate-700 bg-white text-sm focus:border-primary focus:outline-none transition-all appearance-none font-bold shadow-sm"
            >
              <option value="all">Tất cả các phòng</option>
              {uniqueRooms.map(r => (
                <option key={r.id} value={r.id}>{r.title}</option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-l pl-2 border-slate-200">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Completeness Filter */}
          <div className="relative w-full sm:w-48">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
            <select
              value={filterCompleteness}
              onChange={(e) => setFilterCompleteness(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-2xl border border-slate-200 text-slate-700 bg-white text-sm focus:border-primary focus:outline-none transition-all appearance-none font-bold shadow-sm"
            >
              <option value="all">Tất cả hồ sơ</option>
              <option value="complete">Đã hoàn thiện</option>
              <option value="incomplete">Chưa hoàn thiện</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-l pl-2 border-slate-200">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Wide Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-[10px] text-slate-400 uppercase tracking-widest bg-slate-50/70 border-b border-slate-100 font-bold">
              <tr>
                <th className="px-6 py-4">Người Thuê</th>
                <th className="px-6 py-4">Phòng & Hợp Đồng</th>
                <th className="px-6 py-4">Liên Hệ</th>
                <th className="px-6 py-4">Giấy Tờ CCCD</th>
                <th className="px-6 py-4">Trạng Thái Hồ Sơ</th>
                <th className="px-6 py-4 text-right">Tiền Đặt Cọc</th>
                <th className="px-6 py-4 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-20 text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="w-12 h-12 text-slate-200 mb-3" />
                      <p className="font-bold text-slate-800 text-base">Không tìm thấy người thuê nào</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs">
                        Hãy thử điều chỉnh từ khóa tìm kiếm hoặc thay đổi tiêu chí lọc phòng/hồ sơ của bạn.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTenants.map((tenant, idx) => (
                  <tr
                    key={tenant.contractId}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    {/* 1. Tenant info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={tenant.avatar}
                          alt={tenant.name}
                          className="w-10 h-10 rounded-xl border border-slate-100 shadow-inner object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tenant.name)}&background=FF8A00&color=fff`;
                          }}
                        />
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-primary transition-colors text-sm">
                            {tenant.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {tenant.gender && (
                              <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-bold">
                                {tenant.gender}
                              </span>
                            )}
                            {tenant.birth_date && (
                              <span className="text-[10px] text-slate-400">
                                ns: {new Date(tenant.birth_date).getFullYear()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. Room & Lease details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className="inline-flex items-center gap-1 text-xs font-black text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg">
                          <Building2 className="w-3 h-3" /> {tenant.roomTitle}
                        </span>
                        <div className="text-[10px] text-slate-400 font-semibold mt-1.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-300" />
                          {fmtDate(tenant.contract_start)} → {fmtDate(tenant.contract_end)}
                        </div>
                      </div>
                    </td>

                    {/* 3. Contact information */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {tenant.phone ? (
                          <a
                            href={`tel:${tenant.phone}`}
                            className="font-bold text-slate-700 hover:text-primary transition-colors text-sm flex items-center gap-1"
                          >
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {tenant.phone}
                          </a>
                        ) : (
                          <span className="text-slate-300 italic text-xs">—</span>
                        )}
                        {tenant.zalo_phone && (
                          <p className="text-[11px] text-slate-400 font-semibold pl-4.5">
                            Zalo: {tenant.zalo_phone}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* 4. Identity Card (CCCD) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tenant.id_card_number ? (
                        <div>
                          <p className="font-bold text-slate-800 font-mono text-xs tracking-wide">
                            {tenant.id_card_number}
                          </p>
                          {tenant.id_card_place && (
                            <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[150px]">
                              Nơi cấp: {tenant.id_card_place}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1 w-max">
                          <AlertCircle className="w-3 h-3" /> Chưa cập nhật
                        </span>
                      )}
                    </td>

                    {/* 5. Completeness */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tenant.isProfileComplete ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                          <BadgeCheck className="w-3.5 h-3.5" /> Đầy đủ thông tin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                          <AlertCircle className="w-3.5 h-3.5" /> Thiếu thông tin
                        </span>
                      )}
                    </td>

                    {/* 6. Deposit money */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="font-black text-slate-900 text-sm">
                        {fmtMoney(tenant.deposit)}
                      </span>
                    </td>

                    {/* 7. Action Button */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setActiveDetailTenant(tenant)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-primary/10 hover:text-primary text-slate-600 transition-all flex items-center justify-center"
                          title="Xem chi tiết hồ sơ"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {tenant.phone && (
                          <a
                            href={`tel:${tenant.phone}`}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 transition-all flex items-center justify-center"
                            title="Gọi điện"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Tenant Profile Modal Overlay */}
      <AnimatePresence>
        {activeDetailTenant && (
          <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDetailTenant(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-xl h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-2xl text-primary">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 font-display">Chi Tiết Người Thuê</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Mã hợp đồng: {activeDetailTenant.contractId.slice(0, 8)}...</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveDetailTenant(null)}
                  className="p-2 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* 1. Core Profile Header */}
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                  <img
                    src={activeDetailTenant.avatar}
                    alt={activeDetailTenant.name}
                    className="w-16 h-16 rounded-2xl border object-cover shadow-sm bg-white"
                  />
                  <div>
                    <h4 className="text-lg font-black text-slate-950">{activeDetailTenant.name}</h4>
                    <p className="text-xs font-black text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md mt-1 w-max">
                      {activeDetailTenant.roomTitle}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      {activeDetailTenant.isProfileComplete ? (
                        <span className="flex items-center gap-1 text-[10px] font-black text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                          <BadgeCheck className="w-3 h-3" /> Đầy đủ hồ sơ
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3 h-3" /> Hồ sơ còn thiếu
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Personal Information */}
                <div className="space-y-3">
                  <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> Thông tin cá nhân
                  </h5>
                  <div className="grid grid-cols-2 gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Số điện thoại</p>
                      <p className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {activeDetailTenant.phone || 'Chưa cập nhật'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Số Zalo</p>
                      <p className="text-sm font-bold text-slate-800 mt-1">
                        {activeDetailTenant.zalo_phone || 'Chưa cập nhật'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ngày sinh</p>
                      <p className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {fmtDate(activeDetailTenant.birth_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Giới tính</p>
                      <p className="text-sm font-bold text-slate-800 mt-1">
                        {activeDetailTenant.gender || 'Chưa cập nhật'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Địa chỉ thường trú</p>
                      <p className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="leading-relaxed">{activeDetailTenant.permanent_address || 'Chưa cập nhật'}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Legal Documents (CCCD) */}
                <div className="space-y-3">
                  <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Giấy tờ tùy thân
                  </h5>
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Số CCCD / Hộ chiếu</p>
                        <p className="text-base font-black font-mono text-slate-850 mt-1 tracking-wider">
                          {activeDetailTenant.id_card_number || 'Chưa cập nhật'}
                        </p>
                      </div>
                      {activeDetailTenant.id_card_number && (
                        <button
                          onClick={() => copyToClipboard(activeDetailTenant.id_card_number!, 'cccd')}
                          className="text-[11px] font-bold text-primary bg-primary/5 hover:bg-primary/15 px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all"
                        >
                          {copiedLabel === 'cccd' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          {copiedLabel === 'cccd' ? 'Đã sao chép' : 'Sao chép'}
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ngày cấp</p>
                        <p className="text-sm font-bold text-slate-800 mt-1">
                          {fmtDate(activeDetailTenant.id_card_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nơi cấp</p>
                        <p className="text-sm font-bold text-slate-800 mt-1">
                          {activeDetailTenant.id_card_place || 'Chưa cập nhật'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Financial & Bank accounts */}
                <div className="space-y-3">
                  <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" /> Thông tin thanh toán (Hoàn cọc)
                  </h5>
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm space-y-4">
                    {activeDetailTenant.bank_name ? (
                      <>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tên ngân hàng</p>
                            <p className="text-sm font-bold text-slate-800 mt-1">{activeDetailTenant.bank_name}</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(activeDetailTenant.bank_account_number!, 'bank')}
                            className="text-[11px] font-bold text-primary bg-primary/5 hover:bg-primary/15 px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all"
                          >
                            {copiedLabel === 'bank' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            {copiedLabel === 'bank' ? 'Đã sao chép số TK' : 'Sao chép số TK'}
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Số tài khoản</p>
                            <p className="text-sm font-black font-mono text-slate-900 mt-1 tracking-wider">
                              {activeDetailTenant.bank_account_number}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Chủ tài khoản</p>
                            <p className="text-sm font-black text-slate-900 mt-1 uppercase">
                              {activeDetailTenant.bank_account_name}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Khách hàng chưa cung cấp thông tin tài khoản ngân hàng để hoàn trả cọc.</p>
                    )}
                  </div>
                </div>

                {/* 5. Lease Lease Period & Deposit */}
                <div className="space-y-3">
                  <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> Hợp đồng & Tiền cọc
                  </h5>
                  <div className="grid grid-cols-2 gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Thời hạn hợp đồng</p>
                      <p className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {fmtDate(activeDetailTenant.contract_start)} → {fmtDate(activeDetailTenant.contract_end)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tiền cọc đặt giữ phòng</p>
                      <p className="text-base font-black text-primary mt-1">
                        {fmtMoney(activeDetailTenant.deposit)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 6. Emergency Contact */}
                <div className="space-y-3">
                  <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Liên hệ khẩn cấp
                  </h5>
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                    {activeDetailTenant.emergency_contact_name ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Họ & Tên liên hệ</p>
                          <p className="text-sm font-bold text-slate-850 mt-1">{activeDetailTenant.emergency_contact_name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Số điện thoại liên hệ</p>
                          {activeDetailTenant.emergency_contact_phone ? (
                            <a
                              href={`tel:${activeDetailTenant.emergency_contact_phone}`}
                              className="text-sm font-bold text-primary hover:underline mt-1 flex items-center gap-1"
                            >
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              {activeDetailTenant.emergency_contact_phone}
                            </a>
                          ) : (
                            <p className="text-sm font-bold text-slate-800 mt-1">Chưa cập nhật</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Khách hàng chưa cập nhật thông tin liên hệ khẩn cấp.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
                {activeDetailTenant.phone && (
                  <a
                    href={`tel:${activeDetailTenant.phone}`}
                    className="flex-1 py-3 bg-primary text-white text-center font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:bg-primary-dark transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" /> Gọi điện trực tiếp
                  </a>
                )}
                <button
                  onClick={() => setActiveDetailTenant(null)}
                  className="flex-1 py-3 border border-slate-200 hover:border-slate-350 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Đóng chi tiết
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

