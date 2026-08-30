import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Lock, Mail, Phone, CheckCircle2, ArrowRight, 
  ShieldCheck, Activity, Hospital, Sparkles, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AudioButton } from '../components/VoiceAssistant';

export default function Login() {
  const [email, setEmail] = useState('sairam@hospitalop.in');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, switchDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (type) => {
    switchDemoUser(type);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen medical-bg-mesh text-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        
        {/* Top Branding Card */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-xl shadow-cyan-500/20 border border-cyan-400/40">
            <Activity className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white">
            Hospital Patient & OP Login
          </h2>
          <p className="text-sm text-slate-400">
            Access your OP tickets, appointments & ABHA health record
          </p>

          <div className="flex justify-center pt-1">
            <AudioButton 
              textToRead="Please enter your email and password to log in to the national hospital OP network, or use one-click demo patient login."
              label="🔊 Listen to Instructions"
              className="text-xs"
            />
          </div>
        </motion.div>

        {/* Quick Demo Login One-Click Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-4 rounded-2xl border border-cyan-500/30 space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> One-Click Quick Login:
            </span>
            <span className="text-[10px] text-slate-400">Instant Access</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemo('patient')}
              type="button"
              className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 transition-all text-left group"
            >
              <img 
                src="https://images.unsplash.com/photo-1594824813571-638f026361a1?auto=format&fit=crop&w=80&h=80&q=80" 
                alt="Patient Sairam"
                className="w-8 h-8 rounded-lg object-cover border border-cyan-400/50"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">Sairam Vittanala</p>
                <p className="text-[10px] text-slate-400">Verified Patient</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickDemo('doctor')}
              type="button"
              className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-blue-500/40 hover:border-blue-400 transition-all text-left group"
            >
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=80&h=80&q=80" 
                alt="Dr. Deepthi"
                className="w-8 h-8 rounded-lg object-cover border border-blue-400/50"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white group-hover:text-blue-300 truncate">Dr. Deepthi</p>
                <p className="text-[10px] text-slate-400">Lead Cardiologist</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Login Form Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-6"
        >
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Registered Email / Mobile
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 focus:border-cyan-400 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-cyan-400 hover:underline cursor-pointer">
                  Forgot Password?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 focus:border-cyan-400 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Logging In...</span>
              ) : (
                <>
                  <span>Sign In to Hospital Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration Redirect Link */}
          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            New patient / first time booking?{' '}
            <Link to="/register" className="font-bold text-cyan-400 hover:underline">
              Register New Patient Account
            </Link>
          </div>
        </motion.div>

        {/* Security Trust Badges */}
        <div className="flex items-center justify-center gap-4 text-slate-400 text-xs font-semibold">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> ABDM & ABHA Compliant
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Hospital className="w-4 h-4 text-cyan-400" /> 1,170+ Network Hospitals
          </span>
        </div>

      </div>
    </div>
  );
}
