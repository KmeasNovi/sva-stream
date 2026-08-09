'use client';

import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { api } from '../../lib/api';
import Catalog from '../../components/Catalog';

export default function CatalogoPage() {
  const { token } = useUser();
  const [movies, setMovies] = useState(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    api.listMovies({ limit: 2000 }, token).then(({ data }) => {
      if (!cancelled) setMovies(data);
    });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!movies) {
    return (
      <div className="container mx-auto px-container-margin py-16">
        <p className="font-body text-body-md text-on-surface-variant">Carregando...</p>
      </div>
    );
  }

  return <Catalog movies={movies} />;
}
