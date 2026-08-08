import Link from 'next/link';
import { api } from '../../../lib/api';
import MovieCard from '../../../components/MovieCard';

export default async function GenrePage({ params }) {
  const { genre } = await params;
  const decoded = decodeURIComponent(genre);
  const { data: movies } = await api.listMovies({ genre: decoded, limit: 2000 });

  return (
    <div className="container mx-auto px-container-margin py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/search"
          aria-label="Voltar para categorias"
          className="text-on-surface-variant hover:text-secondary transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="font-display text-headline-lg text-on-background">{decoded}</h1>
      </div>
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
