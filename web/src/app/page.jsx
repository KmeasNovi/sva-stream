import { api } from '../lib/api';
import HeroCarousel from '../components/HeroCarousel';
import MovieRow from '../components/MovieRow';
import NewsletterForm from '../components/NewsletterForm';

export default async function HomePage() {
  const [{ data: featured }, { data: recent }, { data: genres }] = await Promise.all([
    api.listFeatured(),
    api.listMovies({ limit: 12 }),
    api.listGenres(),
  ]);

  const heroMovies = featured.length ? featured : recent.slice(0, 1);

  return (
    <>
      <HeroCarousel movies={heroMovies} />

      <div className="container mx-auto px-container-margin py-12 space-y-16 -mt-16 relative z-20">
        <MovieRow title="Em destaque" movies={featured} icon="local_fire_department" />
        <MovieRow title="Adicionados recentemente" movies={recent} />
        {genres.map((genre) => (
          <GenreRow key={genre} genre={genre} />
        ))}
      </div>

      <NewsletterForm />
    </>
  );
}

async function GenreRow({ genre }) {
  const { data: movies } = await api.listMovies({ genre, limit: 12 });
  return <MovieRow title={genre} movies={movies} viewAllHref={`/genre/${encodeURIComponent(genre)}`} />;
}
