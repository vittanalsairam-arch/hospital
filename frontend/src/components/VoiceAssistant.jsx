import { useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { speakText, stopSpeech } from '../utils/speech';


export function AudioButton({ textToRead, className = "", label }) {
  const { lang, t } = useLanguage();
  const [speaking, setSpeaking] = useState(false);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (speaking) {
      stopSpeech();
      setSpeaking(false);
    } else {
      if (!textToRead) return;
      setSpeaking(true);
      speakText(textToRead, lang);
      // Auto reset status after estimated speech length
      const words = String(textToRead).split(' ').length;
      setTimeout(() => setSpeaking(false), words * 400 + 1000);
    }
  };

  return (
    <button
      onClick={handleToggle}
      title="Click to hear text spoken out loud"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm ${
        speaking 
          ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30 ring-2 ring-rose-300' 
          : 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 hover:border-cyan-400'
      } ${className}`}
    >
      {speaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      <span>{speaking ? t('stopAudio') : (label || t('listenBtn'))}</span>
    </button>
  );
}

export default function VoiceAssistantWidget() {
  const { lang, t } = useLanguage();
  const [isActive, setIsActive] = useState(false);

  const handleGlobalVoiceHelp = () => {
    const welcomeMsg = t('easyVoiceGuide');
    speakText(welcomeMsg, lang);
    setIsActive(true);
    setTimeout(() => setIsActive(false), 5000);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
      <button
        onClick={handleGlobalVoiceHelp}
        className={`flex items-center gap-2 px-4 py-3 rounded-full font-bold text-sm shadow-xl transition-all ${
          isActive 
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white ring-4 ring-emerald-400/50 scale-105' 
            : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/25 border border-white/20 hover:scale-105'
        }`}
      >
        <Volume2 className="w-5 h-5 animate-bounce" />
        <span className="hidden sm:inline">🔊 Voice Helper</span>
        <Sparkles className="w-4 h-4 text-yellow-300" />
      </button>
    </div>
  );
}
