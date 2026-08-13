import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, MoveHorizontal, UserCheck, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20}/>, roles: ['ADMIN', 'BASE_COMMANDER', 'LOGISTICS_OFFICER'] },
    { name: 'Purchases', path: '/purchases', icon: <ShoppingCart size={20}/>, roles: ['ADMIN', 'LOGISTICS_OFFICER'] },
    { name: 'Transfers', path: '/transfers', icon: <MoveHorizontal size={20}/>, roles: ['ADMIN', 'LOGISTICS_OFFICER'] },
    { name: 'Assignments', path: '/assignments', icon: <UserCheck size={20}/>, roles: ['ADMIN', 'BASE_COMMANDER'] },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0">
      {/* Updated Header with logo.png */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <img 
          src="/company logo.png" 
          alt="Kristallball Logo" 
          className="h-8 w-8 object-contain" // Maintains proportions within a 32px box
        />
        <span className="font-bold text-xl tracking-widest uppercase">
          KRISTALLBALL
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.filter(item => item.roles.includes(user?.role)).map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              location.pathname === item.path ? 'bg-emerald-600' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            {item.icon} {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        {/* User Info Display */}
        <div className="px-3 mb-4 text-xs text-slate-500">
          SYSTEM ROLE: {user?.role}
        </div>
        <button 
          onClick={logout} 
          className="flex items-center gap-3 w-full p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition"
        >
          <LogOut size={20} /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;