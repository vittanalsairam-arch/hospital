const fs = require('fs');
const path = require('path');
const statesRaw = require('./statesData.js');

const deptNames = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine',
  'Dermatology', 'Gynecology', 'ENT', 'Gastroenterology', 'Ophthalmology',
  'Pulmonology', 'Oncology'
];

const departments = deptNames.map((name, idx) => ({
  _id: 'dept-' + (idx + 1),
  name
}));

const healthIssues = [
  { _id: 'issue-1', name: 'Heart & Chest Pain', departmentId: departments[0], icon: '❤️' },
  { _id: 'issue-2', name: 'Brain, Stroke & Nerve Issues', departmentId: departments[1], icon: '🧠' },
  { _id: 'issue-3', name: 'Bone, Joint & Fracture', departmentId: departments[2], icon: '🦴' },
  { _id: 'issue-4', name: 'Child Health, Vaccine & Fever', departmentId: departments[3], icon: '👶' },
  { _id: 'issue-5', name: 'General Fever, Cold & Diabetes', departmentId: departments[4], icon: '🩺' },
  { _id: 'issue-6', name: 'Skin Rash, Acne & Allergy', departmentId: departments[5], icon: '✨' },
  { _id: 'issue-7', name: 'Pregnancy & Women Wellness', departmentId: departments[6], icon: '🤰' },
  { _id: 'issue-8', name: 'Ear Pain, Sinus & Throat', departmentId: departments[7], icon: '👂' },
  { _id: 'issue-9', name: 'Stomach Ache & Digestion', departmentId: departments[8], icon: '🧪' },
  { _id: 'issue-10', name: 'Eye Testing & Vision Care', departmentId: departments[9], icon: '👁️' },
  { _id: 'issue-11', name: 'Asthma, Cough & Lungs', departmentId: departments[10], icon: '🫁' },
  { _id: 'issue-12', name: 'Cancer Screening & Tumors', departmentId: departments[11], icon: '🎗️' }
];

const hospitalImages = [
  'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1586773860383-dab5f3bc1bcc?auto=format&fit=crop&w=1200&q=80'
];

const doctorImages = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1594824813571-638f026361a1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
];

const hospitalChains = [
  { name: 'Apollo Super Specialty Hospital', chain: 'Apollo Hospitals Group', tier: 'Tier 6 - Super-Specialty Chain Branch', type: 'Super Specialty Corporate Hospital' },
  { name: 'Government District Civil Hospital', chain: 'Department of Health & Family Welfare', tier: 'Tier 4 - District Headquarters Hospital', type: 'District Civil Hospital' },
  { name: 'Manipal Multi-Specialty Hospital', chain: 'Manipal Health Enterprises', tier: 'Tier 6 - Super-Specialty Chain Branch', type: 'Tertiary Care Hospital' },
  { name: 'Max Super Specialty Hospital', chain: 'Max Healthcare Institute Ltd.', tier: 'Tier 6 - Super-Specialty Chain Branch', type: 'Quaternary Care Hospital' },
  { name: 'Fortis Multi-Specialty Hospital', chain: 'Fortis Healthcare Ltd.', tier: 'Tier 6 - Super-Specialty Chain Branch', type: 'Super Specialty Hospital' },
  { name: 'KIMS Super Specialty Hospital', chain: 'Krishna Institute of Medical Sciences (KIMS)', tier: 'Tier 6 - Super-Specialty Chain Branch', type: 'Quaternary Super Specialty' },
  { name: 'AIIMS Apex Regional Hospital', chain: 'All India Institute of Medical Sciences', tier: 'Tier 7 - Apex Institute / AIIMS', type: 'Apex National Institute' }
];

const doctorNames = [
  { name: 'Dr. Vikram Rao', spec: 'Senior Cardiologist', qual: 'MBBS, MD, DM (Cardiology)', fee: 800 },
  { name: 'Dr. Deepthi S.', spec: 'Senior Cardiologist & Interventionalist', qual: 'MBBS, MD, FACC', fee: 900 },
  { name: 'Dr. Priya Sharma', spec: 'Consultant Neurologist', qual: 'MBBS, DM (Neurology)', fee: 850 },
  { name: 'Dr. Rajesh Verma', spec: 'Orthopedic & Joint Surgeon', qual: 'MBBS, MS (Ortho), MCh', fee: 750 },
  { name: 'Dr. Ananya Reddy', spec: 'Consultant Pediatrician', qual: 'MBBS, DCH, DNB (Pediatrics)', fee: 600 },
  { name: 'Dr. Suresh Nair', spec: 'Chief General Physician', qual: 'MBBS, MD (Internal Medicine)', fee: 500 },
  { name: 'Dr. Neha Agarwal', spec: 'Dermatologist & Cosmetologist', qual: 'MBBS, MD (Dermatology)', fee: 700 },
  { name: 'Dr. Sunita Patel', spec: 'Senior Gynecologist & Obstetrician', qual: 'MBBS, MS (OBG), FICOG', fee: 800 }
];

const states = [];
const districts = [];
const cities = [];
const subCities = [];
const hospitals = [];
const doctors = [];
const doctorStatusMap = {};

let sCount = 0, dCount = 0, cCount = 0, scCount = 0, hCount = 0, docCount = 0;

statesRaw.forEach((st, sIdx) => {
  sCount++;
  const sId = 'st-' + sCount;
  states.push({ _id: sId, name: st.name, code: st.code || ('IN-' + st.name.substring(0, 3).toUpperCase()) });

  st.districts.forEach((dist, dIdx) => {
    dCount++;
    const dId = 'dist-' + dCount;
    districts.push({ _id: dId, name: dist.name, stateId: sId });

    dist.cities.forEach((ct, cIdx) => {
      cCount++;
      const cId = 'city-' + cCount;
      cities.push({ _id: cId, name: ct.name, stateId: sId, districtId: dId });

      let createdSubIds = [];
      ct.subCities.forEach((sc, scIdx) => {
        scCount++;
        const scId = 'sub-' + scCount;
        subCities.push({ _id: scId, name: sc, stateId: sId, districtId: dId, cityId: cId });
        createdSubIds.push(scId);
      });

      // Add 1-2 Hospitals per city
      const hospPerCity = Math.min(2, Math.max(1, Math.ceil(ct.subCities.length / 3)));
      for (let h = 0; h < hospPerCity; h++) {
        hCount++;
        const hId = 'hosp-' + hCount;
        const brand = hospitalChains[(hCount + sIdx + dIdx) % hospitalChains.length];
        const assignedSubId = createdSubIds[h % createdSubIds.length] || '';
        const img = hospitalImages[hCount % hospitalImages.length];

        const hospitalObj = {
          _id: hId,
          name: brand.name + ' - ' + ct.name + (h > 0 ? ' Unit ' + (h + 1) : ''),
          branchCode: 'BR-' + st.name.substring(0, 2).toUpperCase() + '-' + String(hCount).padStart(4, '0'),
          hospitalType: brand.type,
          tier: brand.tier,
          parentChain: brand.chain,
          stateId: sId,
          districtId: dId,
          cityId: cId,
          subCityId: assignedSubId,
          address: 'Main Health Corridor, ' + ct.name + ', ' + dist.name + ', ' + st.name,
          phone: '+91 ' + (8000000000 + (hCount * 1234) % 1999999999),
          emergencyAvailable: true,
          bedCapacity: 250 + ((hCount * 37) % 600),
          rating: Number((4.5 + ((hCount % 5) * 0.1)).toFixed(1)),
          imageUrl: img,
          departments: departments.slice(0, 6)
        };
        hospitals.push(hospitalObj);

        // Add 2-3 Doctors per Hospital
        for (let docIdx = 0; docIdx < 3; docIdx++) {
          docCount++;
          const docId = 'doc-' + docCount;
          const docTemplate = doctorNames[(docCount + hCount) % doctorNames.length];
          const dept = departments[docIdx % departments.length];
          const docImg = doctorImages[docCount % doctorImages.length];

          const doctorObj = {
            _id: docId,
            name: docTemplate.name,
            specialization: docTemplate.spec,
            qualification: docTemplate.qual,
            experienceYears: 10 + (docCount % 15),
            consultationFee: docTemplate.fee,
            opRoom: 'OPD Room ' + (100 + (docCount % 20)) + ', Wing ' + ['A', 'B', 'C'][docCount % 3],
            phone: '+91 ' + (9800000000 + (docCount * 5678) % 1999999999),
            rating: Number((4.6 + ((docCount % 4) * 0.1)).toFixed(1)),
            stateId: sId,
            districtId: dId,
            cityId: cId,
            subCityId: assignedSubId,
            hospitalId: {
              _id: hId,
              name: hospitalObj.name,
              branchCode: hospitalObj.branchCode,
              address: hospitalObj.address,
              phone: hospitalObj.phone,
              rating: hospitalObj.rating,
              imageUrl: hospitalObj.imageUrl
            },
            departmentId: dept,
            imageUrl: docImg
          };
          doctors.push(doctorObj);

          doctorStatusMap[docId] = {
            totalSlots: 15,
            freeSlots: (docCount % 3 === 0) ? 0 : (5 + (docCount % 8)),
            isAvailable: (docCount % 3 !== 0)
          };
        }
      }
    });
  });
});

const outDir = path.join(__dirname, '..', '..', 'frontend', 'src', 'data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const targetFile = path.join(outDir, 'fallbackData.js');

const jsContent = `// COMPLETE FALLBACK DATASET FOR 29 STATES OF INDIA
// Generated for standalone client-side execution, offline preview, and resilient deployment

export const FALLBACK_DEPARTMENTS = ${JSON.stringify(departments, null, 2)};

export const FALLBACK_HEALTH_ISSUES = ${JSON.stringify(healthIssues, null, 2)};

export const FALLBACK_STATES = ${JSON.stringify(states, null, 2)};

export const FALLBACK_DISTRICTS = ${JSON.stringify(districts, null, 2)};

export const FALLBACK_CITIES = ${JSON.stringify(cities, null, 2)};

export const FALLBACK_SUB_CITIES = ${JSON.stringify(subCities, null, 2)};

export const FALLBACK_HOSPITALS = ${JSON.stringify(hospitals, null, 2)};

export const FALLBACK_DOCTORS = ${JSON.stringify(doctors, null, 2)};

export const FALLBACK_DOCTOR_STATUS_MAP = ${JSON.stringify(doctorStatusMap, null, 2)};

export const getFallbackTreeData = () => ({
  states: FALLBACK_STATES,
  districts: FALLBACK_DISTRICTS,
  cities: FALLBACK_CITIES,
  subCities: FALLBACK_SUB_CITIES,
  hospitals: FALLBACK_HOSPITALS,
  doctors: FALLBACK_DOCTORS,
  doctorStatusMap: FALLBACK_DOCTOR_STATUS_MAP
});

export const getFallbackStates = () => FALLBACK_STATES;

export const getFallbackDistricts = (stateId) => stateId ? FALLBACK_DISTRICTS.filter(d => d.stateId === stateId) : FALLBACK_DISTRICTS;

export const getFallbackCities = (stateId, districtId) => {
  return FALLBACK_CITIES.filter(c => {
    if (districtId && c.districtId !== districtId) return false;
    if (stateId && c.stateId !== stateId) return false;
    return true;
  });
};

export const getFallbackSubCities = (cityId) => cityId ? FALLBACK_SUB_CITIES.filter(sc => sc.cityId === cityId) : FALLBACK_SUB_CITIES;

export const getFallbackHospitals = (filters = {}) => {
  return FALLBACK_HOSPITALS.filter(h => {
    if (filters.stateId && h.stateId !== filters.stateId) return false;
    if (filters.districtId && h.districtId !== filters.districtId) return false;
    if (filters.cityId && h.cityId !== filters.cityId) return false;
    if (filters.subCityId && h.subCityId !== filters.subCityId) return false;
    return true;
  });
};

export const getFallbackHealthIssues = () => FALLBACK_HEALTH_ISSUES;

export const getFallbackDoctors = (hospitalId, departmentId) => {
  return FALLBACK_DOCTORS.filter(d => {
    const hId = d.hospitalId?._id || d.hospitalId;
    const deptId = d.departmentId?._id || d.departmentId;
    if (hospitalId && hId !== hospitalId) return false;
    if (departmentId && deptId !== departmentId) return false;
    return true;
  });
};

export const getFallbackDoctorAvailability = (doctorId, date) => {
  return [
    { _id: 's1', startTime: '09:30 AM', status: 'AVAILABLE', bookedSlots: 2, totalSlots: 5 },
    { _id: 's2', startTime: '10:30 AM', status: 'AVAILABLE', bookedSlots: 1, totalSlots: 5 },
    { _id: 's3', startTime: '11:30 AM', status: 'LIMITED', bookedSlots: 4, totalSlots: 5 },
    { _id: 's4', startTime: '02:00 PM', status: 'AVAILABLE', bookedSlots: 0, totalSlots: 5 },
    { _id: 's5', startTime: '03:30 PM', status: 'AVAILABLE', bookedSlots: 1, totalSlots: 5 },
    { _id: 's6', startTime: '04:30 PM', status: 'FULL', bookedSlots: 5, totalSlots: 5 }
  ];
};

export const getFallbackAlternatives = (doctorId) => {
  const currentDoc = FALLBACK_DOCTORS.find(d => d._id === doctorId);
  if (!currentDoc) return FALLBACK_DOCTORS.slice(0, 3);
  const deptId = currentDoc.departmentId?._id || currentDoc.departmentId;
  const matching = FALLBACK_DOCTORS.filter(d => d._id !== doctorId && (d.departmentId?._id || d.departmentId) === deptId);
  return matching.length > 0 ? matching.slice(0, 3) : FALLBACK_DOCTORS.filter(d => d._id !== doctorId).slice(0, 3);
};
`;

fs.writeFileSync(targetFile, jsContent, 'utf-8');
console.log('Successfully written', targetFile, 'size:', (jsContent.length / 1024).toFixed(1), 'KB');
