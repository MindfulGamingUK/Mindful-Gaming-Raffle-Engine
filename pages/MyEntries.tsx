import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchMyEntries } from '../services/api';
import { Entry } from '../types';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

export const MyEntries: React.FC = () => {
  const { user, login } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyEntries().then(data => {
        setEntries(data);
        setLoading(false);
      });
    } else {
        setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="text-gray-500 mb-6">You need to be logged in to view your ticket wallet.</p>
        <Button onClick={login}>Member Login</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Ticket Wallet</h1>
          <Link to="/draws" className="text-brand-purple font-medium hover:underline text-sm">Browse Draws</Link>
      </div>

      {loading ? (
          <div className="space-y-4 animate-pulse">
              <div className="h-24 bg-gray-100 rounded-lg"></div>
              <div className="h-24 bg-gray-100 rounded-lg"></div>
          </div>
      ) : entries.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <span className="text-4xl block mb-4">🎟️</span>
              <h3 className="font-bold text-gray-900 mb-2">No tickets yet</h3>
              <p className="text-gray-500 mb-6">You haven't entered any draws yet. Good luck!</p>
              <Link to="/draws"><Button>Find a Prize</Button></Link>
          </div>
      ) : (
          <div className="space-y-6">
              {entries.map(entry => (
                  <div key={entry._id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                      <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                              <div>
                                  <h3 className="font-bold text-lg text-gray-900">{entry.raffleTitle}</h3>
                                  <p className="text-xs text-gray-500">Purchased: {new Date(entry.purchaseDate).toLocaleDateString()}</p>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs font-bold ${entry.status === 'WINNER' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                  {entry.status}
                              </span>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Ticket Numbers ({entry.ticketNumbers.length})</p>
                              <div className="flex flex-wrap gap-2">
                                  {entry.ticketNumbers.map(num => (
                                      <span key={num} className="font-mono text-brand-purple bg-white border border-brand-purple/20 px-2 py-1 rounded text-sm shadow-sm">
                                          #{num}
                                      </span>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};
