import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Raffle } from '../types';
import { fetchActiveRaffles } from '../services/api';

export const DrawsCatalogue: React.FC = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);

  useEffect(() => {
    fetchActiveRaffles().then(setRaffles);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-dark mb-8">Active Draws</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {raffles.map(raffle => (
          <Link key={raffle._id} to={`/draw/${raffle.slug}`} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
            <div className="h-48 relative">
              <img src={raffle.imageUrl} alt={raffle.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-brand-purple">
                £{raffle.ticketPrice.toFixed(2)}
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
               <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{raffle.title}</h3>
               <p className="text-sm text-gray-500 mb-4 line-clamp-2">{raffle.description}</p>
               
               <div className="mt-auto">
                 <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
                   <span>Progress</span>
                   <span>{Math.round((raffle.soldTickets/raffle.maxTickets)*100)}%</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                    <div className="bg-brand-teal h-1.5 rounded-full" style={{ width: `${(raffle.soldTickets/raffle.maxTickets)*100}%` }}></div>
                 </div>
                 <div className="text-center font-bold text-brand-purple bg-brand-purple/5 py-2 rounded-lg">
                   Enter Draw
                 </div>
               </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
