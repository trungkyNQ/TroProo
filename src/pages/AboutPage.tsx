import React from 'react';
import { motion } from 'motion/react';
import { Target, Users, ShieldCheck, Rocket, ChevronRight } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AboutPageProps {
  onNavigate: (page: string, params?: any) => void;
  user: SupabaseUser | null;
  onLogout: () => void;
}

export const AboutPage = ({ onNavigate, user, onLogout }: AboutPageProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="w-full max-w-7xl mx-auto px-6 py-12 space-y-24 flex-1">
        {/* Hero Section */}
        <section className="text-center space-y-6 pt-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-wider uppercase mb-2"
          >
            Câu chuyện của chúng tôi
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 font-display"
          >
            Nâng tầm trải nghiệm <br /> 
            <span className="text-primary">Tìm kiếm không gian sống</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl mx-auto text-slate-500 text-xl leading-relaxed font-medium"
          >
            Trọ Pro ra đời với sứ mệnh kết nối người đi thuê và chủ trọ thông qua nền tảng công nghệ minh bạch, an toàn và hiệu quả nhất tại Việt Nam.
          </motion.p>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Người dùng', value: '50,000+' },
            { label: 'Tin đăng mỗi ngày', value: '1,200+' },
            { label: 'Thành phố', value: '63' },
            { label: 'Tỷ lệ hài lòng', value: '98%' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-sm"
            >
              <div className="text-3xl font-black text-primary font-display">{stat.value}</div>
              <div className="text-slate-500 font-bold mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </section>

        {/* Vision & Mission */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900 font-display">Tầm nhìn & Sứ mệnh</h2>
              <p className="text-slate-500 text-lg leading-relaxed font-medium">
                Chúng tôi không chỉ là một trang web đăng tin. Trọ Pro hướng tới việc xây dựng một hệ sinh thái bất động sản cho thuê, nơi mà mọi rào cản về khoảng cách và niềm tin được xóa bỏ nhờ dữ liệu thực và công nghệ AI.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Mục tiêu chiến lược</h4>
                  <p className="text-slate-500 font-medium">Trở thành nền tảng số 1 về cho thuê phòng trọ và căn hộ dịch vụ tại Việt Nam vào năm 2027.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Rocket className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Đổi mới không ngừng</h4>
                  <p className="text-slate-500 font-medium">Luôn cập nhật những xu hướng công nghệ mới nhất để tối ưu hóa hành trình tìm nhà của khách hàng.</p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white"
          >
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" 
              alt="Team work"
              className="w-full h-[400px] object-cover"
            />
          </motion.div>
        </section>

        {/* Core Values */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black text-slate-900 font-display">Giá trị cốt lõi</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">Những nguyên tắc định hình cách chúng tôi phục vụ cộng đồng.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Minh bạch',
                desc: 'Mọi thông tin về giá cả, hình ảnh và tình trạng phòng đều được xác thực nghiêm ngặt.',
                icon: ShieldCheck
              },
              {
                title: 'Tận tâm',
                desc: 'Đội ngũ hỗ trợ 24/7 luôn sẵn sàng giải quyết mọi thắc mắc của người dùng.',
                icon: Users
              },
              {
                title: 'An toàn',
                desc: 'Bảo mật thông tin cá nhân và giao dịch là ưu tiên hàng đầu của Trọ Pro.',
                icon: ShieldCheck
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="bg-white p-10 rounded-3xl border border-slate-200 hover:shadow-xl hover:-translate-y-2 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 font-display">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary rounded-[40px] p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <h2 className="text-3xl md:text-4xl font-black text-white font-display relative z-10">Sẵn sàng tìm kiếm ngôi nhà mơ ước?</h2>
          <p className="text-white/80 max-w-2xl mx-auto text-lg font-medium relative z-10">
            Hàng ngàn phòng trọ chất lượng đang chờ đón bạn. Bắt đầu ngay hôm nay!
          </p>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <button 
              onClick={() => onNavigate('search')}
              className="px-8 py-4 bg-white text-primary font-black rounded-2xl hover:shadow-xl active:scale-95 transition-all flex items-center gap-2"
            >
              Khám phá ngay <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onNavigate('register')}
              className="px-8 py-4 bg-primary-hover text-white font-black rounded-2xl border border-white/20 hover:bg-white/10 transition-all"
            >
              Đăng ký tài khoản
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
