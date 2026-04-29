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
  ShoppingCart,
  ShieldAlert,
  FileSignature
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
import { AdminRiskTab } from '../components/admin/AdminRiskTab';
import { AdminOrdersTab } from '../components/admin/AdminOrdersTab';
import { AdminContractsTab } from '../components/admin/AdminContractsTab';


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
  created_at: string;
  id_card_number?: string;
  id_card_date?: string;
  id_card_place?: string;
  birth_date?: string;
  gender?: string;
  permanent_address?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_name?: string;
  zalo_phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
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
  approval_status: 'pending' | 'approved' | 'rejected';
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

interface OverallStats {
  totalListings: number;
  totalUsers: number;
  totalRevenue: number;
  activeContracts: number;
  totalProducts: number;
}

type AdminView = 'dashboard' | 'listings' | 'users' | 'reports' | 'risks' | 'orders' | 'contracts';

export const AdminPage = ({ user, onLogout, onNavigate }: AdminPageProps) => {
  const getInitialView = (): AdminView => {
    const params = new URLSearchParams(window.location.search);
    const urlView = params.get('view') as AdminView;
    const validViews: AdminView[] = ['dashboard', 'listings', 'users', 'reports', 'risks', 'orders', 'contracts'];
    
    if (urlView && validViews.includes(urlView)) return urlView;
    
    const savedView = localStorage.getItem('last_admin_view') as AdminView;
    if (savedView && validViews.includes(savedView)) return savedView;
    
    return 'dashboard';
  };

  const [currentView, setCurrentView] = useState<AdminView>(getInitialView());
  
  // Listings State
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>(
    (localStorage.getItem('last_admin_active_tab') as any) || 'approved'
  );
  const [listings, setListings] = useState<Listing[]>([]);
  
  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [listingMode, setListingMode] = useState<'room' | 'product'>(
    (localStorage.getItem('last_admin_listing_mode') as any) || 'room'
  );
  
  // Users State
  const [usersList, setUsersList] = useState<Profile[]>([]);
  const [userFilter, setUserFilter] = useState<'all' | 'landlord' | 'tenant' | 'admin'>(
    (localStorage.getItem('last_admin_user_filter') as any) || 'all'
  );

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



  // Reports State
  const [reportsList, setReportsList] = useState<Report[]>([]);
  const [reportFilter, setReportFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  // Risk Alerts State
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);

  // Orders State
  const [ordersList, setOrdersList] = useState<any[]>([]);

  // Contracts State
  const [contractsList, setContractsList] = useState<any[]>([]);

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

  // Persistence Effect
  useEffect(() => {
    localStorage.setItem('last_admin_view', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('last_admin_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('last_admin_listing_mode', listingMode);
  }, [listingMode]);

  useEffect(() => {
    localStorage.setItem('last_admin_user_filter', userFilter);
  }, [userFilter]);

  // Consolidated Initial Load
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchOverallStats(),
          fetchListings(),
          fetchProducts(),
          fetchUsers(),
          fetchReports(),
          fetchRiskAlerts(),
          fetchOrders(),
          fetchContracts()
        ]);
      } catch (error) {
        console.error('Error fetching initial admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAllData();
    }
  }, [user]);

  // Sync tab with URL and LocalStorage
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', currentView);
    window.history.replaceState({}, '', url.toString());
    
    localStorage.setItem('last_admin_view', currentView);
  }, [currentView]);

  // ===================== LISTINGS LOGIC =====================
  const fetchListings = async () => {
    try {
      const { data: listingsData, error: listingsError } = await supabase
        .from('listings')
        .select('*')
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
      console.error('Error fetching listings:', error);
      showToast('Không thể tải dữ liệu tin đăng.', 'error');
    }
  };

  const fetchProducts = async () => {
    try {
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

  const executeListingApproval = async (id: string, status: 'approved' | 'rejected', reason?: string) => {
    try {
      setActionLoading(id);
      const listing = listings.find(l => l.id === id);
      if (!listing) throw new Error("Không tìm thấy tin đăng.");

      const { data, error } = await supabase
        .from('listings')
        .update({ approval_status: status })
        .eq('id', id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) throw new Error("Không có quyền chỉnh sửa ở Database.");
      
      let message = `Tin đăng "${listing.title}" của bạn đã được phê duyệt và hiển thị công khai.`;
      if (status === 'rejected') {
        message = `Rất tiếc, tin đăng "${listing.title}" của bạn không được phê duyệt. Lý do: ${reason || 'Không xác định'}. Vui lòng kiểm tra lại thông tin.`;
      }

      // Gửi thông báo cho chủ trọ
      await supabase.from('notifications').insert({
        sender_id: user?.id,
        receiver_id: listing.owner_id,
        type: status === 'approved' ? 'success' : 'error',
        title: status === 'approved' ? 'Tin đăng đã được duyệt!' : 'Tin đăng bị từ chối',
        message: message,
        related_entity_id: id
      });

      setListings(prev => prev.map(l => l.id === id ? { ...l, approval_status: status } : l));
      showToast(`Đã ${status === 'approved' ? 'duyệt' : 'từ chối'} tin đăng!`, 'success');
    } catch (error: any) {
      showToast(error.message || 'Lỗi cập nhật trạng thái.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected', reason?: string) => {
    if (status === 'approved') {
      setConfirmModal({
        isOpen: true,
        title: 'Xác nhận thay đổi',
        message: `Bạn có chắc muốn duyệt tin đăng này?`,
        type: 'warning',
        onConfirm: async () => {
          await executeListingApproval(id, status);
        }
      });
    } else {
      await executeListingApproval(id, status, reason);
    }
  };

  const executeProductApproval = async (id: string, status: 'approved' | 'rejected', reason?: string) => {
    try {
      setActionLoading(id);
      const product = products.find(p => p.id === id);
      if (!product) throw new Error("Không tìm thấy sản phẩm.");

      const { data, error } = await supabase
        .from('products')
        .update({ approval_status: status })
        .eq('id', id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) throw new Error("Không có quyền chỉnh sửa ở Database (RLS).");
      
      let message = `Sản phẩm "${product.title}" của bạn đã được phê duyệt và hiển thị trên cửa hàng.`;
      if (status === 'rejected') {
        message = `Rất tiếc, sản phẩm "${product.title}" của bạn không được phê duyệt. Lý do: ${reason || 'Không xác định'}. Vui lòng kiểm tra lại hình ảnh và thông tin.`;
      }

      // Gửi thông báo cho người bán
      await supabase.from('notifications').insert({
        sender_id: user?.id,
        receiver_id: product.owner_id,
        type: status === 'approved' ? 'success' : 'error',
        title: status === 'approved' ? 'Sản phẩm đã được duyệt!' : 'Sản phẩm bị từ chối',
        message: message,
        related_entity_id: id
      });

      setProducts(prev => prev.map(p => p.id === id ? { ...p, approval_status: status } : p));
      showToast(`Đã ${status === 'approved' ? 'duyệt' : 'từ chối'} sản phẩm!`, 'success');
    } catch (error: any) {
      showToast(error.message || 'Lỗi cập nhật trạng thái sản phẩm.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleProductApproval = async (id: string, status: 'approved' | 'rejected', reason?: string) => {
    if (status === 'approved') {
      setConfirmModal({
        isOpen: true,
        title: 'Xác nhận phê duyệt sản phẩm',
        message: `Bạn có chắc muốn duyệt sản phẩm này?`,
        type: 'warning',
        onConfirm: async () => {
          await executeProductApproval(id, status);
        }
      });
    } else {
      await executeProductApproval(id, status, reason);
    }
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
            .delete()
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
    soldProducts: products.filter(p => p.status === 'sold').length,
    // Riêng biệt cho tab Bán hàng
    productPending: products.filter(p => p.approval_status === 'pending').length,
    productApproved: products.filter(p => p.approval_status === 'approved').length,
    productRejected: products.filter(p => p.approval_status === 'rejected').length,
  };

  const currentListings = listings.filter(l => l.approval_status === activeTab);
  const currentProducts = products.filter(p => p.approval_status === activeTab);

  // ===================== USERS LOGIC =====================
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('role', { ascending: true }); // Group by role roughly
      if (error) throw error;
      setUsersList(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('Không thể tải dữ liệu người dùng.', 'error');
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
      title: 'XÓA VĨNH VIỄN TÀI KHOẢN',
      message: 'Chú ý: Hành động này sẽ xóa sạch 100% dữ liệu (Phòng, Hợp đồng, Hóa đơn, Tin nhắn) và tài khoản đăng nhập của người dùng này. Hành động này KHÔNG THỂ HOÀN TÁC. Bạn có chắc chắn muốn thực hiện?',
      type: 'danger',
      onConfirm: async () => {
        try {
          setActionLoading(id);
          
          // Sử dụng RPC siêu cấp để xóa dọn dẹp toàn bộ dữ liệu liên quan và cả tài khoản Auth
          const { error } = await supabase.rpc('admin_delete_account_cascade', {
            target_user_id: id
          });

          if (error) throw error;
          
          setUsersList(prev => prev.filter(u => u.id !== id));
          showToast('Đã xóa vĩnh viễn tài khoản người dùng thành công!', 'success');
        } catch (error: any) {
          console.error('Error deleting account:', error);
          showToast(error.message || 'Lỗi nghiêm trọng khi xóa tài khoản.', 'error');
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


  // ===================== REPORTS & STATS LOGIC =====================
  const fetchOverallStats = async () => {
    try {
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
    }
  };

  const fetchReports = async () => {
    try {
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

  const fetchRiskAlerts = async () => {
    try {
      const { data: risksData, error: risksError } = await supabase
        .from('risk_alerts')
        .select('*')
        .order('detected_at', { ascending: false });

      if (risksError) throw risksError;

      if (risksData && risksData.length > 0) {
        const roomIds = [...new Set(risksData.map(r => r.room_id))];
        const { data: roomsData } = await supabase
          .from('rooms')
          .select('id, title')
          .in('id', roomIds);
        
        const roomsMap = new Map();
        roomsData?.forEach(r => roomsMap.set(r.id, r));

        const mergedRisks = risksData.map(r => ({
          ...r,
          roomInfo: roomsMap.get(r.room_id)
        }));
        setRiskAlerts(mergedRisks);
      } else {
        setRiskAlerts([]);
      }
    } catch (error) {
      console.error('Error fetching risk alerts:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      if (ordersData && ordersData.length > 0) {
        const userIds = [...new Set(ordersData.map(o => o.user_id).filter(id => id))];
        let profilesMap = new Map();

        if (userIds.length > 0) {
          const { data: profilesData } = await supabase.from('profiles').select('id, full_name, avatar_url').in('id', userIds);
          profilesData?.forEach(p => profilesMap.set(p.id, p));
        }

        const mergedOrders = ordersData.map(o => ({
          ...o,
          buyerInfo: profilesMap.get(o.user_id)
        }));
        setOrdersList(mergedOrders);
      } else {
        setOrdersList([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleUpdateOrderStatus = async (id: string, action: string) => {
    // Nếu là nhắc nhở
    if (action === 'remind') {
      try {
        setActionLoading(id);
        const order = ordersList.find(o => o.id === id);
        if (!order) throw new Error("Không tìm thấy đơn hàng.");

        const sellerIds = [...new Set(order.items.map((item: any) => item.owner_id).filter((id: string) => id))];
        if (sellerIds.length === 0) {
          showToast('Không xác định được người bán để nhắc nhở.', 'warning');
          return;
        }

        const notifications = sellerIds.map(sellerId => ({
          receiver_id: sellerId,
          type: 'warning',
          title: 'Nhắc nhở xử lý đơn hàng',
          message: `Admin nhắc nhở bạn có đơn hàng #${id.substring(0,8)} đang chờ xác nhận. Vui lòng kiểm tra và xử lý gấp.`,
          action_url: `/landlord/orders`
        }));

        const { error } = await supabase.from('notifications').insert(notifications);
        if (error) throw error;
        showToast(`Đã gửi nhắc nhở tới ${sellerIds.length} người bán!`, 'success');
      } catch (error: any) {
        showToast('Lỗi khi gửi thông báo nhắc nhở.', 'error');
      } finally {
        setActionLoading(null);
      }
      return;
    }

    // Nếu là cập nhật trạng thái trực tiếp
    const validStatuses = ['pending', 'confirmed', 'shipping', 'delivered', 'completed', 'cancelled', 'failed'];
    if (validStatuses.includes(action)) {
      try {
        setActionLoading(id);
        const { error } = await supabase
          .from('orders')
          .update({ status: action })
          .eq('id', id);
        if (error) throw error;
        setOrdersList(prev => prev.map(o => o.id === id ? { ...o, status: action } : o));
        showToast('Cập nhật trạng thái đơn hàng thành công!', 'success');
      } catch (error: any) {
        showToast(error.message || 'Lỗi khi cập nhật trạng thái.', 'error');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleUpdateOrderDetails = async (id: string, details: { phone: string, address: string, status: string }) => {
    try {
      setActionLoading(id);
      const { error } = await supabase
        .from('orders')
        .update({ 
          phone: details.phone, 
          address: details.address, 
          status: details.status 
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setOrdersList(prev => prev.map(o => o.id === id ? { ...o, ...details } : o));
      showToast('Cập nhật thông tin đơn hàng thành công!', 'success');
    } catch (error: any) {
      console.error('Error updating order details:', error);
      showToast(error.message || 'Lỗi khi cập nhật thông tin đơn hàng.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xóa đơn hàng',
      message: 'Bạn có chắc chắn muốn xóa vĩnh viễn dữ liệu đơn hàng này?',
      type: 'danger',
      onConfirm: async () => {
        try {
          setActionLoading(id);
          const { error } = await supabase.from('orders').delete().eq('id', id);
          if (error) throw error;
          setOrdersList(prev => prev.filter(o => o.id !== id));
          showToast('Đã xóa đơn hàng.', 'success');
        } catch (error) {
          showToast('Không thể xóa đơn hàng.', 'error');
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  const handleUpdateContract = async (id: string, form: { start_date: string; end_date: string; monthly_rent: number; deposit: number; status: string }) => {
    try {
      setActionLoading(id);
      const { error } = await supabase.from('contracts').update({
        start_date: form.start_date,
        end_date: form.end_date,
        deposit: form.deposit,
        status: form.status,
      }).eq('id', id);
      if (error) throw error;
      setContractsList(prev => prev.map(c => c.id === id ? { ...c, ...form } : c));
      showToast('Cập nhật hợp đồng thành công!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Lỗi khi cập nhật hợp đồng.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteContract = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xóa hợp đồng',
      message: 'Bạn có chắc chắn muốn xóa vĩnh viễn hợp đồng này? Hành động này không thể hoàn tác.',
      type: 'danger',
      onConfirm: async () => {
        try {
          setActionLoading(id);
          const { error } = await supabase.from('contracts').delete().eq('id', id);
          if (error) throw error;
          setContractsList(prev => prev.filter(c => c.id !== id));
          showToast('Đã xóa hợp đồng.', 'success');
        } catch (error) {
          showToast('Không thể xóa hợp đồng.', 'error');
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  const fetchContracts = async () => {
    try {
      const { data: contractsData, error: contractsError } = await supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (contractsError) throw contractsError;

      if (contractsData && contractsData.length > 0) {
        // Collect all unique IDs to fetch in bulk
        const roomIds = [...new Set(contractsData.map(c => c.room_id).filter(id => id))];
        const userIds = [...new Set([
          ...contractsData.map(c => c.tenant_id),
          ...contractsData.map(c => c.owner_id)
        ].filter(id => id))];

        let roomsMap = new Map();
        let profilesMap = new Map();

        if (roomIds.length > 0) {
          const { data: rooms } = await supabase.from('rooms').select('id, title, price').in('id', roomIds);
          rooms?.forEach(r => roomsMap.set(r.id, r));
        }

        if (userIds.length > 0) {
          const { data: profiles } = await supabase.from('profiles').select('id, full_name, avatar_url, phone').in('id', userIds);
          profiles?.forEach(p => profilesMap.set(p.id, p));
        }

        const mergedContracts = contractsData.map(c => {
          const room = roomsMap.get(c.room_id);
          return {
            ...c,
            roomInfo: room,
            monthly_rent: room?.price || 0, // Dùng price từ bảng rooms
            tenantInfo: profilesMap.get(c.tenant_id),
            landlordInfo: profilesMap.get(c.owner_id)
          };
        });
        setContractsList(mergedContracts);
      } else {
        setContractsList([]);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
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
              <h2 className="text-lg font-bold text-slate-900 font-display">Quản Trị Viên</h2>
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${currentView === 'listings' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <FileText className="w-5 h-5" />
                <span>Quản lý tin đăng</span>
              </button>
              <button 
                onClick={() => setCurrentView('users')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${currentView === 'users' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Users className="w-5 h-5" />
                <span>Quản lý người dùng</span>
              </button>
              <button 
                onClick={() => setCurrentView('reports')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${currentView === 'reports' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <BarChart className="w-5 h-5" />
                <span>Báo cáo và phản hồi</span>
              </button>
              <button 
                onClick={() => setCurrentView('risks')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${currentView === 'risks' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <ShieldAlert className="w-5 h-5" />
                <span>Cảnh báo Rủi ro AI</span>
              </button>
              <button 
                onClick={() => setCurrentView('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${currentView === 'orders' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Quản lý Đơn hàng</span>
              </button>
              <button 
                onClick={() => setCurrentView('contracts')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${currentView === 'contracts' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <FileSignature className="w-5 h-5" />
                <span>Quản lý Hợp đồng</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-hidden">
            
            {/* VIEW: QUẢN LÝ TIN ĐĂNG */}
            {currentView === 'listings' && (
            <AdminListingsTab 
              listingMode={listingMode} setListingMode={setListingMode}
              activeTab={activeTab} setActiveTab={setActiveTab}
              currentListings={currentListings} products={currentProducts}
              loading={loading} actionLoading={actionLoading}
              handleUpdateStatus={handleUpdateStatus} handleEditClick={handleEditClick}
              handleDeleteListing={handleDeleteListing}
              handleUpdateProductStatus={handleUpdateProductStatus}
              handleUpdateProductApproval={handleProductApproval}
              handleEditProductClick={handleEditProductClick}
              handleDeleteProduct={handleDeleteProduct}
              highlightedListingId={highlightedListingId} getInitials={getInitials} formatDate={formatDate}
              listingStats={listingStats}
              editingListing={editingListing} setEditingListing={setEditingListing}
              editForm={editForm} setEditForm={setEditForm} handleSaveEdit={handleSaveEdit}
              editingProduct={editingProduct} setEditingProduct={setEditingProduct}
              productEditForm={productEditForm} setProductEditForm={setProductEditForm} handleSaveProductEdit={handleSaveProductEdit}
              setHighlightedListingId={setHighlightedListingId} onNavigate={onNavigate}
            />
          )}

            {/* VIEW: QUẢN LÝ NGƯỜI DÙNG */}
            {currentView === 'users' && (
            <AdminUsersTab 
              editingUser={editingUser} setEditingUser={setEditingUser}
              userEditForm={userEditForm} setUserEditForm={setUserEditForm} handleSaveUserEdit={handleSaveUserEdit}
              viewingUser={viewingUser}
              userFilter={userFilter} setUserFilter={setUserFilter}
              currentUsers={currentUsers} userStats={userStats}
              loading={loading} actionLoading={actionLoading}
              handleEditUserClick={handleEditUserClick} handleDeleteUser={handleDeleteUser}
              setViewingUser={setViewingUser}
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

            {/* VIEW: CẢNH BÁO RỦI RO AI */}
            {currentView === 'risks' && (
              <AdminRiskTab 
                risks={riskAlerts} 
                loading={loading} 
                onNavigateToRoom={(roomId) => {
                  console.log('Navigate to room:', roomId);
                  showToast('Chức năng xem chi tiết phòng đang được kết nối...', 'info');
                }} 
              />
            )}

            {/* VIEW: QUẢN LÝ ĐƠN HÀNG */}
            {currentView === 'orders' && (
              <AdminOrdersTab 
                orders={ordersList}
                loading={loading}
                actionLoading={actionLoading}
                handleUpdateOrderStatus={handleUpdateOrderStatus}
                handleUpdateOrderDetails={handleUpdateOrderDetails}
                handleDeleteOrder={handleDeleteOrder}
                formatDate={formatDate}
                getInitials={getInitials}
              />
            )}

            {/* VIEW: QUẢN LÝ HỢP ĐỒNG */}
            {currentView === 'contracts' && (
              <AdminContractsTab 
                contracts={contractsList}
                loading={loading}
                actionLoading={actionLoading}
                formatDate={formatDate}
                getInitials={getInitials}
                handleUpdateContract={handleUpdateContract}
                handleDeleteContract={handleDeleteContract}
              />
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
