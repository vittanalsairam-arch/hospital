import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, GraduationCap, Award, MapPin, Building2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { AudioButton } from '../components/VoiceAssistant';

const API_URL = 'http://localhost:5000/api';

export default function DoctorsList() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { hospital, department, issueName } = location.state || {};
  
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

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
        
        {/* Header Panel */}
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Doctors for {issueName || department?.name || 'All Specialties'}
            </h1>
            <p className="text-slate-300 text-sm mt-1 flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-cyan-400" />
              <span>{hospital?.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AudioButton 
              textToRead={`Showing ${doctors.length} doctors at ${hospital?.name} for ${issueName || 'treatment'}.`}
            />
            <span className="text-xs font-bold bg-slate-900 px-4 py-2 rounded-xl border border-slate-700 text-cyan-300">
              {doctors.length} Doctors Available
            </span>
          </div>
        </div>

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
