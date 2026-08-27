import { Link, useLocation } from 'react-router-dom';
import { Activity, User, Globe, MapPin, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();

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
              to="/search" 
              className={`flex items-center gap-1.5 font-semibold text-sm transition-colors ${isActive('/search') ? 'text-cyan-400' : 'text-slate-300 hover:text-cyan-300'}`}
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span>{t('search')}</span>
            </Link>
          </div>

          {/* Right Section: Language Switcher & User Buttons */}
          <div className="flex items-center space-x-3">
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

            {/* Dashboard / User link */}
            <Link 
              to="/dashboard" 
              className="text-slate-300 hover:text-cyan-400 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors"
              title={t('myBookings')}
            >
              <User className="h-5 w-5" />
            </Link>

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
