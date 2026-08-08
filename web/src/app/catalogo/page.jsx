import { api } from '../../lib/api';
import Catalog from '../../components/Catalog';

export default async function CatalogoPage() {
  const { data: movies } = await api.listMovies({ limit: 500 });
  return <Catalog movies={movies} />;
}
