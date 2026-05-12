import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home, BadgeCheck, Phone, AlertCircle,
  Users, ChevronRight, Building2
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

interface RoomGroup {
  roomId: string;
  roomTitle: string;
  tenants: TenantRow[];
}

export const TenantsTab = ({ contractsData, setActiveTab, loading = false }: TenantsTabProps) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  // Group active contracts by room_id → allows multiple tenants per room
  const roomGroups: RoomGroup[] = useMemo(() => {
    const map = new Map<string, RoomGroup>();

    contractsData.forEach(c => {
      if (c.status !== 'active' || !c.profiles || !c.rooms) return;
      const p = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;
      if (!p) return;

      const roomId = c.room_id;
      const roomTitle = c.rooms?.title || 'Phòng không rõ';

      const tenant: TenantRow = {
        contractId: c.id,
        tenantId: c.tenant_id,
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
      };

      if (!map.has(roomId)) {
        map.set(roomId, { roomId, roomTitle, tenants: [] });
      }
      map.get(roomId)!.tenants.push(tenant);
    });

    return Array.from(map.values()).sort((a, b) => a.roomTitle.localeCompare(b.roomTitle));
  }, [contractsData]);

  // Auto-select first room on load
  useEffect(() => {
    if (roomGroups.length > 0 && !selectedRoomId) {
      setSelectedRoomId(roomGroups[0].roomId);
    }
  }, [roomGroups]);

  const selectedGroup = roomGroups.find(g => g.roomId === selectedRoomId) || null;

  const fmt = (val: string | null) =>
    val ? val : <span className="text-slate-300 italic text-xs">—</span>;

  const fmtDate = (val: string | null) =>
    val ? new Date(val).toLocaleDateString('vi-VN') : <span className="text-slate-300 italic text-xs">—</span>;

  const fmtMoney = (val: number) =>
    val > 0 ? `${Number(val).toLocaleString()}đ` : <span className="text-slate-300 italic text-xs">—</span>;

  // ───── Loading skeleton ─────
  if (loading) {
    return (
      <div className="flex gap-6 animate-pulse">
        <div className="w-72 flex-shrink-0 space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-slate-100 rounded-2xl" />
          ))}
        </div>
        <div className="flex-1 bg-slate-100 rounded-3xl h-96" />
      </div>
    );
  }

  // ───── Empty state ─────
  if (roomGroups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-slate-200">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
          <Users className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có người thuê</h3>
        <p className="text-slate-500 max-w-sm">
          Người thuê sẽ xuất hiện khi bạn tạo Hợp đồng thuê phòng đang có hiệu lực.
        </p>
      </div>
    );
  }

  // ───── Main layout ─────
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-1 font-display">
          Quản lý Người Thuê
        </h2>
        <p className="text-slate-500 font-medium">
          {roomGroups.length} phòng đang có người thuê •{' '}
          {roomGroups.reduce((s, g) => s + g.tenants.length, 0)} người thuê tổng cộng
        </p>
      </div>

      <div className="flex gap-5 items-start">
        {/* ── Left panel: Room list ── */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> Danh sách phòng
          </p>
          {roomGroups.map(group => {
            const isSelected = group.roomId === selectedRoomId;
            const hasIncomplete = group.tenants.some(t => !t.isProfileComplete);
            return (
              <motion.button
                key={group.roomId}
                onClick={() => setSelectedRoomId(group.roomId)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'bg-primary/10 border-primary/30 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className={`font-black text-sm truncate ${isSelected ? 'text-primary' : 'text-slate-900'}`}>
                    {group.roomTitle}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    {group.tenants.length} người thuê
                    {hasIncomplete && (
                      <span className="ml-1.5 text-amber-500">⚠</span>
                    )}
                  </p>
                </div>

                <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-colors ${isSelected ? 'text-primary' : 'text-slate-300'}`} />
              </motion.button>
            );
          })}
        </div>

        {/* ── Right panel: Tenant table ── */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {selectedGroup ? (
              <motion.div
                key={selectedGroup.roomId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden"
              >
                {/* Table header */}
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                  <h3 className="font-black text-slate-900 text-lg">{selectedGroup.roomTitle}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {selectedGroup.tenants.length} người đang thuê
                  </p>
                </div>

                {/* Scrollable table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {[
                          'Người thuê', 'Liên hệ', 'Ngày sinh', 'CCCD',
                          'Địa chỉ thường trú', 'Hợp đồng', 'Tiền cọc',
                          'Ngân hàng', 'Liên hệ khẩn cấp', 'Hồ sơ', ''
                        ].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedGroup.tenants.map((tenant, idx) => (
                        <motion.tr
                          key={tenant.contractId}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors group"
                        >
                          {/* Người thuê */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{tenant.name}</p>
                              {tenant.gender && (
                                <p className="text-[10px] text-slate-400 font-medium">{tenant.gender}</p>
                              )}
                            </div>
                          </td>

                          {/* Liên hệ */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="space-y-0.5">
                              <p className="font-semibold text-slate-700 flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {tenant.phone
                                  ? <a href={`tel:${tenant.phone}`} className="hover:text-primary transition-colors">{tenant.phone}</a>
                                  : <span className="text-slate-300 italic text-xs">—</span>
                                }
                              </p>
                              {tenant.zalo_phone && (
                                <p className="text-xs text-slate-400 font-medium">Zalo: {tenant.zalo_phone}</p>
                              )}
                            </div>
                          </td>

                          {/* Ngày sinh */}
                          <td className="px-4 py-3 whitespace-nowrap text-slate-600 font-medium">
                            {fmtDate(tenant.birth_date)}
                          </td>

                          {/* CCCD */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {tenant.id_card_number ? (
                              <div>
                                <p className="font-bold text-slate-800 font-mono text-xs">{tenant.id_card_number}</p>
                                <p className="text-[10px] text-slate-400">
                                  {tenant.id_card_date ? new Date(tenant.id_card_date).toLocaleDateString('vi-VN') : ''}
                                  {tenant.id_card_place ? ` • ${tenant.id_card_place}` : ''}
                                </p>
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-md">Chưa có</span>
                            )}
                          </td>

                          {/* Địa chỉ */}
                          <td className="px-4 py-3 max-w-[160px]">
                            <p className="text-slate-600 font-medium text-xs line-clamp-2">
                              {fmt(tenant.permanent_address)}
                            </p>
                          </td>

                          {/* Hợp đồng */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {tenant.contract_start && tenant.contract_end ? (
                              <div>
                                <p className="text-xs font-semibold text-slate-700">
                                  {new Date(tenant.contract_start).toLocaleDateString('vi-VN')}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  → {new Date(tenant.contract_end).toLocaleDateString('vi-VN')}
                                </p>
                              </div>
                            ) : fmt(null)}
                          </td>

                          {/* Tiền cọc */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="font-black text-primary text-sm">
                              {fmtMoney(tenant.deposit)}
                            </span>
                          </td>

                          {/* Ngân hàng */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {tenant.bank_name ? (
                              <div>
                                <p className="text-xs font-bold text-slate-700">{tenant.bank_name}</p>
                                <p className="text-[10px] font-mono text-slate-400">{tenant.bank_account_number}</p>
                                <p className="text-[10px] text-slate-400">{tenant.bank_account_name}</p>
                              </div>
                            ) : fmt(null)}
                          </td>

                          {/* Liên hệ khẩn cấp */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {tenant.emergency_contact_name ? (
                              <div>
                                <p className="text-xs font-bold text-slate-700">{tenant.emergency_contact_name}</p>
                                {tenant.emergency_contact_phone && (
                                  <a
                                    href={`tel:${tenant.emergency_contact_phone}`}
                                    className="text-[10px] text-primary hover:underline font-medium"
                                  >
                                    {tenant.emergency_contact_phone}
                                  </a>
                                )}
                              </div>
                            ) : fmt(null)}
                          </td>

                          {/* Hồ sơ */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {tenant.isProfileComplete ? (
                              <span className="flex items-center gap-1 text-[10px] font-black text-green-700 bg-green-50 px-2 py-1 rounded-full">
                                <BadgeCheck className="w-3 h-3" /> Đầy đủ
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                                <AlertCircle className="w-3 h-3" /> Thiếu
                              </span>
                            )}
                          </td>

                          {/* Action */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {tenant.phone && (
                              <a
                                href={`tel:${tenant.phone}`}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-primary hover:text-white text-slate-500 transition-all inline-flex items-center"
                                title="Gọi điện"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>


              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-slate-200 border-dashed text-slate-400">
                <Home className="w-10 h-10 mb-3 text-slate-300" />
                <p className="font-bold text-sm">Chọn một phòng để xem danh sách người thuê</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
