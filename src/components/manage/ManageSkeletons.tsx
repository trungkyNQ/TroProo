/**
 * Shared skeleton components for the Manage (landlord) page.
 * Uses react-loading-skeleton for consistent shimmer effects.
 */
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Theme wrapper
const ManageSkeletonTheme = ({ children }: { children: React.ReactNode }) => (
  <SkeletonTheme baseColor="#f1f5f9" highlightColor="#e2e8f0" borderRadius={12} duration={1.4}>
    {children}
  </SkeletonTheme>
);

// ──────────────────────────────────────────────
// Overview Tab skeleton
// ──────────────────────────────────────────────
export const OverviewSkeleton = () => (
  <ManageSkeletonTheme>
    <div className="space-y-8">
      {/* Heading */}
      <div className="space-y-2">
        <Skeleton width={280} height={36} />
        <Skeleton width={360} height={18} />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <Skeleton width={44} height={44} borderRadius={12} />
              <Skeleton width={60} height={24} borderRadius={8} />
            </div>
            <Skeleton width="60%" height={14} />
            <Skeleton width="40%" height={32} />
          </div>
        ))}
      </div>

      {/* Chart + listings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between mb-10">
            <Skeleton width={200} height={24} />
            <Skeleton width={100} height={36} borderRadius={12} />
          </div>
          <div className="flex items-end gap-2 h-[300px]">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton
                key={i}
                width="100%"
                height={`${Math.random() * 60 + 20}%`}
                borderRadius={8}
                style={{ alignSelf: 'flex-end' }}
              />
            ))}
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <Skeleton width={160} height={24} />
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4">
              <Skeleton width={64} height={64} borderRadius={12} />
              <div className="flex-1 space-y-2">
                <Skeleton height={16} width="80%" />
                <Skeleton height={14} width="50%" />
                <Skeleton height={20} width={80} borderRadius={999} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <Skeleton width={160} height={24} className="mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} height={100} borderRadius={16} />
          ))}
        </div>
      </div>
    </div>
  </ManageSkeletonTheme>
);

// ──────────────────────────────────────────────
// Rooms Tab skeleton
// ──────────────────────────────────────────────
export const RoomsSkeleton = () => (
  <ManageSkeletonTheme>
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <Skeleton width={240} height={32} />
          <Skeleton width={320} height={18} />
        </div>
        <Skeleton width={140} height={44} borderRadius={12} />
      </div>
      {/* Filter pills */}
      <div className="flex gap-2">
        {[80, 60, 100, 90, 100].map((w, i) => (
          <Skeleton key={i} width={w} height={36} borderRadius={999} />
        ))}
      </div>
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
            <Skeleton height={192} borderRadius={0} />
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton width="60%" height={22} />
                <Skeleton width="25%" height={22} />
              </div>
              <Skeleton height={48} borderRadius={12} />
              <div className="flex gap-2">
                <Skeleton width={80} height={28} borderRadius={8} />
                <Skeleton width={80} height={28} borderRadius={8} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Skeleton height={38} borderRadius={12} />
                <Skeleton height={38} borderRadius={12} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </ManageSkeletonTheme>
);

// ──────────────────────────────────────────────
// Tenants Tab skeleton
// ──────────────────────────────────────────────
export const TenantsSkeleton = () => (
  <ManageSkeletonTheme>
    <div className="flex gap-6">
      {/* Left panel */}
      <div className="w-64 flex-shrink-0 space-y-3">
        <Skeleton width={120} height={12} />
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} height={72} borderRadius={16} />
        ))}
      </div>
      {/* Right panel */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 space-y-1">
          <Skeleton width={160} height={24} />
          <Skeleton width={100} height={14} />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton width={40} height={40} borderRadius={999} />
              <Skeleton width={120} height={16} />
              <Skeleton width={100} height={14} />
              <Skeleton width={80} height={14} />
              <Skeleton width={140} height={14} />
              <Skeleton width={90} height={14} />
              <Skeleton width={80} height={24} borderRadius={999} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </ManageSkeletonTheme>
);

// ──────────────────────────────────────────────
// Contracts Tab skeleton
// ──────────────────────────────────────────────
export const ContractsSkeleton = () => (
  <ManageSkeletonTheme>
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <Skeleton width={260} height={32} />
        <Skeleton width={360} height={18} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between">
              <Skeleton width="60%" height={14} />
              <Skeleton width={36} height={36} borderRadius={12} />
            </div>
            <Skeleton width="30%" height={36} />
            <Skeleton width="50%" height={12} />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex gap-2">
          {[60, 100, 100, 80, 90].map((w, i) => (
            <Skeleton key={i} width={w} height={36} borderRadius={999} />
          ))}
        </div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="px-6 py-4 flex items-center gap-6 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <Skeleton width={40} height={40} borderRadius={12} />
              <Skeleton width={100} height={16} />
            </div>
            <Skeleton width={80} height={28} borderRadius={8} />
            <Skeleton width={160} height={14} />
            <Skeleton width={80} height={16} />
            <Skeleton width={80} height={16} />
            <Skeleton width={90} height={28} borderRadius={999} />
            <div className="ml-auto flex gap-2">
              <Skeleton width={36} height={36} borderRadius={8} />
              <Skeleton width={36} height={36} borderRadius={8} />
              <Skeleton width={36} height={36} borderRadius={8} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </ManageSkeletonTheme>
);

// ──────────────────────────────────────────────
// Invoices Tab skeleton
// ──────────────────────────────────────────────
export const InvoicesSkeleton = () => (
  <ManageSkeletonTheme>
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <Skeleton width={220} height={32} />
        <Skeleton width={340} height={18} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between">
              <Skeleton width="60%" height={12} />
              <Skeleton width={36} height={36} borderRadius={12} />
            </div>
            <Skeleton width="30%" height={36} />
            <Skeleton width="50%" height={12} />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex gap-2">
          {[60, 100, 100, 90, 80, 80].map((w, i) => (
            <Skeleton key={i} width={w} height={36} borderRadius={999} />
          ))}
        </div>
        {/* Table header */}
        <div className="bg-slate-50/50 px-8 py-4 flex gap-8 border-b border-slate-100">
          {[120, 80, 90, 110, 90, 80].map((w, i) => (
            <Skeleton key={i} width={w} height={10} />
          ))}
        </div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="px-8 py-5 flex items-center gap-8 border-b border-slate-50">
            <Skeleton width={120} height={16} />
            <Skeleton width={80} height={14} />
            <Skeleton width={90} height={18} />
            <Skeleton width={110} height={14} />
            <Skeleton width={90} height={26} borderRadius={999} />
            <div className="ml-auto flex gap-2">
              <Skeleton width={36} height={36} borderRadius={10} />
              <Skeleton width={100} height={36} borderRadius={10} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </ManageSkeletonTheme>
);

// ──────────────────────────────────────────────
// Support Tab skeleton
// ──────────────────────────────────────────────
export const SupportSkeleton = () => (
  <ManageSkeletonTheme>
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton width={200} height={32} />
        <Skeleton width={300} height={18} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between">
              <Skeleton width="60%" height={12} />
              <Skeleton width={36} height={36} borderRadius={12} />
            </div>
            <Skeleton width="30%" height={36} />
            <Skeleton width="50%" height={12} />
          </div>
        ))}
      </div>

      {/* Requests list */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex gap-2">
          {[60, 90, 90, 110].map((w, i) => (
            <Skeleton key={i} width={w} height={36} borderRadius={999} />
          ))}
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-6 rounded-3xl border border-slate-100 flex items-start gap-4">
              <Skeleton width={48} height={48} borderRadius={999} />
              <div className="flex-1 space-y-2">
                <Skeleton width="50%" height={20} />
                <Skeleton width="80%" height={14} />
                <div className="flex gap-3">
                  <Skeleton width={80} height={12} />
                  <Skeleton width={80} height={12} />
                  <Skeleton width={80} height={12} />
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Skeleton width={100} height={28} borderRadius={999} />
                <Skeleton width={120} height={32} borderRadius={12} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </ManageSkeletonTheme>
);

// ──────────────────────────────────────────────
// Listings Tab skeleton
// ──────────────────────────────────────────────
export const ListingsSkeleton = () => (
  <ManageSkeletonTheme>
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton width={220} height={32} />
          <Skeleton width={320} height={18} />
        </div>
        <Skeleton width={160} height={48} borderRadius={16} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-sm">
            <div className="relative aspect-video">
              <Skeleton height="100%" borderRadius={0} />
            </div>
            <div className="p-8 space-y-3">
              <Skeleton width="75%" height={22} />
              <Skeleton width="90%" height={14} />
              <Skeleton width="60%" height={14} />
              <div className="flex items-center justify-between pt-2">
                <Skeleton width={100} height={24} />
                <div className="flex gap-2">
                  <Skeleton width={44} height={44} borderRadius={12} />
                  <Skeleton width={44} height={44} borderRadius={12} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </ManageSkeletonTheme>
);

// ──────────────────────────────────────────────
// Account Tab skeleton
// ──────────────────────────────────────────────
export const AccountSkeleton = () => (
  <ManageSkeletonTheme>
    <div className="space-y-8">
      {/* Profile header */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-8">
        <Skeleton width={128} height={128} borderRadius={24} />
        <div className="flex-1 space-y-3">
          <Skeleton width={200} height={32} />
          <Skeleton width={150} height={18} />
          <div className="flex gap-3">
            <Skeleton width={120} height={32} borderRadius={12} />
            <Skeleton width={120} height={32} borderRadius={12} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {[1, 2, 3].map(section => (
            <div key={section} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <Skeleton width={40} height={40} borderRadius={12} />
                <div className="space-y-1">
                  <Skeleton width={160} height={18} />
                  <Skeleton width={200} height={12} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <Skeleton width={100} height={12} />
                    <Skeleton height={44} borderRadius={12} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Skeleton width={180} height={50} borderRadius={16} />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton width={40} height={40} borderRadius={12} />
              <div className="space-y-1">
                <Skeleton width={80} height={18} />
                <Skeleton width={140} height={12} />
              </div>
            </div>
            {[1, 2].map(i => (
              <div key={i} className="space-y-1.5">
                <Skeleton width={100} height={12} />
                <Skeleton height={44} borderRadius={12} />
              </div>
            ))}
            <Skeleton height={48} borderRadius={12} />
          </div>
          <div className="bg-red-50/50 rounded-3xl border border-red-100 p-8 space-y-4">
            <Skeleton width={140} height={24} />
            <Skeleton width="90%" height={40} />
            <Skeleton height={44} borderRadius={12} />
          </div>
        </div>
      </div>
    </div>
  </ManageSkeletonTheme>
);
