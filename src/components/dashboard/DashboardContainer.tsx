'use client';

import React from 'react';

export default function DashboardContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[40%] md:h-[35%] bg-white/20 dark:bg-black/30 backdrop-blur-xl border-t border-white/40 dark:border-white/10 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col z-10 transition-all duration-300">
      <div className="w-16 h-1.5 bg-white/50 dark:bg-white/20 rounded-full mx-auto mt-3 mb-4 shrink-0" />
      <div className="flex-1 overflow-y-auto px-6 pb-24 scrollbar-hide">
        {children}
      </div>
    </div>
  );
}
