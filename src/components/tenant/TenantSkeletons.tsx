/**
 * Shared skeleton components for the Tenant page.
 * Uses react-loading-skeleton for a shimmer effect.
 */
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// ──────────────────────────────────────────────
// Theme wrapper — use once at the top-level
// ──────────────────────────────────────────────
export const TenantSkeletonTheme = ({ children }: { children: React.ReactNode }) => (
  <SkeletonTheme baseColor="#f1f5f9" highlightColor="#e2e8f0" borderRadius={12} duration={1.4}>
    {children}
  </SkeletonTheme>
);

// ──────────────────────────────────────────────
// Overview Tab skeleton
// ──────────────────────────────────────────────
export const OverviewSkeleton = () => (
  <TenantSkeletonTheme>
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col gap-2">
        <Skeleton width={260} height={32} />
        <Skeleton width={320} height={18} />
      </div>

      {/* Room cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton width={56} height={56} borderRadius={16} />
              <div className="flex-1 space-y-2">
                <Skeleton width="70%" height={20} />
                <Skeleton width="50%" height={14} />
              </div>
            </div>
            <Skeleton height={14} width="60%" />
            <Skeleton height={14} width="40%" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-2">
                <Skeleton width={120} height={22} />
                <Skeleton width={160} height={14} />
              </div>
              <Skeleton width={60} height={28} />
            </div>
            <div className="flex items-end gap-2 h-[250px]">
              {Array.from({ length: 12 }).map((_, j) => (
                <Skeleton
                  key={j}
                  width="100%"
                  height={`${Math.random() * 60 + 30}%`}
                  borderRadius={8}
                  style={{ alignSelf: 'flex-end' }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </TenantSkeletonTheme>
);

// ──────────────────────────────────────────────
// Rooms Tab skeleton
// ──────────────────────────────────────────────
export const RoomsSkeleton = () => (
  <TenantSkeletonTheme>
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton width={200} height={32} />
        <Skeleton width={300} height={18} />
      </div>

      {[1, 2].map(i => (
        <div key={i} className="bg-white rounded-[32px] border border-slate-200 overflow-hidden flex flex-col md:flex-row shadow-xl shadow-primary/5">
          {/* Image placeholder */}
          <Skeleton width="100%" height={260} borderRadius={0} containerClassName="md:w-1/3 shrink-0" />

          <div className="p-6 md:p-8 flex-1 space-y-6">
            <div className="flex justify-between">
              <Skeleton width={160} height={28} />
              <Skeleton width={100} height={28} />
            </div>
            <div className="flex gap-2">
              <Skeleton width={80} height={28} borderRadius={8} />
              <Skeleton width={80} height={28} borderRadius={8} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map(j => (
                <Skeleton key={j} height={80} borderRadius={16} />
              ))}
            </div>
            <Skeleton height={80} borderRadius={16} />
          </div>
        </div>
      ))}
    </div>
  </TenantSkeletonTheme>
);

// ──────────────────────────────────────────────
// Contracts Tab skeleton
// ──────────────────────────────────────────────
export const ContractsSkeleton = () => (
  <TenantSkeletonTheme>
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton width={240} height={32} />
        <Skeleton width={320} height={18} />
      </div>

      {[1, 2].map(i => (
        <div key={i} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex items-start gap-5">
              <Skeleton width={56} height={56} borderRadius={16} />
              <div className="space-y-2">
                <Skeleton width={220} height={24} />
                <Skeleton width={280} height={16} />
              </div>
            </div>
            <div className="space-y-2 min-w-[140px]">
              <Skeleton height={36} borderRadius={12} />
              <Skeleton height={36} borderRadius={12} />
              <Skeleton height={36} borderRadius={12} />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(j => (
              <Skeleton key={j} height={70} borderRadius={16} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </TenantSkeletonTheme>
);

// ──────────────────────────────────────────────
// Invoices Tab skeleton
// ──────────────────────────────────────────────
export const InvoicesSkeleton = () => (
  <TenantSkeletonTheme>
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton width={200} height={32} />
        <Skeleton width={300} height={18} />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="bg-slate-50 px-8 py-5 flex gap-8 border-b border-slate-100">
          {[140, 100, 100, 140, 80, 100].map((w, i) => (
            <Skeleton key={i} width={w} height={12} />
          ))}
        </div>
        {/* Rows */}
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="px-8 py-6 flex items-center gap-8 border-b border-slate-50">
            <div className="w-[140px] space-y-1.5">
              <Skeleton height={16} width={120} />
              <Skeleton height={12} width={80} />
            </div>
            <Skeleton width={100} height={14} />
            <Skeleton width={100} height={18} />
            <div className="w-[140px] space-y-1">
              <Skeleton height={14} width={100} />
              <Skeleton height={12} width={80} />
            </div>
            <Skeleton width={80} height={26} borderRadius={999} />
            <div className="ml-auto flex gap-2">
              <Skeleton width={36} height={36} borderRadius={12} />
              <Skeleton width={120} height={36} borderRadius={12} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </TenantSkeletonTheme>
);

// ──────────────────────────────────────────────
// Support Tab skeleton
// ──────────────────────────────────────────────
export const SupportSkeleton = () => (
  <TenantSkeletonTheme>
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton width={180} height={32} />
          <Skeleton width={280} height={18} />
        </div>
        <Skeleton width={140} height={44} borderRadius={16} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 flex items-start gap-5 shadow-sm">
            <Skeleton width={48} height={48} borderRadius={16} />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <Skeleton width={200} height={20} />
                <Skeleton width={80} height={24} borderRadius={999} />
              </div>
              <Skeleton width="80%" height={14} />
              <Skeleton width={120} height={12} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </TenantSkeletonTheme>
);

// ──────────────────────────────────────────────
// Account Tab skeleton
// ──────────────────────────────────────────────
export const AccountSkeleton = () => (
  <TenantSkeletonTheme>
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton width={160} height={32} />
        <Skeleton width={240} height={18} />
      </div>

      {/* Avatar section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-6 mb-8">
          <Skeleton width={80} height={80} borderRadius={999} />
          <div className="space-y-2">
            <Skeleton width={160} height={22} />
            <Skeleton width={120} height={16} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton width={100} height={12} />
              <Skeleton height={44} borderRadius={12} />
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Skeleton width={160} height={44} borderRadius={16} />
        </div>
      </div>

      {/* Password section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <Skeleton width={180} height={24} className="mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-1.5">
              <Skeleton width={100} height={12} />
              <Skeleton height={44} borderRadius={12} />
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Skeleton width={160} height={44} borderRadius={16} />
        </div>
      </div>
    </div>
  </TenantSkeletonTheme>
);
