'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const links = [
  { href: '/admin/dashboard', label: 'Filmes' },
  { href: '/admin/dashboard/usuarios', label: 'Usuários' },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem('sva_admin_token');
    router.push('/admin/login');
  }

  return (
    <div className="flex justify-between items-center mb-10">
      <nav className="flex gap-2">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg font-body text-label-bold transition-colors ${
                active
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-lg border border-white/20 text-on-surface-variant hover:bg-white/10 transition-colors font-body text-label-bold"
      >
        Sair
      </button>
    </div>
  );
}
