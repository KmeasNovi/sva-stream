import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '../../../lib/api';
import Player from '../../../components/Player';
import MovieRow from '../../../components/MovieRow';
import FavoriteButton from '../../../components/FavoriteButton';
import AdSlot from '../../../components/AdSlot';
import AdBand from '../../../components/AdBand';
import AdsterraNativeBanner from '../../../components/AdsterraNativeBanner';
import MovieDonationPrompt from '../../../components/MovieDonationPrompt';

const ADSENSE_SLOT_MOVIE_ABOVE_PLAYER = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOVIE_ABOVE_PLAYER;
const ADSENSE_SLOT_MOVIE_TOP = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOVIE_TOP;
const ADSENSE_SLOT_MOVIE_MID = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOVIE_MID;
const ADSENSE_SLOT_MOVIE_PREROLL = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOVIE_PREROLL;

const SITE_URL = 'https://sepiastream.com';

// Marcação schema.org — ajuda o Google a entender que a página é um filme
// (não um post de blog qualquer) e pode gerar resultado mais rico na busca
// (pôster, avaliação de gênero, diretor). Escapamos "<" pra evitar que um
// campo com esse caractere feche a tag <script> prematuramente.
function buildMovieJsonLd(movie) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    url: `${SITE_URL}/movie/${movie.slug}`,
    image: movie.posterUrl || movie.backdropUrl || undefined,
    description: movie.synopsis || undefined,
    genre: movie.genres?.length ? movie.genres : undefined,
    dateCreated: movie.year ? String(movie.year) : undefined,
    director: movie.director ? { '@type': 'Person', name: movie.director } : undefined,
    actor: movie.cast?.length ? movie.cast.map((name) => ({ '@type': 'Person', name })) : undefined,
    duration: movie.runtimeMinutes ? `PT${movie.runtimeMinutes}M` : undefined,
    inLanguage: movie.language || undefined,
  };
  return JSON.stringify(jsonLd).replace(/</g, '\\u003c');
}

// Mesma lógica de resolução de URL do Player.jsx (ver comentário lá): quando
// não há videoFileUrl direto, o filme toca via iframe de embed do provedor —
// pro archive.org, source.id pode ser "identifier" ou "identifier/arquivo.mp4"
// quando o filme é um arquivo específico dentro de uma coleção.
function getEmbedUrl(source) {
  if (!source?.id) return undefined;
  if (source.provider === 'youtube') {
    return `https://www.youtube.com/embed/${source.id}`;
  }
  if (source.provider === 'archive') {
    if (source.id.includes('/')) {
      const slashIndex = source.id.indexOf('/');
      const identifier = source.id.slice(0, slashIndex);
      const filename = source.id.slice(slashIndex + 1);
      return `https://archive.org/embed/${identifier}/${encodeURIComponent(filename)}`;
    }
    return `https://archive.org/embed/${source.id}`;
  }
  return undefined;
}

// Marcação schema.org/VideoObject — campos exigidos pelo relatório de vídeo
// do Search Console (name, description, thumbnailUrl, uploadDate e um de
// contentUrl/embedUrl), que o @type Movie sozinho não cobre. uploadDate usa
// a data em que o filme entrou no catálogo (createdAt) — não existe "data de
// upload" real pra uma obra de domínio público, essa é a aproximação mais
// correta disponível (quando o vídeo passou a estar nesta URL).
function buildVideoJsonLd(movie) {
  const thumbnails = [movie.posterUrl, movie.backdropUrl].filter(Boolean);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: movie.title,
    description: movie.synopsis || undefined,
    thumbnailUrl: thumbnails.length ? thumbnails : undefined,
    uploadDate: movie.createdAt || undefined,
    duration: movie.runtimeMinutes ? `PT${movie.runtimeMinutes}M` : undefined,
    contentUrl: movie.videoFileUrl || undefined,
    embedUrl: movie.videoFileUrl ? undefined : getEmbedUrl(movie.source),
  };
  return JSON.stringify(jsonLd).replace(/</g, '\\u003c');
}

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildMovieJsonLd(movie) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildVideoJsonLd(movie) }}
      />

      <Link
        href="/"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-secondary transition-colors font-body text-label-bold"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        Voltar
      </Link>

      <AdBand slotId={ADSENSE_SLOT_MOVIE_ABOVE_PLAYER} compact />

      <Player
        slug={movie.slug}
        source={movie.source}
        title={movie.title}
        videoFileUrl={movie.videoFileUrl}
        subtitleUrl={movie.subtitleUrl}
        posterUrl={movie.posterUrl || movie.backdropUrl}
        relatedMovies={related}
        runtimeMinutes={movie.runtimeMinutes}
        preRollSlotId={ADSENSE_SLOT_MOVIE_PREROLL}
      />

      <AdBand slotId={ADSENSE_SLOT_MOVIE_TOP} />

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
      <AdsterraNativeBanner />

      {related?.length ? <MovieRow title="Mais como este" movies={related} /> : null}

      <MovieDonationPrompt />
    </div>
  );
}
