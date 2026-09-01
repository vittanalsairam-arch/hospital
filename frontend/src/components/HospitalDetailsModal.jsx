import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Hospital, MapPin, Phone, Mail, Globe, ShieldCheck, 
  Award, Activity, CheckCircle2, Bed, HeartPulse, Stethoscope, 
  Calendar, Clock, AlertCircle, ArrowRight, ExternalLink, Sparkles, Building2, Flame
} from 'lucide-react';
import { AudioButton } from './VoiceAssistant';

export default function HospitalDetailsModal({ hospital, isOpen, onClose, onBookDoctor }) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!isOpen || !hospital) return null;

  const galleryPhotos = hospital.gallery && hospital.gallery.length > 0 
    ? hospital.gallery 
    : [hospital.imageUrl || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80'];

  const getTierColor = (tier) => {
    if (!tier) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    if (tier.includes('Tier 7') || tier.includes('Apex')) return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    if (tier.includes('Tier 6') || tier.includes('Super-Specialty')) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    if (tier.includes('Tier 5')) return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    if (tier.includes('Tier 4')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (tier.includes('Tier 3')) return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    if (tier.includes('Tier 2')) return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
    return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
  };

  const speechOverview = `${hospital.name}, ${hospital.branchCode ? `Branch Code ${hospital.branchCode}` : ''}. ${hospital.tier || 'Hospital'}. Part of ${hospital.parentChain || 'National Healthcare Network'}. It has a total capacity of ${hospital.bedCapacity || 250} beds, including ${hospital.icuBeds || 35} ICU beds and ${hospital.operationTheatres || 6} modular operation theatres. Emergency is active 24 by 7. Official schemes accepted include ${hospital.governmentSchemes ? hospital.governmentSchemes.slice(0, 3).join(', ') : 'Ayushman Bharat'}.`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
        
        {/* Backdrop Click */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Modal Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl glass-panel bg-slate-900/95 border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 max-h-[92vh] flex flex-col text-slate-100"
        >
          
          {/* Header Bar */}
          <div className="relative p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getTierColor(hospital.tier)}`}>
                  {hospital.tier || 'Hospital Branch'}
                </span>
                <span className="text-[10px] font-mono bg-slate-800 text-cyan-300 border border-slate-700 px-2 py-0.5 rounded-md font-bold">
                  Code: {hospital.branchCode || 'BR-MED-001'}
                </span>
                {hospital.emergencyAvailable && (
                  <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                    <HeartPulse className="w-3 h-3 text-rose-400" /> 24x7 Emergency Ready
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{hospital.name}</h2>
              <p className="text-xs text-cyan-400 font-semibold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Parent Network: <span className="text-slate-200">{hospital.parentChain || 'National Healthcare Network'}</span>
              </p>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1">
            
            {/* Top Row: Photo Gallery & Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* Left: Interactive Campus Photo Gallery */}
              <div className="md:col-span-7 space-y-2.5">
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-700 shadow-xl group">
                  <img 
                    src={galleryPhotos[activePhotoIdx]} 
                    alt={hospital.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white border border-slate-700">
                    📷 Campus View {activePhotoIdx + 1} of {galleryPhotos.length}
                  </div>
                </div>

                {/* Thumbnails */}
                {galleryPhotos.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {galleryPhotos.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePhotoIdx(idx)}
                        className={`aspect-video rounded-lg overflow-hidden border transition-all cursor-pointer ${
                          activePhotoIdx === idx 
                            ? 'border-cyan-400 ring-2 ring-cyan-400/40 scale-105' 
                            : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Hospital Key Metrics & Infrastructure */}
              <div className="md:col-span-5 flex flex-col justify-between space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="glass-panel p-3 rounded-2xl border border-cyan-500/20 text-center">
                    <Bed className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                    <p className="text-[10px] uppercase font-bold text-slate-400">Total Beds</p>
                    <p className="text-lg font-black text-white">{hospital.bedCapacity || 250}+</p>
                  </div>

                  <div className="glass-panel p-3 rounded-2xl border border-rose-500/20 text-center">
                    <HeartPulse className="w-5 h-5 text-rose-400 mx-auto mb-1" />
                    <p className="text-[10px] uppercase font-bold text-slate-400">ICU / CCU Beds</p>
                    <p className="text-lg font-black text-white">{hospital.icuBeds || 40}+</p>
                  </div>

                  <div className="glass-panel p-3 rounded-2xl border border-amber-500/20 text-center">
                    <Activity className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                    <p className="text-[10px] uppercase font-bold text-slate-400">Modular OTs</p>
                    <p className="text-lg font-black text-white">{hospital.operationTheatres || 6} OTs</p>
                  </div>

                  <div className="glass-panel p-3 rounded-2xl border border-emerald-500/20 text-center">
                    <Award className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                    <p className="text-[10px] uppercase font-bold text-slate-400">Patient Rating</p>
                    <p className="text-lg font-black text-white">★ {hospital.rating || 4.8} / 5</p>
                  </div>
                </div>

                {/* Audio Overview Button */}
                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-1">
                  <AudioButton 
                    textToRead={speechOverview}
                    label="🔊 Listen to Full Hospital Profile"
                    className="w-full justify-center text-xs font-bold py-2"
                  />
                  <p className="text-[10px] text-center text-slate-400 font-medium">Est. {hospital.establishedYear || 2005} • 24x7 Digital OP Enabled</p>
                </div>
              </div>

            </div>

            {/* Address & Emergency Contacts */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Full Campus Address
                </span>
                <p className="text-xs font-medium text-slate-200">{hospital.address}</p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> OPD: {hospital.opdTimings || 'Mon - Sat: 08:00 AM - 08:00 PM'}
                </p>
              </div>

              <div className="space-y-1.5 sm:border-l sm:border-slate-800 sm:pl-4">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-rose-400" /> 24x7 Helplines & Helpdesk
                </span>
                <p className="text-xs font-bold text-rose-300">
                  Ambulance Hotline: <span className="font-mono">{hospital.ambulancePhone || '108'}</span>
                </p>
                <p className="text-xs text-slate-300">
                  OP Helpdesk: <span className="font-mono">{hospital.phone || '0891-2554444'}</span>
                </p>
                <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                  <Mail className="w-3 h-3 text-cyan-400" /> {hospital.email || 'helpdesk@hospitalcare.in'}
                </p>
              </div>
            </div>

            {/* Government Schemes & Insurance */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Empaneled Government Health Schemes & Cashless Insurance
              </h3>
              <div className="flex flex-wrap gap-2">
                {(hospital.governmentSchemes || [
                  'Ayushman Bharat (PM-JAY)', 
                  'Dr. YSR Aarogyasri / State Health Scheme', 
                  'ECHS (Ex-Servicemen)', 
                  'CGHS (Central Govt)', 
                  'All Cashless Private Insurance TPAs'
                ]).map((scheme, idx) => (
                  <span key={idx} className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-xl font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {scheme}
                  </span>
                ))}
              </div>
            </div>

            {/* Advanced In-House Facilities */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Hospital Facilities & Medical Technology
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(hospital.facilities || [
                  '24x7 Emergency & Trauma Bay',
                  'Cardiac Cath Lab & ICU',
                  '3T Digital MRI & CT Scan',
                  '24x7 Blood Bank & Component Lab',
                  'Modular Operation Theatres',
                  'Hemodialysis (20 Units)',
                  'Robotic Surgery Suite',
                  'In-House 24x7 Pharmacy'
                ]).map((fac, idx) => (
                  <div key={idx} className="bg-slate-800/80 border border-slate-700/80 p-2.5 rounded-xl text-xs font-medium text-slate-200 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                    <span className="truncate">{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Accreditations */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 flex-wrap">
              <span className="font-bold text-white flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-400" /> Quality Accreditations:
              </span>
              {(hospital.accreditations || ['NABH Accredited', 'NABL Certified Lab', 'ABDM Digital Health Level-2']).map((acc, idx) => (
                <span key={idx} className="bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-md font-semibold text-[11px] text-cyan-300">
                  {acc}
                </span>
              ))}
            </div>

          </div>

          {/* Footer Action Bar */}
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-400 text-center sm:text-left">
              Live outpatient doctors & time slots are active for this branch.
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Close Profile
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (onBookDoctor) onBookDoctor(hospital);
                }}
                className="w-1/2 sm:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 hover:scale-105 transition-all cursor-pointer"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Hospital OP at this Branch</span>
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
