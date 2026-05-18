import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Receipt, Search, Copy, Check, Calendar, CreditCard, Sparkles, User, RefreshCw, Eye
} from 'lucide-react';

interface ServiceInvoice {
  id: string;
  user_id: string;
  txn_ref: string;
  amount: number;
  tier: string;
  status: string;
  created_at: string;
  profiles?: {
    full_name: string;
    phone: string;
    avatar_url: string;
  };
}

interface AdminServiceInvoicesTabProps {
  invoices: ServiceInvoice[];
  loading: boolean;
  onRefresh: () => void;
  formatDate: (d: string) => string;
}

export const AdminServiceInvoicesTab = ({ invoices, loading, onRefresh, formatDate }: AdminServiceInvoicesTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyTxn = (txnRef: string) => {
    navigator.clipboard.writeText(txnRef);
    setCopiedId(txnRef);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredInvoices = invoices.filter(inv => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    const name = inv.profiles?.full_name?.toLowerCase() || '';
    const phone = inv.profiles?.phone?.toLowerCase() || '';
    const txn = inv.txn_ref.toLowerCase();
    const tier = inv.tier.toLowerCase();
    
    return name.includes(query) || phone.includes(query) || txn.includes(query) || tier.includes(query);
  });

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm shrink-0">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Lịch sử Hóa đơn Dịch vụ VIP
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Danh sách đối soát hóa đơn nâng cấp Pro/Enterprise thực tế qua cổng VNPay.
          </p>
        </div>

        <button 
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold active:scale-95 transition-all shadow-sm shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Tải lại dữ liệu
        </button>
      </div>

      {/* Search Input */}
      <div className="relative shrink-0">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm theo tên chủ trọ, số điện thoại, mã giao dịch VNPay..."
          className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-sm text-slate-900 shadow-sm"
        />
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            <p className="text-slate-500 font-bold text-sm">Đang tải danh sách hóa đơn dịch vụ...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
              <Receipt className="w-8 h-8" />
            </div>
            <p className="text-slate-900 font-black text-base">Không tìm thấy hóa đơn nào</p>
            <p className="text-slate-500 font-medium text-xs mt-1">Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc lịch sử nâng cấp.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4.5">Khách hàng / Ngày lập</th>
                  <th className="px-6 py-4.5">Mã giao dịch VNPay</th>
                  <th className="px-6 py-4.5 text-center">Gói dịch vụ</th>
                  <th className="px-6 py-4.5 text-right">Số tiền</th>
                  <th className="px-6 py-4.5 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredInvoices.map((inv) => (
                  <motion.tr 
                    key={inv.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50/40 transition-colors"
                  >
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                          {inv.profiles?.avatar_url ? (
                            <img src={inv.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{inv.profiles?.full_name || 'Chủ trọ ẩn danh'}</p>
                          <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {formatDate(inv.created_at)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                          {inv.txn_ref}
                        </span>
                        <button
                          onClick={() => handleCopyTxn(inv.txn_ref)}
                          className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                          title="Sao chép mã giao dịch"
                        >
                          {copiedId === inv.txn_ref ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-4.5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                        inv.tier === 'enterprise'
                          ? 'bg-purple-50 text-purple-600 border-purple-200/50'
                          : 'bg-orange-50 text-orange-600 border-orange-200/50'
                      }`}>
                        <Sparkles className="w-3 h-3" />
                        {inv.tier === 'enterprise' ? 'Enterprise' : 'Pro'}
                      </span>
                    </td>

                    <td className="px-6 py-4.5 text-right">
                      <span className="font-black text-slate-900 text-base">
                        {inv.amount.toLocaleString('vi-VN')} đ
                      </span>
                    </td>

                    <td className="px-6 py-4.5 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black border border-emerald-200/50 uppercase tracking-wide">
                        Thành công
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
