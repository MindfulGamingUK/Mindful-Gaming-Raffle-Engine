import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AwarenessContent, Raffle, RaffleStatus, RaffleType } from '../types';
import { fetchActiveRaffles, fetchAwarenessFeed, getCachedActiveRaffles, logAwarenessEvent } from '../services/api';
import { Button } from '../components/Button';
import { DrawCard } from '../components/DrawCard';
import { PrizeVault } from '../components/PrizeVault';
import { SurveyForm } from '../components/SurveyForm';
import { getConfig } from '../utils/config';

export const Landing: React.FC = () => {
  const cachedRaffles = getCachedActiveRaffles();
  const [raffles, setRaffles] = useState<Raffle[]>(cachedRaffles);
  const [awareness, setAwareness] = useState<AwarenessContent[]>([]);
  const [loading, setLoading] = useState(cachedRaffles.length === 0);
  const config = getConfig();

  useEffect(() => {
    Promise.all([
      fetchActiveRaffles(),
      fetchAwarenessFeed(3, 0)
    ])
      .then(([raffleData, awarenessData]) => {
        setRaffles(raffleData);
        setAwareness(awarenessData.items);
      })
      .catch((error) => {
        console.error('Failed to load landing data', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const activeRaffles = useMemo(
    () => raffles.filter((raffle) => raffle.status === RaffleStatus.ACTIVE),
    [raffles]
  );

  const [activeTab, setActiveTab] = useState<'LOTTERY' | 'COMPETITION'>('LOTTERY');

  const lotteries = activeRaffles.filter((raffle) => raffle.drawType === RaffleType.LOTTERY_RAFFLE);
  const competitions = activeRaffles.filter((raffle) => raffle.drawType === RaffleType.PRIZE_COMPETITION);
  const visibleRaffles = activeTab === 'LOTTERY' ? lotteries : competitions;

  return (
    <div className="space-y-14 px-4 py-8 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[36px] border border-brand-orange/30 bg-brand-plum text-white shadow-[0_30px_100px_rgba(40,26,57,0.24)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,100,22,0.35),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(63,118,82,0.35),_transparent_32%)]" />
        <div className="absolute -right-16 top-8 hidden h-48 w-48 rounded-full bg-brand-yellow/15 blur-3xl lg:block" />
        <div className="relative grid gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-14">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-brand-yellow">
              Mindful Gaming UK
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Prize draws for gamers.
                <span className="block text-brand-yellow">Direct giving for the charity.</span>
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
                Explore live draws, support the charity directly, and keep sight of the next wave of prizes as new campaigns are prepared.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">Live draws</p>
                <p className="mt-2 text-3xl font-black text-brand-yellow">{activeRaffles.length}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">Lottery raffles</p>
                <p className="mt-2 text-3xl font-black text-brand-yellow">{lotteries.length}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">Prize competitions</p>
                <p className="mt-2 text-3xl font-black text-brand-yellow">{competitions.length}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/draws">
                <Button size="lg">Browse Prize Vault</Button>
              </Link>
              <a href={config.charityLinks.donationFormUrl} target="_blank" rel="noreferrer">
                <Button
                  size="lg"
                  className="bg-brand-yellow text-brand-dark hover:bg-[#efe72c] focus:ring-brand-yellow"
                >
                  Donate Instead
                </Button>
              </a>
            </div>

            <p className="text-sm text-white/60">
              Entries help the charity, but they are not donations and are not Gift Aid eligible. If someone only wants to give, route them straight to the live donation form.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-green">Live donation routes</p>
              <h2 className="mt-3 text-2xl font-black text-white">Support the charity without entering a draw.</h2>
              <div className="mt-5 space-y-3 text-sm text-white/75">
                <a href={config.charityLinks.donationFormUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 transition hover:bg-white/15">
                  <span>Open the live donation form</span>
                  <span aria-hidden="true">&rarr;</span>
                </a>
                <a href={config.charityLinks.donateUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 transition hover:bg-white/15">
                  <span>Use the donation page</span>
                  <span aria-hidden="true">&rarr;</span>
                </a>
                <a href={config.charityLinks.donateGamesUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 transition hover:bg-white/15">
                  <span>Donate unwanted games or hardware</span>
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>

            <div className="rounded-[28px] border border-brand-yellow/30 bg-brand-yellow/10 p-6">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-yellow">How it works</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm font-bold text-white">1. Choose a draw</p>
                  <p className="text-xs leading-5 text-white/70 mt-1">Browse lottery draws and prize competitions — all prizes are real, dispatched to UK winners.</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">2. Enter from 50p to £1</p>
                  <p className="text-xs leading-5 text-white/70 mt-1">Every ticket directly funds Mindful Gaming UK's awareness and support work.</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">3. Win or give</p>
                  <p className="text-xs leading-5 text-white/70 mt-1">Prizes go to winners, proceeds go to the charity. Results are published and independently verified.</p>
                </div>
              </div>
              <a href={config.charityLinks.aboutUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex text-xs font-bold text-brand-yellow hover:text-white">
                About the charity &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        {/* Header + tab toggle */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-brand-green">Live Draws</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-brand-plum sm:text-4xl">
              {activeTab === 'LOTTERY' ? 'Lottery Draws' : 'Prize Competitions'}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="inline-flex rounded-full border border-brand-dark/10 bg-brand-mist p-1">
              <button
                type="button"
                onClick={() => setActiveTab('LOTTERY')}
                className={`rounded-full px-5 py-2 text-sm font-bold transition ${activeTab === 'LOTTERY' ? 'bg-brand-plum text-white shadow' : 'text-slate-600 hover:text-brand-plum'}`}
              >
                Lottery Draws
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('COMPETITION')}
                className={`rounded-full px-5 py-2 text-sm font-bold transition ${activeTab === 'COMPETITION' ? 'bg-brand-green text-white shadow' : 'text-slate-600 hover:text-brand-green'}`}
              >
                Prize Competitions
              </button>
            </div>
            <Link to="/draws" className="text-sm font-bold text-brand-plum underline-offset-4 hover:underline">
              Full catalogue &rarr;
            </Link>
          </div>
        </div>

        {/* Tab description */}
        <div className="rounded-[20px] border border-brand-dark/10 bg-brand-mist px-5 py-4 text-sm leading-6 text-slate-600">
          {activeTab === 'LOTTERY' ? (
            <p>
              <span className="font-bold text-brand-plum">Lottery draws</span> — buy one or more tickets and a verified random draw selects the winner after the close date. No skill required. A short optional wellbeing moment is included before checkout — you can skip it at any time. Registered with Birmingham City Council (Ref: 213653). Entries are not donations and are not Gift Aid eligible.
            </p>
          ) : (
            <p>
              <span className="font-bold text-brand-green">Prize competitions</span> — these are the highest-value prizes: pre-built high-end gaming PCs. A technology knowledge question must be answered correctly before payment proceeds. Questions are specific to the prize and require genuine knowledge of PC hardware — not trivially searchable. Competitions are not lottery-regulated. Entries are not donations and are not Gift Aid eligible.
            </p>
          )}
        </div>

        {/* Draw grid */}
        {loading ? (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[420px] animate-pulse rounded-[28px] bg-white/70" />
            ))}
          </div>
        ) : visibleRaffles.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {visibleRaffles.map((raffle) => (
              <DrawCard key={raffle._id} raffle={raffle} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-brand-dark/10 bg-white/90 px-6 py-14 text-center">
            <p className="text-lg font-bold text-brand-plum">
              {activeTab === 'LOTTERY'
                ? 'No lottery draws are live right now.'
                : 'No prize competitions are live right now.'}
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Check the Prize Vault below to see what is coming next, or support the charity directly.
            </p>
          </div>
        )}
      </section>

      <div id="prize-vault" className="rounded-[36px] border border-brand-dark/10 bg-white/80 px-5 py-8 shadow-[0_20px_80px_rgba(40,26,57,0.08)] sm:px-8">
        <PrizeVault limit={6} showFilters={false} description="The Prize Vault keeps upcoming prizes visible while they are still being lined up for release. Each card keeps the entry fee between fifty pence and one pound and gives supporters a direct donate route as an alternative." />
      </div>

      <section className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] border border-brand-dark/10 bg-white/92 p-6 shadow-[0_24px_70px_rgba(40,26,57,0.08)] sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-brand-green">Shape The Queue</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-brand-plum">Tell us what should go live next</h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Tell us which prizes you want to see go live and we will prioritise the most popular requests in each new wave of draws.
          </p>
          <div className="mt-8">
            <SurveyForm />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-brand-dark/10 bg-white/92 p-6 shadow-[0_24px_70px_rgba(40,26,57,0.08)] sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-brand-green">Direct Support Paths</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-brand-plum">Choose the right route for each supporter</h2>
            <div className="mt-6 space-y-4">
              <a href={config.charityLinks.donationFormUrl} target="_blank" rel="noreferrer" className="block rounded-[24px] border border-brand-dark/10 bg-brand-mist p-5 transition hover:border-brand-green">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-brand-green">Donate now</p>
                <p className="mt-2 text-lg font-bold text-brand-plum">Donate directly to Mindful Gaming UK</p>
                <p className="mt-2 text-sm text-slate-600">Best option for people who want to support the work directly without entering a draw.</p>
              </a>
              <a href={config.charityLinks.easyFundraisingUrl} target="_blank" rel="noreferrer" className="block rounded-[24px] border border-brand-dark/10 bg-white p-5 transition hover:border-brand-green">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-brand-green">Easyfundraising</p>
                <p className="mt-2 text-lg font-bold text-brand-plum">Support spending without extra cash outlay</p>
                <p className="mt-2 text-sm text-slate-600">Useful for community audiences who want to help but are not ready for a raffle or a direct donation.</p>
              </a>
              <a href={config.charityLinks.donateGamesUrl} target="_blank" rel="noreferrer" className="block rounded-[24px] border border-brand-dark/10 bg-white p-5 transition hover:border-brand-green">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-brand-green">Donate games and kit</p>
                <p className="mt-2 text-lg font-bold text-brand-plum">Turn old hardware into future support</p>
                <p className="mt-2 text-sm text-slate-600">Fits the charity's wider message around mindful use, recycling, and practical support for future centres.</p>
              </a>
            </div>
          </div>

          <div className="rounded-[32px] border border-brand-dark/10 bg-brand-plum p-6 text-white shadow-[0_24px_70px_rgba(40,26,57,0.16)] sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.32em] text-brand-yellow">Wellbeing Feed</p>
                <h2 className="mt-3 text-2xl font-black">Gaming wellbeing reminders</h2>
              </div>
              <Link to="/support" className="text-sm font-bold text-brand-yellow hover:text-white">
                Support resources
              </Link>
            </div>
            <div className="mt-6 grid gap-4">
              {awareness.map((item) => (
                <a
                  key={item._id}
                  href={item.resourceUrl || config.charityLinks.resourcesUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => logAwarenessEvent(item._id, 'CLICK_FEED_CARD')}
                  className="rounded-[24px] border border-white/10 bg-white/10 p-5 transition hover:bg-white/15"
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-brand-green">{item.type}</p>
                  <h3 className="mt-3 text-xl font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">{item.body}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
