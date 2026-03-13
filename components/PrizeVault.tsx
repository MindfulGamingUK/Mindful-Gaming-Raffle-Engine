import React, { useMemo, useState } from 'react';
import { prizeVaultCategoryLabels, prizeVaultItems, PrizeVaultCategory } from '../data/prizeVault';
import { RaffleType } from '../types';
import { formatCurrency } from '../utils/formatting';
import { getConfig } from '../utils/config';
import { Button } from './Button';
import { PricePill } from './PricePill';

interface PrizeVaultProps {
  title?: string;
  description?: string;
  limit?: number;
  showFilters?: boolean;
}

type VaultFilter = 'ALL' | PrizeVaultCategory;

const vaultFilters: VaultFilter[] = ['ALL', ...Object.keys(prizeVaultCategoryLabels) as PrizeVaultCategory[]];

export const PrizeVault: React.FC<PrizeVaultProps> = ({
  title = 'Prize Vault',
  description = 'This longlist keeps upcoming prizes visible before they go live. As each product launches in the main draw catalogue, remove it here and keep the Prize Vault focused on what is still coming next.',
  limit,
  showFilters = true
}) => {
  const config = getConfig();
  const [filter, setFilter] = useState<VaultFilter>('ALL');

  const items = useMemo(() => {
    const filtered = filter === 'ALL'
      ? prizeVaultItems
      : prizeVaultItems.filter((item) => item.category === filter);

    return typeof limit === 'number' ? filtered.slice(0, limit) : filtered;
  }, [filter, limit]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-brand-green">Prize Queue</p>
          <h2 className="text-3xl font-black tracking-tight text-brand-plum sm:text-4xl">{title}</h2>
          <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a href={config.charityLinks.donationFormUrl} target="_blank" rel="noreferrer">
            <Button className="bg-brand-green hover:bg-brand-green-dark">Donate Through Live Form</Button>
          </a>
          <a href={config.charityLinks.donateUrl} target="_blank" rel="noreferrer">
            <Button variant="secondary" className="border-brand-plum text-brand-plum hover:bg-brand-plum hover:text-white">
              Donation Page
            </Button>
          </a>
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2">
          {vaultFilters.map((option) => {
            const label = option === 'ALL' ? 'All prizes' : prizeVaultCategoryLabels[option];
            const active = filter === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${active ? 'border-brand-plum bg-brand-plum text-white shadow-lg shadow-brand-plum/20' : 'border-brand-dark/10 bg-white text-slate-600 hover:border-brand-green hover:text-brand-green'}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-[28px] border border-brand-dark/10 bg-white/92 shadow-[0_20px_70px_rgba(40,26,57,0.1)]">
            <div className={`relative h-56 overflow-hidden ${item.category === 'PHYSICAL_GAMES' || item.category === 'GRAPHICS_CARDS' || item.category === 'BUNDLES' ? 'bg-brand-mist' : 'bg-gradient-to-br from-white via-brand-mist to-[#d9e8dd]'}`}>
              <img
                src={item.imageUrl}
                alt={item.imageAlt}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = `${import.meta.env.BASE_URL}assets/prizes/placeholder.svg`;
                }}
                className={`h-full w-full ${item.category === 'PHYSICAL_GAMES' || item.category === 'GRAPHICS_CARDS' || item.category === 'BUNDLES' ? 'object-cover' : 'object-contain p-6'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/10 to-transparent" />
              <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-brand-yellow px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-brand-dark">
                  {item.categoryLabel}
                </span>
                <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white backdrop-blur">
                  Coming Soon
                </span>
              </div>
              {item.category === 'PHYSICAL_GAMES' && (
                <div className="absolute bottom-5 right-5 rounded-full border border-white/30 bg-brand-plum/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-white shadow-lg backdrop-blur">
                  Physical Edition
                </div>
              )}
              <div className="absolute bottom-5 left-5">
                <PricePill price={item.entryPriceGbp} className="border-white/20 bg-white/90" />
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand-green">{item.platform}</p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-brand-plum">{item.title}</h3>
                  </div>
                  <div className="rounded-full border border-brand-dark/10 bg-brand-mist px-3 py-1 text-sm font-bold text-brand-plum">
                    {formatCurrency(item.retailValueGbp)}
                  </div>
                </div>
                <p className="text-sm leading-6 text-slate-600">{item.shortBlurb}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-brand-mist px-3 py-1 text-xs font-medium text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-white ${item.liveStrategy === RaffleType.PRIZE_COMPETITION ? 'bg-brand-green' : 'bg-brand-plum'}`}>
                  {item.liveStrategy === RaffleType.PRIZE_COMPETITION ? 'Prize Competition' : 'Lottery Draw'}
                </span>
              </div>

              <a href={config.charityLinks.donationFormUrl} target="_blank" rel="noreferrer" className="block">
                <Button className="w-full bg-brand-green hover:bg-brand-green-dark">Support the Charity Instead</Button>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
