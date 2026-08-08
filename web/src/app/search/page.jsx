import { Suspense } from 'react';
import { api } from '../../lib/api';
import Explore from '../../components/Explore';

export default async function SearchPage() {
  const { data: genres } = await api.listGenres();

  const genreTiles = await Promise.all(
    genres.map(async (genre) => {
      const { data } = await api.listMovies({ genre, limit: 1 });
      const cover = data[0]?.backdropUrl || data[0]?.posterUrl || null;
      return { genre, cover };
    })
  );

  return (
    <Suspense>
      <Explore genreTiles={genreTiles} />
    </Suspense>
  );
}
