import Image from 'next/image';
import Link from 'next/link';

// Cabeçalho das páginas de flyer.sepiastream.com (flyer em "/" e formulário
// em "/contratar"). `acao` é o link da direita, que muda por página.
export default function SvaFlyerHeader({ acao }) {
  return (
    <header className="container mx-auto px-container-margin py-5 flex items-center justify-between gap-4">
      <Link href="/" className="flex items-center gap-3">
        <Image src="/logo-icon.png" alt="" width={40} height={40} />
        <span className="font-display text-body-lg font-bold text-on-background">
          SepiaStream <span className="text-secondary">SVA</span>
        </span>
      </Link>
      {acao ? (
        <Link
          href={acao.href}
          className={
            acao.destaque
              ? 'bg-primary text-on-primary font-body text-label-bold px-5 py-2.5 rounded-lg hover:shadow-[0_0_20px_rgba(var(--glow-primary),0.4)] transition-all whitespace-nowrap'
              : 'font-body text-label-bold text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap'
          }
        >
          {acao.label}
        </Link>
      ) : null}
    </header>
  );
}
