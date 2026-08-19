'use client';

import { useEffect, useState } from 'react';
import { useUser, consumeJustLoggedIn } from '../../context/UserContext';
import { api } from '../../lib/api';
import { getCached, setCached } from '../../lib/clientCache';
import HeroCarousel from '../../components/HeroCarousel';
import MovieRow from '../../components/MovieRow';
import NewsletterForm from '../../components/NewsletterForm';
import LoadingScreen from '../../components/LoadingScreen';
import DonationModal from '../../components/DonationModal';
import AdSlot from '../../components/AdSlot';
import AdsterraBanner from '../../components/AdsterraBanner';

const ADSENSE_SLOT_HOME = process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME;

export default function HomePage() {
  const { token } = useUser();
  const cached = getCached('home');
  const [featured, setFeatured] = useState(cached?.featured ?? null);
  const [recent, setRecent] = useState(cached?.recent ?? null);
  const [genres, setGenres] = useState(cached?.genres ?? null);
  const [showDonation, setShowDonation] = useState(false);

  useEffect(() => {
    if (consumeJustLoggedIn()) setShowDonation(true);
  }, []);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    Promise.all([api.listFeatured(token), api.listMovies({ limit: 12 }, token), api.listGenres(token)]).then(
      ([{ data: featuredData }, { data: recentData }, { data: genresData }]) => {
        if (cancelled) return;
        setFeatured(featuredData);
        setRecent(recentData);
        setGenres(genresData);
        setCached('home', { featured: featuredData, recent: recentData, genres: genresData });
      }
    );
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!featured || !recent || !genres) {
    return (
      <>
        <LoadingScreen />
        {showDonation ? <DonationModal onClose={() => setShowDonation(false)} /> : null}
      </>
    );
  }

  const heroMovies = featured.length ? featured : recent.slice(0, 1);

  return (
    <>
      <HeroCarousel movies={heroMovies} />

      <div className="container mx-auto px-container-margin py-12 space-y-16 -mt-16 relative z-20">
        <MovieRow title="Em destaque" movies={featured} icon="local_fire_department" />
        <MovieRow title="Adicionados recentemente" movies={recent} />
        <div>
          <AdSlot slotId={ADSENSE_SLOT_HOME} />
          <AdsterraBanner size="728x90" />
        </div>
        {genres.map((genre) => (
          <GenreRow key={genre} genre={genre} token={token} />
        ))}
      </div>

      <NewsletterForm />
      {showDonation ? <DonationModal onClose={() => setShowDonation(false)} /> : null}
    </>
  );
}

function GenreRow({ genre, token }) {
  const cacheKey = `home-genre-row:${genre}`;
  const [movies, setMovies] = useState(() => getCached(cacheKey) ?? null);

  useEffect(() => {
    let cancelled = false;
    api.listMovies({ genre, limit: 12 }, token).then(({ data }) => {
      if (cancelled) return;
      setMovies(data);
      setCached(cacheKey, data);
    });
    return () => {
      cancelled = true;
    };
  }, [genre, token]);

  if (!movies) return null;
  return <MovieRow title={genre} movies={movies} viewAllHref={`/genre/${encodeURIComponent(genre)}`} />;
}
