import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, XCircle, FileText, CheckCircle2 } from 'lucide-react';
import { AudioButton } from '../components/VoiceAssistant';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const appointments = [
    { id: 'MEDOP-2026-000128', doctor: 'Dr. Rahul Kumar', dept: 'Cardiology', hospital: 'Apollo Super Specialty Hospital', date: '2026-08-28', time: '10:30 AM', status: 'Confirmed', type: 'upcoming' },
    { id: 'MEDOP-2026-000095', doctor: 'Dr. Sneha Verma', dept: 'Neurology', hospital: 'Care Multi-Specialty Hospital', date: '2026-07-20', time: '11:00 AM', status: 'Completed', type: 'past' },
    { id: 'MEDOP-2026-000042', doctor: 'Dr. Vikram Rao', dept: 'Orthopedics', hospital: 'KIMS Medical Institute', date: '2026-06-15', time: '09:30 AM', status: 'Cancelled', type: 'cancelled' }
  ];

  const filtered = appointments.filter(a => a.type === activeTab);

  return (
    <div className="min-h-screen medical-bg-mesh text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white">My OP Tickets & Dashboard</h1>
            <p className="text-slate-300 text-sm mt-1">Manage your active and past hospital appointments</p>
          </div>
          <AudioButton 
            textToRead="This is your dashboard. You can view upcoming, past, or cancelled hospital OP tickets here."
          />
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
