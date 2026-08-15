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
  listMovies: (params = {}, token) => {
    const query = new URLSearchParams(params).toString();
    return request(`/movies${query ? `?${query}` : ''}`, { token });
  },
  getMovie: (slug, token) => request(`/movies/${slug}`, { token }),
  // Pública (sem token) — usada pela página /movie/[slug] renderizada no
  // servidor, pra funcionar sem login (SEO + quem chega de uma busca).
  getMoviePublic: (slug) => request(`/movies/public/${slug}`, { revalidate: 300 }),
  listMovieSlugs: () => request('/movies/sitemap', { revalidate: 3600 }),
  // Pública — usada pela landing page (/) pra mostrar títulos reais com
  // link, em vez de só decoração sem texto indexável.
  listHighlights: () => request('/movies/public/highlights', { revalidate: 3600 }),
  // Pública — usada por /catalogo (paginada, scroll infinito). A primeira
  // página é renderizada no servidor (sem login, com cache); as próximas
  // são buscadas direto do navegador conforme a pessoa rola a tela.
  listMoviesPublic: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/movies/public${query ? `?${query}` : ''}`, { revalidate: 300 });
  },
  listGenres: (token) => request('/movies/genres', { token }),
  listFeatured: (token) => request('/movies/featured', { token }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  createMovie: (data, token) => request('/movies', { method: 'POST', body: data, token }),
  updateMovie: (id, data, token) => request(`/movies/${id}`, { method: 'PATCH', body: data, token }),
  deleteMovie: (id, token) => request(`/movies/${id}`, { method: 'DELETE', token }),
  bulkCreateMovies: (movies, token) => request('/movies/bulk', { method: 'POST', body: { movies }, token }),
  subscribeNewsletter: (email) => request('/newsletter/subscribe', { method: 'POST', body: { email } }),
  register: (data) => request('/users/register', { method: 'POST', body: data }),
  loginUser: (email, password) => request('/users/login', { method: 'POST', body: { email, password } }),
  loginWithGoogle: (idToken) => request('/users/google', { method: 'POST', body: { idToken } }),
  verifyEmail: (token) => request('/users/verify-email', { method: 'POST', body: { token } }),
  resendVerification: (email) => request('/users/resend-verification', { method: 'POST', body: { email } }),
  forgotPassword: (email) => request('/users/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (token, password) => request('/users/reset-password', { method: 'POST', body: { token, password } }),
  getMe: (token) => request('/users/me', { token }),
  addFavorite: (movieId, token) => request(`/users/favorites/${movieId}`, { method: 'POST', token }),
  removeFavorite: (movieId, token) => request(`/users/favorites/${movieId}`, { method: 'DELETE', token }),
  // Módulo administrativo — gestão de usuários.
  adminListUsers: (params = {}, token) => {
    const query = new URLSearchParams(params).toString();
    return request(`/users${query ? `?${query}` : ''}`, { token });
  },
  adminCreateUser: (data, token) => request('/users', { method: 'POST', body: data, token }),
  adminBulkCreateUsers: (users, token) => request('/users/bulk', { method: 'POST', body: { users }, token }),
  adminUpdateUser: (id, data, token) => request(`/users/${id}`, { method: 'PATCH', body: data, token }),
  adminDeleteUser: (id, token) => request(`/users/${id}`, { method: 'DELETE', token }),
};
