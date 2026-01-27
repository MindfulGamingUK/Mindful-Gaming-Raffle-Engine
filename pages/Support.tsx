import React from 'react';
import { getConfig } from '../utils/config';

export const Support: React.FC = () => {
  const config = getConfig();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-dark mb-2">Support Centre</h1>
      <p className="text-gray-500 mb-10">Common questions and how to get in touch.</p>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
         <div className="md:col-span-2 space-y-4">
            <h2 className="font-bold text-xl text-gray-900 mb-4">Frequently Asked Questions</h2>
            
            <div className="border border-gray-200 rounded-lg p-5">
               <h3 className="font-bold text-gray-900 mb-2">Is this a real charity lottery?</h3>
               <p className="text-sm text-gray-600">
                 Yes. Mindful Gaming UK is a registered charity (No. {config.charityNumber}). 
                 We operate as a Small Society Lottery registered with {config.localAuthorityName} (Ref: {config.lotteryRegistrationRef}).
               </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-5">
               <h3 className="font-bold text-gray-900 mb-2">How are winners selected?</h3>
               <p className="text-sm text-gray-600">Winners are chosen at random using a cryptographically secure random number generator (RNG) on the draw date specified. We do not use skill-based questions to filter entrants.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-5">
               <h3 className="font-bold text-gray-900 mb-2">Can I claim Gift Aid?</h3>
               <p className="text-sm text-gray-600">No. Purchases of raffle tickets are considered gambling transactions, not donations, and are not eligible for Gift Aid tax relief.</p>
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-brand-purple text-white p-6 rounded-xl shadow-lg">
               <h3 className="font-bold text-lg mb-2">Need Help?</h3>
               <p className="text-purple-100 text-sm mb-4">Our team is available Mon-Fri, 9am-5pm.</p>
               <a href="mailto:support@mindfulgaming.uk" className="inline-block bg-white text-brand-purple font-bold px-4 py-2 rounded hover:bg-gray-100 transition">
                  Email Us
               </a>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
               <h3 className="font-bold text-gray-900 mb-2">Safer Gambling</h3>
               <p className="text-sm text-gray-600 mb-4">If you are concerned about your gambling, help is available.</p>
               <a href="https://www.begambleaware.org" target="_blank" className="text-brand-purple font-bold text-sm hover:underline">Visit BeGambleAware.org &rarr;</a>
            </div>
         </div>
      </div>
      
      <div className="text-center text-xs text-gray-400 bg-gray-50 p-4 rounded-lg">
         Disclaimer: The "Mindful Moments" provided on this site are for informational and awareness purposes only. 
         They do not constitute medical advice or diagnosis. If you are struggling with your mental health, please contact a professional.
      </div>
    </div>
  );
};