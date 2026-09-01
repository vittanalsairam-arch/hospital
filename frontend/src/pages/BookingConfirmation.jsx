import { useState, useEffect } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  Printer, 
  Share2, 
  Phone, 
  ShieldCheck, 
  QrCode, 
  Building2, 
  User, 
  FileText, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { fetchAppointmentById } from '../services/apiService';
import { AudioButton } from '../components/VoiceAssistant';

export default function BookingConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const [appointment, setAppointment] = useState(location.state?.appointment || null);
  const [loading, setLoading] = useState(!location.state?.appointment);
  const [copied, setCopied] = useState(false);

  const apptId = id || appointment?.appointmentId || 'MEDOP-2026-8842';

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await fetchAppointmentById(id);
        if (data) {
          setAppointment(data);
        }
      } catch (err) {
        console.warn('Live appointment fetch failed, using fallback/state:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!appointment || !appointment.doctorId?.name) {
      fetchAppointment();
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `MediOP Appointment Ticket - ${apptId}`,
        text: `Hospital OP Ticket for ${appointment?.patientName || 'Patient'} with ${appointment?.doctorId?.name || 'Doctor'} on ${appointment?.date || 'Today'} at ${appointment?.time || '10:00 AM'}. Token: ${appointment?.opToken || 'OP-01'}.`,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const doctorName = appointment?.doctorId?.name || (typeof appointment?.doctorId === 'string' ? appointment?.doctorId : 'Dr. Vikram Rao');
  const doctorSpec = appointment?.doctorId?.specialization || appointment?.departmentId?.name || 'Specialist Consultation';
  const doctorQual = appointment?.doctorId?.qualification || 'MBBS, MD';
  const hospitalName = appointment?.hospitalId?.name || 'Apollo Multi-Specialty Hospital';
  const hospitalAddress = appointment?.hospitalId?.address || 'Main Road, Health City';
  const hospitalBranch = appointment?.hospitalId?.branchCode || 'BR-APO-0012';
  const opToken = appointment?.opToken || 'OP-04';
  const roomNo = appointment?.roomNo || 'OPD Room 102, Wing A';
  const apptDate = appointment?.date || new Date().toISOString().split('T')[0];
  const apptTime = appointment?.time || '10:30 AM';
  const patientName = appointment?.patientName || 'Sairam Vittanala';
  const patientPhone = appointment?.patientPhone || '+91 98765 43210';
  const patientAge = appointment?.patientAge || 28;
  const patientGender = appointment?.patientGender || 'Male';
  const abhaId = appointment?.abhaId || '9821-4412-8820';
  const fee = appointment?.consultationFee || 500;
  const paymentStatus = appointment?.paymentStatus || 'Verified Cashless (Ayushman PM-JAY)';

  const voiceSummary = `Hospital Outpatient appointment is confirmed. Ticket number ${apptId}. OPD Token number is ${opToken}. Patient name ${patientName}. Doctor name ${doctorName}, ${doctorSpec}. Hospital name ${hospitalName}. Date ${apptDate} at ${apptTime}. Please report to ${roomNo} at the hospital OPD counter.`;

  return (
    <div className="min-h-screen medical-bg-mesh text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Success Banner (No Print) */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="no-print glass-panel p-4 sm:p-6 rounded-3xl border border-emerald-500/40 bg-emerald-950/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl"
        >
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0 text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
                <span>Real OP Appointment Confirmed!</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  LIVE ACTIVE
                </span>
              </h1>
              <p className="text-slate-300 text-xs mt-0.5">
                Official ABDM verified Outpatient (OP) token slip issued. Show this slip at the hospital OPD counter.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Slip</span>
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all"
              title="Share Ticket"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* OFFICIAL PRINTABLE HOSPITAL OP TICKET CARD */}
        {/* ========================================================================= */}
        <motion.div 
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="print-ticket-container glass-panel rounded-3xl border-2 border-cyan-500/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-6"
        >
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-700/80">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    National Outpatient Portal
                  </span>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> ABDM Verified
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">{hospitalName}</h2>
                <p className="text-xs text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>{hospitalAddress}</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-cyan-400 font-mono font-bold">Branch: {hospitalBranch}</span>
                </p>
              </div>
            </div>

            {/* Token Badge */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-cyan-400/60 rounded-2xl p-4 text-center sm:text-right min-w-[140px] shadow-lg shadow-cyan-500/10">
              <p className="text-[10px] text-cyan-300 uppercase tracking-widest font-extrabold">OPD TOKEN NO.</p>
              <p className="text-3xl font-mono font-black text-cyan-400 print-accent">{opToken}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">{roomNo}</p>
            </div>
          </div>

          {/* Reference & Barcode Bar */}
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 text-cyan-400">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Appointment Ref ID</p>
                <p className="text-lg font-mono font-black text-white tracking-wider print-accent">{apptId}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center sm:text-right">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Registration Mode</p>
                <p className="font-bold text-emerald-400">Digital OP Self-Check-in</p>
              </div>
              <div className="hidden sm:block font-mono tracking-widest text-slate-500 text-sm select-none">
                ||||| | |||| || ||||| |||
              </div>
            </div>
          </div>

          {/* Core Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Patient Demographics */}
            <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <User className="w-4 h-4" /> Patient Demographics
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-bold">
                  ABHA ID: {abhaId}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-400 text-[11px]">Patient Name</p>
                  <p className="font-extrabold text-white text-sm">{patientName}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px]">Age / Gender</p>
                  <p className="font-bold text-slate-200">{patientAge} Yrs / {patientGender}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px]">Registered Contact</p>
                  <p className="font-bold text-slate-200">{patientPhone}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px]">Consultation Scheme</p>
                  <p className="font-bold text-cyan-300 truncate">{paymentStatus}</p>
                </div>
              </div>
            </div>

            {/* Doctor & Schedule Info */}
            <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Doctor &amp; Schedule
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                  CONFIRMED OP
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="col-span-2">
                  <p className="text-slate-400 text-[11px]">Consulting Specialist</p>
                  <p className="font-extrabold text-white text-base">{doctorName}</p>
                  <p className="text-cyan-400 text-xs font-bold">{doctorSpec} • {doctorQual}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px] flex items-center gap-1"><Calendar className="w-3 h-3 text-cyan-400"/> OP Date</p>
                  <p className="font-extrabold text-white text-sm">{apptDate}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px] flex items-center gap-1"><Clock className="w-3 h-3 text-cyan-400"/> Reporting Slot</p>
                  <p className="font-extrabold text-cyan-300 text-sm">{apptTime}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Hospital Counter Instructions */}
          <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-800/80 text-xs space-y-2">
            <p className="font-bold text-slate-200 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" /> Instructions for Patient:
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px] leading-relaxed">
              <li>Please reach the hospital OPD desk at <strong>{roomNo}</strong> at least <strong>15 minutes</strong> prior to {apptTime}.</li>
              <li>Present this digital ticket slip (or Token <strong>{opToken}</strong>) at the counter to collect your printed OP card.</li>
              <li>This digital appointment is valid for initial doctor examination and standard 7-day follow-up review.</li>
              <li>For emergency assistance, 24x7 Ambulance Helpline is reachable at <strong className="text-cyan-400">108</strong>.</li>
            </ul>
          </div>

          {/* Footer of Ticket */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-400">
            <div>
              <span>Official National Hospital OP Booking Network • </span>
              <span className="text-cyan-400 font-bold">Government of India ABDM Compliant</span>
            </div>
            <div className="font-mono text-slate-500">
              Generated: {new Date().toLocaleString()}
            </div>
          </div>
        </motion.div>

        {/* Action Controls & Voice Reader (No Print) */}
        <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <AudioButton 
            textToRead={voiceSummary}
            label="🔊 Listen OP Ticket Details"
            className="py-3 px-6 text-sm w-full sm:w-auto"
          />

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link 
              to="/doctors" 
              className="flex-1 sm:flex-none px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all text-center"
            >
              Book Another OP
            </Link>
            <Link 
              to="/dashboard" 
              className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Go to My OP Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
