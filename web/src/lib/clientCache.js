// Cache simples em memória pros dados de filmes buscados no cliente (ver
// AuthGate/api.js — a API de filmes agora exige login, então essas páginas
// buscam os dados depois de montar, não mais no servidor). Sem isso, cada
// navegação entre abas mostrava "Carregando..." de novo do zero. O cache
// vive só durante a sessão da aba (módulo JS, não sobrevive a um F5) e é
// only "stale-while-revalidate": mostra o que já tem na hora, busca de novo
// por trás e atualiza quando chegar.
const cache = new Map();

export function getCached(key) {
  return cache.get(key);
}

export function setCached(key, value) {
  cache.set(key, value);
}
