import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Raffle, RaffleType } from '../types';
import { fetchActiveRaffles } from '../services/api';
import { Button } from '../components/Button';

export const Landing: React.FC = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveRaffles().then(data => {
      setRaffles(data);
      setLoading(false);
    });
  }, []);

  const featured = raffles.find(r => r.type === RaffleType.FLAGSHIP) || raffles[0];
  const micros = raffles.filter(r => r._id !== featured?._id).slice(0, 3);

  return (
    <div>
      {/* HERO */}
      <section className="bg-brand-dark text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-purple opacity-10 pattern-dots"></div>
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center md:text-left md:flex items-center justify-between gap-12">
          <div className="max-w-xl">
            <span className="inline-block bg-brand-teal text-brand-dark text-xs font-bold px-3 py-1 rounded-full mb-4">
              Charity No. 1212285
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Win Epic Prizes.<br/>
              <span className="text-brand-teal">Support Healthier Gaming.</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Enter our Small Society Lotteries to win gaming tech. 
              Net proceeds directly fund mental health support and awareness campaigns for gamers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
               <Link to="/draws">
                 <Button className="w-full sm:w-auto text-lg px-8 py-3">View Active Draws</Button>
               </Link>
               <Link to="/transparency">
                 <Button variant="secondary" className="w-full sm:w-auto bg-transparent text-white border-gray-600 hover:bg-gray-800">
                   How it works
                 </Button>
               </Link>
            </div>
          </div>
          
          {/* Featured Card */}
          {featured && (
            <div className="hidden md:block w-80 bg-white rounded-xl shadow-2xl overflow-hidden text-gray-900 transform rotate-2 hover:rotate-0 transition-transform duration-300">
               <div className="h-40 bg-gray-200 relative">
                 <img src={featured.imageUrl} className="w-full h-full object-cover" alt={featured.title} />
                 <div className="absolute top-2 right-2 bg-brand-purple text-white text-xs font-bold px-2 py-1 rounded">
                   Main Event
                 </div>
               </div>
               <div className="p-5">
                 <h3 className="font-bold text-lg mb-2 leading-tight">{featured.title}</h3>
                 <div className="flex justify-between text-sm text-gray-500 mb-4">
                   <span>£{featured.ticketPrice.toFixed(2)} / ticket</span>
                   <span>{featured.maxTickets - featured.soldTickets} left</span>
                 </div>
                 <Link to={`/draw/${featured.slug}`}>
                   <Button className="w-full">Enter Now</Button>
                 </Link>
               </div>
            </div>
          )}
        </div>
      </section>

      {/* MICRO DRAWS */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
           <div>
             <h2 className="text-2xl font-bold text-brand-dark">Micro-Draws</h2>
             <p className="text-gray-500 text-sm">Limited entry pools. Better odds. Quick draws.</p>
           </div>
           <Link to="/draws" className="text-brand-purple font-bold text-sm hover:underline">View All</Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>)
          ) : (
            micros.map(raffle => (
              <Link key={raffle._id} to={`/draw/${raffle.slug}`} className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 relative overflow-hidden">
                  <img src={raffle.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={raffle.title} />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <span className="text-white text-xs font-bold bg-brand-teal px-2 py-1 rounded-sm">
                      {raffle.maxTickets} Tickets Max
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 truncate">{raffle.title}</h3>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                    <div 
                      className="bg-brand-purple h-1.5 rounded-full" 
                      style={{ width: `${(raffle.soldTickets / raffle.maxTickets) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-brand-dark">£{raffle.ticketPrice.toFixed(2)}</span>
                    <span className="text-xs text-gray-500">
                      {raffle.status === 'SOLD_OUT' ? 'Sold Out' : 'Enter >'}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* MINDFUL SECTION */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-brand-dark mb-4">Gaming is better with balance.</h2>
          <p className="text-gray-600 mb-8">
            We aren't just here for prizes. We want to help you maintain a healthy relationship with play.
            Take a moment to check in with yourself.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
               <h4 className="font-bold text-brand-purple mb-2">Self-Check Tool</h4>
               <p className="text-sm text-gray-500 mb-4">How balanced was your gaming week?</p>
               <Button variant="secondary" className="w-full">Start Check-in</Button>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
               <h4 className="font-bold text-brand-purple mb-2">Resources</h4>
               <p className="text-sm text-gray-500 mb-4">Tips for breaks, sleep, and focus.</p>
               <Button variant="secondary" className="w-full">Read Articles</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
