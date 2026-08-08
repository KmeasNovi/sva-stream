import { api } from '../../lib/api';
import Catalog from '../../components/Catalog';

export default async function CatalogoPage() {
  const { data: movies } = await api.listMovies({ limit: 2000 });
  return <Catalog movies={movies} />;
}
