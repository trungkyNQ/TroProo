import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, BarChart as ChartIcon, FileText, Wallet, ShoppingCart, Shield, ArrowUpRight, Crown, Sparkles, Phone
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AdminDashboardTabProps {
  overallStats: any;
  loading: boolean;
  setCurrentView: (v: any) => void;
  setListingMode: (m: any) => void;
}

export const AdminDashboardTab = ({ overallStats, loading, setCurrentView, setListingMode }: AdminDashboardTabProps) => {
  // Helpers
  const formatDateLocal = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return 'N/A';
    }
  };

  const getRemainingDays = (expiryString?: string) => {
    if (!expiryString) return null;
    try {
      const expiry = new Date(expiryString);
      const today = new Date();
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return null;
    }
  };

  // Chart Data
  const lineData = {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: [
      {
        label: 'Tin đăng mới',
        data: [12, 19, 15, 22, 18, 24, 20],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointBackgroundColor: '#3b82f6',
        pointHoverRadius: 7,
      },
      {
        label: 'Sản phẩm mới',
        data: [8, 12, 20, 14, 16, 10, 18],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.05)',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointBackgroundColor: '#f59e0b',
        pointHoverRadius: 7,
      }
    ],
  };

  const pieData = {
    labels: ['Tin Phòng', 'Sản phẩm Đồ cũ'],
    datasets: [
      {
        data: [overallStats.totalListings || 0, overallStats.totalProducts || 0],
        backgroundColor: ['#3b82f6', '#f59e0b'],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 8,
      },
    ],
  };

  const trafficData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    datasets: [
      {
        label: 'Số lượt truy cập',
        data: [2500, 3200, 3800, 4500, 4200, 5600, 7800, 9200, 8500, 9800, 11500, 12800],
        backgroundColor: 'rgba(99, 102, 241, 0.85)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 0,
        borderRadius: 12,
        hoverBackgroundColor: 'rgba(99, 102, 241, 1)',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { 
          font: { 
            weight: 'bold' as any, 
            family: 'Outfit, Inter, sans-serif',
            size: 12
          },
          color: '#475569',
          usePointStyle: true,
          padding: 20,
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { family: 'Outfit, Inter, sans-serif', weight: 'bold' as any, size: 13 },
        bodyFont: { family: 'Outfit, Inter, sans-serif', size: 12 },
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
      }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        grid: { 
          color: 'rgba(241, 245, 249, 0.8)',
        },
        ticks: {
          color: '#64748b',
          font: { family: 'Outfit, Inter, sans-serif', size: 11, weight: 'bold' as any }
        }
      },
      x: { 
        grid: { display: false },
        ticks: {
          color: '#64748b',
          font: { family: 'Outfit, Inter, sans-serif', size: 11, weight: 'bold' as any }
        }
      }
    }
  };

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
              <ChartIcon className="w-7 h-7" />
            </span>
            Bảng điều khiển Hệ thống
          </h2>
          <p className="text-slate-500 mt-1 font-medium">Phân tích chuyên sâu dữ liệu tổng thể và chỉ số tăng trưởng hiệu suất kinh doanh.</p>
        </div>
      </div>

      {/* Grid Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8 shrink-0">
        
        {/* STATS CARD 1: TIN THUÊ PHÒNG */}
        <div 
          onClick={() => { setCurrentView('listings'); setListingMode('room'); }}
          className="group relative bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 hover:border-blue-500/30 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-125 transition-transform duration-500"></div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 border border-blue-100 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <FileText className="w-6 h-6" />
          </div>
          <p className="text-xs font-black text-slate-400 mb-1 uppercase tracking-wider">Tin Thuê Phòng</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-slate-900 tracking-tight">{loading ? '...' : overallStats.totalListings}</p>
            <ArrowUpRight className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
          </div>
          <div className="mt-3 text-[10px] text-blue-600 font-black bg-blue-50/80 border border-blue-100/50 px-2.5 py-1 rounded-xl inline-block uppercase tracking-wider">
            Listings
          </div>
        </div>

        {/* STATS CARD 2: SẢN PHẨM MỚI */}
        <div 
          onClick={() => { setCurrentView('listings'); setListingMode('product'); }}
          className="group relative bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 hover:border-orange-500/30 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-125 transition-transform duration-500"></div>
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4 border border-orange-100 shadow-inner group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <p className="text-xs font-black text-slate-400 mb-1 uppercase tracking-wider">Sản phẩm Bán</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-slate-900 tracking-tight">{loading ? '...' : overallStats.totalProducts}</p>
            <ArrowUpRight className="w-4 h-4 text-orange-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
          </div>
          <div className="mt-3 text-[10px] text-orange-600 font-black bg-orange-50/80 border border-orange-100/50 px-2.5 py-1 rounded-xl inline-block uppercase tracking-wider">
            Store
          </div>
        </div>

        {/* STATS CARD 3: THÀNH VIÊN */}
        <div 
          onClick={() => setCurrentView('users')}
          className="group relative bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 hover:border-emerald-500/30 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-125 transition-transform duration-500"></div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 border border-emerald-100 shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-xs font-black text-slate-400 mb-1 uppercase tracking-wider">Thành viên</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-slate-900 tracking-tight">{loading ? '...' : overallStats.totalUsers}</p>
            <ArrowUpRight className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
          </div>
          <div className="mt-3 text-[10px] text-emerald-600 font-black bg-emerald-50/80 border border-emerald-100/50 px-2.5 py-1 rounded-xl inline-block uppercase tracking-wider">
            Users
          </div>
        </div>

        {/* STATS CARD 4: HỢP ĐỒNG THUÊ */}
        <div 
          onClick={() => setCurrentView('contracts')}
          className="group relative bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 hover:border-purple-500/30 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-125 transition-transform duration-500"></div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4 border border-purple-100 shadow-inner group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
            <Shield className="w-6 h-6" />
          </div>
          <p className="text-xs font-black text-slate-400 mb-1 uppercase tracking-wider">Hợp đồng thuê</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-slate-900 tracking-tight">{loading ? '...' : overallStats.activeContracts}</p>
            <ArrowUpRight className="w-4 h-4 text-purple-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
          </div>
          <div className="mt-3 text-[10px] text-purple-600 font-black bg-purple-50/80 border border-purple-100/50 px-2.5 py-1 rounded-xl inline-block uppercase tracking-wider">
            Running
          </div>
        </div>

        {/* STATS CARD 5: TỔNG DOANH THU DỊCH VỤ (VIP SUBSCRIPTION GLOW) */}
        <div 
          onClick={() => setCurrentView('users')}
          className="group relative bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 p-6 rounded-3xl shadow-lg shadow-orange-500/15 hover:shadow-orange-500/30 hover:-translate-y-1 active:scale-95 transition-all duration-300 overflow-hidden text-white cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -mr-8 -mt-8 group-hover:scale-125 transition-transform duration-500"></div>
          <div className="w-12 h-12 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-3 border border-white/20 shadow-md">
            <Crown className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-[10px] font-black text-amber-100 mb-1 uppercase tracking-wider">Tổng Doanh Thu VIP</p>
          <p className="text-2xl font-black text-white tracking-tight leading-none pt-0.5">
            {loading ? '...' : (overallStats.subscriptionRevenue || 0).toLocaleString('vi-VN')} đ
          </p>
          
          <div className="mt-4 flex flex-col gap-1.5 border-t border-white/15 pt-3">
            <div className="flex items-center justify-between text-[10px] font-bold text-amber-50/90">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-300"></span> Gói Pro (x{overallStats.premiumUsers?.filter((u: any) => u.subscription_tier === 'pro').length || 0}):
              </span>
              <span>{((overallStats.premiumUsers?.filter((u: any) => u.subscription_tier === 'pro').length || 0) * (overallStats.proPrice || 199000)).toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold text-amber-50/90">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-300"></span> Enterprise (x{overallStats.premiumUsers?.filter((u: any) => u.subscription_tier === 'enterprise').length || 0}):
              </span>
              <span className="text-purple-200">{((overallStats.premiumUsers?.filter((u: any) => u.subscription_tier === 'enterprise').length || 0) * (overallStats.enterprisePrice || 499000)).toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 shrink-0">
        
        {/* CHART 1: TĂNG TRƯỞNG TIN ĐĂNG (LINE) */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm h-[420px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Tăng trưởng Tin đăng & Sản phẩm</h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">So sánh khối lượng dữ liệu cập nhật theo tuần.</p>
            </div>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl uppercase tracking-wider">Hằng Tuần</span>
          </div>
          <div className="flex-1 h-[280px]">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>

        {/* CHART 2: CƠ CẤU NỘI DUNG (PIE) */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col h-[420px] justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Cơ cấu nội dung</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Tỷ trọng giữa phòng trọ thuê & sản phẩm marketplace.</p>
          </div>
          <div className="flex-1 flex items-center justify-center min-h-0 relative px-4">
            <Pie 
              data={pieData} 
              options={{ 
                ...chartOptions, 
                plugins: { 
                  ...chartOptions.plugins, 
                  legend: { 
                    position: 'bottom' as const,
                    labels: {
                      font: { family: 'Outfit, Inter, sans-serif', weight: 'bold' as any, size: 11 },
                      boxWidth: 12,
                      padding: 15
                    }
                  } 
                } 
              }} 
            />
          </div>
        </div>
      </div>

      {/* CHART 3: THỐNG KÊ LƯỢT TRUY CẬP (BAR) */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm h-[440px] flex flex-col justify-between shrink-0 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <ChartIcon className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Thống kê lượng truy cập Website</h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Lượng người dùng hoạt động tích cực qua các tháng.</p>
            </div>
          </div>
          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-xl uppercase tracking-wider">Hằng Tháng</span>
        </div>
        <div className="flex-1 h-[280px]">
          <Bar 
            data={trafficData} 
            options={{
              ...chartOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: 'rgba(241, 245, 249, 0.8)' },
                  ticks: {
                    color: '#64748b',
                    font: { family: 'Outfit, Inter, sans-serif', size: 11, weight: 'bold' as any }
                  }
                },
                x: {
                  grid: { display: false },
                  ticks: {
                    color: '#64748b',
                    font: { family: 'Outfit, Inter, sans-serif', size: 11, weight: 'bold' as any }
                  }
                }
              }
            }} 
          />
        </div>
      </div>

      {/* REGISTERED UPGRADED CUSTOMERS LIST SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm flex flex-col shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Crown className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Khách Hàng Nâng Cấp Gói Dịch Vụ</h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Danh sách thành viên đăng ký các gói dịch vụ cao cấp trên hệ thống.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-2xl self-start sm:self-auto shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-black text-amber-700">
              {loading ? '...' : (overallStats.premiumUsers?.length || 0)} Khách hàng Premium
            </span>
          </div>
        </div>

        {/* Table of upgraded premium subscribers */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 py-4 border-b border-slate-50 animate-pulse">
                  <div className="w-10 h-10 bg-slate-100 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-1/4" />
                    <div className="h-3 bg-slate-50 rounded w-1/3" />
                  </div>
                  <div className="w-20 h-6 bg-slate-100 rounded-full" />
                </div>
              ))}
            </div>
          ) : !overallStats.premiumUsers || overallStats.premiumUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Crown className="w-8 h-8 text-slate-300" />
              </div>
              <p className="font-bold text-slate-600 text-sm">Chưa có khách hàng nâng cấp gói nào</p>
              <p className="text-slate-400 text-xs mt-1">Khi khách hàng tiến hành nâng cấp gói VIP qua cổng VNPay, thông tin sẽ được thống kê trực tiếp tại đây.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200/60 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Gói đăng ký</th>
                  <th className="px-6 py-4">Ngày đăng ký</th>
                  <th className="px-6 py-4">Ngày hết hạn</th>
                  <th className="px-6 py-4">Doanh thu thu về</th>
                  <th className="px-6 py-4 text-right">Liên hệ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {overallStats.premiumUsers.map((user: any) => {
                  const remainingDays = getRemainingDays(user.subscription_expires_at);
                  const price = user.subscription_tier === 'enterprise' 
                    ? (overallStats.enterprisePrice || 299000) 
                    : (overallStats.proPrice || 199000);
                  
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      {/* Identity */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
                            {user.avatar_url ? (
                              <img src={user.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                            ) : (
                              <span className="text-slate-500 font-extrabold">U</span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-tight">{user.full_name || 'Chưa cập nhật'}</p>
                            <span className="text-[10px] font-mono text-slate-400">ID: {user.id.substring(0, 8)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Tier Badge */}
                      <td className="px-6 py-4.5">
                        {user.subscription_tier === 'enterprise' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-violet-500/10 to-indigo-500/10 text-violet-600 border border-violet-200/50">
                            <Crown className="w-3 h-3 text-violet-500 animate-bounce" style={{ animationDuration: '3s' }} />
                            Enterprise
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-600 border border-orange-200/50">
                            <Sparkles className="w-3 h-3 text-orange-500" />
                            Pro Member
                          </span>
                        )}
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4.5 text-xs font-bold text-slate-600">
                        {formatDateLocal(user.subscription_created_at)}
                      </td>

                      {/* Expiration Date */}
                      <td className="px-6 py-4.5 text-xs font-bold text-slate-600">
                        <div className="flex flex-col gap-1">
                          <span>{formatDateLocal(user.subscription_expires_at)}</span>
                          {remainingDays !== null && (
                            remainingDays > 0 ? (
                              <span className="inline-block text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md self-start border border-emerald-100/50">
                                Còn {remainingDays} ngày
                              </span>
                            ) : (
                              <span className="inline-block text-[9px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md self-start border border-rose-100/50">
                                Đã hết hạn
                              </span>
                            )
                          )}
                        </div>
                      </td>

                      {/* Amount Generated */}
                      <td className="px-6 py-4.5 text-xs font-black text-emerald-600">
                        +{price.toLocaleString('vi-VN')} đ
                      </td>

                      {/* Contact and message */}
                      <td className="px-6 py-4.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {user.phone && (
                            <a 
                              href={`tel:${user.phone}`}
                              className="w-8 h-8 rounded-full bg-slate-50 hover:bg-primary/10 hover:text-primary text-slate-400 flex items-center justify-center transition-colors border border-slate-100"
                              title="Gọi trực tiếp"
                            >
                              <Phone className="w-3.5 h-3.5 text-primary" />
                            </a>
                          )}
                          <button 
                            onClick={() => {
                              setCurrentView('users');
                            }}
                            className="text-xs font-bold text-slate-500 hover:text-primary transition-colors hover:underline px-2.5 py-1.5 rounded-lg hover:bg-slate-50"
                          >
                            Xem lý lịch
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </motion.div>
  );
};
