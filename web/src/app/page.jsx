import { api } from '../lib/api';
import MovieRow from '../components/MovieRow';
import NewsletterForm from '../components/NewsletterForm';

export default async function HomePage() {
  const [{ data: featured }, { data: recent }, { data: genres }] = await Promise.all([
    api.listMovies({ featured: 'true', limit: 10 }),
    api.listMovies({ limit: 12 }),
    api.listGenres(),
  ]);

  const highlight = featured[0] || recent[0];

  return (
    <>
      {highlight ? (
        <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent z-10 pointer-events-none" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={highlight.backdropUrl || highlight.posterUrl}
            alt={highlight.title}
            className="absolute inset-0 w-full h-full object-cover object-top filter brightness-75"
          />
          <div className="relative z-20 container mx-auto px-container-margin h-full flex flex-col justify-end pb-24 md:pb-32">
            <div className="max-w-2xl">
              <div className="flex flex-wrap gap-2 mb-4">
                {highlight.year ? (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                    {highlight.year}
                  </span>
                ) : null}
                {highlight.genres?.slice(0, 2).map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface/50 text-on-surface backdrop-blur-md border border-white/10"
                  >
                    {g}
                  </span>
                ))}
              </div>
              <h2 className="font-display text-headline-lg-mobile md:text-display-xl text-white mb-4 leading-tight drop-shadow-2xl">
                {highlight.title}
              </h2>
              <p className="font-body text-body-lg text-on-surface mb-8 max-w-xl">{highlight.synopsis}</p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={`/movie/${highlight.slug}`}
                  className="flex items-center gap-2 bg-primary text-on-primary font-body text-label-bold px-8 py-4 rounded-lg hover:bg-primary-fixed hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 transition-all duration-300"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    play_arrow
                  </span>
                  Assistir agora
                </a>
              </div>
            </div>
          </div>
        </section>
      ) : null}

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
