import { OverviewTab } from '../components/manage/OverviewTab';
import { RoomsTab } from '../components/manage/RoomsTab';
import { TenantsTab } from '../components/manage/TenantsTab';
import { InvoicesTab } from '../components/manage/InvoicesTab';
import { ListingsTab } from '../components/manage/ListingsTab';
import { ContractsTab } from '../components/manage/ContractsTab';
import { SupportTab } from '../components/manage/SupportTab';
import { MessagesTab } from '../components/manage/MessagesTab';
import { AccountTab } from '../components/manage/AccountTab';
import { AddRoomModal } from '../components/manage/modals/AddRoomModal';
import { EditRoomModal } from '../components/manage/modals/EditRoomModal';
import { AddListingModal } from '../components/manage/modals/AddListingModal';
import { RoomDetailModal } from '../components/manage/modals/RoomDetailModal';
import { DeleteConfirmModal } from '../components/manage/modals/DeleteConfirmModal';
import { CreateInvoiceModal } from '../components/manage/modals/CreateInvoiceModal';
import { RiskAlerts } from '../components/RiskAnalysis/RiskAlerts';
import { ConfirmModal } from '../components/shared/ConfirmModal';
import {
  OverviewSkeleton, InvoicesSkeleton, ContractsSkeleton,
  SupportSkeleton, ListingsSkeleton
} from '../components/manage/ManageSkeletons';
import { useToast } from '../context/ToastContext';


import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import Messaging from '../components/shared/Messaging';
import { supabase } from '../lib/supabase';
import { duDoanRuiRoDienNuoc } from '../lib/riskAnalysis';
import { 
  LayoutDashboard, 
  Home as HomeIcon, 
  FileText, 
  MessageSquare, 
  User, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Bed,
  Wallet,
  ChevronRight,
  LogOut,
  Home,
  Filter,
  ArrowUpDown,
  Maximize2,
  Users,
  MoreVertical,
  Construction,
  Info,
  Layers,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  ChevronLeft,
  Search,
  FileClock,
  Settings,
  Edit3,
  Phone,
  Video,
  PlusCircle,
  Image as ImageIcon,
  Smile,
  Send,
  MoreHorizontal,
  ShieldAlert,
  Ban,
  Mail,
  PhoneCall,
  MessageCircle,
  Shield,
  Lock as LockIcon,
  Camera,
  MapPin,
  Eye,
  EyeOff,
  BadgeCheck,
  X,
  Menu,
  Sparkles,
  ArrowLeft,
  Trash2,
  Zap,
  Crown,
  ArrowRight,
  Droplets,
  ShieldCheck,
  Wrench,
  Calendar
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface ManagePageProps {
  onNavigate: (page: string, params?: any) => void;
  user: SupabaseUser | null;
  onLogout: () => void;
  initialParams?: any;
}



export const ManagePage = ({ onNavigate, user, onLogout, initialParams }: ManagePageProps) => {
  const { showToast } = useToast();

  // Get tab from URL or LocalStorage or fallback to initialParams or 'overview'
  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search);
    const urlTab = params.get('tab');
    if (urlTab) return urlTab;

    const savedTab = localStorage.getItem('last_manage_tab');
    return savedTab || initialParams?.tab || 'overview';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Update URL and LocalStorage when tab changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    window.history.replaceState({}, '', url.toString());
    
    localStorage.setItem('last_manage_tab', activeTab);
  }, [activeTab]);

  const [roomFilter, setRoomFilter] = useState('all');
  const [contractFilter, setContractFilter] = useState(initialParams?.filter || 'all');
  const [activeChat, setActiveChat] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Real data states
  const [roomsData, setRoomsData] = useState<any[]>([]);
  const [contractsData, setContractsData] = useState<any[]>([]);
  const [invoicesData, setInvoicesData] = useState<any[]>([]);
  const [listingsData, setListingsData] = useState<any[]>([]);
  const [supportRequestsData, setSupportRequestsData] = useState<any[]>([]);

  // Add Room Modal states
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [addRoomStep, setAddRoomStep] = useState<1 | 2>(1);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [addingRoom, setAddingRoom] = useState(false);
  const [newRoomForm, setNewRoomForm] = useState({
    title: '',
    price: '',
    type: 'Phòng trọ',
    area: '',
    status: 'empty',
    note: '',
    image_url: '',
    tenant_id: '',
    electricity_price: 3500,
    water_price: 20000,
    service_fee: 150000,
    initial_electricity_number: 0,
    initial_water_number: 0,
    tenant_deposit: '',
    tenant_start_date: new Date().toISOString().split('T')[0],
    tenant_end_date: (() => { const d = new Date(); d.setFullYear(d.getFullYear() + 1); return d.toISOString().split('T')[0]; })()
  });

  // Add Listing Modal states
  const [showAddListingModal, setShowAddListingModal] = useState(false);
  const [addingListing, setAddingListing] = useState(false);
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const [listingForm, setListingForm] = useState({
    title: '', description: '', price: '', area: '', type: 'Phòng trọ',
    location: '', street: '', image_url: '',
    electricity_price: 3500, water_price: 20000, service_fee: 150000, deposit: ''
  });

  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [showLimitUpgradeModal, setShowLimitUpgradeModal] = useState(false);

  const checkListingLimit = (isEditing: boolean = false) => {
    if (isEditing) return true;
    if (subscriptionTier === 'free' && listingsData.length >= 2) {
      setShowLimitUpgradeModal(true);
      return false;
    }
    if (subscriptionTier === 'pro' && listingsData.length >= 10) {
      setShowLimitUpgradeModal(true);
      return false;
    }
    return true;
  };

  // Edit Room Modal states
  const [showEditRoomModal, setShowEditRoomModal] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [savingRoomEdit, setSavingRoomEdit] = useState(false);
  const [editRoomForm, setEditRoomForm] = useState({
    title: '',
    price: '',
    type: 'Phòng trọ',
    area: '',
    status: 'empty',
    note: '',
    image_url: '',
    electricity_price: 3500,
    water_price: 20000,
    service_fee: 150000,
    initial_electricity_number: 0,
    initial_water_number: 0
  });

  // Delete Room Confirm Modal states
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<{id: string, title: string} | null>(null);
  const [isDeletingRoom, setIsDeletingRoom] = useState(false);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState('');
  const [listingToDelete, setListingToDelete] = useState<any | null>(null);


  // Room Detail Modal states
  const [showRoomDetailModal, setShowRoomDetailModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  // Tenant phone search states
  const [searchPhone, setSearchPhone] = useState('');
  const [searchingTenant, setSearchingTenant] = useState(false);
  const [foundTenant, setFoundTenant] = useState<any>(null);
  const [searchError, setSearchError] = useState('');

  // Tenant management states
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [showTenantProfile, setShowTenantProfile] = useState(false);

  // Invoices
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [addingInvoice, setAddingInvoice] = useState(false);
  const [preSelectedRoomForInvoice, setPreSelectedRoomForInvoice] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingContracts, setLoadingContracts] = useState(true);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [loadingListings, setLoadingListings] = useState(true);
  const [loadingSupport, setLoadingSupport] = useState(true);

  // Listen to navigation action triggers
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlAction = params.get('action');
    if (urlAction === 'add-listing' || initialParams?.action === 'add-listing') {
      setActiveTab('listings');

      // Clear query params to prevent reopening modal on page refreshes
      const url = new URL(window.location.href);
      url.searchParams.delete('action');
      window.history.replaceState({}, '', url.toString());
    }
  }, [initialParams]);

  useEffect(() => {
    if (user) {
      setLoading(true); // Initial load still shows a quick pulse if needed, but we'll try to keep it light
      
      // Fetch everything independently
      Promise.all([
        fetchRooms(),
        fetchContracts(),
        fetchInvoices(),
        fetchListings(),
        fetchSupportRequests()
      ]).finally(() => setLoading(false));
    }
  }, [user?.id]);

  // Cleanup modals when unmounting
  useEffect(() => {
    console.log('[ManagePage] Component MOUNTED');
    return () => {
      console.log('[ManagePage] Component UNMOUNTING! Resetting modal states...');
      setShowAddListingModal(false);
      setShowAddRoomModal(false);
      setShowEditRoomModal(false);
      setShowDeleteConfirmModal(false);
      setShowRoomDetailModal(false);
      setShowCreateInvoiceModal(false);
    };
  }, []);

  const fetchRooms = async () => {
    setLoadingRooms(true);
    try {
      const { data } = await supabase.from('rooms').select('*, contracts(tenant_id, status)').eq('owner_id', user?.id);
      setRoomsData(data || []);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoadingRooms(false);
    }
  };

  const fetchContracts = async () => {
    setLoadingContracts(true);
    try {
      const { data } = await supabase.from('contracts').select('*, profiles!contracts_tenant_id_fkey(full_name, avatar_url, phone, gender, birth_date, permanent_address, id_card_number, id_card_date, id_card_place, zalo_phone, bank_name, bank_account_number, bank_account_name, emergency_contact_name, emergency_contact_phone), rooms(title)').eq('owner_id', user?.id);
      setContractsData(data || []);
    } catch (err) {
      console.error('Error fetching contracts:', err);
    } finally {
      setLoadingContracts(false);
    }
  };

  const fetchInvoices = async () => {
    setLoadingInvoices(true);
    try {
      const { data } = await supabase.from('invoices').select('*, profiles!invoices_tenant_id_fkey(full_name, avatar_url, phone), rooms(title)').eq('owner_id', user?.id).order('created_at', { ascending: false });
      setInvoicesData(data || []);
    } catch (err) {
      console.error('Error fetching invoices:', err);
    } finally {
      setLoadingInvoices(false);
    }
  };

  const fetchListings = async () => {
    setLoadingListings(true);
    try {
      const { data } = await supabase.from('listings').select('*').eq('owner_id', user?.id);
      setListingsData(data || []);

      const { data: profile } = await supabase.from('profiles').select('subscription_tier').eq('id', user?.id).single();
      if (profile) {
        setSubscriptionTier(profile.subscription_tier as any || 'free');
      }
    } catch (err) {
      console.error('Error fetching listings/subscription:', err);
    } finally {
      setLoadingListings(false);
    }
  };

  const fetchSupportRequests = async () => {
    setLoadingSupport(true);
    try {
      const { data: supportRequests, error: supportError } = await supabase
        .from('support_requests')
        .select('*, rooms(title)')
        .eq('landlord_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (supportRequests && supportRequests.length > 0) {
        const tenantIds = [...new Set(supportRequests.map(req => req.tenant_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, phone')
          .in('id', tenantIds);
          
        const mappedRequests = supportRequests.map(req => ({
          ...req,
          profiles: profilesData?.find(p => p.id === req.tenant_id) || null
        }));
        setSupportRequestsData(mappedRequests);
      } else {
        setSupportRequestsData([]);
      }
    } catch (err) {
      console.error('Error fetching support:', err);
    } finally {
      setLoadingSupport(false);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    await Promise.all([
      fetchRooms(),
      fetchContracts(),
      fetchInvoices(),
      fetchListings(),
      fetchSupportRequests()
    ]);
    setLoading(false);
  };

  const handleAddInvoice = async (invoiceData: any) => {
    setAddingInvoice(true);
    try {
      const { error } = await supabase.from('invoices').insert({
        owner_id: user?.id,
        ...invoiceData
      });
      if (error) throw error;
      
      if (invoiceData.tenant_id) {
        await supabase.from('notifications').insert({
          receiver_id: invoiceData.tenant_id,
          sender_id: user?.id,
          type: 'invoice',
          title: 'Hóa đơn mới',
          message: invoiceData.title,
          action_url: '/tenant?tab=invoices'
        });
      }

      // Cập nhật chỉ số điện nước mới nhất cho Phòng để tháng sau tự động lấy làm số CŨ
      if (invoiceData.room_id) {
        await supabase.from('rooms').update({
          initial_electricity_number: invoiceData.electricity_new,
          initial_water_number: invoiceData.water_new
        }).eq('id', invoiceData.room_id);
      }
      
      setShowCreateInvoiceModal(false);
      await fetchInvoices(); // Only need to refresh invoices
      await fetchRooms(); // Refresh rooms to get new initial numbers
      
      // Chạy nền thuật toán dự đoán AI mỗi khi chốt Hóa đơn xong
      if (invoiceData.room_id) {
        // Gom lịch sử CŨ của phòng này
        const lichSuChoPhong = invoicesData
          .filter(inv => inv.room_id === invoiceData.room_id)
          .sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          .map(inv => ({
            thang: inv.created_at,
            soDien: inv.electricity_usage || 0,
            soNuoc: inv.water_usage || 0
          }));
        
        // Kẹp thêm tháng GIỮA TẠI (vừa chốt xong)
        lichSuChoPhong.push({
          thang: new Date().toISOString(),
          soDien: invoiceData.electricity_usage || 0,
          soNuoc: invoiceData.water_usage || 0
        });

        // Push qua bộ vi xử lí AI (Chạy không đồng bộ để không chặn luồng update UI)
        duDoanRuiRoDienNuoc(invoiceData.room_id, lichSuChoPhong).catch(console.error);
      }
    } catch (err) {
      console.error('Error creating invoice:', err);
      // alert('Không thể tạo hóa đơn');
      showToast('Không thể tạo hóa đơn. Vui lòng kiểm tra lại dữ liệu.', 'error');

    } finally {
      setAddingInvoice(false);
    }
  };

  const handleUpdateInvoiceStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('invoices').update({ status }).eq('id', id);
      if (error) throw error;
      await fetchInvoices(); // Only need to refresh invoices
    } catch (err) {
      console.error('Error updating invoice:', err);
      // alert('Không thể cập nhật hóa đơn');
      showToast('Không thể cập nhật trạng thái hóa đơn.', 'error');

    }
  };

  const openAddRoomModal = () => {
    setShowAddRoomModal(true);
    setAddRoomStep(1);
    setSelectedListingId(null);
    setNewRoomForm({ title: '', price: '', type: 'Phòng trọ', area: '', status: 'empty', note: '', image_url: '', tenant_id: '', electricity_price: 3500, water_price: 20000, service_fee: 150000, initial_electricity_number: 0, initial_water_number: 0, tenant_deposit: '', tenant_start_date: new Date().toISOString().split('T')[0], tenant_end_date: (() => { const d = new Date(); d.setFullYear(d.getFullYear() + 1); return d.toISOString().split('T')[0]; })() });
    setSearchPhone('');
    setFoundTenant(null);
    setSearchError('');
  };

  const selectListingForRoom = (listing: any) => {
    setSelectedListingId(listing.id);
    setNewRoomForm({
      title: listing.title || '',
      price: listing.price?.toString() || '',
      type: listing.type || 'Phòng trọ',
      area: listing.area?.toString() || '',
      status: 'empty',
      note: '',
      image_url: listing.image_url || (listing.images && listing.images[0]) || '',
      tenant_id: '',
      electricity_price: listing.electricity_price || 3500,
      water_price: listing.water_price || 20000,
      service_fee: listing.service_fee || 150000,
      initial_electricity_number: 0,
      initial_water_number: 0,
      tenant_deposit: listing.deposit?.toString() || listing.price?.toString() || '',
      tenant_start_date: new Date().toISOString().split('T')[0],
      tenant_end_date: (() => { const d = new Date(); d.setFullYear(d.getFullYear() + 1); return d.toISOString().split('T')[0]; })()
    });
    setAddRoomStep(2);
  };

  const skipToManualEntry = () => {
    setSelectedListingId(null);
    setNewRoomForm({ title: '', price: '', type: 'Phòng trọ', area: '', status: 'empty', note: '', image_url: '', tenant_id: '', electricity_price: 3500, water_price: 20000, service_fee: 150000, initial_electricity_number: 0, initial_water_number: 0, tenant_deposit: '', tenant_start_date: new Date().toISOString().split('T')[0], tenant_end_date: (() => { const d = new Date(); d.setFullYear(d.getFullYear() + 1); return d.toISOString().split('T')[0]; })() });
    setAddRoomStep(2);
  };

  const handleAddRoom = async () => {
    if (!newRoomForm.title || !newRoomForm.price) return;
    setAddingRoom(true);
    try {
      const roomStatus = newRoomForm.tenant_id ? 'pending' : (newRoomForm.status || 'empty');
      
      // 1. Create the room
      const { data: newRoom, error: roomError } = await supabase.from('rooms').insert({
        owner_id: user?.id,
        title: newRoomForm.title,
        price: Number(newRoomForm.price),
        type: newRoomForm.type,
        area: newRoomForm.area ? Number(newRoomForm.area) : null,
        status: roomStatus,
        note: newRoomForm.note || null,
        image_url: newRoomForm.image_url || null,
        electricity_price: Number(newRoomForm.electricity_price) || 3500,
        water_price: Number(newRoomForm.water_price) || 20000,
        service_fee: Number(newRoomForm.service_fee) || 150000,
        initial_electricity_number: Number(newRoomForm.initial_electricity_number) || 0,
        initial_water_number: Number(newRoomForm.initial_water_number) || 0
      }).select().single();
      if (roomError) throw roomError;

      // 2. Create a contract linking tenant to this room IF tenant was selected
      if (newRoom && newRoomForm.tenant_id) {
        const { data: newContract, error: contractError } = await supabase.from('contracts').insert({
          owner_id: user?.id,
          tenant_id: newRoomForm.tenant_id,
          room_id: newRoom.id,
          start_date: newRoomForm.tenant_start_date,
          end_date: newRoomForm.tenant_end_date,
          deposit: newRoomForm.tenant_deposit ? Number(newRoomForm.tenant_deposit) : 0,
          status: 'pending'
        }).select().single();

        if (contractError) {
          console.error('Error creating contract:', contractError);
        } else if (newContract) {
          // 3. Send notification to tenant
          await supabase.from('notifications').insert({
            sender_id: user?.id,
            receiver_id: newRoomForm.tenant_id,
            type: 'contract_invite',
            title: 'Yêu cầu ký hợp đồng mới',
            message: `Chủ trọ đã thêm bạn vào phòng "${newRoom.title}". Vui lòng xác nhận hợp đồng để bắt đầu thuê.`,
            related_entity_id: newContract.id,
            action_url: 'tenant?tab=overview'
          });
        }
      }

      setShowAddRoomModal(false);
      await fetchDashboardData();
    } catch (err) {
      console.error('Error adding room:', err);
      // alert('Đã có lỗi xảy ra. Kiểm tra console hoặc quyền (RLS) của database.');
      showToast('Lỗi khi thêm phòng. Vui lòng kiểm tra lại kết nối hoặc quyền truy cập.', 'error');

    } finally {
      setAddingRoom(false);
    }
  };

  // Tạo hoặc Cập nhật bài đăng
  const handleAddListing = async () => {
    if (!listingForm.title || !listingForm.price) return;
    
    // Kiểm tra giới hạn đăng tin khi thêm tin mới (editingListingId là null)
    if (!editingListingId && !checkListingLimit(false)) {
      return;
    }

    setAddingListing(true);
    try {
      const payload = {
        owner_id: user?.id,
        title: listingForm.title,
        description: listingForm.description || null,
        price: Number(listingForm.price),
        area: listingForm.area ? Number(listingForm.area) : null,
        type: listingForm.type,
        location: listingForm.location || null,
        street: listingForm.street || null,
        image_url: listingForm.image_url || null,
        images: listingForm.image_url ? [listingForm.image_url] : [],
        electricity_price: Number(listingForm.electricity_price) || 3500,
        water_price: Number(listingForm.water_price) || 20000,
        service_fee: Number(listingForm.service_fee) || 150000,
        deposit: listingForm.deposit ? Number(listingForm.deposit) : Number(listingForm.price),
        is_active: true,
        approval_status: 'pending'
      };

      if (editingListingId) {
        const currentListing = listingsData.find(x => x.id === editingListingId);
        
        if (currentListing && currentListing.approval_status === 'approved') {
          const editPayload = {
            title: listingForm.title,
            description: listingForm.description || null,
            price: Number(listingForm.price),
            area: listingForm.area ? Number(listingForm.area) : null,
            type: listingForm.type,
            location: listingForm.location || null,
            street: listingForm.street || null,
            image_url: listingForm.image_url || null,
            images: listingForm.image_url ? [listingForm.image_url] : [],
            electricity_price: Number(listingForm.electricity_price) || 3500,
            water_price: Number(listingForm.water_price) || 20000,
            service_fee: Number(listingForm.service_fee) || 150000,
            deposit: listingForm.deposit ? Number(listingForm.deposit) : Number(listingForm.price),
          };

          const { error } = await supabase
            .from('listings')
            .update({
              pending_edit_data: editPayload,
              edit_approval_status: 'pending',
              edit_rejection_reason: null
            })
            .eq('id', editingListingId);
          if (error) throw error;
          showToast('Đã gửi yêu cầu chỉnh sửa bài viết để Admin duyệt.', 'success');
        } else {
          const { error } = await supabase.from('listings').update(payload).eq('id', editingListingId);
          if (error) throw error;
          showToast('Cập nhật bài viết thành công.', 'success');
        }
      } else {
        const { error } = await supabase.from('listings').insert(payload);
        if (error) throw error;
        showToast('Đã đăng bài thành công, chờ Admin duyệt.', 'success');
      }

      setShowAddListingModal(false);
      setEditingListingId(null);
      setListingForm({ title: '', description: '', price: '', area: '', type: 'Phòng trọ', location: '', street: '', image_url: '', electricity_price: 3500, water_price: 20000, service_fee: 150000, deposit: '' });
      await fetchDashboardData();
    } catch (err) {
      console.error('Error adding/updating listing:', err);
      // alert('Đã có lỗi khi lưu bài đăng.');
      showToast('Không thể lưu bài đăng. Vui lòng thử lại.', 'error');

    } finally {
      setAddingListing(false);
    }
  };

  const handleDeleteListing = (listing: any) => {
    setListingToDelete(listing);
  };

  const executeDeleteListing = async () => {
    if (!listingToDelete) return;
    const id = listingToDelete.id;
    setListingToDelete(null);
    try {
      const { error } = await supabase.from('listings').delete().eq('id', id);
      if (error) throw error;
      showToast('Đã xóa bài đăng thành công', 'success');
      await fetchDashboardData();
    } catch (err) {
      console.error('Error deleting listing:', err);
      showToast('Lỗi khi xóa bài đăng.', 'error');
    }
  };


  const openEditListingModal = (listing: any) => {
    setEditingListingId(listing.id);
    setListingForm({
      title: listing.title || '',
      description: listing.description || '',
      price: listing.price?.toString() || '',
      area: listing.area?.toString() || '',
      type: listing.type || 'Phòng trọ',
      location: listing.location || '',
      street: listing.street || '',
      image_url: listing.image_url || (listing.images && listing.images[0]) || '',
      electricity_price: listing.electricity_price || 3500,
      water_price: listing.water_price || 20000,
      service_fee: listing.service_fee || 150000,
      deposit: listing.deposit?.toString() || ''
    });
    setShowAddListingModal(true);
  };

  const handleUpdateSupportRequest = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('support_requests').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setSupportRequestsData(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
    } catch (err) {
      console.error('Error updating support request:', err);
      // alert('Không thể cập nhật yêu cầu. Vui lòng thử lại.');
      showToast('Lỗi cập nhật yêu cầu hỗ trợ.', 'error');

    }
  };

  const openEditRoomModal = (roomId: string) => {
    const r = roomsData.find(x => x.id === roomId);
    if (!r) return;
    setEditingRoomId(r.id);
    setEditRoomForm({
      title: r.title || '',
      price: r.price?.toString() || '',
      type: r.type || 'Phòng trọ',
      area: r.area?.toString() || '',
      status: r.status || 'empty',
      note: r.note || '',
      image_url: r.image_url || '',
      electricity_price: r.electricity_price || 3500,
      water_price: r.water_price || 20000,
      service_fee: r.service_fee || 150000,
      initial_electricity_number: r.initial_electricity_number || 0,
      initial_water_number: r.initial_water_number || 0
    });
    setShowEditRoomModal(true);
  };

  const handleSaveRoomEdit = async () => {
    if (!editingRoomId || !editRoomForm.title || !editRoomForm.price) return;
    setSavingRoomEdit(true);
    try {
      const { error } = await supabase.from('rooms').update({
        title: editRoomForm.title,
        price: Number(editRoomForm.price),
        type: editRoomForm.type,
        area: editRoomForm.area ? Number(editRoomForm.area) : null,
        status: editRoomForm.status,
        note: editRoomForm.note || null,
        image_url: editRoomForm.image_url || null,
        electricity_price: Number(editRoomForm.electricity_price) || 3500,
        water_price: Number(editRoomForm.water_price) || 20000,
        service_fee: Number(editRoomForm.service_fee) || 150000,
        initial_electricity_number: Number(editRoomForm.initial_electricity_number) || 0,
        initial_water_number: Number(editRoomForm.initial_water_number) || 0
      }).eq('id', editingRoomId);
      
      if (error) throw error;
      
      setShowEditRoomModal(false);
      await fetchDashboardData();
    } catch (err) {
      console.error('Error updating room:', err);
      // alert('Đã có lỗi khi cập nhật phòng.');
      showToast('Không thể cập nhật thông tin phòng.', 'error');

    } finally {
      setSavingRoomEdit(false);
    }
  };

  const searchTenantByPhone = async () => {
    if (!searchPhone.trim()) return;
    setSearchingTenant(true);
    setSearchError('');
    setFoundTenant(null);
    setNewRoomForm(f => ({ ...f, tenant_id: '' }));
    try {
      // Normalize phone: convert leading 0 to +84 (Vietnamese format)
      let rawPhone = searchPhone.trim();
      if (rawPhone.startsWith('0')) {
        rawPhone = '+84' + rawPhone.slice(1);
      }

      // Try exact match first, then also try with the original input
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone, avatar_url, role')
        .eq('phone', rawPhone)
        .single();

      // Fallback: try original input if normalized form not found
      if ((error || !profile) && rawPhone !== searchPhone.trim()) {
        const fallback = await supabase
          .from('profiles')
          .select('id, full_name, phone, avatar_url, role')
          .eq('phone', searchPhone.trim())
          .single();
        profile = fallback.data;
        error = fallback.error;
      }

      if (error || !profile) {
        setSearchError('Không tìm thấy người dùng với số điện thoại này. Vui lòng kiểm tra lại.');
        return;
      }

      // Check if this tenant already has an active contract (room assigned)
      const { data: activeContract } = await supabase
        .from('contracts')
        .select('id, rooms(title)')
        .eq('tenant_id', profile.id)
        .eq('status', 'active')
        .eq('owner_id', user?.id)
        .single();

      if (activeContract) {
        const roomName = (activeContract as any).rooms?.title || 'một phòng';
        setSearchError(`Người thuê này đã được gán vào "${roomName}". Mỗi số điện thoại chỉ được thuê 1 phòng.`);
        return;
      }

      setFoundTenant(profile);
      setNewRoomForm(f => ({ ...f, tenant_id: profile.id }));
    } catch (err) {
      console.error('Error searching tenant:', err);
      setSearchError('Đã có lỗi xảy ra khi tìm kiếm.');
    } finally {
      setSearchingTenant(false);
    }
  };

  const handleDeleteRoom = (roomId: string, roomTitle: string) => {
    setRoomToDelete({ id: roomId, title: roomTitle });
    setShowDeleteConfirmModal(true);
  };

  const executeDeleteRoom = async () => {
    if (!roomToDelete) return;
    setIsDeletingRoom(true);
    try {
      const roomId = roomToDelete.id;

      // Sử dụng RPC function đã tạo để xóa dọn dẹp toàn bộ dữ liệu liên quan trong một transaction
      const { error } = await supabase.rpc('delete_room_cascade', {
        target_room_id: roomId,
        target_owner_id: user?.id
      });

      if (error) throw error;
      
      await fetchDashboardData();
      setShowDeleteConfirmModal(false);
      
      // Hiện Toast Message đẹp
      setDeleteSuccessMessage(`Đã xóa thành công phòng "${roomToDelete.title}".`);
      setTimeout(() => setDeleteSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting room:', err);
      // Nếu vẫn lỗi, khả năng cao là do chính sách RLS hoặc dữ liệu đặc biệt chưa được dọn dẹp hết
      // alert('Không thể xóa phòng. Phòng có thể đang gắn với dữ liệu không thể dọn dẹp tự động. Vui lòng liên hệ hỗ trợ hoặc kiểm tra lại các hợp đồng đang hoạt động.');
      showToast('Lỗi dọn dẹp dữ liệu. Phòng này có thể đang có hợp đồng hoặc hóa đơn chưa được xử lý.', 'error');

    } finally {
      setIsDeletingRoom(false);
      setRoomToDelete(null);
    }
  };
  const handleViewProfile = (tenant: any) => {
    setSelectedTenant(tenant);
    setShowTenantProfile(true);
  };

  const [sendingProfileReminder, setSendingProfileReminder] = useState(false);
  const [profileReminderSent, setProfileReminderSent] = useState(false);

  const handleRequestProfileUpdate = async (tenant: any) => {
    if (!user || !tenant?.id) return;
    setSendingProfileReminder(true);
    try {
      // Detect which fields are missing
      const missingFields: string[] = [];
      if (!tenant.id_card_number) missingFields.push('Số CCCD/CMND');
      if (!tenant.permanent_address) missingFields.push('Địa chỉ thường trú');
      if (!tenant.birth_date) missingFields.push('Ngày sinh');
      if (!tenant.emergency_contact_name) missingFields.push('Tên người thân khẩn cấp');
      if (!tenant.emergency_contact_phone) missingFields.push('SĐT người thân khẩn cấp');

      const missingText = missingFields.length > 0
        ? `Thông tin còn thiếu: ${missingFields.join(', ')}.`
        : 'Vui lòng cập nhật đầy đủ thông tin hồ sơ.';

      const { error } = await supabase.from('notifications').insert({
        sender_id: user.id,
        receiver_id: tenant.id,
        type: 'profile_update_request',
        title: 'Yêu cầu cập nhật thông tin cá nhân',
        message: `Chủ trọ yêu cầu bạn bổ sung hồ sơ để hoàn tất thủ tục thuê phòng. ${missingText} Vui lòng vào mục Tài khoản để cập nhật.`,
        action_url: 'tenant?tab=account'
      });

      if (!error) {
        setProfileReminderSent(true);
        setTimeout(() => setProfileReminderSent(false), 4000);
      }
    } catch (err) {
      console.error('Error sending profile reminder:', err);
    } finally {
      setSendingProfileReminder(false);
    }
  };

  const calculateMonthlyRevenue = () => {
    // Generate all 12 months for the selected year
    const yearNum = Number(selectedYear);
    const months = [];
    
    for (let i = 0; i < 12; i++) {
      months.push({
        month: i + 1,
        year: yearNum,
        label: `T${i + 1}`,
        revenue: 0
      });
    }

    // Filter paid invoices for the selected year
    const paidInvoices = invoicesData.filter(inv => 
      inv.status === 'paid' && 
      new Date(inv.due_date).getFullYear().toString() === selectedYear
    );

    // Aggregate revenue to matching months
    paidInvoices.forEach(inv => {
      // Use string split for date to avoid timezone shifts (format: YYYY-MM-DD or ISO)
      const dateStr = inv.due_date || inv.created_at;
      if (!dateStr) return;
      
      const dateParts = dateStr.split(/[-T ]/);
      const invYear = parseInt(dateParts[0]);
      const invMonth = parseInt(dateParts[1]); // 1-indexed
      
      const targetMonth = months.find(m => m.month === invMonth && m.year === invYear);
      if (targetMonth) {
        targetMonth.revenue += Number(inv.amount);
      }
    });

    // Calculate chart height relative to max revenue
    const maxRevenue = Math.max(...months.map(m => m.revenue), 1000000);
    
    return months.map(m => ({
      ...m,
      height: m.revenue > 0 ? Math.max((m.revenue / maxRevenue) * 100, 10) : 5,
      displayValue: (m.revenue / 1000000).toFixed(1) + 'M'
    }));
  };

  const chartData = calculateMonthlyRevenue();

  const navItems: { id: string; label: string; icon: any; badge?: number | string }[] = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'rooms', label: 'Danh sách phòng', icon: HomeIcon },
    { id: 'tenants', label: 'Người thuê', icon: Users },
    { id: 'contracts', label: 'Hợp đồng', icon: FileText },
    { id: 'invoices', label: 'Hóa đơn', icon: Wallet },
    { id: 'risk_alerts', label: 'Cảnh báo', icon: ShieldAlert },
    { id: 'support', label: 'Yêu cầu hỗ trợ', icon: Wrench },
    { id: 'listings', label: 'Bài đăng', icon: ImageIcon },
    { id: 'messages', label: 'Tin nhắn', icon: MessageSquare },
    { id: 'account', label: 'Tài khoản', icon: User },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-x-hidden">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <div className="p-6 flex-1">
            <div className="flex items-center gap-3 text-primary mb-8">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 font-display">Chủ Trọ</h2>
            </div>
            
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                    activeTab === item.id 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
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
                      <LayoutDashboard className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 font-display">Chủ Trọ</h2>
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
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all font-semibold text-sm ${
                        activeTab === item.id 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge ? (
                        <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      ) : null}
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

        {/* Main Content */}
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
              L
            </div>
          </div>

          {activeTab === 'overview' && (
            loading ? (
              <OverviewSkeleton />
            ) : (
              <OverviewTab 
                user={user} 
                roomsData={roomsData} 
                invoicesData={invoicesData} 
                listingsData={listingsData} 
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                chartData={chartData} 
              />
            )
          )}

          {activeTab === 'rooms' && (
            <RoomsTab
              roomsData={roomsData}
              contractsData={contractsData}
              listingsData={listingsData}
              roomFilter={roomFilter}
              setRoomFilter={setRoomFilter}
              openAddRoomModal={openAddRoomModal}
              openEditRoomModal={openEditRoomModal}
              handleDeleteRoom={handleDeleteRoom}
              setSelectedRoom={setSelectedRoom}
              setShowRoomDetailModal={setShowRoomDetailModal}
              loading={loading}
            />
          )}

          {activeTab === 'tenants' && (
            <TenantsTab
              contractsData={contractsData}
              setActiveTab={setActiveTab}
              loading={loading}
            />
          )}

          {activeTab === 'invoices' && (
            loadingInvoices ? <InvoicesSkeleton /> : (
            <InvoicesTab 
              invoicesData={invoicesData} 
              roomsData={roomsData}
              contractsData={contractsData}
              hasRooms={roomsData.length > 0}
              onOpenCreateInvoice={(roomId: string | null = null) => {
                setPreSelectedRoomForInvoice(roomId);
                setShowCreateInvoiceModal(true);
              }}
              onCreateInvoice={handleAddInvoice}
              onUpdateStatus={handleUpdateInvoiceStatus}
              onRefresh={fetchInvoices}
            />
            )
          )}

          {activeTab === 'risk_alerts' && (
            <RiskAlerts onNavigate={onNavigate} hasRooms={roomsData.length > 0} role="landlord" invoicesData={invoicesData} />
          )}

          {activeTab === 'listings' && (
            loadingListings ? <ListingsSkeleton /> : (
            <ListingsTab
              listingsData={listingsData}
              setShowAddListingModal={(v) => {
                if (v) {
                  setEditingListingId(null);
                  setListingForm({ title: '', description: '', price: '', area: '', type: 'Phòng trọ', location: '', street: '', image_url: '', electricity_price: 3500, water_price: 20000, service_fee: 150000, deposit: '' });
                }
                setShowAddListingModal(v);
              }}
              onEditListing={openEditListingModal}
              onDeleteListing={handleDeleteListing}
            />
            )
          )}

          {activeTab === 'contracts' && (
            loadingContracts ? <ContractsSkeleton /> : (
            <ContractsTab 
              contractsData={contractsData} 
              roomsData={roomsData} 
              onRefresh={fetchContracts} 
            />
            )
          )}

          {activeTab === 'support' && (
            loadingSupport ? <SupportSkeleton /> : (
            <SupportTab
              supportRequestsData={supportRequestsData}
              handleUpdateSupportRequest={handleUpdateSupportRequest}
            />
            )
          )}

          {activeTab === 'messages' && (
            <MessagesTab user={user} />
          )}




          {activeTab === 'account' && (
            <AccountTab
              user={user}
              roomsData={roomsData}
              contractsData={contractsData}
              supabase={supabase}
            />
          )}

          {activeTab !== 'overview' && activeTab !== 'rooms' && activeTab !== 'contracts' && activeTab !== 'messages' && activeTab !== 'account' && activeTab !== 'tenants' && activeTab !== 'invoices' && activeTab !== 'listings' && activeTab !== 'support' && activeTab !== 'risk_alerts' && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
                <Construction className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Tính năng đang phát triển</h3>
              <p className="text-slate-500 max-w-xs">Chúng tôi đang nỗ lực hoàn thiện tính năng này. Vui lòng quay lại sau!</p>
            </div>
          )}
        </main>
      </div>

      <CreateInvoiceModal
        show={showCreateInvoiceModal}
        onClose={() => {
          setShowCreateInvoiceModal(false);
          setPreSelectedRoomForInvoice(null);
        }}
        roomsData={roomsData}
        preSelectedRoomId={preSelectedRoomForInvoice}
        onCreate={handleAddInvoice}
        loading={addingInvoice}
      />

      <AddRoomModal 
        show={showAddRoomModal}
        onClose={() => setShowAddRoomModal(false)}
        step={addRoomStep}
        setStep={setAddRoomStep}
        listings={listingsData}
        onSelectListing={selectListingForRoom}
        onSkipToManual={skipToManualEntry}
        form={newRoomForm}
        setForm={setNewRoomForm}
        onSubmit={handleAddRoom}
        loading={addingRoom}
        searchPhone={searchPhone}
        setSearchPhone={setSearchPhone}
        onSearchTenant={searchTenantByPhone}
        searchingTenant={searchingTenant}
        foundTenant={foundTenant}
        searchError={searchError}
      />

      <EditRoomModal
        show={showEditRoomModal}
        onClose={() => setShowEditRoomModal(false)}
        form={editRoomForm}
        setForm={setEditRoomForm}
        onSubmit={handleSaveRoomEdit}
        loading={savingRoomEdit}
      />
      <AddListingModal
        show={showAddListingModal}
        onClose={() => {
          setShowAddListingModal(false);
          setEditingListingId(null);
          setListingForm({ title: '', description: '', price: '', area: '', type: 'Phòng trọ', location: '', street: '', image_url: '', electricity_price: 3500, water_price: 20000, service_fee: 150000, deposit: '' });
        }}
        form={listingForm}
        setForm={setListingForm}
        onSubmit={handleAddListing}
        loading={addingListing}
        isEditing={!!editingListingId}
      />
      <DeleteConfirmModal
        show={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={executeDeleteRoom}
        title="Xóa phòng?"
        itemName={roomToDelete?.title || ""}
        loading={isDeletingRoom}
      />

      <RoomDetailModal
        show={showRoomDetailModal}
        room={selectedRoom}
        onClose={() => setShowRoomDetailModal(false)}
        onEdit={openEditRoomModal}
        onDelete={handleDeleteRoom}
        onNavigateToTab={setActiveTab}
        onCreateListing={(room) => {
          if (!checkListingLimit(false)) return;
          setEditingListingId(null);
          setListingForm(f => ({
            ...f,
            title: `Phòng ${room.title} - ${room.type}`,
            price: (room.price_raw || 0).toString(),
            area: (room.area_raw || 0).toString(),
            type: room.type,
            electricity_price: room.electricity_price || 3500,
            water_price: room.water_price || 20000,
            service_fee: room.service_fee || 150000
          }));
          setShowRoomDetailModal(false);
          setShowAddListingModal(true);
        }}
      />

      <ConfirmModal
        show={!!listingToDelete}
        onClose={() => setListingToDelete(null)}
        onConfirm={executeDeleteListing}
        title="Xóa bài đăng"
        message={`Bạn có chắc muốn xóa bài đăng "${listingToDelete?.title}"? \n\nCác phòng đang liên kết sẽ bị đặt thành trống cục bộ nhưng dữ liệu phòng sẽ không bị xóa vĩnh viễn.`}
        confirmText="Xác nhận xóa"
        type="danger"
      />

      {/* Limit Upgrade Promotion Modal */}
      <AnimatePresence>
        {showLimitUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLimitUpgradeModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] p-8 text-center shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 animate-pulse" />
              
              <button 
                onClick={() => setShowLimitUpgradeModal(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors flex items-center justify-center active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20">
                  <Crown className="w-10 h-10 animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 font-display">Đạt Giới Hạn Đăng Tin!</h3>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed px-2">
                    Tài khoản của bạn đang dùng <span className="text-primary font-black uppercase">{subscriptionTier === 'free' ? 'Gói Miễn Phí' : 'Gói Chuyên Nghiệp'}</span>, chỉ được đăng tối đa <span className="font-bold text-slate-900">{subscriptionTier === 'free' ? '2' : '10'} bài đăng</span>.
                  </p>
                </div>

                <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100/50 text-left space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-orange-600 uppercase tracking-widest">
                    <Sparkles className="w-4 h-4 text-orange-500" /> Đặc quyền gói VIP Pro:
                  </div>
                  <ul className="space-y-2 text-xs font-bold text-slate-600">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Đăng tối đa 10 tin chất lượng cao
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Tặng 5 lượt đẩy tin Top tự động
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Nhãn VIP nổi bật trên trang chủ
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setShowLimitUpgradeModal(false);
                      onNavigate('pricing');
                    }}
                    className="w-full bg-primary text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-primary-hover shadow-xl shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                  >
                    Nâng cấp tài khoản VIP ngay
                    <ArrowRight className="w-4 h-4 ml-1 opacity-50 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <button
                    onClick={() => setShowLimitUpgradeModal(false)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>

  );
};
