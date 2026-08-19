'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import MovieCard from './MovieCard';
import AdSlot from './AdSlot';
import AdsterraBanner from './AdsterraBanner';
import { api } from '../lib/api';

const ADSENSE_SLOT_CATALOGO = process.env.NEXT_PUBLIC_ADSENSE_SLOT_CATALOGO;

const SORT_OPTIONS = [
  { value: 'alpha', label: 'Ordem alfabética' },
  { value: 'year', label: 'Data da obra' },
];

export default function Catalog({ initialMovies, initialPagination, pageSize }) {
  const [sort, setSort] = useState('alpha');
  const [movies, setMovies] = useState(initialMovies);
  const [page, setPage] = useState(initialPagination?.page || 1);
  const [hasMore, setHasMore] = useState((initialPagination?.pages || 1) > (initialPagination?.page || 1));
  const [loading, setLoading] = useState(false);
  const total = initialPagination?.total ?? movies.length;
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);

  // Troca de ordenação recomeça do zero — a ordenação agora é feita no
  // banco de dados (não dá pra reordenar só o que já foi carregado, já que
  // o resto do catálogo ainda não chegou no navegador).
  function handleSortChange(newSort) {
    if (newSort === sort) return;
    setSort(newSort);
    setLoading(true);
    api
      .listMoviesPublic({ page: 1, limit: pageSize, sort: newSort })
      .then(({ data, pagination }) => {
        setMovies(data || []);
        setPage(1);
        setHasMore((pagination?.pages || 1) > 1);
      })
      .finally(() => setLoading(false));
  }

  const loadMore = useCallback(() => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    const nextPage = page + 1;
    api
      .listMoviesPublic({ page: nextPage, limit: pageSize, sort })
      .then(({ data, pagination }) => {
        setMovies((prev) => [...prev, ...(data || [])]);
        setPage(nextPage);
        setHasMore((pagination?.pages || 1) > nextPage);
      })
      .finally(() => {
        setLoading(false);
        loadingRef.current = false;
      });
  }, [page, sort, hasMore, pageSize]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '600px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="container mx-auto px-container-margin py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-headline-lg text-on-background">Catálogo</h1>
          <p className="font-body text-body-md text-on-surface-variant mt-1">
            {total} filmes e curtas, sem filtro de categoria.
          </p>
        </div>
        <label className="flex items-center gap-3 font-body text-label-bold text-on-surface-variant">
          Ordenar por
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
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

      <AdSlot slotId={ADSENSE_SLOT_CATALOGO} className="mb-8" />
      <AdsterraBanner size="300x250" className="mb-8" />

      <div className="flex flex-wrap gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
        {!movies.length ? (
          <p className="font-body text-body-md text-on-surface-variant">Nenhum filme no catálogo.</p>
        ) : null}
      </div>

      {hasMore ? (
        <div ref={sentinelRef} className="flex justify-center py-10">
          {loading ? (
            <span className="font-body text-body-md text-on-surface-variant">Carregando mais filmes…</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
