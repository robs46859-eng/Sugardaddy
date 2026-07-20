'use client';

import { Menu, User, Settings, Bell } from 'lucide-react';

export default function HeaderNavigation() {
  return (
    <div className="absolute top-6 left-0 right-0 z-50 px-6 flex justify-center">
      <div className="flex items-center justify-between w-full max-w-md bg-white/30 dark:bg-black/30 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-full px-6 py-3 shadow-lg">
        <button className="text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <div className="text-lg font-semibold text-slate-800 dark:text-white tracking-wide">
          SugarDaddy
        </div>
        <div className="flex items-center gap-4">
          <button className="text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white"></span>
          </button>
          <button className="text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors">
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
