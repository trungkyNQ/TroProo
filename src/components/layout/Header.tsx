import React, { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, User, LogOut, Menu, X } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { NotificationBell } from '../shared/NotificationBell';

import { useAuth } from '../../context/AuthContext';

export type Page = 'home' | 'login' | 'register' | 'store' | 'manage' | 'contact' | 'search' | 'tenant' | 'admin' | 'listing-detail' | 'my-store';

interface HeaderProps {
  user: SupabaseUser | null;
  onLogout: () => void;
  onNavigate: (page: Page, params?: any) => void;
  activePath?: Page;
  children?: ReactNode;
}

export const Header = ({ user, onLogout, onNavigate, activePath, children }: HeaderProps) => {
  const { role: currentRole } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 md:px-10 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="text-primary">
                <Home className="w-8 h-8" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-primary font-display">Trọ Pro</h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a 
                className={`text-sm ${activePath === 'home' ? 'font-bold text-primary border-b-2 border-primary pb-1' : 'font-semibold text-slate-600 hover:text-primary transition-colors'}`} 
                href="#" 
                onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
              >
                Trang chủ
              </a>
              <a 
                className={`text-sm ${activePath === 'store' ? 'font-bold text-primary border-b-2 border-primary pb-1' : 'font-semibold text-slate-600 hover:text-primary transition-colors'}`} 
                href="#" 
                onClick={(e) => { e.preventDefault(); onNavigate('store'); }}
              >
                Cửa hàng
              </a>
              <a 
                className={`text-sm ${activePath === 'contact' ? 'font-bold text-primary border-b-2 border-primary pb-1' : 'font-semibold text-slate-600 hover:text-primary transition-colors'}`} 
                href="#" 
                onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}
              >
                Liên hệ
              </a>
              {currentRole === 'landlord' && (
                <a 
                  className={`text-sm ${activePath === 'manage' ? 'font-bold text-primary border-b-2 border-primary pb-1' : 'font-semibold text-slate-600 hover:text-primary transition-colors'}`} 
                  href="#"
                  onClick={(e) => { e.preventDefault(); onNavigate('manage'); }}
                >
                  Quản lý
                </a>
              )}
              {currentRole === 'tenant' && (
                <a 
                  className={`text-sm ${activePath === 'tenant' ? 'font-bold text-primary border-b-2 border-primary pb-1' : 'font-semibold text-slate-600 hover:text-primary transition-colors'}`} 
                  href="#"
                  onClick={(e) => { e.preventDefault(); onNavigate('tenant'); }}
                >
                  Phòng của tôi
                </a>
              )}
              {currentRole === 'admin' && (
                <a 
                  className={`text-sm ${activePath === 'admin' ? 'font-bold text-primary border-b-2 border-primary pb-1' : 'font-semibold text-slate-600 hover:text-primary transition-colors'}`} 
                  href="#"
                  onClick={(e) => { e.preventDefault(); onNavigate('admin'); }}
                >
                  Quản trị
                </a>
              )}
            </nav>
          </div>
          
          {children && (
            <div className="flex-1 max-w-md mx-8 hidden lg:block">
              {children}
            </div>
          )}
          
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 md:gap-4 ml-2">
                <NotificationBell user={user} onNavigate={onNavigate} />
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => {
                  if (currentRole === 'tenant') onNavigate('tenant');
                  else if (currentRole === 'landlord') onNavigate('manage');
                  else if (currentRole === 'admin') onNavigate('admin');
                }}>
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all border border-primary/20 shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors hidden sm:block">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </div>
                <button 
                  onClick={onLogout}
                  className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all border border-slate-100 hidden sm:flex shrink-0"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 ml-2">
                <button onClick={() => onNavigate('login')} className="text-sm font-bold text-slate-600 hover:text-primary transition-colors hidden sm:block">Đăng nhập</button>
                <button onClick={() => onNavigate('register')} className="bg-primary text-white text-sm font-bold px-6 py-3 rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 hidden sm:block">Đăng ký</button>
              </div>
            )}

            {/* Mobile Hamburger menu toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors border border-slate-100 shadow-sm shrink-0"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-[100]">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            {/* Drawer Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-80 bg-white p-6 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setIsMobileMenuOpen(false); onNavigate('home'); }}>
                  <Home className="w-6 h-6 text-primary" />
                  <span className="font-bold text-slate-900 font-display text-lg">Trọ Pro</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Navigation Links */}
              <nav className="flex flex-col gap-4 flex-grow overflow-y-auto pr-1">
                <a 
                  className={`px-4 py-3 rounded-xl font-bold text-sm transition-all ${activePath === 'home' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`} 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); onNavigate('home'); }}
                >
                  Trang chủ
                </a>
                <a 
                  className={`px-4 py-3 rounded-xl font-bold text-sm transition-all ${activePath === 'store' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`} 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); onNavigate('store'); }}
                >
                  Cửa hàng
                </a>
                <a 
                  className={`px-4 py-3 rounded-xl font-bold text-sm transition-all ${activePath === 'contact' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`} 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); onNavigate('contact'); }}
                >
                  Liên hệ
                </a>
                
                {/* Role specific links in mobile menu */}
                {currentRole === 'landlord' && (
                  <a 
                    className={`px-4 py-3 rounded-xl font-bold text-sm transition-all ${activePath === 'manage' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`} 
                    href="#"
                    onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); onNavigate('manage'); }}
                  >
                    Quản lý Chủ trọ
                  </a>
                )}
                {currentRole === 'tenant' && (
                  <a 
                    className={`px-4 py-3 rounded-xl font-bold text-sm transition-all ${activePath === 'tenant' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`} 
                    href="#"
                    onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); onNavigate('tenant'); }}
                  >
                    Phòng của tôi
                  </a>
                )}
                {currentRole === 'admin' && (
                  <a 
                    className={`px-4 py-3 rounded-xl font-bold text-sm transition-all ${activePath === 'admin' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`} 
                    href="#"
                    onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); onNavigate('admin'); }}
                  >
                    Quản trị Hệ thống
                  </a>
                )}
              </nav>

              {/* Footer inside mobile menu */}
              <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 break-all">
                          {user.user_metadata?.full_name || user.email?.split('@')[0]}
                        </span>
                        <span className="text-xs text-slate-400 capitalize">
                          {currentRole === 'landlord' ? 'Chủ trọ' : currentRole === 'tenant' ? 'Người thuê' : currentRole === 'admin' ? 'Quản trị' : 'Thành viên'}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 font-bold text-sm transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => { setIsMobileMenuOpen(false); onNavigate('login'); }}
                      className="w-full py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all text-center border border-slate-200"
                    >
                      Đăng nhập
                    </button>
                    <button 
                      onClick={() => { setIsMobileMenuOpen(false); onNavigate('register'); }}
                      className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm transition-all text-center shadow-lg shadow-orange-500/20"
                    >
                      Đăng ký
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
