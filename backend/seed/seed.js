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

dotenv.config({ path: '../.env' });

const seedDatabase = async (skipConnect = false) => {
  try {
    if (!skipConnect) {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mediop';
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
      console.log('MongoDB Connected for Seeding');
    }

    // Clear existing data
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

    // 1. Seed Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    await User.create([
      { name: 'Admin User', email: 'admin@mediop.com', password: adminPassword, role: 'admin' },
      { name: 'John Doe', email: 'john@example.com', password: adminPassword, role: 'patient', age: 30, gender: 'Male', phone: '9876543210' },
      { name: 'Priya Sharma', email: 'priya@example.com', password: adminPassword, role: 'patient', age: 28, gender: 'Female', phone: '9123456789' }
    ]);

    // 2. ALL 29 STATES OF INDIA WITH DISTRICTS, CITIES, & SUBCITIES / LOCALITIES
    const statesData = [
      {
        name: 'Andhra Pradesh',
        districts: [
          { name: 'Visakhapatnam', cities: [{ name: 'Visakhapatnam', subCities: ['Gajuwaka', 'MVP Colony', 'Siripuram', 'Madhavadhara'] }, { name: 'Anakapalle', subCities: ['Town Center', 'Ring Road'] }] },
          { name: 'NTR (Krishna)', cities: [{ name: 'Vijayawada', subCities: ['Benz Circle', 'Governorpet', 'Moghalrajpuram', 'One Town'] }, { name: 'Nuzvid', subCities: ['Bus Stand Road'] }] },
          { name: 'Guntur', cities: [{ name: 'Guntur', subCities: ['Broadpet', 'Arundelpet', 'Narasaraopet Road'] }] },
          { name: 'Tirupati', cities: [{ name: 'Tirupati City', subCities: ['Alipiri Road', 'KT Road', 'MR Palle'] }] }
        ]
      },
      {
        name: 'Arunachal Pradesh',
        districts: [
          { name: 'Papum Pare', cities: [{ name: 'Itanagar', subCities: ['Ganga Market', 'Bank Tinali', 'Naharalagun'] }] },
          { name: 'East Siang', cities: [{ name: 'Pasighat', subCities: ['Main Market', 'Gensi Road'] }] }
        ]
      },
      {
        name: 'Assam',
        districts: [
          { name: 'Kamrup Metropolitan', cities: [{ name: 'Guwahati', subCities: ['Dispur', 'GS Road', 'Paltan Bazaar', 'Zeev Nagar'] }] },
          { name: 'Cachar', cities: [{ name: 'Silchar', subCities: ['Tarapur', 'Rangirkhari'] }] }
        ]
      },
      {
        name: 'Bihar',
        districts: [
          { name: 'Patna', cities: [{ name: 'Patna', subCities: ['Kankarbagh', 'Boring Road', 'Patliputra Colony', 'Danapur'] }] },
          { name: 'Gaya', cities: [{ name: 'Gaya', subCities: ['Civil Lines', 'Bodhgaya Road'] }] }
        ]
      },
      {
        name: 'Chhattisgarh',
        districts: [
          { name: 'Raipur', cities: [{ name: 'Raipur', subCities: ['Pandri', 'Shankar Nagar', 'Telibandha'] }] },
          { name: 'Durg', cities: [{ name: 'Bhilai', subCities: ['Sector 6', 'Civic Center'] }] }
        ]
      },
      {
        name: 'Goa',
        districts: [
          { name: 'North Goa', cities: [{ name: 'Panaji', subCities: ['Miramar', 'Campal', 'Fontainhas'] }] },
          { name: 'South Goa', cities: [{ name: 'Margao', subCities: ['Fatorda', 'Aquem'] }] }
        ]
      },
      {
        name: 'Gujarat',
        districts: [
          { name: 'Ahmedabad', cities: [{ name: 'Ahmedabad', subCities: ['SG Highway', 'Bodakdev', 'Navrangpura', 'Satellite'] }] },
          { name: 'Surat', cities: [{ name: 'Surat', subCities: ['Adajan', 'Ghoddod Road', 'Varachha'] }] }
        ]
      },
      {
        name: 'Haryana',
        districts: [
          { name: 'Gurugram', cities: [{ name: 'Gurgaon', subCities: ['DLF Phase 3', 'Cyber City', 'Sohna Road', 'Golf Course Road'] }] },
          { name: 'Faridabad', cities: [{ name: 'Faridabad', subCities: ['Sector 15', 'NIT Area'] }] }
        ]
      },
      {
        name: 'Himachal Pradesh',
        districts: [
          { name: 'Shimla', cities: [{ name: 'Shimla', subCities: ['Mall Road', 'Chotta Shimla', 'Sanjauli'] }] },
          { name: 'Kangra', cities: [{ name: 'Dharamshala', subCities: ['McLeod Ganj', 'Kotwali Bazaar'] }] }
        ]
      },
      {
        name: 'Jharkhand',
        districts: [
          { name: 'Ranchi', cities: [{ name: 'Ranchi', subCities: ['Main Road', 'Lalpur', 'Doranda'] }] },
          { name: 'East Singhbhum', cities: [{ name: 'Jamshedpur', subCities: ['Bistupur', 'Sakchi', 'Kadma'] }] }
        ]
      },
      {
        name: 'Karnataka',
        districts: [
          { name: 'Bengaluru Urban', cities: [{ name: 'Bengaluru', subCities: ['Whitefield', 'Indiranagar', 'Koramangala', 'Jayanagar', 'Electronic City'] }] },
          { name: 'Mysuru', cities: [{ name: 'Mysore', subCities: ['Gokulam', 'Vijayanagar', 'Vontikoppal'] }] }
        ]
      },
      {
        name: 'Kerala',
        districts: [
          { name: 'Ernakulam', cities: [{ name: 'Kochi (Cochin)', subCities: ['Edappally', 'MG Road', 'Kakkanad', 'Marine Drive'] }] },
          { name: 'Thiruvananthapuram', cities: [{ name: 'Trivandrum', subCities: ['Palayam', 'Kazhakkoottam (Technopark)', 'Kowdiar'] }] }
        ]
      },
      {
        name: 'Madhya Pradesh',
        districts: [
          { name: 'Indore', cities: [{ name: 'Indore', subCities: ['Vijay Nagar', 'Palasia', 'Rajendra Nagar'] }] },
          { name: 'Bhopal', cities: [{ name: 'Bhopal', subCities: ['MP Nagar', 'Arera Colony', 'New Market'] }] }
        ]
      },
      {
        name: 'Maharashtra',
        districts: [
          { name: 'Mumbai City', cities: [{ name: 'Mumbai', subCities: ['Bandra West', 'Andheri East', 'Colaba', 'Powai', 'Mulund'] }] },
          { name: 'Pune', cities: [{ name: 'Pune', subCities: ['Baner', 'Kothrud', 'Viman Nagar', 'Hinjewadi'] }] }
        ]
      },
      {
        name: 'Manipur',
        districts: [
          { name: 'Imphal East', cities: [{ name: 'Imphal', subCities: ['Porompat', 'Thangal Bazaar'] }] }
        ]
      },
      {
        name: 'Meghalaya',
        districts: [
          { name: 'East Khasi Hills', cities: [{ name: 'Shillong', subCities: ['Police Bazaar', 'Laitumkhrah', 'Labna'] }] }
        ]
      },
      {
        name: 'Mizoram',
        districts: [
          { name: 'Aizawl', cities: [{ name: 'Aizawl', subCities: ['Zarkawt', 'Chanmari', 'Bawngkawn'] }] }
        ]
      },
      {
        name: 'Nagaland',
        districts: [
          { name: 'Kohima', cities: [{ name: 'Kohima', subCities: ['PR Hill', 'High School Junction'] }] }
        ]
      },
      {
        name: 'Odisha',
        districts: [
          { name: 'Khurda', cities: [{ name: 'Bhubaneswar', subCities: ['Saheed Nagar', 'Nayapalli', 'Jaydev Vihar'] }] },
          { name: 'Cuttack', cities: [{ name: 'Cuttack', subCities: ['Chandi Chowk', 'Cantonment Road'] }] }
        ]
      },
      {
        name: 'Punjab',
        districts: [
          { name: 'Ludhiana', cities: [{ name: 'Ludhiana', subCities: ['Sarabha Nagar', 'Model Town'] }] },
          { name: 'Amritsar', cities: [{ name: 'Amritsar', subCities: ['Ranjit Avenue', 'Mall Road'] }] }
        ]
      },
      {
        name: 'Rajasthan',
        districts: [
          { name: 'Jaipur', cities: [{ name: 'Jaipur', subCities: ['Malviya Nagar', 'Vaishali Nagar', 'C-Scheme'] }] },
          { name: 'Jodhpur', cities: [{ name: 'Jodhpur', subCities: ['Sardarpura', 'Shastri Nagar'] }] }
        ]
      },
      {
        name: 'Sikkim',
        districts: [
          { name: 'East Sikkim', cities: [{ name: 'Gangtok', subCities: ['MG Marg', 'Deorali', 'Tadong'] }] }
        ]
      },
      {
        name: 'Tamil Nadu',
        districts: [
          { name: 'Chennai', cities: [{ name: 'Chennai', subCities: ['Adyar', 'T. Nagar', 'Anna Nagar', 'Velachery', 'O型 (OMR)'] }] },
          { name: 'Coimbatore', cities: [{ name: 'Coimbatore', subCities: ['RS Puram', 'Peelamedu', 'Gandhipuram'] }] }
        ]
      },
      {
        name: 'Telangana',
        districts: [
          { name: 'Hyderabad', cities: [{ name: 'Hyderabad', subCities: ['Banjara Hills', 'Jubilee Hills', 'Charminar', 'Secunderabad'] }] },
          { name: 'Rangareddy', cities: [{ name: 'Cyberabad', subCities: ['Gachibowli', 'Kondapur', 'Hitec City', 'Manikonda'] }] }
        ]
      },
      {
        name: 'Tripura',
        districts: [
          { name: 'West Tripura', cities: [{ name: 'Agartala', subCities: ['Udaypur Road', 'Banamalipur'] }] }
        ]
      },
      {
        name: 'Uttar Pradesh',
        districts: [
          { name: 'Lucknow', cities: [{ name: 'Lucknow', subCities: ['Gomti Nagar', 'Hazratganj', 'Aliganj'] }] },
          { name: 'Gautam Buddha Nagar', cities: [{ name: 'Noida', subCities: ['Sector 62', 'Sector 18', 'Greater Noida'] }] }
        ]
      },
      {
        name: 'Uttarakhand',
        districts: [
          { name: 'Dehradun', cities: [{ name: 'Dehradun', subCities: ['Rajpur Road', 'Clement Town', 'Vasant Vihar'] }] },
          { name: 'Nainital', cities: [{ name: 'Haldwani', subCities: ['Kashipur Road', 'Tallital'] }] }
        ]
      },
      {
        name: 'West Bengal',
        districts: [
          { name: 'Kolkata', cities: [{ name: 'Kolkata', subCities: ['Salt Lake Sector 5', 'New Town', 'Ballygunge', 'Park Street'] }] }
        ]
      },
      {
        name: 'Delhi NCR (UT)',
        districts: [
          { name: 'New Delhi', cities: [{ name: 'New Delhi', subCities: ['Connaught Place', 'Saket', 'Vasant Kunj', 'Hauz Khas'] }] }
        ]
      }
    ];

    // 3. Departments
    const deptNames = [
      'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 
      'General Medicine', 'Dermatology', 'Gynecology', 'ENT', 
      'Gastroenterology', 'Ophthalmology', 'Pulmonology', 'Oncology'
    ];

    const createdDepts = [];
    for (const dName of deptNames) {
      const dept = await Department.create({ name: dName });
      createdDepts.push(dept);
    }

    const deptMap = {};
    createdDepts.forEach(d => { deptMap[d.name] = d._id; });

    // 4. Health Issues
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

    // Hospital Brands
    const hospitalBrands = [
      { prefix: 'Apollo Super Specialty Hospital', type: 'Quaternary Care', emergency: true },
      { prefix: 'Care Multi-Specialty Hospital', type: 'Tertiary Care', emergency: true },
      { prefix: 'KIMS Medical Institute', type: 'Super Specialty', emergency: true },
      { prefix: 'Manipal Healthcare Center', type: 'Super Specialty', emergency: true },
      { prefix: 'Fortis Multi-Specialty Hospital', type: 'Quaternary Care', emergency: true },
      { prefix: 'Yashoda Super Specialty Hospital', type: 'Tertiary Care', emergency: true },
      { prefix: 'Max Super Specialty Hospital', type: 'Super Specialty', emergency: true },
      { prefix: 'Narayana Health City', type: 'Cardiac & Multi-Specialty', emergency: true },
      { prefix: 'Government General Apex Hospital', type: 'Public Multi-Specialty', emergency: true }
    ];

    // Doctor Templates (with varied fees & experiences)
    const doctorNames = [
      { name: 'Dr. Rahul Kumar', qual: 'MBBS, MD, DM Cardiology', spec: 'Cardiologist', dept: 'Cardiology', fee: 900, exp: 15 },
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

    let totalHospitalsCount = 0;
    let totalDoctorsCount = 0;
    let totalSlotsCount = 0;

    // Loop through ALL 29 STATES
    for (const stateItem of statesData) {
      const stateObj = await State.create({ name: stateItem.name });

      for (const distItem of stateItem.districts) {
        const distObj = await District.create({ name: distItem.name, stateId: stateObj._id });

        for (const cityItem of distItem.cities) {
          const cityObj = await City.create({ name: cityItem.name, stateId: stateObj._id, districtId: distObj._id });

          // Seed Sub-cities / Areas
          const subCityObjs = [];
          for (const subName of cityItem.subCities) {
            const subObj = await SubCity.create({
              name: subName,
              cityId: cityObj._id,
              districtId: distObj._id,
              stateId: stateObj._id
            });
            subCityObjs.push(subObj);
          }

          // Seed Hospitals per City / Sub-City
          const hBrand = hospitalBrands[(totalHospitalsCount) % hospitalBrands.length];
          totalHospitalsCount++;
          const targetSubCity = subCityObjs[0] || null;

          const hospitalObj = await Hospital.create({
            name: `${hBrand.prefix} - ${targetSubCity ? targetSubCity.name : cityItem.name}`,
            cityId: cityObj._id,
            districtId: distObj._id,
            stateId: stateObj._id,
            subCityId: targetSubCity ? targetSubCity._id : null,
            address: `${targetSubCity ? targetSubCity.name : cityItem.name}, ${distItem.name}, ${stateItem.name}`,
            phone: `0${Math.floor(100 + Math.random() * 899)}-${Math.floor(1000000 + Math.random() * 8999999)}`,
            hospitalType: hBrand.type,
            emergencyAvailable: hBrand.emergency,
            departments: createdDepts.map(d => d._id)
          });

          // Seed Doctors for Hospital
          const docTemplates = [
            doctorNames[(totalDoctorsCount) % doctorNames.length],
            doctorNames[(totalDoctorsCount + 1) % doctorNames.length],
            doctorNames[(totalDoctorsCount + 2) % doctorNames.length]
          ];

          for (let idx = 0; idx < docTemplates.length; idx++) {
            const docTemplate = docTemplates[idx];
            totalDoctorsCount++;
            
            const doctorObj = await Doctor.create({
              name: `${docTemplate.name}`,
              qualification: docTemplate.qual,
              specialization: docTemplate.spec,
              experience: docTemplate.exp,
              hospitalId: hospitalObj._id,
              departmentId: deptMap[docTemplate.dept],
              consultationFee: docTemplate.fee,
              profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(docTemplate.name)}&background=0055D4&color=fff`
            });

            // Mark 1 out of 5 doctors as "FULL / UNAVAILABLE" so alternative doctor recommendations trigger naturally!
            const isDoctorFull = (totalDoctorsCount % 5 === 0);

            const slotsToInsert = timeSlots.map(slot => ({
              doctorId: doctorObj._id,
              hospitalId: hospitalObj._id,
              date: todayStr,
              startTime: slot.start,
              endTime: slot.end,
              slotDuration: 15,
              totalSlots: 1,
              bookedSlots: isDoctorFull ? 1 : 0, // Booked = 1 makes it full!
              status: isDoctorFull ? 'UNAVAILABLE' : 'AVAILABLE'
            }));

            await DoctorSchedule.insertMany(slotsToInsert);
            totalSlotsCount += slotsToInsert.length;
          }
        }
      }
    }

    console.log(`Database Successfully Seeded for ALL 29 STATES OF INDIA!`);
    console.log(`Summary: ${statesData.length} States, ${totalHospitalsCount} Hospitals, ${totalDoctorsCount} Doctors, ${totalSlotsCount} Doctor OP Slots created.`);

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
