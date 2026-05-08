import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Clock, Building, Calendar, ShieldCheck, Eye, X, Loader2, Download
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TenantContractsTabProps {
  tenantRooms: any[];
  loadingRooms: boolean;
}

export const TenantContractsTab = ({ tenantRooms, loadingRooms }: TenantContractsTabProps) => {
  const [viewingContract, setViewingContract] = useState<any | null>(null);

  const formatPhone = (phone?: string) => {
    if (!phone) return '...........................................';
    return phone.startsWith('+84') ? '0' + phone.slice(3) : phone;
  };

  const handleViewContract = async (room: any) => {
    setViewingContract({ roomData: room, isLoading: true });
    
    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;

      let owner = null;
      let tenant = null;

      if (room.owner_id) {
        const { data: ownerData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', room.owner_id)
          .single();
        owner = ownerData;
      }

      if (userId) {
        const { data: tenantData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        tenant = tenantData;
      }
        
      setViewingContract({
        roomData: room,
        contractData: {
          id: room.contract_id,
          start_date: room.contract_start,
          end_date: room.contract_end,
          deposit: room.deposit,
          owner: owner,
          tenant: tenant
        },
        isLoading: false
      });
    } catch (err) {
      console.error(err);
      setViewingContract(null);
    }
  };

  const handleDownloadContract = (room: any) => {
    handleViewContract(room);
    // Wait for data to fetch and modal to render
    const checkAndPrint = () => {
      const printContents = document.getElementById('tenant-contract-printable')?.innerHTML;
      const isLoading = document.querySelector('.animate-spin'); // Check if loader is present
      
      if (!printContents || isLoading) {
        setTimeout(checkAndPrint, 100);
        return;
      }

      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      printWindow.document.write(`
        <html>
          <head>
            <title>Hop_Dong_Thue_Phong_${room.title.replace(/\s+/g, '_')}</title>
            <style>
              body { font-family: "Times New Roman", Times, serif; line-height: 1.6; color: #000; padding: 40px; }
              .text-center { text-center: center; text-align: center; }
              .font-bold { font-weight: bold; }
              .font-black { font-weight: 900; }
              .text-3xl { font-size: 24pt; }
              .text-xl { font-size: 18pt; }
              .text-lg { font-size: 14pt; }
              .mb-10 { margin-bottom: 30pt; }
              .mb-8 { margin-bottom: 20pt; }
              .mb-4 { margin-bottom: 12pt; }
              .space-y-8 > * + * { margin-top: 24pt; }
              .space-y-4 > * + * { margin-top: 12pt; }
              .grid { display: flex; justify-content: space-between; }
              .grid-cols-2 > div { width: 45%; }
              .bg-slate-50\\/50 { background: #f8fafc; padding: 15pt; border-radius: 8pt; border: 1pt solid #e2e8f0; margin-bottom: 15pt; }
              .border-b { border-bottom: 1pt solid #e2e8f0; }
              .pb-2 { padding-bottom: 6pt; }
              .mt-12 { margin-top: 40pt; }
              .pt-8 { padding-top: 20pt; }
              .mb-24 { margin-bottom: 80pt; }
              .underline { text-decoration: underline; }
              @media print {
                body { padding: 0; }
              }
            </style>
          </head>
          <body>
            ${printContents}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
    
    checkAndPrint();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-display">Hợp đồng của tôi</h2>
          <p className="text-slate-500 font-medium">Quản lý và xem lại các hợp đồng thuê phòng.</p>
        </div>
      </div>

      {loadingRooms ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : tenantRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-200 px-6">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
            <FileText className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có hợp đồng nào</h3>
          <p className="text-slate-500 max-w-sm">Dữ liệu hợp đồng sẽ xuất hiện sau khi bạn ký hợp đồng với chủ trọ.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {tenantRooms.map((room) => (
            <div key={room.contract_id || room.id} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-1 font-display">Hợp đồng thuê: {room.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-bold text-slate-500">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Bắt đầu: {new Date(room.contract_start).toLocaleDateString('vi-VN')}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Kết thúc: {new Date(room.contract_end).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-stretch justify-between md:justify-center gap-2 min-w-[140px]">
                  <span className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-200 shadow-sm w-full">
                    <ShieldCheck className="w-4 h-4 shrink-0" /> Đã ký điện tử
                  </span>
                  <button 
                    onClick={() => handleViewContract(room)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-md shadow-orange-200 hover:bg-orange-600 transition-all w-full"
                  >
                    <Eye className="w-4 h-4 shrink-0" /> Xem hợp đồng
                  </button>
                  <button 
                    onClick={() => handleDownloadContract(room)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-md shadow-slate-200 hover:bg-slate-900 transition-all w-full"
                  >
                    <Download className="w-4 h-4 shrink-0" /> Tải xuống
                  </button>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Tiền cọc</p>
                  <p className="text-lg font-black text-slate-900">{Number(room.deposit).toLocaleString()}đ</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Giá thuê hàng tháng</p>
                  <p className="text-lg font-black text-slate-900">{Number(room.price).toLocaleString()}đ</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Chủ cho thuê</p>
                  <p className="text-lg font-black text-slate-900">{room.landlord_name}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Ngày ký</p>
                  <p className="text-lg font-black text-slate-900">{new Date(room.contract_start).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Details Modal */}
      <AnimatePresence>
        {viewingContract && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-black text-slate-900 font-display">Chi tiết hợp đồng</h3>
                  <p className="text-sm font-bold text-slate-500">Phòng: {viewingContract.roomData?.title}</p>
                </div>
                <button 
                  onClick={() => setViewingContract(null)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto bg-slate-50 relative">
                {viewingContract.isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm z-10">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : null}

                <div id="tenant-contract-printable" className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 mx-auto max-w-3xl">

                  <div className="text-center mb-10">
                    <h4 className="font-bold text-lg">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
                    <p className="font-bold text-sm underline decoration-slate-400 underline-offset-4 mb-8">Độc lập - Tự do - Hạnh phúc</p>
                    <h2 className="text-3xl font-black mt-8 mb-2 text-slate-900">HỢP ĐỒNG THUÊ PHÒNG TRỌ</h2>
                    <p className="text-slate-500 italic text-sm">Mã hợp đồng: {viewingContract.contractData?.id?.toUpperCase()}</p>
                  </div>
                  
                  <div className="space-y-8 text-slate-800 leading-relaxed text-sm md:text-base">
                    <p className="italic">Hôm nay, ngày {viewingContract.contractData ? new Date(viewingContract.contractData.start_date).getDate() : '...'} tháng {viewingContract.contractData ? new Date(viewingContract.contractData.start_date).getMonth() + 1 : '...'} năm {viewingContract.contractData ? new Date(viewingContract.contractData.start_date).getFullYear() : '...'}, tại địa chỉ phòng trọ, chúng tôi gồm có:</p>
                    
                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                      <h3 className="font-black text-lg mb-4 text-primary flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">A</span>
                        BÊN CHO THUÊ (BÊN A)
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex gap-2"><span className="font-bold min-w-[150px]">Họ và tên:</span> <span>{viewingContract.contractData?.owner?.full_name || '...........................................'}</span></li>
                        <li className="flex gap-2"><span className="font-bold min-w-[150px]">Số CCCD:</span> <span>{viewingContract.contractData?.owner?.id_card_number || '...........................................'}</span></li>
                        <li className="flex gap-2"><span className="font-bold min-w-[150px]">Số điện thoại:</span> <span>{formatPhone(viewingContract.contractData?.owner?.phone)}</span></li>
                        <li className="flex gap-2"><span className="font-bold min-w-[150px]">Địa chỉ thường trú:</span> <span>{viewingContract.contractData?.owner?.permanent_address || '...........................................'}</span></li>
                      </ul>
                    </div>

                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                      <h3 className="font-black text-lg mb-4 text-primary flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">B</span>
                        BÊN THUÊ (BÊN B)
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex gap-2"><span className="font-bold min-w-[150px]">Họ và tên:</span> <span>{viewingContract.contractData?.tenant?.full_name || '...........................................'}</span></li>
                        <li className="flex gap-2"><span className="font-bold min-w-[150px]">Số CCCD:</span> <span>{viewingContract.contractData?.tenant?.id_card_number || '...........................................'}</span></li>
                        <li className="flex gap-2"><span className="font-bold min-w-[150px]">Số điện thoại:</span> <span>{formatPhone(viewingContract.contractData?.tenant?.phone)}</span></li>
                        <li className="flex gap-2"><span className="font-bold min-w-[150px]">Địa chỉ thường trú:</span> <span>{viewingContract.contractData?.tenant?.permanent_address || '...........................................'}</span></li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-black text-lg mb-4 text-slate-900 border-b border-slate-200 pb-2">NỘI DUNG THỎA THUẬN</h3>
                      <div className="space-y-4">
                        <p><strong>Điều 1:</strong> Bên A đồng ý cho Bên B thuê phòng trọ mang tên/số: <span className="font-black text-primary">{viewingContract.roomData?.title}</span>.</p>
                        <p><strong>Điều 2:</strong> Thời gian thuê phòng là từ ngày <strong>{viewingContract.contractData ? new Date(viewingContract.contractData.start_date).toLocaleDateString('vi-VN') : '...'}</strong> đến ngày <strong>{viewingContract.contractData ? new Date(viewingContract.contractData.end_date).toLocaleDateString('vi-VN') : '...'}</strong>.</p>
                        <p><strong>Điều 3:</strong> Tiền đặt cọc: <span className="font-black">{viewingContract.contractData ? Number(viewingContract.contractData.deposit).toLocaleString() + 'đ' : '...'}</span>.</p>
                        <p><strong>Điều 4:</strong> Trách nhiệm của các bên:</p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                          <li>Bên A đảm bảo cung cấp đầy đủ tiện ích cơ bản, hỗ trợ sửa chữa các hư hỏng cơ sở vật chất phát sinh không do lỗi của Bên B.</li>
                          <li>Bên B có trách nhiệm thanh toán tiền thuê phòng đúng hạn, giữ gìn vệ sinh chung, tuân thủ nội quy khu trọ và bảo quản tài sản được giao.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-12 pt-8 text-center border-t border-slate-200">
                      <div>
                        <h4 className="font-black text-slate-900">ĐẠI DIỆN BÊN A</h4>
                        <p className="text-sm text-slate-500 italic mb-24">(Ký và ghi rõ họ tên)</p>
                        <p className="font-bold text-lg">{viewingContract.contractData?.owner?.full_name}</p>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900">ĐẠI DIỆN BÊN B</h4>
                        <p className="text-sm text-slate-500 italic mb-24">(Ký và ghi rõ họ tên)</p>
                        <p className="font-bold text-lg">{viewingContract.contractData?.tenant?.full_name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-100 flex gap-3 justify-end items-center mt-auto bg-white">
                <button 
                  onClick={() => setViewingContract(null)}
                  className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all shadow-lg shadow-slate-200"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
