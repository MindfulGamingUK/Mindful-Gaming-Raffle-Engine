import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Raffle, PaymentProvider, MindfulContent, UserProfile, RaffleStatus } from '../types';
import { fetchRaffleBySlug, createEntryIntent, fetchMindfulContent, getSession, updateProfile } from '../services/api';
import { Button } from '../components/Button';
import { ComplianceFooter } from '../components/ComplianceFooter';
import { TransparencyPanel } from '../components/TransparencyPanel';
import { MindfulMoment } from '../components/MindfulMoment';

type Step = 'OVERVIEW' | 'AUTH_CHECK' | 'MINDFUL_INTERACTION' | 'QUANTITY' | 'PAYMENT';

export const RaffleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [step, setStep] = useState<Step>('OVERVIEW');
  const [mindfulContent, setMindfulContent] = useState<MindfulContent | null>(null);
  
  // Cart
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Progressive Profile State
  const [dobInput, setDobInput] = useState('');
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      fetchRaffleBySlug(slug),
      getSession(),
      fetchMindfulContent()
    ]).then(([r, u, m]) => {
      setRaffle(r || null);
      setUser(u);
      setMindfulContent(m);
      if (u?.dob) setDobInput(u.dob);
    });
  }, [slug]);

  const handleStartEntry = () => {
    if (!user) {
      alert("Please Log In (Simulating Wix Member Login)");
      getSession().then(u => {
        if (u) {
          setUser(u);
          setStep('AUTH_CHECK');
        }
      });
    } else {
      setStep('AUTH_CHECK');
    }
  };

  const handleProfileUpdate = async () => {
    const age = new Date().getFullYear() - new Date(dobInput).getFullYear();
    if (age < 18) {
      alert("You must be 18+ to enter.");
      return;
    }
    setSubmitting(true);
    await updateProfile({ dob: dobInput, residencyConfirmed: true });
    setUser(prev => prev ? ({ ...prev, dob: dobInput, residencyConfirmed: true }) : null);
    setSubmitting(false);
    setStep('MINDFUL_INTERACTION');
  };

  const handlePayment = async (provider: PaymentProvider) => {
    if (!raffle || !user) return;
    setSubmitting(true);
    try {
      const { paymentUrl } = await createEntryIntent(raffle._id, quantity, provider);
      window.location.href = paymentUrl;
    } catch (e) {
      alert("Payment initiation failed.");
      setSubmitting(false);
    }
  };

  if (!raffle) return <div className="p-12 text-center">Loading...</div>;

  const isClosed = raffle.status === RaffleStatus.CLOSED || raffle.status === RaffleStatus.DRAWN || raffle.status === RaffleStatus.SOLD_OUT;
  const isWinnerKnown = raffle.status === RaffleStatus.DRAWN && raffle.winningTicketNumber;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-gray-500">
        <button onClick={() => navigate('/draws')} className="hover:underline">Draws</button>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{raffle.title}</span>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Visuals & Info */}
        <div className="md:col-span-7">
          <div className="relative rounded-xl overflow-hidden shadow-lg mb-6 group">
            <img src={raffle.imageUrl} alt={raffle.title} className="w-full h-64 md:h-80 object-cover" />
            
            {isWinnerKnown && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-6 text-center backdrop-blur-sm">
                    <span className="text-3xl mb-2">🏆</span>
                    <h2 className="text-2xl font-bold mb-1">Winner Announced</h2>
                    <p className="text-xl font-bold text-brand-teal">{raffle.winnerPublicId}</p>
                    <p className="text-sm opacity-75">Ticket #{raffle.winningTicketNumber}</p>
                </div>
            )}

            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-dark">
              {raffle.type === 'MICRO' ? 'Micro-Draw' : 'Main Event'}
            </div>
          </div>

          <div className="prose prose-sm prose-purple max-w-none mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{raffle.title}</h1>
            <p className="text-gray-600 mb-4">{raffle.description}</p>
            
            {/* SPECS GRID */}
            {raffle.specs && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                    <h4 className="font-bold text-xs uppercase text-gray-400 mb-3">Item Specifications</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500 block">Brand</span>
                            <span className="font-medium">{raffle.specs.brand}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block">Model</span>
                            <span className="font-medium">{raffle.specs.model}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block">Condition</span>
                            <span className="font-medium">{raffle.specs.condition}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block">Retail Value</span>
                            <span className="font-medium">£{raffle.specs.retailValue}</span>
                        </div>
                    </div>
                </div>
            )}

            {raffle.cashAlternative && (
               <p className="text-xs text-gray-500 italic bg-gray-50 p-2 border-l-2 border-brand-teal inline-block">
                 Alternative prize value: £{raffle.cashAlternative.toFixed(2)}. 
                 <span className="ml-1 text-gray-400">Winning implies acceptance of Terms.</span>
               </p>
            )}
          </div>

          <TransparencyPanel ticketPrice={raffle.ticketPrice} projectedDonationPercent={raffle.projectedDonation} />
        </div>

        {/* RIGHT COLUMN: The Journey Card */}
        <div className="md:col-span-5">
           <div className="bg-white border border-gray-200 shadow-xl rounded-xl p-6 sticky top-24">
             
             {/* HEADER */}
             <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-bold">Ticket Price</div>
                  <div className="text-2xl font-bold text-brand-purple">£{raffle.ticketPrice.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-bold">Status</div>
                  <div className={`text-sm font-bold ${isClosed ? 'text-red-500' : 'text-green-600'}`}>
                      {raffle.status.replace('_', ' ')}
                  </div>
                </div>
             </div>

             {/* CLOSED STATE */}
             {isClosed ? (
                 <div className="text-center py-8">
                     <p className="text-gray-500 font-medium mb-4">This draw has ended.</p>
                     <Button variant="secondary" onClick={() => navigate('/draws')}>View Active Draws</Button>
                 </div>
             ) : (
                <>
                {/* ACTIVE FLOW */}
                {step === 'OVERVIEW' && (
                <div className="animate-fadeIn">
                    <div className="mb-6">
                        <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                        <div className="bg-brand-teal h-2 rounded-full" style={{ width: `${(raffle.soldTickets / raffle.maxTickets) * 100}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                        <span>{raffle.soldTickets} Sold</span>
                        <span>{raffle.maxTickets} Cap</span>
                        </div>
                    </div>
                    <Button className="w-full py-4 text-lg shadow-brand-purple/20 shadow-lg" onClick={handleStartEntry}>
                        Enter Draw
                    </Button>
                    <p className="mt-4 text-xs text-center text-gray-400">
                        You must be 18+ and a GB resident. <br/>Login required.
                    </p>
                </div>
                )}

                {step === 'AUTH_CHECK' && (
                <div className="animate-fadeIn space-y-4">
                    <h3 className="font-bold text-gray-900">Confirm Eligibility</h3>
                    {user?.dob ? (
                    <div className="bg-green-50 text-green-800 p-3 rounded text-sm flex items-center gap-2">
                        <span>✓</span> Profile Verified (18+)
                    </div>
                    ) : (
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Date of Birth</label>
                        <input 
                        type="date" 
                        value={dobInput} 
                        onChange={(e) => setDobInput(e.target.value)}
                        className="w-full p-2 border rounded"
                        />
                    </div>
                    )}
                    
                    <div className="flex items-start gap-2">
                    <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1" />
                    <label className="text-xs text-gray-600">
                        I accept the Terms. I understand this is a paid raffle entry, NOT a donation.
                    </label>
                    </div>

                    <Button 
                    className="w-full" 
                    disabled={!agreed || (!user?.dob && !dobInput)}
                    isLoading={submitting}
                    onClick={() => user?.dob ? setStep('MINDFUL_INTERACTION') : handleProfileUpdate()}
                    >
                    Continue
                    </Button>
                </div>
                )}

                {step === 'MINDFUL_INTERACTION' && mindfulContent && (
                <div className="animate-fadeIn">
                    <MindfulMoment 
                        content={mindfulContent} 
                        onComplete={() => setStep('QUANTITY')} 
                    />
                    <div className="mt-4 text-center">
                        <button onClick={() => setStep('QUANTITY')} className="text-xs text-gray-400 underline">Skip</button>
                    </div>
                </div>
                )}

                {step === 'QUANTITY' && (
                <div className="animate-fadeIn">
                    <h3 className="font-bold text-gray-900 mb-4 text-center">Select Tickets</h3>
                    <div className="flex items-center justify-center gap-6 mb-6">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full border hover:bg-gray-100 font-bold">-</button>
                        <div className="text-center">
                        <span className="text-3xl font-bold text-brand-purple">{quantity}</span>
                        </div>
                        <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-10 h-10 rounded-full border hover:bg-gray-100 font-bold">+</button>
                    </div>
                    <div className="text-center mb-6">
                    <div className="text-gray-500 text-sm">Total to pay</div>
                    <div className="text-2xl font-bold text-gray-900">£{(quantity * raffle.ticketPrice).toFixed(2)}</div>
                    </div>
                    <Button className="w-full" onClick={() => setStep('PAYMENT')}>Proceed to Payment</Button>
                    <button onClick={() => setStep('OVERVIEW')} className="w-full mt-2 text-sm text-gray-500">Cancel</button>
                </div>
                )}

                {step === 'PAYMENT' && (
                <div className="animate-fadeIn space-y-3">
                    <h3 className="font-bold text-gray-900 mb-2">Secure Checkout</h3>
                    <div className="bg-yellow-50 border border-yellow-100 p-2 text-xs text-yellow-800 mb-2 rounded">
                    You are purchasing {quantity} ticket(s). This is not tax deductible.
                    </div>
                    <button onClick={() => handlePayment(PaymentProvider.STRIPE)} disabled={submitting} className="w-full bg-[#635BFF] text-white py-3 rounded font-bold hover:opacity-90 transition">
                    Pay with Card
                    </button>
                    <button onClick={() => handlePayment(PaymentProvider.PAYPAL)} disabled={submitting} className="w-full bg-[#FFC439] text-black py-3 rounded font-bold hover:opacity-90 transition">
                    Pay with PayPal
                    </button>
                    <button onClick={() => setStep('QUANTITY')} className="w-full text-sm text-gray-500 mt-2">Back</button>
                </div>
                )}
                </>
             )}

           </div>
        </div>
      </div>

      <ComplianceFooter 
         promoterName={raffle.promoterName} 
         localAuthority={raffle.localAuthority} 
         licenceNumber={raffle.licenceNumber} 
      />
    </div>
  );
};
