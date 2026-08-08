'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { api } from '../lib/api';
import MovieCard from './MovieCard';

const TILE_ACCENTS = ['text-white', 'text-secondary', 'text-error', 'text-white', 'text-primary'];

export default function Explore({ genreTiles }) {
  const searchParams = useSearchParams();
  const [term, setTerm] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (term.trim().length < 2) {
      setResults([]);
      return;
    }

    let cancelled = false;
    api.listMovies({ search: term, limit: 24 }).then(({ data }) => {
      if (!cancelled) setResults(data);
    });

    return () => {
      cancelled = true;
    };
  }, [term]);

  return (
    <div className="container mx-auto px-container-margin py-12 max-w-7xl">
      <div className="mb-12">
        <div className="relative max-w-2xl w-full mb-6 group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            type="search"
            placeholder="Buscar filmes, gêneros..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            autoFocus
            className="w-full bg-[#111111] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-on-background font-body text-body-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all glass-panel"
          />
        </div>
        {genreTiles.length ? (
          <div className="flex flex-wrap gap-3">
            {genreTiles.map(({ genre }) => (
              <button
                key={genre}
                onClick={() => setTerm(genre)}
                className="px-4 py-2 rounded-full border border-primary/30 text-primary font-body text-label-bold hover:bg-primary/10 transition-colors"
              >
                #{genre}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {term.trim().length >= 2 ? (
        <>
          <h2 className="font-display text-headline-lg mb-8 text-on-background">Resultados</h2>
          <div className="flex flex-wrap gap-4">
            {results.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
            {!results.length ? (
              <p className="font-body text-body-md text-on-surface-variant">Nenhum filme encontrado.</p>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <h2 className="font-display text-headline-lg mb-8 text-on-background">Explorar gêneros</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {genreTiles.map(({ genre, cover }, i) => (
              <Link
                key={genre}
                href={`/genre/${encodeURIComponent(genre)}`}
                className="relative overflow-hidden rounded-2xl aspect-[4/3] group cursor-pointer glow-hover transition-all duration-300 border border-white/5"
              >
                {cover ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${cover})` }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-surface-container" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 z-10">
                  <h3 className={`font-display text-headline-md ${TILE_ACCENTS[i % TILE_ACCENTS.length]}`}>{genre}</h3>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
