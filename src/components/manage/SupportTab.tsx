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


interface SupportTabProps {
  supportRequestsData: any[];
  handleUpdateSupportRequest: (id: string, status: string) => void;
}

export const SupportTab = ({ supportRequestsData, handleUpdateSupportRequest }: SupportTabProps) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const stats = [
    { label: 'Chờ xử lý', value: supportRequestsData.filter(r => r.status === 'pending').length, sub: 'Cần tiếp nhận', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Đang sửa', value: supportRequestsData.filter(r => r.status === 'processing').length, sub: 'Đang triển khai', icon: Wrench, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Hoàn thành', value: supportRequestsData.filter(r => r.status === 'resolved').length, sub: 'Thành công', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Tổng yêu cầu', value: supportRequestsData.length, sub: 'Tất cả thời gian', icon: MessageSquare, color: 'text-slate-600', bg: 'bg-slate-100' }
  ];

  const filteredRequests = activeFilter === 'all' 
    ? supportRequestsData 
    : supportRequestsData.filter(r => r.status === activeFilter);

  const activeTab = 'support';

  return (
    <>
      {activeTab === 'support' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 w-full"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-display">Yêu Cầu Hỗ Trợ</h2>
                  <p className="text-slate-500 font-medium">Tiếp nhận và xử lý sự cố từ người thuê.</p>
                </div>
              </div>

              {supportRequestsData.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
              )}

              {supportRequestsData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-200">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                    <Wrench className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có yêu cầu nào</h3>
                  <p className="text-slate-500 max-w-sm">Mọi thứ đang hoạt động tốt. Các yêu cầu sửa chữa từ người thuê sẽ hiện tại đây.</p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex flex-wrap items-center gap-4">
                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Bộ lọc:</span>
                    <div className="flex gap-2">
                      {[
                        { id: 'all', label: 'Tất cả' },
                        { id: 'pending', label: 'Chờ xử lý' },
                        { id: 'processing', label: 'Đang sửa' },
                        { id: 'resolved', label: 'Hoàn thành' },
                      ].map((filter) => (
                        <button 
                          key={filter.id}
                          onClick={() => setActiveFilter(filter.id)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            activeFilter === filter.id 
                              ? 'bg-primary text-white shadow-md shadow-primary/20' 
                              : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col gap-4">
                    {filteredRequests.length === 0 ? (
                      <div className="py-12 text-center text-slate-500 font-medium">Không có yêu cầu nào trong danh mục này.</div>
                    ) : (
                      filteredRequests.map(req => {
                        const statusText = req.status === 'pending' ? 'Chờ xử lý' : req.status === 'processing' ? 'Đang sửa' : 'Hoàn thành';
                        const statusColor = req.status === 'pending' ? 'bg-orange-100 text-orange-700' : req.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700';
                        const Icon = req.status === 'pending' ? Clock : req.status === 'processing' ? Wrench : CheckCircle;
                        const date = new Date(req.created_at).toLocaleDateString('vi-VN');

                        return (
                          <div key={req.id} className="p-6 rounded-3xl border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                            <div className="flex items-start gap-4 flex-1">
                              <img 
                                src={req.profiles?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
                                alt={req.profiles?.full_name || 'Người thuê'} 
                                className="w-12 h-12 rounded-full object-cover shrink-0" 
                                referrerPolicy="no-referrer"
                              />
                              <div className="space-y-1">
                                <h4 className="font-black text-lg text-slate-900 group-hover:text-primary transition-colors">{req.title}</h4>
                                <p className="text-sm text-slate-500">{req.description}</p>
                                <div className="flex items-center gap-3 pt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {req.profiles?.full_name || 'Người thuê'}</span>
                                  <span className="flex items-center gap-1"><HomeIcon className="w-3.5 h-3.5" /> {req.rooms?.title}</span>
                                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {date}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-3 shrink-0">
                              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5 ${statusColor}`}>
                                <Icon className="w-4 h-4" /> {statusText}
                              </span>
                              
                              {req.status !== 'resolved' && (
                                <div className="flex gap-2">
                                  {req.status === 'pending' && (
                                    <button
                                      onClick={() => handleUpdateSupportRequest(req.id, 'processing')}
                                      className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs hover:bg-blue-600 hover:text-white transition-all"
                                    >
                                      Tiếp nhận
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleUpdateSupportRequest(req.id, 'resolved')}
                                    className="px-4 py-2 rounded-xl bg-green-50 text-green-600 font-bold text-xs hover:bg-green-600 hover:text-white transition-all"
                                  >
                                    Đã giải quyết
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
    </>
  );
};
