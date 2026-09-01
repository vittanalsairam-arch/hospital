import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Building2, HeartPulse, ChevronRight, Activity, Search, ArrowLeft, PhoneCall, ShieldCheck, CheckCircle2, UserCheck, Stethoscope, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { AudioButton } from '../components/VoiceAssistant';
import HospitalDetailsModal from '../components/HospitalDetailsModal';

const API_URL = import.meta.env.VITE_API_URL || '/api';

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
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [selectedHospitalForModal, setSelectedHospitalForModal] = useState(null);

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
  const filteredHospitals = hospitals.filter(h => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = h.name.toLowerCase().includes(term) || 
      (h.address && h.address.toLowerCase().includes(term)) ||
      (h.parentChain && h.parentChain.toLowerCase().includes(term)) ||
      (h.branchCode && h.branchCode.toLowerCase().includes(term));
    const matchesSubCity = selectedSubCity ? (h.subCityId === selectedSubCity._id || h.subCityId?._id === selectedSubCity._id) : true;
    const matchesTier = selectedTier === 'ALL' ? true : (h.tier && h.tier.includes(selectedTier));
    return matchesSearch && matchesSubCity && matchesTier;
  });
  const displayedHospitals = filteredHospitals;
  const filteredIssues = healthIssues.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen medical-bg-mesh text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 text-center space-y-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>5-STEP NATIONAL OP SEARCH & BOOKING</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Find Your Hospital &amp; Book OP Slot</h1>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Browse across 29 States, Districts, Cities, Sub-Cities / Localities and book confirmed doctor OP appointments.
          </p>

          {/* Voice Guide Button */}
          <div className="pt-2 flex justify-center">
            <AudioButton 
              textToRead={`Welcome to OP Search. Please follow the 5 steps: Select your State, District, City, Sub-city Locality, and choose your Hospital to view specialist doctors.`}
              label="🔊 Listen Voice Instructions"
              className="py-1.5 px-4 text-xs"
            />
          </div>
        </div>

        {/* Steps Progress Bar */}
        <div className="grid grid-cols-5 gap-2">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <div 
                key={s.id}
                onClick={() => { if (isDone) setStep(s.id); }}
                className={`flex flex-col items-center p-3 rounded-2xl border transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20' 
                    : isDone 
                      ? 'bg-slate-900/80 border-emerald-500/40 text-emerald-400' 
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Icon className="w-4 h-4" />}
                  <span className="text-xs font-bold hidden sm:inline">{s.name}</span>
                </div>
                <span className="text-[10px] text-slate-300 mt-1 font-semibold truncate max-w-full">
                  {s.id === 1 && selectedState ? selectedState.name :
                   s.id === 2 && selectedDistrict ? selectedDistrict.name :
                   s.id === 3 && selectedCity ? selectedCity.name :
                   s.id === 4 && selectedHospital ? selectedHospital.name :
                   s.id === 5 ? 'Select Issue' : `Step ${s.id}`}
                </span>
              </div>
            );
          })}
        </div>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between text-xs text-slate-300 px-2">
          <div className="flex items-center gap-2 flex-wrap">
            {selectedState && (
              <span className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span className="text-white font-bold">{selectedState.name}</span>
              </span>
            )}
            {selectedDistrict && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-white font-bold">{selectedDistrict.name}</span>
              </>
            )}
            {selectedCity && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-white font-bold">{selectedCity.name}</span>
              </>
            )}
            {selectedSubCity && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="bg-cyan-900/60 px-2.5 py-1 rounded-lg border border-cyan-500/40 text-cyan-200 font-bold">{selectedSubCity.name}</span>
              </>
            )}
            {selectedHospital && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-500/40 text-emerald-300 font-bold">{selectedHospital.name}</span>
              </>
            )}
          </div>

          {step > 1 && (
            <button 
              onClick={() => {
                if (step === 2) setStep(1);
                if (step === 3) setStep(2);
                if (step === 4) setStep(3);
                if (step === 5) setStep(4);
              }}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold ml-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
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
              placeholder={`Search ${step === 1 ? 'State' : step === 2 ? 'District' : step === 3 ? 'City' : step === 4 ? 'Hospital / Locality' : 'Specialty'}...`}
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

              {/* STEP 4: SELECT HOSPITAL & SUBCITY */}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h2 className="text-xl font-bold text-white">4. Mandal-Wise Hospitals in {selectedCity?.name}</h2>
                      <p className="text-xs text-slate-400">Filter by specific Mandal / Taluk / Locality or choose an Area Hospital directly</p>
                    </div>
                    <span className="text-xs text-cyan-300 font-semibold">{filteredHospitals.length} Hospitals available</span>
                  </div>

                  {/* Mandal / Area filter pills */}
                  {subCities.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">1. Filter by Mandal / Locality:</p>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                        <button
                          onClick={() => setSelectedSubCity(null)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                            selectedSubCity === null
                              ? 'bg-cyan-500 text-white border-cyan-400 shadow-md shadow-cyan-500/20'
                              : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          🏛️ All Mandals &amp; Areas ({hospitals.length})
                        </button>
                        {subCities.map(sub => {
                          const count = hospitals.filter(h => h.subCityId === sub._id || h.subCityId?._id === sub._id).length;
                          return (
                            <button
                              key={sub._id}
                              onClick={() => setSelectedSubCity(selectedSubCity?._id === sub._id ? null : sub)}
                              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                                selectedSubCity?._id === sub._id
                                  ? 'bg-cyan-500 text-white border-cyan-400 shadow-md shadow-cyan-500/20'
                                  : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500'
                              }`}
                            >
                              📍 {sub.name} {count > 0 && <span className="text-[10px] opacity-85">({count})</span>}
                            </button>
                          );
                        })}
                      </div>

                      {/* Hospital Size & Tier Filters */}
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pt-1">2. Filter by Hospital Size &amp; Category (Small to Big):</p>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                        {[
                          { id: 'ALL', label: '🏥 All Hospital Tiers' },
                          { id: 'Tier 1', label: '🩺 Tier 1: Small Clinics (20-50 Beds)' },
                          { id: 'Tier 2', label: '🏥 Tier 2: CHC Centers (50-150 Beds)' },
                          { id: 'Tier 3', label: '🏛️ Tier 3: Area Hospitals (150-350 Beds)' },
                          { id: 'Tier 4', label: '🏢 Tier 4: District Civil (400-800 Beds)' },
                          { id: 'Tier 5', label: '🏥 Tier 5: Multi-Specialty Private' },
                          { id: 'Tier 6', label: '⭐ Tier 6: Super Specialty Chains' },
                          { id: 'Tier 7', label: '🏛️ Tier 7: Apex AIIMS (800-1500 Beds)' }
                        ].map(tierOpt => (
                          <button
                            key={tierOpt.id}
                            onClick={() => setSelectedTier(selectedTier === tierOpt.id ? 'ALL' : tierOpt.id)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                              (selectedTier === tierOpt.id || (tierOpt.id === 'ALL' && selectedTier === 'ALL'))
                                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500'
                            }`}
                          >
                            {tierOpt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {displayedHospitals.map(hosp => (
                      <div key={hosp._id} className="glass-card rounded-2xl border border-slate-700 hover:border-cyan-500/60 transition-all overflow-hidden flex flex-col justify-between group shadow-lg">
                        
                        {/* Hospital Out-View Photo & Badges */}
                        <div className="relative h-44 overflow-hidden bg-slate-900">
                          <img 
                            src={hosp.imageUrl || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80'} 
                            alt={hosp.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                          
                          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                            <span className="bg-slate-900/90 text-cyan-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border border-cyan-500/40 backdrop-blur-md">
                              {hosp.tier ? hosp.tier.split(' - ')[0] : 'Hospital'} • {hosp.hospitalType || 'General'}
                            </span>
                            {hosp.emergencyAvailable && (
                              <span className="bg-red-500/90 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-md">
                                🚨 24x7 Emergency
                              </span>
                            )}
                          </div>

                          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-cyan-300 bg-slate-950/90 px-2 py-0.5 rounded-lg border border-slate-700">
                              Code: {hosp.branchCode || 'BR-MED-001'}
                            </span>
                            <span className="text-[11px] font-bold text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded-lg border border-slate-800 backdrop-blur-md">
                              ★ {hosp.rating || 4.8}
                            </span>
                          </div>
                        </div>

                        {/* Hospital Info & Buttons */}
                        <div className="p-4 space-y-3">
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-1">{hosp.name}</h3>
                            </div>
                            <p className="text-[11px] text-cyan-400 font-semibold truncate">
                              🏢 Network: {hosp.parentChain || 'National Healthcare Network'}
                            </p>
                            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1 line-clamp-1">
                              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span>{hosp.address}</span>
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-2 border-t border-slate-800/80">
                            <span>Beds: <strong className="text-white">{hosp.bedCapacity || 250}+</strong> ({hosp.icuBeds || 30} ICU)</span>
                            <span>OTs: <strong className="text-white">{hosp.operationTheatres || 6} OTs</strong></span>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 pt-1">
                            <button
                              onClick={() => setSelectedHospitalForModal(hosp)}
                              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Building2 className="w-3.5 h-3.5" />
                              <span>Top-to-Bottom Details</span>
                            </button>
                            <button
                              onClick={() => handleViewAllDoctorsAtHospital(hosp)}
                              className="flex-1 py-2 px-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Stethoscope className="w-3.5 h-3.5" />
                              <span>Book OP at Branch</span>
                            </button>
                          </div>
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

        {/* Top-to-Bottom Hospital Details Modal */}
        <HospitalDetailsModal
          hospital={selectedHospitalForModal}
          isOpen={!!selectedHospitalForModal}
          onClose={() => setSelectedHospitalForModal(null)}
          onBookDoctor={(hosp) => handleViewAllDoctorsAtHospital(hosp)}
        />

      </div>
    </div>
  );
}
