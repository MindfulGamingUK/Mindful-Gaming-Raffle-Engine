import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Raffle, RaffleType, RaffleStatus, AwarenessContent } from '../types';
import { fetchActiveRaffles, fetchAwarenessFeed, logAwarenessEvent } from '../services/api';
import { getAsset } from '../utils/assets';
import { getConfig } from '../utils/config';
import { calculateProgress, formatCurrency } from '../utils/formatting';
import { Button } from '../components/Button';
import { WellnessRotator } from '../components/WellnessRotator';
import { CardLink } from '../components/ui/CardLink';
import { formatWixMediaUrl } from '../utils/wixMedia';

import { DrawTabs } from '../components/DrawTabs';
import { SurveyForm } from '../components/SurveyForm';

export const Landing: React.FC = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [awareness, setAwareness] = useState<AwarenessContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'SURVEY' | 'LOTTERY' | 'COMPETITION'>('SURVEY');
  const [page, setPage] = useState(0);
  const [hasMoreAwareness, setHasMoreAwareness] = useState(true);
  const config = getConfig();

  useEffect(() => {
    Promise.all([
      fetchActiveRaffles(),
      fetchAwarenessFeed(6, 0)
    ]).then(([raffleData, awarenessData]) => {
      setRaffles(raffleData);
      setAwareness(awarenessData.items);
      setHasMoreAwareness(awarenessData.hasMore);
      setLoading(false);
    });
  }, []);

  const loadMoreAwareness = async () => {
    const nextPage = page + 1;
    const data = await fetchAwarenessFeed(6, nextPage * 6);
    setAwareness([...awareness, ...data.items]);
    setHasMoreAwareness(data.hasMore);
    setPage(nextPage);
    logAwarenessEvent('feed_load_more', 'CLICK_LOAD_MORE');
  };

  const activeRaffles = raffles.filter(r => r.status === RaffleStatus.ACTIVE);
  const lotteries = activeRaffles.filter(r => r.drawType === RaffleType.LOTTERY_RAFFLE);
  const competitions = activeRaffles.filter(r => r.drawType === RaffleType.PRIZE_COMPETITION);

  return (
    <div className="space-y-12">
      {/* HERO SECTION */}
      <section className="bg-brand-dark rounded-3xl overflow-hidden relative shadow-2xl mx-4 md:mx-0">
        <div className="absolute inset-0">
          <img src={getAsset('HERO_BG')} className="w-full h-full object-cover opacity-20 mix-blend-overlay" alt="Background" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/90 to-transparent"></div>
        </div>

        <div className="relative z-10 px-8 py-12 md:py-20 md:px-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Win to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-green-400">Support Wellness.</span>
            </h1>
            <p className="text-lg text-gray-300 mb-0 leading-relaxed max-w-lg">
              Mindful Gaming UK runs regulated draws to fund Gaming Disorder support.
              Choose your preferred way to win and help us make gaming safer for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* TABS & EXPLAINER */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="mb-8 grid md:grid-cols-2 gap-8 items-end">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Pick Your Promotion</h2>
            <p className="text-gray-500 text-sm">Every entry supports our awareness projects. No Gift Aid applicable.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-gray-400 uppercase tracking-widest md:justify-end">
            <div className="flex items-center gap-2"><span className="text-brand-purple">🎰</span> Lottery Raffle (Chance)</div>
            <div className="flex items-center gap-2"><span className="text-brand-teal">🧠</span> Prize Competition (Skill)</div>
          </div>
        </div>

        <DrawTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={{ lottery: lotteries.length, competition: competitions.length }}
        />

        <div className="mt-10 min-h-[400px]">
          {activeTab === 'SURVEY' && (
            <div className="animate-fade-in max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Help Shape Our Future</h3>
                <p className="text-gray-500">We're a new charity. Tell us what gear you want to win and how you want to support us.</p>
              </div>
              <SurveyForm />
            </div>
          )}

          {(activeTab === 'LOTTERY' || activeTab === 'COMPETITION') && (
            <div className="animate-fade-in">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                  [1, 2, 3].map(i => <div key={i} className="h-80 bg-gray-50 rounded-2xl animate-pulse"></div>)
                ) : (
                  (activeTab === 'LOTTERY' ? lotteries : competitions).map(raffle => (
                    <CardLink key={raffle._id} to={`/draw/${raffle.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                      <div className="h-48 relative overflow-hidden bg-gray-100">
                        <img
                          src={formatWixMediaUrl(raffle.heroImageUrl || getAsset(raffle.assetKey))}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          alt={raffle.imageAlt || raffle.title}
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-lg ${raffle.drawType === RaffleType.PRIZE_COMPETITION ? 'bg-brand-teal text-white' : 'bg-brand-purple text-white'}`}>
                            {raffle.drawType === RaffleType.PRIZE_COMPETITION ? 'Prize Competition' : 'Lottery Raffle'}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-brand-purple transition-colors">{raffle.title}</h3>

                        <div className="mt-auto space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-tighter">
                              <span>{raffle.soldTickets} Sold</span>
                              <span>{raffle.maxTickets} Max</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                              <div
                                className={`h-full rounded-full ${raffle.drawType === RaffleType.PRIZE_COMPETITION ? 'bg-brand-teal' : 'bg-brand-purple'}`}
                                style={{ width: `${calculateProgress(raffle.soldTickets, raffle.maxTickets)}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-2xl font-black text-gray-900">{formatCurrency(raffle.ticketPrice)}</span>
                            <Button className={raffle.drawType === RaffleType.PRIZE_COMPETITION ? 'bg-brand-teal hover:bg-brand-teal/90' : ''}>
                              {raffle.drawType === RaffleType.PRIZE_COMPETITION ? 'Solve & Enter' : 'Get Tickets'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardLink>
                  ))
                )}
                {!loading && (activeTab === 'LOTTERY' ? lotteries : competitions).length === 0 && (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                    <p className="text-gray-400 font-medium">No active {activeTab.toLowerCase()}s at the moment. Check back soon!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* AWARENESS SECTION */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-brand-purple">🧠</span> Gaming Wellbeing Tips
            </h2>
            {hasMoreAwareness && (
              <button onClick={loadMoreAwareness} className="text-sm font-bold text-brand-purple hover:underline">View More</button>
            )}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {awareness.slice(0, 3).map(item => (
              <CardLink
                key={item._id}
                to={item.resourceUrl}
                onClick={() => logAwarenessEvent(item._id, 'CLICK_FEED_CARD')}
                className="bg-white rounded-xl p-6 border border-white hover:border-brand-purple/20 shadow-sm hover:shadow-md transition-all h-full flex flex-col"
              >
                <span className="text-[10px] font-black uppercase text-brand-teal mb-4 tracking-widest">{item.type}</span>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-6 flex-grow leading-relaxed">{item.body}</p>
                <div className="pt-4 border-t border-gray-50 text-brand-purple text-sm font-bold flex items-center gap-2">
                  Learn More <span aria-hidden="true">&rarr;</span>
                </div>
              </CardLink>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Why Trust Us?</h2>
          <p className="text-gray-600">
            Mindful Gaming UK is a Registered Charity (#1212285).
            We operate under strict license from {config.localAuthorityName} and the Gambling Act 2005.
          </p>
          <div className="flex gap-8 pt-4">
            <div>
              <div className="text-2xl font-bold text-brand-purple">60%+</div>
              <div className="text-xs text-gray-500 font-bold uppercase">To Charity</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-teal">100%</div>
              <div className="text-xs text-gray-500 font-bold uppercase">UK Regulated</div>
            </div>
          </div>
        </div>
        <div className="bg-brand-dark rounded-2xl p-8 text-white">
          <h3 className="font-bold mb-4">Safer Play</h3>
          <p className="text-sm text-gray-400 mb-6">
            Entries represent a purchase of a chance, not a donation.
            Please play responsibly. 18+ only. GB Residents only.
          </p>
          <Link to="/support">
            <Button variant="secondary" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
              Self-Exclusion Tools
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
