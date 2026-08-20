// Controla quando o modal de doação (DonationModal.jsx, mostrado em
// /home) volta a aparecer — antes só disparava uma vez, logo após o login
// (ver consumeJustLoggedIn em UserContext.jsx). Agora também dispara a cada
// filme NOVO que a pessoa abre (nunca aberto antes por ela nesse
// navegador) — arma um flag aqui, consumido na próxima vez que ela
// chegar em /home.
const SEEN_MOVIES_KEY = 'sva_seen_movies';
const PENDING_PROMPT_KEY = 'sva_pending_donation_prompt';

// localStorage (não sessionStorage) de propósito — "filme novo" é por
// filme, pra sempre, não por sessão de navegador (senão reabrir a aba já
// reativaria o gatilho pra filmes já vistos antes).
export function markMovieOpened(slug) {
  if (typeof window === 'undefined' || !slug) return;
  try {
    const seen = JSON.parse(localStorage.getItem(SEEN_MOVIES_KEY) || '[]');
    if (seen.includes(slug)) return;
    seen.push(slug);
    localStorage.setItem(SEEN_MOVIES_KEY, JSON.stringify(seen));
    sessionStorage.setItem(PENDING_PROMPT_KEY, '1');
  } catch {
    // localStorage indisponível/cheio — não trava a página por causa disso
  }
}

export function consumePendingDonationPrompt() {
  const value = sessionStorage.getItem(PENDING_PROMPT_KEY);
  if (value) sessionStorage.removeItem(PENDING_PROMPT_KEY);
  return !!value;
}
