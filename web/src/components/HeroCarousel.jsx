'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { proxiedImage } from '../lib/imageProxy';

const AUTO_ADVANCE_MS = 7000;

export default function HeroCarousel({ movies }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = movies.length;
  const timerRef = useRef(null);

  const goTo = useCallback(
    (i) => {
      setIndex(((i % count) + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (count < 2 || paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timerRef.current);
  }, [count, paused]);

  if (!count) return null;

  const highlight = movies[index];

  return (
    <section
      className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden group/hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {movies.map((movie, i) => (
        <div
          key={movie._id}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === index ? 'opacity-100 z-0' : 'opacity-0 -z-10'
          }`}
        >
          <Image
            src={proxiedImage(movie.backdropUrl || movie.posterUrl, 1600)}
            alt={movie.title}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-top filter brightness-75"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent z-10 pointer-events-none" />

      <div className="relative z-20 container mx-auto px-container-margin h-full flex flex-col justify-end pb-24 md:pb-32">
        <div key={highlight._id} className="max-w-2xl animate-hero-in">
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
          <h2 className="font-display text-headline-lg-mobile md:text-display-xl text-white mb-4 leading-tight drop-shadow-2xl line-clamp-2">
            {highlight.title}
          </h2>
          <p className="font-body text-body-lg text-on-surface mb-8 max-w-xl line-clamp-2 md:line-clamp-3">
            {highlight.synopsis}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href={`/movie/${highlight.slug}`}
              className="flex items-center gap-2 bg-primary text-on-primary font-body text-label-bold px-8 py-4 rounded-lg hover:bg-primary-fixed hover:shadow-[0_0_20px_rgba(var(--glow-primary),0.4)] hover:scale-105 transition-all duration-300"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_arrow
              </span>
              Assistir agora
            </a>
          </div>
        </div>
      </div>

      {count > 1 ? (
        <>
          <button
            aria-label="Filme anterior"
            onClick={() => goTo(index - 1)}
            className="hidden md:flex absolute left-0 top-0 bottom-0 z-20 w-16 items-center justify-center bg-gradient-to-r from-black/40 to-transparent opacity-0 group-hover/hero:opacity-100 transition-opacity"
          >
            <span className="material-symbols-outlined text-white text-4xl drop-shadow-lg">chevron_left</span>
          </button>
          <button
            aria-label="Próximo filme"
            onClick={() => goTo(index + 1)}
            className="hidden md:flex absolute right-0 top-0 bottom-0 z-20 w-16 items-center justify-center bg-gradient-to-l from-black/40 to-transparent opacity-0 group-hover/hero:opacity-100 transition-opacity"
          >
            <span className="material-symbols-outlined text-white text-4xl drop-shadow-lg">chevron_right</span>
          </button>

          <div className="absolute bottom-8 right-6 md:right-8 z-20 flex gap-2">
            {movies.map((movie, i) => (
              <button
                key={movie._id}
                aria-label={`Ir para ${movie.title}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-8 bg-primary' : 'w-4 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
