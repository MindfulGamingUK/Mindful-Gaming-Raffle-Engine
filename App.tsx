import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { DrawsCatalogue } from './pages/DrawsCatalogue';
import { RaffleDetail } from './pages/RaffleDetail';
import { Profile } from './pages/Profile';

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
            <Route path="/transparency" element={<div className="p-12 text-center font-bold text-gray-500">Transparency Report Placeholder</div>} />
            <Route path="/my-entries" element={<div className="p-12 text-center font-bold text-gray-500">My Ticket Wallet Placeholder</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;