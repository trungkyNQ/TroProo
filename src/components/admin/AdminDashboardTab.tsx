import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, BarChart, FileText, CheckCircle, Wallet, ShoppingCart, Shield, Clock 
} from 'lucide-react';

interface AdminDashboardTabProps {
  overallStats: any;
  loading: boolean;
  setCurrentView: (v: any) => void;
  setListingMode: (m: any) => void;
}

export const AdminDashboardTab = ({ overallStats, loading, setCurrentView, setListingMode }: AdminDashboardTabProps) => {
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col w-full h-full">
                <div className="mb-8 shrink-0">
                  <h2 className="text-2xl font-bold text-slate-900">Bảng điều khiển Hệ thống</h2>
                  <p className="text-slate-500">Phân tích dữ liệu tổng thể và hiệu suất kinh doanh.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-primary transition-colors"
                       onClick={() => { setCurrentView('listings'); setListingMode('room'); }}>
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-500 mb-1">Tin Thuê Phòng</p>
                    <p className="text-3xl font-black text-slate-900">{loading ? '...' : overallStats.totalListings}</p>
                    <div className="mt-2 text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded inline-block">Listings</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-primary transition-colors"
                       onClick={() => { setCurrentView('listings'); setListingMode('product'); }}>
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-500 mb-1">Sản phẩm Bán</p>
                    <p className="text-3xl font-black text-slate-900">{loading ? '...' : overallStats.totalProducts}</p>
                    <div className="mt-2 text-xs text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded inline-block">Store</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-primary transition-colors"
                       onClick={() => setCurrentView('users')}>
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                      <Users className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-500 mb-1">Thành viên</p>
                    <p className="text-3xl font-black text-slate-900">{loading ? '...' : overallStats.totalUsers}</p>
                    <div className="mt-2 text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded inline-block">Users</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-500 mb-1">Hợp đồng thuê</p>
                    <p className="text-3xl font-black text-slate-900">{loading ? '...' : overallStats.activeContracts}</p>
                    <div className="mt-2 text-xs text-purple-600 font-bold bg-purple-50 px-2 py-1 rounded inline-block">Running</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center mb-4">
                      <BarChart className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-500 mb-1">Doanh thu (Ước tính)</p>
                    <p className="text-2xl font-black text-slate-900">{loading ? '...' : overallStats.totalRevenue.toLocaleString('vi-VN')} đ</p>
                    <div className="mt-2 text-xs text-slate-600 font-bold bg-slate-50 px-2 py-1 rounded inline-block">Payment Based</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 flex flex-col justify-center items-center text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <BarChart className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Biểu đồ đang phát triển</h3>
                    <p className="text-slate-500 text-sm max-w-xs">Hệ thống đang tích hợp thư viện Chart.js để hiển thị biến động giá và lượng truy cập.</p>
                  </div>
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Hoạt động gần đây</h3>
                    <div className="space-y-6">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-800">
                              {i === 1 ? 'Quản trị viên vừa phê duyệt 1 tin đăng' : 
                               i === 2 ? 'Người dùng "Nguyễn Văn A" vừa đăng ký' : 
                               'Tin đăng "Phòng trọ giá rẻ" vừa được cập nhật'}
                            </p>
                            <p className="text-xs text-slate-400 font-medium mt-1">Cách đây {i * 15} phút</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
    </>
  );
};
