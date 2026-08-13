import { useEffect, useState } from 'react';
import api from '../services/api';
import StatCard from '../components/StatCard';
import NetMoveModal from '../components/NetMoveModal';
import { Package, TrendingUp, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // 1. Setup Date Filter (Default to start of current month)
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchMetrics = () => {
    // Pass the selected date to the backend
    api.get(`/assets/metrics?startDate=${startDate}`)
       .then(res => setMetrics(res.data))
       .catch(console.error);
  };

  // Re-fetch whenever the date or filter changes
  useEffect(() => {
    fetchMetrics();
  }, [startDate]);

  if (!metrics) return <div className="p-10 text-slate-500 font-mono italic animate-pulse">Syncing with Command Grid...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header & Date Filter Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Command Dashboard</h1>
          <p className="text-slate-500 text-sm italic">Reporting visibility for period starting: {startDate}</p>
        </div>

        {/* Dynamic Month/Date Selector */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-sm">
           <div className="pl-3 text-slate-400"><Calendar size={18} /></div>
           <input 
             type="date" 
             value={startDate}
             onChange={(e) => setStartDate(e.target.value)}
             className="p-2 bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
           />
           <span className="pr-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Period Start</span>
        </div>
      </div>
      
      {/* Math Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* OPENING BALANCE: Now changes based on the date! */}
        <StatCard 
          title="Opening Balance" 
          value={metrics.opening_balance} 
          icon={<Package className="text-blue-600"/>} 
          color="border-blue-600" 
        />
        
        <StatCard 
            title="Net Movement" 
            value={metrics.net_movement} 
            icon={<TrendingUp className="text-emerald-600"/>} 
            color="border-emerald-600" 
            onClick={() => setShowModal(true)} 
        />
        
        <StatCard 
            title="Expended" 
            value={metrics.total_expended} 
            icon={<AlertTriangle className="text-red-600"/>} 
            color="border-red-600" 
        />
        
        <StatCard 
            title="Closing Balance" 
            value={metrics.closing_balance} 
            icon={<CheckCircle className="text-slate-900"/>} 
            color="border-slate-900" 
            isDark 
        />
      </div>

      {showModal && <NetMoveModal metrics={metrics} onClose={() => setShowModal(false)} />}
      
      {/* Visual Instruction for the User */}
      <div className="bg-slate-900 p-8 rounded-3xl text-center text-white/40 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 font-mono text-xs uppercase tracking-[0.4em]">
             Historical Inventory Map: Active Node
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};

export default Dashboard;