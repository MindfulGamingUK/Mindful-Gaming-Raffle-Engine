import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Raffle, RaffleType } from '../types';
import { fetchActiveRaffles } from '../services/api';
import { getAsset } from '../utils/assets';
import { calculateProgress, formatCurrency } from '../utils/formatting';

export const DrawsCatalogue: React.FC = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [filter, setFilter] = useState<'ALL' | RaffleType>('ALL');

  useEffect(() => {
    fetchActiveRaffles().then(setRaffles);
  }, []);

  const filteredRaffles = filter === 'ALL' 
    ? raffles 
    : raffles.filter(r => r.type === filter);

  return (
    <div className="px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-brand-dark">Active Draws</h1>
            <p className="text-gray-500 mt-1">Support mental health initiatives by entering our compliant raffles.</p>
        </div>
        
        {/* Filter Tabs */}
        <div className="bg-gray-100 p-1 rounded-lg flex text-sm font-medium">
            <button 
                onClick={() => setFilter('ALL')}
                className={`px-4 py-2 rounded-md transition-all ${filter === 'ALL' ? 'bg-white shadow text-brand-purple' : 'text-gray-500 hover:text-gray-700'}`}
            >
                All
            </button>
            <button 
                onClick={() => setFilter(RaffleType.FLAGSHIP)}
                className={`px-4 py-2 rounded-md transition-all ${filter === RaffleType.FLAGSHIP ? 'bg-white shadow text-brand-purple' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Main Events
            </button>
            <button 
                onClick={() => setFilter(RaffleType.MICRO)}
                className={`px-4 py-2 rounded-md transition-all ${filter === RaffleType.MICRO ? 'bg-white shadow text-brand-purple' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Micro-Draws
            </button>
        </div>
      </div>

      {filteredRaffles.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No active draws found for this category.</p>
          </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRaffles.map(raffle => (
            <Link key={raffle._id} to={`/draw/${raffle.slug}`} className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full group">
                <div className="h-56 relative overflow-hidden">
                <img src={getAsset(raffle.assetKey)} alt={raffle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-sm font-bold text-brand-purple shadow-sm">
                    {formatCurrency(raffle.ticketPrice)}
                </div>
                {raffle.type === RaffleType.FLAGSHIP && (
                    <div className="absolute top-4 left-4 bg-brand-purple text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
                        Main Event
                    </div>
                )}
                </div>
                <div className="p-6 flex-grow flex flex-col">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-purple transition-colors">{raffle.title}</h3>
                <p className="text-sm text-gray-500 mb-6 line-clamp-2">{raffle.description}</p>
                
                <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
                    <span>{raffle.soldTickets} sold</span>
                    <span>{raffle.maxTickets} max</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
                        <div className="bg-brand-teal h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${calculateProgress(raffle.soldTickets, raffle.maxTickets)}%` }}></div>
                    </div>
                    <div className="text-center font-bold text-white bg-brand-purple py-3 rounded-xl hover:bg-purple-800 transition-colors">
                        Enter Draw
                    </div>
                </div>
                </div>
            </Link>
            ))}
        </div>
      )}
    </div>
  );
};