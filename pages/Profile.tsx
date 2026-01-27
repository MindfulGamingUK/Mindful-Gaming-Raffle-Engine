import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';

export const Profile: React.FC = () => {
  const { user, loading, login, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  
  // Form State
  const [marketing, setMarketing] = useState(false);
  const [spendingLimit, setSpendingLimit] = useState<number | ''>('');

  useEffect(() => {
    if (user) {
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
    await updateUser({
      marketingConsent: marketing,
      spendingLimitMonthly: spendingLimit === '' ? undefined : Number(spendingLimit)
    });
    setEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold text-brand-dark mb-6">Account Settings</h1>

      {/* Identity Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
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
          <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded border border-green-200">
            Active
          </span>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-8">
          {/* Eligibility Column */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Eligibility Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">18+ Age Verified</span>
                <span className={`text-sm font-bold ${user.dob ? 'text-green-600' : 'text-orange-500'}`}>
                  {user.dob ? '✓ Verified' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">GB Resident</span>
                <span className={`text-sm font-bold ${user.residencyConfirmed ? 'text-green-600' : 'text-orange-500'}`}>
                  {user.residencyConfirmed ? '✓ Confirmed' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Preferences Column */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Spending Limit (£)</label>
                <input 
                  type="number" 
                  value={spendingLimit}
                  onChange={(e) => setSpendingLimit(e.target.value ? parseInt(e.target.value) : '')}
                  disabled={!editing}
                  placeholder="No limit"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-purple disabled:bg-gray-100"
                />
              </div>
              <div className="flex items-center gap-3">
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
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
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

      {/* Responsible Gaming Zone */}
      <div className="border border-red-200 bg-red-50 rounded-xl p-6">
        <h3 className="text-red-800 font-bold mb-2">Responsible Gaming</h3>
        <p className="text-sm text-red-700 mb-4 max-w-2xl">
          Mindful Gaming UK is committed to safe play. If you feel you need a break, you can trigger a self-exclusion period. 
          This will prevent you from entering any draws for 6 months.
        </p>
        <Button variant="danger" onClick={() => alert('Self-exclusion confirmation would appear here.')}>
          Self-Exclude for 6 Months
        </Button>
      </div>
    </div>
  );
};