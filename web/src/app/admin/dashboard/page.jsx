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
  cast: '',
  language: '',
  genres: '',
  runtimeMinutes: '',
  posterUrl: '',
  backdropUrl: '',
  videoFileUrl: '',
  subtitleUrl: '',
  sourceProvider: 'archive',
  sourceId: '',
  featured: false,
};

const PAGE_SIZE_OPTIONS = [100, 1000, 10000];

const labelClass = 'font-body text-body-sm text-on-surface-variant block mb-1';

function Field({ label, children }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

// Números de página com reticências pros extremos (mesmo padrão do Google:
// sempre mostra a primeira, a última, e uma janela ao redor da atual).
function getPageNumbers(current, total) {
  const delta = 2;
  const pages = [];

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      pages.push(i);
    }
  }

  const withDots = [];
  let last;
  for (const p of pages) {
    if (last !== undefined && p - last > 1) withDots.push('…');
    withDots.push(p);
    last = p;
  }
  return withDots;
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 flex-wrap">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-2 rounded-lg border border-white/20 text-on-background hover:bg-white/10 transition-colors font-body text-label-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Anterior
      </button>
      {getPageNumbers(page, totalPages).map((p, i) =>
        p === '…' ? (
          <span key={`dots-${i}`} className="px-1 font-body text-body-sm text-on-surface-variant">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`min-w-[36px] h-9 px-2 rounded-lg font-body text-label-bold text-sm transition-colors ${
              p === page ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-white/10'
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-2 rounded-lg border border-white/20 text-on-background hover:bg-white/10 transition-colors font-body text-label-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Próxima
      </button>
    </div>
  );
}

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
    cast: (movie.cast || []).join(', '),
    language: movie.language || '',
    genres: (movie.genres || []).join(', '),
    runtimeMinutes: movie.runtimeMinutes || '',
    posterUrl: movie.posterUrl || '',
    backdropUrl: movie.backdropUrl || '',
    videoFileUrl: movie.videoFileUrl || '',
    subtitleUrl: movie.subtitleUrl || '',
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
  const [pageSize, setPageSize] = useState(100);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);

  async function loadMovies(searchTerm = search, pageNum = page, limit = pageSize) {
    const { data, pagination } = await api.listMovies(
      { ...(searchTerm ? { search: searchTerm } : {}), page: pageNum, limit },
      token
    );
    setMovies(data);
    setTotalPages(pagination?.pages || 1);
    setTotalMovies(pagination?.total || 0);
  }

  useEffect(() => {
    if (token) loadMovies(search, page, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function handlePageSizeChange(size) {
    setPageSize(size);
    setPage(1);
    loadMovies(search, 1, size);
  }

  function goToPage(nextPage) {
    const clamped = Math.min(Math.max(1, nextPage), totalPages);
    setPage(clamped);
    loadMovies(search, clamped, pageSize);
  }

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
      cast: form.cast ? form.cast.split(',').map((c) => c.trim()).filter(Boolean) : [],
      language: form.language || undefined,
      genres: form.genres ? form.genres.split(',').map((g) => g.trim()).filter(Boolean) : [],
      runtimeMinutes: form.runtimeMinutes ? Number(form.runtimeMinutes) : undefined,
      posterUrl: form.posterUrl || undefined,
      backdropUrl: form.backdropUrl || undefined,
      videoFileUrl: form.videoFileUrl || undefined,
      subtitleUrl: form.subtitleUrl || undefined,
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
    setPage(1);
    loadMovies(search.trim(), 1);
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
        <Field label="Título">
          <input
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Sinopse">
          <textarea
            value={form.synopsis}
            onChange={(e) => handleChange('synopsis', e.target.value)}
            required
            rows={3}
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Ano">
            <input
              value={form.year}
              onChange={(e) => handleChange('year', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Duração (min)">
            <input
              value={form.runtimeMinutes}
              onChange={(e) => handleChange('runtimeMinutes', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Diretor">
          <input
            value={form.director}
            onChange={(e) => handleChange('director', e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Elenco (separado por vírgula)">
          <input
            value={form.cast}
            onChange={(e) => handleChange('cast', e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Idioma (ex: pt, en)">
          <input
            value={form.language}
            onChange={(e) => handleChange('language', e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Gêneros (separados por vírgula)">
          <input
            value={form.genres}
            onChange={(e) => handleChange('genres', e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="URL do pôster">
          <input
            value={form.posterUrl}
            onChange={(e) => handleChange('posterUrl', e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="URL do backdrop">
          <input
            value={form.backdropUrl}
            onChange={(e) => handleChange('backdropUrl', e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="URL do arquivo de vídeo (player nativo)">
          <input
            value={form.videoFileUrl}
            onChange={(e) => handleChange('videoFileUrl', e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="URL da legenda .vtt">
          <input
            value={form.subtitleUrl}
            onChange={(e) => handleChange('subtitleUrl', e.target.value)}
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-[auto_1fr] gap-4">
          <Field label="Fonte">
            <select
              value={form.sourceProvider}
              onChange={(e) => handleChange('sourceProvider', e.target.value)}
              className={inputClass}
            >
              <option value="archive">archive.org</option>
              <option value="youtube">YouTube</option>
            </select>
          </Field>
          <Field label="ID na fonte (identifier / videoId)">
            <input
              value={form.sourceId}
              onChange={(e) => handleChange('sourceId', e.target.value)}
              required
              className={inputClass}
            />
          </Field>
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
          className="bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(var(--glow-primary),0.4)] transition-all"
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
              className="bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(var(--glow-primary),0.4)] transition-all"
            >
              Importar
            </button>
          </form>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
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
          <label className="flex items-center gap-2 font-body text-body-sm text-on-surface-variant whitespace-nowrap">
            Exibir
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="bg-[#111111] border border-white/10 rounded-lg px-3 py-2 text-on-background font-body text-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="font-body text-body-sm text-on-surface-variant">
          {search ? `Resultados para "${search}"` : 'Filmes do catálogo'} — {totalMovies} no total
        </p>

        <Pagination page={page} totalPages={totalPages} onChange={goToPage} />

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

        <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
      </div>
    </div>
  );
}
