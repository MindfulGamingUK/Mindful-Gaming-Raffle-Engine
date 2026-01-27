import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { DrawsCatalogue } from './pages/DrawsCatalogue';
import { RaffleDetail } from './pages/RaffleDetail';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/draws" element={<DrawsCatalogue />} />
          <Route path="/draw/:slug" element={<RaffleDetail />} />
          
          {/* Placeholders for secondary pages in prototype */}
          <Route path="/transparency" element={<div className="p-12 text-center font-bold text-gray-500">Transparency Report Placeholder</div>} />
          <Route path="/my-entries" element={<div className="p-12 text-center font-bold text-gray-500">My Ticket Wallet Placeholder</div>} />
          <Route path="/profile" element={<div className="p-12 text-center font-bold text-gray-500">Profile Settings Placeholder</div>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
