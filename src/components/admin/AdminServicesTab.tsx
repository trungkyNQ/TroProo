import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Crown, 
  Edit, 
  Check, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Loader2, 
  Settings, 
  Layers, 
  ArrowRight,
  TrendingUp,
  Tag,
  DollarSign
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';

interface ServicePlan {
  id: string;
  name: string;
  price: string;
  numerical_price: number;
  description: string;
  features: string[];
  button_text: string;
  premium: boolean;
  popular: boolean;
}

export const AdminServicesTab = () => {
  const { showToast } = useToast();
  const [plans, setPlans] = useState<ServicePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Edit Form State
  const [editingPlan, setEditingPlan] = useState<ServicePlan | null>(null);
  const [form, setForm] = useState<{
    name: string;
    price: string;
    numerical_price: number;
    description: string;
    featuresText: string;
    button_text: string;
    premium: boolean;
    popular: boolean;
  }>({
    name: '',
    price: '',
    numerical_price: 0,
    description: '',
    featuresText: '',
    button_text: '',
    premium: false,
    popular: false
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_services')
        .select('*')
        .order('numerical_price', { ascending: true });
      
      if (error) throw error;
      setPlans(data || []);
    } catch (err: any) {
      console.error('Error fetching services:', err);
      showToast('Không thể tải danh sách gói dịch vụ!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (plan: ServicePlan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      price: plan.price,
      numerical_price: plan.numerical_price,
      description: plan.description || '',
      featuresText: plan.features.join('\n'),
      button_text: plan.button_text,
      premium: plan.premium,
      popular: plan.popular
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    try {
      setActionLoading(editingPlan.id);
      
      // Parse features line by line, filter out empty lines
      const parsedFeatures = form.featuresText
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const updatedPlan = {
        name: form.name,
        price: form.price,
        numerical_price: Number(form.numerical_price),
        description: form.description,
        features: parsedFeatures,
        button_text: form.button_text,
        premium: form.premium,
        popular: form.popular
      };

      const { error } = await supabase
        .from('system_services')
        .update(updatedPlan)
        .eq('id', editingPlan.id);

      if (error) throw error;

      showToast(`Cập nhật ${form.name} thành công! Bảng giá đã được đồng bộ.`, 'success');
      setEditingPlan(null);
      fetchPlans();
    } catch (err: any) {
      console.error('Error updating service:', err);
      showToast(err.message || 'Lỗi khi cập nhật gói dịch vụ!', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Top Banner and Overview Stats */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-8 rounded-[40px] text-white shadow-xl shadow-slate-950/15 overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl"></div>
        <div className="space-y-2 relative z-10 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-current" /> Gói Dịch Vụ VIP
          </div>
          <h1 className="text-3xl font-black tracking-tight font-display">Cấu Hình Gói Dịch Vụ</h1>
          <p className="text-slate-400 text-xs font-semibold max-w-lg leading-relaxed">
            Thiết lập bảng giá, tính năng, và các hạn mức đặc quyền hiển thị trên trang bảng giá dịch vụ Trọ Pro. Mọi thay đổi sẽ cập nhật trực tiếp theo thời gian thực.
          </p>
        </div>
        <div className="flex gap-4 shrink-0 relative z-10 w-full md:w-auto">
          <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-3xl border border-white/10 flex-1 md:flex-none text-left">
            <div className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Số Gói Hiện Có</div>
            <div className="text-2xl font-black text-white mt-1">{loading ? '...' : plans.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-3xl border border-white/10 flex-1 md:flex-none text-left">
            <div className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Gói Hot Nhất</div>
            <div className="text-2xl font-black text-amber-300 mt-1 flex items-center gap-1.5">
              <Crown className="w-6 h-6 fill-current" />
              {loading ? '...' : (plans.find(p => p.popular)?.name.split(' ')[1] || 'Pro')}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm flex flex-col justify-between space-y-8 min-h-[480px]">
              <div className="space-y-6 text-left">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1 pr-4">
                    <div className="h-6 w-3/4 rounded-xl bg-slate-100"></div>
                    <div className="h-4 w-5/6 rounded-lg bg-slate-100"></div>
                  </div>
                  <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl"></div>
                </div>

                {/* Price tag placeholder */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                  <div className="h-3 w-1/3 rounded-md bg-slate-200"></div>
                  <div className="h-6 w-1/4 rounded-lg bg-slate-200"></div>
                </div>

                <div className="h-px bg-slate-100 w-full"></div>

                {/* Feature List Preview placeholder */}
                <div className="space-y-3">
                  <div className="h-3.5 w-1/2 rounded bg-slate-100"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((f) => (
                      <div key={f} className="flex gap-2.5 items-center">
                        <div className="w-4 h-4 rounded-full bg-slate-100 shrink-0"></div>
                        <div className="h-3.5 w-2/3 rounded bg-slate-100"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer action button placeholder */}
              <div className="mt-8 border-t border-slate-100 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-1/4 rounded bg-slate-100"></div>
                  <div className="h-5 w-1/5 rounded bg-slate-100"></div>
                </div>
                <div className="h-12 w-full rounded-2xl bg-slate-100"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-white rounded-[40px] border-2 p-8 shadow-sm flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative ${
                plan.popular ? 'border-primary' : 'border-slate-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md">
                  Phổ biến nhất
                </div>
              )}
              {plan.id === 'enterprise' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md flex items-center gap-1">
                  <Crown className="w-3 h-3 fill-current" /> ĐỐI TÁC VIP
                </div>
              )}

              <div className="space-y-6 text-left">
                {/* Plan Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 font-display">{plan.name}</h3>
                    <p className="text-slate-400 text-xs font-semibold mt-1">{plan.description}</p>
                  </div>
                  <button 
                    onClick={() => handleEditClick(plan)}
                    className="w-10 h-10 bg-slate-50 hover:bg-primary/10 text-slate-400 hover:text-primary border border-slate-100 rounded-xl flex items-center justify-center transition-all cursor-pointer hover:border-primary/20 active:scale-90"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>

                {/* Price tag */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-baseline">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Mức giá niêm yết</span>
                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900 font-display">
                      {plan.numerical_price === 0 ? '0' : plan.numerical_price.toLocaleString('vi-VN')}
                    </span>
                    <span className="text-slate-400 text-[10px] font-black ml-0.5">VNĐ / tháng</span>
                  </div>
                </div>

                <div className="h-px bg-slate-100 w-full"></div>

                {/* Feature List Preview */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Đặc quyền đi kèm ({plan.features.length})</p>
                  <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex gap-2.5 text-slate-600 font-medium text-xs leading-relaxed">
                        <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Save Footer Button preview */}
              <div className="mt-8 border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-4">
                  <span>Trạng thái:</span>
                  <div className="flex gap-2">
                    {plan.premium ? (
                      <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-wider border border-indigo-100/50">Trả phí VIP</span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-wider">Miễn phí</span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => handleEditClick(plan)}
                  className="w-full py-3 bg-slate-900 hover:bg-primary text-white hover:shadow-lg hover:shadow-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-98 flex items-center justify-center gap-1.5"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Cấu hình chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Service Modal */}
      <AnimatePresence>
        {editingPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingPlan(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] p-8 md:p-10 shadow-2xl border border-slate-100 overflow-hidden text-left"
            >
              {/* Premium Top Glow */}
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
              
              <button 
                onClick={() => setEditingPlan(null)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors flex items-center justify-center active:scale-90"
              >
                <XCircle className="w-5 h-5 text-slate-400" />
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-inner">
                    <Crown className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 font-display">Chỉnh Sửa Gói Dịch Vụ</h3>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">
                      Thay đổi cấu hình kỹ thuật của gói {editingPlan.name}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Plan name */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" /> Tên hiển thị gói
                      </label>
                      <input 
                        type="text" 
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-bold text-slate-800"
                        placeholder="Ví dụ: Gói Chuyên Nghiệp"
                      />
                    </div>

                    {/* Button text */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <ArrowRight className="w-3.5 h-3.5" /> Chữ hiển thị nút
                      </label>
                      <input 
                        type="text" 
                        required
                        value={form.button_text}
                        onChange={(e) => setForm({ ...form, button_text: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-bold text-slate-800"
                        placeholder="Ví dụ: Nâng cấp ngay"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Display Price */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" /> Mức giá hiển thị (định dạng dấu chấm)
                      </label>
                      <input 
                        type="text" 
                        required
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-bold text-slate-800"
                        placeholder="Ví dụ: 199.000"
                      />
                    </div>

                    {/* Numerical Price */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> Số tiền thực tế (thanh toán VNPay)
                      </label>
                      <input 
                        type="number" 
                        required
                        min="0"
                        value={form.numerical_price}
                        onChange={(e) => setForm({ ...form, numerical_price: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-bold text-slate-800"
                        placeholder="Ví dụ: 199000"
                      />
                    </div>
                  </div>

                  {/* Plan description */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Mô tả ngắn
                    </label>
                    <input 
                      type="text" 
                      required
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-bold text-slate-800"
                      placeholder="Mô tả tóm tắt lợi thế gói..."
                    />
                  </div>

                  {/* Feature Lists line-by-line */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Đặc quyền đi kèm (Mỗi dòng một đặc quyền)
                    </label>
                    <textarea 
                      rows={5}
                      required
                      value={form.featuresText}
                      onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-bold text-slate-800 leading-relaxed font-sans"
                      placeholder="Đăng tối đa 10 tin/tháng&#10;Hiển thị trong 30 ngày&#10;Hỗ trợ ưu tiên 24/7"
                    />
                  </div>

                  {/* Toggles */}
                  <div className="flex flex-col sm:flex-row gap-6 p-4 bg-slate-50 border border-slate-100 rounded-3xl">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none flex-1">
                      <input 
                        type="checkbox"
                        checked={form.premium}
                        onChange={(e) => setForm({ ...form, premium: e.target.checked })}
                        className="w-4.5 h-4.5 accent-primary rounded cursor-pointer"
                      />
                      <div className="text-left leading-tight">
                        <div className="text-xs font-black text-slate-800">Gói trả phí VIP</div>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5">Yêu cầu giao dịch thanh toán để kích hoạt</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none flex-1">
                      <input 
                        type="checkbox"
                        checked={form.popular}
                        onChange={(e) => setForm({ ...form, popular: e.target.checked })}
                        className="w-4.5 h-4.5 accent-primary rounded cursor-pointer"
                      />
                      <div className="text-left leading-tight">
                        <div className="text-xs font-black text-slate-800">Gói Phổ Biến Nhất</div>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5">Gắn huy hiệu nổi bật ở giữa trang chủ</div>
                      </div>
                    </label>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingPlan(null)}
                      disabled={actionLoading !== null}
                      className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-colors cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading !== null}
                      className="w-2/3 bg-primary text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-primary-hover shadow-xl shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {actionLoading === editingPlan.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Đang lưu lại...
                        </>
                      ) : (
                        <>
                          Lưu & Đồng bộ Bảng giá
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
