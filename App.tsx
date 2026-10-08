import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { SOSPage } from './pages/SOSPage';
import { ContactsPage } from './pages/ContactsPage';
import { EmergencyCardPage } from './pages/EmergencyCardPage';
import { OfflineMapPage } from './pages/OfflineMapPage';
import { ChecklistPage } from './pages/ChecklistPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { SettingsPage } from './pages/SettingsPage';
import { initializeDatabase } from './db/initDb';
import { Zap } from 'lucide-react';

export const App: React.FC = () => {
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    async function init() {
      await initializeDatabase();
      setInitialized(true);
    }
    init();
  }, []);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-[#080b11] flex flex-col items-center justify-center text-white space-y-4">
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 border border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse">
          <Zap className="w-8 h-8 text-amber-300 transform -rotate-12" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-black tracking-widest uppercase">
            BLACK<span className="text-red-500">OUT</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">ARMING OFFLINE ENCRYPTED CACHE...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sos" element={<SOSPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/card" element={<EmergencyCardPage />} />
          <Route path="/map" element={<OfflineMapPage />} />
          <Route path="/checklist" element={<ChecklistPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
