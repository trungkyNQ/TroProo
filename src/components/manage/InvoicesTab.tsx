import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home, HomeIcon, Bed, Wallet, Plus, FileText, User, ChevronLeft, ChevronRight,
  AlertCircle, PhoneCall, Trash2, Edit3, Camera, BadgeCheck, Phone, Zap, Droplets,
  ShieldCheck, Clock, CheckCircle, X, Search, Wrench, Mail, MessageSquare, PlusCircle,
  Image as ImageIcon, MapPin, Users, Settings, Lock as LockIcon, LogOut, MoreVertical,
  MoreHorizontal, Filter, ArrowUpDown, Maximize2, Info, Layers, Construction, ArrowLeft,
  Calendar, Eye, EyeOff, Sparkles, FileClock, Shield, ShieldAlert, Ban, Download,
  MessageCircle, FileSignature, HelpCircle, UserX, UserCheck, Save, Send, Smile, Video,
  ChevronDown, RefreshCw
} from 'lucide-react';
import Messaging from '../shared/Messaging';


interface InvoicesTabProps {
  invoicesData: any[];
  roomsData: any[];
  contractsData: any[];
  hasRooms: boolean;
  onOpenCreateInvoice: (roomId?: string) => void;
  onCreateInvoice: (data: any) => void;
  onUpdateStatus: (id: string, status: string) => void;
}

export const InvoicesTab = ({ invoicesData, roomsData, contractsData, hasRooms, onOpenCreateInvoice, onCreateInvoice, onUpdateStatus }: InvoicesTabProps) => {
  const invoices = invoicesData.map(inv => ({
    id: inv.id,
    tenant: inv.profiles?.full_name || 'N/A',
    room: inv.rooms?.title || 'N/A',
    amount: `${Number(inv.amount).toLocaleString()}đ`,
    dueDate: new Date(inv.due_date).toLocaleDateString('vi-VN'),
    status: inv.status,
    statusLabel: inv.status === 'paid' ? 'Đã thanh toán' : 
                 inv.status === 'unpaid' ? 'Chưa thanh toán' : 
                 inv.status === 'pending_verification' ? 'Chờ xác nhận' : 'Quá hạn',
    statusColor: inv.status === 'paid' ? 'bg-green-100 text-green-700' : 
                 inv.status === 'unpaid' ? 'bg-orange-100 text-orange-700' : 
                 inv.status === 'pending_verification' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
  }));

  const stats = [
    { label: 'Chưa thanh toán', value: invoicesData.filter(inv => inv.status === 'unpaid').length, sub: 'Cần đốc thúc', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Đã thanh toán', value: invoicesData.filter(inv => inv.status === 'paid').length, sub: 'Tháng này', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Chờ xác nhận', value: invoicesData.filter(inv => inv.status === 'pending_verification').length, sub: 'Giao dịch mới', icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Quá hạn', value: invoicesData.filter(inv => inv.status === 'overdue').length, sub: 'Cần xử lý', icon: Ban, color: 'text-red-600', bg: 'bg-red-100' }
  ];

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().getDate();

  const dueRooms = roomsData.filter(room => {
    // Check if room is occupied
    if (room.status !== 'occupied') return false;

    // Billing day is from the created_at initially or we can just use the created_at direct logic
    const billingDay = new Date(room.created_at).getDate();
    
    // Have we reached or passed the billing day this month?
    if (currentDate < billingDay) return false;

    // Check if an invoice has already been created this month for this room
    const hasInvoiceThisMonth = invoicesData.some(inv => {
      if (inv.room_id !== room.id) return false;
      const invDate = new Date(inv.created_at);
      return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
    });

    return !hasInvoiceThisMonth;
  });

  const [quickBillInputs, setQuickBillInputs] = useState<Record<string, { elec: string, water: string }>>({});

  const getPreviousReading = (roomId: string, type: 'elec' | 'water') => {
    const room = roomsData.find(r => r.id === roomId);
    if (!room) return 0;
    
    const initial = type === 'elec' ? (room.initial_electricity_number || 0) : (room.initial_water_number || 0);
    const totalUsage = invoicesData
      .filter(inv => inv.room_id === roomId)
      .reduce((sum, inv) => sum + (type === 'elec' ? (inv.electricity_usage || 0) : (inv.water_usage || 0)), 0);
    
    return initial + totalUsage;
  };

  const activeTab = 'invoices';

  return (
    <>
      {activeTab === 'invoices' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-display">Quản lý Hóa Đơn</h2>
                  <p className="text-slate-500 font-medium">Theo dõi tình trạng thanh toán tiền phòng và dịch vụ.</p>
                </div>

              </div>

              {/* Empty state when no rooms yet */}
              {!hasRooms ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-200">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                    <FileText className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có phòng nào</h3>
                  <p className="text-slate-500 max-w-sm">Hóa đơn sẽ xuất hiện sau khi bạn thêm phòng và gán người thuê.</p>
                </div>
              ) : (<>
              {/* Statistics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-500 text-xs font-black uppercase tracking-widest">{stat.label}</span>
                      <div className={`${stat.bg} ${stat.color} p-2 rounded-xl`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900 font-display">{stat.value}</div>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">{stat.sub}</p>
                  </div>
                ))}
              </div>


              {dueRooms.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-slate-900 font-black text-xl flex items-center gap-2 font-display">
                        <Zap className="w-6 h-6 text-primary" />
                        Chốt hóa đơn nhanh
                      </h3>
                      <p className="text-slate-500 text-sm font-medium">Có {dueRooms.length} phòng đến hạn thu tiền tháng này.</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                      <Clock className="w-4 h-4" />
                      Hạn chốt: {new Date().toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  
                  <form onSubmit={(e) => e.preventDefault()} className="divide-y divide-slate-100">
                    {dueRooms.map(room => {
                      const prevElec = getPreviousReading(room.id, 'elec');
                      const prevWater = getPreviousReading(room.id, 'water');
                      const inputs = quickBillInputs[room.id] || { elec: '', water: '' };
                      
                      const elecUsage = Math.max(0, (parseInt(inputs.elec) || prevElec) - prevElec);
                      const waterUsage = Math.max(0, (parseInt(inputs.water) || prevWater) - prevWater);
                      
                      const totalAmount = Number(room.price) + 
                                          (elecUsage * Number(room.electricity_price || 3500)) + 
                                          (waterUsage * Number(room.water_price || 20000)) + 
                                          Number(room.service_fee || 0);

                      const canSend = inputs.elec && inputs.water && 
                                    parseInt(inputs.elec) >= prevElec && 
                                    parseInt(inputs.water) >= prevWater;

                      const handleSend = () => {
                        const today = new Date();
                        const dueDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
                        
                        onCreateInvoice({
                          room_id: room.id,
                          tenant_id: room.contracts?.find((c: any) => c.status === 'active')?.tenant_id,
                          title: `Hóa đơn phòng - Tháng ${today.getMonth() + 1}/${today.getFullYear()}`,
                          due_date: dueDate.toISOString().split('T')[0],
                          rent_fee: room.price,
                          electricity_fee: elecUsage * (room.electricity_price || 3500),
                          water_fee: waterUsage * (room.water_price || 20000),
                          service_fee: room.service_fee || 0,
                          electricity_usage: elecUsage,
                          water_usage: waterUsage,
                          amount: totalAmount,
                          status: 'unpaid'
                        });
                      };

                      return (
                        <div key={room.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col lg:flex-row lg:items-center gap-6">
                          <div className="lg:w-1/4">
                            <h4 className="font-black text-slate-900 font-display">{room.title}</h4>
                            <p className="text-xs font-bold text-primary">{Number(room.price).toLocaleString()}đ / tháng</p>
                          </div>
                          
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Điện */}
                            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                <Zap className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Số điện (Cũ: {prevElec})</p>
                                <input 
                                  type="number"
                                  placeholder="Nhập số mới..."
                                  value={inputs.elec}
                                  onChange={(e) => setQuickBillInputs(prev => ({
                                    ...prev,
                                    [room.id]: { ...inputs, elec: e.target.value }
                                  }))}
                                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-slate-900 placeholder:text-slate-300"
                                />
                              </div>
                            </div>
                            
                            {/* Nước */}
                            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <Droplets className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Số nước (Cũ: {prevWater})</p>
                                <input 
                                  type="number"
                                  placeholder="Nhập số mới..."
                                  value={inputs.water}
                                  onChange={(e) => setQuickBillInputs(prev => ({
                                    ...prev,
                                    [room.id]: { ...inputs, water: e.target.value }
                                  }))}
                                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-slate-900 placeholder:text-slate-300"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="lg:w-1/4 flex items-center justify-between lg:justify-end gap-6">
                            <div className="text-right">
                              <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Tạm tính</p>
                              <p className="font-black text-slate-900 font-display">{totalAmount.toLocaleString()}đ</p>
                            </div>
                            <button 
                              type="button"
                              disabled={!canSend}
                              onClick={handleSend}
                              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                                canSend 
                                ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95' 
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              <Send className="w-4 h-4" />
                              Gửi ngay
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </form>
                </div>
              )}

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-wrap items-center gap-4">
                  <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Bộ lọc:</span>
                  <div className="flex gap-2">
                    {[
                      { id: 'all', label: 'Tất cả' },
                      { id: 'unpaid', label: 'Chưa thanh toán' },
                      { id: 'paid', label: 'Đã thanh toán' },
                      { id: 'overdue', label: 'Quá hạn' },
                    ].map((filter) => (
                      <button 
                        key={filter.id}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                          filter.id === 'all' 
                            ? 'bg-primary text-white shadow-md shadow-primary/20' 
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <button className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:border-primary transition-all">
                      <Filter className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:border-primary transition-all">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {invoices.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                      <FileText className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có hóa đơn nào</h3>
                    <p className="text-slate-500 max-w-sm mb-6">Hóa đơn sẽ xuất hiện ở đây khi bạn hoặc hệ thống tạo mới.</p>
                  </div>
                ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khách thuê</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phòng</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Số tiền</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hạn thanh toán</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-8 py-6">
                            <span className="font-black text-slate-900 font-display">{inv.tenant}</span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-xs font-bold text-slate-500">{inv.room}</span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="font-black text-slate-900">{inv.amount}</span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-xs font-bold text-slate-500">{inv.dueDate}</span>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${inv.statusColor}`}>
                              {inv.statusLabel}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {inv.status === 'pending_verification' && (
                                <button
                                  type="button"
                                  onClick={() => onUpdateStatus(inv.id, 'paid')}
                                  className="px-3 py-1.5 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                  Xác nhận tiền
                                </button>
                              )}
                              {inv.status === 'unpaid' && (
                                <button
                                  type="button"
                                  onClick={() => onUpdateStatus(inv.id, 'paid')}
                                  className="px-3 py-1.5 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-green-600 transition-colors"
                                >
                                  Đã thu tay
                                </button>
                              )}
                              <button type="button" className="p-2 text-slate-400 hover:text-primary transition-colors">
                                <MoreHorizontal className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                )}
              </div>
              </>)}
            </motion.div>
          )}
    </>
  );
};
