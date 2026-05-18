import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';
import {
  Home, Bed, Wallet, Plus, FileText, User, ChevronLeft, ChevronRight,
  AlertCircle, Phone, Trash2, Edit3, Camera, BadgeCheck, Zap, Droplets,
  ShieldCheck, Clock, CheckCircle, X, Search, Wrench, Mail, MessageSquare,
  PlusCircle, Image as ImageIcon, MapPin, Users, Settings, Lock as LockIcon,
  LogOut, MoreVertical, MoreHorizontal, Filter, ArrowUpDown, Maximize2, Info,
  Layers, Construction, ArrowLeft, Calendar, Eye, EyeOff, Sparkles, FileClock,
  Shield, ShieldAlert, Ban, Download, FileSignature, HelpCircle, UserX, UserCheck,
  Save, Send, Smile, Video, ChevronDown, RefreshCw, Building2, PhoneCall
} from 'lucide-react';

interface ContractsTabProps {
  contractsData: any[];
  roomsData: any[];
  onRefresh?: () => void;
}

export const ContractsTab = ({ contractsData, roomsData, onRefresh }: ContractsTabProps) => {
  // Filter and Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('all');
  const [contractFilter, setContractFilter] = useState('all');
  
  // Modal states
  const [editingContract, setEditingContract] = useState<any | null>(null);
  const [viewingContract, setViewingContract] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const [landlordProfile, setLandlordProfile] = useState<any>(null);

  // Fetch Landlord profile details on mount
  React.useEffect(() => {
    const fetchLandlord = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setLandlordProfile(data);
      }
    };
    fetchLandlord();
  }, []);

  // Safe helper formats
  const fmtDate = (val: string | null) =>
    val ? new Date(val).toLocaleDateString('vi-VN') : <span className="text-slate-300 italic text-xs">—</span>;

  const fmtMoney = (val: number) =>
    val > 0 ? `${Number(val).toLocaleString()}đ` : <span className="text-slate-300 italic text-xs">—</span>;

  const formatPhone = (phone?: string) => {
    if (!phone) return '...........................................';
    return phone.startsWith('+84') ? '0' + phone.slice(3) : phone;
  };

  // 1. Process & sanitize contracts data cleanly
  const contracts = useMemo(() => {
    return contractsData.map(c => {
      const p = c.profiles || {};
      const r = c.rooms || {};
      
      const initials = (p.full_name || 'NA')
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
        
      const statusLabel = 
        c.status === 'active' ? 'Đang hiệu lực' : 
        c.status === 'pending' ? 'Chờ ký' : 
        c.status === 'expired' ? 'Đã hết hạn' : 'Đã chấm dứt';
        
      const statusColor = 
        c.status === 'active' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 
        c.status === 'pending' ? 'bg-amber-50 border-amber-100 text-amber-700' : 
        'bg-slate-50 border-slate-200 text-slate-600';

      return {
        id: c.id,
        tenant: p.full_name || 'Chưa rõ',
        initials,
        room: r.title || 'Phòng không rõ',
        roomId: c.room_id || '',
        start_date: c.start_date ? c.start_date.split('T')[0] : '',
        end_date: c.end_date ? c.end_date.split('T')[0] : '',
        depositValue: c.deposit || 0,
        status: c.status,
        statusLabel,
        statusColor,
        phone: p.phone || null,
        emergency_contact_phone: p.emergency_contact_phone || null,
        emergency_contact_name: p.emergency_contact_name || null,
        profiles: p,
        rooms: r
      };
    });
  }, [contractsData]);

  // 2. Extract unique rooms listed in contracts for dropdown filter
  const uniqueRooms = useMemo(() => {
    const map = new Map<string, string>();
    contracts.forEach(c => {
      if (c.roomId) map.set(c.roomId, c.room);
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [contracts]);

  // 3. Filter contracts using search query, room filter and status selection
  const filteredContracts = useMemo(() => {
    return contracts.filter(c => {
      // Live search matches
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        c.tenant.toLowerCase().includes(query) ||
        c.room.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query) ||
        (c.phone && c.phone.toLowerCase().includes(query)) ||
        (c.emergency_contact_phone && c.emergency_contact_phone.toLowerCase().includes(query)) ||
        (c.emergency_contact_name && c.emergency_contact_name.toLowerCase().includes(query));

      // Room dropdown filter
      const matchesRoom = selectedRoomId === 'all' || c.roomId === selectedRoomId;

      // Status button filter
      const matchesStatus = contractFilter === 'all' || c.status === contractFilter;

      return matchesSearch && matchesRoom && matchesStatus;
    });
  }, [contracts, searchQuery, selectedRoomId, contractFilter]);

  // 4. Compute statistics indicators
  const stats = useMemo(() => {
    const active = contracts.filter(c => c.status === 'active').length;
    const pending = contracts.filter(c => c.status === 'pending').length;
    
    // Expiring within 30 days
    const expiring = contracts.filter(c => {
      if (!c.end_date || c.status !== 'active') return false;
      const endDate = new Date(c.end_date);
      const today = new Date();
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 30;
    }).length;

    return { active, pending, expiring };
  }, [contracts]);

  // Action handlers
  const handleUpdateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContract) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('contracts')
        .update({
          deposit: editingContract.depositValue,
          start_date: editingContract.start_date,
          end_date: editingContract.end_date,
          status: editingContract.status
        })
        .eq('id', editingContract.id);

      if (error) throw error;
      
      showToast('Cập nhật hợp đồng thành công', 'success');
      setEditingContract(null);
      if (onRefresh) onRefresh();
    } catch (error: any) {
      showToast('Lỗi cập nhật hợp đồng: ' + error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadContract = (contract: any) => {
    setViewingContract(contract);
    // Wait for modal to render then print
    setTimeout(() => {
      const printContents = document.getElementById('contract-printable')?.innerHTML;
      if (!printContents) return;
      
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      printWindow.document.write(`
        <html>
          <head>
            <title>Hop_Dong_Thue_Phong_${contract.room.replace(/\s+/g, '_')}</title>
            <style>
              body { font-family: "Times New Roman", Times, serif; line-height: 1.6; color: #000; padding: 40px; }
              .text-center { text-align: center; }
              .font-bold { font-weight: bold; }
              .font-black { font-weight: 900; }
              .text-3xl { font-size: 24pt; }
              .text-xl { font-size: 18pt; }
              .text-lg { font-size: 14pt; }
              .mb-10 { margin-bottom: 30pt; }
              .mb-8 { margin-bottom: 20pt; }
              .mb-4 { margin-bottom: 12pt; }
              .space-y-8 > * + * { margin-top: 24pt; }
              .space-y-4 > * + * { margin-top: 12pt; }
              .grid { display: flex; justify-content: space-between; }
              .grid-cols-2 > div { width: 45%; }
              .bg-slate-50\\/50 { background: #f8fafc; padding: 15pt; border-radius: 8pt; border: 1pt solid #e2e8f0; margin-bottom: 15pt; }
              .border-b { border-bottom: 1pt solid #e2e8f0; }
              .pb-2 { padding-bottom: 6pt; }
              .mt-12 { margin-top: 40pt; }
              .pt-8 { padding-top: 20pt; }
              .mb-24 { margin-bottom: 80pt; }
              .underline { text-decoration: underline; }
              @media print {
                body { padding: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${printContents}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }, 100);
  };

  // ───── Empty state when no rooms yet ─────
  if (roomsData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto">
        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6 shadow-inner">
          <FileSignature className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 font-display">Chưa có phòng nào</h3>
        <p className="text-slate-500 max-w-md px-6 text-sm">
          Hợp đồng thuê sẽ được xuất hiện và tự động theo dõi ngay sau khi bạn thêm phòng trọ mới và tiến hành gán khách thuê vào hợp đồng.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-1 font-display tracking-tight">
          Quản Lý Hợp Đồng
        </h2>
        <p className="text-slate-500 font-semibold text-sm">
          Xem, chỉnh sửa và xuất bản hợp đồng thuê trọ điện tử cho khách lưu trú.
        </p>
      </div>

      {/* Premium HSL Stats Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-slate-300 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Đang hiệu lực</p>
            <h4 className="text-2xl font-black text-slate-900 font-display mt-0.5">{stats.active} hợp đồng</h4>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-slate-300 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <FileClock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Chờ ký duyệt</p>
            <h4 className="text-2xl font-black text-slate-900 font-display mt-0.5">{stats.pending} hợp đồng</h4>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-slate-300 transition-all">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
            stats.expiring > 0 
              ? 'bg-rose-50 border-rose-100 text-rose-600 animate-pulse' 
              : 'bg-green-50 border-green-100 text-green-600'
          }`}>
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Hợp đồng sắp hết hạn</p>
            <h4 className={`text-2xl font-black font-display mt-0.5 ${stats.expiring > 0 ? 'text-rose-600 font-extrabold' : 'text-slate-900'}`}>
              {stats.expiring} hợp đồng
            </h4>
          </div>
        </div>
      </div>

      {/* Advanced Filters & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative w-full lg:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên khách, phòng, số điện thoại, mã hợp đồng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 bg-slate-50/50 hover:bg-white text-sm focus:border-primary focus:bg-white focus:outline-none transition-all placeholder-slate-400 font-medium"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Room Selector Dropdown */}
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

          {/* Status Tab buttons */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto gap-1">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'active', label: 'Đang hiệu lực' },
              { id: 'pending', label: 'Chờ ký' },
              { id: 'expired', label: 'Đã hết hạn' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setContractFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                  contractFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Wide Contracts Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-[10px] text-slate-400 uppercase tracking-widest bg-slate-50/70 border-b border-slate-100 font-bold">
              <tr>
                <th className="px-6 py-4">Khách Thuê</th>
                <th className="px-6 py-4">Phòng & Thời Hạn</th>
                <th className="px-6 py-4">Đặt Tiền Cọc</th>
                <th className="px-6 py-4">Liên Hệ Khẩn Cấp</th>
                <th className="px-6 py-4">Trạng Thái</th>
                <th className="px-6 py-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <FileSignature className="w-12 h-12 text-slate-200 mb-3" />
                      <p className="font-bold text-slate-800 text-base">Không tìm thấy hợp đồng nào</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs">
                        Hãy thử đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc để tra cứu lại.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    {/* 1. Tenant Personal */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-650 flex items-center justify-center font-black text-xs shadow-inner">
                          {contract.initials}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-primary transition-colors text-sm">
                            {contract.tenant}
                          </p>
                          {contract.phone && (
                            <a
                              href={`tel:${contract.phone}`}
                              className="text-[11px] font-semibold text-slate-400 hover:text-primary flex items-center gap-1 mt-0.5"
                            >
                              <Phone className="w-3 h-3" /> {contract.phone}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 2. Room & Lease Term */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className="inline-flex items-center gap-1 text-xs font-black text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg">
                          <Building2 className="w-3 h-3" /> {contract.room}
                        </span>
                        <div className="text-[10px] text-slate-400 font-semibold mt-1.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-300" />
                          {fmtDate(contract.start_date)} → {fmtDate(contract.end_date)}
                        </div>
                      </div>
                    </td>

                    {/* 3. Deposit money */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-black text-slate-900 text-sm">
                        {fmtMoney(contract.depositValue)}
                      </span>
                    </td>

                    {/* 4. Emergency Contact info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contract.emergency_contact_phone ? (
                        <div>
                          <p className="font-bold text-slate-800 text-xs">
                            {contract.emergency_contact_phone}
                          </p>
                          {contract.emergency_contact_name && (
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 truncate max-w-[150px]">
                              {contract.emergency_contact_name}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-300 italic text-xs">—</span>
                      )}
                    </td>

                    {/* 5. Status Badges with Pulse Indicators */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${contract.statusColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          contract.status === 'active' ? 'bg-emerald-500 animate-ping' :
                          contract.status === 'pending' ? 'bg-amber-500' : 'bg-slate-400'
                        }`} />
                        {contract.statusLabel}
                      </span>
                    </td>

                    {/* 6. Action Tools */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewingContract(contract)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-primary/10 hover:text-primary text-slate-650 transition-all flex items-center justify-center"
                          title="Xem chi tiết hợp đồng"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadContract(contract)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-650 transition-all flex items-center justify-center"
                          title="Tải xuống hợp đồng (PDF)"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingContract(contract)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-650 transition-all flex items-center justify-center"
                          title="Chỉnh sửa hợp đồng"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Custom Premium Pagination Component */}
        {filteredContracts.length > 0 && (
          <div className="p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Hiển thị 1-{filteredContracts.length} trên tổng số {contractsData.length} hợp đồng
            </span>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-slate-200 rounded-xl text-slate-300 hover:bg-slate-50 disabled:opacity-50 transition-all" disabled>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-xl font-black text-sm shadow-md shadow-primary/20">1</button>
              <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* redone Edit Contract Modal */}
      <AnimatePresence>
        {editingContract && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingContract(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 border border-slate-150"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-display">Chỉnh Sửa Hợp Đồng</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Hợp đồng phòng: {editingContract.room}</p>
                </div>
                <button 
                  onClick={() => setEditingContract(null)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-4">
                <form id="edit-contract-form" onSubmit={handleUpdateContract} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tiền đặt cọc giữ phòng (VNĐ)</label>
                    <input 
                      type="number" 
                      required
                      value={editingContract.depositValue}
                      onChange={(e) => setEditingContract({...editingContract, depositValue: Number(e.target.value)})}
                      className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ngày bắt đầu</label>
                      <input 
                        type="date" 
                        required
                        value={editingContract.start_date}
                        onChange={(e) => setEditingContract({...editingContract, start_date: e.target.value})}
                        className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white outline-none transition-all font-bold text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ngày kết thúc</label>
                      <input 
                        type="date" 
                        required
                        value={editingContract.end_date}
                        onChange={(e) => setEditingContract({...editingContract, end_date: e.target.value})}
                        className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white outline-none transition-all font-bold text-slate-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Trạng thái hợp đồng</label>
                    <div className="relative">
                      <select 
                        value={editingContract.status}
                        onChange={(e) => setEditingContract({...editingContract, status: e.target.value})}
                        className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white outline-none transition-all font-bold text-slate-700 appearance-none"
                      >
                        <option value="active">Đang hiệu lực</option>
                        <option value="pending">Chờ ký</option>
                        <option value="expired">Đã hết hạn</option>
                        <option value="terminated">Đã chấm dứt</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="p-6 border-t border-slate-100 flex gap-3 justify-end bg-slate-50">
                <button 
                  type="button"
                  onClick={() => setEditingContract(null)}
                  className="px-5 py-2.5 font-bold text-slate-650 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  form="edit-contract-form"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center gap-2 disabled:opacity-50 hover:scale-[1.01]"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* redone Document View Modal */}
      <AnimatePresence>
        {viewingContract && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingContract(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 border border-slate-150"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-display">Chi Tiết Hợp Đồng Thuê Trọ</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Mã hợp đồng: {viewingContract.id.toUpperCase()}</p>
                </div>
                <button 
                  onClick={() => setViewingContract(null)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto bg-slate-100/50">
                <div id="contract-printable" className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 mx-auto max-w-3xl">
                  {/* National Banner */}
                  <div className="text-center mb-10">
                    <h4 className="font-bold text-lg font-serif">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
                    <p className="font-bold text-sm font-serif underline decoration-slate-400 underline-offset-4 mb-8">Độc lập - Tự do - Hạnh phúc</p>
                    <h2 className="text-2xl md:text-3xl font-black mt-8 mb-2 text-slate-900">HỢP ĐỒNG THUÊ PHÒNG TRỌ</h2>
                    <p className="text-slate-500 italic text-sm">Số: {viewingContract.id.toUpperCase()}</p>
                  </div>
                  
                  {/* Contract content bodies */}
                  <div className="space-y-8 text-slate-800 leading-relaxed text-sm md:text-base font-serif">
                    <p className="italic">
                      Hôm nay, ngày {viewingContract.start_date ? new Date(viewingContract.start_date).getDate() : '...'} tháng {viewingContract.start_date ? new Date(viewingContract.start_date).getMonth() + 1 : '...'} năm {viewingContract.start_date ? new Date(viewingContract.start_date).getFullYear() : '...'}, tại địa chỉ phòng trọ, chúng tôi gồm có:
                    </p>
                    
                    {/* Landlord details */}
                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                      <h3 className="font-black text-base md:text-lg mb-4 text-primary flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">A</span>
                        BÊN CHO THUÊ (BÊN A)
                      </h3>
                      <ul className="space-y-3 font-sans text-sm text-slate-700">
                        <li className="flex gap-2"><span className="font-bold min-w-[150px] text-slate-400 uppercase text-xs">Họ và tên:</span> <span className="font-bold text-slate-900">{landlordProfile?.full_name || '...........................................'}</span></li>
                        <li className="flex gap-2"><span className="font-bold min-w-[150px] text-slate-400 uppercase text-xs">Số CCCD:</span> <span className="font-mono">{landlordProfile?.id_card_number || '...........................................'}</span></li>
                        <li className="flex gap-2"><span className="font-bold min-w-[150px] text-slate-400 uppercase text-xs">Số điện thoại:</span> <span>{formatPhone(landlordProfile?.phone)}</span></li>
                        <li className="flex gap-2"><span className="font-bold min-w-[150px] text-slate-400 uppercase text-xs">Địa chỉ thường trú:</span> <span>{landlordProfile?.permanent_address || '...........................................'}</span></li>
                      </ul>
                    </div>

                    {/* Tenant details */}
                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                      <h3 className="font-black text-base md:text-lg mb-4 text-primary flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">B</span>
                        BÊN THUÊ (BÊN B)
                      </h3>
                      <ul className="space-y-3 font-sans text-sm text-slate-700">
                        <li className="flex gap-2"><span className="font-bold min-w-[150px] text-slate-400 uppercase text-xs">Họ và tên:</span> <span className="font-bold text-slate-900">{viewingContract.profiles?.full_name || '...........................................'}</span></li>
                        <li className="flex gap-2"><span className="font-bold min-w-[150px] text-slate-400 uppercase text-xs">Số CCCD:</span> <span className="font-mono">{viewingContract.profiles?.id_card_number || '...........................................'}</span></li>
                        <li className="flex gap-2"><span className="font-bold min-w-[150px] text-slate-400 uppercase text-xs">Số điện thoại:</span> <span>{formatPhone(viewingContract.profiles?.phone)}</span></li>
                        <li className="flex gap-2"><span className="font-bold min-w-[150px] text-slate-400 uppercase text-xs">Địa chỉ thường trú:</span> <span>{viewingContract.profiles?.permanent_address || '...........................................'}</span></li>
                      </ul>
                    </div>

                    {/* Terms */}
                    <div className="font-sans text-sm space-y-4">
                      <h3 className="font-black text-base text-slate-900 border-b border-slate-200 pb-2 uppercase tracking-wide">Điều Khoản Thuê</h3>
                      <div className="space-y-3 text-slate-700 leading-relaxed">
                        <p><strong>Điều 1:</strong> Bên A đồng ý cho Bên B thuê căn phòng mang số hiệu: <span className="font-black text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/20">{viewingContract.room}</span>.</p>
                        <p><strong>Điều 2:</strong> Thời hạn thực thi hợp đồng thuê phòng kéo dài từ ngày <strong>{fmtDate(viewingContract.start_date)}</strong> đến ngày <strong>{fmtDate(viewingContract.end_date)}</strong>.</p>
                        <p><strong>Điều 3:</strong> Số tiền đặt cọc Bên B giao cho Bên A giữ phòng là: <span className="font-black text-slate-900">{viewingContract.deposit}</span>.</p>
                        <p><strong>Điều 4:</strong> Quyền hạn & nghĩa vụ hai bên:</p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-500 text-xs">
                          <li>Bên A có trách nhiệm duy trì nguồn điện nước ổn định, hỗ trợ bảo trì định kỳ cơ sở hạ tầng phòng trọ cho khách hàng khi có hư hại không thuộc lỗi cố ý.</li>
                          <li>Bên B tuân thủ giữ gìn trật tự công cộng, nội quy an ninh trật tự phòng cháy chữa cháy, thanh toán đầy đủ các hóa đơn định kỳ đúng ngày theo thỏa thuận.</li>
                        </ul>
                      </div>
                    </div>

                    {/* Signatures */}
                    <div className="grid grid-cols-2 gap-4 mt-12 pt-8 text-center border-t border-slate-200 font-sans">
                      <div>
                        <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider">ĐẠI DIỆN BÊN A</h4>
                        <p className="text-[10px] text-slate-400 italic mb-20">(Ký và ghi rõ họ tên)</p>
                        <p className="font-black text-slate-800">{landlordProfile?.full_name}</p>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider">ĐẠI DIỆN BÊN B</h4>
                        <p className="text-[10px] text-slate-400 italic mb-20">(Ký và ghi rõ họ tên)</p>
                        <p className="font-black text-slate-800">{viewingContract.profiles?.full_name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-100 flex gap-3 justify-between items-center bg-white">
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border ${viewingContract.statusColor}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    Trạng thái: {viewingContract.statusLabel}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadContract(viewingContract)}
                    className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                  >
                    <Download className="w-4 h-4" /> In / Tải PDF
                  </button>
                  <button 
                    onClick={() => setViewingContract(null)}
                    className="px-6 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-950 transition-all"
                  >
                    Đóng lại
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
