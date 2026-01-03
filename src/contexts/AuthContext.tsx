import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, phoneNumber: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (data && !error) {
          setUser(data);
        } else {
          localStorage.removeItem('userId');
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    // Try login with username first
    let { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    // If not found by username, try phone number
    if (!data) {
      const result = await supabase
        .from('users')
        .select('*')
        .eq('phone_number', username)
        .maybeSingle();
      data = result.data;
      error = result.error;
    }

    if (error || !data) {
      throw new Error('Username/Nomor telepon tidak ditemukan / Username/Phone number not found');
    }

    if (data.password_hash !== password) {
      throw new Error('Password salah / Wrong password');
    }

    setUser(data);
    localStorage.setItem('userId', data.id);
  };

  const signup = async (username: string, phoneNumber: string, password: string) => {
    const { data: existingUser } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (existingUser) {
      throw new Error('Username sudah digunakan / Username already taken');
    }

    const { data: existingPhone } = await supabase
      .from('users')
      .select('phone_number')
      .eq('phone_number', phoneNumber)
      .maybeSingle();

    if (existingPhone) {
      throw new Error('Nomor telepon sudah digunakan / Phone number already taken');
    }

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username,
          phone_number: phoneNumber,
          password_hash: password,
          is_admin: false
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    setUser(data);
    localStorage.setItem('userId', data.id);
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
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