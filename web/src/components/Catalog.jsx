'use client';

import { useMemo, useState } from 'react';
import MovieCard from './MovieCard';

const SORT_OPTIONS = [
  { value: 'alpha', label: 'Ordem alfabética' },
  { value: 'year', label: 'Data da obra' },
];

export default function Catalog({ movies }) {
  const [sort, setSort] = useState('alpha');

  const sorted = useMemo(() => {
    const copy = [...movies];
    if (sort === 'year') {
      copy.sort((a, b) => (a.year || 0) - (b.year || 0) || a.title.localeCompare(b.title, 'pt-BR'));
    } else {
      copy.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
    }
    return copy;
  }, [movies, sort]);

  return (
    <div className="container mx-auto px-container-margin py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-headline-lg text-on-background">Catálogo</h1>
          <p className="font-body text-body-md text-on-surface-variant mt-1">
            {movies.length} filmes e curtas, sem filtro de categoria.
          </p>
        </div>
        <label className="flex items-center gap-3 font-body text-label-bold text-on-surface-variant">
          Ordenar por
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-[#111111] border border-white/10 rounded-lg px-4 py-2 text-on-background font-body text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-4">
        {sorted.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
        {!sorted.length ? (
          <p className="font-body text-body-md text-on-surface-variant">Nenhum filme no catálogo.</p>
        ) : null}
      </div>
    </div>
  );
}
