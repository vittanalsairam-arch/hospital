import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, User, Globe, MapPin, Search, LogOut, LogIn, ChevronDown, CheckCircle2, ShieldCheck, Stethoscope, Smartphone, FileText, Github } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { usePWA } from '../context/PWAContext';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const { user, logout, switchDemoUser } = useAuth();
  const { openModal } = usePWA();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-slate-700/60 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                Medi<span className="text-cyan-400">OP</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">INDIA 29 STATES</span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">National OP Booking Network</p>
            </div>
          </Link>
          
          {/* Main Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`font-semibold text-sm transition-colors ${isActive('/') ? 'text-cyan-400' : 'text-slate-300 hover:text-cyan-300'}`}
            >
              {t('home')}
            </Link>

            <Link 
              to="/directory" 
              className={`flex items-center gap-1.5 font-semibold text-sm transition-colors px-3 py-1.5 rounded-full ${
                isActive('/directory') 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                  : 'text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/30'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{t('directory')}</span>
            </Link>

            <Link 
              to="/doctors" 
              className={`flex items-center gap-1.5 font-semibold text-sm transition-colors ${isActive('/doctors') ? 'text-cyan-400' : 'text-slate-300 hover:text-cyan-300'}`}
            >
              <Stethoscope className="w-4 h-4 text-cyan-400" />
              <span>Specialists</span>
            </Link>

            <Link 
              to="/dashboard" 
              className={`flex items-center gap-1.5 font-semibold text-sm transition-colors px-3 py-1 rounded-full ${
                isActive('/dashboard') 
                  ? 'bg-cyan-500 text-white font-bold shadow-md shadow-cyan-500/20' 
                  : 'bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30'
              }`}
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>⚡ My OP Tickets</span>
            </Link>
          </div>


          {/* Right Section: Language Switcher, App Link & User Buttons */}
          <div className="flex items-center space-x-2.5">
            {/* GitHub Repository Link */}
            <a
              href="https://github.com/vittanalsairam-arch/op-tickets"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-600/70 hover:border-cyan-400 text-slate-200 hover:text-white text-xs font-bold transition-all shadow-md group cursor-pointer"
              title="GitHub Repository: vittanalsairam-arch/op-tickets"
            >
              <Github className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">GitHub</span>
            </a>

            {/* App Link & Install Trigger */}
            <button
              onClick={openModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-bold transition-all shadow-md shadow-cyan-500/10 group cursor-pointer"
              title="Get Mobile App Link, QR Code & Installation"
            >
              <Smartphone className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">App Link</span>
            </button>

            {/* Language Switcher Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-2.5 py-1.5 rounded-xl shadow-inner">
              <Globe className="w-4 h-4 text-cyan-400" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
                title="Select Language / भाषा चुनें"
              >
                <option value="en" className="bg-slate-900 text-white">English</option>
                <option value="hi" className="bg-slate-900 text-white">हिंदी (Hindi)</option>
                <option value="te" className="bg-slate-900 text-white">తెలుగు (Telugu)</option>
                <option value="ta" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
                <option value="kn" className="bg-slate-900 text-white">ಕನ್ನಡ (Kannada)</option>
                <option value="mr" className="bg-slate-900 text-white">मराठी (Marathi)</option>
                <option value="bn" className="bg-slate-900 text-white">বাংলা (Bengali)</option>
              </select>
            </div>

            {/* User Auth Profile / Login Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-slate-800/90 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 transition-all shadow-md shadow-cyan-500/10 cursor-pointer"
                  title="My Hospital Profile"
                >
                  <div className="relative">
                    <img 
                      src={user.avatar || 'https://images.unsplash.com/photo-1594824813571-638f026361a1?auto=format&fit=crop&w=120&h=120&q=80'} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-cyan-400/60 shadow-inner"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full shadow-sm"></span>
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-white line-clamp-1 leading-tight">{user.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-cyan-300 font-semibold">{user.role === 'doctor' ? '👨‍⚕️ Doctor' : '🏥 Patient'}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile Dropdown Menu */}
                {showUserMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-64 glass-panel bg-slate-900/95 border border-cyan-500/40 rounded-2xl shadow-2xl p-3 space-y-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                    <div className="flex items-center gap-3 pb-2.5 border-b border-slate-800">
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-10 h-10 rounded-xl object-cover border border-cyan-400/50"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-extrabold text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                        <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono">ABHA: {user.abhaId}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Link 
                        to="/dashboard" 
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-cyan-500/20 transition-colors"
                      >
                        <Activity className="w-4 h-4 text-cyan-400" />
                        <span>My Hospital OP & Dashboard</span>
                      </Link>

                      <div className="pt-1 border-t border-slate-800/80">
                        <p className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1">Quick Switch Profile:</p>
                        
                        <button
                          onClick={() => { switchDemoUser('patient'); setShowUserMenu(false); }}
                          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 text-left"
                        >
                          <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-cyan-400" /> Sairam (Patient)</span>
                          {user.name.includes('Sairam') && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>

                        <button
                          onClick={() => { switchDemoUser('doctor'); setShowUserMenu(false); }}
                          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 text-left"
                        >
                          <span className="flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5 text-blue-400" /> Dr. Deepthi (Cardiologist)</span>
                          {user.name.includes('Deepthi') && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                      </div>

                      <div className="pt-1 border-t border-slate-800">
                        <button
                          onClick={() => { logout(); setShowUserMenu(false); navigate('/login'); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-colors text-left"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-400" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all shadow-sm"
              >
                <LogIn className="w-4 h-4 text-cyan-400" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Direct Book OP CTA Button */}
            <Link 
              to="/search" 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20 hover:scale-105"
            >
              {t('bookNow')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
