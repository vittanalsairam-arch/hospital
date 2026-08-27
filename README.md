# 🏥 MediOP – National Hospital OP Booking Portal (All 29 States of India)

A comprehensive, state-of-the-art **National Outpatient (OP) Booking & Healthcare Directory Portal** covering **all 29 States & Union Territories of India**, **373 Administrative Districts**, **390 Cities**, and **3,245 Mandals / Taluks / Sub-cities**.

---

## 🌟 Key Highlights & Capabilities

- 🗺️ **Complete 29-State Indian Hierarchy:** 29 States, 373 Districts, 390 Cities, and 3,245 Mandals.
- 🏥 **1,170 Small to Big Hospitals (7 Healthcare Tiers):**
  - **Tier 1:** Urban Primary Health Clinics (UPHC) & Ayushman Arogya Mandir (20–60 Beds)
  - **Tier 2:** Community Health Centers (CHC) & ESI Dispensaries (60–150 Beds)
  - **Tier 3:** Government Area Hospitals & Municipal General (150–350 Beds)
  - **Tier 4:** District Headquarters Civil Hospitals (400–800 Beds)
  - **Tier 5:** Private Multi-Specialty & Surgical Centers (100–300 Beds)
  - **Tier 6:** Super-Specialty Chain Branches (*Apollo, Manipal, Care, Fortis, KIMS, Yashoda, Max, Narayana, Aster, Medicover, Rainbow*) (350–900 Beds)
  - **Tier 7:** Apex Institutes & AIIMS Teaching Hospitals (800–1,500 Beds)
- 🏢 **Top-to-Bottom Hospital Branch Details:**
  - Branch Code (e.g. `BR-APO-0010`, `BR-URB-0001`), Parent Healthcare Network, Total Bed count, Dedicated ICU/CCU Beds, Modular Operation Theatres (OTs).
  - 24x7 Ambulance Helpline (`108`), OPD hours, official email, and patient rating.
  - Empaneled Government Schemes (*Ayushman Bharat PM-JAY, Aarogyasri, CGHS, ECHS, ESI*) and Cashless Private Insurance TPAs.
  - Interactive 4-Photo Campus Gallery (Exterior Facade, Emergency Wing, Diagnostic Imaging, Inpatient Ward).
- 👨‍⚕️ **4,680 Specialist Doctors & 46,800 Live OP Slots:**
  - Live availability checking across 12 clinical specialties.
  - **Alternative Doctor Fallback:** When a doctor is full or on leave, automatically suggests available doctors in the same department.
- 👤 **User Authentication & ABHA Health Card:**
  - Patient & Doctor login, registration, ABHA Digital Health Card issuance, and appointment history.
- 🔊 **Voice Assistant in 7 Regional Languages:**
  - One-click audio reader in English, Hindi, Telugu, Tamil, Kannada, Marathi, and Bengali.
- 🎨 **Glassmorphism Medical UI:**
  - Rich medical gradient mesh, TailwindCSS tokens, and Framer Motion animations.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, TailwindCSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB / Mongoose with automatic `MongoMemoryServer` zero-config fallback |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs |
| **Voice & Accessibility** | Web Speech Synthesis API (multi-dialect) |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm

### 1. Start Backend Server
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5000` and automatically seeds all 29 states, districts, mandals, hospitals, and doctors.*

### 2. Start Frontend Server
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 📁 Repository Architecture

```
HOSPITAL OP/
├── backend/
│   ├── config/db.js                  # MongoDB connection with MongoMemoryServer fallback
│   ├── controllers/                  # API Controllers (Auth, Hospitals, Locations, Doctors, Appointments)
│   ├── models/                       # Mongoose Schemas (State, District, City, SubCity, Hospital, Doctor, Slot, User)
│   ├── routes/                       # Express API Routes
│   ├── seed/                         # Official All-India Seeder (29 States, 373 Districts, 3245 Mandals)
│   └── server.js                     # Main Backend Entry Point
└── frontend/
    ├── src/
    │   ├── components/               # Navbar, HospitalDetailsModal, VoiceAssistant...
    │   ├── context/                  # AuthContext, LanguageContext
    │   ├── pages/                    # Home, SearchFlow, MasterExplorer, DoctorsList, DoctorAvailability, Login, Register...
    │   └── App.jsx                   # Application router & layout
    └── vite.config.js
```

---

## 📄 License
This project is licensed under the MIT License.
