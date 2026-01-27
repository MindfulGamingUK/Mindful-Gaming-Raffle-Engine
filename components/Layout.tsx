import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const NavLink = ({ to, label }: { to: string, label: string }) => (
    <Link 
      to={to} 
      className={`text-sm font-medium transition-colors ${location.pathname === to ? 'text-brand-purple' : 'text-gray-600 hover:text-brand-purple'}`}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-purple rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-lg tracking-tight text-gray-900">Mindful Gaming</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/draws" label="All Draws" />
            <NavLink to="/transparency" label="Transparency" />
            <NavLink to="/my-entries" label="My Entries" />
            <Link to="/profile" className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-gray-200">
              <span className="text-xs font-bold text-gray-600">ME</span>
            </Link>
          </div>
          
          {/* Mobile Menu Button (Placeholder) */}
          <div className="md:hidden">
             <Link to="/draws" className="text-brand-purple font-bold text-sm">Browse</Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-brand-dark text-gray-400 py-12 text-sm">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h5 className="text-white font-bold mb-4">Mindful Gaming UK</h5>
            <p className="mb-4">Registered Charity No. 1212285.</p>
            <p className="text-xs leading-relaxed opacity-75">
              Mindful Gaming UK is licensed by Birmingham City Council under the Gambling Act 2005. 
              Small Society Lottery Registration No: 1212285. 
              This website allows the purchase of raffle tickets. This is a form of gambling.
              <br/><strong>Entries are NOT charitable donations and are not Gift Aid eligible.</strong>
            </p>
          </div>
          <div>
            <h5 className="text-white font-bold mb-4">Support</h5>
            <ul className="space-y-2">
              <li><Link to="/transparency" className="hover:text-white">Where funds go</Link></li>
              <li><Link to="/support" className="hover:text-white">Contact Us</Link></li>
              <li><a href="https://www.begambleaware.org" target="_blank" className="hover:text-white underline decoration-yellow-500">BeGambleAware.org</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-4">Account</h5>
            <ul className="space-y-2">
              <li><Link to="/profile" className="hover:text-white">Settings & Limits</Link></li>
              <li><Link to="/my-entries" className="hover:text-white">Ticket Wallet</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-xs">
          <p>&copy; 2025 Mindful Gaming UK. 18+ Only. Please Play Responsibly.</p>
        </div>
      </footer>
    </div>
  );
};
