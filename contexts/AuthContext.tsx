import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { getSession, login as apiLogin, logout as apiLogout, updateProfile as apiUpdateProfile } from '../services/api';
import { isOver18 } from '../utils/formatting';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  isEligible: boolean; // True if 18+ AND GB Resident
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const login = async () => {
    setLoading(true);
    const u = await apiLogin();
    setUser(u);
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    await apiLogout();
    setUser(null);
    setLoading(false);
  };

  const updateUser = async (updates: Partial<UserProfile>) => {
    const updated = await apiUpdateProfile(updates);
    setUser(updated);
  };

  // STRICT Eligibility Check
  const isEligible = !!(
    user && 
    user.dob && isOver18(user.dob) && 
    user.residencyConfirmed === true
  );

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, isEligible }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
