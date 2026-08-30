import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, XCircle, FileText, CheckCircle2, User, LogIn, Phone, Mail } from 'lucide-react';
import { AudioButton } from '../components/VoiceAssistant';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const appointments = [
    { id: 'MEDOP-2026-000128', doctor: 'Dr. Deepthi', dept: 'Cardiology', hospital: 'Apollo Super Specialty Hospital', date: '2026-08-28', time: '10:30 AM', status: 'Confirmed', type: 'upcoming' },
    { id: 'MEDOP-2026-000095', doctor: 'Dr. Sneha Verma', dept: 'Neurology', hospital: 'Care Multi-Specialty Hospital', date: '2026-07-20', time: '11:00 AM', status: 'Completed', type: 'past' },
    { id: 'MEDOP-2026-000042', doctor: 'Dr. Vikram Rao', dept: 'Orthopedics', hospital: 'KIMS Medical Institute', date: '2026-06-15', time: '09:30 AM', status: 'Cancelled', type: 'cancelled' }
  ];

  const filtered = appointments.filter(a => a.type === activeTab);

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
        
        {/* User Profile & Hospital Member Header Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
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
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  🏥 {user.role === 'doctor' ? 'Verified Hospital Doctor' : 'Verified Hospital OP Member'}
                </span>
                <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono px-2 py-0.5 rounded-md">
                  ABHA ID: {user.abhaId || '9821-4412-8820'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h1>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">
                {user.email} • {user.phone || '+91 98765 43210'} • {user.city || 'Visakhapatnam'}, {user.state || 'Andhra Pradesh'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
            <AudioButton 
              textToRead={`Welcome ${user.name}. This is your hospital OP dashboard. You have one upcoming cardiology appointment with Doctor Deepthi at Apollo Super Specialty Hospital.`}
              label="🔊 Read Profile Summary"
              className="py-2.5 px-4 text-xs font-bold"
            />
            <span className="text-[11px] text-cyan-300 font-semibold">Active Health Pass ID: #MEDOP-9942</span>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex space-x-2 glass-panel p-1.5 rounded-2xl w-max border border-slate-700/80">
          {['upcoming', 'past', 'cancelled'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${
                activeTab === tab 
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab} Tickets
            </button>
          ))}
        </div>
        
        {/* Appointments List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-2 glass-panel p-12 text-center text-slate-400 rounded-3xl">
              No {activeTab} appointments found.
            </div>
          ) : (
            filtered.map(app => (
              <motion.div 
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 rounded-3xl border border-slate-700/80 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase inline-block mb-2 ${
                      app.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 
                      app.status === 'Cancelled' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {app.status}
                    </span>
                    <h3 className="text-xl font-bold text-white">{app.doctor}</h3>
                    <p className="text-cyan-400 font-bold text-xs">{app.dept}</p>
                  </div>
                  <p className="text-xs text-cyan-300 font-mono bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-700">
                    {app.id}
                  </p>
                </div>
                
                <div className="bg-slate-900/80 rounded-2xl p-4 grid grid-cols-2 gap-3 border border-slate-800 text-xs">
                  <div>
                    <p className="text-slate-400 mb-0.5 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-cyan-400"/> Date</p>
                    <p className="font-bold text-white">{app.date}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-0.5 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-cyan-400"/> Time</p>
                    <p className="font-bold text-white">{app.time}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-400 mb-0.5 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-cyan-400"/> Hospital</p>
                    <p className="font-bold text-white">{app.hospital}</p>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <AudioButton 
                    textToRead={`Appointment ${app.id} for ${app.doctor} at ${app.hospital} on ${app.date} at ${app.time}. Status is ${app.status}.`}
                    label="🔊 Read Ticket"
                    className="flex-1 justify-center py-2.5"
                  />
                </div>
              </motion.div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
