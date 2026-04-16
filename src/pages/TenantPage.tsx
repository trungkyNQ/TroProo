
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
  Maximize2, Layers, CheckCircle, Home, Zap, ShieldCheck, X,
  BadgeCheck, Lock as LockIcon, Camera, Clock, Filter, ArrowUpDown, MoreVertical, Construction
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
  const [loadingRooms, setLoadingRooms] = useState(false);
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
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showInvoiceDetailModal, setShowInvoiceDetailModal] = useState(false);
  const [updatingInvoice, setUpdatingInvoice] = useState(false);

  // Support Requests states
  const [supportRequestsData, setSupportRequestsData] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
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
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaveMsg, setProfileSaveMsg] = useState('');

  // Password reset states
  const [passwordForm, setPasswordForm] = useState({ old: '', new: '', confirm: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      setTenantInvoices(data || []);
    } catch (err) {
      console.error('Error fetching tenant invoices:', err);
    } finally {
      setLoadingInvoices(false);
    }
  };

  const handlePayInvoice = async (invoiceId: string) => {
    if (!window.confirm('Xác nhận bạn đã chuyển khoản số tiền này cho Chủ Trọ?')) return;
    setUpdatingInvoice(true);
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status: 'pending_verification' })
        .eq('id', invoiceId);
      if (error) throw error;
      
      const inv = tenantInvoices.find(i => i.id === invoiceId);
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

  const handleRejectContract = async (contract: any) => {
    if (!window.confirm(`Bạn có chắc muốn TỪ CHỐI hợp đồng phòng ${contract.rooms?.title}?`)) return;
    
    setSigningContract(contract.id);
    try {
      const { error: rpcError } = await supabase.rpc('reject_contract', { 
        p_contract_id: contract.id 
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

  const navItems = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'rooms', label: 'Phòng của tôi', icon: Bed },
    { id: 'contracts', label: 'Hợp đồng', icon: FileText },
    { id: 'invoices', label: 'Hóa đơn', icon: Wallet },
    { id: 'support', label: 'Hỗ trợ', icon: Wrench },
    { id: 'messages', label: 'Tin nhắn', icon: MessageSquare, badge: 3 },
    { id: 'account', label: 'Tài khoản', icon: User },
  ];

  const monthlyElectric = [
    { month: 'T5', height: '60%' },
    { month: 'T6', height: '85%' },
    { month: 'T7', height: '40%' },
    { month: 'T8', height: '30%' },
    { month: 'T9', height: '55%' },
    { month: 'T10', height: '70%', isCurrent: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
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

        <main className={`flex-1 flex flex-col ${activeTab === 'messages' ? '' : 'p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full'} overflow-y-auto`}>
          {activeTab === 'overview' && (
            <TenantOverviewTab 
              user={user} 
              tenantRooms={tenantRooms} 
              pendingContracts={pendingContracts} 
              loadingRooms={loadingRooms} 
              monthlyElectric={monthlyElectric}
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

          {activeTab !== 'overview' && activeTab !== 'messages' && activeTab !== 'rooms' && activeTab !== 'contracts' && activeTab !== 'account' && activeTab !== 'invoices' && activeTab !== 'support' && (
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
    </div>
  );
};
