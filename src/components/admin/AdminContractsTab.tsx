import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileSignature, Calendar, User, Home, DollarSign, FileText,
  AlertCircle, CheckCircle, Clock, Loader2, Eye, Edit, Trash2, X,
  MapPin, Phone, ExternalLink
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-600 border border-blue-200">
            <Clock className="w-3 h-3" /> Chờ ký kết
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-600 border border-emerald-200">
            <CheckCircle className="w-3 h-3" /> Đang hiệu lực
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-600 border border-amber-200">
            <AlertCircle className="w-3 h-3" /> Đã hết hạn
          </span>
        );
      case 'terminated':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
            <FileText className="w-3 h-3" /> Đã thanh lý
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-400 border border-slate-200">
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

  const filteredContracts = contracts.filter(c => {
    if (activeTab === 'all') return true;
    return c.status === activeTab;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col w-full h-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileSignature className="text-primary w-8 h-8" />
            Quản lý Hợp đồng
          </h2>
          <p className="text-slate-500 mt-1">Giám sát các cam kết thuê phòng và giao dịch đặt cọc.</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 shrink-0">
        {[
          { key: 'all', label: 'Tổng hợp đồng', count: stats.total, icon: <FileSignature className="w-6 h-6"/>, color: 'blue' },
          { key: 'active', label: 'Đang hiệu lực', count: stats.active, icon: <CheckCircle className="w-6 h-6"/>, color: 'emerald' },
          { key: 'expired', label: 'Đã hết hạn', count: stats.expired, icon: <AlertCircle className="w-6 h-6"/>, color: 'amber' },
          { key: 'terminated', label: 'Đã thanh lý', count: stats.terminated, icon: <FileText className="w-6 h-6"/>, color: 'slate' },
        ].map(s => (
          <div key={s.key}
            className={`bg-white p-6 rounded-xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${activeTab === s.key ? `border-${s.color === 'blue' ? 'primary' : s.color+'-500'} ring-1 ring-${s.color === 'blue' ? 'primary' : s.color+'-500'}` : 'border-slate-200'}`}
            onClick={() => setActiveTab(s.key)}
          >
            <div className={`p-3 bg-${s.color}-100 text-${s.color}-600 rounded-lg`}>{s.icon}</div>
            <div>
              <p className="text-sm text-slate-500 font-medium whitespace-nowrap uppercase tracking-tighter">{s.label}</p>
              <p className="text-2xl font-black text-slate-900">{loading ? '-' : s.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex-1 flex flex-col min-h-0">
        <div className="flex border-b border-slate-200 px-6 shrink-0 bg-slate-50/50">
          {['all', 'active', 'expired', 'terminated'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`py-4 px-6 border-b-2 font-black text-sm whitespace-nowrap uppercase transition-all ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 font-bold'}`}
            >
              {tab === 'all' ? 'Tất cả' : tab === 'active' ? 'Đang hiệu lực' : tab === 'expired' ? 'Đã hết hạn' : 'Đã thanh lý'}
            </button>
          ))}
        </div>

        <div className="overflow-auto flex-1">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-slate-500 font-black uppercase text-xs">Đang tải danh sách...</p>
            </div>
          ) : filteredContracts.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <FileSignature className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-black uppercase text-xs">Không tìm thấy hợp đồng nào.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 sticky top-0 z-10 text-slate-500 text-xs font-black uppercase tracking-wider">
                  <th className="px-6 py-4">Thông tin Hợp đồng</th>
                  <th className="px-6 py-4">Bên cho thuê</th>
                  <th className="px-6 py-4">Bên thuê</th>
                  <th className="px-6 py-4">Giá thuê & Cọc</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredContracts.map(contract => (
                  <tr key={contract.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-black text-slate-900 line-clamp-1">{contract.roomInfo?.title || 'Phòng không xác định'}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
                          <Calendar className="w-3 h-3" />
                          {formatDate(contract.start_date).split(' ')[0]} → {formatDate(contract.end_date).split(' ')[0]}
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 font-mono">#{contract.id.substring(0,8)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600 overflow-hidden border border-blue-100">
                          {contract.landlordInfo?.avatar_url ? <img src={contract.landlordInfo.avatar_url} className="w-full h-full object-cover" alt="avatar" /> : getInitials(contract.landlordInfo?.full_name)}
                        </div>
                        <p className="text-xs font-bold text-slate-700">{contract.landlordInfo?.full_name || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-[10px] font-bold text-emerald-600 overflow-hidden border border-emerald-100">
                          {contract.tenantInfo?.avatar_url ? <img src={contract.tenantInfo.avatar_url} className="w-full h-full object-cover" alt="avatar" /> : getInitials(contract.tenantInfo?.full_name)}
                        </div>
                        <p className="text-xs font-bold text-slate-700">{contract.tenantInfo?.full_name || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-primary">{(contract.monthly_rent || 0).toLocaleString('vi-VN')}đ</p>
                      <p className="text-[10px] text-slate-400 font-bold italic">Cọc: {(contract.deposit || 0).toLocaleString('vi-VN')}đ</p>
                    </td>
                    <td className="px-6 py-5">{getStatusBadge(contract.status)}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => setViewingContract(contract)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all" title="Xem chi tiết">
                          <Eye className="w-4 h-4" />
                        </button>
                        {handleUpdateContract && (
                          <button onClick={() => openEditModal(contract)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Sửa hợp đồng">
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {handleDeleteContract && (
                          <button onClick={() => handleDeleteContract(contract.id)}
                            disabled={actionLoading === contract.id}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-50" title="Xóa hợp đồng">
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-primary/10 text-primary rounded-xl"><FileSignature className="w-5 h-5" /></span>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Chi tiết Hợp đồng</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{viewingContract.id.substring(0,8)}</p>
                  </div>
                </div>
                <button onClick={() => setViewingContract(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-6 space-y-5">
                {/* Room info */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Home className="w-3.5 h-3.5" />Thông tin phòng</h4>
                  <p className="font-black text-slate-900 text-base">{viewingContract.roomInfo?.title || 'N/A'}</p>
                  {viewingContract.roomInfo?.location && (
                    <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-1"><MapPin className="w-3.5 h-3.5 text-primary" />{viewingContract.roomInfo.location}</p>
                  )}
                </div>

                {/* Parties */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2"><User className="w-3.5 h-3.5"/>Bên cho thuê</h4>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 overflow-hidden border border-blue-200">
                        {viewingContract.landlordInfo?.avatar_url ? <img src={viewingContract.landlordInfo.avatar_url} className="w-full h-full object-cover" alt="a" /> : getInitials(viewingContract.landlordInfo?.full_name)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm">{viewingContract.landlordInfo?.full_name || 'N/A'}</p>
                        {viewingContract.landlordInfo?.phone && <p className="text-[11px] text-slate-500 flex items-center gap-1"><Phone className="w-3 h-3"/>{viewingContract.landlordInfo.phone}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100">
                    <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2"><User className="w-3.5 h-3.5"/>Bên thuê</h4>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600 overflow-hidden border border-emerald-200">
                        {viewingContract.tenantInfo?.avatar_url ? <img src={viewingContract.tenantInfo.avatar_url} className="w-full h-full object-cover" alt="a" /> : getInitials(viewingContract.tenantInfo?.full_name)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm">{viewingContract.tenantInfo?.full_name || 'N/A'}</p>
                        {viewingContract.tenantInfo?.phone && <p className="text-[11px] text-slate-500 flex items-center gap-1"><Phone className="w-3 h-3"/>{viewingContract.tenantInfo.phone}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial & Dates */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><DollarSign className="w-3.5 h-3.5"/>Tài chính & Thời hạn</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Tiền thuê/tháng</p><p className="text-lg font-black text-primary">{(viewingContract.monthly_rent || 0).toLocaleString('vi-VN')}đ</p></div>
                    <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Tiền đặt cọc</p><p className="text-lg font-black text-slate-900">{(viewingContract.deposit || 0).toLocaleString('vi-VN')}đ</p></div>
                    <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Ngày bắt đầu</p><p className="text-sm font-bold text-slate-900">{formatDate(viewingContract.start_date)}</p></div>
                    <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Ngày kết thúc</p><p className="text-sm font-bold text-slate-900">{formatDate(viewingContract.end_date)}</p></div>
                  </div>
                </div>

                {/* Status & Document */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Trạng thái hợp đồng</p>
                    {getStatusBadge(viewingContract.status)}
                  </div>
                  {viewingContract.contract_url && (
                    <a href={viewingContract.contract_url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-black hover:bg-primary/20 transition-colors uppercase">
                      <ExternalLink className="w-3.5 h-3.5"/> Xem PDF
                    </a>
                  )}
                </div>
              </div>

              <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
                <button onClick={() => setViewingContract(null)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Đóng lại</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL SỬA THÔNG TIN HỢP ĐỒNG */}
      <AnimatePresence>
        {editingContract && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Edit className="w-5 h-5" /></span>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Chỉnh sửa Hợp đồng</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{editingContract.roomInfo?.title || editingContract.id.substring(0, 8)}</p>
                  </div>
                </div>
                <button onClick={() => setEditingContract(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Ngày bắt đầu</label>
                    <input type="date" value={editForm.start_date}
                      onChange={e => setEditForm({ ...editForm, start_date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Ngày kết thúc</label>
                    <input type="date" value={editForm.end_date}
                      onChange={e => setEditForm({ ...editForm, end_date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Tiền thuê/tháng (đ)</label>
                    <input type="number" value={editForm.monthly_rent}
                      onChange={e => setEditForm({ ...editForm, monthly_rent: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Tiền đặt cọc (đ)</label>
                    <input type="number" value={editForm.deposit}
                      onChange={e => setEditForm({ ...editForm, deposit: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Trạng thái hợp đồng</label>
                  <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all appearance-none">
                    <option value="active">Đang hiệu lực</option>
                    <option value="expired">Đã hết hạn</option>
                    <option value="terminated">Đã thanh lý</option>
                  </select>
                </div>
              </div>
              <div className="px-6 pb-6 flex justify-end gap-3">
                <button onClick={() => setEditingContract(null)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Hủy bỏ</button>
                <button
                  onClick={() => { handleUpdateContract?.(editingContract.id, editForm); setEditingContract(null); }}
                  disabled={actionLoading === editingContract.id}
                  className="px-6 py-2.5 text-sm font-black bg-primary text-white hover:bg-primary-hover rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2"
                >
                  {actionLoading === editingContract.id && <Loader2 className="w-4 h-4 animate-spin" />}
                  LƯU THAY ĐỔI
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
