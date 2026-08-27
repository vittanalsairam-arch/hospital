import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    appName: "MediOP",
    tagline: "National OP Booking & Hospital Network",
    home: "Home",
    directory: "29-State Directory",
    search: "Find OP Ticket",
    myBookings: "My OP Tickets",
    selectState: "Select State (29 States Available)",
    selectDistrict: "Select District",
    selectCity: "Select City",
    selectSubCity: "Select Sub-City / Area",
    selectHospital: "Select Hospital",
    selectDoctor: "Select Doctor",
    available: "🟢 AVAILABLE ON DUTY",
    unavailable: "🔴 FULL / UNAVAILABLE",
    alternativeDoctors: "💡 Recommended Available Alternative Doctors",
    listenBtn: "🔊 Listen",
    stopAudio: "⏹️ Stop Voice",
    bookNow: "Book OP Ticket",
    viewDetails: "View Slots & Info",
    easyVoiceGuide: "Click 🔊 on any hospital or doctor to hear details out loud!",
    filterByState: "Browse by State"
  },
  hi: {
    appName: "MediOP",
    tagline: "राष्ट्रीय ओपीडी टिकट बुकिंग सेवा",
    home: "मुख्य पृष्ठ",
    directory: "29 राज्य डायरेक्टरी",
    search: "ओपीडी टिकट खोजें",
    myBookings: "मेरी टिकटें",
    selectState: "राज्य चुनें (29 राज्य उपलब्ध)",
    selectDistrict: "जिला चुनें",
    selectCity: "शहर चुनें",
    selectSubCity: "क्षेत्र / उप-शहर चुनें",
    selectHospital: "अस्पताल चुनें",
    selectDoctor: "डॉक्टर चुनें",
    available: "🟢 उपलब्ध (ड्यूटी पर)",
    unavailable: "🔴 व्यस्त / उपलब्ध नहीं",
    alternativeDoctors: "💡 सुझाये गए अन्य उपलब्ध डॉक्टर",
    listenBtn: "🔊 बोलकर सुनें",
    stopAudio: "⏹️ आवाज़ रोकें",
    bookNow: "ओपीडी टिकट बुक करें",
    viewDetails: "समय और विवरण देखें",
    easyVoiceGuide: "किसी भी अस्पताल या डॉक्टर के विवरण सुनने के लिए 🔊 पर क्लिक करें!",
    filterByState: "राज्य अनुसार देखें"
  },
  te: {
    appName: "MediOP",
    tagline: "జాతీయ OP టికెట్ బుకింగ్ సర్వీస్",
    home: "హోమ్",
    directory: "29 రాష్ట్రాల డైరెక్టరీ",
    search: "OP టికెట్ వెతకండి",
    myBookings: "నా టికెట్లు",
    selectState: "రాష్ట్రం ఎంచుకోండి (29 రాష్ట్రాలు)",
    selectDistrict: "జిల్లా ఎంచుకోండి",
    selectCity: "నగరం ఎంచుకోండి",
    selectSubCity: "ప్రాంతం / ఏరియా ఎంచుకోండి",
    selectHospital: "ఆసుపత్రి ఎంచుకోండి",
    selectDoctor: "డాక్టర్ ఎంచుకోండి",
    available: "🟢 అందుబాటులో ఉన్నారు",
    unavailable: "🔴 ప్రస్తుతం అందుబాటులో లేరు",
    alternativeDoctors: "💡 ఇతర అందుబాటులో ఉన్న డాక్టర్లు",
    listenBtn: "🔊 వినండి",
    stopAudio: "⏹️ ఆపండి",
    bookNow: "OP టికెట్ బుక్ చేయండి",
    viewDetails: "వివరాలు & స్లాట్లు చూడండి",
    easyVoiceGuide: "వినడానికి 🔊 బటన్ నొక్కండి!",
    filterByState: "రాష్ట్రాల వారీగా చూడండి"
  },
  ta: {
    appName: "MediOP",
    tagline: "தேசிய ஓபிடி முன்பதிవు சேவை",
    home: "முகப்பு",
    directory: "29 மாநிலங்கள்",
    search: "OP தேடுக",
    myBookings: "எனது முன்பதிவுகள்",
    selectState: "மாநிலத்தை தேர்வு செய்க",
    selectDistrict: "மாவட்டத்தை தேர்வு செய்க",
    selectCity: "நகரத்தை தேர்வு செய்க",
    selectSubCity: "பகுதியை தேர்வு செய்க",
    selectHospital: "மருத்துவமனையை தேர்வு செய்க",
    selectDoctor: "முன்னணி மருத்துவரை தேர்வு செய்க",
    available: "🟢 பணியில் உள்ளார்",
    unavailable: "🔴 கிடைக்கவில்லை",
    alternativeDoctors: "💡 மாற்று மருத்துவர்கள்",
    listenBtn: "🔊 கேட்க",
    stopAudio: "⏹️ நிறுத்து",
    bookNow: "முன்பதிவு செய்",
    viewDetails: "விவரங்களை காண்க",
    easyVoiceGuide: "கேட்க 🔊 பொத்தானை அழுத்தவும்!",
    filterByState: "மாநில வாரியாக"
  },
  kn: {
    appName: "MediOP",
    tagline: "ರಾಷ್ಟ್ರೀಯ OP ಬುಕಿಂಗ್ ಸೇವೆ",
    home: "ಮುಖ್ಯ ಪುಟ",
    directory: "29 ರಾಜ್ಯಗಳ ಡೈರೆಕ್ಟರಿ",
    search: "OP ಹುಡುಕಿ",
    myBookings: "ನನ್ನ ಬುಕಿಂಗ್‌ಗಳು",
    selectState: "ರಾಜ್ಯ ಆಯ್ಕೆಮಾಡಿ",
    selectDistrict: "ಜಿಲ್ಲೆ ಆಯ್ಕೆಮಾಡಿ",
    selectCity: "ನಗರ ಆಯ್ಕೆಮಾಡಿ",
    selectSubCity: "ಪ್ರದೇಶ ಆಯ್ಕೆಮಾಡಿ",
    selectHospital: "ಆಸ್ಪತ್ರೆ ಆಯ್ಕೆಮಾಡಿ",
    selectDoctor: "ವೈದ್ಯರನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    available: "🟢 ಲಭ್ಯವಿದೆ",
    unavailable: "🔴 ಲಭ್ಯವಿಲ್ಲ",
    alternativeDoctors: "💡 ಪರ್ಯಾಯ ಲಭ್ಯವಿರುವ ವೈದ್ಯರು",
    listenBtn: "🔊 ಆಲಿಸಿ",
    stopAudio: "⏹️ ನಿಲ್ಲಿಸಿ",
    bookNow: "ಟಿಕೆಟ್ ಬುಕ್ ಮಾಡಿ",
    viewDetails: "ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    easyVoiceGuide: "ಆಲಿಸಲು 🔊 ಬಟನ್ ಒತ್ತಿ!",
    filterByState: "ರಾಜ್ಯವಾರು ವೀಕ್ಷಿಸಿ"
  },
  mr: {
    appName: "MediOP",
    tagline: "राष्ट्रीय ओपीडी बुकिंग नेटवर्क",
    home: "मुख्य पृष्ठ",
    directory: "29 राज्य सूची",
    search: "ओपीडी शोधा",
    myBookings: "माझ्या बुकिंग्स",
    selectState: "राज्य निवडा",
    selectDistrict: "जिल्हा निवडा",
    selectCity: "शहर निवडा",
    selectSubCity: "भाग निवडा",
    selectHospital: "रुग्णालय निवडा",
    selectDoctor: "डॉक्टर निवडा",
    available: "🟢 उपलब्ध आहेत",
    unavailable: "🔴 सध्या उपलब्ध नाहीत",
    alternativeDoctors: "💡 पर्याय म्हणून उपलब्ध डॉक्टर",
    listenBtn: "🔊 ऐका",
    stopAudio: "⏹️ थांबवा",
    bookNow: "तिकीट बुक करा",
    viewDetails: "वेळ आणि माहिती पहा",
    easyVoiceGuide: "ऐकण्यासाठी 🔊 बटणावर क्लिक करा!",
    filterByState: "राज्यानुसार पहा"
  },
  bn: {
    appName: "MediOP",
    tagline: "জাতীয় ওপিডি টিকিট বুকিং সেবা",
    home: "হোম",
    directory: "২৯টি রাজ্য ডিরেক্টরি",
    search: "ওপিডি খুঁজুন",
    myBookings: "আমার বুকিং",
    selectState: "রাজ্য নির্বাচন করুন",
    selectDistrict: "জেলা নির্বাচন করুন",
    selectCity: "শহর নির্বাচন করুন",
    selectSubCity: "এলাকা নির্বাচন করুন",
    selectHospital: "হাসপাতাল নির্বাচন করুন",
    selectDoctor: "ডাক্তার নির্বাচন করুন",
    available: "🟢 উপলব্ধ আছেন",
    unavailable: "🔴 উপলব্ধ নেই",
    alternativeDoctors: "💡 বিকল্প উপলব্ধ ডাক্তারগণ",
    listenBtn: "🔊 শুনুন",
    stopAudio: "⏹️ থামুন",
    bookNow: "টিকিট বুক করুন",
    viewDetails: "বিস্তারিত দেখুন",
    easyVoiceGuide: "শুনতে 🔊 বোতামে চাপ দিন!",
    filterByState: "রাজ্য ভিত্তিক দেখুন"
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
