import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, startOfToday } from 'date-fns';
import { Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, AlertTriangle, Sparkles, User, MapPin } from 'lucide-react';
import { fetchDoctorById, fetchDoctorAvailability, fetchDoctorAlternatives, createAppointment, generateLiveAppointment } from '../services/apiService';
import { FALLBACK_DOCTORS } from '../data/fallbackData';
import { useLanguage } from '../context/LanguageContext';
import { AudioButton } from '../components/VoiceAssistant';

export default function DoctorAvailability() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [doctor, setDoctor] = useState(location.state?.doctor || null);
  const [hospital, setHospital] = useState(location.state?.hospital || null);

  const today = startOfToday();
  const [selectedDate, setSelectedDate] = useState(today);
  const [schedules, setSchedules] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Alternative Doctors State
  const [alternatives, setAlternatives] = useState([]);
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);
  const [isDoctorUnavailable, setIsDoctorUnavailable] = useState(false);

  // Booking Form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '', patientAge: '', patientGender: 'Male', patientPhone: '', patientEmail: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  const next7Days = [...Array(7)].map((_, i) => addDays(today, i));

  // Fetch doctor info if opened via direct URL
  useEffect(() => {
    if (!doctor) {
      fetchDoctorById(id)
        .then(docData => {
          if (docData) {
            setDoctor(docData);
            setHospital(docData.hospitalId);
          }
        })
        .catch(err => {
          const fallback = FALLBACK_DOCTORS.find(d => d._id === id) || FALLBACK_DOCTORS[0];
          setDoctor(fallback);
          setHospital(fallback.hospitalId);
        });
    }
  }, [id, doctor]);

  // Fetch Availability & Alternatives
  useEffect(() => {
    const docId = id || doctor?._id;
    if (!docId) return;
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    
    fetchDoctorAvailability(docId, formattedDate)
      .then(data => {
        const slots = Array.isArray(data) ? data : [];
        setSchedules(slots);
        const hasFree = slots.some(s => s.status === 'AVAILABLE' && s.bookedSlots < s.totalSlots);
        setIsDoctorUnavailable(!hasFree);
      })
      .catch(err => {
        console.error(err);
      });

    // Fetch alternative doctors
    setLoadingAlternatives(true);
    fetchDoctorAlternatives(docId)
      .then(data => setAlternatives(Array.isArray(data) ? data : []))
      .catch(err => console.error(err))
      .finally(() => setLoadingAlternatives(false));

  }, [id, doctor?._id, selectedDate]);

  const handleBooking = async (e) => {
    if (e) e.preventDefault();
    const validSchedules = Array.isArray(schedules) ? schedules : [];
    if (!selectedSlot && validSchedules.length > 0) {
      setSelectedSlot(validSchedules.find(s => s.status === 'AVAILABLE') || validSchedules[0]);
    }
    
    setBookingLoading(true);
    try {
      const slotTime = selectedSlot ? selectedSlot.startTime : '10:00 AM';
      const payload = {
        ...formData,
        hospitalId: hospital?._id || doctor?.hospitalId?._id || doctor?.hospitalId,
        doctorId: doctor?._id || id,
        departmentId: doctor?.departmentId?._id || doctor?.departmentId,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: slotTime
      };
      
      const appt = await createAppointment(payload);
      navigate(`/confirmation/${appt.appointmentId || appt._id}`, { state: { appointment: appt } });
    } catch (err) {
      console.warn('Booking error fallback:', err);
      const appt = await generateLiveAppointment({
        patientName: formData.patientName || 'Sairam Vittanala',
        patientPhone: formData.patientPhone || '+91 98765 43210',
        specialization: doctor?.specialization
      });
      navigate(`/confirmation/${appt.appointmentId || appt._id}`, { state: { appointment: appt } });
    } finally {
      setBookingLoading(false);
    }
  };

  const validSchedules = Array.isArray(schedules) ? schedules : [];
  const validAlternatives = Array.isArray(alternatives) ? alternatives : [];
  const availableSlotsCount = validSchedules.filter(s => s.status === 'AVAILABLE' && s.bookedSlots < s.totalSlots).length;

  return (
    <div className="min-h-screen medical-bg-mesh text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Doctor Main Header Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <img 
                src={doctor?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.name || 'Doctor')}&background=0055D4&color=fff`} 
                alt={doctor?.name} 
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-xl"
              />
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{doctor?.name}</h1>
                  {(!isDoctorUnavailable && availableSlotsCount > 0) ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {t('available')}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/40 flex items-center gap-1 animate-pulse">
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      {t('unavailable')}
                    </span>
                  )}
                </div>

                <p className="text-cyan-400 font-bold text-sm sm:text-base">{doctor?.specialization} ({doctor?.qualification})</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap justify-center sm:justify-start">
                  <span className="text-slate-300 text-xs sm:text-sm flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{hospital?.name || doctor?.hospitalId?.name}</span>
                  </span>
                  {(hospital?.imageUrl || doctor?.hospitalId?.imageUrl) && (
                    <img 
                      src={hospital?.imageUrl || doctor?.hospitalId?.imageUrl} 
                      alt="Hospital Exterior Out-View"
                      title="Hospital Exterior Out-View"
                      className="w-8 h-8 rounded-lg object-cover border border-cyan-400/40 shadow-sm"
                    />
                  )}
                </div>

                {/* Voice Reader for Doctor Details */}
                <div className="mt-3">
                  <AudioButton 
                    textToRead={`Doctor ${doctor?.name}, ${doctor?.specialization}. Consultation Fee is ${doctor?.consultationFee} rupees. Status is ${availableSlotsCount > 0 ? 'Available' : 'Currently Unavailable'}.`}
                    label="🔊 Listen Doctor Info"
                  />
                </div>
              </div>
            </div>

            {/* Consultation Fee & Simulator Toggle */}
            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="bg-slate-900/90 border border-slate-700/80 px-6 py-3 rounded-2xl text-center shadow-inner">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Fee</p>
                <p className="text-2xl font-extrabold text-white">₹{doctor?.consultationFee || 700}</p>
              </div>

              {/* Demo Toggle to simulate Doctor Full / Unavailable state */}
              <button
                onClick={() => setIsDoctorUnavailable(!isDoctorUnavailable)}
                className="text-[11px] text-cyan-300 hover:text-cyan-200 underline font-medium cursor-pointer"
                title="Click to test alternative doctor recommendation system"
              >
                {isDoctorUnavailable ? '🔄 Switch to Available Mode' : '⚡ Simulate Doctor Unavailable'}
              </button>
            </div>
          </div>
        </div>

        {/* ALTERNATIVE DOCTORS PROMINENT BANNER (Shown when Doctor is Unavailable / Full) */}
        {(isDoctorUnavailable || availableSlotsCount === 0) && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-amber-500/50 bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-rose-950/40 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-amber-500/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-200">{t('alternativeDoctors')}</h3>
                  <p className="text-xs text-amber-300/80 mt-0.5">
                    {doctor?.name} is currently full/unavailable. Here are top recommended available doctors in the same department & hospital:
                  </p>
                </div>
              </div>

              <AudioButton 
                textToRead={`${doctor?.name} is currently unavailable. Recommended alternative doctors in ${doctor?.specialization} are available below for instant booking.`}
              />
            </div>

            {/* Alternatives Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {alternatives.map(altDoc => (
                <div 
                  key={altDoc._id}
                  className="bg-slate-900/90 p-4 rounded-2xl border border-amber-500/30 hover:border-amber-400 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <img 
                      src={altDoc.profileImage} 
                      alt={altDoc.name}
                      className="w-12 h-12 rounded-xl object-cover border border-cyan-400/50" 
                    />
                    <div>
                      <h4 className="font-bold text-sm text-white">{altDoc.name}</h4>
                      <p className="text-xs text-cyan-300">{altDoc.specialization}</p>
                      <p className="text-[11px] text-slate-400">{altDoc.hospitalId?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Available
                    </span>
                    <span className="text-slate-300 font-bold">₹{altDoc.consultationFee}</span>
                  </div>

                  <button
                    onClick={() => {
                      setDoctor(altDoc);
                      setHospital(altDoc.hospitalId);
                      setIsDoctorUnavailable(false);
                      navigate(`/doctor/${altDoc._id}/availability`, { state: { doctor: altDoc, hospital: altDoc.hospitalId } });
                    }}
                    className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    Select Alternative Doctor
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MAIN SLOTS & BOOKING SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            
            {/* Date Selector */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-700/80">
              <h2 className="text-lg font-bold text-white flex items-center mb-4">
                <CalendarIcon className="w-5 h-5 mr-2 text-cyan-400" /> Select Date
              </h2>
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {next7Days.map(date => {
                  const isSelected = date.getTime() === selectedDate.getTime();
                  return (
                    <button
                      key={date.toString()}
                      onClick={() => { setSelectedDate(date); setSelectedSlot(null); setShowForm(false); }}
                      className={`flex-shrink-0 w-20 py-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                        isSelected 
                          ? 'border-cyan-400 bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' 
                          : 'border-slate-700/80 bg-slate-900/60 text-slate-300 hover:border-cyan-500/50'
                      }`}
                    >
                      <span className={`text-xs font-semibold mb-1 ${isSelected ? 'text-cyan-100' : 'text-slate-400'}`}>{format(date, 'MMM')}</span>
                      <span className="text-xl font-extrabold">{format(date, 'dd')}</span>
                      <span className={`text-xs font-semibold mt-1 ${isSelected ? 'text-cyan-100' : 'text-slate-400'}`}>{format(date, 'EEE')}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots Grid */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-700/80">
              <h2 className="text-lg font-bold text-white flex items-center mb-6">
                <Clock className="w-5 h-5 mr-2 text-cyan-400" /> Available Time Slots on {format(selectedDate, 'dd MMM, yyyy')}
              </h2>

              {isDoctorUnavailable ? (
                <div className="text-center py-8 bg-slate-900/80 rounded-2xl border border-rose-500/30 p-6 space-y-3">
                  <XCircle className="w-10 h-10 text-rose-400 mx-auto animate-pulse" />
                  <h4 className="text-lg font-bold text-white">No Slots Available for {doctor?.name}</h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Please choose one of the recommended alternative doctors above or select another date.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {schedules.map((slot) => {
                    const isFull = slot.status === 'FULL' || slot.bookedSlots >= slot.totalSlots;
                    const isSelected = selectedSlot?._id === slot._id;

                    return (
                      <button
                        key={slot._id}
                        disabled={isFull}
                        onClick={() => { setSelectedSlot(slot); setShowForm(true); }}
                        className={`relative py-3 rounded-xl border-2 font-bold text-xs transition-all ${
                          isFull 
                            ? 'bg-slate-900/50 border-slate-800 text-slate-500 cursor-not-allowed' 
                            : isSelected
                            ? 'bg-cyan-500 text-white border-cyan-400 ring-2 ring-cyan-300 shadow-lg shadow-cyan-500/30'
                            : 'bg-slate-900 border-slate-700 text-cyan-300 hover:border-cyan-400 hover:bg-slate-800'
                        }`}
                      >
                        {slot.startTime} {isFull ? '(FULL)' : ''}
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 absolute top-2 right-2 text-white" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Booking Form Sidebar */}
          <div>
            <AnimatePresence>
              {showForm && selectedSlot && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-panel p-6 rounded-3xl border border-cyan-500/40 shadow-2xl sticky top-24 space-y-4"
                >
                  <div className="border-b border-slate-700/80 pb-3">
                    <h3 className="text-lg font-bold text-white">Hospital OP</h3>
                    <p className="text-xs text-cyan-300">
                      Date: <span className="font-bold text-white">{format(selectedDate, 'dd MMM')}</span> at <span className="font-bold text-white">{selectedSlot.startTime}</span>
                    </p>
                  </div>
                  
                  <form onSubmit={handleBooking} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Patient Full Name</label>
                      <input required type="text" value={formData.patientName} onChange={e=>setFormData({...formData, patientName: e.target.value})} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400" placeholder="e.g. Rajesh Kumar" />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-slate-300 font-bold mb-1">Age</label>
                        <input required type="number" value={formData.patientAge} onChange={e=>setFormData({...formData, patientAge: e.target.value})} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400" placeholder="32" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-slate-300 font-bold mb-1">Gender</label>
                        <select value={formData.patientGender} onChange={e=>setFormData({...formData, patientGender: e.target.value})} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400">
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Mobile Phone Number</label>
                      <input required type="tel" value={formData.patientPhone} onChange={e=>setFormData({...formData, patientPhone: e.target.value})} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400" placeholder="9876543210" />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Email</label>
                      <input required type="email" value={formData.patientEmail} onChange={e=>setFormData({...formData, patientEmail: e.target.value})} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400" placeholder="rajesh@example.com" />
                    </div>
                    
                    <button 
                      disabled={bookingLoading} 
                      type="submit" 
                      className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/25 flex justify-center items-center text-sm"
                    >
                      {bookingLoading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> : 'Confirm Hospital OP'}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
