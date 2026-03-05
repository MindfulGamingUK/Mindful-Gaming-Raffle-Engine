import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RaffleType } from '../types';
import { fetchWinners, PublicWinner } from '../services/api';
import { Button } from '../components/Button';
import { TrustStack } from '../components/TrustStack';

const STATUS_LABEL: Record<PublicWinner['status'], string> = {
  PRIZE_DISPATCHED: 'Prize Dispatched',
  CLAIMED:          'Claimed',
  PENDING:          'Pending',
};

const STATUS_STYLE: Record<PublicWinner['status'], string> = {
  PRIZE_DISPATCHED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CLAIMED:          'bg-blue-50 text-blue-700 border-blue-200',
  PENDING:          'bg-amber-50 text-amber-700 border-amber-200',
};

export const Winners: React.FC = () => {
  const [winners, setWinners] = useState<PublicWinner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWinners()
      .then(setWinners)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fadeIn">

      {/* Header */}
      <div className="mb-10 space-y-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-dark tracking-tight">Past Winners</h1>
          <p className="text-gray-500 mt-2">
            Verified draw results, published with winner consent. Every draw is conducted by cryptographic RNG and independently auditable.
          </p>
        </div>
        <TrustStack variant="horizontal" compact />
      </div>

      {/* Winners list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 h-24 animate-pulse" />
          ))}
        </div>
      ) : winners.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-gray-100 rounded-3xl">
          <p className="text-5xl mb-4">🏆</p>
          <p className="text-gray-700 font-bold text-lg">No completed draws yet</p>
          <p className="text-gray-400 text-sm mt-2 mb-6">
            Our first draw is scheduled for March 2026. Enter now for your chance to win.
          </p>
          <Link to="/draws">
            <Button>View Live Draws</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {winners.map(w => {
            const isComp = w.drawType === RaffleType.PRIZE_COMPETITION;
            return (
              <div key={w._id} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow">
                {/* Type badge */}
                <div className="shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${isComp ? 'bg-brand-teal text-white' : 'bg-brand-purple text-white'}`}>
                    {isComp ? '🧠 Competition' : '🎰 Lottery'}
                  </span>
                </div>

                {/* Draw info */}
                <div className="flex-grow">
                  <p className="font-semibold text-gray-900 leading-snug">{w.raffleTitle}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Draw date: {new Date(w.drawDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>

                {/* Ticket */}
                <div className="text-center shrink-0">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Winning Ticket</p>
                  <p className="font-mono font-bold text-gray-900">{w.winningTicketDisplay}</p>
                </div>

                {/* Winner */}
                <div className="text-center shrink-0 min-w-[120px]">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Winner</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {w.winnerPublicLabel ?? <span className="text-gray-400 italic">— private</span>}
                  </p>
                </div>

                {/* Status */}
                <div className="shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLE[w.status]}`}>
                    {STATUS_LABEL[w.status]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Verification CTA */}
      <div className="mt-12 bg-brand-surface rounded-2xl p-8 text-center space-y-3 border border-gray-100">
        <p className="font-semibold text-gray-900">Need to verify a result?</p>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Full winner records and audit logs are available on request. All draws use cryptographic RNG with a tamper-evident log stored in Wix CMS.
        </p>
        <a href="mailto:info@mindfulgaminguk.org?subject=Winner%20verification%20request">
          <Button variant="secondary" className="mt-2">Request Full Winners List</Button>
        </a>
      </div>

      {/* Reg note */}
      <p className="text-center text-xs text-gray-400 mt-8">
        Small Society Lottery registered with Birmingham City Council (Ref: 213653). Returns filed within 3 months of each draw.
      </p>
    </div>
  );
};
