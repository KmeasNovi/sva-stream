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
    } catch (err) {
      // Só desloga quando o backend recusou o token (401). Falha de rede ou
      // API dormindo (Render free) não pode derrubar a sessão — senão a
      // rechecagem ao voltar pra aba (abaixo) deslogaria à toa.
      if (err.status !== 401) return;
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      // Conta gratuita = um acesso por vez: outro dispositivo entrou e este
      // caiu. Leva pro login explicando o motivo, em vez de sumir calado.
      if (err.code === 'SESSION_REPLACED' && window.location.pathname !== '/entrar') {
        window.location.assign('/entrar?motivo=outro-dispositivo');
      }
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

  // Reconfere a sessão quando a pessoa volta pra aba — é aí que um
  // dispositivo derrubado por login em outro lugar descobre isso, sem ficar
  // fazendo polling (o backend no plano free não aguenta chamada à toa).
  useEffect(() => {
    if (!token) return undefined;
    function onVisible() {
      if (document.visibilityState === 'visible') loadUser(token);
    }
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [token, loadUser]);

  async function login(email, password) {
    const { data } = await api.loginUser(email, password);
    localStorage.setItem(TOKEN_KEY, data.token);
    sessionStorage.setItem(JUST_LOGGED_IN_KEY, '1');
    setToken(data.token);
    // O login não devolve isPremium/subscription (só getMe faz esse cálculo)
    // — busca o usuário completo em vez de confiar no payload do login, senão
    // quem acabou de entrar aparece como não-Premium até recarregar a página
    // (isso quebrava o gate do Pro logo após "Continuar com o Google").
    await loadUser(data.token);
  }

  async function loginWithGoogle(idToken) {
    const { data } = await api.loginWithGoogle(idToken);
    localStorage.setItem(TOKEN_KEY, data.token);
    sessionStorage.setItem(JUST_LOGGED_IN_KEY, '1');
    setToken(data.token);
    await loadUser(data.token);
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
    <UserContext.Provider value={{ user, token, loading, login, loginWithGoogle, logout, refreshUser }}>
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
