import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Upload, Image } from 'lucide-react';
import { supabase } from '../../../lib/supabase';


interface ListingForm {
  title: string;
  description: string;
  price: string;
  area: string;
  type: string;
  location: string;
  street: string;
  image_url: string;
  electricity_price: number;
  water_price: number;
  service_fee: number;
  deposit: string;
  images?: string[];
}

interface AddListingModalProps {
  show: boolean;
  onClose: () => void;
  form: ListingForm;
  setForm: React.Dispatch<React.SetStateAction<ListingForm>>;
  onSubmit: () => void;
  loading: boolean;
  isEditing?: boolean;
}

export const AddListingModal = ({ 
  show, 
  onClose, 
  form, 
  setForm, 
  onSubmit, 
  loading,
  isEditing = false
}: AddListingModalProps) => {
  const [uploading, setUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentImages = form.images || [];
    const remainingSlots = 5 - currentImages.length;
    if (remainingSlots <= 0) {
      alert('Bạn chỉ được tải lên tối đa 5 hình ảnh!');
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      
      for (const file of filesToUpload) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `listing_images/${fileName}`;

        const { data, error } = await supabase.storage
          .from('listings')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('listings')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setForm(f => {
        const newImages = [...(f.images || []), ...uploadedUrls].slice(0, 5);
        return { 
          ...f, 
          images: newImages,
          image_url: newImages[0] || ''
        };
      });
    } catch (err: any) {
      console.error('Error uploading image:', err);
      alert('Đã xảy ra lỗi khi tải ảnh lên: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;

    const currentImages = form.images || [];
    if (currentImages.length >= 5) {
      alert('Bạn chỉ được thêm tối đa 5 hình ảnh!');
      return;
    }

    const newImages = [...currentImages, manualUrl.trim()];
    setForm(f => ({
      ...f,
      images: newImages,
      image_url: newImages[0] || ''
    }));
    setManualUrl('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setForm(f => {
      const newImages = (f.images || []).filter((_, idx) => idx !== indexToRemove);
      return {
        ...f,
        images: newImages,
        image_url: newImages[0] || ''
      };
    });
  };

  const handleSetAsCover = (indexToCover: number) => {
    setForm(f => {
      const currentImages = f.images || [];
      const imageToCover = currentImages[indexToCover];
      const newImages = [imageToCover, ...currentImages.filter((_, idx) => idx !== indexToCover)];
      return {
        ...f,
        images: newImages,
        image_url: newImages[0] || ''
      };
    });
  };


  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 font-display">
                  {isEditing ? 'Chỉnh sửa bài đăng' : 'Tạo bài đăng mới'}
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-1">
                  {isEditing ? 'Cập nhật thông tin quảng cáo cho bài đăng của bạn' : 'Bài đăng chỉ để quảng cáo, không tự tạo phòng quản lý'}
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-rose-50 rounded-xl transition-colors text-slate-400 hover:text-rose-500"><X className="w-5 h-5" /></button>
            </div>

            {/* Content */}
            <div className="px-8 py-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title */}
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tiêu đề bài đăng *</label>
                  <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="VD: Phòng trọ cao cấp trung tâm Hải Châu..." className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none" />
                </div>

                {/* Description */}
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mô tả chi tiết</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Mô tả phòng trọ, tiện ích, vị trí..." rows={4} className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none resize-none" />
                </div>

                {/* Price */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giá thuê (VNĐ/tháng) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="3000000" className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none" />
                </div>

                {/* Area */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Diện tích (m²)</label>
                  <input type="number" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} placeholder="25" className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none" />
                </div>

                {/* Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Loại phòng</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none appearance-none">
                    <option value="Phòng trọ">Phòng trọ</option>
                    <option value="Chung cư mini">Chung cư mini</option>
                    <option value="Căn hộ">Căn hộ</option>
                    <option value="Căn hộ mini">Căn hộ mini</option>
                    <option value="Nhà nguyên căn">Nhà nguyên căn</option>
                  </select>
                </div>

                {/* Deposit */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tiền cọc (VNĐ)</label>
                  <input type="number" value={form.deposit} onChange={e => setForm(f => ({ ...f, deposit: e.target.value }))} placeholder="Bằng tiền thuê nếu bỏ trống" className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none" />
                </div>

                {/* Location */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quận/Huyện</label>
                  <select value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none appearance-none">
                    <option value="">Chọn quận/huyện...</option>
                    <option value="Hải Châu">Hải Châu</option>
                    <option value="Thanh Khê">Thanh Khê</option>
                    <option value="Sơn Trà">Sơn Trà</option>
                    <option value="Ngũ Hành Sơn">Ngũ Hành Sơn</option>
                    <option value="Liên Chiểu">Liên Chiểu</option>
                    <option value="Cẩm Lệ">Cẩm Lệ</option>
                    <option value="Hòa Vang">Hòa Vang</option>
                  </select>
                </div>

                {/* Street */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Địa chỉ đường</label>
                  <input type="text" value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} placeholder="VD: 45 Trần Phú" className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none" />
                </div>

                {/* Image Upload & Multi-image Gallery */}
                <div className="md:col-span-2 flex flex-col gap-3">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hình ảnh căn hộ/phòng trọ (Tối đa 5 ảnh) *</label>
                    <span className="text-[10px] font-bold text-slate-400">
                      {form.images?.length || 0}/5 ảnh
                    </span>
                  </div>

                  {/* Upload area if empty */}
                  {(!form.images || form.images.length === 0) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Device Upload */}
                      <label className="relative flex flex-col items-center justify-center h-44 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-primary cursor-pointer transition-all duration-200 group overflow-hidden">
                        <input 
                          type="file" 
                          multiple
                          accept="image/*" 
                          onChange={handleFileUpload} 
                          disabled={uploading}
                          className="hidden" 
                        />
                        {uploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs font-bold text-slate-500">Đang tải ảnh lên...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform duration-200">
                              <Upload className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-black text-slate-700">Chọn ảnh từ thiết bị</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1">Chọn một hoặc nhiều ảnh (tối đa 5)</p>
                          </div>
                        )}
                      </label>

                      {/* Manual Link Input */}
                      <div className="flex flex-col gap-3 justify-center p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          <Image className="w-3.5 h-3.5 text-slate-400" />
                          <span>Dán URL ảnh</span>
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="url" 
                            value={manualUrl}
                            onChange={e => setManualUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/..." 
                            className="flex-1 rounded-xl border border-slate-200 bg-white font-semibold text-xs text-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/10 p-3 transition-all outline-none" 
                          />
                          <button
                            type="button"
                            onClick={handleAddManualUrl}
                            className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                          >
                            Thêm
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {/* Image Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {form.images.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm group">
                            <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            
                            {/* Cover Badge */}
                            {idx === 0 && (
                              <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary/90 text-white rounded-md text-[8px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                                <span>⭐ Ảnh chính</span>
                              </div>
                            )}

                            {/* Hover Overlay with Delete & Make Cover actions */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2">
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  className="p-1.5 bg-rose-600 hover:bg-rose-700 rounded-lg text-white transition-colors shadow-lg"
                                  title="Xóa ảnh"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleSetAsCover(idx)}
                                  className="w-full py-1 bg-white/95 hover:bg-white text-slate-800 font-bold text-[9px] rounded-lg transition-colors shadow-sm active:scale-95"
                                >
                                  Đặt làm ảnh chính
                                </button>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* Additional Slots placeholder/trigger */}
                        {form.images.length < 5 && (
                          <label className="relative aspect-square flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-primary cursor-pointer transition-all duration-200 group">
                            <input 
                              type="file" 
                              multiple
                              accept="image/*" 
                              onChange={handleFileUpload} 
                              disabled={uploading}
                              className="hidden" 
                            />
                            {uploading ? (
                              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Upload className="w-5 h-5 text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all duration-200" />
                                <span className="text-[9px] font-black text-slate-500 mt-1">Thêm ảnh</span>
                              </>
                            )}
                          </label>
                        )}
                      </div>

                      {/* Manual url entry when there are already images */}
                      {form.images.length < 5 && (
                        <div className="flex gap-2 items-center p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                          <input 
                            type="url" 
                            value={manualUrl}
                            onChange={e => setManualUrl(e.target.value)}
                            placeholder="Thêm link ảnh trực tiếp..." 
                            className="flex-1 rounded-xl border border-slate-200 bg-white font-semibold text-xs text-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/10 p-2.5 transition-all outline-none" 
                          />
                          <button
                            type="button"
                            onClick={handleAddManualUrl}
                            className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 whitespace-nowrap"
                          >
                            Thêm Link
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>



                {/* Utilities */}
                <div className="md:col-span-2 pt-4 border-t border-slate-100 mt-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-primary" />
                    <h4 className="font-black text-slate-900">Chi phí phụ</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giá điện (đ/kwh)</label>
                      <input type="number" value={form.electricity_price} onChange={e => setForm(f => ({ ...f, electricity_price: Number(e.target.value) }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giá nước (đ/khối)</label>
                      <input type="number" value={form.water_price} onChange={e => setForm(f => ({ ...f, water_price: Number(e.target.value) }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phí dịch vụ (đ/tháng)</label>
                      <input type="number" value={form.service_fee} onChange={e => setForm(f => ({ ...f, service_fee: Number(e.target.value) }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-4">
              <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all bg-slate-200 text-slate-500 hover:bg-slate-300">Hủy</button>
              <button onClick={onSubmit} disabled={loading || !form.title || !form.price} className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-white hover:bg-primary-hover shadow-lg shadow-orange-100 flex justify-center items-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (isEditing ? 'Lưu thay đổi' : 'Đăng bài')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
