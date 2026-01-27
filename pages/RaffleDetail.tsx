import React, { useState, useEffect } from 'react';
import { Raffle, PaymentProvider, MindfulContent } from '../types';
import { fetchRaffleById, createEntryIntent, fetchMindfulContent } from '../services/api';
import { Button } from '../components/Button';
import { AgeGate } from '../components/AgeGate';
import { ComplianceFooter } from '../components/ComplianceFooter';
import { TransparencyPanel } from '../components/TransparencyPanel';
import { MindfulMoment } from '../components/MindfulMoment';

type Step = 'DETAILS' | 'AGE_GATE' | 'MINDFUL_CHECK' | 'PAYMENT';

export const RaffleDetail: React.FC = () => {
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<Step>('DETAILS');
  const [mindfulContent, setMindfulContent] = useState<MindfulContent | null>(null);

  // Cart State
  const [quantity, setQuantity] = useState(1);
  
  // User Form State
  const [dob, setDob] = useState('');
  const [isOver18, setIsOver18] = useState(false);
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Parallel fetch for raffle and mindful content
    Promise.all([
      fetchRaffleById('mock_id'),
      fetchMindfulContent()
    ]).then(([raffleData, contentData]) => {
      setRaffle(raffleData || null);
      setMindfulContent(contentData);
      setLoading(false);
    });
  }, []);

  const handlePayment = async (provider: PaymentProvider) => {
    if (!raffle) return;
    setSubmitting(true);
    try {
      const result = await createEntryIntent(raffle._id, quantity, provider, { email, dob });
      // Redirect to external payment provider
      window.location.href = result.paymentUrl;
    } catch (err) {
      alert('Error initiating secure checkout. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12 text-brand-purple animate-pulse">Loading Experience...</div>;
  if (!raffle) return <div className="text-center p-12">Raffle not found.</div>;

  const totalCost = (quantity * raffle.ticketPrice).toFixed(2);
  const percentSold = Math.min(100, (raffle.soldTickets / raffle.maxTickets) * 100);

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 bg-white shadow-xl rounded-xl my-8 border-t-4 border-brand-purple">
      
      {/* --- HEADER SECTION --- */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-dark mb-2">{raffle.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
           <span className="bg-gray-100 px-2 py-1 rounded">Draws: {new Date(raffle.drawDate).toLocaleDateString()}</span>
           <span className="font-semibold text-brand-purple">£{raffle.ticketPrice.toFixed(2)} / ticket</span>
        </div>
      </div>

      {/* --- PROGRESS VISUAL --- */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
          <div className="bg-brand-teal h-1.5 rounded-full" style={{ width: `${percentSold}%` }}></div>
        </div>
        <p className="text-xs text-gray-400 text-right">{raffle.soldTickets} tickets sold of {raffle.maxTickets}</p>
      </div>

      {/* --- DYNAMIC JOURNEY CONTENT --- */}
      <div className="min-h-[400px]">
        
        {/* STEP 1: DETAILS & SELECTION */}
        {currentStep === 'DETAILS' && (
          <div className="animate-fadeIn">
            <div className="relative h-48 rounded-lg overflow-hidden mb-6 bg-gray-100">
               <img src={raffle.imageUrl} alt="Prize" className="w-full h-full object-cover" />
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-6">{raffle.description}</p>
            
            <TransparencyPanel 
              ticketPrice={raffle.ticketPrice} 
              projectedDonationPercent={raffle.projectedDonation} 
            />

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <label className="block text-sm font-bold text-brand-dark mb-3 text-center">
                How many chances to win?
              </label>
              <div className="flex justify-center items-center gap-4 mb-4">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-white border border-gray-300 text-xl font-bold hover:bg-gray-100 text-brand-dark"
                >-</button>
                <div className="text-center">
                  <span className="block text-2xl font-bold text-brand-purple">{quantity}</span>
                  <span className="text-xs text-gray-500">Tickets</span>
                </div>
                <button 
                  onClick={() => setQuantity(Math.min(20, quantity + 1))} // Cap per transaction for responsibility
                  className="w-10 h-10 rounded-full bg-white border border-gray-300 text-xl font-bold hover:bg-gray-100 text-brand-dark"
                >+</button>
              </div>
              <div className="text-center text-lg font-bold text-brand-dark">
                Total: £{totalCost}
              </div>
            </div>

            <Button className="w-full" onClick={() => setCurrentStep('AGE_GATE')}>
              Continue to Entry
            </Button>
          </div>
        )}

        {/* STEP 2: AGE & ELIGIBILITY GATE */}
        {currentStep === 'AGE_GATE' && (
          <div className="animate-fadeIn py-4">
            <h2 className="text-xl font-bold text-brand-dark mb-4">Eligibility Check</h2>
            <p className="text-sm text-gray-600 mb-6">
              To comply with the UK Gambling Act 2005, we must verify you are 18 or over. 
              Underage gambling is an offence.
            </p>

            <div className="space-y-6">
              <AgeGate 
                dob={dob} 
                onDobChange={setDob} 
                onVerified={setIsOver18} 
              />

              <div className="space-y-3">
                 <label className="block text-sm font-medium text-gray-700">Your Email (for ticket delivery)</label>
                 <input 
                   type="email" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:outline-none"
                   placeholder="jane@example.com"
                 />
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={agreed} 
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 h-5 w-5 text-brand-purple rounded border-gray-300 focus:ring-brand-purple"
                />
                <label htmlFor="terms" className="text-xs text-gray-600">
                  I confirm I am 18+, a resident of Great Britain, and I understand this purchase is a raffle entry, 
                  <span className="font-bold text-red-600"> NOT a donation eligible for Gift Aid</span>.
                </label>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setCurrentStep('DETAILS')} className="flex-1">
                  Back
                </Button>
                <Button 
                  className="flex-1"
                  disabled={!isOver18 || !email || !agreed}
                  onClick={() => setCurrentStep('MINDFUL_CHECK')}
                >
                  Confirm Eligibility
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: MINDFUL PAUSE (INTERACTIVE LAYER) */}
        {currentStep === 'MINDFUL_CHECK' && (
          <div className="py-8">
            {mindfulContent ? (
              <MindfulMoment 
                content={mindfulContent} 
                onComplete={() => setCurrentStep('PAYMENT')} 
              />
            ) : (
              // Fallback if content fails to load
              <div className="text-center">
                <p className="mb-4">Proceeding to checkout...</p>
                <Button onClick={() => setCurrentStep('PAYMENT')}>Continue</Button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: PAYMENT PROVIDER SELECTION */}
        {currentStep === 'PAYMENT' && (
          <div className="animate-fadeIn py-4">
            <h2 className="text-xl font-bold text-brand-dark mb-2">Secure Payment</h2>
            <div className="bg-blue-50 border border-blue-100 p-3 rounded text-sm text-blue-800 mb-6">
              You are purchasing <strong>{quantity}</strong> ticket(s) for <strong>£{totalCost}</strong>.
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handlePayment(PaymentProvider.STRIPE)}
                disabled={submitting}
                className={`w-full flex items-center justify-center gap-3 p-4 rounded-lg border transition-all duration-200 
                  ${submitting ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'bg-[#635BFF] text-white hover:bg-[#4b45c6] shadow-md hover:shadow-lg'}`}
              >
                {/* SVG for Stripe would go here */}
                <span className="font-bold">Pay with Card (Stripe)</span>
              </button>

              <button
                onClick={() => handlePayment(PaymentProvider.PAYPAL)}
                disabled={submitting}
                className={`w-full flex items-center justify-center gap-3 p-4 rounded-lg border transition-all duration-200 
                  ${submitting ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'bg-[#FFC439] text-black hover:bg-[#f4bb36] shadow-md hover:shadow-lg'}`}
              >
                {/* SVG for PayPal would go here */}
                <span className="font-bold">Pay with PayPal</span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setCurrentStep('DETAILS')}
                className="text-sm text-gray-500 underline hover:text-gray-800"
                disabled={submitting}
              >
                Cancel and return
              </button>
            </div>
          </div>
        )}

      </div>

      {/* --- FOOTER --- */}
      <ComplianceFooter 
        promoterName={raffle.promoterName}
        localAuthority={raffle.localAuthority}
        licenceNumber={raffle.licenceNumber}
      />
    </div>
  );
};
