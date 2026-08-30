import { useLocation, Link, useParams } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Clock, MapPin, Download, Share2 } from 'lucide-react';
import { AudioButton } from '../components/VoiceAssistant';

export default function BookingConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const { appointment } = location.state || {};

  const apptId = id || appointment?.appointmentId || 'MEDOP-2026-8842';

  return (
    <div className="min-h-screen medical-bg-mesh text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel p-8 sm:p-10 rounded-3xl border border-cyan-500/40 text-center relative overflow-hidden shadow-2xl space-y-6"
        >
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-400/50 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          
          <div>
            <h1 className="text-3xl font-extrabold text-white">OP Ticket Confirmed!</h1>
            <p className="text-slate-300 text-sm mt-1">Your hospital OP appointment has been successfully booked.</p>
          </div>
          
          <div className="bg-slate-900/90 rounded-2xl p-6 text-left border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Ticket Reference ID</p>
                <p className="text-xl font-mono font-extrabold text-cyan-400">{apptId}</p>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/40">
                CONFIRMED
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400 mb-1 flex items-center"><Calendar className="w-3.5 h-3.5 mr-1 text-cyan-400"/> Date</p>
                <p className="font-bold text-white text-sm">{appointment?.date || 'Today'}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1 flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-cyan-400"/> Time Slot</p>
                <p className="font-bold text-white text-sm">{appointment?.time || '10:30 AM'}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Patient Name</p>
                <p className="font-bold text-white text-sm">{appointment?.patientName || 'Patient'}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Phone Number</p>
                <p className="font-bold text-white text-sm">{appointment?.patientPhone || '9876543210'}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-1">
              <p className="text-xs text-slate-400 flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-cyan-400"/> Hospital &amp; Doctor Info</p>
              <p className="font-bold text-white text-lg">{appointment?.doctorId?.name || 'Dr. Deepthi'}</p>
              <p className="text-cyan-300 text-xs font-semibold">{appointment?.hospitalId?.name || 'Apollo Super Specialty Hospital'}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <AudioButton 
              textToRead={`Appointment confirmed with ID ${apptId}. Date ${appointment?.date || 'Today'}, Time ${appointment?.time || '10:30 AM'}. Please show this ticket at the hospital OP counter.`}
              label="🔊 Listen Confirmation"
              className="py-3 px-6 text-sm"
            />
            <Link 
              to="/dashboard" 
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center"
            >
              View My OP Tickets
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
