import React from 'react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatting';

export const Transparency: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">Financial Transparency</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We operate with open books. Here is exactly how ticket revenue is allocated.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 mb-12">
        <div className="p-8 md:p-12">
            <h2 className="text-xl font-bold mb-8 text-center">Allocation per Ticket (Average)</h2>
            
            <div className="space-y-8">
                {/* Charitable Purpose */}
                <div className="relative">
                    <div className="flex justify-between items-end mb-2">
                        <span className="font-bold text-brand-purple text-lg">Net Proceeds (Charitable Purpose)</span>
                        <span className="font-bold text-xl">60%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-6">
                        <div className="bg-brand-purple h-6 rounded-full flex items-center justify-end px-3 text-white text-xs font-bold" style={{ width: '60%' }}>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Applied directly to Gaming Disorder awareness campaigns and therapy support services.
                    </p>
                </div>

                {/* Prizes */}
                <div className="relative">
                    <div className="flex justify-between items-end mb-2">
                        <span className="font-bold text-gray-700 text-lg">Prizes & Operations</span>
                        <span className="font-bold text-xl">25%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-6">
                        <div className="bg-brand-teal h-6 rounded-full flex items-center justify-end px-3 text-white text-xs font-bold" style={{ width: '25%' }}>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Covers the cost of hardware, shipping, insurance, and platform hosting.
                    </p>
                </div>

                {/* Admin */}
                <div className="relative">
                    <div className="flex justify-between items-end mb-2">
                        <span className="font-bold text-gray-500 text-lg">Transaction Fees & Audits</span>
                        <span className="font-bold text-xl">15%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-6">
                        <div className="bg-gray-400 h-6 rounded-full flex items-center justify-end px-3 text-white text-xs font-bold" style={{ width: '15%' }}>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Payment gateway fees (Stripe/PayPal), legal compliance, and annual audits.
                    </p>
                </div>
            </div>
        </div>
        <div className="bg-gray-50 p-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>
                Mindful Gaming UK is a registered charity (No. 1212285). 
                Financial returns are submitted annually to the Charity Commission and Birmingham City Council.
            </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-blue-50 p-8 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-900 text-xl mb-3">Important Notice</h3>
            <p className="text-blue-800 mb-4 text-sm leading-relaxed">
                Participation in a raffle is a gambling activity. Therefore, the purchase of a ticket is <strong>not a donation</strong> and is <strong>not eligible for Gift Aid</strong>. 
                We cannot claim tax relief on your entry fee.
            </p>
        </div>
        <div className="bg-white p-8 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-900 text-xl mb-3">Have Questions?</h3>
            <p className="text-gray-600 mb-4 text-sm">
                We are happy to answer any questions about our financial structure or lottery licence.
            </p>
            <a href="mailto:trustees@mindfulgaming.uk" className="text-brand-purple font-bold hover:underline">Contact the Trustees</a>
        </div>
      </div>

      <div className="mt-12 text-center">
          <Link to="/draws">
            <Button>View Active Draws</Button>
          </Link>
      </div>
    </div>
  );
};
