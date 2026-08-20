'use client';

import { Fragment, useEffect, useState } from 'react';
import { consumeJustLoggedIn } from '../../context/UserContext';
import { consumePendingDonationPrompt } from '../../lib/donationPrompt';
import { api } from '../../lib/api';
import { getCached, setCached } from '../../lib/clientCache';
import HeroCarousel from '../../components/HeroCarousel';
import MovieRow from '../../components/MovieRow';
import NewsletterForm from '../../components/NewsletterForm';
import LoadingScreen from '../../components/LoadingScreen';
import DonationModal from '../../components/DonationModal';
import AdBand from '../../components/AdBand';

const ADSENSE_SLOT_HOME = process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME;

export default function HomePage() {
  const cached = getCached('home');
  const [featured, setFeatured] = useState(cached?.featured ?? null);
  const [recent, setRecent] = useState(cached?.recent ?? null);
  const [genres, setGenres] = useState(cached?.genres ?? null);
  const [showDonation, setShowDonation] = useState(false);

  useEffect(() => {
    if (consumeJustLoggedIn() || consumePendingDonationPrompt()) setShowDonation(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.listFeaturedPublic(),
      api.listMoviesPublic({ limit: 12, sort: 'recent' }),
      api.listGenresPublic(),
    ]).then(([{ data: featuredData }, { data: recentData }, { data: genresData }]) => {
      if (cancelled) return;
      setFeatured(featuredData);
      setRecent(recentData);
      setGenres(genresData);
      setCached('home', { featured: featuredData, recent: recentData, genres: genresData });
    });
    return () => {
      cancelled = true;
    };
  }, []);

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
        <HomeAdBlock />
        <MovieRow title="Em destaque" movies={featured} icon="local_fire_department" />
        <HomeAdBlock />
        <MovieRow title="Adicionados recentemente" movies={recent} />
        <HomeAdBlock />
        {genres.map((genre) => (
          <Fragment key={genre}>
            <GenreRow genre={genre} />
            <HomeAdBlock />
          </Fragment>
        ))}
      </div>

      <NewsletterForm />
      {showDonation ? <DonationModal onClose={() => setShowDonation(false)} /> : null}
    </>
  );
}

function HomeAdBlock() {
  return <AdBand slotId={ADSENSE_SLOT_HOME} />;
}

function GenreRow({ genre }) {
  const cacheKey = `home-genre-row:${genre}`;
  const [movies, setMovies] = useState(() => getCached(cacheKey) ?? null);

  useEffect(() => {
    let cancelled = false;
    api.listMoviesPublic({ genre, limit: 12 }).then(({ data }) => {
      if (cancelled) return;
      setMovies(data);
      setCached(cacheKey, data);
    });
    return () => {
      cancelled = true;
    };
  }, [genre]);

  if (!movies) return null;
  return <MovieRow title={genre} movies={movies} viewAllHref={`/genre/${encodeURIComponent(genre)}`} />;
}
