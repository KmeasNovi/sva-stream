import { api } from '../../../lib/api';
import MovieCard from '../../../components/MovieCard';

export default async function GenrePage({ params }) {
  const { genre } = await params;
  const decoded = decodeURIComponent(genre);
  const { data: movies } = await api.listMovies({ genre: decoded, limit: 50 });

  return (
    <div className="container mx-auto px-container-margin py-12">
      <h1 className="font-display text-headline-lg mb-8 text-on-background">{decoded}</h1>
      <div className="flex flex-wrap gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
        {!movies.length ? (
          <p className="font-body text-body-md text-on-surface-variant">Nenhum filme neste gênero ainda.</p>
        ) : null}
      </div>
    </div>
  );
}
