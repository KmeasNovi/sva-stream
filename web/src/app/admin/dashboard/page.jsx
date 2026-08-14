'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import AdminNav from '../AdminNav';
import useAdminToken from '../useAdminToken';

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

const BULK_PLACEHOLDER = `[
  {
    "title": "Nome do filme",
    "synopsis": "Sinopse original em português.",
    "year": 1950,
    "genres": ["Drama", "Clássico"],
    "runtimeMinutes": 90,
    "source": { "provider": "archive", "id": "identifier-no-archive-org" }
  }
]`;

function movieToForm(movie) {
  return {
    title: movie.title || '',
    synopsis: movie.synopsis || '',
    year: movie.year || '',
    director: movie.director || '',
    genres: (movie.genres || []).join(', '),
    runtimeMinutes: movie.runtimeMinutes || '',
    posterUrl: movie.posterUrl || '',
    backdropUrl: movie.backdropUrl || '',
    sourceProvider: movie.source?.provider || 'archive',
    sourceId: movie.source?.id || '',
    featured: Boolean(movie.featured),
  };
}

export default function AdminDashboardPage() {
  const token = useAdminToken();
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [bulkResult, setBulkResult] = useState(null);
  const [bulkError, setBulkError] = useState('');
  const [showBulk, setShowBulk] = useState(false);

  async function loadMovies(searchTerm) {
    const { data } = await api.listMovies(
      searchTerm ? { search: searchTerm, limit: 200 } : { limit: 100 },
      token
    );
    setMovies(data);
  }

  useEffect(() => {
    if (token) loadMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function startEdit(movie) {
    setEditingId(movie._id);
    setForm(movieToForm(movie));
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const payload = {
      title: form.title,
      synopsis: form.synopsis,
      year: form.year ? Number(form.year) : undefined,
      director: form.director || undefined,
      genres: form.genres ? form.genres.split(',').map((g) => g.trim()).filter(Boolean) : [],
      runtimeMinutes: form.runtimeMinutes ? Number(form.runtimeMinutes) : undefined,
      posterUrl: form.posterUrl || undefined,
      backdropUrl: form.backdropUrl || undefined,
      source: { provider: form.sourceProvider, id: form.sourceId },
      featured: form.featured,
    };

    try {
      if (editingId) {
        await api.updateMovie(editingId, payload, token);
      } else {
        await api.createMovie(payload, token);
      }
      cancelEdit();
      loadMovies(search);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remover este filme do catálogo?')) return;
    await api.deleteMovie(id, token);
    if (editingId === id) cancelEdit();
    loadMovies(search);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    loadMovies(search.trim());
  }

  async function handleBulkImport(e) {
    e.preventDefault();
    setBulkError('');
    setBulkResult(null);

    let parsed;
    try {
      parsed = JSON.parse(bulkText);
      if (!Array.isArray(parsed)) throw new Error('O JSON precisa ser uma lista (array) de filmes');
    } catch (err) {
      setBulkError(`JSON inválido: ${err.message}`);
      return;
    }

    try {
      const { data } = await api.bulkCreateMovies(parsed, token);
      setBulkResult(data);
      loadMovies(search);
    } catch (err) {
      setBulkError(err.message);
    }
  }

  if (!token) return null;

  return (
    <div className="container mx-auto px-container-margin py-12 space-y-10">
      <AdminNav />
      <h1 className="font-display text-headline-lg text-on-background">Catálogo de filmes</h1>

      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 space-y-4 max-w-2xl">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-headline-md text-on-background">
            {editingId ? 'Editar filme' : 'Adicionar filme'}
          </h2>
          {editingId ? (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-on-surface-variant hover:text-on-background font-body text-label-bold"
            >
              Cancelar edição
            </button>
          ) : null}
        </div>
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
          {editingId ? 'Salvar alterações' : 'Salvar'}
        </button>
      </form>

      <div className="glass-panel rounded-2xl p-8 max-w-2xl space-y-4">
        <button
          type="button"
          onClick={() => setShowBulk((v) => !v)}
          className="font-display text-headline-md text-on-background flex items-center gap-2"
        >
          Importação em lote {showBulk ? '▾' : '▸'}
        </button>
        {showBulk ? (
          <form onSubmit={handleBulkImport} className="space-y-4">
            <p className="font-body text-body-md text-on-surface-variant">
              Cole um array JSON de filmes. Cada item aceita os mesmos campos do formulário acima
              (em inglês, seguindo o schema). Filmes com o mesmo <code>slug</code> de um já
              existente são atualizados em vez de duplicados.
            </p>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={BULK_PLACEHOLDER}
              rows={10}
              className={`${inputClass} font-mono text-body-sm`}
            />
            {bulkError ? <p className="text-error font-body text-body-md">{bulkError}</p> : null}
            {bulkResult ? (
              <div className="font-body text-body-md text-on-surface-variant space-y-1">
                <p>
                  Criados: {bulkResult.created} · Atualizados: {bulkResult.updated} · Falhas:{' '}
                  {bulkResult.failed}
                </p>
                {bulkResult.errors?.length ? (
                  <ul className="list-disc list-inside text-error">
                    {bulkResult.errors.map((e) => (
                      <li key={e.index}>
                        {e.title}: {e.message}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
            <button
              type="submit"
              className="bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
            >
              Importar
            </button>
          </form>
        ) : null}
      </div>

      <div className="space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-3 max-w-md">
          <input
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputClass}
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-lg border border-white/20 text-on-background hover:bg-white/10 transition-colors font-body text-label-bold whitespace-nowrap"
          >
            Buscar
          </button>
        </form>
        <p className="font-body text-body-sm text-on-surface-variant">
          {search ? `Resultados para "${search}"` : 'Mostrando os 100 filmes mais recentes — use a busca para achar outros.'}{' '}
          ({movies.length})
        </p>

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
                  <td className="p-4 flex gap-2 justify-end">
                    <button
                      onClick={() => startEdit(movie)}
                      className="px-3 py-1 rounded-lg border border-white/20 text-on-background hover:bg-white/10 transition-colors font-body text-label-bold whitespace-nowrap"
                    >
                      Editar
                    </button>
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
    </div>
  );
}
