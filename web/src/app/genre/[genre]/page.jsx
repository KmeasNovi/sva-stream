'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { getCached, setCached } from '../../../lib/clientCache';
import MovieCard from '../../../components/MovieCard';
import LoadingScreen from '../../../components/LoadingScreen';
import AdBand from '../../../components/AdBand';

const ADSENSE_SLOT_GENRE = process.env.NEXT_PUBLIC_ADSENSE_SLOT_GENRE;
const PAGE_SIZE = 60;

export default function GenrePage({ params }) {
  const decoded = decodeURIComponent(params.genre);
  const cacheKey = `genre:${decoded}`;
  const cached = getCached(cacheKey);
  const [movies, setMovies] = useState(cached?.movies ?? null);
  const [page, setPage] = useState(cached?.page ?? 1);
  const [hasMore, setHasMore] = useState(cached?.hasMore ?? true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);

  // Troca de gênero (navegação entre categorias) recomeça do zero.
  useEffect(() => {
    const fresh = getCached(cacheKey);
    setMovies(fresh?.movies ?? null);
    setPage(fresh?.page ?? 1);
    setHasMore(fresh?.hasMore ?? true);

    if (fresh) return;
    let cancelled = false;
    api.listMoviesPublic({ genre: decoded, page: 1, limit: PAGE_SIZE }).then(({ data, pagination }) => {
      if (cancelled) return;
      const hasMoreNow = (pagination?.pages || 1) > 1;
      setMovies(data || []);
      setHasMore(hasMoreNow);
      setCached(cacheKey, { movies: data || [], page: 1, hasMore: hasMoreNow });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decoded]);

  const loadMore = useCallback(() => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    const nextPage = page + 1;
    api
      .listMoviesPublic({ genre: decoded, page: nextPage, limit: PAGE_SIZE })
      .then(({ data, pagination }) => {
        setMovies((prev) => {
          const next = [...(prev || []), ...(data || [])];
          setCached(cacheKey, { movies: next, page: nextPage, hasMore: (pagination?.pages || 1) > nextPage });
          return next;
        });
        setPage(nextPage);
        setHasMore((pagination?.pages || 1) > nextPage);
      })
      .finally(() => {
        setLoading(false);
        loadingRef.current = false;
      });
  }, [decoded, page, hasMore, cacheKey]);

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
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/search"
          aria-label="Voltar para categorias"
          className="text-on-surface-variant hover:text-secondary transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="font-display text-headline-lg text-on-background">{decoded}</h1>
      </div>
      {movies === null ? (
        <LoadingScreen />
      ) : (
        <>
          {movies.length ? <AdBand slotId={ADSENSE_SLOT_GENRE} className="mb-8" compact /> : null}
          <div className="flex flex-wrap gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
            {!movies.length ? (
              <p className="font-body text-body-md text-on-surface-variant">Nenhum filme neste gênero ainda.</p>
            ) : null}
          </div>
          {hasMore ? (
            <div ref={sentinelRef} className="flex justify-center py-10">
              {loading ? (
                <span className="font-body text-body-md text-on-surface-variant">Carregando mais filmes…</span>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
