import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserCheck, Trash2, Loader2, ShieldAlert, History, Plus, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Assignments = () => {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [history, setHistory] = useState([]);
  const [bases, setBases] = useState([]); // Added to let Admins select a base
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [form, setForm] = useState({ 
    baseId: user?.baseId || '', // Defaults to Commander's base
    equipmentTypeId: '', 
    quantity: '', 
    details: '' 
  });

  const loadInitialData = async () => {
    // 1. Always fetch assets for the dropdown
    try {
      const equipRes = await api.get('/assets/equipment-types');
      setEquipment(equipRes.data);
    } catch (err) {
      console.error("Asset fetch failed:", err);
    }

    // 2. Fetch Expenditure History
    try {
      const histRes = await api.get('/assets/expenditures');
      setHistory(histRes.data);
    } catch (err) {
      console.error("History fetch failed:", err);
    }

    // 3. If Admin, fetch bases so they can select where the loss happened
    if (user?.role === 'ADMIN') {
      try {
        const baseRes = await api.get('/auth/bases');
        setBases(baseRes.data);
      } catch (err) {
        console.error("Bases fetch failed:", err);
      }
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.baseId && user?.role === 'ADMIN') return alert("Admin: Please select a target base.");

    setLoading(true);
    try {
      await api.post('/assets/expenditures', form);
      // Reset form but keep baseId
      setForm({ ...form, equipmentTypeId: '', quantity: '', details: '' });
      loadInitialData(); // Refresh history and dropdowns
      alert("Operational Expenditure Recorded.");
    } catch (err) {
      alert("Transaction Failed: Ensure stock availability.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b pb-4 border-slate-200">
        <UserCheck className="text-slate-900" size={32} />
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Assignments & Expenditures</h1>
      </div>

      {/* Intelligence Alert */}
      <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex items-start gap-4 shadow-sm">
        <ShieldAlert className="text-amber-600 shrink-0" size={24} />
        <div>
          <h3 className="font-bold text-amber-900 uppercase text-xs tracking-widest">Ammunition & Resource Consumption</h3>
          <p className="text-amber-700 text-sm mt-1">
            Authorized users only. Logging an expenditure results in a **permanent reduction** of inventory.
            Logged context: <b className="underline">{user?.role === 'ADMIN' ? 'GLOBAL OVERRIDE' : `BASE SECURITY ZONE #${user?.baseId}`}</b>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* LEFT: LOGGING FORM */}
         <div className="lg:col-span-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 border-b pb-2 uppercase">
                <Plus size={20} className="text-emerald-500"/> Expenditure Form
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Admin Only: Base Selector */}
                {user?.role === 'ADMIN' && (
                    <div className="animate-in slide-in-from-left-2 duration-300">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Target Base</label>
                        <div className="relative mt-1">
                            <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                            <select 
                                className="w-full pl-10 p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none appearance-none"
                                value={form.baseId}
                                onChange={e => setForm({...form, baseId: e.target.value})}
                                required
                            >
                                <option value="">Select Location</option>
                                {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                    </div>
                )}

                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Consumed</label>
                    <select 
                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 mt-1 outline-none" 
                        value={form.equipmentTypeId}
                        onChange={e => setForm({...form, equipmentTypeId: e.target.value})}
                        required
                    >
                        <option value="">Select Equipment Type</option>
                        {equipment.map(e => <option key={e.id} value={e.id}>{e.name} ({e.category})</option>)}
                    </select>
                </div>

                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity Discharged</label>
                    <input 
                        type="number" 
                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 mt-1 outline-none" 
                        placeholder="Enter amount"
                        value={form.quantity}
                        onChange={e => setForm({...form, quantity: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operation Details</label>
                    <textarea 
                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 mt-1 outline-none" 
                        placeholder="Purpose of consumption..."
                        rows="3"
                        value={form.details}
                        onChange={e => setForm({...form, details: e.target.value})}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg active:scale-95 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={20}/> : <Trash2 size={18}/>}
                    LOG EXPENDITURE
                </button>
            </form>
         </div>
         
         {/* RIGHT: HISTORY TABLE */}
         <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 border-b pb-2 uppercase">
                <History size={20} className="text-blue-500"/> Consumption Records
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Asset</th>
                            <th className="p-4">Location</th>
                            <th className="p-4">Qty</th>
                            <th className="p-4">Remarks</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                        {history.length > 0 ? history.map(item => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-slate-400 font-mono text-[10px]">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4 font-bold text-slate-700">{item.equipment_name}</td>
                                <td className="p-4 text-slate-500">{item.base_name || 'System Hub'}</td>
                                <td className="p-4 text-red-600 font-black">-{item.quantity}</td>
                                <td className="p-4 text-slate-500 italic text-xs truncate max-w-[150px]">
                                  {item.details}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="p-20 text-center text-slate-400 italic bg-slate-50/50">
                                    No consumption data discovered in current tactical sector.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Assignments;