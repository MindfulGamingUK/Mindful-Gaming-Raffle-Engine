import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Raffle, RaffleType } from '../types';
import { fetchActiveRaffles } from '../services/api';
import { getAsset } from '../utils/assets';
import { getTheme } from '../utils/theme';
import { calculateProgress, formatCurrency } from '../utils/formatting';

export const DrawsCatalogue: React.FC = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [filter, setFilter] = useState<'ALL' | RaffleType>('ALL');

  useEffect(() => {
    fetchActiveRaffles().then(setRaffles);
  }, []);

  const filteredRaffles = filter === 'ALL'
    ? raffles
    : raffles.filter(r => r.drawType === filter);

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
            onClick={() => setFilter(RaffleType.LOTTERY_RAFFLE)}
            className={`px-4 py-2 rounded-md transition-all ${filter === RaffleType.LOTTERY_RAFFLE ? 'bg-white shadow text-brand-purple' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Lottery Raffles
          </button>
          <button
            onClick={() => setFilter(RaffleType.PRIZE_COMPETITION)}
            className={`px-4 py-2 rounded-md transition-all ${filter === RaffleType.PRIZE_COMPETITION ? 'bg-white shadow text-brand-purple' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Prize Competitions
          </button>
        </div>
      </div>

      {filteredRaffles.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">No active draws found for this category.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRaffles.map(raffle => {
            const theme = getTheme(raffle.theme);

            return (
              <Link key={raffle._id} to={`/draw/${raffle.slug}`} className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full group">
                <div className="h-56 relative overflow-hidden">
                  <img src={raffle.heroImageUrl || getAsset(raffle.assetKey)} alt={raffle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className={`absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-sm font-bold shadow-sm ${theme.primary}`}>
                    {formatCurrency(raffle.ticketPrice)}
                  </div>
                  <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-extrabold shadow-sm uppercase tracking-widest ${raffle.drawType === RaffleType.PRIZE_COMPETITION ? 'bg-brand-teal text-white' : 'bg-brand-purple text-white'}`}>
                    {raffle.drawType === RaffleType.PRIZE_COMPETITION ? 'Competition' : 'Lottery'}
                  </div>
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
                      <div className={`h-2 rounded-full transition-all duration-1000 ease-out ${theme.progressFill}`} style={{ width: `${calculateProgress(raffle.soldTickets, raffle.maxTickets)}%` }}></div>
                    </div>
                    <div className={`text-center font-bold text-white py-3 rounded-xl transition-colors ${theme.button}`}>
                      Enter Draw
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
