'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';

const NAV_ITEMS = [
  { href: '/home', label: 'Home', icon: 'home' },
  { href: '/search', label: 'Explorar', icon: 'explore' },
  { href: '/catalogo', label: 'Catálogo', icon: 'video_library' },
  { href: '/minha-lista', label: 'Minha Lista', icon: 'favorite' },
];

function AccountControl() {
  const { user, logout } = useUser();
  const router = useRouter();

  if (!user) {
    return (
      <Link
        href="/entrar"
        className="font-body text-label-bold text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap"
      >
        Entrar
      </Link>
    );
  }

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden md:inline font-body text-label-bold text-on-background">{user.name.split(' ')[0]}</span>
      <button
        type="button"
        onClick={handleLogout}
        aria-label="Sair"
        className="text-on-surface-variant hover:text-error transition-colors"
      >
        <span className="material-symbols-outlined">logout</span>
      </button>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  function handleSearchSubmit(e) {
    e.preventDefault();
    const q = e.target.elements.q.value.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  }

  return (
    <>
      {/* Sidebar (Desktop) */}
      {user ? (
        <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[280px] pt-24 pb-8 flex-col z-30 bg-surface/5 backdrop-blur-3xl border-r border-white/5 shadow-2xl shadow-primary/20">
          <div className="px-6 mb-12 flex items-center gap-3">
            <Image src="/logo-icon.png" alt="" width={40} height={40} className="flex-none" />
            <div>
              <h1 className="font-display text-headline-md text-secondary">SepiaStream</h1>
              <p className="font-body text-body-md text-on-surface-variant mt-1">Cinema clássico, grátis</p>
            </div>
          </div>
          <nav className="flex-1 space-y-2">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? 'flex items-center gap-4 bg-primary/10 text-secondary border-l-4 border-secondary px-6 py-3 font-body text-label-bold transition-all duration-200 translate-x-1'
                      : 'flex items-center gap-4 text-on-surface-variant px-6 py-3 font-body text-label-bold hover:bg-white/5 hover:text-primary transition-all duration-300'
                  }
                >
                  <span className="material-symbols-outlined" style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
      ) : null}

      {/* Top App Bar */}
      <header
        className={`fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10 ${user ? 'md:pl-[304px]' : ''}`}
      >
        <div className="flex items-center md:hidden">
          <Link href={user ? '/home' : '/'} className="flex items-center gap-2">
            <Image src="/logo-icon.png" alt="" width={28} height={28} />
            <span className="font-display text-headline-md text-primary">SepiaStream</span>
          </Link>
        </div>
        {user ? (
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl hidden md:flex items-center mx-8 relative group">
            <span className="material-symbols-outlined absolute left-4 text-on-surface-variant group-focus-within:text-primary transition-colors">
              search
            </span>
            <input
              name="q"
              className="w-full bg-[#111111] text-on-background rounded-full pl-12 pr-4 py-2 border-none focus:outline-none focus:ring-1 focus:ring-primary focus:shadow-[0_0_15px_rgba(221,183,255,0.2)] transition-all font-body text-body-md placeholder:text-on-surface-variant/50"
              placeholder="Buscar filmes, gêneros..."
              type="search"
            />
          </form>
        ) : (
          <div className="flex-1 hidden md:flex items-center justify-center gap-2 pointer-events-none">
            <Image src="/logo-icon.png" alt="" width={28} height={28} />
            <div className="flex flex-col items-start leading-tight">
              <span className="font-display text-headline-md text-secondary">SepiaStream</span>
              <span className="font-body text-body-sm text-on-surface-variant mt-0.5">Cinema clássico, grátis</span>
            </div>
          </div>
        )}
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/search" className="md:hidden text-on-surface-variant hover:text-secondary transition-colors">
              <span className="material-symbols-outlined">search</span>
            </Link>
          ) : null}
          <AccountControl />
        </div>
      </header>

      {/* Bottom Nav (Mobile) */}
      {user ? (
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-highest/90 backdrop-blur-xl border-t border-white/10 z-50 px-6 py-3 flex justify-around items-center">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? 'flex flex-col items-center gap-1 text-primary' : 'flex flex-col items-center gap-1 text-on-surface-variant'}
              >
                <span className="material-symbols-outlined" style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                  {item.icon}
                </span>
                <span className="text-[10px] font-body font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      ) : null}
    </>
  );
}
