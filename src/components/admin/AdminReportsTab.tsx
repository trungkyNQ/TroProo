import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  AlertCircle, Eye, CheckCircle, Trash2, Loader2, Search, X, Flag, HelpCircle, User, MessageSquare
} from 'lucide-react';

interface AdminReportsTabProps {
  reportFilter: 'all' | 'pending' | 'resolved';
  setReportFilter: (filter: 'all' | 'pending' | 'resolved') => void;
  filteredReports: any[];
  allReports: any[];
  loading: boolean;
  actionLoading: string | null;
  handleUpdateReportStatus: (id: string, status: 'resolved') => void;
  handleDeleteReport: (id: string) => void;
  setHighlightedListingId: (id: string | null) => void;
  setCurrentView: (view: any) => void;
  getInitials: (name?: string) => string;
  formatDate: (date: string) => string;
}

export const AdminReportsTab = ({ 
  reportFilter, setReportFilter, filteredReports, allReports, loading, actionLoading,
  handleUpdateReportStatus, handleDeleteReport, setHighlightedListingId, setCurrentView,
  getInitials, formatDate
}: AdminReportsTabProps) => {

  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    total: allReports.length,
    pending: allReports.filter(r => r.status === 'pending').length,
    resolved: allReports.filter(r => r.status === 'resolved').length
  };

  // Advanced search filtering
  const reportsToDisplay = filteredReports.filter(r => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const reporterName = r.reporterInfo?.full_name?.toLowerCase() || '';
    const reason = r.reason?.toLowerCase() || '';
    const details = r.details?.toLowerCase() || '';
    const targetType = r.target_type?.toLowerCase() || '';
    const targetId = r.target_id?.toLowerCase() || '';
    const reporterId = r.reporter_id?.toLowerCase() || '';

    return reporterName.includes(query) || 
           reason.includes(query) || 
           details.includes(query) || 
           targetType.includes(query) ||
           targetId.includes(query) ||
           reporterId.includes(query);
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
              <Flag className="w-7 h-7" />
            </span>
            Báo cáo & Khiếu nại
          </h2>
          <p className="text-slate-500 mt-1 font-medium">Xử lý phản hồi từ người dùng về nội dung vi phạm hoặc sự cố hệ thống.</p>
        </div>
      </div>

      {/* Stats Counter Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
        
        {/* TOTAL REPORTS */}
        <div 
          className={`group bg-white p-6 rounded-3xl border flex items-center gap-5 shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ${
            reportFilter === 'all' ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200/80 hover:border-blue-300'
          }`}
          onClick={() => setReportFilter('all')}
        >
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Tổng báo cáo</p>
            <p className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{loading ? '-' : stats.total}</p>
          </div>
        </div>
        
        {/* PENDING REPORTS */}
        <div 
          className={`group bg-white p-6 rounded-3xl border flex items-center gap-5 shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ${
            reportFilter === 'pending' ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-200/80 hover:border-orange-300'
          }`}
          onClick={() => setReportFilter('pending')}
        >
          <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl border border-orange-100 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300 shrink-0">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Chờ xử lý</p>
            <p className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{loading ? '-' : stats.pending}</p>
          </div>
        </div>

        {/* RESOLVED REPORTS */}
        <div 
          className={`group bg-white p-6 rounded-3xl border flex items-center gap-5 shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ${
            reportFilter === 'resolved' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200/80 hover:border-emerald-300'
          }`}
          onClick={() => setReportFilter('resolved')}
        >
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Đã giải quyết</p>
            <p className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{loading ? '-' : stats.resolved}</p>
          </div>
        </div>
      </div>

      {/* Control Actions & Searching */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 shrink-0 bg-slate-50 p-4 rounded-3xl border border-slate-200/60">
        
        {/* Local Search Input */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Tìm theo tên người báo cáo, nội dung, chi tiết, mã ID..."
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
            {reportsToDisplay.length} bản ghi
          </span>
        </div>
      </div>

      {/* Table Container Widescreen */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col flex-1 min-h-0">
        
        {/* Internal Navigation tabs */}
        <div className="flex border-b border-slate-200/80 px-6 shrink-0 bg-slate-50/50">
          {(['all', 'pending', 'resolved'] as const).map((filter) => (
            <button 
              key={filter}
              onClick={() => setReportFilter(filter)}
              className={`py-4 px-6 border-b-2 font-black text-xs whitespace-nowrap uppercase tracking-wider transition-all relative ${
                reportFilter === filter 
                  ? 'border-primary text-primary font-black' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 font-bold'
              }`}
            >
              {filter === 'all' ? 'Tất cả' : filter === 'pending' ? 'Chưa xử lý' : 'Đã giải quyết'}
              {reportFilter === filter && (
                <motion.div layoutId="activeReportTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
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
                  <div className="flex items-center gap-3 shrink-0 w-48">
                    <div className="w-10 h-10 bg-slate-200 rounded-2xl shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 bg-slate-200 rounded w-4/5" />
                      <div className="h-2.5 bg-slate-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                  <div className="w-28">
                    <div className="h-5 bg-slate-200 rounded w-2/3" />
                  </div>
                  <div className="w-24">
                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                  </div>
                  <div className="w-28 h-8 bg-slate-200 rounded-xl ml-auto" />
                </div>
              ))}
            </div>
          ) : reportsToDisplay.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400 text-center p-8">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-100 mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <p className="font-black uppercase text-xs tracking-wider text-slate-500">Tuyệt vời! Không có báo cáo nào cần xử lý.</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Hệ thống đang hoạt động ổn định và sạch sẽ.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 sticky top-0 z-10 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-6 py-4">Người báo cáo</th>
                  <th className="px-6 py-4">Nội dung khiếu nại</th>
                  <th className="px-6 py-4">Đối tượng vi phạm</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportsToDisplay.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/40 transition-colors group">
                    
                    {/* Reporter info */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 overflow-hidden border border-slate-200 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                          {r.reporterInfo?.avatar_url ? (
                            <img src={r.reporterInfo.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                          ) : (
                            getInitials(r.reporterInfo?.full_name)
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900 group-hover:text-primary transition-colors">{r.reporterInfo?.full_name || 'N/A'}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {r.reporter_id.substring(0,8)}</p>
                        </div>
                      </div>
                    </td>

                    {/* Report Content */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1 max-w-sm">
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <p className="text-xs font-black text-slate-800 line-clamp-1">{r.reason}</p>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 italic font-medium">"{r.details || 'Không có mô tả chi tiết.'}"</p>
                        <p className="text-[9px] text-slate-400 font-bold mt-1">Ngày báo cáo: {formatDate(r.created_at || '')}</p>
                      </div>
                    </td>

                    {/* Target Type & ID */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5 items-start">
                        {r.target_type === 'listing' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
                            Tin đăng
                          </span>
                        ) : r.target_type === 'contact_form' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-purple-50 text-purple-600 border border-purple-100">
                            Form liên hệ
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-200">
                            Người dùng
                          </span>
                        )}
                        {r.target_type !== 'contact_form' && (
                          <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                            #{r.target_id.substring(0,8)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-5">
                      {r.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-100">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                          Chờ giải quyết
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <CheckCircle className="w-3 h-3" />
                          Đã xử lý
                        </span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1.5">
                        
                        {/* Target Viewer */}
                        {r.target_type === 'listing' && (
                          <button 
                            onClick={() => {
                              setHighlightedListingId(r.target_id);
                              setCurrentView('listings');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-all hover:scale-105" 
                            title="Xem tin đăng bị báo cáo"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}

                        {/* Complete report */}
                        {r.status === 'pending' && (
                          <button 
                            onClick={() => handleUpdateReportStatus(r.id, 'resolved')} 
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all hover:scale-105" 
                            title="Đánh dấu đã giải quyết"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete Report */}
                        <button 
                          onClick={() => handleDeleteReport(r.id)} 
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all hover:scale-105" 
                          title="Xóa vĩnh viễn báo cáo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
