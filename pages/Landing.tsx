import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Raffle, RaffleType, RaffleStatus } from '../types';
import { fetchActiveRaffles } from '../services/api';
import { getAsset } from '../utils/assets';
import { getConfig } from '../utils/config';
import { calculateProgress, formatCurrency } from '../utils/formatting';
import { Button } from '../components/Button';
import { WellnessRotator } from '../components/WellnessRotator';

export const Landing: React.FC = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const config = getConfig();

  useEffect(() => {
    fetchActiveRaffles().then(data => {
      setRaffles(data);
      setLoading(false);
    });
  }, []);

  const activeRaffles = raffles.filter(r => r.status === RaffleStatus.ACTIVE);
  const featured = activeRaffles.find(r => r.type === RaffleType.FLAGSHIP) || activeRaffles[0];
  const micros = activeRaffles.filter(r => r._id !== featured?._id).slice(0, 3);

  return (
    <div className="space-y-16">
      {/* HERO SECTION */}
      <section className="bg-brand-dark rounded-3xl overflow-hidden relative shadow-2xl mx-4 md:mx-0">
        <div className="absolute inset-0">
          {/* Fixed asset key casing */}
          <img src={getAsset('HERO_BG')} className="w-full h-full object-cover opacity-20 mix-blend-overlay" alt="Background" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/90 to-transparent"></div>
        </div>
        
        <div className="relative z-10 px-8 py-16 md:py-24 md:px-12 flex flex-col md:flex-row items-center gap-12">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-bold px-3 py-1 rounded-full mb-6 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Regulated Charity Lottery
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Win Tech. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-green-400">Support Wellness.</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Genuine raffle draws for the latest gaming gear. Net proceeds directly fund Gaming Disorder awareness and support services across the UK.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
               <Link to="/draws">
                 <Button className="w-full sm:w-auto text-lg px-8 py-4 shadow-lg shadow-brand-purple/30">View Active Draws</Button>
               </Link>
               <Link to="/transparency">
                 <Button variant="secondary" className="w-full sm:w-auto bg-white/5 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
                   Where funds go
                 </Button>
               </Link>
            </div>
          </div>

          {/* Featured Card */}
          {featured && (
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden transform md:rotate-3 hover:rotate-0 transition-transform duration-500 border-4 border-white/10">
               <div className="h-48 relative">
                 <img src={getAsset(featured.assetKey)} className="w-full h-full object-cover" alt={featured.title} />
                 <div className="absolute top-4 right-4 bg-brand-purple text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                   Featured
                 </div>
               </div>
               <div className="p-6">
                 <h3 className="font-bold text-xl text-gray-900 mb-2 leading-tight">{featured.title}</h3>
                 <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                   <span>{formatCurrency(featured.ticketPrice)} per ticket</span>
                   <span className="text-brand-purple font-medium">{featured.maxTickets - featured.soldTickets} remaining</span>
                 </div>
                 <Link to={`/draw/${featured.slug}`}>
                   <Button className="w-full py-3">Enter Draw</Button>
                 </Link>
               </div>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-4xl mx-auto px-4 text-center">
         <h2 className="text-2xl font-bold text-gray-900 mb-8">How it Works</h2>
         <div className="grid md:grid-cols-3 gap-8">
            <div className="p-4">
               <div className="w-12 h-12 bg-purple-100 text-brand-purple rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
               <h3 className="font-bold mb-2">Select a Draw</h3>
               <p className="text-sm text-gray-600">Choose from our Monthly Main Events or smaller Micro Draws.</p>
            </div>
            <div className="p-4">
               <div className="w-12 h-12 bg-purple-100 text-brand-purple rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
               <h3 className="font-bold mb-2">Enter Securely</h3>
               <p className="text-sm text-gray-600">Verify your age & residency. Purchase tickets securely via Stripe or PayPal.</p>
            </div>
            <div className="p-4">
               <div className="w-12 h-12 bg-purple-100 text-brand-purple rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
               <h3 className="font-bold mb-2">Support & Win</h3>
               <p className="text-sm text-gray-600">Net proceeds support charity. Winners selected by random draw.</p>
            </div>
         </div>
      </section>

      {/* WELLNESS / ADS REPLACEMENT */}
      <section className="max-w-4xl mx-auto px-4">
         <WellnessRotator />
      </section>

      {/* CATALOGUE TEASER */}
      <section className="px-4">
        <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
           <div>
             <h2 className="text-2xl font-bold text-gray-900">Latest Draws</h2>
             <p className="text-gray-500 text-sm mt-1">Limited tickets. Fixed odds. No extensions.</p>
           </div>
           <Link to="/draws" className="text-brand-purple font-bold text-sm hover:underline flex items-center gap-1">
             View All <span aria-hidden="true">&rarr;</span>
           </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-72 bg-gray-100 rounded-xl animate-pulse"></div>)
          ) : (
            micros.map(raffle => (
              <Link key={raffle._id} to={`/draw/${raffle.slug}`} className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="h-48 relative overflow-hidden bg-gray-100">
                  <img src={getAsset(raffle.assetKey)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={raffle.title} />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <span className="text-white text-xs font-bold bg-brand-teal px-2 py-1 rounded">
                      {raffle.maxTickets} Tickets Max
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-3 truncate" title={raffle.title}>{raffle.title}</h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-grow bg-gray-100 rounded-full h-1.5">
                        <div 
                        className="bg-brand-purple h-1.5 rounded-full" 
                        style={{ width: `${calculateProgress(raffle.soldTickets, raffle.maxTickets)}%` }}
                        ></div>
                    </div>
                    <span className="text-xs font-bold text-gray-400">{Math.round(calculateProgress(raffle.soldTickets, raffle.maxTickets))}%</span>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                    <span className="font-bold text-xl text-brand-dark">{formatCurrency(raffle.ticketPrice)}</span>
                    <span className="text-sm font-medium text-brand-purple group-hover:underline">Enter Draw</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* TRUST & INFO */}
      <section className="bg-gray-50 rounded-3xl p-8 md:p-12 mx-4 md:mx-0">
        <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-2xl">⚖️</div>
                <h3 className="font-bold text-gray-900 mb-2">Regulated</h3>
                <p className="text-sm text-gray-500">
                  Registered with {config.localAuthorityName} (Ref: {config.lotteryRegistrationRef}). Fully compliant with the Gambling Act 2005.
                </p>
            </div>
            <div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-2xl">🤝</div>
                <h3 className="font-bold text-gray-900 mb-2">Transparency</h3>
                <p className="text-sm text-gray-500">We publish expenses and net proceeds for every draw. No hidden fees.</p>
            </div>
            <div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-2xl">🛡️</div>
                <h3 className="font-bold text-gray-900 mb-2">Safer Gaming</h3>
                <p className="text-sm text-gray-500">Tools to manage your spend. We prioritize your wellbeing over ticket sales.</p>
            </div>
        </div>
      </section>
    </div>
  );
};