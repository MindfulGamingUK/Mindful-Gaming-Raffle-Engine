import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { DrawsCatalogue } from './pages/DrawsCatalogue';
import { RaffleDetail } from './pages/RaffleDetail';
import { Profile } from './pages/Profile';
import { Transparency } from './pages/Transparency';
import { MyEntries } from './pages/MyEntries';
import { EntryStatus } from './pages/EntryStatus';
import { Support } from './pages/Support';
import { Winners } from './pages/Winners';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <Layout>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/win-to-support" element={<Landing />} />
            <Route path="/draws" element={<DrawsCatalogue />} />
            <Route path="/draw/:slug" element={<RaffleDetail />} />
            <Route path="/status/:intentId" element={<EntryStatus />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/transparency" element={<Transparency />} />
            <Route path="/support" element={<Support />} />
            <Route path="/my-entries" element={<MyEntries />} />
            <Route path="/winners" element={<Winners />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
