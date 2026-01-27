import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEntryIntentStatus } from '../services/api';
import { EntryIntent } from '../types';
import { Button } from '../components/Button';

export const EntryStatus: React.FC = () => {
  const { intentId } = useParams<{ intentId: string }>();
  const [status, setStatus] = useState<EntryIntent['status']>('PENDING');
  const [tickets, setTickets] = useState<number[]>([]);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (!intentId) return;

    const poll = async () => {
      try {
        const result = await getEntryIntentStatus(intentId);
        
        if (!isMounted.current) return;

        if (result.status === 'SUCCESS') {
          setStatus('SUCCESS');
          setTickets(result.ticketNumbers || []);
        } else if (result.status === 'FAILED') {
          setStatus('FAILED');
        } else {
          // Keep polling if pending
          setTimeout(poll, 2000);
        }
      } catch (error) {
        if (isMounted.current) {
          console.error("Polling failed", error);
          setStatus('FAILED');
        }
      }
    };

    poll();
  }, [intentId]);

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      {status === 'PENDING' && (
        <div className="animate-fadeIn">
          <div className="w-16 h-16 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirming Entry...</h2>
          <p className="text-gray-500 max-w-sm mx-auto">
            Please wait while we secure your tickets with the payment provider. This usually takes a few seconds.
          </p>
        </div>
      )}

      {status === 'FAILED' && (
        <div className="animate-fadeIn">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed or Expired</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            We couldn't confirm the transaction. No funds have been taken and no tickets were issued.
          </p>
          <Link to="/draws"><Button>Return to Draws</Button></Link>
        </div>
      )}

      {status === 'SUCCESS' && (
        <div className="animate-fadeIn">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-sm">✓</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Entry Confirmed!</h2>
          <p className="text-gray-600 mb-8">
            Good luck! We've sent a receipt and ticket record to your email.
          </p>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Your Ticket Numbers</h3>
            <div className="flex flex-wrap justify-center gap-3 max-h-48 overflow-y-auto">
              {tickets.map(t => (
                <span key={t} className="font-mono text-xl font-bold text-brand-purple bg-purple-50 px-4 py-2 rounded-lg border border-purple-100">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/my-entries"><Button variant="secondary" className="w-full sm:w-auto">View Wallet</Button></Link>
            <Link to="/draws"><Button className="w-full sm:w-auto">Enter Another Draw</Button></Link>
          </div>
        </div>
      )}
    </div>
  );
};
