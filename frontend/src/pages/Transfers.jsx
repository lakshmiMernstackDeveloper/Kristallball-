import { useState, useEffect } from 'react';
import api from '../services/api';
import { MoveHorizontal, Loader2, Send } from 'lucide-react';

const Transfers = () => {
    const [bases, setBases] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ 
        sourceBaseId: '', 
        destinationBaseId: '', 
        equipmentTypeId: '', 
        quantity: '' 
    });

    useEffect(() => {
        api.get('/auth/bases').then(res => setBases(res.data));
        api.get('/assets/equipment-types').then(res => setEquipment(res.data));
    }, []);

const handleTransfer = async (e) => {
    e.preventDefault();

    // 1. Basic client-side validation
    if (parseInt(form.sourceBaseId) === parseInt(form.destinationBaseId)) {
        return alert("Logistics Error: Source and Destination bases cannot be identical.");
    }

    // 2. Prepare sanitized payload (Ensure everything is a number)
    const payload = {
        sourceBaseId: parseInt(form.sourceBaseId),
        destinationBaseId: parseInt(form.destinationBaseId),
        equipmentTypeId: parseInt(form.equipmentTypeId),
        quantity: parseInt(form.quantity)
    };
    
    setLoading(true);
    try {
        // 3. Post to API
        const response = await api.post('/transfers', payload);
        
        // 4. Success handling
        alert(response.data.message || "Transfer finalized and assets rerouted.");
        
        // Clear quantity field on success
        setForm(prev => ({ ...prev, quantity: '' }));

    } catch (err) {
        // 5. ENTERPRISE ERROR EXTRACTION
        // This will display the "Insufficient Assets" message from your backend
        const serverErrorMessage = err.response?.data?.error || "Transfer failed: Check connection to the Command Grid.";
        
        console.error("Transfer Rejection:", serverErrorMessage);
        alert(serverErrorMessage);

    } finally { 
        setLoading(false); 
    }
};
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-3">
                <MoveHorizontal className="text-blue-600" size={32} />
                <h1 className="text-3xl font-bold text-slate-800">Inter-Base Transfer</h1>
            </div>

            <form onSubmit={handleTransfer} className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Source Base (From)</label>
                        <select className="w-full p-4 bg-slate-50 border rounded-2xl" value={form.sourceBaseId} onChange={e => setForm({...form, sourceBaseId: e.target.value})} required>
                            <option value="">Select Base</option>
                            {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Destination Base (To)</label>
                        <select className="w-full p-4 bg-slate-50 border rounded-2xl" value={form.destinationBaseId} onChange={e => setForm({...form, destinationBaseId: e.target.value})} required>
                            <option value="">Select Base</option>
                            {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Asset To Move</label>
                        <select className="w-full p-4 bg-slate-50 border rounded-2xl" value={form.equipmentTypeId} onChange={e => setForm({...form, equipmentTypeId: e.target.value})} required>
                            <option value="">Select Asset</option>
                            {equipment.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Quantity</label>
                        <input type="number" className="w-full p-4 bg-slate-50 border rounded-2xl" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-black text-lg transition flex justify-center items-center gap-3">
                    {loading ? <Loader2 className="animate-spin" /> : <Send size={24} />}
                    Initiate Atomic Transfer
                </button>
            </form>
        </div>
    );
};
export default Transfers;