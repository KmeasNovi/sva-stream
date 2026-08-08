'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/search', label: 'Explorar', icon: 'explore' },
  { href: '/catalogo', label: 'Catálogo', icon: 'video_library' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleSearchSubmit(e) {
    e.preventDefault();
    const q = e.target.elements.q.value.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  }

  return (
    <>
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[280px] pt-24 pb-8 flex-col z-30 bg-surface/5 backdrop-blur-3xl border-r border-white/5 shadow-2xl shadow-primary/20">
        <div className="px-6 mb-12">
          <h1 className="font-display text-headline-md text-secondary">CulStream</h1>
          <p className="font-body text-body-md text-on-surface-variant mt-1">Cinema clássico, grátis</p>
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

      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10 md:pl-[304px]">
        <div className="flex items-center md:hidden">
          <Link href="/" className="font-display text-headline-md text-primary">
            CulStream
          </Link>
        </div>
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
        <Link href="/search" className="md:hidden text-on-surface-variant hover:text-secondary transition-colors">
          <span className="material-symbols-outlined">search</span>
        </Link>
      </header>

      {/* Bottom Nav (Mobile) */}
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
    </>
  );
}
