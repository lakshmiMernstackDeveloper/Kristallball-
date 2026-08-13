import { useState, useEffect } from 'react';
import api from '../services/api';
import { ShoppingCart, Plus, Loader2, ChevronLeft, ChevronRight, Hash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Purchases = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [bases, setBases] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ baseId: user?.baseId || '', equipmentTypeId: '', quantity: '' });

    // --- Pagination States ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Set how many rows you want per page

    const loadData = async () => {
        try {
            const [histRes, baseRes, equipRes] = await Promise.all([
                api.get('/purchases/history'),
                api.get('/auth/bases'),
                api.get('/assets/equipment-types')
            ]);
            setHistory(histRes.data);
            setBases(baseRes.data);
            setEquipment(equipRes.data);
        } catch (err) {
            console.error("Intelligence fetch error", err);
        }
    };

    useEffect(() => { loadData(); }, []);

    // --- Pagination Logic ---
    const totalPages = Math.ceil(history.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);

    const handlePurchase = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/purchases', form);
            setForm({ ...form, quantity: '' });
            setCurrentPage(1); // Reset to page 1 to see the newest entry
            loadData();
            alert("Asset Acquired Successfully");
        } catch (err) {
            alert("Error logging purchase");
        } finally { setLoading(false); }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center gap-3">
                <ShoppingCart className="text-slate-900" size={32} />
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">Acquisition Management</h1>
            </div>

            {/* Entry Form */}
            <form onSubmit={handlePurchase} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Base Assignment</label>
                    <select 
                        disabled={user.role === 'BASE_COMMANDER'}
                        className="w-full p-3 border rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-slate-900 transition"
                        value={form.baseId} 
                        onChange={e => setForm({...form, baseId: e.target.value})} required
                    >
                        <option value="">Select Location</option>
                        {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Asset Category</label>
                    <select 
                        className="w-full p-3 border rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-slate-900 transition"
                        value={form.equipmentTypeId} 
                        onChange={e => setForm({...form, equipmentTypeId: e.target.value})} required
                    >
                        <option value="">Select Equipment</option>
                        {equipment.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Quantity</label>
                    <input 
                        type="number" className="w-full p-3 border rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-slate-900 transition" 
                        placeholder="0000"
                        value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required
                    />
                </div>
                <button type="submit" disabled={loading} className="bg-slate-900 text-white p-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-slate-800 transition active:scale-95 shadow-lg shadow-slate-200">
                    {loading ? <Loader2 className="animate-spin" /> : <Plus size={20} />} LOG PURCHASE
                </button>
            </form>

            {/* History Table Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b">
                        <tr>
                            <th className="p-4">Authorization Date</th>
                            <th className="p-4">Inventory Class</th>
                            <th className="p-4">Deployed Base</th>
                            <th className="p-4 text-right">Units Acquired</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {currentItems.map(item => (
                            <tr key={item.id} className="hover:bg-slate-50/80 transition cursor-default">
                                <td className="p-4 text-slate-400 text-xs font-mono">
                                    {new Date(item.created_at).toLocaleDateString()} - {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="p-4 font-bold text-slate-700">{item.equipment_name}</td>
                                <td className="p-4 text-slate-600 text-sm">{item.base_name}</td>
                                <td className="p-4 text-right font-black text-emerald-600 tracking-tighter">
                                    +{item.quantity.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* --- Pagination Footer --- */}
                <div className="bg-slate-50/50 p-4 border-t flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Hash size={12}/> Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, history.length)} of {history.length} records
                    </div>
                    
                    <div className="flex gap-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-2 border rounded-lg bg-white hover:bg-slate-100 disabled:opacity-30 transition"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        
                        <div className="flex items-center px-4 text-sm font-black text-slate-700 bg-white border rounded-lg">
                            {currentPage} / {totalPages || 1}
                        </div>

                        <button 
                            disabled={currentPage >= totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-2 border rounded-lg bg-white hover:bg-slate-100 disabled:opacity-30 transition"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Purchases;