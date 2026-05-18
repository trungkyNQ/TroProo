import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Droplets, 
  Zap, 
  ExternalLink,
  ShieldAlert,
  CheckCircle,
  Search,
  X
} from 'lucide-react';

interface RiskAlert {
  id: string;
  room_id: string;
  risk_type: 'dien' | 'nuoc';
  risk_level: 'thap' | 'trung_binh' | 'cao';
  details: string;
  detected_at: string;
  roomInfo?: {
    id: string;
    title: string;
    location?: string;
  };
}

interface AdminRiskTabProps {
  risks: RiskAlert[];
  loading: boolean;
  onNavigateToRoom: (roomId: string) => void;
}

export const AdminRiskTab = ({ risks, loading, onNavigateToRoom }: AdminRiskTabProps) => {
  const [filter, setFilter] = useState<'all' | 'cao' | 'dien' | 'nuoc'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Room, Month, Year Filter States
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Extract unique rooms and years from risks data
  const uniqueRooms = Array.from(new Set(risks.map(r => r.roomInfo?.title).filter(Boolean))).sort();
  const uniqueYears = Array.from(new Set(risks.map(r => new Date(r.detected_at).getFullYear()).filter(Boolean))).sort((a, b) => b - a);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'cao': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'trung_binh': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    }
  };

  const getRiskLevelBadge = (level: string) => {
    switch (level) {
      case 'cao': 
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100 animate-pulse">
            <AlertTriangle className="w-3 h-3" /> Rủi ro cao
          </span>
        );
      case 'trung_binh': 
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100">
            Trung bình
          </span>
        );
      default: 
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
            Thấp
          </span>
        );
    }
  };

  const getRiskIcon = (type: string) => {
    return type === 'dien' 
      ? <Zap className="w-4 h-4 text-amber-500 shrink-0" /> 
      : <Droplets className="w-4 h-4 text-blue-500 shrink-0" />;
  };

  const stats = {
    total: risks.length,
    high: risks.filter(r => r.risk_level === 'cao').length,
    dien: risks.filter(r => r.risk_type === 'dien').length,
    nuoc: risks.filter(r => r.risk_type === 'nuoc').length
  };

  // Advanced search and tab filtering combined
  const filteredRisks = risks.filter(r => {
    // 1. Tab filter
    if (filter === 'cao' && r.risk_level !== 'cao') return false;
    if (filter === 'dien' && r.risk_type !== 'dien') return false;
    if (filter === 'nuoc' && r.risk_type !== 'nuoc') return false;

    // 2. Room filter
    if (selectedRoom !== 'all' && r.roomInfo?.title !== selectedRoom) return false;

    // 3. Month filter
    if (selectedMonth !== 'all') {
      const date = new Date(r.detected_at);
      if ((date.getMonth() + 1).toString() !== selectedMonth) return false;
    }

    // 4. Year filter
    if (selectedYear !== 'all') {
      const date = new Date(r.detected_at);
      if (date.getFullYear().toString() !== selectedYear) return false;
    }

    // 5. Search query filter
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const title = r.roomInfo?.title?.toLowerCase() || '';
    const loc = r.roomInfo?.location?.toLowerCase() || '';
    const details = r.details?.toLowerCase() || '';
    const type = r.risk_type === 'dien' ? 'điện điện năng' : 'nước';
    const level = r.risk_level === 'cao' ? 'cao' : r.risk_level === 'trung_binh' ? 'trung bình' : 'thấp';

    return title.includes(query) || 
           loc.includes(query) || 
           details.includes(query) || 
           type.includes(query) ||
           level.includes(query);
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="flex flex-col w-full h-full pb-10"
    >
      {/* Header Section */}
      <div className="mb-8 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span className="bg-rose-50 text-rose-500 p-2 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-rose-100">
              <ShieldAlert className="w-7 h-7" />
            </span>
            Giám sát Rủi ro AI
          </h2>
          <p className="text-slate-500 mt-1 font-medium">Hệ thống AI phân tích và cảnh báo chỉ số bất thường trong tiêu thụ năng lượng của các phòng trọ.</p>
        </div>
      </div>

      {/* Stats Counter Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 shrink-0">
        
        {/* TOTAL ALERTS */}
        <div 
          className={`group bg-white p-6 rounded-3xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ${
            filter === 'all' ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200/80 hover:border-blue-300'
          }`}
          onClick={() => setFilter('all')}
        >
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Tổng cảnh báo</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{loading ? '-' : stats.total}</p>
          </div>
        </div>
        
        {/* HIGH RISK */}
        <div 
          className={`group bg-white p-6 rounded-3xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ${
            filter === 'cao' ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200/80 hover:border-rose-300'
          }`}
          onClick={() => setFilter('cao')}
        >
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Rủi ro cao</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{loading ? '-' : stats.high}</p>
          </div>
        </div>

        {/* ELECTRIC ISSUES */}
        <div 
          className={`group bg-white p-6 rounded-3xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ${
            filter === 'dien' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200/80 hover:border-amber-300'
          }`}
          onClick={() => setFilter('dien')}
        >
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Vấn đề điện</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{loading ? '-' : stats.dien}</p>
          </div>
        </div>

        {/* WATER ISSUES */}
        <div 
          className={`group bg-white p-6 rounded-3xl border flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ${
            filter === 'nuoc' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200/80 hover:border-blue-300'
          }`}
          onClick={() => setFilter('nuoc')}
        >
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Vấn đề nước</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{loading ? '-' : stats.nuoc}</p>
          </div>
        </div>
      </div>

      {/* Control Actions & Searching */}
      <div className="flex flex-col gap-4 mb-6 shrink-0 bg-slate-50 p-5 rounded-3xl border border-slate-200/60 shadow-inner">
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Local Search Input */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Tìm kiếm cảnh báo theo tên phòng, địa điểm, nội dung bất thường..."
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
          <div className="flex items-center gap-2 self-stretch md:self-auto px-4 py-2.5 bg-white rounded-2xl border border-slate-200/80 shrink-0">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Hiển thị:</span>
            <span className="text-xs font-black text-primary uppercase bg-primary/5 px-2.5 py-1 rounded-xl border border-primary/10">
              {filteredRisks.length} cảnh báo
            </span>
          </div>
        </div>

        {/* Dynamic Select Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-3.5 border-t border-slate-200/60">
          
          {/* Room Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1.5">Lọc theo phòng</label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-primary transition-all cursor-pointer shadow-sm"
            >
              <option value="all">Tất cả các phòng</option>
              {uniqueRooms.map((roomName: any) => (
                <option key={roomName} value={roomName}>{roomName}</option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1.5">Lọc theo tháng</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-primary transition-all cursor-pointer shadow-sm"
            >
              <option value="all">Tất cả các tháng</option>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((m) => (
                <option key={m} value={m}>Tháng {m}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1.5">Lọc theo năm</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-primary transition-all cursor-pointer shadow-sm"
            >
              <option value="all">Tất cả các năm</option>
              {uniqueYears.map((y: any) => (
                <option key={y} value={y.toString()}>Năm {y}</option>
              ))}
            </select>
          </div>

          {/* Reset button */}
          {(selectedRoom !== 'all' || selectedMonth !== 'all' || selectedYear !== 'all') && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedRoom('all');
                  setSelectedMonth('all');
                  setSelectedYear('all');
                }}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
              >
                <X className="w-3.5 h-3.5 text-slate-500" />
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Widescreen Alert Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm flex-1 flex flex-col min-h-0">
        
        {/* Tab Filters */}
        <div className="flex border-b border-slate-200 px-6 shrink-0 bg-slate-50/50">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'cao', label: 'Rủi ro cao' },
            { id: 'dien', label: 'Cảnh báo điện' },
            { id: 'nuoc', label: 'Cảnh báo nước' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`py-4 px-6 border-b-2 font-black text-xs whitespace-nowrap uppercase tracking-wider transition-all relative ${
                filter === tab.id 
                  ? 'border-primary text-primary font-black' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 font-bold'
              }`}
            >
              {tab.label}
              {filter === tab.id && (
                <motion.div layoutId="activeRiskTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Table Body Area */}
        <div className="overflow-auto flex-1">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-6 py-4 border-b border-slate-100 animate-pulse">
                  <div className="w-28 space-y-2 shrink-0">
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                  <div className="w-44 space-y-2 shrink-0">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-4/5" />
                    <div className="h-3 bg-slate-200 rounded w-2/3" />
                  </div>
                  <div className="w-28 shrink-0">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                  </div>
                  <div className="w-12 h-10 bg-slate-200 rounded-xl ml-auto animate-pulse" />
                </div>
              ))}
            </div>
          ) : filteredRisks.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 text-emerald-500">
                <CheckCircle className="w-8 h-8" />
              </div>
              <p className="text-slate-500 font-black uppercase text-xs tracking-wider">Hệ thống AI ghi nhận an toàn.</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Không ghi nhận chỉ số tiêu thụ bất thường tại các căn hộ trọ.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 sticky top-0 z-10 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-6 py-4">Loại & Mức độ</th>
                  <th className="px-6 py-4">Phòng & Vị trí</th>
                  <th className="px-6 py-4">Chi tiết cảnh báo từ AI</th>
                  <th className="px-6 py-4">Thời gian ghi nhận</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRisks.map((risk) => (
                  <tr key={risk.id} className="hover:bg-slate-50/40 transition-colors group">
                    
                    {/* Anomaly Category & level */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5 items-start">
                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                          {getRiskIcon(risk.risk_type)}
                          <span className="capitalize">{risk.risk_type === 'dien' ? 'Điện năng' : 'Nước sinh hoạt'}</span>
                        </div>
                        {getRiskLevelBadge(risk.risk_level)}
                      </div>
                    </td>

                    {/* Room title & location */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <p className="text-xs font-black text-slate-900 group-hover:text-primary transition-colors leading-tight">{risk.roomInfo?.title || 'Phòng không xác định'}</p>
                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-bold">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          {risk.roomInfo?.location || 'Đà Nẵng'}
                        </p>
                      </div>
                    </td>

                    {/* Alert Details */}
                    <td className="px-6 py-5">
                      <div className="max-w-md">
                        <p className="text-xs text-slate-600 leading-relaxed italic font-medium">"{risk.details}"</p>
                      </div>
                    </td>

                    {/* Detected At */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Clock className="w-4 h-4 text-slate-300" />
                        {new Date(risk.detected_at).toLocaleDateString('vi-VN')} {new Date(risk.detected_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Action controls */}
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => onNavigateToRoom(risk.room_id)}
                        className="p-2.5 hover:bg-primary/10 text-slate-400 hover:text-primary rounded-xl transition-all group"
                        title="Xem chi tiết phòng trọ này"
                      >
                        <ExternalLink className="w-4.5 h-4.5 group-hover:scale-110 transition-transform duration-300" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  );
};
