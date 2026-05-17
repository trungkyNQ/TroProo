
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import Messaging from '../components/shared/Messaging';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '../context/ToastContext';
import { TenantOverviewTab } from '../components/tenant/TenantOverviewTab';
import { TenantRoomsTab } from '../components/tenant/TenantRoomsTab';
import { TenantContractsTab } from '../components/tenant/TenantContractsTab';
import { TenantAccountTab } from '../components/tenant/TenantAccountTab';
import { TenantSupportModal } from '../components/tenant/modals/TenantSupportModal';
import { TenantInvoicesTab } from '../components/tenant/TenantInvoicesTab';
import { InvoiceDetailModal } from '../components/tenant/modals/InvoiceDetailModal';
import { TenantSupportTab } from '../components/tenant/TenantSupportTab';
import { ConfirmModal } from '../components/shared/ConfirmModal';


import { 
  Building,
  LayoutDashboard,
  Bed,
  FileText,
  MessageSquare,
  User,
  LogOut,
  DoorOpen,
  MapPin,
  Wallet,
  Calendar,
  Wrench,
  Droplets,
  Wind,
  PlusCircle,
  ChevronRight,
  MessageCircle, Search, Users, Phone, Video, Info, ImageIcon, Smile, 
  Send, Mail, PhoneCall, Ban, Edit3, Settings,
  Maximize2, Layers, CheckCircle, Home, Zap, ShieldCheck, X, Menu,
  BadgeCheck, Lock as LockIcon, Camera, Clock, Filter, ArrowUpDown, MoreVertical, Construction, Heart
} from 'lucide-react';

interface TenantPageProps {
  onNavigate: (page: string, params?: any) => void;
  user: SupabaseUser | null;
  onLogout: () => void;
  initialParams?: any;
}

export const TenantPage = ({ onNavigate, user, onLogout, initialParams }: TenantPageProps) => {
  const { showToast } = useToast();
  
  // Get initial tab from URL or LocalStorage
  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search);
    const urlTab = params.get('tab');
    if (urlTab) return urlTab;

    const savedTab = localStorage.getItem('last_tenant_tab');
    return savedTab || initialParams?.tab || 'overview';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Update URL and LocalStorage when tab changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    window.history.replaceState({}, '', url.toString());
    
    localStorage.setItem('last_tenant_tab', activeTab);
  }, [activeTab]);

  const [activeChatId, setActiveChatId] = useState<string | null>(initialParams?.activeChat || null);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [tenantRooms, setTenantRooms] = useState<any[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [pendingContracts, setPendingContracts] = useState<any[]>([]);
  const [signingContract, setSigningContract] = useState<string | null>(null);

  // Sync initialParams changes (e.g. when navigating from a notification while already on this page)
  useEffect(() => {
    if (initialParams?.tab) {
      setActiveTab(initialParams.tab);
    }
    if (initialParams?.activeChat) {
      setActiveChatId(initialParams.activeChat);
    }
  }, [initialParams]);

  // Invoices states
  const [tenantInvoices, setTenantInvoices] = useState<any[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showInvoiceDetailModal, setShowInvoiceDetailModal] = useState(false);
  const [updatingInvoice, setUpdatingInvoice] = useState(false);
  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);
  const [rejectingContract, setRejectingContract] = useState<any | null>(null);


  // Support Requests states
  const [supportRequestsData, setSupportRequestsData] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [showAddRequestModal, setShowAddRequestModal] = useState(false);
  const [newRequestForm, setNewRequestForm] = useState({ roomId: '', title: '', description: '' });
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // Profile form states
  const [profileForm, setProfileForm] = useState({
    full_name: '', phone: '', gender: '', birth_date: '',
    permanent_address: '',
    id_card_number: '', id_card_date: '', id_card_place: '',
    bank_name: '', bank_account_number: '', bank_account_name: '',
    zalo_phone: '', emergency_contact_name: '', emergency_contact_phone: ''
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaveMsg, setProfileSaveMsg] = useState('');

  // Password reset states
  const [passwordForm, setPasswordForm] = useState({ old: '', new: '', confirm: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [favorites, setFavorites] = useState<any[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  const fetchFavorites = async () => {
    if (!user) return;
    setLoadingFavorites(true);
    try {
      const { data, error } = await supabase
        .from('favorite_listings')
        .select(`
          id,
          listing_id,
          listings:listings (
            id,
            title,
            description,
            price,
            image_url,
            images,
            area,
            location,
            type,
            street
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      const list = (data || [])
        .map((item: any) => item.listings)
        .filter(Boolean);
      setFavorites(list);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoadingFavorites(false);
    }
  };

  const handleRemoveFavorite = async (listingId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('favorite_listings')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId);

      if (error) throw error;
      showToast('Đã bỏ lưu tin đăng.', 'success');
      setFavorites(prev => prev.filter(item => item.id !== listingId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      showToast('Lỗi khi bỏ lưu tin.', 'error');
    }
  };

  useEffect(() => {
    if (activeTab === 'favorites') {
      fetchFavorites();
    }
  }, [activeTab, user]);

  useEffect(() => {
    if (user) {
      fetchTenantRooms();
      fetchSupportRequests();
      fetchPendingContracts();
      fetchProfile();
      fetchTenantInvoices();
    }
  }, [user]);

  const fetchTenantInvoices = async () => {
    if (!user) return;
    setLoadingInvoices(true);
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`*, rooms(title, price, service_fee, electricity_price, water_price)`)
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;

      // Fetch owner bank info for all unique owner_ids
      const ownerIds = [...new Set((data || []).map((inv: any) => inv.owner_id).filter(Boolean))];
      let ownerMap: Record<string, any> = {};
      if (ownerIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, phone, bank_name, bank_account_number, bank_account_name')
          .in('id', ownerIds);
        (profiles || []).forEach((p: any) => { ownerMap[p.id] = p; });
      }

      const enriched = (data || []).map((inv: any) => ({
        ...inv,
        ownerProfile: ownerMap[inv.owner_id] || null
      }));

      setTenantInvoices(enriched);
    } catch (err) {
      console.error('Error fetching tenant invoices:', err);
    } finally {
      setLoadingInvoices(false);
    }
  };

  const handlePayInvoice = (invoiceId: string) => {
    setPayingInvoiceId(invoiceId);
  };

  const executePayInvoice = async () => {
    if (!payingInvoiceId) return;
    setUpdatingInvoice(true);
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status: 'pending_verification' })
        .eq('id', payingInvoiceId);
      if (error) throw error;
      
      const inv = tenantInvoices.find(i => i.id === payingInvoiceId);
      if (inv) {
        await supabase.from('notifications').insert({
          receiver_id: inv.owner_id,
          sender_id: user?.id,
          type: 'invoice',
          title: 'Khách thông báo đã thanh toán',
          message: inv.title,
          action_url: '/manage?tab=invoices'
        });
      }

      showToast('Đã xác nhận chuyển khoản. Chờ chủ trọ kiểm tra.', 'success');
      await fetchTenantInvoices();
      setShowInvoiceDetailModal(false);
      setPayingInvoiceId(null);
    } catch (err) {
      console.error('Error paying invoice:', err);
      showToast('Lỗi khi cập nhật trạng thái.', 'error');
    } finally {
      setUpdatingInvoice(false);
    }
  };

  const fetchProfile = async () => {
    if (!user) return;
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setProfileForm({
          full_name: data.full_name || '',
          phone: data.phone || '',
          gender: data.gender || '',
          birth_date: data.birth_date || '',
          permanent_address: data.permanent_address || '',
          id_card_number: data.id_card_number || '',
          id_card_date: data.id_card_date || '',
          id_card_place: data.id_card_place || '',
          bank_name: data.bank_name || '',
          bank_account_number: data.bank_account_number || '',
          bank_account_name: data.bank_account_name || '',
          zalo_phone: data.zalo_phone || '',
          emergency_contact_name: data.emergency_contact_name || '',
          emergency_contact_phone: data.emergency_contact_phone || ''
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setProfileSaving(true);
    setProfileSaveMsg('');
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileForm)
        .eq('id', user.id);

      if (error) throw error;
      setProfileSaveMsg('Cập nhật hồ sơ thành công!');
      showToast('Cập nhật hồ sơ thành công!', 'success');
      fetchProfile();
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setProfileSaveMsg('Có lỗi xảy ra: ' + err.message);
      showToast('Lỗi cập nhật hồ sơ: ' + err.message, 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordMsg('Mật khẩu xác nhận không khớp');
      return;
    }
    setPasswordLoading(true);
    setPasswordMsg('');
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new
      });
      if (error) throw error;
      setPasswordMsg('Cập nhật mật khẩu thành công!');
      showToast('Đổi mật khẩu thành công!', 'success');
      setPasswordForm({ old: '', new: '', confirm: '' });
    } catch (err: any) {
      console.error('Error updating password:', err);
      setPasswordMsg('Lỗi: ' + err.message);
      showToast('Lỗi đổi mật khẩu: ' + err.message, 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleStartChat = async (owner_id: string) => {
    if (!owner_id || !user) {
      setActiveTab('messages');
      return;
    }
    setIsStartingChat(true);
    try {
      const { data: existingConvs } = await supabase
        .from('conversations')
        .select('id')
        .eq('tenant_id', user.id)
        .eq('landlord_id', owner_id);

      let conversationId: string | null = null;
      if (existingConvs && existingConvs.length > 0) {
        conversationId = existingConvs[0].id;
      } else {
        const { data: newConv } = await supabase
          .from('conversations')
          .insert({ tenant_id: user.id, landlord_id: owner_id })
          .select('id')
          .single();
        if (newConv) conversationId = newConv.id;
      }
      if (conversationId) setActiveChatId(conversationId);
    } catch (err) {
      console.error('Lỗi khởi tạo chat:', err);
    } finally {
      setIsStartingChat(false);
      setActiveTab('messages');
    }
  };

  const fetchPendingContracts = async () => {
    if (!user) return;
    try {
      const { data: contractsWithData, error } = await supabase
        .rpc('get_pending_contracts', { p_tenant_id: user.id });

      if (error) throw error;
      setPendingContracts(contractsWithData || []);
    } catch (err) {
      console.error('Error fetching pending contracts:', err);
      setPendingContracts([]);
    }
  };

  const handleSignContract = async (contract: any) => {
    setSigningContract(contract.id);
    try {
      const { error: rpcError } = await supabase.rpc('accept_contract', { 
        p_contract_id: contract.id 
      });
      
      if (rpcError) throw rpcError;
      await Promise.all([fetchTenantRooms(), fetchPendingContracts()]);
      showToast('Ký hợp đồng thành công!', 'success');
    } catch (err) {
      console.error('Error signing contract:', err);
      showToast('Lỗi ký hợp đồng.', 'error');
    } finally {
      setSigningContract(null);
    }
  };

  const handleRejectContract = (contract: any) => {
    setRejectingContract(contract);
  };

  const executeRejectContract = async () => {
    if (!rejectingContract) return;
    const contractId = rejectingContract.id;
    setSigningContract(contractId);
    setRejectingContract(null);
    try {
      const { error: rpcError } = await supabase.rpc('reject_contract', { 
        p_contract_id: contractId 
      });
      if (rpcError) throw rpcError;
      await fetchPendingContracts();
      showToast('Đã từ chối lời mời hợp đồng.', 'success');
    } catch (err) {
      console.error('Error rejecting contract:', err);
      showToast('Lỗi từ chối hợp đồng.', 'error');
    } finally {
      setSigningContract(null);
    }
  };


  const fetchSupportRequests = async () => {
    if (!user) return;
    setLoadingRequests(true);
    try {
      const { data, error } = await supabase
        .from('support_requests')
        .select(`*, rooms(title)`)
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setSupportRequestsData(data || []);
    } catch (err) {
      console.error('Error fetching support requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (!newRequestForm.roomId || !newRequestForm.title || !newRequestForm.description) return;
    
    setSubmittingRequest(true);
    try {
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('owner_id')
        .eq('id', newRequestForm.roomId)
        .single();
        
      if (roomError || !roomData?.owner_id) {
        showToast('Không tìm thấy thông tin phòng.', 'error');
        return;
      }
      
      const { error } = await supabase.from('support_requests').insert({
        tenant_id: user?.id,
        room_id: newRequestForm.roomId,
        landlord_id: roomData.owner_id,
        title: newRequestForm.title,
        description: newRequestForm.description,
        status: 'pending'
      });
      if (error) throw error;
      setShowAddRequestModal(false);
      setNewRequestForm({ roomId: '', title: '', description: '' });
      await fetchSupportRequests();
      showToast('Gửi yêu cầu hỗ trợ thành công!', 'success');
    } catch (err) {
      console.error('Error submitting request:', err);
      showToast('Đã có lỗi xảy ra.', 'error');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const fetchTenantRooms = async () => {
    if (!user) return;
    setLoadingRooms(true);
    try {
      const { data: myProfile } = await supabase
        .from('profiles')
        .select('phone')
        .eq('id', user.id)
        .single();

      const myPhone = myProfile?.phone || null;
      if (!myPhone) {
        setTenantRooms([]);
        return;
      }

      const { data: rooms, error: rpcError } = await supabase
        .rpc('get_tenant_rooms', { tenant_phone: myPhone });

      if (rpcError) throw rpcError;

      if (rooms && rooms.length > 0) {
        const mapped = rooms.map((r: any) => ({
          id: r.id || r.room_id,
          title: r.title || r.room_title,
          price: r.price || r.room_price,
          type: r.type || r.room_type,
          area: r.area || r.room_area,
          status: r.status || r.room_status,
          image_url: r.image_url || r.room_image_url,
          note: r.note || r.room_note,
          contract_id: r.contract_id,
          contract_start: r.contract_start,
          contract_end: r.contract_end,
          deposit: r.contract_deposit || r.deposit,
          landlord_name: r.landlord_name || 'Chủ trọ',
          landlord_phone: r.landlord_phone || '',
          electricity_price: r.electricity_price,
          water_price: r.water_price,
          service_fee: r.service_fee,
          owner_id: r.owner_id
        }));
        setTenantRooms(mapped);
      } else {
        setTenantRooms([]);
      }
    } catch (error) {
      console.error('[TenantRooms] Error:', error);
    } finally {
      setLoadingRooms(false);
    }
  };

  const navItems: { id: string; label: string; icon: any; badge?: number | string }[] = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'rooms', label: 'Phòng của tôi', icon: Bed },
    { id: 'contracts', label: 'Hợp đồng', icon: FileText },
    { id: 'invoices', label: 'Hóa đơn', icon: Wallet },
    { id: 'support', label: 'Hỗ trợ', icon: Wrench },
    { id: 'messages', label: 'Tin nhắn', icon: MessageSquare },
    { id: 'favorites', label: 'Tin đã lưu', icon: Heart },
    { id: 'account', label: 'Tài khoản', icon: User },
  ];

  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const usageChartDataRaw = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    // Find all invoices for this month/year
    const monthlyInvoices = tenantInvoices.filter(inv => {
      const dateStr = inv.due_date || inv.created_at;
      if (!dateStr) return false;
      const dateParts = dateStr.split(/[-T ]/);
      const invYear = parseInt(dateParts[0]);
      const invMonth = parseInt(dateParts[1]);
      return invYear === parseInt(selectedYear) && invMonth === month;
    });

    const totalElec = monthlyInvoices.reduce((sum, inv) => sum + (Number(inv.electricity_usage) || 0), 0);
    const totalWater = monthlyInvoices.reduce((sum, inv) => sum + (Number(inv.water_usage) || 0), 0);

    return {
      month: `T${month}`,
      elecValue: totalElec,
      waterValue: totalWater,
      isCurrent: parseInt(selectedYear) === currentYear && month === currentMonth,
    };
  });

  const maxElec = Math.max(...usageChartDataRaw.map(d => d.elecValue), 100);
  const maxWater = Math.max(...usageChartDataRaw.map(d => d.waterValue), 10);

  const usageChartData = usageChartDataRaw.map(d => ({
    ...d,
    elecHeight: d.elecValue > 0 ? Math.max((d.elecValue / maxElec) * 100, 2) : 0,
    waterHeight: d.waterValue > 0 ? Math.max((d.waterValue / maxWater) * 100, 2) : 0,
  }));

  const avgElec = Math.round(usageChartDataRaw.reduce((sum, d) => sum + d.elecValue, 0) / 12) || 0;
  const avgWater = Math.round(usageChartDataRaw.reduce((sum, d) => sum + d.waterValue, 0) / 12) || 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-x-hidden">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <div className="p-6 flex-1">
            <div className="flex items-center gap-3 text-primary mb-8 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 font-display">Người Thuê</h2>
            </div>
            
            <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                  activeTab === item.id 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Slide Drawer */}
        <AnimatePresence mode="wait">
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              
              {/* Panel */}
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute top-0 left-0 bottom-0 w-72 bg-white p-6 flex flex-col shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3 text-primary">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 font-display">Người Thuê</h2>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Nav list */}
                <nav className="space-y-1.5 flex-1 overflow-y-auto pr-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-semibold text-sm ${
                        activeTab === item.id 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
                
                {/* Logout footer */}
                <div className="pt-6 border-t border-slate-100">
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-rose-500 hover:bg-rose-50 font-bold text-sm transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <main className={`flex-1 flex flex-col ${activeTab === 'messages' ? '' : 'p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full'} overflow-y-auto`}>
          {/* Mobile Top Navigation Header */}
          <div className="lg:hidden flex items-center justify-between bg-white px-4 py-3 border border-slate-200 mb-6 sticky top-0 z-40 shadow-sm rounded-2xl">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="w-10 h-10 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-700 transition-colors shadow-sm"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-500 text-xs hidden sm:inline">Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                <span className="font-black text-primary text-sm flex items-center gap-1.5">
                  {React.createElement(navItems.find(item => item.id === activeTab)?.icon || LayoutDashboard, { className: "w-4 h-4" })}
                  {navItems.find(item => item.id === activeTab)?.label}
                </span>
              </div>
            </div>
            
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm border border-primary/20 shadow-sm">
              T
            </div>
          </div>

          {activeTab === 'overview' && (
            <TenantOverviewTab 
              user={user} 
              tenantRooms={tenantRooms} 
              pendingContracts={pendingContracts} 
              loadingRooms={loadingRooms} 
              chartData={usageChartData}
              avgElec={avgElec}
              avgWater={avgWater}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              signingContract={signingContract} 
              handleSignContract={handleSignContract} 
              handleRejectContract={handleRejectContract} 
              onNavigate={onNavigate} 
            />
          )}

          {activeTab === 'messages' && (
            <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)] rounded-2xl border border-slate-200 shadow-sm">
              <Messaging user={user} role="tenant" initialActiveChat={activeChatId} />
            </div>
          )}

          {activeTab === 'rooms' && (
            <TenantRoomsTab 
              tenantRooms={tenantRooms} 
              loadingRooms={loadingRooms} 
              onNavigate={onNavigate} 
              handleStartChat={handleStartChat}
              isStartingChat={isStartingChat}
              user={user}
              onRefreshRooms={fetchTenantRooms}
            />
          )}

          {activeTab === 'contracts' && (
            <TenantContractsTab 
              tenantRooms={tenantRooms} 
              loadingRooms={loadingRooms} 
            />
          )}

          {activeTab === 'invoices' && (
            <TenantInvoicesTab
              invoicesData={tenantInvoices}
              loading={loadingInvoices}
              onViewInvoice={(inv) => {
                setSelectedInvoice(inv);
                setShowInvoiceDetailModal(true);
              }}
              onPayInvoice={handlePayInvoice}
            />
          )}

          {activeTab === 'support' && (
            <TenantSupportTab
              supportRequestsData={supportRequestsData}
              loadingRequests={loadingRequests}
              tenantRooms={tenantRooms}
              setShowAddRequestModal={setShowAddRequestModal}
              setNewRequestForm={setNewRequestForm}
            />
          )}

          {activeTab === 'favorites' && (
            <div className="flex-1 flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 font-display flex items-center gap-2">
                  <Heart className="w-7 h-7 text-rose-500 fill-rose-500" /> Tin đăng phòng trọ đã lưu
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Danh sách các phòng trọ bạn đã lưu để theo dõi và so sánh.</p>
              </div>

              {loadingFavorites ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse bg-white rounded-3xl p-4 border border-slate-100 space-y-4">
                      <div className="w-full aspect-[4/3] bg-slate-200 rounded-2xl" />
                      <div className="h-5 bg-slate-200 rounded w-3/4" />
                      <div className="h-4 bg-slate-200 rounded w-1/2" />
                      <div className="flex gap-2">
                        <div className="h-10 bg-slate-200 rounded-xl flex-1" />
                        <div className="h-10 bg-slate-200 rounded-xl flex-1" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white border border-slate-100 rounded-[32px] shadow-sm">
                  <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-4 animate-bounce">
                    <Heart className="w-10 h-10 fill-current" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2 font-display">Chưa có tin đăng nào được lưu</h3>
                  <p className="text-slate-500 text-sm max-w-sm mb-6 font-medium">Bấm vào biểu tượng trái tim khi lướt xem phòng để lưu các tin đăng bạn yêu thích tại đây.</p>
                  <button
                    onClick={() => onNavigate('search')}
                    className="bg-primary text-white text-xs font-black uppercase tracking-widest px-6 py-3.5 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                  >
                    Khám phá phòng trọ
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((listing) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white border border-slate-100 rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 flex flex-col h-full"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={listing.image_url || (listing.images && listing.images[0]) || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800'}
                          alt={listing.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          onClick={() => handleRemoveFavorite(listing.id)}
                          className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-rose-500 hover:bg-white shadow-md transition-all scale-95 hover:scale-105"
                          title="Bỏ lưu"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <h4 className="font-black text-slate-900 text-base line-clamp-1 mb-2 hover:text-primary transition-colors cursor-pointer" onClick={() => onNavigate('listing-detail', { id: listing.id })}>
                          {listing.title}
                        </h4>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-black text-rose-500 bg-rose-50 px-2.5 py-1 rounded-lg">
                            {Number(listing.price).toLocaleString()}đ/tháng
                          </span>
                          <span className="text-xs font-black text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {listing.area || 20} m²
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-grow font-medium">
                          {listing.description || 'Chưa có mô tả chi tiết cho phòng trọ này.'}
                        </p>
                        <div className="grid grid-cols-2 gap-3 mt-auto">
                          <button
                            onClick={() => onNavigate('listing-detail', { id: listing.id })}
                            className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-black uppercase tracking-wider transition-colors text-center"
                          >
                            Chi tiết
                          </button>
                          <button
                            onClick={() => handleRemoveFavorite(listing.id)}
                            className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-black uppercase tracking-wider transition-colors text-center"
                          >
                            Bỏ lưu
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'account' && (
            <TenantAccountTab 
              user={user} 
              tenantRooms={tenantRooms}
              profileForm={profileForm} 
              setProfileForm={setProfileForm} 
              profileLoading={profileLoading} 
              profileSaving={profileSaving} 
              profileSaveMsg={profileSaveMsg} 
              handleSaveProfile={handleSaveProfile} 
              passwordForm={passwordForm} 
              setPasswordForm={setPasswordForm} 
              passwordLoading={passwordLoading} 
              passwordMsg={passwordMsg} 
              showPassword={showPassword} 
              setShowPassword={setShowPassword} 
              handleUpdatePassword={handleUpdatePassword} 
              onLogout={onLogout} 
            />
          )}

          {activeTab !== 'overview' && activeTab !== 'messages' && activeTab !== 'rooms' && activeTab !== 'contracts' && activeTab !== 'account' && activeTab !== 'invoices' && activeTab !== 'support' && activeTab !== 'favorites' && (
            <div className="flex flex-col items-center justify-center h-96 text-slate-400">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Tính năng đang phát triển</h3>
              <p className="text-sm">Trang {navItems.find(i => i.id === activeTab)?.label} sẽ sớm ra mắt.</p>
            </div>
          )}
        </main>
      </div>

      <InvoiceDetailModal
        show={showInvoiceDetailModal}
        onClose={() => setShowInvoiceDetailModal(false)}
        invoice={selectedInvoice}
        loading={updatingInvoice}
        onPay={() => handlePayInvoice(selectedInvoice?.id)}
      />

      <TenantSupportModal 
        showAddRequestModal={showAddRequestModal} 
        setShowAddRequestModal={setShowAddRequestModal} 
        newRequestForm={newRequestForm} 
        setNewRequestForm={setNewRequestForm} 
        tenantRooms={tenantRooms} 
        submittingRequest={submittingRequest} 
        handleSubmitRequest={handleSubmitRequest} 
      />

      {/* Rejection Confirmation */}
      <ConfirmModal
        show={!!rejectingContract}
        onClose={() => setRejectingContract(null)}
        onConfirm={executeRejectContract}
        title="Từ chối hợp đồng"
        message={`Bạn có chắc muốn TỪ CHỐI lời mời hợp đồng cho phòng ${rejectingContract?.rooms?.title}?`}
        confirmText="Từ chối"
        type="danger"
        loading={signingContract === rejectingContract?.id}
      />

      {/* Pay Confirmation */}
      <ConfirmModal
        show={!!payingInvoiceId}
        onClose={() => setPayingInvoiceId(null)}
        onConfirm={executePayInvoice}
        title="Xác nhận thanh toán"
        message="Bạn có chắc chắn đã thanh toán số tiền này cho Chủ trọ không? Hành động này sẽ gửi thông báo để chủ trọ kiểm tra và duyệt hóa đơn cho bạn."
        confirmText="Đã thanh toán"
        type="info"
        loading={updatingInvoice}
      />

    </div>
  );
};
