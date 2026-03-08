import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getShellMode } from '../utils/shell';
import { getConfig, isUsingDefaultConfig } from '../utils/config';
import { ComplianceBlock } from './ComplianceBlock';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const shellMode = getShellMode();
  const { user, login, logout } = useAuth();
  const config = getConfig();
  const showDevWarning = isUsingDefaultConfig() && process.env.NODE_ENV !== 'production';

  const navItems = [
    { to: '/draws', label: 'Prize Vault' },
    { to: '/transparency', label: 'Transparency' },
    { to: '/support', label: 'Support' }
  ];

  const NavLink = ({ to, label }: { to: string, label: string }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
          active
            ? 'border-brand-yellow bg-brand-yellow text-brand-dark shadow-lg shadow-brand-yellow/20'
            : 'border-white/10 bg-white/10 text-white hover:border-brand-yellow/40 hover:bg-white/15'
        }`}
      >
        {label}
      </Link>
    );
  };

  const Header = () => (
    <header className="sticky top-0 z-50 border-b border-brand-orange/70 bg-brand-plum/95 text-white shadow-[0_18px_50px_rgba(22,15,34,0.25)] backdrop-blur">
      <div className="h-1 w-full bg-gradient-to-r from-brand-orange via-brand-yellow to-brand-green" />
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-lg font-black text-brand-yellow shadow-lg shadow-black/10">
            MG
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.36em] text-brand-green">Mindful Gaming UK</p>
            <p className="text-sm text-white/70">Prize vault, raffles, and direct support</p>
          </div>
        </Link>

        <div className="hidden items-center gap-3 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} label={item.label} />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a href={config.charityLinks.donationFormUrl} target="_blank" rel="noreferrer" className="hidden sm:block">
            <Button className="bg-brand-yellow text-brand-dark hover:bg-[#efe72c] focus:ring-brand-yellow">
              Donate Instead
            </Button>
          </a>
          {user ? (
            <Link to="/profile" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-black text-white transition hover:bg-white/20">
              <span className="text-xs font-bold">{user.firstName?.charAt(0) || 'U'}</span>
            </Link>
          ) : (
            <button onClick={() => login()} className="text-sm font-bold text-brand-yellow hover:text-white">
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );

  const BigFooter = () => (
    <footer className="mt-auto border-t border-brand-orange/40 bg-brand-dark text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.36em] text-brand-green">Mindful Gaming UK</p>
              <h5 className="mt-3 text-3xl font-black tracking-tight text-brand-yellow">Play with purpose. Give with intent.</h5>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/70">
              Support the charity directly, explore upcoming prizes, and follow each draw as it opens.
            </p>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <ComplianceBlock variant="MINIMAL" />
            </div>
          </div>

          <div>
            <h5 className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-brand-yellow">Direct Support</h5>
            <ul className="space-y-3 text-sm text-white/70">
              <li><a href={config.charityLinks.donationFormUrl} target="_blank" rel="noreferrer" className="transition hover:text-white">Donate through live form</a></li>
              <li><a href={config.charityLinks.donateUrl} target="_blank" rel="noreferrer" className="transition hover:text-white">Donation page</a></li>
              <li><a href={config.charityLinks.donateGamesUrl} target="_blank" rel="noreferrer" className="transition hover:text-white">Donate games and hardware</a></li>
              <li><a href={config.charityLinks.easyFundraisingUrl} target="_blank" rel="noreferrer" className="transition hover:text-white">Easyfundraising</a></li>
            </ul>
          </div>

          <div>
            <h5 className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-brand-yellow">Charity Links</h5>
            <ul className="space-y-3 text-sm text-white/70">
              <li><a href={config.charityLinks.aboutUrl} target="_blank" rel="noreferrer" className="transition hover:text-white">About the charity</a></li>
              <li><a href={config.charityLinks.projectsUrl} target="_blank" rel="noreferrer" className="transition hover:text-white">Help us get started</a></li>
              <li><a href={config.charityLinks.resourcesUrl} target="_blank" rel="noreferrer" className="transition hover:text-white">Resources and articles</a></li>
              <li><a href={config.charityLinks.volunteerUrl} target="_blank" rel="noreferrer" className="transition hover:text-white">Volunteer</a></li>
            </ul>
          </div>

          <div>
            <h5 className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-brand-yellow">Account</h5>
            {user ? (
              <ul className="space-y-3 text-sm text-white/70">
                <li><Link to="/profile" className="transition hover:text-white">Settings</Link></li>
                <li><Link to="/my-entries" className="transition hover:text-white">Ticket wallet</Link></li>
                <li><button onClick={() => logout()} className="transition hover:text-white">Logout</button></li>
              </ul>
            ) : (
              <button onClick={() => login()} className="text-sm font-semibold text-white/70 transition hover:text-white">
                Member login
              </button>
            )}
            <p className="mt-6 text-xs uppercase tracking-[0.24em] text-white/40">Charity no. {config.charityNumber}</p>
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <>
      {showDevWarning && (
        <div className="bg-brand-orange py-1 text-center text-xs font-bold text-white">
           Preview mode: demo data is active.
        </div>
      )}

      {shellMode === 'EMBEDDED' ? (
        <div className="flex min-h-[50vh] flex-col bg-transparent font-sans text-gray-900">
          <div className="sticky top-0 z-40 flex items-center justify-between border-b border-brand-orange/40 bg-brand-plum/95 p-3 text-white backdrop-blur md:hidden">
             <Link to="/" className="flex items-center gap-2 text-sm font-black tracking-[0.24em] text-brand-yellow">
               <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-yellow text-brand-dark">M</span>
               MGUK
             </Link>
             <div className="flex items-center gap-4 text-xs font-medium">
               <Link to="/draws">Vault</Link>
               <a href={config.charityLinks.donationFormUrl} target="_blank" rel="noreferrer">Donate</a>
               {user ? <Link to="/profile">Profile</Link> : <button onClick={() => login()}>Login</button>}
             </div>
          </div>
          
          <main className="mx-auto w-full max-w-6xl flex-grow pb-8 md:px-4 md:py-6 animate-fadeIn">
            {children}
            <div className="mt-12 rounded-3xl border border-brand-dark/10 bg-white/80 p-1">
              <ComplianceBlock variant="MINIMAL" />
            </div>
          </main>
        </div>
      ) : (
        <div className="flex min-h-screen flex-col bg-transparent text-gray-900 font-sans">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <BigFooter />
        </div>
      )}
    </>
  );
};
