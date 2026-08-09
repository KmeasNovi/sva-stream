'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '../../../context/UserContext';
import { api } from '../../../lib/api';
import { getCached, setCached } from '../../../lib/clientCache';
import Player from '../../../components/Player';
import MovieRow from '../../../components/MovieRow';
import FavoriteButton from '../../../components/FavoriteButton';

export default function MoviePage({ params }) {
  const { token } = useUser();
  const { slug } = params;
  const cacheKey = `movie:${slug}`;
  const cached = getCached(cacheKey);
  const [movie, setMovie] = useState(cached?.movie ?? null);
  const [related, setRelated] = useState(cached?.related ?? []);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    const fromCache = getCached(cacheKey);
    setMovie(fromCache?.movie ?? null);
    setRelated(fromCache?.related ?? []);
    setNotFoundError(false);

    if (!token) return;
    let cancelled = false;

    api
      .getMovie(slug, token)
      .then(({ data }) => {
        if (cancelled) return;
        setMovie(data);
        setCached(cacheKey, { movie: data, related: getCached(cacheKey)?.related ?? [] });
        const genre = data.genres?.[0];
        if (genre) {
          api.listMovies({ genre, limit: 13 }, token).then(({ data: relatedData }) => {
            if (cancelled) return;
            const filtered = relatedData.filter((m) => m.slug !== data.slug);
            setRelated(filtered);
            setCached(cacheKey, { movie: data, related: filtered });
          });
        }
      })
      .catch(() => {
        if (!cancelled) setNotFoundError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, token]);

  if (notFoundError) {
    return (
      <div className="container mx-auto px-container-margin py-16 text-center">
        <p className="font-body text-body-md text-on-surface-variant mb-4">Filme não encontrado.</p>
        <Link href="/" className="text-primary hover:text-primary-fixed transition-colors">
          Voltar para o início
        </Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-container-margin py-16">
        <p className="font-body text-body-md text-on-surface-variant">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-container-margin py-8 space-y-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-secondary transition-colors font-body text-label-bold"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        Voltar
      </Link>

      <Player
        source={movie.source}
        title={movie.title}
        videoFileUrl={movie.videoFileUrl}
        subtitleUrl={movie.subtitleUrl}
      />

      <div className="max-w-3xl space-y-4">
        <div className="flex flex-wrap gap-2">
          {movie.genres?.map((g) => (
            <span
              key={g}
              className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30"
            >
              {g}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <h1 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-background">{movie.title}</h1>
          <FavoriteButton movieId={movie._id} className="w-10 h-10 flex-none" />
        </div>
        <p className="font-body text-body-md text-on-surface-variant">
          {[movie.year, movie.director, movie.runtimeMinutes && `${movie.runtimeMinutes} min`].filter(Boolean).join(' · ')}
        </p>
        <p className="font-body text-body-lg text-on-surface">{movie.synopsis}</p>
      </div>

      {related.length ? <MovieRow title="Mais como este" movies={related} /> : null}
    </div>
  );
}
