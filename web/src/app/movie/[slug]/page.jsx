import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '../../../lib/api';
import Player from '../../../components/Player';
import MovieRow from '../../../components/MovieRow';
import FavoriteButton from '../../../components/FavoriteButton';
import AdSlot from '../../../components/AdSlot';

const ADSENSE_SLOT_MOVIE_ABOVE_PLAYER = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOVIE_ABOVE_PLAYER;
const ADSENSE_SLOT_MOVIE_TOP = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOVIE_TOP;
const ADSENSE_SLOT_MOVIE_MID = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOVIE_MID;

async function fetchMovie(slug) {
  try {
    const { data } = await api.getMoviePublic(slug);
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const data = await fetchMovie(params.slug);
  if (!data?.movie) {
    return { title: 'Filme não encontrado — SepiaStream' };
  }

  const { movie } = data;
  const title = `${movie.title}${movie.year ? ` (${movie.year})` : ''} — Assista grátis | SepiaStream`;
  const description = movie.synopsis
    ? movie.synopsis.slice(0, 155)
    : `Assista ${movie.title} grátis, legal e sem cadastro obrigatório no SepiaStream.`;

  return {
    title,
    description,
    alternates: { canonical: `/movie/${movie.slug}` },
    openGraph: {
      title,
      description,
      type: 'video.movie',
      images: movie.posterUrl ? [movie.posterUrl] : undefined,
    },
  };
}

export default async function MoviePage({ params }) {
  const data = await fetchMovie(params.slug);

  if (!data?.movie) {
    notFound();
  }

  const { movie, related } = data;

  return (
    <div className="container mx-auto px-container-margin py-8 space-y-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-secondary transition-colors font-body text-label-bold"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        Voltar
      </Link>

      <AdSlot slotId={ADSENSE_SLOT_MOVIE_ABOVE_PLAYER} />

      <Player
        source={movie.source}
        title={movie.title}
        videoFileUrl={movie.videoFileUrl}
        subtitleUrl={movie.subtitleUrl}
      />

      <AdSlot slotId={ADSENSE_SLOT_MOVIE_TOP} />

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

      <AdSlot slotId={ADSENSE_SLOT_MOVIE_MID} />

      {related?.length ? <MovieRow title="Mais como este" movies={related} /> : null}
    </div>
  );
}
