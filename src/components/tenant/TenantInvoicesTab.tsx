import React from 'react';
import { motion } from 'motion/react';
import { Wallet, Info, FileText, CheckCircle, CreditCard, ChevronRight } from 'lucide-react';

interface TenantInvoicesTabProps {
  invoicesData: any[];
  onViewInvoice: (invoice: any) => void;
  onPayInvoice: (invoiceId: string) => void;
}

export const TenantInvoicesTab = ({ invoicesData, onViewInvoice, onPayInvoice }: TenantInvoicesTabProps) => {
  const invoices = invoicesData.map(inv => ({
    id: inv.id,
    title: inv.title,
    room: inv.rooms?.title || 'Unknown Room',
    amount: `${Number(inv.amount).toLocaleString()}đ`,
    dueDate: new Date(inv.due_date).toLocaleDateString('vi-VN'),
    status: inv.status,
    statusLabel: inv.status === 'paid' ? 'Đã thanh toán' : 
                 inv.status === 'unpaid' ? 'Chưa thanh toán' : 
                 inv.status === 'pending_verification' ? 'Chờ xác nhận' : 'Quá hạn',
    statusColor: inv.status === 'paid' ? 'bg-green-100 text-green-700' : 
                 inv.status === 'unpaid' ? 'bg-orange-100 text-orange-700' : 
                 inv.status === 'pending_verification' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700',
    raw: inv
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-display">Hóa đơn của tôi</h2>
          <p className="text-slate-500 font-medium">Theo dõi và thanh toán hóa đơn hàng tháng.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {invoices.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500">Bạn chưa có hóa đơn nào.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tiêu đề (Phòng)</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hạn thanh toán</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng tiền</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-slate-900 font-display">{inv.title}</span>
                        <span className="text-xs font-bold text-primary">{inv.room}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-slate-500">{inv.dueDate}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-slate-900">{inv.amount}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${inv.statusColor}`}>
                        {inv.statusLabel}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onViewInvoice(inv.raw)}
                          className="p-2 text-slate-400 hover:text-primary bg-slate-50 hover:bg-primary/10 rounded-xl transition-colors"
                          title="Xem chi tiết"
                        >
                          <Info className="w-5 h-5" />
                        </button>
                        
                        {inv.status === 'unpaid' && (
                          <button
                            onClick={() => onPayInvoice(inv.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary-hover transition-colors"
                          >
                            <CreditCard className="w-4 h-4" />
                            Đã CK
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};
