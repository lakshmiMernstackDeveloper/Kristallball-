import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { ShieldPlus, User, Lock, MapPin, Briefcase, Loader2 } from 'lucide-react';

const Register = () => {
  const [form, setForm] = useState({ 
    username: '', 
    password: '', 
    role: 'LOGISTICS_OFFICER', 
    baseId: '' 
  });
  const [bases, setBases] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load military bases for the dropdown
  useEffect(() => {
    api.get('/auth/bases')
      .then(res => setBases(res.data))
      .catch(err => console.error("Could not load bases", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        baseId: form.role === 'ADMIN' ? null : parseInt(form.baseId)
      };
      await api.post('/auth/register', payload);
      alert('Personnel Enrollment Successful.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed: Validate base and credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row min-h-[550px]">
        
        {/* Left Side: Military Identity Sidebar */}
        <div className="bg-slate-800 text-white p-8 md:w-2/5 flex flex-col justify-center items-center text-center">
          <div className="relative mb-6">
            {/* Pulsing Shield Glow behind Logo */}
            
            <img 
              src="/company logo.png" 
              alt="Kristallball Logo" 
              className="h-20 w-20 object-contain relative z-10" 
            />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-widest leading-tight">
            KRISTALLBALL
          </h2>
          <div className="h-1 w-12 bg-emerald-500 my-4"></div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
            Personnel Registry
          </p>
          <p className="text-slate-500 text-[10px] mt-8 italic px-4">
            Initialize new identity record within the global asset grid.
          </p>
        </div>

        {/* Right Side: Enrollment Form */}
        <form onSubmit={handleSubmit} className="p-8 flex-1 flex flex-col justify-center space-y-4">
          <div className="mb-2">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Enroll Personnel</h2>
            <p className="text-slate-400 text-sm">Fill in the required deployment details</p>
          </div>

          <div className="space-y-4">
            {/* Username */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition bg-slate-50 focus:bg-white" 
                placeholder="Service Username" 
                onChange={e => setForm({...form, username: e.target.value})} 
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition bg-slate-50 focus:bg-white" 
                type="password" 
                placeholder="Secure Passkey" 
                onChange={e => setForm({...form, password: e.target.value})} 
                required
              />
            </div>

            {/* Role Selection */}
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                className="w-full pl-10 p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none appearance-none" 
                value={form.role}
                onChange={e => setForm({...form, role: e.target.value})} 
                required
              >
                <option value="LOGISTICS_OFFICER">Logistics Officer</option>
                <option value="BASE_COMMANDER">Base Commander</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>

            {/* Conditional Base Assignment (Not for Admins) */}
            {form.role !== 'ADMIN' && (
              <div className="relative animate-in slide-in-from-top-1 duration-300">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select 
                  className="w-full pl-10 p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none appearance-none" 
                  value={form.baseId}
                  onChange={e => setForm({...form, baseId: e.target.value})} 
                  required
                >
                  <option value="">Select Base Assignment</option>
                  {bases.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.location})</option>
                  ))}
                </select>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  ENROLLING...
                </>
              ) : (
                'INITIALIZE IDENTITY'
              )}
            </button>
          </div>

          <p className="text-center text-xs mt-6 text-slate-500 uppercase font-semibold tracking-wider">
            Already authorized? <Link to="/login" className="text-emerald-600 hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;