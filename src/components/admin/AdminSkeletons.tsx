import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AdminSkeletonTheme = ({ children }: { children: React.ReactNode }) => (
  <SkeletonTheme baseColor="#f1f5f9" highlightColor="#e2e8f0" borderRadius="1rem" duration={1.5}>
    {children}
  </SkeletonTheme>
);

export const AdminDashboardSkeleton = () => (
  <AdminSkeletonTheme>
    <div className="flex flex-col w-full h-full">
      <div className="mb-8 shrink-0">
        <Skeleton width={300} height={32} className="mb-2" />
        <Skeleton width={400} height={20} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Skeleton circle width={48} height={48} className="mb-4" />
            <Skeleton width={120} height={20} className="mb-1" />
            <Skeleton width={80} height={36} className="mb-2" />
            <Skeleton width={60} height={24} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-[400px]">
          <Skeleton width={200} height={28} className="mb-6" />
          <Skeleton height={280} />
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
          <Skeleton width={180} height={28} className="mb-6" />
          <div className="flex-1 flex items-center justify-center">
            <Skeleton circle width={220} height={220} />
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-[400px]">
        <Skeleton width={250} height={28} className="mb-6" />
        <Skeleton height={280} />
      </div>
    </div>
  </AdminSkeletonTheme>
);

export const AdminTableSkeleton = () => (
  <AdminSkeletonTheme>
    <div className="flex flex-col w-full h-full">
      <div className="mb-8 shrink-0">
        <Skeleton width={250} height={32} className="mb-2" />
        <Skeleton width={350} height={20} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 shrink-0">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 flex items-center gap-4">
            <Skeleton width={48} height={48} className="rounded-lg" />
            <div className="flex-1">
              <Skeleton width="60%" height={16} className="mb-1" />
              <Skeleton width="40%" height={28} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col flex-1 min-h-0">
        <div className="flex border-b border-slate-200 px-6 py-2 shrink-0 bg-slate-50/50 gap-6">
           <Skeleton width={80} height={32} />
           <Skeleton width={80} height={32} />
           <Skeleton width={80} height={32} />
        </div>
        <div className="overflow-hidden flex-1 p-0">
           <div className="w-full">
              {/* Header row */}
              <div className="flex gap-4 p-4 border-b border-slate-100 bg-slate-50/80">
                 <Skeleton width="25%" height={20} />
                 <Skeleton width="20%" height={20} />
                 <Skeleton width="25%" height={20} />
                 <Skeleton width="15%" height={20} />
                 <Skeleton width="15%" height={20} />
              </div>
              {/* Body rows */}
              {[1, 2, 3, 4, 5, 6].map(row => (
                <div key={row} className="flex gap-4 p-4 border-b border-slate-100 items-center">
                  <div className="w-[25%] flex items-center gap-3">
                     <Skeleton circle width={40} height={40} />
                     <div className="flex-1">
                        <Skeleton width="80%" height={16} className="mb-1" />
                        <Skeleton width="50%" height={12} />
                     </div>
                  </div>
                  <div className="w-[20%]"><Skeleton width={80} height={24} className="rounded-full" /></div>
                  <div className="w-[25%]"><Skeleton width="90%" height={16} /></div>
                  <div className="w-[15%]"><Skeleton width="70%" height={16} /></div>
                  <div className="w-[15%] flex justify-end gap-2">
                     <Skeleton width={32} height={32} className="rounded-xl" />
                     <Skeleton width={32} height={32} className="rounded-xl" />
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  </AdminSkeletonTheme>
);
