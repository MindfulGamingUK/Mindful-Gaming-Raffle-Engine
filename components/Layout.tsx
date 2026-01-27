import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getShellMode } from '../utils/shell';
import { ComplianceFooter } from './ComplianceFooter';
import { useAuth } from '../contexts/AuthContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const shellMode = getShellMode();
  const { user, login, logout } = useAuth();
  
  const NavLink = ({ to, label }: { to: string, label: string }) => (
    <Link 
      to={to} 
      className={`text-sm font-medium transition-colors ${location.pathname === to ? 'text-brand-purple' : 'text-gray-600 hover:text-brand-purple'}`}
    >
      {label}
    </Link>
  );

  const Header = () => (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-purple rounded-lg flex items-center justify-center text-white font-bold">M</div>
          <span className="font-bold text-lg tracking-tight text-gray-900">Mindful Gaming</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/draws" label="Draws" />
          <NavLink to="/transparency" label="Transparency" />
          {user ? (
            <>
              <NavLink to="/my-entries" label="My Entries" />
              <Link to="/profile" className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center hover:bg-teal-600 transition">
                <span className="text-xs font-bold">{user.firstName?.charAt(0) || 'U'}</span>
              </Link>
            </>
          ) : (
            <button onClick={() => login()} className="text-sm font-bold text-brand-purple hover:underline">
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );

  const BigFooter = () => (
    <footer className="bg-brand-dark text-gray-400 py-12 text-sm mt-auto">
      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <h5 className="text-white font-bold mb-4">Mindful Gaming UK</h5>
          <p className="mb-4">Registered Charity No. 1212285.</p>
          <ComplianceFooter mode="STANDALONE" />
        </div>
        <div>
          <h5 className="text-white font-bold mb-4">Support</h5>
          <ul className="space-y-2">
            <li><Link to="/transparency" className="hover:text-white">Where funds go</Link></li>
            <li><a href="https://www.begambleaware.org" target="_blank" className="hover:text-white">BeGambleAware.org</a></li>
          </ul>
        </div>
        <div>
          <h5 className="text-white font-bold mb-4">Account</h5>
          {user ? (
             <ul className="space-y-2">
              <li><Link to="/profile" className="hover:text-white">Settings</Link></li>
              <li><button onClick={() => logout()} className="hover:text-white">Logout</button></li>
             </ul>
          ) : (
             <button onClick={() => login()} className="hover:text-white">Member Login</button>
          )}
        </div>
      </div>
    </footer>
  );

  // EMBEDDED MODE: Minimal chrome, relies on Wix Site Header/Footer
  if (shellMode === 'EMBEDDED') {
    return (
      <div className="min-h-[50vh] flex flex-col bg-transparent font-sans text-gray-900">
        <div className="bg-gray-100/50 border-b border-gray-200 p-3 flex justify-between items-center md:hidden">
           {/* Mobile mini-nav for embedded */}
           <Link to="/" className="font-bold text-brand-purple">MGUK Raffles</Link>
           <div className="flex gap-3 text-sm">
             <Link to="/draws">All Draws</Link>
             {user ? <Link to="/profile">Profile</Link> : <button onClick={() => login()}>Login</button>}
           </div>
        </div>
        <main className="flex-grow w-full max-w-5xl mx-auto md:px-4 md:py-6">
          {children}
          <ComplianceFooter mode="EMBEDDED" />
        </main>
      </div>
    );
  }

  // STANDALONE MODE: Full app experience
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <BigFooter />
    </div>
  );
};