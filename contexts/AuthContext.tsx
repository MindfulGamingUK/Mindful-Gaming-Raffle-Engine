import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { getSession, login as apiLogin, logout as apiLogout, updateProfile as apiUpdateProfile } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  isProfileComplete: boolean;
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
    // In real app, this redirects to Wix Login or opens Wix Login Modal
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

  // Profile is complete if DOB and Residency are confirmed
  const isProfileComplete = !!(user && user.dob && user.residencyConfirmed);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, isProfileComplete }}>
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
