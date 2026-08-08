'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';

const emptyForm = {
  title: '',
  synopsis: '',
  year: '',
  director: '',
  genres: '',
  runtimeMinutes: '',
  posterUrl: '',
  backdropUrl: '',
  sourceProvider: 'archive',
  sourceId: '',
  featured: false,
};

const inputClass =
  'w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 text-on-background font-body text-body-md focus:outline-none focus:ring-1 focus:ring-primary';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('sva_admin_token');
    if (!stored) {
      router.push('/admin/login');
      return;
    }
    setToken(stored);
  }, [router]);

  useEffect(() => {
    if (token) loadMovies();
  }, [token]);

  async function loadMovies() {
    const { data } = await api.listMovies({ limit: 2000 });
    setMovies(data);
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const payload = {
      title: form.title,
      synopsis: form.synopsis,
      year: form.year ? Number(form.year) : undefined,
      director: form.director || undefined,
      genres: form.genres ? form.genres.split(',').map((g) => g.trim()) : [],
      runtimeMinutes: form.runtimeMinutes ? Number(form.runtimeMinutes) : undefined,
      posterUrl: form.posterUrl || undefined,
      backdropUrl: form.backdropUrl || undefined,
      source: { provider: form.sourceProvider, id: form.sourceId },
      featured: form.featured,
    };

    try {
      await api.createMovie(payload, token);
      setForm(emptyForm);
      loadMovies();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remover este filme do catálogo?')) return;
    await api.deleteMovie(id, token);
    loadMovies();
  }

  function handleLogout() {
    localStorage.removeItem('sva_admin_token');
    router.push('/admin/login');
  }

  if (!token) return null;

  return (
    <div className="container mx-auto px-container-margin py-12 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-headline-lg text-on-background">Catálogo</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg border border-white/20 text-on-surface-variant hover:bg-white/10 transition-colors font-body text-label-bold"
        >
          Sair
        </button>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 space-y-4 max-w-2xl">
        <h2 className="font-display text-headline-md text-on-background mb-2">Adicionar filme</h2>
        <input
          placeholder="Título"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
          className={inputClass}
        />
        <textarea
          placeholder="Sinopse"
          value={form.synopsis}
          onChange={(e) => handleChange('synopsis', e.target.value)}
          required
          rows={3}
          className={inputClass}
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Ano"
            value={form.year}
            onChange={(e) => handleChange('year', e.target.value)}
            className={inputClass}
          />
          <input
            placeholder="Duração (min)"
            value={form.runtimeMinutes}
            onChange={(e) => handleChange('runtimeMinutes', e.target.value)}
            className={inputClass}
          />
        </div>
        <input
          placeholder="Diretor"
          value={form.director}
          onChange={(e) => handleChange('director', e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="Gêneros (separados por vírgula)"
          value={form.genres}
          onChange={(e) => handleChange('genres', e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="URL do pôster"
          value={form.posterUrl}
          onChange={(e) => handleChange('posterUrl', e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="URL do backdrop"
          value={form.backdropUrl}
          onChange={(e) => handleChange('backdropUrl', e.target.value)}
          className={inputClass}
        />
        <div className="grid grid-cols-[auto_1fr] gap-4">
          <select
            value={form.sourceProvider}
            onChange={(e) => handleChange('sourceProvider', e.target.value)}
            className={inputClass}
          >
            <option value="archive">archive.org</option>
            <option value="youtube">YouTube</option>
          </select>
          <input
            placeholder="ID na fonte (identifier / videoId)"
            value={form.sourceId}
            onChange={(e) => handleChange('sourceId', e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-2 font-body text-body-md text-on-surface-variant">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => handleChange('featured', e.target.checked)}
          />
          Destaque na home
        </label>
        {error ? <p className="text-error font-body text-body-md">{error}</p> : null}
        <button
          type="submit"
          className="bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
        >
          Salvar
        </button>
      </form>

      <div className="glass-panel rounded-2xl overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="text-left font-body text-label-bold text-on-surface-variant border-b border-white/10">
              <th className="p-4">Título</th>
              <th className="p-4">Ano</th>
              <th className="p-4">Fonte</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie._id} className="border-b border-white/5 font-body text-body-md text-on-background">
                <td className="p-4 max-w-[240px] truncate">{movie.title}</td>
                <td className="p-4">{movie.year}</td>
                <td className="p-4 text-on-surface-variant max-w-[200px] truncate">
                  {movie.source?.provider}:{movie.source?.id}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(movie._id)}
                    className="px-3 py-1 rounded-lg border border-error/30 text-error hover:bg-error/10 transition-colors font-body text-label-bold whitespace-nowrap"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
