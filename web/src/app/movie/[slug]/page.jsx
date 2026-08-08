import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '../../../lib/api';
import Player from '../../../components/Player';
import MovieRow from '../../../components/MovieRow';
import FavoriteButton from '../../../components/FavoriteButton';

export default async function MoviePage({ params }) {
  const { slug } = await params;

  let movie;
  try {
    ({ data: movie } = await api.getMovie(slug));
  } catch (err) {
    return notFound();
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

      <Suspense fallback={null}>
        <RelatedRow slug={movie.slug} genre={movie.genres?.[0]} />
      </Suspense>
    </div>
  );
}

async function RelatedRow({ slug, genre }) {
  if (!genre) return null;
  const { data } = await api.listMovies({ genre, limit: 13 });
  const related = data.filter((m) => m.slug !== slug);
  if (!related.length) return null;
  return <MovieRow title="Mais como este" movies={related} />;
}
