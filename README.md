# 🏠 Trọ Pro (TroPro) - Nền tảng Quản lý và Cho thuê Phòng trọ tích hợp AI

![TroPro Banner](https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)

## 📋 Giới thiệu dự án
**Trọ Pro** là một giải pháp chuyển đổi số toàn diện cho thị trường cho thuê phòng trọ. Ứng dụng không chỉ kết nối giữa **Chủ trọ** và **Người thuê** mà còn tích hợp các công nghệ hiện đại như **AI (Artificial Intelligence)** để phân tích rủi ro năng lượng (điện, nước), giúp tối ưu hóa chi phí và quản lý hiệu quả.

---

## ✨ Các tính năng nổi bật

### 👤 Xác thực & Vai trò
- Đăng ký/Đăng nhập (Email, Mật khẩu) với **Supabase Auth**.
- Phân quyền người dùng: **Chủ trọ (Landlord)** và **Người thuê (Tenant)**.

### 🔍 Tìm kiếm & Khám phá
- Tìm kiếm phòng trọ theo giá, diện tích và tiện ích.
- **Bản đồ tương tác (Leaflet Maps)** hiển thị vị trí chính xác các phòng trọ.
- Xem chi tiết phòng trọ với hình ảnh và thông tin tiện nghi đầy đủ.

### 🤖 Công nghệ AI Đột phá
- **Phân tích rủi ro điện nước**: Tích hợp **Google Gemini AI** để dự báo và phát hiện bất thường trong việc sử dụng năng lượng.
- **ProBot Chat**: Trợ lý ảo hỗ trợ người dùng 24/7.

### 💰 Thanh toán & Quản lý
- Tích hợp cổng thanh toán trực tuyến (Thử nghiệm với **VNPay**).
- Dashboard quản lý tin đăng cho chủ trọ.
- Trang hỗ trợ và yêu cầu sửa chữa cho người thuê.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

| Lớp | Công nghệ |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS 4, Motion (Animations) |
| **Backend** | Supabase (BaaS), Express (Payment Service) |
| **Database** | PostgreSQL (Supabase) |
| **AI Engine** | Google Gemini API |
| **Bản đồ** | Leaflet / React Leaflet |

---

## 🚀 Hướng dẫn cài đặt & Chạy ứng dụng

### 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản 18.x trở lên.
- **NPM** hoặc **Yarn**.

### 2. Cấu hình biến môi trường
Tạo tệp `.env` trong thư mục gốc và cung cấp các thông tin sau (Tham khảo tệp `.env.example` nếu có):
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 3. Cài đặt thư viện
```bash
npm install
```

### 4. Khởi chạy ứng dụng
Chạy môi trường phát triển (Development):
```bash
npm run dev
```
Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:3000`

---

## 📅 Lộ trình phát triển (Roadmap)
- [x] Tuần 1: Thiết lập nền tảng & Xác thực người dùng.
- [x] Tuần 2: Hệ thống tìm kiếm (Marketplace) & Bản đồ.
- [ ] Tuần 3: Quản lý Chủ trọ & Bảng điều khiển người dùng.
- [ ] Tuần 4: AI Phân tích rủi ro & Hoàn thiện hệ thống.

---

## 📄 Bản quyền & Liên hệ
Dự án được phát triển bởi: **[Tên của bạn]** 
Cố vấn/Giảng viên: **[Tên giáo viên]**
Học viện/Trường: **[Tên trường của bạn]**
