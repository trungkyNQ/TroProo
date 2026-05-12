import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, UserPlus, Phone, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../../context/ToastContext';

interface AddRoommateModalProps {
  show: boolean;
  onClose: () => void;
  room: {
    id: string;
    title: string;
    owner_id: string;
    contract_end: string;
    contract_start: string;
  };
  user: any;
  onSuccess: () => void;
}

export const AddRoommateModal = ({ show, onClose, room, user, onSuccess }: AddRoommateModalProps) => {
  const { showToast } = useToast();
  const [searchPhone, setSearchPhone] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [foundUser, setFoundUser] = useState<any>(null);
  const [adding, setAdding] = useState(false);

  const resetState = () => {
    setSearchPhone('');
    setSearching(false);
    setSearchError('');
    setFoundUser(null);
    setAdding(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSearch = async () => {
    const raw = searchPhone.trim();
    if (!raw) return;

    setSearching(true);
    setSearchError('');
    setFoundUser(null);

    try {
      // Normalize phone: 0xxx → +84xxx
      let normalized = raw;
      if (normalized.startsWith('0')) {
        normalized = '+84' + normalized.slice(1);
      }

      // Search by normalized phone first
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone, avatar_url, role')
        .eq('phone', normalized)
        .single();

      // Fallback: try original input
      if ((error || !profile) && normalized !== raw) {
        const fallback = await supabase
          .from('profiles')
          .select('id, full_name, phone, avatar_url, role')
          .eq('phone', raw)
          .single();
        profile = fallback.data;
        error = fallback.error;
      }

      if (error || !profile) {
        setSearchError('Không tìm thấy người dùng với SĐT này. Bạn của bạn cần đăng ký tài khoản TroPro trước.');
        return;
      }

      // Check: cannot add yourself
      if (profile.id === user?.id) {
        setSearchError('Không thể thêm chính mình vào phòng.');
        return;
      }

      // Check: already has active/pending contract in this room
      const { data: existingContract } = await supabase
        .from('contracts')
        .select('id, status')
        .eq('tenant_id', profile.id)
        .eq('room_id', room.id)
        .in('status', ['active', 'pending']);

      if (existingContract && existingContract.length > 0) {
        const status = existingContract[0].status;
        setSearchError(
          status === 'active'
            ? 'Người này đã đang thuê trong phòng này rồi.'
            : 'Người này đã có lời mời chờ xác nhận cho phòng này.'
        );
        return;
      }

      setFoundUser(profile);
    } catch (err) {
      console.error('Error searching roommate:', err);
      setSearchError('Đã có lỗi xảy ra khi tìm kiếm.');
    } finally {
      setSearching(false);
    }
  };

  const handleAddRoommate = async () => {
    if (!foundUser || !user || !room) return;
    setAdding(true);

    try {
      // 1. Call RPC to create contract (bypasses RLS safely)
      const { data: newContractId, error: rpcError } = await supabase.rpc('add_roommate', {
        p_room_id: room.id,
        p_friend_id: foundUser.id
      });

      if (rpcError) throw rpcError;

      // 2. Send notification to the friend
      await supabase.from('notifications').insert({
        sender_id: user.id,
        receiver_id: foundUser.id,
        type: 'contract_invite',
        title: 'Lời mời ở cùng phòng',
        message: `Bạn được mời vào phòng "${room.title}". Vui lòng vào mục Tổng quan để xác nhận hợp đồng.`,
        related_entity_id: newContractId || null,
        action_url: 'tenant?tab=overview'
      });

      // 3. Send notification to the landlord
      const { data: myProfile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      await supabase.from('notifications').insert({
        sender_id: user.id,
        receiver_id: room.owner_id,
        type: 'roommate_added',
        title: 'Người thuê thêm bạn cùng phòng',
        message: `${myProfile?.full_name || 'Người thuê'} đã mời "${foundUser.full_name}" vào phòng "${room.title}". Hợp đồng đang chờ xác nhận.`,
        related_entity_id: newContractId || null,
        action_url: 'manage?tab=tenants'
      });

      showToast(`Đã gửi lời mời đến ${foundUser.full_name}!`, 'success');
      handleClose();
      onSuccess();
    } catch (err: any) {
      console.error('Error adding roommate:', err);
      showToast('Không thể thêm bạn cùng phòng: ' + (err.message || 'Lỗi không xác định'), 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-primary" />
                  Thêm bạn cùng phòng
                </h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {room.title}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Search input */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                  Số điện thoại của bạn cùng phòng
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="VD: 0987654321"
                      value={searchPhone}
                      onChange={e => {
                        setSearchPhone(e.target.value);
                        setSearchError('');
                        setFoundUser(null);
                      }}
                      onKeyDown={handleKeyDown}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold text-slate-700 placeholder:font-medium placeholder:text-slate-300"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={searching || !searchPhone.trim()}
                    className="px-5 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {searching ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    Tìm
                  </button>
                </div>
              </div>

              {/* Error message */}
              {searchError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-red-700">{searchError}</p>
                </motion.div>
              )}

              {/* Found user card */}
              {foundUser && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-green-200 bg-green-50/50 rounded-2xl p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-xs font-black text-green-700 uppercase tracking-widest">Đã tìm thấy</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={foundUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(foundUser.full_name || 'U')}&background=FF8A00&color=fff`}
                      alt={foundUser.full_name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <p className="font-black text-slate-900 text-lg">{foundUser.full_name || 'Người dùng'}</p>
                      <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        {foundUser.phone}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 font-medium mt-3 pt-3 border-t border-green-100">
                    Người này sẽ nhận được lời mời và cần xác nhận trước khi được thêm vào phòng.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleAddRoommate}
                disabled={!foundUser || adding}
                className="flex-1 py-3 rounded-xl bg-primary text-white font-black text-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-100"
              >
                {adding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang thêm...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Thêm vào phòng
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
