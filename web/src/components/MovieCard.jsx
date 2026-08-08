import Link from 'next/link';

export default function MovieCard({ movie }) {
  return (
    <Link href={`/movie/${movie.slug}`} className="flex-none w-[160px] md:w-[220px] snap-start cursor-pointer group">
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 bg-surface-container">
        {movie.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={movie.posterUrl}
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4 text-center text-on-surface-variant font-body text-body-md">
            {movie.title}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_15px_rgba(74,225,118,0.5)]">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              play_arrow
            </span>
          </button>
        </div>
      </div>
      <p className="font-display text-on-background text-sm md:text-base mt-2 leading-snug group-hover:text-primary transition-colors">
        {movie.title}
      </p>
      {movie.year ? <p className="font-body text-on-surface-variant text-xs mt-0.5">{movie.year}</p> : null}
    </Link>
  );
}
