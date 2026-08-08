const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function request(path, { method = 'GET', body, token, cache } = {}) {
  const res = await fetch(`${API_URL}/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
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
    return request(`/movies${query ? `?${query}` : ''}`, { cache: 'no-store' });
  },
  getMovie: (slug) => request(`/movies/${slug}`, { cache: 'no-store' }),
  listGenres: () => request('/movies/genres', { cache: 'no-store' }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  createMovie: (data, token) => request('/movies', { method: 'POST', body: data, token }),
  updateMovie: (id, data, token) => request(`/movies/${id}`, { method: 'PATCH', body: data, token }),
  deleteMovie: (id, token) => request(`/movies/${id}`, { method: 'DELETE', token }),
  subscribeNewsletter: (email) => request('/newsletter/subscribe', { method: 'POST', body: { email } }),
};
