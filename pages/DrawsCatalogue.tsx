import React, { useEffect, useMemo, useState } from 'react';
import { Raffle, RaffleType, RaffleStatus } from '../types';
import { fetchActiveRaffles, getCachedActiveRaffles } from '../services/api';
import { DrawCard } from '../components/DrawCard';
import { PrizeVault } from '../components/PrizeVault';
import { getConfig } from '../utils/config';
import { Button } from '../components/Button';

type DrawTab = 'ALL' | 'LOTTERY' | 'COMPETITION';

export const DrawsCatalogue: React.FC = () => {
  const [raffles, setRaffles] = useState<Raffle[]>(() => getCachedActiveRaffles());
  const [activeTab, setActiveTab] = useState<DrawTab>('ALL');
  const config = getConfig();

  useEffect(() => {
    fetchActiveRaffles()
      .then(setRaffles)
      .catch((error) => {
        console.error('Failed to load active raffles', error);
      });
  }, []);

  const lotteryRaffles = useMemo(
    () => raffles.filter((r) => r.drawType === RaffleType.LOTTERY_RAFFLE && r.status !== RaffleStatus.UPCOMING),
    [raffles]
  );

  const competitionRaffles = useMemo(
    () => raffles.filter((r) => r.drawType === RaffleType.PRIZE_COMPETITION && r.status !== RaffleStatus.UPCOMING),
    [raffles]
  );

  const allLiveRaffles = useMemo(
    () => raffles.filter((r) => r.status !== RaffleStatus.UPCOMING),
    [raffles]
  );

  const upcomingRaffles = useMemo(
    () => raffles.filter((r) => r.status === RaffleStatus.UPCOMING),
    [raffles]
  );

  const visibleRaffles = activeTab === 'ALL' ? allLiveRaffles : activeTab === 'LOTTERY' ? lotteryRaffles : competitionRaffles;

  return (
    <div className="space-y-14 px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[36px] border border-brand-dark/10 bg-white/92 shadow-[0_30px_100px_rgba(40,26,57,0.1)]">
        <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:py-10">
          <div className="space-y-5">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-brand-green">Catalogue</p>
            <h1 className="text-4xl font-black tracking-tight text-brand-plum sm:text-5xl">Live draws and the full prize queue</h1>
            <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              Lottery draws are entered by chance — buy a ticket and you are in the draw. Prize competitions require a correct answer to a skill question before payment. Both types directly fund Mindful Gaming UK.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={config.charityLinks.donationFormUrl} target="_blank" rel="noreferrer">
                <Button>Donate to the Charity</Button>
              </a>
              <a href={config.charityLinks.donateGamesUrl} target="_blank" rel="noreferrer">
                <Button variant="secondary">Donate Games or Kit</Button>
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[28px] border border-brand-dark/10 bg-brand-mist p-5">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">Lottery draws</p>
              <p className="mt-3 text-4xl font-black text-brand-plum">{lotteryRaffles.length}</p>
            </div>
            <div className="rounded-[28px] border border-brand-dark/10 bg-brand-mist p-5">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">Prize competitions</p>
              <p className="mt-3 text-4xl font-black text-brand-plum">{competitionRaffles.length}</p>
            </div>
            <div className="rounded-[28px] border border-brand-dark/10 bg-brand-plum p-5 text-white">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-brand-yellow">Entry range</p>
              <p className="mt-3 text-lg font-bold">50p to £1 per ticket — all proceeds to the charity.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        {/* Tab bar */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-brand-green">Live Draws</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-brand-plum sm:text-4xl">
              {activeTab === 'ALL' ? 'All Live Draws' : activeTab === 'LOTTERY' ? 'Lottery Draws' : 'Prize Competitions'}
            </h2>
          </div>

          <div className="inline-flex rounded-full border border-brand-dark/10 bg-brand-mist p-1">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                activeTab === 'ALL'
                  ? 'bg-brand-plum text-white shadow'
                  : 'text-slate-600 hover:text-brand-plum'
              }`}
            >
              All ({allLiveRaffles.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('LOTTERY')}
              className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                activeTab === 'LOTTERY'
                  ? 'bg-brand-plum text-white shadow'
                  : 'text-slate-600 hover:text-brand-plum'
              }`}
            >
              Lottery ({lotteryRaffles.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('COMPETITION')}
              className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                activeTab === 'COMPETITION'
                  ? 'bg-brand-green text-white shadow'
                  : 'text-slate-600 hover:text-brand-green'
              }`}
            >
              Competitions ({competitionRaffles.length})
            </button>
          </div>
        </div>

        {/* Tab description */}
        <div className="rounded-[20px] border border-brand-dark/10 bg-brand-mist px-5 py-4 text-sm text-slate-600">
          {activeTab === 'COMPETITION' ? (
            <p>
              <span className="font-bold text-brand-green">Prize competitions</span> — require a correct answer to a skill question before payment proceeds. Competitions are not lottery-regulated. Entry fees support Mindful Gaming UK; entries are not donations and are not Gift Aid eligible.
            </p>
          ) : (
            <p>
              <span className="font-bold text-brand-plum">Lottery draws</span> are registered with Birmingham City Council (Ref: 213653). <span className="font-bold text-brand-green">Prize competitions</span> require a correct answer before entry. All entry fees support Mindful Gaming UK.
            </p>
          )}
        </div>

        {/* Draw grid */}
        {visibleRaffles.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-brand-dark/10 bg-white/90 px-6 py-16 text-center">
            <p className="text-lg font-bold text-brand-plum">
              {activeTab === 'ALL'
                ? 'No live draws right now.'
                : activeTab === 'LOTTERY'
                ? 'No lottery draws are live right now.'
                : 'No prize competitions are live right now.'}
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Check the Prize Vault below to see what is coming next, or support the charity directly through the donation form.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {visibleRaffles.map((raffle) => (
              <DrawCard key={raffle._id} raffle={raffle} />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming draws — vote section */}
      {upcomingRaffles.length > 0 && (
        <section className="space-y-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-slate-500">Coming Next</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-brand-plum sm:text-4xl">What should we draw next?</h2>
            <p className="mt-3 text-sm text-slate-600 max-w-2xl leading-7">
              These prizes are in our planning queue. Vote to tell us which ones to prioritise — the most-wanted draws go live first.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {upcomingRaffles.map((raffle) => (
              <DrawCard key={raffle._id} raffle={raffle} />
            ))}
          </div>
        </section>
      )}

      <div className="rounded-[36px] border border-brand-dark/10 bg-white/80 px-5 py-8 shadow-[0_20px_80px_rgba(40,26,57,0.08)] sm:px-8" id="local-vault">
        <PrizeVault description="Every card below is part of the upcoming prize queue. Prizes go live in either the Lottery Draws or Prize Competitions tab once they are ready." />
      </div>
    </div>
  );
};
