
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  businessName?: string;
  businessType?: string;
  onboardingComplete?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('bizlaunch_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists in localStorage from registration
    const existingUsers = JSON.parse(localStorage.getItem('bizlaunch_users') || '[]');
    const existingUser = existingUsers.find((u: any) => u.email === email);
    
    const mockUser: User = {
      id: '1',
      email,
      name: existingUser ? existingUser.name : 'User', // Use existing name or fallback
      businessName: existingUser?.businessName || 'Tech Solutions Inc',
      businessType: existingUser?.businessType || 'Technology',
      onboardingComplete: existingUser?.onboardingComplete || true
    };
    
    setUser(mockUser);
    localStorage.setItem('bizlaunch_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const register = async (email: string, password: string, name: string) => {
    // Simulate API call
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      email,
      name, // Use the actual name provided during registration
      onboardingComplete: false
    };
    
    // Store user data for future login
    const existingUsers = JSON.parse(localStorage.getItem('bizlaunch_users') || '[]');
    const updatedUsers = existingUsers.filter((u: any) => u.email !== email);
    updatedUsers.push(mockUser);
    localStorage.setItem('bizlaunch_users', JSON.stringify(updatedUsers));
    
    setUser(mockUser);
    localStorage.setItem('bizlaunch_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const loginWithGoogle = async () => {
    // Simulate Google OAuth
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: '1',
      email: 'user@gmail.com',
      name: 'Google User', // More generic name for Google login
      onboardingComplete: false
    };
    
    setUser(mockUser);
    localStorage.setItem('bizlaunch_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bizlaunch_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('bizlaunch_user', JSON.stringify(updatedUser));
      
      // Also update in the users list
      const existingUsers = JSON.parse(localStorage.getItem('bizlaunch_users') || '[]');
      const updatedUsers = existingUsers.map((u: any) => 
        u.email === user.email ? updatedUser : u
      );
      localStorage.setItem('bizlaunch_users', JSON.stringify(updatedUsers));
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    loginWithGoogle,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
