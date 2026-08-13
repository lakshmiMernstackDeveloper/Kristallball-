import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Shield, Activity, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Convert route path to a readable title (/purchases -> PURCHASES)
  const pageTitle = location.pathname.split('/')[1] || 'DASHBOARD';

  return (
    <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
      
      {/* Left Side: Page Context */}
      <div className="flex items-center gap-4">
        <div className="p-2 bg-slate-900 rounded-lg text-white">
          <Activity size={18} className="animate-pulse" />
        </div>
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Command / Area</h2>
          <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{pageTitle}</p>
        </div>
      </div>

      {/* Middle: System Status (Visual Flair) */}
      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping"></div>
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tighter">System encrypted</span>
        </div>
        <div className="h-4 w-px bg-slate-200"></div>
        <Bell size={18} className="text-slate-400 cursor-pointer hover:text-slate-600 transition" />
      </div>

      {/* Right Side: User Profile & Base Assignment */}
      <div className="flex items-center gap-6">
        
        {/* Base Info (Only shows if user has a baseId) */}
        {user?.baseId && (
          <div className="hidden lg:flex flex-col items-end border-r pr-6 border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Stationed At</span>
            <div className="flex items-center gap-1 text-slate-700 font-bold text-sm uppercase italic">
              <MapPin size={14} className="text-emerald-600" />
              Base #{user.baseId}
            </div>
          </div>
        )}

        {/* User Identity */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
          <div className="flex flex-col items-end">
            <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">
              {user?.username}
            </span>
            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">
              {user?.role?.replace('_', ' ')}
            </span>
          </div>
          <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center border-2 border-emerald-500 shadow-sm">
             <User size={20} className="text-white" />
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;