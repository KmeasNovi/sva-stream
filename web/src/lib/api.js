const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// GETs usam o cache de dados do Next (revalidação em background a cada N
// segundos) em vez de `no-store` — antes, toda navegação refazia a chamada
// pro backend do zero, o que dói ainda mais com o backend no plano free do
// Render (dorme após ~15 min de inatividade). Mutações continuam sem cache.
// Esse cache só se aplica a fetches feitos durante renderização no servidor
// (Server Components); chamadas client-side, como no /admin, não são afetadas.
async function request(path, { method = 'GET', body, token, revalidate = 60 } = {}) {
  const res = await fetch(`${API_URL}/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...(method === 'GET' ? { next: { revalidate } } : { cache: 'no-store' }),
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
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  createMovie: (data, token) => request('/movies', { method: 'POST', body: data, token }),
  updateMovie: (id, data, token) => request(`/movies/${id}`, { method: 'PATCH', body: data, token }),
  deleteMovie: (id, token) => request(`/movies/${id}`, { method: 'DELETE', token }),
  subscribeNewsletter: (email) => request('/newsletter/subscribe', { method: 'POST', body: { email } }),
};
