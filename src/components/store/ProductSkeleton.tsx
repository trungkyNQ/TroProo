import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { SharedSkeletonTheme } from '../shared/SharedSkeletons';

export const ProductSkeleton = () => {
  return (
    <SharedSkeletonTheme>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Skeleton className="w-full h-full absolute inset-0 !rounded-none" />
        </div>
        <div className="p-4 flex flex-col gap-3">
          <Skeleton width="40%" height={16} />
          <Skeleton width="85%" height={24} className="mb-1" />
          <div className="mt-2 pt-4 border-t border-slate-50 flex items-center justify-between">
            <Skeleton width="60%" height={24} />
          </div>
        </div>
      </div>
    </SharedSkeletonTheme>
  );
};
