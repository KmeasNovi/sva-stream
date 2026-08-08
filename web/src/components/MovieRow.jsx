import Link from 'next/link';
import MovieCard from './MovieCard';

export default function MovieRow({ title, movies, viewAllHref, icon }) {
  if (!movies?.length) return null;

  return (
    <section>
      <div className="flex justify-between items-end mb-6">
        <h3 className="font-display text-headline-md text-on-background flex items-center gap-2">
          {title}
          {icon ? (
            <span className="material-symbols-outlined text-secondary text-lg">{icon}</span>
          ) : null}
        </h3>
        {viewAllHref ? (
          <Link href={viewAllHref} className="font-body text-label-bold text-primary hover:text-primary-fixed transition-colors">
            Ver tudo
          </Link>
        ) : null}
      </div>
      <div className="flex overflow-x-auto gap-4 pb-8 hide-scrollbar snap-x snap-mandatory">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
