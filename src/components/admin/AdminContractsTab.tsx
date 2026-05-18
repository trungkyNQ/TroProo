import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileSignature, Calendar, User, Home, DollarSign, FileText,
  AlertCircle, CheckCircle, Clock, Loader2, Eye, Edit, Trash2, X,
  MapPin, Phone, ExternalLink, Search, ChevronRight
} from 'lucide-react';

interface Contract {
  id: string;
  room_id: string;
  tenant_id: string;
  owner_id: string;
  start_date: string;
  end_date: string;
  monthly_rent?: number;
  deposit: number;
  status: 'active' | 'terminated' | 'expired';
  contract_url?: string;
  roomInfo?: { title: string; location?: string };
  tenantInfo?: { full_name: string; avatar_url: string; phone?: string };
  landlordInfo?: { full_name: string; avatar_url: string; phone?: string };
}

interface ContractEditForm {
  start_date: string;
  end_date: string;
  monthly_rent: number;
  deposit: number;
  status: string;
}

interface AdminContractsTabProps {
  contracts: Contract[];
  loading: boolean;
  actionLoading?: string | null;
  formatDate: (date: string) => string;
  getInitials: (name?: string) => string;
  handleUpdateContract?: (id: string, form: ContractEditForm) => void;
  handleDeleteContract?: (id: string) => void;
}

export const AdminContractsTab = ({ 
  contracts, loading, actionLoading, formatDate, getInitials,
  handleUpdateContract, handleDeleteContract
}: AdminContractsTabProps) => {

  const [activeTab, setActiveTab] = useState('all');
  const [viewingContract, setViewingContract] = useState<Contract | null>(null);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [editForm, setEditForm] = useState<ContractEditForm>({
    start_date: '',
    end_date: '',
    monthly_rent: 0,
    deposit: 0,
    status: 'active',
  });

  const openEditModal = (contract: Contract) => {
    setEditingContract(contract);
    setEditForm({
      start_date: contract.start_date?.substring(0, 10) || '',
      end_date: contract.end_date?.substring(0, 10) || '',
      monthly_rent: contract.monthly_rent || 0,
      deposit: contract.deposit || 0,
      status: contract.status,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
            <Clock className="w-3 h-3" /> Chờ ký kết
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle className="w-3 h-3" /> Đang hiệu lực
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100">
            <AlertCircle className="w-3 h-3" /> Đã hết hạn
          </span>
        );
      case 'terminated':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-50 text-slate-500 border border-slate-200">
            <FileText className="w-3 h-3" /> Đã thanh lý
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-50 text-slate-400 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const stats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    expired: contracts.filter(c => c.status === 'expired').length,
    terminated: contracts.filter(c => c.status === 'terminated').length,
  };

  // Search filter implementation
  const filteredContracts = contracts.filter(c => {
    // 1. Tab filter
    if (activeTab !== 'all' && c.status !== activeTab) return false;

    // 2. Search query filter
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const contractId = c.id.toLowerCase();
    const roomTitle = c.roomInfo?.title?.toLowerCase() || '';
    const roomLocation = c.roomInfo?.location?.toLowerCase() || '';
    const tenantName = c.tenantInfo?.full_name?.toLowerCase() || '';
    const landlordName = c.landlordInfo?.full_name?.toLowerCase() || '';
    const tenantPhone = c.tenantInfo?.phone?.toLowerCase() || '';
    const landlordPhone = c.landlordInfo?.phone?.toLowerCase() || '';
    const rentVal = String(c.monthly_rent || '');
    const depositVal = String(c.deposit || '');

    return contractId.includes(query) || 
           roomTitle.includes(query) || 
           roomLocation.includes(query) || 
           tenantName.includes(query) ||
           landlordName.includes(query) ||
           tenantPhone.includes(query) ||
           landlordPhone.includes(query) ||
           rentVal.includes(query) ||
           depositVal.includes(query);
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="flex flex-col w-full h-full pb-10"
    >
      {/* Title Header Section */}
      <div className="mb-8 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span className="bg-primary/10 text-primary p-2 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-primary/10">
              <FileSignature className="w-7 h-7" />
            </span>
            Quản lý Hợp đồng
          </h2>
          <p className="text-slate-500 mt-1 font-medium">Giám sát toàn bộ các cam kết thuê phòng, đặt cọc và hiệu lực pháp lý của hợp đồng điện tử.</p>
        </div>
      </div>

      {/* Grid Stats Counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 shrink-0">
        {[
          { key: 'all', label: 'Tổng hợp đồng', count: stats.total, icon: <FileSignature className="w-6 h-6"/>, color: 'blue' },
          { key: 'active', label: 'Đang hiệu lực', count: stats.active, icon: <CheckCircle className="w-6 h-6"/>, color: 'emerald' },
          { key: 'expired', label: 'Đã hết hạn', count: stats.expired, icon: <AlertCircle className="w-6 h-6"/>, color: 'amber' },
          { key: 'terminated', label: 'Đã thanh lý', count: stats.terminated, icon: <FileText className="w-6 h-6"/>, color: 'slate' },
        ].map(s => {
          const isSelected = activeTab === s.key;
          const outlineColors: Record<string, string> = {
            blue: 'border-primary ring-primary/20',
            emerald: 'border-emerald-500 ring-emerald-500/20',
            amber: 'border-amber-500 ring-amber-500/20',
            slate: 'border-slate-500 ring-slate-500/20'
          };
          const textIconColors: Record<string, string> = {
            blue: 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600',
            emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600',
            amber: 'bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-600',
            slate: 'bg-slate-50 text-slate-600 border-slate-200 group-hover:bg-slate-600'
          };

          return (
            <div 
              key={s.key}
              onClick={() => setActiveTab(s.key)}
              className={`group bg-white p-6 rounded-3xl border flex items-center gap-5 shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ${
                isSelected ? `ring-2 ${outlineColors[s.color]}` : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className={`p-3.5 rounded-2xl border group-hover:text-white transition-all duration-300 shrink-0 ${textIconColors[s.color]}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{loading ? '-' : s.count}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Control Actions & Searching */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 shrink-0 bg-slate-50 p-4 rounded-3xl border border-slate-200/60">
        
        {/* Local Search Input */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Tìm theo chủ trọ, khách thuê, tên phòng, mã ID, giá thuê hoặc tiền đặt cọc..."
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
            {filteredContracts.length} hợp đồng
          </span>
        </div>
      </div>

      {/* Widescreen Contract Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm flex-1 flex flex-col min-h-0">
        
        {/* Tabs internal navigation */}
        <div className="flex border-b border-slate-200/80 px-6 shrink-0 bg-slate-50/50">
          {['all', 'active', 'expired', 'terminated'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-6 border-b-2 font-black text-xs whitespace-nowrap uppercase tracking-wider transition-all relative ${
                activeTab === tab 
                  ? 'border-primary text-primary font-black' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 font-bold'
              }`}
            >
              {tab === 'all' ? 'Tất cả' : tab === 'active' ? 'Đang hiệu lực' : tab === 'expired' ? 'Đã hết hạn' : 'Đã thanh lý'}
              {activeTab === tab && (
                <motion.div layoutId="activeContractTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Table Body Area */}
        <div className="overflow-auto flex-1">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-6 py-4 border-b border-slate-100 animate-pulse">
                  <div className="w-48 space-y-2 shrink-0">
                    <div className="h-4 bg-slate-200 rounded w-4/5" />
                    <div className="h-3 bg-slate-200 rounded w-2/3" />
                  </div>
                  <div className="w-36 shrink-0 flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-200 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 bg-slate-200 rounded w-2/3" />
                    </div>
                  </div>
                  <div className="w-36 shrink-0 flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-200 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 bg-slate-200 rounded w-2/3" />
                    </div>
                  </div>
                  <div className="w-32 space-y-2 shrink-0">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                  </div>
                  <div className="w-24 shrink-0">
                    <div className="h-5 bg-slate-200 rounded-full w-4/5" />
                  </div>
                  <div className="w-28 h-8 bg-slate-200 rounded-lg ml-auto shrink-0 animate-pulse" />
                </div>
              ))}
            </div>
          ) : filteredContracts.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <FileSignature className="w-8 h-8" />
              </div>
              <p className="text-slate-500 font-black uppercase text-xs tracking-wider">Không tìm thấy hợp đồng nào.</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Chọn bộ lọc khác hoặc nhập từ khóa mới để tìm kiếm.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 sticky top-0 z-10 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-6 py-4">Hợp đồng & Căn hộ</th>
                  <th className="px-6 py-4">Bên Cho Thuê (Chủ)</th>
                  <th className="px-6 py-4">Bên Thuê (Khách)</th>
                  <th className="px-6 py-4">Giá thuê & Tiền cọc</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredContracts.map(contract => (
                  <tr key={contract.id} className="hover:bg-slate-50/40 transition-colors group">
                    
                    {/* Contract ID and apartment title */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1 max-w-xs">
                        <p className="text-xs font-black text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">{contract.roomInfo?.title || 'Phòng không xác định'}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
                          <Calendar className="w-3.5 h-3.5 text-slate-300" />
                          {formatDate(contract.start_date).split(' ')[0]} → {formatDate(contract.end_date).split(' ')[0]}
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 font-mono">#{contract.id.substring(0,8)}</span>
                      </div>
                    </td>

                    {/* Landlord information */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-2xl bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600 overflow-hidden border border-blue-100 shadow-inner group-hover:scale-105 transition-transform duration-300">
                          {contract.landlordInfo?.avatar_url ? (
                            <img src={contract.landlordInfo.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                          ) : (
                            getInitials(contract.landlordInfo?.full_name)
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-700 leading-tight">{contract.landlordInfo?.full_name || 'N/A'}</p>
                          {contract.landlordInfo?.phone && (
                            <p className="text-[9px] text-slate-400 font-bold flex items-center gap-0.5 mt-0.5"><Phone className="w-2.5 h-2.5 text-blue-400" /> {contract.landlordInfo.phone}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Tenant information */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-2xl bg-emerald-50 flex items-center justify-center text-[10px] font-bold text-emerald-600 overflow-hidden border border-emerald-100 shadow-inner group-hover:scale-105 transition-transform duration-300">
                          {contract.tenantInfo?.avatar_url ? (
                            <img src={contract.tenantInfo.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                          ) : (
                            getInitials(contract.tenantInfo?.full_name)
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-700 leading-tight">{contract.tenantInfo?.full_name || 'N/A'}</p>
                          {contract.tenantInfo?.phone && (
                            <p className="text-[9px] text-slate-400 font-bold flex items-center gap-0.5 mt-0.5"><Phone className="w-2.5 h-2.5 text-emerald-400" /> {contract.tenantInfo.phone}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Financial stats */}
                    <td className="px-6 py-5">
                      <p className="text-xs font-black text-slate-900">{(contract.monthly_rent || 0).toLocaleString('vi-VN')} đ</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Cọc: {(contract.deposit || 0).toLocaleString('vi-VN')} đ</p>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-5">{getStatusBadge(contract.status)}</td>

                    {/* Action panel */}
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-1">
                        
                        {/* Viewing Detail button */}
                        <button 
                          onClick={() => setViewingContract(contract)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all" 
                          title="Xem chi tiết hợp đồng"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {/* Edit Contract */}
                        {handleUpdateContract && (
                          <button 
                            onClick={() => openEditModal(contract)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" 
                            title="Sửa điều khoản hợp đồng"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete Contract */}
                        {handleDeleteContract && (
                          <button 
                            onClick={() => handleDeleteContract(contract.id)}
                            disabled={actionLoading === contract.id}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-50" 
                            title="Xóa hợp đồng"
                          >
                            {actionLoading === contract.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL XEM CHI TIẾT HỢP ĐỒNG */}
      <AnimatePresence>
        {viewingContract && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setViewingContract(null)}>
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-slate-100"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal header decorative */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-primary/10 text-primary rounded-2xl border border-primary/5"><FileSignature className="w-5 h-5" /></span>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">Chi tiết Hợp đồng thuê</h3>
                    <p className="text-[10px] font-bold text-slate-400 font-mono mt-0.5">#{viewingContract.id}</p>
                  </div>
                </div>
                <button onClick={() => setViewingContract(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable contract summary details */}
              <div className="overflow-y-auto flex-1 p-6 space-y-6">
                
                {/* Room Info */}
                <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200/60 shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-slate-200/20 rounded-full pointer-events-none -mr-4 -mt-4"></div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Home className="w-3.5 h-3.5" /> Thông tin phòng cho thuê
                  </h4>
                  <p className="font-black text-slate-900 text-base">{viewingContract.roomInfo?.title || 'N/A'}</p>
                  {viewingContract.roomInfo?.location && (
                    <p className="text-xs text-slate-500 font-bold flex items-center gap-1.5 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      {viewingContract.roomInfo.location}
                    </p>
                  )}
                </div>

                {/* Landlord & Tenant details side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Landlord card */}
                  <div className="bg-blue-50/40 rounded-3xl p-5 border border-blue-100 shadow-inner">
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <User className="w-3.5 h-3.5"/> Bên Cho Thuê (Chủ trọ)
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 overflow-hidden border border-blue-200 shadow-sm shrink-0">
                        {viewingContract.landlordInfo?.avatar_url ? <img src={viewingContract.landlordInfo.avatar_url} className="w-full h-full object-cover" alt="a" /> : getInitials(viewingContract.landlordInfo?.full_name)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm leading-tight">{viewingContract.landlordInfo?.full_name || 'N/A'}</p>
                        {viewingContract.landlordInfo?.phone && (
                          <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3 text-blue-400"/> {viewingContract.landlordInfo.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tenant card */}
                  <div className="bg-emerald-50/40 rounded-3xl p-5 border border-emerald-100 shadow-inner">
                    <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <User className="w-3.5 h-3.5"/> Bên Thuê (Khách thuê)
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600 overflow-hidden border border-emerald-200 shadow-sm shrink-0">
                        {viewingContract.tenantInfo?.avatar_url ? <img src={viewingContract.tenantInfo.avatar_url} className="w-full h-full object-cover" alt="a" /> : getInitials(viewingContract.tenantInfo?.full_name)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm leading-tight">{viewingContract.tenantInfo?.full_name || 'N/A'}</p>
                        {viewingContract.tenantInfo?.phone && (
                          <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3 text-emerald-400"/> {viewingContract.tenantInfo.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial & Timeframe details grid */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-primary" /> Tài chính & Kỳ hạn hợp đồng
                  </h4>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Giá Thuê Mỗi Tháng</p>
                      <p className="text-base font-black text-primary">{(viewingContract.monthly_rent || 0).toLocaleString('vi-VN')} đ</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Tiền Đặt Cọc Bảo Lãnh</p>
                      <p className="text-base font-black text-slate-900">{(viewingContract.deposit || 0).toLocaleString('vi-VN')} đ</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Ngày Hiệu Lực</p>
                      <p className="text-xs font-bold text-slate-900">{formatDate(viewingContract.start_date)}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Ngày Hết Hạn</p>
                      <p className="text-xs font-bold text-slate-900">{formatDate(viewingContract.end_date)}</p>
                    </div>
                  </div>
                </div>

                {/* Document verification file download */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-3xl border border-slate-200/60 shadow-inner">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Trạng thái hiện tại</p>
                    {getStatusBadge(viewingContract.status)}
                  </div>
                  {viewingContract.contract_url && (
                    <a 
                      href={viewingContract.contract_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/10 rounded-2xl text-xs font-black transition-colors uppercase tracking-wider"
                    >
                      <ExternalLink className="w-3.5 h-3.5"/> Xem bản PDF
                    </a>
                  )}
                </div>
              </div>

              {/* Close footer */}
              <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
                <button 
                  onClick={() => setViewingContract(null)} 
                  className="px-6 py-2.5 text-xs font-black uppercase tracking-wider text-slate-500 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Đóng cửa sổ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL SỬA THÔNG TIN HỢP ĐỒNG */}
      <AnimatePresence>
        {editingContract && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100"
            >
              {/* Header block */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Edit className="w-5 h-5" /></span>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">Chỉnh sửa hợp đồng</h3>
                    <p className="text-[10px] font-bold text-slate-400 font-mono mt-0.5">#{editingContract.id.substring(0,8)}</p>
                  </div>
                </div>
                <button onClick={() => setEditingContract(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form elements */}
              <div className="p-6 space-y-4">
                
                {/* Dates picker */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Ngày bắt đầu</label>
                    <input 
                      type="date" 
                      value={editForm.start_date}
                      onChange={e => setEditForm({ ...editForm, start_date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all shadow-inner" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Ngày kết thúc</label>
                    <input 
                      type="date" 
                      value={editForm.end_date}
                      onChange={e => setEditForm({ ...editForm, end_date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all shadow-inner" 
                    />
                  </div>
                </div>

                {/* Financial prices */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tiền thuê/tháng (đ)</label>
                    <input 
                      type="number" 
                      value={editForm.monthly_rent}
                      onChange={e => setEditForm({ ...editForm, monthly_rent: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all shadow-inner" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tiền đặt cọc (đ)</label>
                    <input 
                      type="number" 
                      value={editForm.deposit}
                      onChange={e => setEditForm({ ...editForm, deposit: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all shadow-inner" 
                    />
                  </div>
                </div>

                {/* Status select dropdown */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Trạng thái hợp đồng</label>
                  <div className="relative">
                    <select 
                      value={editForm.status} 
                      onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all appearance-none"
                    >
                      <option value="active">Đang hiệu lực</option>
                      <option value="expired">Đã hết hạn</option>
                      <option value="terminated">Đã thanh lý</option>
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="px-6 pb-6 pt-2 flex justify-end gap-3 shrink-0">
                <button 
                  onClick={() => setEditingContract(null)} 
                  className="px-5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={() => { handleUpdateContract?.(editingContract.id, editForm); setEditingContract(null); }}
                  disabled={actionLoading === editingContract.id}
                  className="px-6 py-2.5 text-xs font-black bg-primary text-white hover:bg-primary-hover rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-wider"
                >
                  {actionLoading === editingContract.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
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
