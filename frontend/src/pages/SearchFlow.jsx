import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Building2, HeartPulse, ChevronRight, Activity, Search, ArrowLeft, PhoneCall, ShieldCheck, CheckCircle2, UserCheck, Stethoscope, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { AudioButton } from '../components/VoiceAssistant';

const API_URL = 'http://localhost:5000/api';

export default function SearchFlow() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [subCities, setSubCities] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [healthIssues, setHealthIssues] = useState([]);
  
  // Selections
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedSubCity, setSelectedSubCity] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get(`${API_URL}/locations/states`);
        setStates(res.data);
      } catch (err) {
        console.error("Could not fetch states", err);
      }
    };
    fetchStates();
  }, []);

  const handleStateSelect = async (stateItem) => {
    setSelectedState(stateItem);
    setSelectedDistrict(null);
    setSelectedCity(null);
    setSelectedSubCity(null);
    setSelectedHospital(null);
    setSearchTerm('');
    setLoading(true);

    try {
      const res = await axios.get(`${API_URL}/locations/districts?stateId=${stateItem._id}`);
      setDistricts(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    setStep(2);
  };

  const handleDistrictSelect = async (districtItem) => {
    setSelectedDistrict(districtItem);
    setSelectedCity(null);
    setSelectedSubCity(null);
    setSelectedHospital(null);
    setSearchTerm('');
    setLoading(true);

    try {
      const res = await axios.get(`${API_URL}/locations/cities?districtId=${districtItem._id}`);
      setCities(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    setStep(3);
  };

  const handleCitySelect = async (cityItem) => {
    setSelectedCity(cityItem);
    setSelectedSubCity(null);
    setSelectedHospital(null);
    setSearchTerm('');
    setLoading(true);

    try {
      const subRes = await axios.get(`${API_URL}/locations/subcities?cityId=${cityItem._id}`);
      setSubCities(subRes.data);
      const hospRes = await axios.get(`${API_URL}/hospitals?cityId=${cityItem._id}`);
      setHospitals(hospRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    setStep(4);
  };

  const handleHospitalSelect = async (hospitalItem) => {
    setSelectedHospital(hospitalItem);
    setSearchTerm('');
    setLoading(true);

    try {
      const res = await axios.get(`${API_URL}/medical/health-issues`);
      setHealthIssues(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    setStep(5);
  };

  const handleViewAllDoctorsAtHospital = (hosp) => {
    navigate('/doctors', {
      state: {
        hospital: hosp,
        issueName: 'All Doctors'
      }
    });
  };

  const handleIssueSelect = (issue) => {
    navigate('/doctors', { 
      state: { 
        hospital: selectedHospital, 
        department: issue.departmentId, 
        issueName: issue.name 
      } 
    });
  };

  const steps = [
    { id: 1, name: 'State', icon: MapPin },
    { id: 2, name: 'District', icon: MapPin },
    { id: 3, name: 'City', icon: MapPin },
    { id: 4, name: 'Hospital', icon: Building2 },
    { id: 5, name: 'Specialty', icon: HeartPulse }
  ];

  const filteredStates = states.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredDistricts = districts.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredCities = cities.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredHospitals = hospitals.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (h.address && h.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const filteredIssues = healthIssues.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen medical-bg-mesh text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 text-center space-y-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>3-STEP GUIDED OP SEARCH & BOOKING</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Find Hospital OP Tickets Across India
          </h1>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Select State ➔ District ➔ City ➔ Hospital to view available doctors and booking slots.
          </p>

          <div className="flex justify-center pt-1">
            <AudioButton 
              textToRead="Follow the simple steps on screen to pick your state, district, city, and hospital to book an OP ticket."
              label="🔊 Listen Guide"
            />
          </div>
        </div>

        {/* Progress Step Indicator Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between relative max-w-4xl mx-auto">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 rounded-full z-0"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-cyan-400 rounded-full z-0 transition-all duration-500"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
            
            {steps.map((s) => (
              <div key={s.id} className="relative z-10 flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 ${
                  step >= s.id ? 'bg-cyan-500 border-cyan-300 text-white shadow-lg shadow-cyan-500/30' : 'bg-slate-900 border-slate-700 text-slate-500'
                } transition-colors duration-300`}>
                  {step > s.id ? <CheckCircle2 className="h-5 w-5 text-white" /> : s.id}
                </div>
                <span className={`mt-1.5 text-xs font-semibold ${step >= s.id ? 'text-cyan-300' : 'text-slate-500'}`}>
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Selection Card Container */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 min-h-[420px]">
          
          {/* Quick Filter Input */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${step === 1 ? 'State' : step === 2 ? 'District' : step === 3 ? 'City' : step === 4 ? 'Hospital' : 'Specialty'}...`}
              className="w-full pl-12 pr-4 py-3 bg-slate-950/80 border border-slate-700 rounded-2xl focus:outline-none focus:border-cyan-400 text-sm text-white placeholder-slate-400"
            />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-3">
              <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-cyan-300 text-xs font-bold">Loading choices...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* STEP 1: SELECT STATE */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">1. Select State (All 29 States Available)</h2>
                    <span className="text-xs text-cyan-300 font-semibold">{filteredStates.length} States</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {filteredStates.map(stateItem => (
                      <button 
                        key={stateItem._id} 
                        onClick={() => handleStateSelect(stateItem)} 
                        className="glass-card p-4 rounded-2xl text-left border border-slate-700 hover:border-cyan-400 transition-all flex items-center justify-between group"
                      >
                        <span className="font-bold text-sm text-white group-hover:text-cyan-300 truncate">{stateItem.name}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: SELECT DISTRICT */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">2. Select District in {selectedState?.name}</h2>
                    <span className="text-xs text-cyan-300 font-semibold">{filteredDistricts.length} Districts</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {filteredDistricts.map(districtItem => (
                      <button 
                        key={districtItem._id} 
                        onClick={() => handleDistrictSelect(districtItem)} 
                        className="glass-card p-4 rounded-2xl text-left border border-slate-700 hover:border-cyan-400 transition-all flex items-center justify-between group"
                      >
                        <span className="font-bold text-sm text-white group-hover:text-cyan-300 truncate">{districtItem.name}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: SELECT CITY */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">3. Select City in {selectedDistrict?.name} District</h2>
                    <span className="text-xs text-cyan-300 font-semibold">{filteredCities.length} Cities</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {filteredCities.map(cityItem => (
                      <button 
                        key={cityItem._id} 
                        onClick={() => handleCitySelect(cityItem)} 
                        className="glass-card p-4 rounded-2xl text-left border border-slate-700 hover:border-cyan-400 transition-all flex items-center justify-between group"
                      >
                        <span className="font-bold text-sm text-white group-hover:text-cyan-300 truncate">{cityItem.name}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 4: SELECT HOSPITAL */}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">4. Hospitals in {selectedCity?.name}</h2>
                    <span className="text-xs text-cyan-300 font-semibold">{filteredHospitals.length} Hospitals</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredHospitals.map(hosp => (
                      <div key={hosp._id} className="glass-card p-5 rounded-2xl border border-slate-700 space-y-3">
                        <div>
                          <h3 className="font-bold text-lg text-white">{hosp.name}</h3>
                          <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                            {hosp.address}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleHospitalSelect(hosp)}
                            className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold rounded-xl border border-slate-700"
                          >
                            Filter by Health Issue
                          </button>
                          <button
                            onClick={() => handleViewAllDoctorsAtHospital(hosp)}
                            className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white text-xs font-bold rounded-xl shadow-md"
                          >
                            View All Doctors
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 5: SELECT HEALTH ISSUE */}
              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">5. Select Health Specialty</h2>
                    <button 
                      onClick={() => handleViewAllDoctorsAtHospital(selectedHospital)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40"
                    >
                      View All Doctors Direct
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredIssues.map((issue, idx) => (
                      <button
                        key={issue._id || idx}
                        onClick={() => handleIssueSelect(issue)}
                        className="glass-card p-4 rounded-2xl text-center space-y-2 border border-slate-700 hover:border-cyan-400 transition-all group"
                      >
                        <div className="text-3xl group-hover:scale-110 transition-transform">{issue.icon || '🩺'}</div>
                        <h3 className="font-bold text-sm text-white">{issue.name}</h3>
                        <span className="text-[10px] text-cyan-300 block">{issue.departmentId?.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

        </div>

      </div>
    </div>
  );
}
