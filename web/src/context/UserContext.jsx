'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

const TOKEN_KEY = 'sva_user_token';
// Marca que o login acabou de acontecer, pra Home mostrar o convite de
// doação uma única vez — a Home consome (lê e apaga) essa flag ao montar.
const JUST_LOGGED_IN_KEY = 'sva_just_logged_in';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async (currentToken) => {
    try {
      const { data } = await api.getMe(currentToken);
      setUser(data);
    } catch {
      // token inválido/expirado — desloga silenciosamente
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setLoading(false);
      return;
    }
    setToken(stored);
    loadUser(stored).finally(() => setLoading(false));
  }, [loadUser]);

  async function login(email, password) {
    const { data } = await api.loginUser(email, password);
    localStorage.setItem(TOKEN_KEY, data.token);
    sessionStorage.setItem(JUST_LOGGED_IN_KEY, '1');
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  async function refreshUser() {
    if (!token) return;
    await loadUser(token);
  }

  return (
    <UserContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser precisa estar dentro de um UserProvider');
  return ctx;
}

// Lê e apaga a flag de "acabou de logar" — só retorna true na primeira
// checagem depois de um login, nunca de novo até o próximo login.
export function consumeJustLoggedIn() {
  const value = sessionStorage.getItem(JUST_LOGGED_IN_KEY);
  if (value) sessionStorage.removeItem(JUST_LOGGED_IN_KEY);
  return !!value;
}
