'use client';

import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { api } from '../../lib/api';
import { getCached, setCached } from '../../lib/clientCache';
import Catalog from '../../components/Catalog';
import LoadingScreen from '../../components/LoadingScreen';

export default function CatalogoPage() {
  const { token } = useUser();
  const [movies, setMovies] = useState(() => getCached('catalogo') ?? null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    api.listMovies({ limit: 2000 }, token).then(({ data }) => {
      if (cancelled) return;
      setMovies(data);
      setCached('catalogo', data);
    });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!movies) {
    return <LoadingScreen />;
  }

  return <Catalog movies={movies} />;
}
