import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Using HashRouter in App
import { Raffle } from '../types';
import { fetchRaffleById, initiateCheckout } from '../services/api';
import { Button } from '../components/Button';
import { AgeGate } from '../components/AgeGate';
import { ComplianceFooter } from '../components/ComplianceFooter';

export const RaffleDetail: React.FC = () => {
  // In a real router setup, we'd extract ID from params. 
  // For this scaffold, we'll just load the mock raffle.
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Cart State
  const [quantity, setQuantity] = useState(1);
  
  // User Form State
  const [dob, setDob] = useState('');
  const [isOver18, setIsOver18] = useState(false);
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRaffleById('mock_id').then(data => {
      setRaffle(data || null);
      setLoading(false);
    });
  }, []);

  const handleBuy = async () => {
    if (!raffle) return;
    setSubmitting(true);
    try {
      const result = await initiateCheckout(raffle._id, quantity, { email, dob });
      // In a real app, this redirects to Stripe
      alert(`Redirecting to Stripe: ${result.checkoutUrl}\nTotal: £${(quantity * raffle.ticketPrice).toFixed(2)}`);
    } catch (err) {
      alert('Error initiating checkout');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12">Loading Raffle...</div>;
  if (!raffle) return <div className="text-center p-12">Raffle not found.</div>;

  const totalCost = (quantity * raffle.ticketPrice).toFixed(2);
  const percentSold = Math.min(100, (raffle.soldTickets / raffle.maxTickets) * 100);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 bg-white shadow-xl rounded-xl my-8">
      
      {/* Header Image */}
      <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-6">
        <img src={raffle.imageUrl} alt={raffle.title} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-brand-teal text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
          £{raffle.ticketPrice.toFixed(2)} / entry
        </div>
      </div>

      {/* Title & Stats */}
      <h1 className="text-3xl font-bold text-brand-dark mb-2">{raffle.title}</h1>
      
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
        <span>Closes: {new Date(raffle.closeDate).toLocaleDateString()}</span>
        <span>Draws: {new Date(raffle.drawDate).toLocaleDateString()}</span>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
          <span>{raffle.soldTickets} tickets sold</span>
          <span>{raffle.maxTickets} max</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-brand-purple h-2.5 rounded-full transition-all duration-500" style={{ width: `${percentSold}%` }}></div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Description Column */}
        <div>
          <h2 className="text-lg font-bold text-brand-dark mb-3">About the Prize</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            {raffle.description}
          </p>
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-sm text-blue-800">
            <strong>Note:</strong> All net proceeds from this raffle go directly to support Mindful Gaming UK's charitable mission. 
          </div>
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 text-xs text-gray-500 rounded">
            <strong>Important:</strong> Ticket purchases are NOT eligible for Gift Aid as they are considered a payment for the chance to win a prize, not a pure donation.
          </div>
        </div>

        {/* Purchase Column */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold text-brand-dark mb-4">Enter Now</h2>
          
          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Tickets</label>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
              >-</button>
              <span className="text-xl font-bold w-12 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(100, quantity + 1))}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
              >+</button>
            </div>
            <div className="mt-2 text-right text-lg font-bold text-brand-purple">
              Total: £{totalCost}
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-4 mb-6">
             <div>
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-brand-purple focus:outline-none"
                placeholder="Where to send your ticket"
              />
             </div>
             
             <AgeGate 
               dob={dob} 
               onDobChange={setDob} 
               onVerified={setIsOver18} 
             />

             <div className="flex items-start gap-2">
               <input 
                 type="checkbox" 
                 id="terms" 
                 checked={agreed} 
                 onChange={(e) => setAgreed(e.target.checked)}
                 className="mt-1 h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded"
               />
               <label htmlFor="terms" className="text-xs text-gray-600">
                 I agree to the Terms & Conditions and certify I am a resident of Great Britain. I understand this is a form of gambling.
               </label>
             </div>
          </div>

          <Button 
            className="w-full"
            isLoading={submitting}
            onClick={handleBuy}
            disabled={!isOver18 || !email || !agreed || quantity < 1}
          >
            Pay £{totalCost}
          </Button>
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
