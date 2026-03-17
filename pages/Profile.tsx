import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { isOver18 } from '../utils/formatting';

export const Profile: React.FC = () => {
  const { user, loading, login, updateUser, isEligible } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [excludeConfirm, setExcludeConfirm] = useState(false);
  const [excluding, setExcluding] = useState(false);

  // Form state
  const [dob, setDob] = useState('');
  const [residencyConfirmed, setResidencyConfirmed] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [spendingLimit, setSpendingLimit] = useState<number | ''>('');

  useEffect(() => {
    if (user) {
      setDob(user.dob || '');
      setResidencyConfirmed(user.residencyConfirmed || false);
      setMarketing(user.marketingConsent || false);
      setSpendingLimit(user.spendingLimitMonthly || '');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-pulse text-brand-plum text-sm font-semibold">
        Loading profile…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="rounded-[28px] border border-brand-dark/10 bg-white/90 p-8 shadow-[0_16px_60px_rgba(40,26,57,0.08)]">
          <h2 className="text-xl font-black text-brand-plum mb-2">Member area</h2>
          <p className="text-sm text-slate-500 mb-6 leading-6">
            Log in to view your profile, check your tickets, and manage your account settings.
          </p>
          <Button onClick={login} className="w-full">Log In</Button>
        </div>
      </div>
    );
  }

  const isCurrentlyExcluded = !!(
    user.selfExclusionEndDate && new Date(user.selfExclusionEndDate) > new Date()
  );

  const dobConfirmed = !!(user.dob && isOver18(user.dob));
  const residencyOk = !!user.residencyConfirmed;
  const profileComplete = dobConfirmed && residencyOk;

  const eligibilityBadge = isCurrentlyExcluded
    ? { label: 'Self-excluded', className: 'bg-red-100 text-red-800 border border-red-200' }
    : profileComplete
    ? { label: 'Eligible to enter', className: 'bg-green-100 text-green-800 border border-green-200' }
    : { label: 'Complete your profile', className: 'bg-amber-100 text-amber-800 border border-amber-200' };

  const handleSelfExclude = async () => {
    setExcluding(true);
    try {
      const end = new Date();
      end.setMonth(end.getMonth() + 6);
      await updateUser({ selfExclusionEndDate: end.toISOString() });
      setExcludeConfirm(false);
    } catch (e) {
      console.error('Self-exclusion failed', e);
    } finally {
      setExcluding(false);
    }
  };

  const handleSave = async () => {
    if (dob && !isOver18(dob)) {
      alert('Date of birth indicates you are under 18.');
      return;
    }
    setSaving(true);
    try {
      await updateUser({
        dob,
        residencyConfirmed,
        termsAcceptedAt: residencyConfirmed ? new Date().toISOString() : user.termsAcceptedAt,
        marketingConsent: marketing,
        spendingLimitMonthly: spendingLimit === '' ? undefined : Number(spendingLimit),
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setDob(user.dob || '');
      setResidencyConfirmed(user.residencyConfirmed || false);
      setMarketing(user.marketingConsent || false);
      setSpendingLimit(user.spendingLimitMonthly || '');
    }
    setEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">

      {/* Identity summary */}
      <div className="rounded-[28px] border border-brand-dark/10 bg-white/95 shadow-[0_16px_60px_rgba(40,26,57,0.08)] overflow-hidden">
        <div className="bg-brand-plum/5 border-b border-brand-dark/10 px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-plum text-white text-lg font-black">
              {user.firstName?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-black text-brand-plum">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
            </div>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${eligibilityBadge.className}`}>
            {eligibilityBadge.label}
          </span>
        </div>

        {/* Profile completeness */}
        <div className="px-6 py-5 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">Profile Completeness</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border text-sm ${dobConfirmed ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
              <span className={`text-base ${dobConfirmed ? 'text-green-600' : 'text-amber-500'}`}>
                {dobConfirmed ? '✓' : '○'}
              </span>
              <div>
                <p className={`font-semibold text-xs ${dobConfirmed ? 'text-green-800' : 'text-amber-800'}`}>
                  Date of birth
                </p>
                <p className={`text-xs ${dobConfirmed ? 'text-green-600' : 'text-amber-600'}`}>
                  {dobConfirmed ? 'Confirmed — 18+' : 'Not confirmed'}
                </p>
              </div>
              {!dobConfirmed && !editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="ml-auto text-xs font-bold text-amber-700 hover:underline"
                >
                  Add
                </button>
              )}
            </div>

            <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border text-sm ${residencyOk ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
              <span className={`text-base ${residencyOk ? 'text-green-600' : 'text-amber-500'}`}>
                {residencyOk ? '✓' : '○'}
              </span>
              <div>
                <p className={`font-semibold text-xs ${residencyOk ? 'text-green-800' : 'text-amber-800'}`}>
                  UK residency
                </p>
                <p className={`text-xs ${residencyOk ? 'text-green-600' : 'text-amber-600'}`}>
                  {residencyOk ? 'GB resident confirmed' : 'Not confirmed'}
                </p>
              </div>
              {!residencyOk && !editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="ml-auto text-xs font-bold text-amber-700 hover:underline"
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit form — shown when editing is active */}
      {editing && (
        <div className="rounded-[28px] border border-brand-plum/20 bg-white/95 shadow-[0_8px_40px_rgba(40,26,57,0.08)] px-6 py-5 space-y-4 animate-fadeIn">
          <h3 className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">Edit Profile</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-plum focus:border-brand-plum"
              />
            </div>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-brand-plum/20 bg-brand-mist/60 cursor-pointer hover:bg-brand-mist">
              <input
                type="checkbox"
                checked={residencyConfirmed}
                onChange={(e) => setResidencyConfirmed(e.target.checked)}
                className="mt-1 h-4 w-4 rounded text-brand-plum"
              />
              <span className="text-xs text-slate-700 leading-5">
                I confirm I am a resident of Great Britain and am 18 or over.
              </span>
            </label>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Monthly Spend Limit (£) <span className="font-normal text-slate-400">— optional</span>
              </label>
              <input
                type="number"
                min="1"
                value={spendingLimit}
                onChange={(e) => setSpendingLimit(e.target.value ? parseInt(e.target.value) : '')}
                placeholder="No limit set"
                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-plum"
              />
              <p className="mt-1 text-[10px] text-slate-400">
                Set a voluntary limit to help manage your play.
              </p>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="h-4 w-4 rounded text-brand-plum"
              />
              <span className="text-xs text-slate-600">I agree to receive marketing emails from Mindful Gaming UK.</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} isLoading={saving} className="flex-1">Save Changes</Button>
            <Button variant="secondary" onClick={handleCancel} className="flex-1">Cancel</Button>
          </div>
        </div>
      )}

      {/* Wallet summary */}
      <div className="rounded-[28px] border border-brand-dark/10 bg-white/90 shadow-[0_8px_30px_rgba(40,26,57,0.06)] px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">Ticket Wallet</h3>
          <Link
            to="/my-entries"
            className="text-xs font-bold text-brand-plum hover:underline"
          >
            View all entries
          </Link>
        </div>
        <p className="text-sm text-slate-600 leading-6">
          All your confirmed ticket entries are stored in your wallet. Check your entries to see ticket
          numbers and draw dates.
        </p>
        <Link
          to="/my-entries"
          className="mt-4 inline-flex rounded-full border border-brand-plum px-4 py-2 text-xs font-bold text-brand-plum transition hover:bg-brand-plum hover:text-white"
        >
          View My Tickets
        </Link>
      </div>

      {/* Self-exclusion */}
      <div className="rounded-[28px] border border-red-200 bg-red-50/60 px-6 py-5 space-y-4">
        <h3 className="font-bold text-red-800 text-sm">Responsible Gaming</h3>
        <p className="text-xs text-red-700 leading-5 max-w-xl">
          If you feel you need a break, you can self-exclude for 6 months. This prevents you from
          entering any draws. You can contact us to discuss your account at any time.
        </p>

        {isCurrentlyExcluded ? (
          <div className="rounded-xl border border-red-200 bg-white/60 p-4 space-y-2">
            <p className="text-xs font-bold text-red-700">
              Self-exclusion active until{' '}
              {new Date(user.selfExclusionEndDate!).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <p className="text-xs text-red-600 leading-5">
              You cannot enter any draws during this period. To discuss your account, email{' '}
              <a href="mailto:info@mindfulgaminguk.org" className="underline">
                info@mindfulgaminguk.org
              </a>
              .
            </p>
          </div>
        ) : !excludeConfirm ? (
          <button
            onClick={() => setExcludeConfirm(true)}
            className="rounded-full border border-red-300 bg-white px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
          >
            Request self-exclusion
          </button>
        ) : (
          <div className="rounded-xl border border-red-200 bg-white/60 p-4 space-y-3">
            <p className="text-xs text-red-800 font-medium leading-5">
              This will prevent you from entering any draw until{' '}
              <strong>
                {(() => {
                  const d = new Date();
                  d.setMonth(d.getMonth() + 6);
                  return d.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  });
                })()}
              </strong>
              . This cannot be reversed through the app.
            </p>
            <div className="flex gap-3">
              <Button variant="danger" onClick={handleSelfExclude} isLoading={excluding}>
                Confirm Exclusion
              </Button>
              <Button variant="secondary" onClick={() => setExcludeConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="rounded-[28px] border border-brand-dark/10 bg-white/80 px-6 py-5">
        <h3 className="text-xs font-black uppercase tracking-[0.28em] text-slate-400 mb-4">Quick Links</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link
            to="/"
            className="flex flex-col items-center gap-1.5 rounded-xl border border-brand-dark/10 bg-brand-mist/60 px-3 py-4 text-center text-xs font-bold text-brand-plum transition hover:bg-brand-mist"
          >
            <span className="text-base">🎮</span>
            Live Draws
          </Link>
          <Link
            to="/winners"
            className="flex flex-col items-center gap-1.5 rounded-xl border border-brand-dark/10 bg-brand-mist/60 px-3 py-4 text-center text-xs font-bold text-brand-plum transition hover:bg-brand-mist"
          >
            <span className="text-base">🏆</span>
            Winners
          </Link>
          <a
            href="https://www.mindfulgaminguk.org/lottery-rules"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-1.5 rounded-xl border border-brand-dark/10 bg-brand-mist/60 px-3 py-4 text-center text-xs font-bold text-brand-plum transition hover:bg-brand-mist"
          >
            <span className="text-base">📋</span>
            Rules
          </a>
          <a
            href="mailto:info@mindfulgaminguk.org"
            className="flex flex-col items-center gap-1.5 rounded-xl border border-brand-dark/10 bg-brand-mist/60 px-3 py-4 text-center text-xs font-bold text-brand-plum transition hover:bg-brand-mist"
          >
            <span className="text-base">✉️</span>
            Support
          </a>
        </div>
      </div>

      {/* Edit toggle (non-editing state) */}
      {!editing && (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={() => setEditing(true)}>
            Edit Profile Details
          </Button>
        </div>
      )}

      {/* Wix account link */}
      <div className="text-center">
        <a
          href="https://www.mindfulgaminguk.org/account"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-slate-400 hover:text-brand-plum transition"
        >
          Manage full Wix account &rarr;
        </a>
      </div>
    </div>
  );
};
