import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Shield, Loader2, User, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      // It is better to let the App logic handle the redirect, 
      // but keeping this for immediate result:
      window.location.href = '/dashboard';
    } catch (err) { 
      alert('Invalid Military Credentials'); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-slate-900 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        
        {/* Centered Brand Identity */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
             
             <img 
               src="/company logo.png" 
               alt="Kristallball Logo" 
               className="h-16 w-16 object-contain relative z-10" 
             />
          </div>
          
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="font-bold text-2xl tracking-widest text-slate-900 uppercase">
              KRISTALLBALL
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-semibold">
            Secure Asset Management Portal
          </p>
        </div>

        <div className="space-y-4">
          {/* Username Field */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              className="w-full pl-10 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition bg-slate-50 focus:bg-white" 
              placeholder="Service Username" 
              onChange={e => setForm({...form, username: e.target.value})} 
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              className="w-full pl-10 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition bg-slate-50 focus:bg-white" 
              type="password" 
              placeholder="Passkey" 
              onChange={e => setForm({...form, password: e.target.value})} 
              required
            />
          </div>

          {/* Action Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Authenticating...
              </>
            ) : (
              'Initialize Terminal Session'
            )}
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Unregistered Personnel? {' '}
          <Link to="/register" className="text-slate-900 font-bold hover:underline">
            Request Enrollment
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;