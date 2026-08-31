import { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  ExternalLink, 
  Sparkles, 
  Apple, 
  ShieldCheck, 
  CheckCircle2, 
  Laptop, 
  Send,
  Radio,
  ArrowRight
} from 'lucide-react';
import { usePWA } from '../context/PWAContext';

export default function InstallAppModal() {
  const { isModalOpen, closeModal, isInstallable, isInstalled, installApp, platform, getShareableUrl } = usePWA();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('qr'); // 'qr' | 'install' | 'guide' | 'apk'
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.origin);
    }
  }, []);

  if (!isModalOpen) return null;

  const appUrl = currentUrl || getShareableUrl();
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(appUrl)}&color=0ea5e9&bgcolor=0f172a&margin=10`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MediOP – National Hospital OP Booking Portal',
          text: 'Book Outpatient (OP) doctor appointments across all 29 Indian States on MediOP App!',
          url: appUrl,
        });
      } catch (err) {
        console.log('Share canceled or not supported');
      }
    } else {
      handleCopyLink();
    }
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`🏥 *MediOP – National Hospital OP Booking App*\n\nBook doctor appointments across all 29 States & 373 Districts of India.\n\n📲 Open App Link:\n${appUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareViaTelegram = () => {
    const text = encodeURIComponent(`🏥 MediOP – National Hospital OP Booking App across all 29 States of India`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel bg-slate-900/95 border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950/80 overflow-hidden">
        {/* Top Gradient Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-lg shadow-cyan-500/30">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">MediOP App Link & Install</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> PWA 2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">Scan QR, install on your device, or share universal app link</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 pt-3 gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'qr'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Mobile App Link & QR</span>
          </button>
          <button
            onClick={() => setActiveTab('install')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'install'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>1-Click Install App</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'guide'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Installation Guide</span>
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'apk'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            <span>APK & Store Package</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* TAB 1: QR CODE & APP LINK */}
          {activeTab === 'qr' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                {/* QR Code Card */}
                <div className="flex flex-col items-center justify-center p-5 bg-slate-950/80 border border-slate-800 rounded-2xl shadow-inner text-center">
                  <div className="relative p-2 bg-slate-900 border-2 border-cyan-500/40 rounded-2xl shadow-lg shadow-cyan-500/10 group">
                    <img 
                      src={qrCodeUrl} 
                      alt="MediOP Mobile App QR Code" 
                      className="w-44 h-44 rounded-xl object-contain"
                      loading="eager"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/60 rounded-xl">
                      <span className="text-[11px] font-bold text-cyan-300 bg-slate-900/90 px-2 py-1 rounded-md border border-cyan-500/40">Point Camera to Open</span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    Scan with Phone Camera
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Works on any iOS or Android phone</p>
                </div>

                {/* Direct App Link & Share Buttons */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                      Direct Web App Link:
                    </label>
                    <div className="flex items-center gap-2 p-2 bg-slate-950/90 border border-slate-800 rounded-xl">
                      <input 
                        type="text" 
                        readOnly 
                        value={appUrl} 
                        className="bg-transparent text-xs text-cyan-300 font-mono flex-1 outline-none px-2 select-all"
                      />
                      <button
                        onClick={handleCopyLink}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                          copied 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                            : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                        }`}
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Instant Social Share */}
                  <div>
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Instant Share:</p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={shareViaWhatsApp}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-colors"
                      >
                        <Send className="w-3.5 h-3.5 text-emerald-400" />
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={shareViaTelegram}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sky-950/50 hover:bg-sky-900/60 border border-sky-500/40 text-sky-300 text-xs font-bold transition-colors"
                      >
                        <Send className="w-3.5 h-3.5 text-sky-400" />
                        <span>Telegram</span>
                      </button>
                      <button
                        onClick={handleNativeShare}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/40 text-purple-300 text-xs font-bold transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5 text-purple-400" />
                        <span>Share API</span>
                      </button>
                    </div>
                  </div>

                  {/* Highlights Pill */}
                  <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl space-y-1">
                    <p className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" /> Instant Access, Zero App Store Waiting
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Patients don't need to download large 100MB files. Opens in &lt;1 second on 4G/5G.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 1-CLICK DIRECT INSTALL */}
          {activeTab === 'install' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 text-center space-y-4">
                <div className="inline-flex p-4 rounded-3xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-xl shadow-cyan-500/20">
                  <Smartphone className="w-10 h-10 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">Install MediOP as a Native App</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                    Install directly to your home screen or desktop application bar. Runs in full-screen standalone mode with offline OPD slot caching.
                  </p>
                </div>

                {isInstalled ? (
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>App is already installed on this device!</span>
                  </div>
                ) : (
                  <button
                    onClick={installApp}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/30 transition-all hover:scale-105 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isInstallable ? 'Click to Install MediOP Now' : 'Install on This Device'}</span>
                  </button>
                )}

                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-left">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <p className="text-xs font-bold text-white">⚡ Instant Launch</p>
                    <p className="text-[10px] text-slate-400">Starts in under 300ms</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <p className="text-xs font-bold text-white">📴 Offline Ready</p>
                    <p className="text-[10px] text-slate-400">View saved tickets offline</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <p className="text-xs font-bold text-white">🔒 Sandboxed</p>
                    <p className="text-[10px] text-slate-400">Zero battery drain</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STEP-BY-STEP PLATFORM GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              {/* Android Guide */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Smartphone className="w-4 h-4" />
                  <span>Android (Chrome, Edge, Samsung Internet, Brave)</span>
                </div>
                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside">
                  <li>Open the App Link in <strong>Google Chrome</strong> or <strong>Edge</strong>.</li>
                  <li>Tap the <strong>three dots (⋮)</strong> menu in the top right corner.</li>
                  <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  <li>Tap <strong>Install</strong> to add the MediOP icon to your phone apps grid.</li>
                </ol>
              </div>

              {/* iOS / iPhone Guide */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                  <Apple className="w-4 h-4" />
                  <span>iOS / iPhone & iPad (Safari Browser)</span>
                </div>
                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside">
                  <li>Open the App Link in <strong>Safari</strong> on your iPhone.</li>
                  <li>Tap the <strong>Share button (⬆ box with arrow)</strong> at the bottom center.</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong> (➕).</li>
                  <li>Tap <strong>Add</strong> in the top right. MediOP will appear as a native iPhone app.</li>
                </ol>
              </div>

              {/* Desktop Guide */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                  <Laptop className="w-4 h-4" />
                  <span>Windows & macOS (Chrome, Edge, Brave)</span>
                </div>
                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside">
                  <li>Look for the <strong>Install icon (⊕ or computer with arrow)</strong> on the right side of the browser URL bar.</li>
                  <li>Click <strong>Install</strong> to pin MediOP to your Taskbar or Dock.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 4: APK & PLAY STORE PACKAGE */}
          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <ExternalLink className="w-4 h-4" />
                  <span>Convert into Google Play Store APK / AAB Bundle</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Because MediOP is built with full <strong>PWA 2.0 Web Standards</strong> (Web Manifest, Service Worker, and Digital Asset Links), you can generate a signed <strong>Android .APK / .AAB</strong> in 60 seconds with zero coding.
                </p>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">Step 1</span>
                    <p className="text-slate-300">Deploy this project to your public URL (or use tunnel like Cloudflare / Vercel).</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">Step 2</span>
                    <p className="text-slate-300">Go to <a href="https://www.pwabuilder.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-bold">PWABuilder.com</a> (Microsoft's official PWA to APK tool).</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">Step 3</span>
                    <p className="text-slate-300">Paste your URL and click <strong>"Package for Android"</strong> to download the ready-to-publish APK!</p>
                  </div>
                </div>
                <a
                  href="https://www.pwabuilder.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-cyan-500/30"
                >
                  <span>Open PWABuilder Packaging Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-500">Universal Web App Link • No download needed</span>
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
