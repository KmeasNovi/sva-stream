'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useUser } from '../context/UserContext';
import { api } from '../lib/api';
import { getCached, setCached } from '../lib/clientCache';
import MovieCard from './MovieCard';
import LoadingScreen from './LoadingScreen';

const TILE_ACCENTS = ['text-white', 'text-secondary', 'text-error', 'text-white', 'text-primary'];

export default function Explore() {
  const searchParams = useSearchParams();
  const { token } = useUser();
  const [term, setTerm] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [genreTiles, setGenreTiles] = useState(() => getCached('explore-genre-tiles') ?? null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    api.listGenres(token).then(async ({ data: genres }) => {
      const tiles = await Promise.all(
        genres.map(async (genre) => {
          const { data } = await api.listMovies({ genre, limit: 1 }, token);
          const cover = data[0]?.backdropUrl || data[0]?.posterUrl || null;
          return { genre, cover };
        })
      );
      if (cancelled) return;
      setGenreTiles(tiles);
      setCached('explore-genre-tiles', tiles);
    });
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token || term.trim().length < 2) {
      setResults([]);
      return;
    }

    let cancelled = false;
    api.listMovies({ search: term, limit: 300 }, token).then(({ data }) => {
      if (!cancelled) setResults(data);
    });

    return () => {
      cancelled = true;
    };
  }, [term, token]);

  if (!genreTiles) {
    return <LoadingScreen />;
  }

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
              // Link direto pra categoria (não busca de texto): o nome do
              // gênero nem sempre aparece no título/sinopse de cada filme,
              // então uma busca por "Terror" perderia a maioria dos filmes
              // de terror que não têm essa palavra escrita.
              <Link
                key={genre}
                href={`/genre/${encodeURIComponent(genre)}`}
                className="px-4 py-2 rounded-full border border-primary/30 text-primary font-body text-label-bold hover:bg-primary/10 transition-colors"
              >
                #{genre}
              </Link>
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
                  // Aspas dentro do url() são necessárias — alguns covers vêm
                  // de nomes de arquivo do archive.org com parênteses/vírgula
                  // (ex: "Nome (1942, Redrawn).jpg"), que sem aspas quebram a
                  // sintaxe do CSS url().
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url("${cover}")` }}
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
