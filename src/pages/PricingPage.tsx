import React from 'react';
import { motion } from 'motion/react';
import { Check, Zap, Star, Crown, HelpCircle } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface PricingPageProps {
  onNavigate: (page: string, params?: any) => void;
  user: SupabaseUser | null;
  onLogout: () => void;
}

export const PricingPage = ({ onNavigate, user, onLogout }: PricingPageProps) => {
  const plans = [
    {
      name: 'Gói Miễn Phí',
      price: '0',
      description: 'Dành cho cá nhân muốn đăng tin lẻ',
      features: [
        'Đăng tối đa 2 tin/tháng',
        'Hiển thị trong 7 ngày',
        'Ảnh tối đa 5 tấm/tin',
        'Hỗ trợ qua email'
      ],
      buttonText: 'Bắt đầu ngay',
      premium: false
    },
    {
      name: 'Gói Chuyên Nghiệp',
      price: '199.000',
      description: 'Lựa chọn tốt nhất cho chủ trọ vừa và nhỏ',
      features: [
        'Đăng tối đa 10 tin/tháng',
        'Hiển thị trong 30 ngày',
        'Ảnh tối đa 15 tấm/tin',
        '5 lượt đẩy tin/tháng',
        'Hỗ trợ ưu tiên 24/7'
      ],
      buttonText: 'Nâng cấp ngay',
      premium: true,
      popular: true
    },
    {
      name: 'Gói Doanh Nghiệp',
      price: '499.000',
      description: 'Giải pháp toàn diện cho hệ thống căn hộ',
      features: [
        'Không giới hạn số lượng tin',
        'Hiển thị không thời hạn',
        'Ảnh & Video không giới hạn',
        '30 lượt đẩy tin/tháng',
        'Gắn nhãn "Đối tác xác minh"',
        'Quản lý đa cửa hàng'
      ],
      buttonText: 'Liên hệ tư vấn',
      premium: true
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="w-full max-w-7xl mx-auto px-6 py-12 space-y-24 flex-1">
        {/* Header */}
        <section className="text-center space-y-6 pt-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-slate-900 font-display"
          >
            Bảng giá dịch vụ <span className="text-primary">Trọ Pro</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-slate-500 text-xl font-medium"
          >
            Chọn gói dịch vụ phù hợp để tối ưu hóa hiệu quả cho thuê của bạn. Minh bạch, công bằng và hiệu quả.
          </motion.p>
        </section>

        {/* Pricing Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className={`relative bg-white rounded-[40px] p-10 border-2 transition-all hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular ? 'border-primary shadow-xl shadow-primary/5' : 'border-slate-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-6 py-1.5 rounded-full text-sm font-black uppercase tracking-widest">
                  Phổ biến nhất
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 font-display mb-2">{plan.name}</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 font-display">{plan.price}</span>
                  <span className="text-slate-400 font-bold">VNĐ/tháng</span>
                </div>

                <div className="h-px bg-slate-100 w-full"></div>

                <ul className="space-y-4">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex gap-3 text-slate-600 font-medium">
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        plan.premium ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => plan.price === '0' ? onNavigate('manage') : onNavigate('contact')}
                  className={`w-full py-4 rounded-2xl font-black transition-all active:scale-95 uppercase tracking-widest text-sm ${
                    plan.popular 
                    ? 'bg-primary text-white shadow-xl shadow-primary/30 hover:bg-primary-hover' 
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Individual Services */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 font-display">Dịch vụ bổ sung</h2>
            <p className="text-slate-500 font-medium mt-2">Dành cho các tin đăng lẻ cần sự nổi bật</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Đẩy tin (Top)',
                price: '15.000đ/lượt',
                desc: 'Tin của bạn sẽ được đẩy lên vị trí đầu tiên trong danh sách tìm kiếm.',
                icon: Zap,
                color: 'text-amber-500 bg-amber-50'
              },
              {
                title: 'Tin VIP 1',
                price: '150.000đ/tuần',
                desc: 'Hiển thị với khung viền nổi bật và được ưu tiên trên trang chủ.',
                icon: Star,
                color: 'text-primary bg-primary/5'
              },
              {
                title: 'Tin Đặc Biệt',
                price: '500.000đ/tuần',
                desc: 'Hiển thị ở vị trí banner lớn nhất trang chủ và thông báo tới người dùng.',
                icon: Crown,
                color: 'text-blue-600 bg-blue-50'
              }
            ].map((service, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 flex items-start gap-6 hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center shrink-0`}>
                  <service.icon className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-lg">{service.title}</h4>
                  <div className="text-primary font-black">{service.price}</div>
                  <p className="text-sm text-slate-500 font-medium">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto space-y-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-primary font-bold mb-2">
              <HelpCircle className="w-5 h-5" />
              <span>Giải đáp thắc mắc</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 font-display">Câu hỏi thường gặp</h2>
          </div>
          <div className="space-y-6">
            {[
              {
                q: 'Làm sao để thanh toán dịch vụ?',
                a: 'Bạn có thể thanh toán qua chuyển khoản ngân hàng, ví điện tử VNPay hoặc số dư tài khoản Trọ Pro.'
              },
              {
                q: 'Tôi có thể thay đổi gói dịch vụ không?',
                a: 'Có, bạn có thể nâng cấp gói dịch vụ bất kỳ lúc nào. Phần chi phí còn lại của gói cũ sẽ được quy đổi sang gói mới.'
              },
              {
                q: 'Tin đăng VIP có hiệu quả hơn không?',
                a: 'Theo thống kê, tin đăng VIP có lượt xem cao hơn gấp 5-10 lần so với tin đăng thường, giúp bạn chốt khách nhanh hơn.'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-900">{item.q}</h4>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
