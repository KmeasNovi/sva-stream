'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '../../../context/UserContext';
import { api } from '../../../lib/api';
import { getCached, setCached } from '../../../lib/clientCache';
import MovieCard from '../../../components/MovieCard';
import LoadingScreen from '../../../components/LoadingScreen';

export default function GenrePage({ params }) {
  const { token } = useUser();
  const decoded = decodeURIComponent(params.genre);
  const cacheKey = `genre:${decoded}`;
  const [movies, setMovies] = useState(() => getCached(cacheKey) ?? null);

  useEffect(() => {
    setMovies(getCached(cacheKey) ?? null);

    if (!token) return;
    let cancelled = false;
    api.listMovies({ genre: decoded, limit: 2000 }, token).then(({ data }) => {
      if (cancelled) return;
      setMovies(data);
      setCached(cacheKey, data);
    });
    return () => {
      cancelled = true;
    };
  }, [decoded, token]);

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
        <div className="flex flex-wrap gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
          {!movies.length ? (
            <p className="font-body text-body-md text-on-surface-variant">Nenhum filme neste gênero ainda.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
