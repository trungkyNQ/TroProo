import React from 'react';
import { motion } from 'motion/react';
import { 
  AlertCircle, Eye, CheckCircle, Trash2, Loader2
} from 'lucide-react';

interface AdminReportsTabProps {
  reportFilter: 'all' | 'pending' | 'resolved';
  setReportFilter: (filter: 'all' | 'pending' | 'resolved') => void;
  filteredReports: any[];
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
  reportFilter, setReportFilter, filteredReports, loading, actionLoading,
  handleUpdateReportStatus, handleDeleteReport, setHighlightedListingId, setCurrentView,
  getInitials, formatDate
}: AdminReportsTabProps) => {
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col w-full h-full">
                <div className="mb-8 shrink-0">
                  <h2 className="text-2xl font-bold text-slate-900">Báo cáo nội dung</h2>
                  <p className="text-slate-500">Phản hồi và khiếu nại từ người dùng về các bài đăng vi phạm.</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col flex-1">
                  <div className="flex border-b border-slate-200 px-6 shrink-0">
                    {['all', 'pending', 'resolved'].map((filter) => (
                      <button 
                        key={filter}
                        onClick={() => setReportFilter(filter as any)}
                        className={`py-4 px-4 border-b-2 font-bold text-sm whitespace-nowrap capitalize ${reportFilter === filter ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 font-medium'}`}
                      >
                        {filter === 'all' ? 'Tất cả' : filter === 'pending' ? 'Chưa xử lý' : 'Đã giải quyết'}
                      </button>
                    ))}
                  </div>
                  <div className="overflow-x-auto min-h-[300px] flex-1">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                        <p>Đang tải danh sách...</p>
                      </div>
                    ) : filteredReports.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-center p-8">
                        <CheckCircle className="w-12 h-12 mb-4 text-emerald-100 mx-auto" />
                        <p>Tuyệt vời! Không có báo cáo nào cần xử lý.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Người báo cáo</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nội dung báo cáo</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Đối tượng</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {filteredReports.map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 overflow-hidden">
                                    {r.reporterInfo?.avatar_url ? (
                                      <img src={r.reporterInfo.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                                    ) : (
                                      getInitials(r.reporterInfo?.full_name)
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-slate-900">{r.reporterInfo?.full_name || 'N/A'}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">@user_{r.user_id.substring(0,4)}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm font-bold text-slate-800 line-clamp-1">{r.reason}</p>
                                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{r.details || 'Không có mô tả chi tiết.'}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase">
                                  {r.target_type === 'listing' ? 'Tin đăng' : 'Người dùng'}
                                </span>
                                <p className="text-[10px] text-slate-400 font-mono mt-1">{r.target_id.substring(0,8)}...</p>
                              </td>
                              <td className="px-6 py-4">
                                {r.status === 'pending' ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-orange-100 text-orange-600">Chờ lệnh</span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-600">Đã xong</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  {r.target_type === 'listing' && (
                                    <button 
                                      onClick={() => {
                                        setHighlightedListingId(r.target_id);
                                        setCurrentView('listings');
                                        // Auto scroll to top to see listings
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                      }}
                                      className="p-1.5 text-primary hover:bg-primary/10 rounded" 
                                      title="Xem tin đăng bị báo cáo"
                                    >
                                      <Eye className="w-5 h-5" />
                                    </button>
                                  )}
                                  {r.status === 'pending' && (
                                    <button onClick={() => handleUpdateReportStatus(r.id, 'resolved')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded" title="Đánh dấu đã giải quyết">
                                      <CheckCircle className="w-5 h-5" />
                                    </button>
                                  )}
                                  <button onClick={() => handleDeleteReport(r.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Xóa báo cáo">
                                    <Trash2 className="w-5 h-5" />
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
    </>
  );
};
