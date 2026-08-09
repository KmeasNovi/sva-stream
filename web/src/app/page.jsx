import Link from 'next/link';
import Image from 'next/image';
import LandingRedirect from '../components/LandingRedirect';

export const metadata = {
  title: 'CulStream — Cinema clássico e curtas de animação, grátis',
  description:
    'Centenas de filmes e curtas de animação clássicos, 100% gratuitos, num catálogo estilo streaming. Sem mensalidade, sem anúncio. Crie sua conta e assista agora.',
  openGraph: {
    title: 'CulStream — Cinema clássico e curtas de animação, grátis',
    description:
      'Centenas de filmes e curtas de animação clássicos, 100% gratuitos, num catálogo estilo streaming. Crie sua conta e assista agora.',
    type: 'website',
  },
};

const POSTERS = [
  {
    title: 'Nosferatu',
    src: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Nosferatu_poster_%28Albin_Grau%2C_1922%29_1.jpg/500px-Nosferatu_poster_%28Albin_Grau%2C_1922%29_1.jpg',
  },
  {
    title: 'Night of the Living Dead',
    src: 'https://upload.wikimedia.org/wikipedia/en/9/91/Night_of_the_Living_Dead_%281968%29_poster.jpg',
  },
  {
    title: 'The Cabinet of Dr. Caligari',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Das_Cabinet_des_Dr._Caligari.JPG/500px-Das_Cabinet_des_Dr._Caligari.JPG',
  },
  {
    title: 'His Girl Friday',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/His_Girl_Friday_%281940_poster%29_crop.jpg/500px-His_Girl_Friday_%281940_poster%29_crop.jpg',
  },
  {
    title: 'Charade',
    src: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Charade_%281963_poster%29.jpg',
  },
  {
    title: 'Cyrano de Bergerac',
    src: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Cyrano_de_Bergerac_%281951_poster%29.jpg',
  },
  {
    title: 'A Bucket of Blood',
    src: 'https://upload.wikimedia.org/wikipedia/en/d/da/Bucket_of_blood_affiche.jpg',
  },
  {
    title: 'Attack of the Giant Leeches',
    src: 'https://upload.wikimedia.org/wikipedia/en/9/99/Giantleeches.jpg',
  },
  {
    title: 'Aladdin and His Wonderful Lamp',
    src: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Aladdin_and_His_Wonderful_Lamp_1939.jpg',
  },
  {
    title: 'Angel and the Badman',
    src: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Angel_badman.jpg',
  },
  {
    title: 'Os Óculos do Vovô',
    src: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Os_%C3%93culos_do_Vov%C3%B4_-_Cena.png',
  },
];

const FEATURES = [
  {
    icon: 'play_circle',
    title: 'Comece agora mesmo',
    desc: 'Sem trailer, sem espera: crie sua conta e já cai direto no catálogo, pronto pra assistir.',
  },
  {
    icon: 'block',
    title: 'Sem anúncios',
    desc: 'Zero interrupção pra vender espaço publicitário. É filme do início ao fim.',
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

export default function LandingPage() {
  return (
    <>
      <LandingRedirect />
      <div className="overflow-x-hidden">
        <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 p-2 opacity-30 -rotate-2 scale-110">
            {[...POSTERS, ...POSTERS].map((p, i) => (
              <div key={`${p.title}-${i}`} className="relative aspect-[2/3] rounded-xl overflow-hidden bg-surface-container">
                <Image src={p.src} alt="" fill sizes="20vw" className="object-cover" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-transparent" />

          <div className="relative z-10 text-center px-container-margin max-w-3xl animate-hero-in">
            <p className="font-display text-headline-md text-secondary mb-4">CulStream</p>
            <h1 className="font-display text-headline-lg-mobile md:text-display-xl text-on-background mb-6">
              Cinema <span className="text-secondary">clássico</span>, <span className="text-primary">grátis</span> pra sempre
            </h1>
            <p className="font-body text-body-lg text-on-surface-variant mb-10 max-w-xl mx-auto">
              Centenas de filmes e curtas de animação clássicos, num catálogo estilo streaming. Sem mensalidade, sem anúncio — só criar conta e assistir.
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
          <h2 className="font-display text-headline-lg text-center text-on-background mb-12">Por que o CulStream?</h2>
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
            <span className="font-display text-headline-md text-secondary">CulStream</span>
            <p className="font-body text-body-md text-on-surface-variant text-center sm:text-right">
              Cinema clássico e curtas de animação, sempre grátis.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
