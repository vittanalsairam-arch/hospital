import { useState, useEffect } from 'react';
import { Smartphone, Download, QrCode, X, Sparkles } from 'lucide-react';
import { usePWA } from '../context/PWAContext';

export default function InstallAppBanner() {
  const { openModal, isInstalled } = usePWA();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Show mini toast after 3 seconds if not in standalone mode and not dismissed
    const dismissed = sessionStorage.getItem('mediop_pwa_dismissed');
    if (!isInstalled && !dismissed) {
      const timer = setTimeout(() => setShowToast(true), 3500);
      return () => clearTimeout(timer);
    }
  }, [isInstalled]);

  const handleDismiss = (e) => {
    e.stopPropagation();
    setShowToast(false);
    sessionStorage.setItem('mediop_pwa_dismissed', 'true');
  };

  return (
    <>
      {/* Mini Toast Notification for First-time mobile visitors */}
      {showToast && (
        <div 
          onClick={openModal}
          className="fixed bottom-20 left-4 z-40 max-w-sm glass-panel bg-slate-900/95 border border-cyan-500/50 rounded-2xl p-3.5 shadow-2xl shadow-cyan-950/80 cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-300 hover:border-cyan-400 group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-md shadow-cyan-500/30 group-hover:scale-105 transition-transform">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 pr-2">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-black text-white">Get the MediOP App</p>
                <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded-full font-bold">Fast</span>
              </div>
              <p className="text-[11px] text-slate-400">Scan QR or install to your home screen</p>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button on Bottom Left */}
      <button
        onClick={openModal}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full glass-panel bg-slate-900/90 hover:bg-slate-800/95 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs font-extrabold shadow-xl shadow-cyan-950/70 hover:scale-105 transition-all cursor-pointer group"
        title="Open App Link & Install Modal"
      >
        <div className="relative">
          <Smartphone className="w-4 h-4 text-cyan-400 group-hover:text-white transition-colors" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
        </div>
        <span className="hidden sm:inline">📱 App Link / Install</span>
        <span className="sm:hidden">App</span>
      </button>
    </>
  );
}
