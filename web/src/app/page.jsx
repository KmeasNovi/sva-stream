'use client';

import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { api } from '../lib/api';
import HeroCarousel from '../components/HeroCarousel';
import MovieRow from '../components/MovieRow';
import NewsletterForm from '../components/NewsletterForm';

export default function HomePage() {
  const { token } = useUser();
  const [featured, setFeatured] = useState(null);
  const [recent, setRecent] = useState(null);
  const [genres, setGenres] = useState(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    Promise.all([api.listFeatured(token), api.listMovies({ limit: 12 }, token), api.listGenres(token)]).then(
      ([{ data: featuredData }, { data: recentData }, { data: genresData }]) => {
        if (cancelled) return;
        setFeatured(featuredData);
        setRecent(recentData);
        setGenres(genresData);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!featured || !recent || !genres) {
    return (
      <div className="container mx-auto px-container-margin py-16">
        <p className="font-body text-body-md text-on-surface-variant">Carregando...</p>
      </div>
    );
  }

  const heroMovies = featured.length ? featured : recent.slice(0, 1);

  return (
    <>
      <HeroCarousel movies={heroMovies} />

      <div className="container mx-auto px-container-margin py-12 space-y-16 -mt-16 relative z-20">
        <MovieRow title="Em destaque" movies={featured} icon="local_fire_department" />
        <MovieRow title="Adicionados recentemente" movies={recent} />
        {genres.map((genre) => (
          <GenreRow key={genre} genre={genre} token={token} />
        ))}
      </div>

      <NewsletterForm />
    </>
  );
}

function GenreRow({ genre, token }) {
  const [movies, setMovies] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.listMovies({ genre, limit: 12 }, token).then(({ data }) => {
      if (!cancelled) setMovies(data);
    });
    return () => {
      cancelled = true;
    };
  }, [genre, token]);

  if (!movies) return null;
  return <MovieRow title={genre} movies={movies} viewAllHref={`/genre/${encodeURIComponent(genre)}`} />;
}
