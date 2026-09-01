import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  XCircle, 
  FileText, 
  CheckCircle2, 
  User, 
  LogIn, 
  Phone, 
  Mail, 
  PlusCircle, 
  Printer, 
  Sparkles, 
  RefreshCw,
  Eye,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { AudioButton } from '../components/VoiceAssistant';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/appointments`, {
        params: {
          phone: user?.phone || '+91 98765 43210',
          email: user?.email || 'sairam@hospitalop.in',
          patientId: user?._id
        }
      });
      if (res.data && res.data.length > 0) {
        setAppointments(res.data);
      } else {
        // Fallback default appointments
        setAppointments([
          { 
            _id: 'sample-1',
            appointmentId: 'MEDOP-2026-88421', 
            doctorId: { name: 'Dr. Deepthi', specialization: 'Cardiologist', qualification: 'MBBS, MD Cardiology' },
            departmentId: { name: 'Cardiology' },
            hospitalId: { name: 'Apollo Super Specialty Hospital', branchCode: 'BR-APO-0001' }, 
            date: new Date().toISOString().split('T')[0], 
            time: '10:30 AM', 
            status: 'Confirmed', 
            opToken: 'OP-02',
            roomNo: 'OPD Room 104, Wing A',
            consultationFee: 900
          }
        ]);
      }
    } catch (err) {
      console.warn('Failed to load appointments from server:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  // Instant Real OP Appointment Generator
  const handleGenerateLive = async () => {
    setGenerating(true);
    try {
      const res = await axios.post(`${API_URL}/appointments/generate-live`, {
        patientName: user?.name || 'Sairam Vittanala',
        patientPhone: user?.phone || '+91 98765 43210',
        patientEmail: user?.email || 'sairam@hospitalop.in',
        patientAge: user?.age || 28,
        patientGender: user?.gender || 'Male',
        abhaId: user?.abhaId || '9821-4412-8820'
      });

      if (res.data) {
        setAppointments(prev => [res.data, ...prev]);
        setToastMessage(`🎉 Real OP Ticket ${res.data.appointmentId} Generated with Token ${res.data.opToken}!`);
        setTimeout(() => setToastMessage(null), 5000);
        // Direct navigation to official printable ticket
        navigate(`/confirmation/${res.data.appointmentId}`, { state: { appointment: res.data } });
      }
    } catch (err) {
      alert('Error generating live appointment: ' + (err.response?.data?.message || err.message));
    } finally {
      setGenerating(false);
    }
  };

  const handleCancelAppointment = async (apptId) => {
    if (!window.confirm('Are you sure you want to cancel this hospital appointment?')) return;
    try {
      await axios.put(`${API_URL}/appointments/${apptId}/cancel`);
      setAppointments(prev => prev.map(a => (a._id === apptId || a.appointmentId === apptId) ? { ...a, status: 'Cancelled' } : a));
      setToastMessage('Appointment marked as cancelled.');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      alert('Failed to cancel: ' + err.message);
    }
  };

  const filtered = appointments.filter(a => {
    if (activeTab === 'upcoming') return a.status === 'Confirmed';
    if (activeTab === 'past') return a.status === 'Completed';
    if (activeTab === 'cancelled') return a.status === 'Cancelled';
    return true;
  });

  if (!user) {
    return (
      <div className="min-h-screen medical-bg-mesh text-slate-100 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-cyan-500/30 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 mx-auto flex items-center justify-center text-cyan-400">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Please Sign In</h2>
          <p className="text-slate-300 text-xs">Sign in with your patient or doctor account to manage your hospital OP tickets.</p>
          <Link 
            to="/login"
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 inline-flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Hospital Portal</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen medical-bg-mesh text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Toast Alert */}
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-cyan-500/20 border border-cyan-400/50 rounded-2xl text-cyan-300 text-sm font-bold flex items-center justify-between shadow-xl"
          >
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-xs text-cyan-400 hover:text-white">✕</button>
          </motion.div>
        )}

        {/* User Profile & Hospital Member Header Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <img 
                src={user.avatar || 'https://images.unsplash.com/photo-1594824813571-638f026361a1?auto=format&fit=crop&w=180&h=180&q=80'} 
                alt={user.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-cyan-400 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 border-2 border-slate-900 rounded-full flex items-center justify-center shadow-md" title="Active Verified Patient">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 font-bold" />
              </span>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {user.role === 'doctor' ? 'Verified Hospital Doctor' : 'Verified ABDM OP Member'}
                </span>
                <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono px-2 py-0.5 rounded-md font-bold">
                  ABHA ID: {user.abhaId || '9821-4412-8820'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h1>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">
                {user.email} • {user.phone || '+91 98765 43210'} • {user.city || 'Visakhapatnam'}, {user.state || 'Andhra Pradesh'}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleGenerateLive}
              disabled={generating}
              className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-slate-950" />}
              <span>{generating ? 'Generating Real OP...' : '⚡ Instant Real OP Booking'}</span>
            </button>

            <Link
              to="/doctors"
              className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book by Doctor</span>
            </Link>
          </div>
        </div>

        {/* Tab Header & Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex space-x-2 glass-panel p-1.5 rounded-2xl border border-slate-700/80">
            {['upcoming', 'past', 'cancelled'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  activeTab === tab 
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab} ({appointments.filter(a => {
                  if (tab === 'upcoming') return a.status === 'Confirmed';
                  if (tab === 'past') return a.status === 'Completed';
                  if (tab === 'cancelled') return a.status === 'Cancelled';
                  return true;
                }).length})
              </button>
            ))}
          </div>

          <button
            onClick={fetchAppointments}
            className="p-2 text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 self-end sm:self-center"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Tickets</span>
          </button>
        </div>
        
        {/* Appointments Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 glass-panel p-12 text-center text-slate-400 rounded-3xl flex items-center justify-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
              <span>Loading live hospital OP tickets...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-2 glass-panel p-12 text-center text-slate-400 rounded-3xl space-y-4">
              <p>No {activeTab} hospital appointments found.</p>
              <button
                onClick={handleGenerateLive}
                className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate a Real OP Appointment Now</span>
              </button>
            </div>
          ) : (
            filtered.map(app => {
              const docName = app.doctorId?.name || 'Dr. Specialist';
              const docDept = app.doctorId?.specialization || app.departmentId?.name || 'Outpatient Consultation';
              const hospName = app.hospitalId?.name || 'Super Specialty Hospital';
              const tokenNo = app.opToken || 'OP-01';
              const room = app.roomNo || 'OPD Room 102';
              const refId = app.appointmentId || app._id;

              return (
                <motion.div 
                  key={refId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6 rounded-3xl border border-slate-700/80 space-y-4 hover:border-cyan-500/50 transition-all shadow-xl"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase inline-block ${
                          app.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 
                          app.status === 'Cancelled' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {app.status}
                        </span>
                        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-mono font-bold px-2 py-0.5 rounded border border-cyan-500/30">
                          Token #{tokenNo}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white">{docName}</h3>
                      <p className="text-cyan-400 font-bold text-xs">{docDept}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-cyan-300 font-mono bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-700 font-bold">
                        {refId}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">{room}</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/80 rounded-2xl p-4 grid grid-cols-2 gap-3 border border-slate-800 text-xs">
                    <div>
                      <p className="text-slate-400 mb-0.5 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-cyan-400"/> Date</p>
                      <p className="font-bold text-white">{app.date}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-0.5 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-cyan-400"/> Time Slot</p>
                      <p className="font-bold text-white">{app.time}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-400 mb-0.5 flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-cyan-400"/> Hospital</p>
                      <p className="font-bold text-white">{hospName}</p>
                    </div>
                  </div>
                  
                  {/* Card Action Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <Link
                      to={`/confirmation/${refId}`}
                      state={{ appointment: app }}
                      className="flex-1 py-2.5 px-4 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Official OP Slip</span>
                    </Link>

                    {app.status === 'Confirmed' && (
                      <button
                        onClick={() => handleCancelAppointment(app._id || app.appointmentId)}
                        className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-all"
                        title="Cancel Appointment"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
