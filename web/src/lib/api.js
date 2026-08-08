const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// GETs usam o cache de dados do Next (revalidação em background a cada N
// segundos) em vez de `no-store` — antes, toda navegação refazia a chamada
// pro backend do zero, o que dói ainda mais com o backend no plano free do
// Render (dorme após ~15 min de inatividade). Mutações continuam sem cache.
// Esse cache só se aplica a fetches feitos durante renderização no servidor
// (Server Components); chamadas client-side, como no /admin, não são afetadas.
async function request(path, { method = 'GET', body, token, revalidate = 60 } = {}) {
  // GETs autenticados (dados do próprio usuário) nunca usam o cache de dados
  // do Next — só GETs públicos (catálogo de filmes) se beneficiam disso.
  const res = await fetch(`${API_URL}/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...(method === 'GET' && !token ? { next: { revalidate } } : { cache: 'no-store' }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.message || `Erro na requisição (${res.status})`);
  }

  return json;
}

export const api = {
  listMovies: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/movies${query ? `?${query}` : ''}`);
  },
  getMovie: (slug) => request(`/movies/${slug}`),
  listGenres: () => request('/movies/genres'),
  listFeatured: () => request('/movies/featured'),
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  createMovie: (data, token) => request('/movies', { method: 'POST', body: data, token }),
  updateMovie: (id, data, token) => request(`/movies/${id}`, { method: 'PATCH', body: data, token }),
  deleteMovie: (id, token) => request(`/movies/${id}`, { method: 'DELETE', token }),
  subscribeNewsletter: (email) => request('/newsletter/subscribe', { method: 'POST', body: { email } }),
  register: (data) => request('/users/register', { method: 'POST', body: data }),
  loginUser: (email, password) => request('/users/login', { method: 'POST', body: { email, password } }),
  verifyEmail: (token) => request('/users/verify-email', { method: 'POST', body: { token } }),
  resendVerification: (email) => request('/users/resend-verification', { method: 'POST', body: { email } }),
  getMe: (token) => request('/users/me', { token }),
  addFavorite: (movieId, token) => request(`/users/favorites/${movieId}`, { method: 'POST', token }),
  removeFavorite: (movieId, token) => request(`/users/favorites/${movieId}`, { method: 'DELETE', token }),
};
