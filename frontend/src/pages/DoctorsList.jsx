import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, GraduationCap, Award, MapPin, Building2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { AudioButton } from '../components/VoiceAssistant';
import HospitalDetailsModal from '../components/HospitalDetailsModal';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function DoctorsList() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { hospital, department, issueName } = location.state || {};
  
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHospitalModal, setShowHospitalModal] = useState(false);

  useEffect(() => {
    if (!hospital) {
      navigate('/search');
      return;
    }

    const fetchDoctors = async () => {
      try {
        let url = `${API_URL}/doctors?hospitalId=${hospital._id}`;
        if (department?._id) url += `&departmentId=${department._id}`;
        const res = await axios.get(url);
        setDoctors(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [hospital, department, navigate]);

  return (
    <div className="min-h-screen medical-bg-mesh text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Hospital Profile Card with Out-View Photo & Mandal Info */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 relative overflow-hidden shadow-2xl space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            
            {/* Hospital Out-View Photo */}
            <div className="relative group shrink-0 rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-xl w-full lg:w-72 h-48">
              <img 
                src={hospital?.imageUrl || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80'} 
                alt={hospital?.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[11px] font-bold text-white bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 flex items-center gap-1.5 shadow-md">
                  🏢 <span>Hospital Exterior Out-View</span>
                </span>
              </div>
            </div>

            {/* Hospital Profile Details */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  🏛️ <span>{hospital?.hospitalType || 'Multi-Specialty Area Hospital'}</span>
                </span>
                {hospital?.emergencyAvailable && (
                  <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1">
                    🚨 <span>24x7 Emergency Ready</span>
                  </span>
                )}
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-full text-xs font-bold">
                  ★ {hospital?.rating || 4.8} / 5.0
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {hospital?.name}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                <p className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span className="font-medium text-slate-200">{hospital?.address || 'City Central Hub'}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Bed Capacity: <strong className="text-white">{hospital?.bedCapacity || 350}+ Beds</strong></span>
                </p>
                {hospital?.phone && (
                  <p className="flex items-center gap-1.5">
                    <span className="text-cyan-400">📞 Helpdesk:</span>
                    <span className="font-mono text-cyan-200 font-bold">{hospital.phone}</span>
                  </p>
                )}
                <p className="flex items-center gap-1.5">
                  <span className="text-cyan-400">📅 Est:</span>
                  <span className="text-slate-200">Year {hospital?.establishedYear || 2005}</span>
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                <div className="flex items-center gap-2 flex-wrap">
                  <AudioButton 
                    textToRead={`Welcome to ${hospital?.name}, a ${hospital?.hospitalType || 'Multi-Specialty'} facility located at ${hospital?.address}. There are ${doctors.length} doctors currently available for booking.`}
                    label="🔊 Listen Hospital Info"
                    className="px-3 py-1.5 text-xs font-bold"
                  />
                  <button
                    onClick={() => setShowHospitalModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>View Top-to-Bottom Branch Profile</span>
                  </button>
                </div>
                <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>OP Registration Active for Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hospital Top-to-Bottom Details Modal */}
        <HospitalDetailsModal 
          hospital={hospital}
          isOpen={showHospitalModal}
          onClose={() => setShowHospitalModal(false)}
        />

        {/* Doctors Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-cyan-300 text-xs font-bold mt-4">Loading Doctors...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doctors.map((doctor, idx) => (
              <motion.div 
                key={doctor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="glass-card p-6 rounded-3xl border border-slate-700/80 hover:border-cyan-400 transition-all flex flex-col justify-between"
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  <img 
                    src={doctor.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0055D4&color=fff`} 
                    alt={doctor.name} 
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-cyan-400/50 shadow-md shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white">{doctor.name}</h3>
                        <p className="text-cyan-400 font-bold text-sm">{doctor.specialization}</p>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        AVAILABLE
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-300">
                      <p className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-cyan-400" /> {doctor.qualification}</p>
                      <p className="flex items-center gap-1.5"><Award className="w-4 h-4 text-cyan-400" /> {doctor.experience} Years Experience</p>
                      <p className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-cyan-400" /> {hospital?.name}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Fee & Schedule Button */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Consultation Fee</p>
                    <p className="text-xl font-extrabold text-white">₹{doctor.consultationFee}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <AudioButton 
                      textToRead={`Doctor ${doctor.name}, ${doctor.specialization}. Consultation Fee ${doctor.consultationFee} rupees.`}
                      label="🔊"
                      className="px-2 py-2 text-xs"
                    />

                    <button 
                      onClick={() => navigate(`/doctor/${doctor._id}/availability`, { state: { doctor, hospital } })}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
                    >
                      <Calendar className="w-4 h-4" /> View OP Slots
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
