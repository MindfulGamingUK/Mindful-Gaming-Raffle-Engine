import React from 'react';
import { Link } from 'react-router-dom';
import { Raffle, RaffleType } from '../types';
import { Button } from './Button';
import { PricePill } from './PricePill';
import { calculateProgress, formatCurrency } from '../utils/formatting';
import { getAsset } from '../utils/assets';
import { getConfig } from '../utils/config';
import { getTheme } from '../utils/theme';
import { formatWixMediaUrl } from '../utils/wixMedia';

interface DrawCardProps {
  raffle: Raffle;
}

export const DrawCard: React.FC<DrawCardProps> = ({ raffle }) => {
  const config = getConfig();
  const theme = getTheme(raffle.theme);
  const isCompetition = raffle.drawType === RaffleType.PRIZE_COMPETITION;
  const usesContainFit = raffle.imageFit === 'contain';

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
              {isCompetition ? 'Prize Competition' : 'Lottery Raffle'}
            </span>
            <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white backdrop-blur">
              Live now
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
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand-green">{raffle.specs.brand}</p>
              <Link to={`/draw/${raffle.slug}`} className="mt-2 block text-2xl font-black leading-tight text-brand-plum transition hover:text-brand-green">
                {raffle.title}
              </Link>
            </div>
            <div className={`rounded-full border px-3 py-1 text-xs font-bold ${theme.badge}`}>
              {formatCurrency(raffle.specs.retailValue || raffle.prizesValue)}
            </div>
          </div>
          <p className="text-sm leading-6 text-slate-600">{raffle.description}</p>
        </div>

        <div className="rounded-2xl border border-brand-dark/10 bg-brand-mist/70 p-4">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            <span>{raffle.soldTickets} entered</span>
            <span>{raffle.maxTickets} cap</span>
          </div>
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
