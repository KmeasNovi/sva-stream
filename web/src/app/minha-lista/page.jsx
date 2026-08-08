'use client';

import Link from 'next/link';
import { useUser } from '../../context/UserContext';
import MovieCard from '../../components/MovieCard';

export default function MinhaListaPage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="container mx-auto px-container-margin py-12">
        <p className="font-body text-body-md text-on-surface-variant">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-container-margin py-16 max-w-md">
        <div className="glass-panel rounded-2xl p-8 space-y-4 text-center">
          <span className="material-symbols-outlined text-secondary text-5xl">favorite</span>
          <h1 className="font-display text-headline-md text-on-background">Minha Lista</h1>
          <p className="font-body text-body-md text-on-surface-variant">
            Entre na sua conta para salvar filmes e vê-los aqui.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/entrar?next=/minha-lista"
              className="bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="border border-primary/30 text-primary font-body text-label-bold px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-container-margin py-12">
      <h1 className="font-display text-headline-lg mb-8 text-on-background">Minha Lista</h1>
      <div className="flex flex-wrap gap-4">
        {(user.favorites || []).map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
        {!user.favorites?.length ? (
          <p className="font-body text-body-md text-on-surface-variant">
            Você ainda não favoritou nenhum filme. Clique no coração de um filme para adicioná-lo aqui.
          </p>
        ) : null}
      </div>
    </div>
  );
}
