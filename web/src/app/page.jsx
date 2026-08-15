import Link from 'next/link';
import Image from 'next/image';
import LandingRedirect from '../components/LandingRedirect';
import AdSlot from '../components/AdSlot';
import { api } from '../lib/api';
import { proxiedImage } from '../lib/imageProxy';

const ADSENSE_SLOT_LANDING = process.env.NEXT_PUBLIC_ADSENSE_SLOT_LANDING;

export const metadata = {
  title: 'SepiaStream — Cinema clássico e curtas de animação, grátis',
  description:
    'Centenas de filmes e curtas de animação clássicos, 100% gratuitos, num catálogo estilo streaming. Sem mensalidade. Crie sua conta e assista agora.',
  openGraph: {
    title: 'SepiaStream — Cinema clássico e curtas de animação, grátis',
    description:
      'Centenas de filmes e curtas de animação clássicos, 100% gratuitos, num catálogo estilo streaming. Crie sua conta e assista agora.',
    type: 'website',
    images: ['/logo-icon.png'],
  },
};

// Fallback estático — usado só se a API estiver fora do ar na hora do build/
// request (ex: Render "dormindo" no plano free). Com a API no ar, a lista
// real e crescente do catálogo (buscada em fetchHighlights) substitui isso.
const FALLBACK_POSTERS = [
  {
    title: 'Nosferatu',
    slug: 'nosferatu',
    src: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Nosferatu_poster_%28Albin_Grau%2C_1922%29_1.jpg/500px-Nosferatu_poster_%28Albin_Grau%2C_1922%29_1.jpg',
  },
  {
    title: 'Night of the Living Dead',
    slug: 'night-of-the-living-dead',
    src: 'https://upload.wikimedia.org/wikipedia/en/9/91/Night_of_the_Living_Dead_%281968%29_poster.jpg',
  },
  {
    title: 'The Cabinet of Dr. Caligari',
    slug: 'the-cabinet-of-dr-caligari',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Das_Cabinet_des_Dr._Caligari.JPG/500px-Das_Cabinet_des_Dr._Caligari.JPG',
  },
  {
    title: 'His Girl Friday',
    slug: 'his-girl-friday',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/His_Girl_Friday_%281940_poster%29_crop.jpg/500px-His_Girl_Friday_%281940_poster%29_crop.jpg',
  },
];

async function fetchHighlights() {
  try {
    const { data } = await api.listHighlights();
    if (data?.length) {
      return data.map((m) => ({
        title: m.title,
        slug: m.slug,
        year: m.year,
        src: proxiedImage(m.posterUrl || m.backdropUrl, 400),
      }));
    }
  } catch {
    // segue pro fallback abaixo
  }
  return FALLBACK_POSTERS.map((p) => ({ ...p, src: proxiedImage(p.src, 400) }));
}

const FEATURES = [
  {
    icon: 'play_circle',
    title: 'Comece agora mesmo',
    desc: 'Sem trailer, sem espera: crie sua conta e já cai direto no catálogo, pronto pra assistir.',
  },
  {
    icon: 'movie',
    title: 'Catálogo enorme',
    desc: 'Centenas de clássicos e curtas raros, sempre crescendo — tem coisa nova toda semana.',
  },
  {
    icon: 'payments',
    title: 'Sem mensalidade',
    desc: 'Conta grátis pra sempre. Sem cartão de crédito, sem pegadinha, sem cobrança escondida.',
  },
  {
    icon: 'video_library',
    title: 'Cinema e curtas',
    desc: 'Longas clássicos e curtas de animação raros, organizados por gênero.',
  },
];

export default async function LandingPage() {
  const highlights = await fetchHighlights();

  return (
    <>
      <LandingRedirect />
      <div className="overflow-x-hidden">
        <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 p-2 opacity-30 -rotate-2 scale-110">
            {[...highlights, ...highlights].map((p, i) => (
              <div key={`${p.slug}-${i}`} className="relative aspect-[2/3] rounded-xl overflow-hidden bg-surface-container">
                <Image src={p.src} alt="" fill sizes="20vw" className="object-cover" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-transparent" />

          <div className="relative z-10 text-center px-container-margin max-w-3xl animate-hero-in">
            <Image
              src="/logo-icon.png"
              alt="SepiaStream"
              width={140}
              height={140}
              priority
              className="mx-auto mb-4 w-[100px] h-[100px] md:w-[140px] md:h-[140px]"
            />
            <h1 className="font-display text-headline-lg-mobile md:text-display-xl text-on-background mb-6">
              Cinema <span className="text-secondary">clássico</span>, <span className="text-primary">grátis</span> pra sempre
            </h1>
            <p className="font-body text-body-lg text-on-surface-variant mb-10 max-w-xl mx-auto">
              Centenas de filmes e curtas de animação clássicos, num catálogo estilo streaming. Sem mensalidade — só criar conta e assistir.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/cadastro"
                className="bg-primary text-on-primary font-body text-label-bold px-8 py-4 rounded-lg hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all"
              >
                Criar conta grátis
              </Link>
              <Link
                href="/entrar"
                className="glass-panel text-on-background font-body text-label-bold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors"
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-container-margin py-20">
          <h2 className="font-display text-headline-lg text-center text-on-background mb-12">Por que o SepiaStream?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="glass-panel rounded-2xl p-6 text-center">
                <span className="material-symbols-outlined text-secondary text-4xl mb-3 inline-block">{f.icon}</span>
                <h3 className="font-display text-headline-md text-on-background mb-2">{f.title}</h3>
                <p className="font-body text-body-md text-on-surface-variant">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-container-margin py-20">
          <h2 className="font-display text-headline-lg text-center text-on-background mb-4">Alguns clássicos do catálogo</h2>
          <p className="font-body text-body-md text-center text-on-surface-variant mb-12 max-w-xl mx-auto">
            Uma pequena amostra — o catálogo completo tem centenas de filmes e curtas, sempre crescendo.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {highlights.map((m) => (
              <Link
                key={m.slug}
                href={`/movie/${m.slug}`}
                className="group block rounded-xl overflow-hidden bg-surface-container border border-white/5 hover:border-primary/40 transition-colors"
              >
                <div className="relative aspect-[2/3]">
                  <Image
                    src={m.src}
                    alt={`Assistir ${m.title} grátis`}
                    fill
                    sizes="(min-width: 768px) 20vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="font-body text-body-sm text-on-background p-2 truncate">
                  {m.title}
                  {m.year ? ` (${m.year})` : ''}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-container-margin">
          <AdSlot slotId={ADSENSE_SLOT_LANDING} />
        </section>

        <section className="container mx-auto px-container-margin pb-24">
          <div className="glass-panel rounded-3xl p-10 md:p-16 text-center max-w-3xl mx-auto glow-hover transition-all">
            <h2 className="font-display text-headline-lg text-on-background mb-4">Pronto pra maratonar clássicos?</h2>
            <p className="font-body text-body-lg text-on-surface-variant mb-8">Leva menos de um minuto pra criar sua conta.</p>
            <Link
              href="/cadastro"
              className="inline-block bg-secondary text-on-secondary font-body text-label-bold px-8 py-4 rounded-lg hover:shadow-[0_0_25px_rgba(74,225,118,0.5)] transition-all"
            >
              Começar agora
            </Link>
          </div>
        </section>

        <footer className="border-t border-white/5 py-8">
          <div className="container mx-auto px-container-margin flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image src="/logo-icon.png" alt="" width={28} height={28} />
              <span className="font-display text-headline-md text-secondary">SepiaStream</span>
            </div>
            <p className="font-body text-body-md text-on-surface-variant text-center sm:text-right">
              Cinema clássico e curtas de animação, sempre grátis.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/doacao" className="font-body text-body-md text-secondary hover:text-primary transition-colors">
                Apoie o site
              </Link>
              <Link href="/privacidade" className="font-body text-body-md text-on-surface-variant hover:text-primary transition-colors">
                Política de Privacidade
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
