const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const State = require('../models/State');
const District = require('../models/District');
const City = require('../models/City');
const SubCity = require('../models/SubCity');
const Department = require('../models/Department');
const HealthIssue = require('../models/HealthIssue');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const DoctorSchedule = require('../models/DoctorSchedule');

const statesData = require('./statesData');

dotenv.config({ path: '../.env' });

const seedDatabase = async (skipConnect = false) => {
  try {
    if (!skipConnect) {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mediop';
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
      console.log('MongoDB Connected for Seeding');
    }

    console.log('Clearing existing database collections...');
    await Promise.all([
      User.deleteMany({}),
      State.deleteMany({}),
      District.deleteMany({}),
      City.deleteMany({}),
      SubCity.deleteMany({}),
      Department.deleteMany({}),
      HealthIssue.deleteMany({}),
      Hospital.deleteMany({}),
      Doctor.deleteMany({}),
      DoctorSchedule.deleteMany({})
    ]);

    // 1. Seed Authentic Users (Patients & Doctors)
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('admin123', salt);
    await User.create([
      { 
        name: 'Sairam Vittanala', 
        email: 'sairam@hospitalop.in', 
        password: defaultPassword, 
        role: 'patient', 
        age: 28, 
        gender: 'Male', 
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1594824813571-638f026361a1?auto=format&fit=crop&w=180&h=180&q=80',
        abhaId: '9821-4412-8820',
        city: 'Visakhapatnam',
        state: 'Andhra Pradesh'
      },
      { 
        name: 'Dr. Deepthi', 
        email: 'dr.deepthi@hospitalop.in', 
        password: defaultPassword, 
        role: 'doctor', 
        age: 42, 
        gender: 'Female', 
        phone: '+91 98480 12345',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=180&h=180&q=80',
        abhaId: 'DOC-8820-4100',
        city: 'Visakhapatnam',
        state: 'Andhra Pradesh'
      },
      { 
        name: 'Priya Sharma', 
        email: 'priya@example.com', 
        password: defaultPassword, 
        role: 'patient', 
        age: 26, 
        gender: 'Female', 
        phone: '+91 91234 56789',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&h=180&q=80',
        abhaId: '9821-7711-2091',
        city: 'Hyderabad',
        state: 'Telangana'
      },
      { 
        name: 'Hospital Desk Admin', 
        email: 'admin@mediop.com', 
        password: defaultPassword, 
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=180&h=180&q=80',
        abhaId: 'ADMIN-HQ-01'
      }
    ]);

    // 2. Departments
    const deptNames = [
      'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine',
      'Dermatology', 'Gynecology', 'ENT', 'Gastroenterology', 'Ophthalmology',
      'Pulmonology', 'Oncology'
    ];

    const createdDepts = await Department.insertMany(deptNames.map(name => ({ name })));
    const deptMap = {};
    createdDepts.forEach(d => { deptMap[d.name] = d._id; });

    // 3. Health Issues
    const healthIssuesData = [
      { name: 'Heart & Chest Pain', departmentId: deptMap['Cardiology'], icon: '❤️' },
      { name: 'Brain, Stroke & Nerve Issues', departmentId: deptMap['Neurology'], icon: '🧠' },
      { name: 'Bone, Joint & Fracture', departmentId: deptMap['Orthopedics'], icon: '🦴' },
      { name: 'Child Health, Vaccine & Fever', departmentId: deptMap['Pediatrics'], icon: '👶' },
      { name: 'General Fever, Cold & Diabetes', departmentId: deptMap['General Medicine'], icon: '🩺' },
      { name: 'Skin Rash, Acne & Allergy', departmentId: deptMap['Dermatology'], icon: '✨' },
      { name: 'Pregnancy & Women Wellness', departmentId: deptMap['Gynecology'], icon: '🤰' },
      { name: 'Ear Pain, Sinus & Throat', departmentId: deptMap['ENT'], icon: '👂' },
      { name: 'Stomach Ache & Digestion', departmentId: deptMap['Gastroenterology'], icon: '🧪' },
      { name: 'Eye Testing & Vision Care', departmentId: deptMap['Ophthalmology'], icon: '👁️' },
      { name: 'Asthma, Cough & Lungs', departmentId: deptMap['Pulmonology'], icon: '🫁' },
      { name: 'Cancer Screening & Tumors', departmentId: deptMap['Oncology'], icon: '🎗️' }
    ];
    await HealthIssue.insertMany(healthIssuesData);

    // 4. Hospital Exterior Out-View Photo Assets
    const hospitalExteriorImages = [
      'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80', // Modern glass multi-specialty facade
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80', // Hospital campus entrance & emergency wing
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80', // High-tech hospital building exterior
      'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=1200&q=80', // Metropolitan medical center building
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80', // Government Area Hospital & Medical Institute
      'https://images.unsplash.com/photo-1586773860383-dab5f3bc1bcc?auto=format&fit=crop&w=1200&q=80', // Super specialty tower exterior view
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80', // Area Community Hospital & OP wing
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80'  // Apex healthcare facility architecture
    ];

    // Hospital Brands Template: Covering Smallest (Tier 1 Clinics) to Biggest (Tier 7 Apex AIIMS) & All Major Chains with Branches
    const hospitalBrands = [
      // 🩺 Tier 1: Smallest - Neighborhood & Urban Primary Clinics (20-60 Beds)
      { 
        prefix: 'Urban Primary Health Clinic (UPHC)', 
        type: 'Neighborhood OP Clinic', 
        tier: 'Tier 1 - Neighborhood Clinic',
        parentChain: 'National Urban Health Mission (NUHM)',
        emergency: false, 
        beds: 45, 
        icu: 6,
        ots: 1,
        year: 2018, 
        rating: 4.4,
        schemes: ['Ayushman Bharat (PM-JAY)', 'State Free Medicine Scheme', 'National Health Mission Free OP'],
        facilities: ['Outpatient Consultation', 'Basic Diagnostic Lab', 'Immunization & Vaccination', 'Generic Pharmacy', 'Daycare Observation']
      },
      { 
        prefix: 'Ayushman Arogya Mandir Community Clinic', 
        type: 'Primary Healthcare Clinic', 
        tier: 'Tier 1 - Neighborhood Clinic',
        parentChain: 'Government Health & Wellness Centers',
        emergency: false, 
        beds: 35, 
        icu: 4,
        ots: 1,
        year: 2020, 
        rating: 4.5,
        schemes: ['Ayushman Bharat (PM-JAY)', 'Free Essential Diagnostics', 'Maternal & Child Health Scheme'],
        facilities: ['Primary OP Consultations', 'Maternal Care', 'Tele-Consultation with Specialists', 'Free Essential Drugs', 'Blood Pressure & Diabetes Screening']
      },

      // 🏥 Tier 2: Small-Medium - Community Health Centers & Dispensaries (60-150 Beds)
      { 
        prefix: 'Community Health Center (CHC) Area Hospital', 
        type: 'Community Secondary Hospital', 
        tier: 'Tier 2 - Community Health Center (CHC)',
        parentChain: 'State Directorate of Health Services',
        emergency: true, 
        beds: 120, 
        icu: 15,
        ots: 3,
        year: 2008, 
        rating: 4.5,
        schemes: ['Ayushman Bharat (PM-JAY)', 'State Aarogyasri / Health Assurance', 'Janani Suraksha Yojana'],
        facilities: ['24x7 Emergency & Casualty', 'General Surgery & Orthopedics', 'Pediatric & Neonatal Ward', 'Digital X-Ray & Ultrasound', '24x7 Labor Room']
      },
      { 
        prefix: 'ESI Model Community Dispensary & Day Hospital', 
        type: 'ESI Healthcare Hospital', 
        tier: 'Tier 2 - Community Health Center (CHC)',
        parentChain: 'Employees State Insurance Corporation (ESIC)',
        emergency: true, 
        beds: 150, 
        icu: 18,
        ots: 3,
        year: 2002, 
        rating: 4.6,
        schemes: ['ESI Full Medical Benefit Scheme', 'Ayushman Bharat (PM-JAY)', 'Cashless Super Specialty Referral'],
        facilities: ['24x7 ESI Casualty', 'Occupational Health Wing', 'Cardiology & Diabetology OP', 'Automated Biochemistry Lab', 'Physiotherapy & Rehab']
      },

      // 🏛️ Tier 3: Medium - Government Area Hospitals & Municipal General (150-350 Beds)
      { 
        prefix: 'Government Area Hospital', 
        type: 'Area Headquarters Hospital', 
        tier: 'Tier 3 - Government Area Hospital',
        parentChain: 'State Health Medical Services',
        emergency: true, 
        beds: 350, 
        icu: 45,
        ots: 6,
        year: 1998, 
        rating: 4.6,
        schemes: ['Ayushman Bharat (PM-JAY)', 'Dr. YSR Aarogyasri / State Health Card', 'ECHS', 'CGHS'],
        facilities: ['24x7 Trauma & Emergency Bay', 'ICU, CCU & NICU Units', 'Modular Operation Theatres', 'CT Scan & 24x7 Blood Storage', 'Comprehensive Dialysis Center']
      },
      { 
        prefix: 'Municipal Corporation Area General Hospital', 
        type: 'Municipal General Hospital', 
        tier: 'Tier 3 - Government Area Hospital',
        parentChain: 'Municipal Corporation Health Department',
        emergency: true, 
        beds: 280, 
        icu: 35,
        ots: 5,
        year: 1995, 
        rating: 4.5,
        schemes: ['Ayushman Bharat (PM-JAY)', 'Urban Healthcare Assistance', 'Cashless TPA Insurance'],
        facilities: ['24x7 Emergency Ward', 'General Medicine & Surgery', 'Obstetrics & High-Risk Pregnancy', 'Pathology & Microbiology Labs', 'Free Pharmacy Counter']
      },

      // 🏢 Tier 4: Large - District Headquarters Government Civil Hospitals (400-800 Beds)
      { 
        prefix: 'District Headquarters Government Civil Hospital', 
        type: 'District Apex Civil Hospital', 
        tier: 'Tier 4 - District Headquarters Hospital',
        parentChain: 'Department of Health & Family Welfare',
        emergency: true, 
        beds: 650, 
        icu: 80,
        ots: 12,
        year: 1988, 
        rating: 4.7,
        schemes: ['Ayushman Bharat (PM-JAY)', 'State Government Health Scheme (SGHS)', 'ECHS', 'CGHS', 'Railway Medical Pass'],
        facilities: ['Level-1 Emergency & Multi-Trauma Center', 'Dedicated Cardiac Care Unit (CCU)', 'Advanced CT & MRI Diagnostics', 'Licensed 24x7 Blood Bank & Component Separation', 'Burn Care & Plastic Surgery Unit']
      },

      // 🏥 Tier 5: Private Multi-Specialty & Surgical Centers (100-300 Beds)
      { 
        prefix: 'LifeCare Multi-Specialty & Surgical Hospital', 
        type: 'Private Multi-Specialty', 
        tier: 'Tier 5 - Multi-Specialty Private',
        parentChain: 'LifeCare Hospitals Network',
        emergency: true, 
        beds: 220, 
        icu: 30,
        ots: 5,
        year: 2012, 
        rating: 4.7,
        schemes: ['Ayushman Bharat (PM-JAY)', 'Private Cashless TPA (Star, HDFC, ICICI, MediAssist)', 'Corporate Tie-Ups'],
        facilities: ['24x7 Emergency & Critical Care', 'Laparoscopic Minimally Invasive Surgery', 'Joint Replacement Center', 'Comprehensive Maternity Suites', 'Cath Lab & Stroke Management']
      },
      { 
        prefix: 'Sunrise Hospital & Trauma Institute', 
        type: 'Multi-Specialty Center', 
        tier: 'Tier 5 - Multi-Specialty Private',
        parentChain: 'Sunrise Healthcare Group',
        emergency: true, 
        beds: 180, 
        icu: 25,
        ots: 4,
        year: 2015, 
        rating: 4.7,
        schemes: ['All Major Cashless Insurance TPAs', 'State Health Schemes', 'Corporate Healthcare Plans'],
        facilities: ['24x7 Polytrauma Management', 'Neurosurgery & Spine Center', 'Advanced Dialysis Unit', 'High-Definition Endoscopy', 'Emergency Mobile ICU Ambulance']
      },

      // ⭐ Tier 6: Super-Specialty Hospital Chains with Branch Networks (350-900 Beds)
      { 
        prefix: 'Apollo Super Specialty Hospital Branch', 
        type: 'Quaternary Care Multi-Specialty', 
        tier: 'Tier 6 - Super-Specialty Chain Branch',
        parentChain: 'Apollo Hospitals Enterprise Ltd.',
        emergency: true, 
        beds: 750, 
        icu: 120,
        ots: 18,
        year: 2006, 
        rating: 4.9,
        schemes: ['Ayushman Bharat (PM-JAY)', 'CGHS', 'ECHS', 'Apollo Munich & All Cashless TPAs', 'International Patient Insurance'],
        facilities: ['Apollo 24x7 Emergency & Rapid Response Team', 'Robotic Surgery (Da Vinci Xi)', 'Comprehensive Cancer Center & PET-CT', 'Organ Transplant Center (Liver, Kidney, Heart)', '3T Digital MRI & Dual-Source 512 Slice CT']
      },
      { 
        prefix: 'Manipal Hospital Branch Network', 
        type: 'Super Specialty Institute', 
        tier: 'Tier 6 - Super-Specialty Chain Branch',
        parentChain: 'Manipal Health Enterprises',
        emergency: true, 
        beds: 650, 
        icu: 100,
        ots: 15,
        year: 2009, 
        rating: 4.9,
        schemes: ['Ayushman Bharat (PM-JAY)', 'ECHS', 'CGHS', 'All Leading Cashless TPA Networks'],
        facilities: ['24x7 Comprehensive Trauma & Code Red Stroke Center', 'Bone Marrow & Solid Organ Transplant', 'Advanced Interventional Cardiology Cath Labs', 'High-Risk Neonatal NICU Level-3', 'Automated Molecular Diagnostic Labs']
      },
      { 
        prefix: 'Care Multi-Specialty Hospital Branch', 
        type: 'Tertiary & Super Specialty', 
        tier: 'Tier 6 - Super-Specialty Chain Branch',
        parentChain: 'Care Hospitals Group (Evercare Network)',
        emergency: true, 
        beds: 550, 
        icu: 85,
        ots: 14,
        year: 2004, 
        rating: 4.8,
        schemes: ['State Health Assurance Schemes', 'Ayushman Bharat (PM-JAY)', 'ECHS', 'All Private Cashless TPAs'],
        facilities: ['Care Heart Institute & ECMO Support', 'Neuro Critical Care Unit', 'Kidney Care & Renal Transplant Suite', 'Advanced Gastro & HPB Surgery', '24x7 Critical Care Ambulance']
      },
      { 
        prefix: 'Fortis Escorts Healthcare Branch', 
        type: 'Super Specialty Heart & General', 
        tier: 'Tier 6 - Super-Specialty Chain Branch',
        parentChain: 'Fortis Healthcare Ltd. (IHH)',
        emergency: true, 
        beds: 500, 
        icu: 80,
        ots: 12,
        year: 2008, 
        rating: 4.8,
        schemes: ['CGHS', 'ECHS', 'Ayushman Bharat (PM-JAY)', 'Cashless Insurance Corporate Plans'],
        facilities: ['Fortis Heart & Vascular Institute', 'Joint Replacement with Navigation', 'Liver & Digestive Diseases Center', '24x7 Critical Care & Trauma Service', 'Advanced Sleep Lab & Pulmonology']
      },
      { 
        prefix: 'KIMS Super Specialty Hospital Branch', 
        type: 'Quaternary Super Specialty', 
        tier: 'Tier 6 - Super-Specialty Chain Branch',
        parentChain: 'Krishna Institute of Medical Sciences (KIMS)',
        emergency: true, 
        beds: 650, 
        icu: 110,
        ots: 16,
        year: 2007, 
        rating: 4.8,
        schemes: ['Dr. YSR Aarogyasri', 'Ayushman Bharat (PM-JAY)', 'ECHS', 'CGHS', 'All Cashless Insurance'],
        facilities: ['Heart & Lung Transplant Institute', 'Comprehensive Neurosciences Center', 'Pediatric Super Specialty & NICU', 'Day Care Chemotherapy & Oncology', 'Round the Clock Blood Bank & Dialysis']
      },
      { 
        prefix: 'Yashoda Super Specialty Hospital Branch', 
        type: 'Quaternary Healthcare Hospital', 
        tier: 'Tier 6 - Super-Specialty Chain Branch',
        parentChain: 'Yashoda Group of Hospitals',
        emergency: true, 
        beds: 600, 
        icu: 95,
        ots: 14,
        year: 2010, 
        rating: 4.8,
        schemes: ['State Employee Health Schemes', 'Ayushman Bharat', 'ECHS', 'All Cashless TPA Network'],
        facilities: ['Tri-Beam RapidArc Radiotherapy Cancer Center', 'Comprehensive Heart Failure Clinic', 'Interventional Pulmonology & Bronchoscopy', '24x7 Stroke Rapid Rescue Protocol', 'Air Ambulance Transfer Support']
      },
      { 
        prefix: 'Max Super Specialty Hospital Branch', 
        type: 'Quaternary Care Hospital', 
        tier: 'Tier 6 - Super-Specialty Chain Branch',
        parentChain: 'Max Healthcare Institute Ltd.',
        emergency: true, 
        beds: 700, 
        icu: 115,
        ots: 16,
        year: 2011, 
        rating: 4.9,
        schemes: ['CGHS', 'ECHS', 'Ayushman Bharat (PM-JAY)', 'International Health Insurance', 'Cashless TPA'],
        facilities: ['Max Institute of Cancer Care', 'Robotic Joint & Spine Surgery', 'Bone Marrow & Kidney Transplants', 'Max 24x7 Emergency & Critical Care', 'Advanced Genetic & Genomic Testing']
      },
      { 
        prefix: 'Narayana Health Multi-Specialty City Branch', 
        type: 'Cardiac & Multi-Specialty Care', 
        tier: 'Tier 6 - Super-Specialty Chain Branch',
        parentChain: 'Narayana Hrudayalaya Health Network',
        emergency: true, 
        beds: 850, 
        icu: 140,
        ots: 20,
        year: 2005, 
        rating: 4.9,
        schemes: ['Ayushman Bharat (PM-JAY)', 'Yeshasvini / State Schemes', 'ECHS', 'CGHS', 'Cashless TPA'],
        facilities: ['High Volume Adult & Pediatric Cardiac Surgery', 'Comprehensive Oncology & Bone Marrow Unit', 'Advanced Dialysis & Renal Care', '24x7 Polytrauma Care & Stroke Unit', 'Affordable Super Specialty OP Services']
      },
      { 
        prefix: 'Aster DM Healthcare Prime Hospital Branch', 
        type: 'Super Specialty Hospital', 
        tier: 'Tier 6 - Super-Specialty Chain Branch',
        parentChain: 'Aster DM Healthcare',
        emergency: true, 
        beds: 450, 
        icu: 70,
        ots: 10,
        year: 2015, 
        rating: 4.8,
        schemes: ['Cashless TPA Insurance', 'Ayushman Bharat (PM-JAY)', 'ECHS', 'CGHS'],
        facilities: ['Aster Orthopedics & Joint Center', 'Women & Child Super Specialty', 'Advanced Gastroenterology & Liver Center', '24x7 Emergency Department', 'Minimally Invasive Laparoscopy']
      },
      { 
        prefix: 'Medicover Multi-Specialty Hospital Branch', 
        type: 'Super Specialty Care', 
        tier: 'Tier 6 - Super-Specialty Chain Branch',
        parentChain: 'Medicover Healthcare Group Europe-India',
        emergency: true, 
        beds: 480, 
        icu: 75,
        ots: 11,
        year: 2016, 
        rating: 4.8,
        schemes: ['State Health Insurance', 'Ayushman Bharat (PM-JAY)', 'Cashless Insurance Plans'],
        facilities: ['24x7 Emergency & Trauma Care', 'Interventional Cardiology & Cath Lab', 'Neuro Intensive Care', 'Dialysis & Renal Sciences', 'Comprehensive Executive Health Check']
      },
      { 
        prefix: 'Rainbow Childrens & General Hospital Branch', 
        type: 'Pediatric & Perinatal Super Specialty', 
        tier: 'Tier 6 - Super-Specialty Chain Branch',
        parentChain: 'Rainbow Childrens Medicare Ltd.',
        emergency: true, 
        beds: 350, 
        icu: 60,
        ots: 8,
        year: 2012, 
        rating: 4.9,
        schemes: ['All Major Cashless Insurance TPAs', 'State Health Schemes', 'Corporate Family Health Plans'],
        facilities: ['Level-3 NICU & PICU Critical Care', 'Pediatric Surgery & Cardiology', 'Perinatology & High-Risk Obstetrics', '24x7 Pediatric Emergency & Ambulance', 'Developmental Pediatrics & Child Rehab']
      },

      // 🏛️ Tier 7: Apex Institutes & AIIMS Teaching Hospitals (800-1500 Beds)
      { 
        prefix: 'AIIMS Regional Apex Teaching & Research Hospital', 
        type: 'Apex National Autonomous Institute', 
        tier: 'Tier 7 - Apex Institute / AIIMS',
        parentChain: 'All India Institute of Medical Sciences (AIIMS)',
        emergency: true, 
        beds: 1200, 
        icu: 200,
        ots: 28,
        year: 2014, 
        rating: 4.9,
        schemes: ['Ayushman Bharat (PM-JAY)', 'National Health Mission Free Care', 'CGHS', 'ECHS', 'Central Autonomous Free Care'],
        facilities: ['Apex Level-1 Trauma & Disaster Response Center', 'Advanced Robotic Surgery & Hybrid OTs', 'Comprehensive Cancer & Nuclear Medicine Institute', 'Multi-Organ Transplant Centers', 'Telemedicine & National Medical Research Labs']
      },
      { 
        prefix: 'Government General Apex Medical College Hospital', 
        type: 'Government Apex Medical College', 
        tier: 'Tier 7 - Apex Institute / AIIMS',
        parentChain: 'Directorate of Medical Education (DME)',
        emergency: true, 
        beds: 1100, 
        icu: 180,
        ots: 24,
        year: 1972, 
        rating: 4.7,
        schemes: ['Ayushman Bharat (PM-JAY)', 'State Free Healthcare for All', 'National Health Programs', 'ECHS', 'CGHS'],
        facilities: ['24x7 Emergency Casualty & Trauma Mega Complex', 'Super Specialty Departments in 25+ Disciplines', 'State-of-the-Art Blood Bank & Component Lab', 'Renal, Cardiac & Neuro Intensive Units', 'Zero-Cost Medicine & Surgery for BPL Patients']
      }
    ];

    // 5. Doctor Templates
    const doctorTemplates = [
      { name: 'Dr. Deepthi', qual: 'MBBS, MD, DM Cardiology', spec: 'Cardiologist', dept: 'Cardiology', fee: 900, exp: 15 },
      { name: 'Dr. Sneha Verma', qual: 'MBBS, MD, DM Neurology', spec: 'Neurologist', dept: 'Neurology', fee: 850, exp: 12 },
      { name: 'Dr. Vikram Rao', qual: 'MBBS, MS Ortho, MCh', spec: 'Orthopedic Surgeon', dept: 'Orthopedics', fee: 1000, exp: 18 },
      { name: 'Dr. Ananya Reddy', qual: 'MBBS, MD Pediatrics', spec: 'Pediatrician', dept: 'Pediatrics', fee: 700, exp: 9 },
      { name: 'Dr. K. Srinivas', qual: 'MBBS, MD General Medicine', spec: 'Senior Consultant Physician', dept: 'General Medicine', fee: 600, exp: 20 },
      { name: 'Dr. Kavita Menon', qual: 'MBBS, MD Dermatology', spec: 'Dermatologist', dept: 'Dermatology', fee: 800, exp: 11 },
      { name: 'Dr. M. Swathi', qual: 'MBBS, MS Gynecology', spec: 'Gynecologist & Obstetrician', dept: 'Gynecology', fee: 950, exp: 14 },
      { name: 'Dr. Rajiv Gupta', qual: 'MBBS, MS ENT', spec: 'ENT Surgeon', dept: 'ENT', fee: 750, exp: 16 },
      { name: 'Dr. Amit Shah', qual: 'MBBS, MD, DM Gastro', spec: 'Gastroenterologist', dept: 'Gastroenterology', fee: 1100, exp: 17 },
      { name: 'Dr. S. Sundaram', qual: 'MBBS, MS Ophthalmology', spec: 'Eye Specialist', dept: 'Ophthalmology', fee: 700, exp: 13 },
      { name: 'Dr. Rajesh Iyer', qual: 'MBBS, MD Pulmonology', spec: 'Pulmonologist', dept: 'Pulmonology', fee: 900, exp: 14 },
      { name: 'Dr. Priya Sharma', qual: 'MBBS, MD, DM Oncology', spec: 'Medical Oncologist', dept: 'Oncology', fee: 1200, exp: 19 }
    ];

    const todayStr = new Date().toISOString().split('T')[0];
    const timeSlots = [
      { start: '09:00', end: '09:15' }, { start: '09:30', end: '09:45' },
      { start: '10:00', end: '10:15' }, { start: '10:30', end: '10:45' },
      { start: '11:00', end: '11:15' }, { start: '11:30', end: '11:45' },
      { start: '14:00', end: '14:15' }, { start: '14:30', end: '14:45' },
      { start: '15:00', end: '15:15' }, { start: '16:00', end: '16:15' }
    ];

    let totalStatesCount = 0;
    let totalDistrictsCount = 0;
    let totalCitiesCount = 0;
    let totalSubCitiesCount = 0;
    let totalHospitalsCount = 0;
    let totalDoctorsCount = 0;
    let totalSlotsCount = 0;

    console.log('Seeding National Hierarchy across all 29 States of India...');

    for (const stateItem of statesData) {
      const stateObj = await State.create({ name: stateItem.name });
      totalStatesCount++;

      for (const distItem of stateItem.districts) {
        const distObj = await District.create({ name: distItem.name, stateId: stateObj._id });
        totalDistrictsCount++;

        for (const cityItem of distItem.cities) {
          const cityObj = await City.create({
            name: cityItem.name,
            stateId: stateObj._id,
            districtId: distObj._id
          });
          totalCitiesCount++;

          // Create SubCities / Areas
          const subCityObjs = [];
          for (const subName of cityItem.subCities) {
            const subObj = await SubCity.create({
              name: subName,
              cityId: cityObj._id,
              districtId: distObj._id,
              stateId: stateObj._id
            });
            subCityObjs.push(subObj);
            totalSubCitiesCount++;
          }

          // Create Hospitals in SubCities / City
          // Place hospitals in the sub-cities for granular neighborhood selection!
          const hospitalCountForCity = Math.max(2, Math.min(subCityObjs.length, 3));
          
          for (let h = 0; h < hospitalCountForCity; h++) {
            const assignedSub = subCityObjs[h % subCityObjs.length];
            const hBrand = hospitalBrands[(totalHospitalsCount) % hospitalBrands.length];
            const mainExteriorImage = hospitalExteriorImages[(totalHospitalsCount) % hospitalExteriorImages.length];
            const emergencyImage = hospitalExteriorImages[(totalHospitalsCount + 1) % hospitalExteriorImages.length];
            const diagnosticImage = hospitalExteriorImages[(totalHospitalsCount + 2) % hospitalExteriorImages.length];
            const inpatientImage = hospitalExteriorImages[(totalHospitalsCount + 3) % hospitalExteriorImages.length];
            totalHospitalsCount++;

            const branchSlug = assignedSub.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const cleanChain = hBrand.parentChain.toLowerCase().replace(/[^a-z0-9]/g, '');

            const hospitalObj = await Hospital.create({
              name: `${hBrand.prefix} - ${assignedSub.name}`,
              cityId: cityObj._id,
              districtId: distObj._id,
              stateId: stateObj._id,
              subCityId: assignedSub._id,
              address: `${assignedSub.name}, ${cityItem.name}, ${distItem.name}, ${stateItem.name}`,
              phone: `0${Math.floor(100 + Math.random() * 899)}-${Math.floor(1000000 + Math.random() * 8999999)}`,
              ambulancePhone: hBrand.emergency ? '108 / 1800-425-4444' : '108',
              email: `desk-${branchSlug}@${cleanChain || 'hospitalcare'}.in`,
              website: `https://www.hospitalcare.in/network/${branchSlug}`,
              hospitalType: hBrand.type,
              tier: hBrand.tier,
              branchCode: `BR-${hBrand.prefix.slice(0, 3).toUpperCase()}-${String(totalHospitalsCount).padStart(4, '0')}`,
              parentChain: hBrand.parentChain,
              emergencyAvailable: hBrand.emergency,
              imageUrl: mainExteriorImage,
              gallery: [mainExteriorImage, emergencyImage, diagnosticImage, inpatientImage],
              rating: hBrand.rating || 4.8,
              bedCapacity: hBrand.beds || 300,
              icuBeds: hBrand.icu || 35,
              operationTheatres: hBrand.ots || 6,
              establishedYear: hBrand.year || 2005,
              opdTimings: 'Mon - Sat: 08:00 AM - 08:00 PM | Sun: 09:00 AM - 01:00 PM (24x7 Emergency)',
              accreditations: ['NABH Accredited', 'NABL Quality Lab', 'ABDM Digital Health Certified'],
              governmentSchemes: hBrand.schemes || ['Ayushman Bharat (PM-JAY)', 'State Health Scheme', 'All Cashless TPAs'],
              facilities: hBrand.facilities || ['24x7 Emergency & Trauma', 'Modular OTs', 'Dialysis Unit', 'Digital Blood Bank'],
              departments: createdDepts.map(d => d._id)
            });

            // Assign 4-5 Specialized Doctors per hospital
            const doctorsForHospital = [
              doctorTemplates[(totalDoctorsCount) % doctorTemplates.length],
              doctorTemplates[(totalDoctorsCount + 1) % doctorTemplates.length],
              doctorTemplates[(totalDoctorsCount + 2) % doctorTemplates.length],
              doctorTemplates[(totalDoctorsCount + 3) % doctorTemplates.length]
            ];

            const doctorsToInsert = doctorsForHospital.map(docTpl => {
              totalDoctorsCount++;
              return {
                name: docTpl.name,
                qualification: docTpl.qual,
                specialization: docTpl.spec,
                experience: docTpl.exp,
                hospitalId: hospitalObj._id,
                departmentId: deptMap[docTpl.dept],
                consultationFee: docTpl.fee,
                profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(docTpl.name)}&background=0055D4&color=fff`
              };
            });

            const createdDoctors = await Doctor.insertMany(doctorsToInsert);

            // Generate OP Schedules / Time Slots for each doctor
            const slotsToInsert = [];
            createdDoctors.forEach((doc, docIdx) => {
              // Mark 1 in 4 doctors as FULL / UNAVAILABLE to demonstrate intelligent alternative recommendations
              const isDoctorFull = ((totalDoctorsCount + docIdx) % 4 === 0);

              timeSlots.forEach(slot => {
                slotsToInsert.push({
                  doctorId: doc._id,
                  hospitalId: hospitalObj._id,
                  date: todayStr,
                  startTime: slot.start,
                  endTime: slot.end,
                  slotDuration: 15,
                  totalSlots: 1,
                  bookedSlots: isDoctorFull ? 1 : 0,
                  status: isDoctorFull ? 'UNAVAILABLE' : 'AVAILABLE'
                });
              });
            });

            if (slotsToInsert.length > 0) {
              await DoctorSchedule.insertMany(slotsToInsert);
              totalSlotsCount += slotsToInsert.length;
            }
          }
        }
      }
    }

    console.log(`\n======================================================`);
    console.log(`✅ DATABASE SEEDED SUCCESSFULLY FOR ALL 29 STATES OF INDIA!`);
    console.log(`======================================================`);
    console.log(`🗺️  States        : ${totalStatesCount}`);
    console.log(`📍 Districts     : ${totalDistrictsCount}`);
    console.log(`🏙️  Cities        : ${totalCitiesCount}`);
    console.log(`🏘️  Sub-Cities    : ${totalSubCitiesCount}`);
    console.log(`🏥 Hospitals     : ${totalHospitalsCount}`);
    console.log(`👨‍⚕️ Doctors       : ${totalDoctorsCount}`);
    console.log(`📅 Live OP Slots : ${totalSlotsCount}`);
    console.log(`======================================================\n`);

    if (require.main === module) process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    if (require.main === module) process.exit(1);
  }
};

module.exports = seedDatabase;

if (require.main === module) {
  seedDatabase();
}
