import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { DrawsCatalogue } from './pages/DrawsCatalogue';
import { RaffleDetail } from './pages/RaffleDetail';
import { Profile } from './pages/Profile';
import { Transparency } from './pages/Transparency';
import { MyEntries } from './pages/MyEntries';

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/draws" element={<DrawsCatalogue />} />
            <Route path="/draw/:slug" element={<RaffleDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/transparency" element={<Transparency />} />
            <Route path="/my-entries" element={<MyEntries />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
