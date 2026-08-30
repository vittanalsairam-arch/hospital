import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Building, Hospital as HospIcon, User, Calendar, CheckCircle2, XCircle, Search, ChevronRight, ChevronDown, Volume2, Sparkles, AlertCircle, Layers, ListFilter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { AudioButton } from '../components/VoiceAssistant';
import HospitalDetailsModal from '../components/HospitalDetailsModal';

export default function MasterExplorer() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('tree'); // 'tree' (Open Tree) or 'interactive' (Filter Mode)
  const [selectedHospitalForModal, setSelectedHospitalForModal] = useState(null);

  const [data, setData] = useState({
    states: [],
    districts: [],
    cities: [],
    subCities: [],
    hospitals: [],
    doctors: [],
    doctorStatusMap: {}
  });

  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSubCity, setSelectedSubCity] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');

  const [expandedStates, setExpandedStates] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTreeData();
  }, []);

  const fetchTreeData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/locations/tree');
      setData(res.data);
      if (res.data.states.length > 0) {
        setSelectedState(res.data.states[0]._id);
        // Expand first 3 states by default in tree view
        const initialExpanded = {};
        res.data.states.slice(0, 3).forEach(s => { initialExpanded[s._id] = true; });
        setExpandedStates(initialExpanded);
      }
    } catch (err) {
      console.error('Error fetching tree data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStateExpand = (stateId) => {
    setExpandedStates(prev => ({ ...prev, [stateId]: !prev[stateId] }));
  };

  const expandAll = () => {
    const allExp = {};
    data.states.forEach(s => { allExp[s._id] = true; });
    setExpandedStates(allExp);
  };

  const collapseAll = () => {
    setExpandedStates({});
  };

  // Filtered lists for interactive mode
  const currentDistricts = data.districts.filter(d => d.stateId === selectedState);
  const currentCities = data.cities.filter(c => 
    c.stateId === selectedState && (!selectedDistrict || c.districtId === selectedDistrict)
  );
  const currentSubCities = data.subCities.filter(sc => 
    sc.stateId === selectedState && 
    (!selectedDistrict || sc.districtId === selectedDistrict) &&
    (!selectedCity || sc.cityId === selectedCity)
  );

  const currentHospitals = data.hospitals.filter(h => {
    if (selectedSubCity) return h.subCityId === selectedSubCity;
    if (selectedCity) return h.cityId === selectedCity;
    if (selectedDistrict) return h.districtId === selectedDistrict;
    if (selectedState) return h.stateId === selectedState;
    return true;
  });

  const filteredStates = data.states.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen medical-bg-mesh flex items-center justify-center p-6 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold text-lg text-cyan-300">Loading All 29 States & Complete National Hospital Network...</p>
        </div>
      </div>
    );
  }

  const activeStateObj = data.states.find(s => s._id === selectedState);

  return (
    <div className="min-h-screen medical-bg-mesh text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Main Title Header */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-cyan-500/30">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold mb-3 border border-cyan-500/30">
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>ALL 29 STATES OF INDIA • COMPLETE OP NETWORK</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                All 29 States Open Hospital Directory
              </h1>
              <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-3xl">
                View all 29 States → {data.districts.length} Districts → {data.cities.length} Cities → {data.subCities.length} Sub-Areas → {data.hospitals.length} Hospitals → {data.doctors.length} Doctors & Live Availability.
              </p>

              {/* Live Stat Pills */}
              <div className="flex flex-wrap gap-2 mt-4">
                {[
                  { icon: '🗺️', label: 'States', value: data.states.length, color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
                  { icon: '🏙️', label: 'Districts', value: data.districts.length, color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
                  { icon: '🌆', label: 'Cities', value: data.cities.length, color: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
                  { icon: '📍', label: 'Sub-Areas', value: data.subCities.length, color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
                  { icon: '🏥', label: 'Hospitals', value: data.hospitals.length, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
                  { icon: '👨‍⚕️', label: 'Doctors', value: data.doctors.length, color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
                ].map(stat => (
                  <div key={stat.label} className={`flex items-center gap-1.5 border px-3 py-1 rounded-full text-xs font-bold ${stat.color}`}>
                    <span>{stat.icon}</span>
                    <span className="font-extrabold">{stat.value.toLocaleString()}</span>
                    <span className="opacity-75">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Audio Reader Header */}
            <div className="flex flex-col items-start md:items-end gap-2">
              <AudioButton 
                textToRead={`All ${data.states.length} States of India are open below with ${data.districts.length} districts, ${data.cities.length} cities, ${data.hospitals.length} hospitals and ${data.doctors.length} doctors. You can explore Andhra Pradesh, Maharashtra, Karnataka, Telangana, Tamil Nadu, Uttar Pradesh, West Bengal, and all other states.`}
                label="🔊 Listen Directory Summary"
                className="py-2.5 px-4 text-sm"
              />
              <span className="text-xs text-slate-400">Audio support active for educated & uneducated users</span>
            </div>
          </div>

          {/* Search Filter & View Mode Controls */}
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search any State, District, City, Hospital, or Doctor name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 shadow-inner"
              />
            </div>

            {/* View Mode Selector */}
            <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700 shrink-0">
              <button
                onClick={() => setViewMode('tree')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'tree' 
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Open 29-State Tree View</span>
              </button>

              <button
                onClick={() => setViewMode('interactive')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'interactive' 
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ListFilter className="w-4 h-4" />
                <span>Filter Wizard View</span>
              </button>
            </div>
          </div>
        </div>

        {/* VIEW MODE 1: ALL 29 STATES OPEN TREE VIEW */}
        {viewMode === 'tree' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span>All 29 States Open Hierarchy ({data.states.length} States Total)</span>
              </h2>
              <div className="flex items-center gap-3 text-xs">
                <button 
                  onClick={expandAll}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 font-bold"
                >
                  ➕ Expand All 29 States
                </button>
                <button 
                  onClick={collapseAll}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 font-bold"
                >
                  ➖ Collapse All
                </button>
              </div>
            </div>

            {/* Tree Accordion Cards for each State */}
            <div className="space-y-4">
              {filteredStates.map((state) => {
                const isExpanded = expandedStates[state._id];
                const stateDistricts = data.districts.filter(d => d.stateId === state._id);
                const stateHospitals = data.hospitals.filter(h => h.stateId === state._id);
                const stateDoctors = data.doctors.filter(d => {
                  const docHospId = d.hospitalId?._id || d.hospitalId;
                  return stateHospitals.some(h => h._id === docHospId);
                });

                return (
                  <div key={state._id} className="glass-card rounded-3xl border border-slate-700/80 overflow-hidden">
                    
                    {/* State Header Banner */}
                    <div 
                      onClick={() => toggleStateExpand(state._id)}
                      className="p-5 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 hover:bg-slate-800/80 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                            <span>{state.name}</span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700 font-semibold">
                              State #{data.states.indexOf(state) + 1}
                            </span>
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {stateDistricts.length} Districts • {stateHospitals.length} Hospitals • {stateDoctors.length} Doctors Available
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <AudioButton 
                          textToRead={`State ${state.name}. Includes ${stateDistricts.length} districts and ${stateHospitals.length} hospitals.`}
                          label="🔊 Read State"
                          className="px-2.5 py-1 text-xs"
                        />
                        <button className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white">
                          {isExpanded ? <ChevronDown className="w-5 h-5 text-cyan-400" /> : <ChevronRight className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded State Content: Districts -> Cities -> Subcities -> Hospitals -> Doctors */}
                    {isExpanded && (
                      <div className="p-6 space-y-6 bg-slate-950/40">
                        {stateDistricts.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">No district data loaded for this state.</p>
                        ) : (
                          stateDistricts.map(dist => {
                            const distCities = data.cities.filter(c => c.districtId === dist._id);
                            const distHospitals = data.hospitals.filter(h => h.districtId === dist._id);

                            return (
                              <div key={dist._id} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
                                
                                {/* District Header */}
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                  <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                                    <Building className="w-4 h-4 text-cyan-400" />
                                    <span>District: {dist.name}</span>
                                  </h4>
                                  <span className="text-xs text-slate-400 font-semibold">{distHospitals.length} Hospitals</span>
                                </div>

                                {/* Cities & Subcities Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {distCities.map(city => {
                                    const citySubCities = data.subCities.filter(sc => sc.cityId === city._id);
                                    const cityHospitals = data.hospitals.filter(h => h.cityId === city._id);

                                    return (
                                      <div key={city._id} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
                                        <div className="flex items-center justify-between">
                                          <h5 className="font-bold text-sm text-white flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                                            <span>City: {city.name}</span>
                                          </h5>
                                          <span className="text-[11px] text-slate-400">{citySubCities.length} Areas</span>
                                        </div>

                                        {/* Subcities / Areas tags */}
                                        {citySubCities.length > 0 && (
                                          <div className="flex flex-wrap gap-1.5">
                                            {citySubCities.map(sc => (
                                              <span key={sc._id} className="text-[10px] bg-slate-900 px-2 py-0.5 rounded-md text-cyan-300 border border-slate-800">
                                                📍 {sc.name}
                                              </span>
                                            ))}
                                          </div>
                                        )}

                                        {/* Hospitals in City */}
                                        <div className="space-y-2 pt-2 border-t border-slate-800">
                                          {cityHospitals.map(hosp => {
                                            const hospDocs = data.doctors.filter(d => (d.hospitalId?._id || d.hospitalId) === hosp._id);

                                            return (
                                              <div key={hosp._id} className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2.5 shadow-md">
                                                <div className="flex items-start gap-3">
                                                  {/* Hospital Exterior Out-View Photo */}
                                                  <img 
                                                    src={hosp.imageUrl || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80'} 
                                                    alt={hosp.name}
                                                    className="w-16 h-16 rounded-xl object-cover border border-cyan-500/30 shrink-0"
                                                  />
                                                  <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                      <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                                                        🏛️ {hosp.hospitalType || 'Area Hospital'}
                                                      </span>
                                                      {hosp.emergencyAvailable && (
                                                        <span className="text-[9px] font-extrabold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                                                          🚨 24x7 Emergency
                                                        </span>
                                                      )}
                                                      <span className="text-[9px] font-bold text-amber-300">
                                                        ★ {hosp.rating || 4.8}
                                                      </span>
                                                    </div>
                                                    <h6 className="font-bold text-xs text-white mt-1 truncate">{hosp.name}</h6>
                                                    <p className="text-[10px] text-cyan-400 font-semibold truncate">Code: {hosp.branchCode || 'BR-MED-001'} • {hosp.parentChain || 'National Network'}</p>
                                                    <p className="text-[10px] text-slate-400 truncate">{hosp.address}</p>
                                                    
                                                    <button
                                                      onClick={() => setSelectedHospitalForModal(hosp)}
                                                      className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-cyan-300 hover:text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30 transition-colors cursor-pointer"
                                                    >
                                                      <Building className="w-3 h-3" />
                                                      <span>Top-to-Bottom Details &amp; Branch Info</span>
                                                    </button>
                                                  </div>
                                                  <AudioButton 
                                                    textToRead={`Hospital ${hosp.name}, ${hosp.hospitalType || 'Area Hospital'}. Has ${hospDocs.length} doctors.`}
                                                    label="🔊"
                                                    className="px-1.5 py-0.5 text-[10px]"
                                                  />
                                                </div>

                                                {/* Doctors availability list */}
                                                <div className="space-y-1.5 pt-1">
                                                  {hospDocs.map(doc => {
                                                    const statusObj = data.doctorStatusMap[doc._id] || { isAvailable: true };
                                                    const isAvailable = statusObj.isAvailable;

                                                    return (
                                                      <div key={doc._id} className="flex items-center justify-between text-xs bg-slate-950 p-2 rounded border border-slate-800">
                                                        <div className="flex items-center gap-2">
                                                          <img src={doc.profileImage} alt={doc.name} className="w-7 h-7 rounded-full object-cover" />
                                                          <div>
                                                            <p className="font-bold text-white text-[11px]">{doc.name}</p>
                                                            <p className="text-[10px] text-cyan-300">{doc.specialization}</p>
                                                          </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                          {isAvailable ? (
                                                            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                                                              🟢 AVAILABLE
                                                            </span>
                                                          ) : (
                                                            <span className="text-[10px] text-rose-400 font-bold bg-rose-500/20 px-2 py-0.5 rounded">
                                                              🔴 FULL (Alternatives Available)
                                                            </span>
                                                          )}

                                                          <button
                                                            onClick={() => navigate(`/doctor/${doc._id}/availability`)}
                                                            className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] rounded"
                                                          >
                                                            Book OP
                                                          </button>
                                                        </div>
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW MODE 2: INTERACTIVE FILTER WIZARD */}
        {viewMode === 'interactive' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span>Select State (Total {data.states.length} States)</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredStates.map((state) => {
                const isSelected = selectedState === state._id;
                const stateHospitalsCount = data.hospitals.filter(h => h.stateId === state._id).length;

                return (
                  <button
                    key={state._id}
                    onClick={() => {
                      setSelectedState(state._id);
                      setSelectedDistrict('');
                      setSelectedCity('');
                      setSelectedSubCity('');
                      setSelectedHospital('');
                    }}
                    className={`p-3.5 rounded-2xl text-left transition-all relative overflow-hidden ${
                      isSelected 
                        ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white ring-2 ring-cyan-300 shadow-lg shadow-cyan-500/25 scale-[1.02]' 
                        : 'glass-card text-slate-200 hover:bg-slate-800/80 hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm truncate">{state.name}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-200 shrink-0" />}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] opacity-80">
                      <span>{stateHospitalsCount} Hospitals</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dropdown Filters & Hospitals List */}
            {activeStateObj && (
              <div className="glass-panel p-6 rounded-3xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">1. District</label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => { setSelectedDistrict(e.target.value); setSelectedCity(''); setSelectedSubCity(''); }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="">-- All Districts in {activeStateObj.name} --</option>
                      {currentDistricts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">2. City</label>
                    <select
                      value={selectedCity}
                      onChange={(e) => { setSelectedCity(e.target.value); setSelectedSubCity(''); }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="">-- All Cities --</option>
                      {currentCities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">3. Sub-City / Area</label>
                    <select
                      value={selectedSubCity}
                      onChange={(e) => setSelectedSubCity(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="">-- All Sub-Cities --</option>
                      {currentSubCities.map(sc => <option key={sc._id} value={sc._id}>{sc.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                  {currentHospitals.map(hosp => {
                    const hospDocs = data.doctors.filter(d => d.hospitalId._id === hosp._id);
                    return (
                      <div key={hosp._id} className="glass-card p-6 rounded-3xl space-y-4 border border-slate-700">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold text-emerald-400">{hosp.hospitalType}</span>
                            <h3 className="text-xl font-bold text-white">{hosp.name}</h3>
                            <p className="text-xs text-slate-300 mt-1">{hosp.address}</p>
                          </div>
                          <AudioButton textToRead={`Hospital ${hosp.name}. ${hospDocs.length} doctors available.`} />
                        </div>
                        <div className="space-y-2">
                          {hospDocs.map(doc => (
                            <div key={doc._id} className="flex items-center justify-between bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                              <div>
                                <p className="font-bold text-sm text-white">{doc.name}</p>
                                <p className="text-xs text-cyan-300">{doc.specialization}</p>
                              </div>
                              <button onClick={() => navigate(`/doctor/${doc._id}/availability`)} className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs rounded-xl">
                                Book OP
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hospital Top-to-Bottom Details Modal */}
        <HospitalDetailsModal
          hospital={selectedHospitalForModal}
          isOpen={!!selectedHospitalForModal}
          onClose={() => setSelectedHospitalForModal(null)}
          onBookDoctor={(hosp) => {
            navigate('/search');
          }}
        />

      </div>
    </div>
  );
}
