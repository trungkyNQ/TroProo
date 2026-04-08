import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart, 
  LogOut, 
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  AlertCircle,
  Trash2,
  Shield,
  UserCheck,
  Edit,
  ShoppingCart
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Page } from '../components/layout/Header';

import { supabase, supabaseUrl, supabaseAnonKey } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { useToast } from '../context/ToastContext';
import { AdminDashboardTab } from '../components/admin/AdminDashboardTab';
import { AdminListingsTab } from '../components/admin/AdminListingsTab';
import { AdminUsersTab } from '../components/admin/AdminUsersTab';
import { AdminReportsTab } from '../components/admin/AdminReportsTab';


interface AdminPageProps {
  user: SupabaseUser | null;
  onLogout: () => void;
  onNavigate: (page: Page) => void;
}

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  role: string;
  avatar_url: string;
}

interface Listing {
  id: string;
  owner_id: string;
  title: string;
  price: number;
  image_url: string;
  type: string;
  location: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  ownerInfo?: Profile;
}

interface Product {
  id: string;
  owner_id: string;
  title: string;
  price: number;
  image_url: string;
  category: string;
  condition: string;
  status: string;
  created_at: string;
  ownerInfo?: Profile;
}

interface Report {
  id: string;
  reporter_id: string;
  target_id: string;
  target_type: 'listing' | 'user';
  reason: string;
  status: 'pending' | 'resolved';
  created_at: string;
  reporterInfo?: Profile;
}

interface OverallStats {
  totalListings: number;
  totalUsers: number;
  totalRevenue: number;
  activeContracts: number;
  totalProducts: number;
}

type AdminView = 'dashboard' | 'listings' | 'users' | 'reports';

export const AdminPage = ({ user, onLogout, onNavigate }: AdminPageProps) => {
  const [currentView, setCurrentView] = useState<AdminView>('listings');
  
  // Listings State
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [listings, setListings] = useState<Listing[]>([]);
  
  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [listingMode, setListingMode] = useState<'room' | 'product'>('room');
  
  // Users State
  const [usersList, setUsersList] = useState<Profile[]>([]);
  const [userFilter, setUserFilter] = useState<'all' | 'landlord' | 'tenant' | 'admin'>('all');

  // Shared State
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Edit Listing State
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [editForm, setEditForm] = useState<{ title: string, price: number, type: string, location: string }>({ title: '', price: 0, type: '', location: '' });

  // Edit User State
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [userEditForm, setUserEditForm] = useState<{ full_name: string, phone: string, role: string }>({ full_name: '', phone: '', role: 'tenant' });
  
  // Edit Product State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productEditForm, setProductEditForm] = useState<{ title: string, price: number, category: string, condition: string }>({ 
    title: '', 
    price: 0, 
    category: '', 
    condition: '' 
  });

  // View User State
  const [viewingUser, setViewingUser] = useState<Profile | null>(null);

  // Create User State
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'tenant'
  });

  // Reports State
  const [reportsList, setReportsList] = useState<Report[]>([]);
  const [reportFilter, setReportFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning'
  });

  // Overall Statistics State
  const [overallStats, setOverallStats] = useState<OverallStats>({
    totalListings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeContracts: 0,
    totalProducts: 0
  });

  const { showToast } = useToast();

  // Navigation & Highlight State
  const [highlightedListingId, setHighlightedListingId] = useState<string | null>(null);

  useEffect(() => {
    if (currentView === 'dashboard') {
      fetchOverallStats();
    } else if (currentView === 'users') {
      fetchUsers();
    } else if (currentView === 'reports') {
      fetchReports();
    }
  }, [currentView]);

  useEffect(() => {
    if (currentView === 'listings') {
      if (listingMode === 'room') fetchListings();
      else fetchProducts();
    }
  }, [currentView, listingMode]);

  // ===================== LISTINGS LOGIC =====================
  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data: listingsData, error: listingsError } = await supabase
        .from('listings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (listingsError) throw listingsError;
      
      if (!listingsData || listingsData.length === 0) {
        setListings([]);
        return;
      }

      const ownerIds = [...new Set(listingsData.map(l => l.owner_id).filter(id => id))];
      let profilesMap = new Map();
      
      if (ownerIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, phone, role, avatar_url')
          .in('id', ownerIds);
          
        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
        } else if (profilesData) {
          profilesData.forEach(p => profilesMap.set(p.id, p));
        }
      }
      
      const mergedListings = listingsData.map(listing => ({
        ...listing,
        ownerInfo: profilesMap.get(listing.owner_id)
      }));

      setListings(mergedListings as Listing[]);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Không thể tải dữ liệu tin đăng.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;
      
      if (!productsData || productsData.length === 0) {
        setProducts([]);
        return;
      }

      const ownerIds = [...new Set(productsData.map(p => p.owner_id).filter(id => id))];
      let profilesMap = new Map();
      
      if (ownerIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, phone, role, avatar_url')
          .in('id', ownerIds);
          
        profilesData?.forEach(p => profilesMap.set(p.id, p));
      }
      
      const mergedProducts = productsData.map(product => ({
        ...product,
        ownerInfo: profilesMap.get(product.owner_id)
      }));

      setProducts(mergedProducts as Product[]);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Không thể tải dữ liệu sản phẩm.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProductStatus = async (id: string, status: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận trạng thái',
      message: `Cập nhật trạng thái sản phẩm thành "${status === 'available' ? 'Có sẵn' : 'Đã bán/Ẩn'}"?`,
      type: 'info',
      onConfirm: async () => {
        try {
          setActionLoading(id);
          const { error } = await supabase
            .from('products')
            .update({ status: status })
            .eq('id', id);

          if (error) throw error;
          
          setProducts(prev => prev.map(p => p.id === id ? { ...p, status: status } : p));
          showToast('Cập nhật trạng thái sản phẩm thành công!', 'success');
        } catch (error: any) {
          showToast(error.message || 'Lỗi cập nhật sản phẩm.', 'error');
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  const handleDeleteProduct = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xóa sản phẩm',
      message: 'Bạn có chắc muốn xóa vĩnh viễn sản phẩm này?',
      type: 'danger',
      onConfirm: async () => {
        try {
          setActionLoading(id);
          const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

          if (error) throw error;
          
          setProducts(prev => prev.filter(p => p.id !== id));
          showToast('Đã xóa sản phẩm thành công!', 'success');
        } catch (error: any) {
          showToast(error.message || 'Lỗi khi xóa sản phẩm.', 'error');
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product);
    setProductEditForm({
      title: product.title || '',
      price: product.price || 0,
      category: product.category || '',
      condition: product.condition || ''
    });
  };

  const handleSaveProductEdit = async () => {
    if (!editingProduct) return;
    try {
      setActionLoading('saving-product');
      const { error } = await supabase
        .from('products')
        .update({ 
          title: productEditForm.title,
          price: productEditForm.price,
          category: productEditForm.category,
          condition: productEditForm.condition
        })
        .eq('id', editingProduct.id);

      if (error) throw error;
      
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productEditForm } : p));
      setEditingProduct(null);
      showToast('Cập nhật sản phẩm thành công!', 'success');
    } catch (error: any) {
      console.error('Error updating product:', error);
      showToast(error.message || 'Lỗi khi lưu chỉnh sửa sản phẩm.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận thay đổi',
      message: `Bạn có chắc muốn ${status === 'approved' ? 'duyệt' : 'từ chối'} tin đăng này?`,
      type: 'warning',
      onConfirm: async () => {
        try {
          setActionLoading(id);
          const { data, error } = await supabase
            .from('listings')
            .update({ approval_status: status })
            .eq('id', id)
            .select();

          if (error) throw error;
          if (!data || data.length === 0) throw new Error("Không có quyền chỉnh sửa ở Database.");
          
          setListings(prev => prev.map(l => l.id === id ? { ...l, approval_status: status } : l));
          showToast(`Đã ${status === 'approved' ? 'duyệt' : 'từ chối'} tin đăng!`, 'success');
        } catch (error: any) {
          showToast(error.message || 'Lỗi cập nhật trạng thái.', 'error');
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  const handleDeleteListing = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xóa tin đăng',
      message: 'Bạn có chắc chắn muốn xóa tin đăng này khỏi hệ thống không?',
      type: 'danger',
      onConfirm: async () => {
        try {
          setActionLoading(id);
          const { data, error } = await supabase
            .from('listings')
            .update({ is_active: false })
            .eq('id', id)
            .select();

          if (error) throw error;
          if (!data || data.length === 0) throw new Error("Lỗi Database: Không thể xóa.");
          
          setListings(prev => prev.filter(l => l.id !== id));
          showToast('Đã xóa bài đăng khỏi hệ thống!', 'success');
        } catch (error: any) {
          showToast(error.message || 'Lỗi khi xóa tin đăng.', 'error');
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  const handleEditClick = (listing: Listing) => {
    setHighlightedListingId(null); // Clear highlight when starting edit
    setEditingListing(listing);
    setEditForm({
      title: listing.title || '',
      price: listing.price || 0,
      type: listing.type || '',
      location: listing.location || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingListing) return;
    try {
      setActionLoading('saving');
      const { data, error } = await supabase
        .from('listings')
        .update({ 
          title: editForm.title,
          price: editForm.price,
          type: editForm.type,
          location: editForm.location
        })
        .eq('id', editingListing.id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) throw new Error("Không có quyền chỉnh sửa ở Database (RLS).");
      
      setListings(prev => prev.map(l => l.id === editingListing.id ? { ...l, ...editForm } : l));
      setEditingListing(null);
      showToast('Cập nhật tin đăng thành công!', 'success');
    } catch (error: any) {
      console.error('Error updating listing:', error);
      showToast(error.message || 'Đã xảy ra lỗi khi lưu chỉnh sửa.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const listingStats = {
    pending: listings.filter(l => l.approval_status === 'pending').length,
    approved: listings.filter(l => l.approval_status === 'approved').length,
    rejected: listings.filter(l => l.approval_status === 'rejected').length,
    totalProducts: products.length,
    availableProducts: products.filter(p => p.status === 'available').length,
    soldProducts: products.filter(p => p.status === 'sold').length
  };

  const currentListings = listings.filter(l => l.approval_status === activeTab);

  // ===================== USERS LOGIC =====================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('role', { ascending: true }); // Group by role roughly
      if (error) throw error;
      setUsersList(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('Không thể tải dữ liệu người dùng.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUserClick = (user: Profile) => {
    setEditingUser(user);
    setUserEditForm({
      full_name: user.full_name || '',
      phone: user.phone || '',
      role: user.role || 'tenant'
    });
  };

  const handleSaveUserEdit = async () => {
    if (!editingUser) return;
    try {
      setActionLoading('saving-user');
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          full_name: userEditForm.full_name,
          phone: userEditForm.phone,
          role: userEditForm.role 
        })
        .eq('id', editingUser.id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) throw new Error("Chặn bởi RLS. Không thể lưu.");
      
      setUsersList(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...userEditForm } : u));
      setEditingUser(null);
      showToast('Cập nhật người dùng thành công!', 'success');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      showToast(error.message || 'Lỗi khi lưu.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xóa hồ sơ người dùng',
      message: 'Bạn có chắc muốn xoá vĩnh viễn hồ sơ người dùng này? Hành động này không thể hoàn tác.',
      type: 'danger',
      onConfirm: async () => {
        try {
          setActionLoading(id);
          const { data, error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', id)
            .select();

          if (error) throw error;
          if (!data || data.length === 0) throw new Error("Không thể xoá. Có thể do ràng buộc dữ liệu hoặc RLS.");
          
          setUsersList(prev => prev.filter(u => u.id !== id));
          showToast('Đã xoá hồ sơ người dùng thành công!', 'success');
        } catch (error: any) {
          showToast(error.message || 'Lỗi khi xoá hồ sơ.', 'error');
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  const userStats = {
    total: usersList.length,
    landlord: usersList.filter(u => u.role === 'landlord').length,
    tenant: usersList.filter(u => u.role === 'tenant').length,
    admin: usersList.filter(u => u.role === 'admin').length,
  };

  const currentUsers = usersList.filter(u => userFilter === 'all' || u.role === userFilter);

  const handleCreateUser = async () => {
    if (!newUserForm.email || !newUserForm.password || !newUserForm.full_name) {
      showToast('Vui lòng điền Email, Mật khẩu và Họ tên.', 'info');
      return;
    }

    try {
      setActionLoading('creating-user');
      
      // 1. Tạo một temp client KHÔNG lưu session để tránh làm Admin bị logout
      const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      });
      
      // 2. Tạo user trong Auth qua temp client
      const { data: authData, error: authError } = await tempClient.auth.signUp({
        email: newUserForm.email,
        password: newUserForm.password,
        options: {
          data: {
            full_name: newUserForm.full_name,
            role: newUserForm.role
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 3. Cập nhật thủ công vào profiles để đảm bảo có số điện thoại (trong trường hợp trigger chưa có)
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            full_name: newUserForm.full_name,
            phone: newUserForm.phone,
            role: newUserForm.role,
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.warn('Profile update warning:', profileError);
        }

        showToast(`Thành công! Đã tạo tài khoản cho ${newUserForm.full_name}.`, 'success');
        setShowCreateUserModal(false);
        setNewUserForm({ email: '', password: '', full_name: '', phone: '', role: 'tenant' });
        fetchUsers();
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      let errorMsg = error.message || 'Lỗi khi tạo người dùng.';
      if (errorMsg === 'User already registered') {
        errorMsg = 'Email này đã được đăng ký tài khoản trên hệ thống. Vui lòng sử dụng email khác.';
      }
      showToast(errorMsg, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // ===================== REPORTS & STATS LOGIC =====================
  const fetchOverallStats = async () => {
    try {
      setLoading(true);
      const [
        { count: listingsCount },
        { count: usersCount },
        { data: revenueData },
        { count: contractsCount },
        { count: productsCount }
      ] = await Promise.all([
        supabase.from('listings').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('invoices').select('amount').eq('status', 'paid'), // Giả định status đã thanh toán
        supabase.from('contracts').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('products').select('*', { count: 'exact', head: true })
      ]) as any[];

      const totalRevenue = revenueData?.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0) || 0;

      setOverallStats({
        totalListings: listingsCount || 0,
        totalUsers: usersCount || 0,
        totalRevenue,
        activeContracts: contractsCount || 0,
        totalProducts: productsCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data: reportsData, error: reportsError } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (reportsError) throw reportsError;

      if (reportsData && reportsData.length > 0) {
        const reporterIds = [...new Set(reportsData.map(r => r.reporter_id).filter(id => id))];
        let profilesMap = new Map();

        if (reporterIds.length > 0) {
          const { data: profilesData } = await supabase.from('profiles').select('id, full_name, avatar_url').in('id', reporterIds);
          profilesData?.forEach(p => profilesMap.set(p.id, p));
        }

        const mergedReports = reportsData.map(r => ({
          ...r,
          reporterInfo: profilesMap.get(r.reporter_id)
        }));
        setReportsList(mergedReports);
      } else {
        setReportsList([]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReportStatus = async (reportId: string, newStatus: 'resolved') => {
    try {
      setActionLoading(reportId);
      const { error } = await supabase.from('reports').update({ status: newStatus }).eq('id', reportId);
      if (error) throw error;
      setReportsList(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
    } catch (error) {
      showToast('Không thể cập nhật trạng thái báo cáo.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xóa báo cáo',
      message: 'Xóa vĩnh viễn báo cáo này khỏi hệ thống?',
      type: 'danger',
      onConfirm: async () => {
        try {
          setActionLoading(reportId);
          const { error } = await supabase.from('reports').delete().eq('id', reportId);
          if (error) throw error;
          setReportsList(prev => prev.filter(r => r.id !== reportId));
          showToast('Đã xóa báo cáo.', 'success');
        } catch (error: any) {
          showToast('Lỗi khi xóa báo cáo.', 'error');
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  const filteredReports = reportsList.filter(r => reportFilter === 'all' || r.status === reportFilter);

  // ===================== HELPERS =====================
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}`;
  };

  // ===================== RENDER =====================
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col sticky top-16 h-[calc(100vh-64px)] overflow-y-auto shrink-0">
          <div className="p-6 flex-1">
            <div className="flex items-center gap-3 text-primary mb-8 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 font-display">Admin Portal</h2>
            </div>
            
            <nav className="space-y-2">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${currentView === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Bảng điều khiển</span>
              </button>
              <button 
                onClick={() => setCurrentView('listings')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-sm ${currentView === 'listings' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  <span>Quản lý tin đăng</span>
                </div>
                {!loading && (
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {listings.length + products.length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setCurrentView('users')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-sm ${currentView === 'users' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <span>Quản lý người dùng</span>
                </div>
                {!loading && (
                   <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {usersList.length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setCurrentView('reports')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${currentView === 'reports' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <BarChart className="w-5 h-5" />
                <span>Báo cáo và phản hồi</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-hidden">
            
            {/* VIEW: QUẢN LÝ TIN ĐĂNG */}
            {currentView === 'listings' && (
            <AdminListingsTab 
              editingListing={editingListing} setEditingListing={setEditingListing}
              editForm={editForm} setEditForm={setEditForm} handleSaveEdit={handleSaveEdit}
              editingProduct={editingProduct} setEditingProduct={setEditingProduct}
              productEditForm={productEditForm} setProductEditForm={setProductEditForm} handleSaveProductEdit={handleSaveProductEdit}
              setHighlightedListingId={setHighlightedListingId} onNavigate={onNavigate} Page={null as any}
              
              listingMode={listingMode} setListingMode={setListingMode}
              activeTab={activeTab} setActiveTab={setActiveTab}
              currentListings={currentListings} products={products}
              loading={loading} actionLoading={actionLoading}
              handleUpdateStatus={handleUpdateStatus} handleEditClick={handleEditClick}
              handleDeleteListing={handleDeleteListing} handleUpdateProductStatus={handleUpdateProductStatus}
              handleEditProductClick={handleEditProductClick} handleDeleteProduct={handleDeleteProduct}
              highlightedListingId={highlightedListingId} getInitials={getInitials} formatDate={formatDate}
              listingStats={listingStats}
            />
          )}

            {/* VIEW: QUẢN LÝ NGƯỜI DÙNG */}
            {currentView === 'users' && (
            <AdminUsersTab 
              editingUser={editingUser} setEditingUser={setEditingUser}
              userEditForm={userEditForm} setUserEditForm={setUserEditForm} handleSaveUserEdit={handleSaveUserEdit}
              showCreateUserModal={showCreateUserModal} 
              newUserForm={newUserForm} setNewUserForm={setNewUserForm} handleCreateUser={handleCreateUser}
              viewingUser={viewingUser}
              
              userFilter={userFilter} setUserFilter={setUserFilter}
              currentUsers={currentUsers} userStats={userStats}
              loading={loading} actionLoading={actionLoading}
              handleEditUserClick={handleEditUserClick} handleDeleteUser={handleDeleteUser}
              setViewingUser={setViewingUser} setShowCreateUserModal={setShowCreateUserModal}
              getInitials={getInitials} formatDate={formatDate}
            />
          )}

            {/* VIEW: BẢNG ĐIỀU KHIỂN (DASHBOARD) */}
            {currentView === 'dashboard' && (
            <AdminDashboardTab setCurrentView={setCurrentView} setListingMode={setListingMode} 
              overallStats={overallStats} 
              loading={loading} 
            />
          )}

            {/* VIEW: BÁO CÁO (REPORTS) */}
            {currentView === 'reports' && (
            <AdminReportsTab 
              reportFilter={reportFilter} setReportFilter={setReportFilter}
              filteredReports={filteredReports} loading={loading} actionLoading={actionLoading}
              handleUpdateReportStatus={handleUpdateReportStatus} handleDeleteReport={handleDeleteReport}
              setHighlightedListingId={setHighlightedListingId} setCurrentView={setCurrentView}
              getInitials={getInitials} formatDate={formatDate}
            />
          )}

            {/* VIEW: OLD FALLBACK */}
            {(currentView !== 'listings' && currentView !== 'users' && currentView !== 'reports' && currentView !== 'dashboard') && (
              <div className="flex flex-col items-center justify-center h-full w-full text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
                <BarChart className="w-16 h-16 mb-4 text-slate-200" />
                <h2 className="text-xl font-bold text-slate-600 mb-2">Tính năng đang phát triển</h2>
                <p>Khu vực này đang được xây dựng.</p>
              </div>
            )}

        </main>
      </div>

      {/* GLOBAL CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden"
          >
            <div className={`p-6 ${confirmModal.type === 'danger' ? 'bg-red-50' : 'bg-orange-50'}`}>
              <div className="flex items-center gap-3 mb-2">
                {confirmModal.type === 'danger' ? (
                  <Trash2 className="w-6 h-6 text-red-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                )}
                <h3 className="text-lg font-bold text-slate-900">{confirmModal.title}</h3>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">{confirmModal.message}</p>
            </div>
            <div className="p-4 bg-white flex justify-end gap-3">
              <button 
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }}
                className={`px-6 py-2 text-sm font-bold text-white rounded-xl shadow-lg transition-transform active:scale-95 ${
                  confirmModal.type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary-hover'
                }`}
              >
                Xác nhận
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
