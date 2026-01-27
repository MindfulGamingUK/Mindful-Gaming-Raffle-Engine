import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Raffle, PaymentProvider, MindfulContent, RaffleStatus } from '../types';
import { fetchRaffleBySlug, createEntryIntent, fetchMindfulContent } from '../services/api';
import { getAsset } from '../utils/assets';
import { formatCurrency, calculateProgress, isOver18 } from '../utils/formatting';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { TransparencyPanel } from '../components/TransparencyPanel';
import { MindfulMoment } from '../components/MindfulMoment';

type Step = 'OVERVIEW' | 'PROFILE_GATE' | 'MINDFUL' | 'CART' | 'PAYMENT';

export const RaffleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, login, isEligible, updateUser } = useAuth();
  
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [step, setStep] = useState<Step>('OVERVIEW');
  const [mindfulContent, setMindfulContent] = useState<MindfulContent | null>(null);
  
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Gating Form State
  const [dobInput, setDobInput] = useState('');
  const [residencyChecked, setResidencyChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      fetchRaffleBySlug(slug),
      fetchMindfulContent()
    ]).then(([r, m]) => {
      setRaffle(r || null);
      setMindfulContent(m);
    });
  }, [slug]);

  useEffect(() => {
    if (user) {
      if (user.dob) setDobInput(user.dob);
      if (user.residencyConfirmed) setResidencyChecked(true);
    }
  }, [user]);

  const handleStartEntry = () => {
    if (!user) {
      login();
      return;
    } 
    
    // UX Polish: Auto-skip gate if already eligible
    if (isEligible) {
      setStep('MINDFUL');
    } else {
      setStep('PROFILE_GATE');
    }
  };

  const handleGateSubmit = async () => {
    setErrorMsg('');
    if (!dobInput) return setErrorMsg('Date of Birth is required.');
    if (!isOver18(dobInput)) return setErrorMsg('You must be 18+ to enter.');
    if (!residencyChecked) return setErrorMsg('You must confirm GB residency.');
    if (!termsChecked) return setErrorMsg('You must accept the terms.');

    setSubmitting(true);
    try {
      await updateUser({
        dob: dobInput,
        residencyConfirmed: true,
        termsAcceptedAt: new Date().toISOString()
      });
      setSubmitting(false);
      setStep('MINDFUL');
    } catch (e) {
      setErrorMsg('Failed to update profile. Please try again.');
      setSubmitting(false);
    }
  };

  const handlePayment = async (provider: PaymentProvider) => {
    if (!raffle || !user) return;
    setSubmitting(true);
    try {
      const { paymentUrl } = await createEntryIntent(raffle._id, quantity, provider);
      
      // Routing Fix: navigate handles absolute paths without hash
      if (paymentUrl.startsWith('/')) {
         navigate(paymentUrl);
      } else {
         window.location.href = paymentUrl;
      }
    } catch (e) {
      alert("Payment initiation failed. Please try again.");
      setSubmitting(false);
    }
  };

  if (!raffle) return <div className="p-12 text-center animate-pulse">Loading Raffle...</div>;

  const isClosed = raffle.status === RaffleStatus.CLOSED || raffle.status === RaffleStatus.DRAWN || raffle.status === RaffleStatus.SOLD_OUT;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6 text-sm text-gray-500 flex items-center gap-2">
        <button onClick={() => navigate('/draws')} className="hover:text-brand-purple">Draws</button>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{raffle.title}</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: Visuals & Info */}
        <div className="lg:col-span-7 space-y-8">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-100 group">
            <img src={getAsset(raffle.assetKey)} alt={raffle.title} className="w-full h-80 lg:h-96 object-cover" />
            <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${raffle.type === 'FLAGSHIP' ? 'bg-brand-purple text-white' : 'bg-white text-gray-900'}`}>
                    {raffle.type === 'FLAGSHIP' ? 'Main Event' : 'Micro Draw'}
                </span>
            </div>
          </div>

          <div className="prose prose-purple max-w-none">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{raffle.title}</h1>
            <p className="text-gray-600 text-lg leading-relaxed">{raffle.description}</p>
            
            {/* SPECS */}
            {raffle.specs && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Prize Specifications</h3>
                    <dl className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                        <div><dt className="text-gray-500">Brand</dt><dd className="font-semibold text-gray-900">{raffle.specs.brand}</dd></div>
                        <div><dt className="text-gray-500">Model</dt><dd className="font-semibold text-gray-900">{raffle.specs.model}</dd></div>
                        <div><dt className="text-gray-500">Condition</dt><dd className="font-semibold text-gray-900">{raffle.specs.condition}</dd></div>
                        <div><dt className="text-gray-500">RRP</dt><dd className="font-semibold text-gray-900">{formatCurrency(raffle.specs.retailValue)}</dd></div>
                    </dl>
                </div>
            )}
          </div>

          <TransparencyPanel ticketPrice={raffle.ticketPrice} projectedDonationPercent={raffle.projectedDonation} />
        </div>

        {/* RIGHT COLUMN: The Interaction Card */}
        <div className="lg:col-span-5">
           <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6 lg:p-8 sticky top-24">
             
             {/* Header */}
             <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-6">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Price per Entry</p>
                  <p className="text-3xl font-extrabold text-brand-purple">{formatCurrency(raffle.ticketPrice)}</p>
                </div>
                <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded text-xs font-bold ${isClosed ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {raffle.status}
                    </span>
                </div>
             </div>

             {isClosed ? (
                 <div className="text-center py-8">
                     <p className="text-gray-500 font-medium mb-4">This draw has ended.</p>
                     <Button variant="secondary" onClick={() => navigate('/draws')}>View Active Draws</Button>
                 </div>
             ) : (
                <>
                {/* 1. OVERVIEW */}
                {step === 'OVERVIEW' && (
                <div className="animate-fadeIn space-y-6">
                    <div>
                        <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
                            <span>{raffle.soldTickets} tickets sold</span>
                            <span>{raffle.maxTickets} max</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                            <div className="bg-brand-teal h-3 rounded-full" style={{ width: `${calculateProgress(raffle.soldTickets, raffle.maxTickets)}%` }}></div>
                        </div>
                    </div>
                    
                    <Button className="w-full py-4 text-lg shadow-lg shadow-brand-purple/20" onClick={handleStartEntry}>
                        {user ? 'Purchase Tickets' : 'Login to Enter'}
                    </Button>
                    
                    <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg flex gap-2 items-start">
                        <span className="text-base">ℹ️</span>
                        <p>Login required. You must be 18+ and a resident of Great Britain to participate.</p>
                    </div>
                </div>
                )}

                {/* 2. PROFILE GATE (Skipped if Eligible) */}
                {step === 'PROFILE_GATE' && (
                <div className="animate-fadeIn space-y-4">
                    <div className="text-center mb-4">
                        <h3 className="font-bold text-gray-900">Eligibility Check</h3>
                        <p className="text-xs text-gray-500">Legal requirement for UK raffles.</p>
                    </div>

                    {errorMsg && <div className="text-red-600 text-xs bg-red-50 p-2 rounded border border-red-100">{errorMsg}</div>}

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Date of Birth</label>
                            <input type="date" value={dobInput} onChange={(e) => setDobInput(e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple"
                            />
                        </div>

                        <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" checked={residencyChecked} onChange={e => setResidencyChecked(e.target.checked)} className="mt-1 w-4 h-4 text-brand-purple rounded" />
                            <span className="text-xs text-gray-700">I confirm I am a resident of Great Britain.</span>
                        </label>

                        <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" checked={termsChecked} onChange={e => setTermsChecked(e.target.checked)} className="mt-1 w-4 h-4 text-brand-purple rounded" />
                            <span className="text-xs text-gray-700">I accept the Terms and understand this is NOT a donation.</span>
                        </label>
                    </div>

                    <Button className="w-full mt-4" onClick={handleGateSubmit} isLoading={submitting}>Confirm & Continue</Button>
                </div>
                )}

                {/* 3. MINDFUL MOMENT */}
                {step === 'MINDFUL' && mindfulContent && (
                <div className="animate-fadeIn">
                    <MindfulMoment content={mindfulContent} onComplete={() => setStep('CART')} />
                    <div className="mt-4 text-center">
                        <button onClick={() => setStep('CART')} className="text-xs text-gray-400 hover:text-gray-600 underline">Skip Mindful Moment</button>
                    </div>
                </div>
                )}

                {/* 4. CART */}
                {step === 'CART' && (
                <div className="animate-fadeIn">
                    <h3 className="font-bold text-gray-900 mb-6 text-center">How many tickets?</h3>
                    <div className="flex items-center justify-center gap-6 mb-8">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-brand-purple hover:text-brand-purple font-bold text-xl transition-colors">-</button>
                        <div className="text-center w-16"><span className="text-4xl font-extrabold text-brand-purple">{quantity}</span></div>
                        <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-brand-purple hover:text-brand-purple font-bold text-xl transition-colors">+</button>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 flex justify-between items-center border border-gray-100">
                        <span className="text-gray-600 font-medium">Total to Pay</span>
                        <span className="text-2xl font-bold text-gray-900">{formatCurrency(quantity * raffle.ticketPrice)}</span>
                    </div>
                    <Button className="w-full py-3" onClick={() => setStep('PAYMENT')}>Proceed to Checkout</Button>
                    <button onClick={() => setStep('OVERVIEW')} className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600">Cancel</button>
                </div>
                )}

                {/* 5. PAYMENT */}
                {step === 'PAYMENT' && (
                <div className="animate-fadeIn space-y-4">
                    <h3 className="font-bold text-gray-900 mb-2">Select Payment Method</h3>
                    {/* Compliance Warning */}
                    <div className="bg-yellow-50 border border-yellow-200 p-3 text-xs text-yellow-800 rounded-lg flex items-start gap-2">
                        <span>⚠️</span>
                        Payment represents a purchase of chance, not a charitable gift. Not Gift Aid eligible.
                    </div>
                    <button onClick={() => handlePayment(PaymentProvider.STRIPE)} disabled={submitting} className="w-full bg-[#635BFF] text-white py-3.5 rounded-lg font-bold hover:bg-[#534be0] transition flex justify-center items-center gap-2 shadow-sm">
                        <span>Credit / Debit Card</span>
                    </button>
                    <button onClick={() => handlePayment(PaymentProvider.PAYPAL)} disabled={submitting} className="w-full bg-[#FFC439] text-black py-3.5 rounded-lg font-bold hover:brightness-95 transition flex justify-center items-center gap-2 shadow-sm">
                        <span>PayPal</span>
                    </button>
                    <button onClick={() => setStep('CART')} className="w-full text-sm text-gray-500 mt-2 hover:underline">Back to Quantity</button>
                </div>
                )}
                </>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};
