import { api } from '../../lib/api';
import Catalog from '../../components/Catalog';
import MovieDonationPrompt from '../../components/MovieDonationPrompt';

export const metadata = {
  title: 'Catálogo completo — SepiaStream',
  description: 'Todos os filmes e curtas de animação clássicos do SepiaStream, em domínio público e grátis, num só lugar.',
  alternates: { canonical: '/catalogo' },
};

async function fetchMovies() {
  try {
    const { data } = await api.listMoviesPublic();
    return data || [];
  } catch {
    return [];
  }
}

export default async function CatalogoPage() {
  const movies = await fetchMovies();

  return (
    <>
      <Catalog movies={movies} />
      <MovieDonationPrompt />
    </>
  );
}
