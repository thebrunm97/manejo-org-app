// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('supabase.auth.token'));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setAuthToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setAuthToken(session.access_token);
        setUser(session.user);
      }
      setIsLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthToken(session?.access_token ?? null);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    navigate('/');
    return data;
  };

  // =======================================================
  // ||             INÍCIO DAS NOVAS FUNÇÕES              ||
  // =======================================================

  const signUp = async (email, password, profileData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: profileData,
      }
    });
    if (error) throw error;
    return data;
  };

  const socialLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider, // 'google', 'facebook', etc.
    });
    if (error) throw error;
  };

  // =======================================================
  // ||               FIM DAS NOVAS FUNÇÕES                 ||
  // =======================================================

  const value = {
    authToken,
    user,
    isLoading,
    login,
    logout,
    signUp, // <-- Expondo no contexto
    loginWithGoogle: () => socialLogin('google'), // <-- Criando atalhos
    loginWithFacebook: () => socialLogin('facebook'),
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}