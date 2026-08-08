'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import { api } from '../lib/api';

export default function FavoriteButton({ movieId, className = '' }) {
  const router = useRouter();
  const { user, token, refreshUser } = useUser();
  const isFavorite = !!user?.favorites?.some((m) => m._id === movieId);

  async function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push('/entrar');
      return;
    }

    try {
      if (isFavorite) {
        await api.removeFavorite(movieId, token);
      } else {
        await api.addFavorite(movieId, token);
      }
      await refreshUser();
    } catch {
      // silencioso — se der erro (ex: token expirou) o próximo clique tenta de novo
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isFavorite ? 'Remover da Minha Lista' : 'Adicionar à Minha Lista'}
      className={`flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors ${className}`}
    >
      <span
        className="material-symbols-outlined text-white"
        style={isFavorite ? { fontVariationSettings: "'FILL' 1" } : undefined}
      >
        favorite
      </span>
    </button>
  );
}
