import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Raffle, RaffleType, RaffleStatus } from '../types';
import { Button } from './Button';
import { PricePill } from './PricePill';
import { calculateProgress, formatCurrency } from '../utils/formatting';
import { getAsset } from '../utils/assets';
import { getConfig } from '../utils/config';
import { getTheme } from '../utils/theme';
import { formatWixMediaUrl } from '../utils/wixMedia';
import { logAwarenessEvent } from '../services/api';

// Persist vote state in localStorage so users don't re-vote across page reloads
function getStoredVote(raffleId: string): 'UP' | 'DOWN' | null {
  try { return (localStorage.getItem(`vote_${raffleId}`) as 'UP' | 'DOWN' | null); } catch { return null; }
}
function storeVote(raffleId: string, vote: 'UP' | 'DOWN') {
  try { localStorage.setItem(`vote_${raffleId}`, vote); } catch { /* ignore */ }
}

interface DrawCardProps {
  raffle: Raffle;
}

export const DrawCard: React.FC<DrawCardProps> = ({ raffle }) => {
  const config = getConfig();
  const theme = getTheme(raffle.theme);
  const isCompetition = raffle.drawType === RaffleType.PRIZE_COMPETITION;
  const usesContainFit = raffle.imageFit === 'contain';
  const isUpcoming = raffle.status === RaffleStatus.UPCOMING;
  const isNotYetOpen = raffle.openDate ? new Date() < new Date(raffle.openDate) : false;
  const liveLabel = isNotYetOpen
    ? `Opens ${new Date(raffle.openDate!).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
    : 'Live now';

  // Voting state for UPCOMING draws
  const [vote, setVote] = useState<'UP' | 'DOWN' | null>(() => getStoredVote(raffle._id));
  const [voteLoading, setVoteLoading] = useState(false);

  const handleVote = async (direction: 'UP' | 'DOWN') => {
    if (vote || voteLoading) return;
    setVoteLoading(true);
    try {
      await logAwarenessEvent(raffle._id, direction === 'UP' ? 'VOTE_WANT' : 'VOTE_PASS');
      setVote(direction);
      storeVote(raffle._id, direction);
    } catch {
      // Fail silently — vote intent is recorded locally anyway
      setVote(direction);
      storeVote(raffle._id, direction);
    } finally {
      setVoteLoading(false);
    }
  };

  // UPCOMING draw card — voting only, no entry
  if (isUpcoming) {
    return (
      <article className="group overflow-hidden rounded-[28px] border border-brand-dark/10 bg-white/90 shadow-[0_24px_70px_rgba(40,26,57,0.08)] backdrop-blur-sm">
        <div className={`relative h-52 overflow-hidden ${usesContainFit ? 'bg-gradient-to-br from-white via-brand-mist to-[#d9e8dd]' : 'bg-brand-dark/10'}`}>
          <img
            src={formatWixMediaUrl(raffle.heroImageUrl || getAsset(raffle.assetKey))}
            alt={raffle.imageAlt || raffle.title}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `${import.meta.env.BASE_URL}assets/prizes/placeholder.svg`; }}
            className={`h-full w-full transition duration-700 group-hover:scale-105 opacity-80 ${usesContainFit ? 'object-contain p-6' : 'object-cover'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-brand-dark/10 to-transparent" />
          <div className="absolute left-5 top-5">
            <span className="rounded-full border border-white/30 bg-slate-700/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-white backdrop-blur">
              Coming Soon
            </span>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">{raffle.specs?.brand || 'Prize'}</p>
            <p className="mt-1 text-xl font-black leading-tight text-brand-plum">{raffle.title}</p>
            <p className="mt-1.5 text-sm text-slate-500 leading-5">{raffle.description}</p>
          </div>

          <div className="rounded-2xl border border-brand-dark/10 bg-brand-mist/60 p-4">
            <p className="text-xs font-bold text-slate-600 mb-3 text-center">Would you enter this draw?</p>
            {vote ? (
              <div className={`rounded-xl py-3 text-center font-bold text-sm ${vote === 'UP' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {vote === 'UP' ? '👍 Thanks — we\'ll try to make this happen!' : '👎 Noted — we\'ll keep looking for better prizes.'}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleVote('UP')}
                  disabled={voteLoading}
                  className="flex flex-col items-center gap-1 py-3 rounded-xl border-2 border-brand-green/30 bg-green-50 hover:bg-green-100 hover:border-brand-green transition-all"
                >
                  <span className="text-2xl">👍</span>
                  <span className="text-xs font-bold text-brand-green">Yes, I want this!</span>
                </button>
                <button
                  onClick={() => handleVote('DOWN')}
                  disabled={voteLoading}
                  className="flex flex-col items-center gap-1 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all"
                >
                  <span className="text-2xl">👎</span>
                  <span className="text-xs font-bold text-slate-500">Not for me</span>
                </button>
              </div>
            )}
          </div>

          {raffle.specs?.retailValue && (
            <p className="text-center text-xs text-slate-400">Estimated RRP {formatCurrency(raffle.specs.retailValue)}</p>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="group overflow-hidden rounded-[28px] border border-brand-dark/10 bg-white/90 shadow-[0_24px_70px_rgba(40,26,57,0.12)] backdrop-blur-sm">
      <Link to={`/draw/${raffle.slug}`} className="block">
        <div className={`relative h-60 overflow-hidden ${usesContainFit ? 'bg-gradient-to-br from-white via-brand-mist to-[#d9e8dd]' : 'bg-brand-dark/10'}`}>
          <img
            src={formatWixMediaUrl(raffle.heroImageUrl || getAsset(raffle.assetKey))}
            alt={raffle.imageAlt || raffle.title}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = `${import.meta.env.BASE_URL}assets/prizes/placeholder.svg`;
            }}
            className={`h-full w-full transition duration-700 group-hover:scale-105 ${usesContainFit ? 'object-contain p-6' : 'object-cover'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/75 via-brand-dark/10 to-transparent" />
          <div className="absolute left-5 top-5 flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-white shadow-lg ${isCompetition ? 'bg-brand-green' : 'bg-brand-plum'}`}>
              {isCompetition ? 'Prize Competition' : 'Prize Draw'}
            </span>
            <span className={`rounded-full border border-white/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white backdrop-blur ${isNotYetOpen ? 'bg-slate-600/80' : 'bg-white/15'}`}>
              {liveLabel}
            </span>
          </div>
          <div className="absolute bottom-5 left-5">
            <PricePill price={raffle.ticketPrice} className="border-white/25 bg-white/90" />
          </div>
        </div>
      </Link>

      <div className="space-y-5 p-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand-green">{raffle.specs?.brand}</p>
              <Link to={`/draw/${raffle.slug}`} className="mt-2 block text-2xl font-black leading-tight text-brand-plum transition hover:text-brand-green">
                {raffle.title}
              </Link>
            </div>
            <div className={`rounded-full border px-3 py-1 text-xs font-bold ${theme.badge}`}>
              {formatCurrency(raffle.specs?.retailValue || raffle.prizesValue)}
            </div>
          </div>
          <p className="text-sm leading-6 text-slate-600">{raffle.description}</p>
        </div>

        <div className="rounded-2xl border border-brand-dark/10 bg-brand-mist/70 p-4">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            <span>{raffle.soldTickets} entered</span>
            <span>{raffle.maxTickets} cap</span>
          </div>
          {raffle.closeDate && (
            <p className="mb-1 text-xs font-semibold text-brand-plum/70">
              Closes {new Date(raffle.closeDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}
          {raffle.drawDate && (
            <p className="mb-2 text-xs text-slate-500">
              Draw: {new Date(raffle.drawDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}
          <div className="h-2 overflow-hidden rounded-full bg-white">
            <div
              className={`h-full rounded-full ${theme.progressFill}`}
              style={{ width: `${calculateProgress(raffle.soldTickets, raffle.maxTickets)}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Entry fees support Mindful Gaming UK, but tickets are not donations or Gift Aid eligible.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link to={`/draw/${raffle.slug}`} className="block">
            <Button className="w-full bg-brand-green hover:bg-brand-green-dark">
              {isCompetition ? 'Solve and Enter' : 'View Draw'}
            </Button>
          </Link>
          <a href={config.charityLinks.donationFormUrl} target="_blank" rel="noreferrer" className="block">
            <Button variant="secondary" className="w-full border-brand-plum text-brand-plum hover:bg-brand-plum hover:text-white">
              Donate Instead
            </Button>
          </a>
        </div>
      </div>
    </article>
  );
};
