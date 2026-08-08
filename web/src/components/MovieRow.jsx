'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import MovieCard from './MovieCard';

export default function MovieRow({ title, movies, viewAllHref, icon }) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [updateScrollState, movies]);

  function scrollByAmount(direction) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: 'smooth' });
    setTimeout(updateScrollState, 350);
  }

  if (!movies?.length) return null;

  return (
    <section className="group/row">
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

      <div className="relative">
        {canScrollLeft ? (
          <button
            aria-label="Voltar"
            onClick={() => scrollByAmount(-1)}
            className="hidden md:flex absolute left-0 top-0 bottom-8 z-10 w-12 items-center justify-center bg-gradient-to-r from-background via-background/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <span className="material-symbols-outlined text-white text-3xl drop-shadow-lg">chevron_left</span>
          </button>
        ) : null}

        <div
          ref={trackRef}
          onScroll={updateScrollState}
          className="flex overflow-x-auto gap-4 pb-8 hide-scrollbar snap-x snap-mandatory"
        >
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>

        {canScrollRight ? (
          <button
            aria-label="Avançar"
            onClick={() => scrollByAmount(1)}
            className="hidden md:flex absolute right-0 top-0 bottom-8 z-10 w-12 items-center justify-center bg-gradient-to-l from-background via-background/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <span className="material-symbols-outlined text-white text-3xl drop-shadow-lg">chevron_right</span>
          </button>
        ) : null}
      </div>
    </section>
  );
}
