import { Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { PWAProvider } from './context/PWAContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchFlow from './pages/SearchFlow';
import MasterExplorer from './pages/MasterExplorer';
import DoctorsList from './pages/DoctorsList';
import DoctorAvailability from './pages/DoctorAvailability';
import BookingConfirmation from './pages/BookingConfirmation';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import VoiceAssistantWidget from './components/VoiceAssistant';
import InstallAppModal from './components/InstallAppModal';
import InstallAppBanner from './components/InstallAppBanner';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <PWAProvider>
          <div className="min-h-screen flex flex-col medical-bg-mesh text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/directory" element={<MasterExplorer />} />
                <Route path="/search" element={<SearchFlow />} />
                <Route path="/doctors" element={<DoctorsList />} />
                <Route path="/doctor/:id/availability" element={<DoctorAvailability />} />
                <Route path="/confirmation/:id" element={<BookingConfirmation />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Fallback route for SPA unmatched paths */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <VoiceAssistantWidget />
            <InstallAppModal />
            <InstallAppBanner />
          </div>
        </PWAProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
