import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { RaffleType } from '../types';
import { fetchWinners, PublicWinner } from '../services/api';

type WinnerTab = 'ALL' | 'LOTTERY' | 'COMPETITION';

const DRAW_TYPE_LABEL: Record<string, string> = {
  LOTTERY_RAFFLE: 'Lottery Draw',
  PRIZE_COMPETITION: 'Prize Competition',
};

const DRAW_TYPE_BADGE: Record<string, string> = {
  LOTTERY_RAFFLE: 'bg-brand-plum text-white',
  PRIZE_COMPETITION: 'bg-brand-green text-white',
};

const STATUS_LABEL: Record<PublicWinner['status'], string> = {
  PRIZE_DISPATCHED: 'Prize Dispatched',
  CLAIMED: 'Claimed',
  PENDING: 'Pending',
};

const STATUS_STYLE: Record<PublicWinner['status'], string> = {
  PRIZE_DISPATCHED: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  CLAIMED: 'bg-blue-50 text-blue-700 border border-blue-200',
  PENDING: 'bg-amber-50 text-amber-700 border border-amber-200',
};

export const Winners: React.FC = () => {
  const [winners, setWinners] = useState<PublicWinner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<WinnerTab>('ALL');

  useEffect(() => {
    fetchWinners()
      .then(setWinners)
      .finally(() => setLoading(false));
  }, []);

  const lotteryWinners = useMemo(
    () => winners.filter((w) => w.drawType === RaffleType.LOTTERY_RAFFLE),
    [winners]
  );

  const competitionWinners = useMemo(
    () => winners.filter((w) => w.drawType === RaffleType.PRIZE_COMPETITION),
    [winners]
  );

  const visible =
    activeTab === 'ALL'
      ? winners
      : activeTab === 'LOTTERY'
      ? lotteryWinners
      : competitionWinners;

  const showLotteryTab = lotteryWinners.length > 0;
  const showCompetitionTab = competitionWinners.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fadeIn space-y-10">

      {/* Page header */}
      <div className="space-y-3">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-brand-green">Results</p>
        <h1 className="text-3xl font-black tracking-tight text-brand-plum sm:text-4xl">
          Published Draw Results
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          All draw results are published here once the winner has been contacted and has consented to their name
          appearing publicly. Draws are conducted using a cryptographic random number generator and the full audit
          log is available on request.
        </p>
      </div>

      {/* Tab bar — only show category tabs when there are winners in each */}
      {winners.length > 0 && (showLotteryTab || showCompetitionTab) && (
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
            All ({winners.length})
          </button>
          {showLotteryTab && (
            <button
              type="button"
              onClick={() => setActiveTab('LOTTERY')}
              className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                activeTab === 'LOTTERY'
                  ? 'bg-brand-plum text-white shadow'
                  : 'text-slate-600 hover:text-brand-plum'
              }`}
            >
              Lottery ({lotteryWinners.length})
            </button>
          )}
          {showCompetitionTab && (
            <button
              type="button"
              onClick={() => setActiveTab('COMPETITION')}
              className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                activeTab === 'COMPETITION'
                  ? 'bg-brand-green text-white shadow'
                  : 'text-slate-600 hover:text-brand-green'
              }`}
            >
              Competitions ({competitionWinners.length})
            </button>
          )}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-[20px] border border-brand-dark/10 bg-white/70 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && winners.length === 0 && (
        <div className="rounded-[28px] border border-dashed border-brand-dark/10 bg-white/80 px-6 py-20 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-mist text-brand-plum">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
            </svg>
          </div>
          <h2 className="text-lg font-black text-brand-plum">No results published yet</h2>
          <p className="mt-3 max-w-md mx-auto text-sm leading-6 text-slate-600">
            Draws take place on their published draw dates. Results are posted here once the winner has
            been contacted. Our live draws close on 28 March 2026 with the draw taking place on 31 March 2026.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex rounded-full bg-brand-plum px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-plum/90"
            >
              View Live Draws
            </Link>
          </div>
        </div>
      )}

      {/* Winners list */}
      {!loading && visible.length > 0 && (
        <div className="space-y-3">
          {visible.map((w) => (
            <div
              key={w._id}
              className="overflow-hidden rounded-[20px] border border-brand-dark/10 bg-white/90 shadow-[0_4px_20px_rgba(40,26,57,0.06)]"
            >
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                {/* Draw type badge */}
                <div className="shrink-0">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] ${
                      DRAW_TYPE_BADGE[w.drawType] ?? 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {DRAW_TYPE_LABEL[w.drawType] ?? w.drawType}
                  </span>
                </div>

                {/* Draw info */}
                <div className="flex-grow">
                  <p className="font-bold text-brand-plum leading-snug">{w.raffleTitle}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Draw date:{' '}
                    {new Date(w.drawDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                {/* Winning ticket */}
                <div className="shrink-0 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                    Winning Ticket
                  </p>
                  <p className="mt-0.5 font-mono font-bold text-brand-plum">{w.winningTicketDisplay}</p>
                </div>

                {/* Winner label */}
                <div className="shrink-0 min-w-[120px] text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Winner</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-700">
                    {w.winnerPublicLabel ?? (
                      <span className="italic text-slate-400">Withheld</span>
                    )}
                  </p>
                </div>

                {/* Dispatch status */}
                <div className="shrink-0">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[w.status]}`}
                  >
                    {STATUS_LABEL[w.status]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verification CTA */}
      <div className="rounded-[28px] border border-brand-dark/10 bg-brand-mist/70 px-6 py-8 text-center space-y-3">
        <h3 className="font-bold text-brand-plum">Need to verify a result?</h3>
        <p className="max-w-md mx-auto text-sm text-slate-600 leading-6">
          The full winner record and audit log for any completed draw is available on request. Contact us
          with the draw name and your query.
        </p>
        <a
          href="mailto:info@mindfulgaminguk.org?subject=Winner%20verification%20request"
          className="inline-flex rounded-full border border-brand-plum px-5 py-2 text-sm font-bold text-brand-plum transition hover:bg-brand-plum hover:text-white"
        >
          Request Verification
        </a>
      </div>

      {/* Compliance footer */}
      <p className="text-center text-xs text-slate-400 leading-5">
        Draws conducted under UK Gambling Act 2005. Registered with Birmingham City Council, Reg.&nbsp;213653.
        LAA5 returns filed within 3 months of each draw date.
      </p>
    </div>
  );
};
