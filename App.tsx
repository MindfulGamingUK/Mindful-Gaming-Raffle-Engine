import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RaffleDetail } from './pages/RaffleDetail';

// Note: In a Wix environment, we use HashRouter because we don't control the full URL path structure easily 
// inside a Custom Element without deep integration with wix-location.

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <HashRouter>
        <Routes>
          {/* For the prototype, we default to the detail view of the active raffle */}
          <Route path="/" element={<RaffleDetail />} />
          <Route path="/success" element={<div className="p-8 text-center text-green-600 font-bold">Payment Successful! Check your email for tickets.</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;
