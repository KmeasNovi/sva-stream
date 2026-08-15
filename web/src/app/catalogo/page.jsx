import { api } from '../../lib/api';
import Catalog from '../../components/Catalog';
import MovieDonationPrompt from '../../components/MovieDonationPrompt';

export const metadata = {
  title: 'Catálogo completo — SepiaStream',
  description: 'Todos os filmes e curtas de animação clássicos do SepiaStream, em domínio público e grátis, num só lugar.',
  alternates: { canonical: '/catalogo' },
};

const PAGE_SIZE = 60;

async function fetchFirstPage() {
  try {
    const { data, pagination } = await api.listMoviesPublic({ page: 1, limit: PAGE_SIZE, sort: 'alpha' });
    return { movies: data || [], pagination: pagination || null };
  } catch {
    return { movies: [], pagination: null };
  }
}

export default async function CatalogoPage() {
  const { movies, pagination } = await fetchFirstPage();

  return (
    <>
      <Catalog initialMovies={movies} initialPagination={pagination} pageSize={PAGE_SIZE} />
      <MovieDonationPrompt />
    </>
  );
}
