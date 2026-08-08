import Link from 'next/link';

export default function MovieCard({ movie }) {
  return (
    <Link
      href={`/movie/${movie.slug}`}
      className="flex-none w-[160px] md:w-[220px] aspect-[2/3] relative rounded-2xl overflow-hidden group snap-start cursor-pointer border border-white/5 bg-surface-container"
    >
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <p className="font-display text-headline-md text-white text-base mb-2 truncate">{movie.title}</p>
        <button className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center mx-auto hover:scale-110 transition-transform shadow-[0_0_15px_rgba(74,225,118,0.5)]">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            play_arrow
          </span>
        </button>
      </div>
    </Link>
  );
}
