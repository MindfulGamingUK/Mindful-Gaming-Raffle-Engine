import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { isOver18 } from '../utils/formatting';

export const Profile: React.FC = () => {
  const { user, loading, login, updateUser, isEligible } = useAuth();
  const [editing, setEditing] = useState(false);
  
  // Form State
  const [dob, setDob] = useState('');
  const [marketing, setMarketing] = useState(false);
  const [spendingLimit, setSpendingLimit] = useState<number | ''>('');
  
  useEffect(() => {
    if (user) {
      setDob(user.dob || '');
      setMarketing(user.marketingConsent || false);
      setSpendingLimit(user.spendingLimitMonthly || '');
    }
  }, [user]);

  if (loading) return <div className="p-12 text-center animate-pulse text-brand-purple">Loading Profile...</div>;
  
  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-xl shadow text-center border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Member Access</h2>
        <p className="text-gray-500 mb-6">Please log in to manage your tickets and settings.</p>
        <Button onClick={login}>Log In with Wix</Button>
      </div>
    );
  }

  const handleSave = async () => {
    // Only allow save if 18+ valid
    if (dob && !isOver18(dob)) {
      alert("Date of birth indicates you are under 18.");
      return;
    }
    
    await updateUser({
      dob,
      marketingConsent: marketing,
      spendingLimitMonthly: spendingLimit === '' ? undefined : Number(spendingLimit)
      // Note: We do NOT allow un-setting residencyConfirmed here via UI to prevent accidents,
      // but strictly it's a one-way gate in the purchase flow usually.
    });
    setEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold text-brand-dark mb-6">Account Settings</h1>

      {/* Identity Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-purple text-white flex items-center justify-center text-lg font-bold">
              {user.firstName ? user.firstName[0] : 'U'}
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${isEligible ? 'bg-green-100 text-green-800 border-green-200' : 'bg-orange-100 text-orange-800 border-orange-200'}`}>
            {isEligible ? 'Verified for Entry' : 'Action Required'}
          </span>
        </div>

        <div className="p-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">Compliance & Eligibility</h3>
          
          <div className="grid md:grid-cols-2 gap-8 mb-6">
             <div className="space-y-4">
                <div>
                   <label className="block text-xs font-bold text-gray-700 mb-1">Date of Birth</label>
                   <input 
                      type="date" 
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      disabled={!editing}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-purple disabled:bg-gray-50 disabled:text-gray-500"
                   />
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100">
                    <span className="text-sm text-gray-700">Residency Status</span>
                    <span className={`text-sm font-bold ${user.residencyConfirmed ? 'text-green-600' : 'text-gray-400'}`}>
                        {user.residencyConfirmed ? 'GB Resident Confirmed' : 'Not Confirmed'}
                    </span>
                </div>
             </div>
             
             <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Spend Limit (£)</label>
                    <input 
                      type="number" 
                      value={spendingLimit}
                      onChange={(e) => setSpendingLimit(e.target.value ? parseInt(e.target.value) : '')}
                      disabled={!editing}
                      placeholder="No limit"
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-purple disabled:bg-gray-50"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Optional tool to manage your play.</p>
                 </div>
                 
                 <div className="flex items-center gap-3 pt-2">
                    <input 
                      type="checkbox" 
                      id="marketing"
                      checked={marketing}
                      onChange={(e) => setMarketing(e.target.checked)}
                      disabled={!editing}
                      className="w-4 h-4 text-brand-purple rounded"
                    />
                    <label htmlFor="marketing" className="text-sm text-gray-600">
                      I agree to receive marketing emails
                    </label>
                 </div>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
             {editing ? (
                <>
                   <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
                   <Button onClick={handleSave}>Save Changes</Button>
                </>
             ) : (
                <Button variant="secondary" onClick={() => setEditing(true)}>Edit Details</Button>
             )}
          </div>
        </div>
      </div>

      {/* Responsible Gaming Zone */}
      <div className="border border-red-200 bg-red-50/50 rounded-xl p-6">
        <h3 className="text-red-800 font-bold mb-2">Responsible Gaming</h3>
        <p className="text-sm text-red-700 mb-4 max-w-2xl leading-relaxed">
          Mindful Gaming UK is committed to safe play. If you feel you need a break, you can trigger a self-exclusion period. 
          This will prevent you from entering any draws for 6 months. This action cannot be undone.
        </p>
        <Button variant="danger" onClick={() => alert('Self-exclusion flow would start here.')}>
          Self-Exclude for 6 Months
        </Button>
      </div>
    </div>
  );
};
