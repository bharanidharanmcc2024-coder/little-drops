import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<string, User & { password: string }> = {
  'founder@oldhome.com': {
    id: '1',
    email: 'founder@oldhome.com',
    password: 'founder123',
    name: 'Dr. Ramesh Kumar',
    role: 'founder',
    createdAt: new Date('2020-01-01'),
  },
  'trustee@oldhome.com': {
    id: '2',
    email: 'trustee@oldhome.com',
    password: 'trustee123',
    name: 'Mrs. Lakshmi Devi',
    role: 'trustee',
    createdAt: new Date('2021-03-15'),
  },
  'staff@oldhome.com': {
    id: '3',
    email: 'staff@oldhome.com',
    password: 'staff123',
    name: 'Ravi Shankar',
    role: 'staff',
    isHigherAuthority: true,
    createdAt: new Date('2022-06-01'),
  },
  'staff2@oldhome.com': {
    id: '4',
    email: 'staff2@oldhome.com',
    password: 'staff123',
    name: 'Priya Sharma',
    role: 'staff',
    isHigherAuthority: false,
    createdAt: new Date('2023-01-10'),
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    const mockUser = mockUsers[email.toLowerCase()];
    
    if (mockUser && mockUser.password === password && mockUser.role === role) {
      const { password: _, ...userWithoutPassword } = mockUser;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
