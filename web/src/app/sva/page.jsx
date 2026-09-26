import Image from 'next/image';
import SvaSimulator from '../../components/SvaSimulator';

// Flyer comercial pra provedores de internet — servido só na raiz de
// flyer.sepiastream.com (reescrita em middleware.js), sem a navegação do app
// (ver AppShell.jsx). Não é pra assinante final: é o material de venda da
// licença SepiaStream como SVA.

// Contato comercial — preencher antes de publicar. Sem WhatsApp, o botão
// cai no e-mail.
const CONTATO = {
  whatsapp: '', // só dígitos com DDI+DDD, ex: '5511999999999'
  email: 'contato@sepiastream.com',
};

const MENSAGEM_WHATSAPP = 'Olá! Sou de um provedor de internet e quero saber mais sobre o SVA SepiaStream.';

const LINK_CONTATO = CONTATO.whatsapp
  ? `https://wa.me/${CONTATO.whatsapp}?text=${encodeURIComponent(MENSAGEM_WHATSAPP)}`
  : `mailto:${CONTATO.email}?subject=${encodeURIComponent('SVA SepiaStream para provedores')}`;

const VALOR_LICENCA = 'R$ 2,00';

export const metadata = {
  title: 'SepiaStream para provedores — SVA de streaming por R$ 2,00 a licença',
  description:
    'Ofereça streaming de cinema clássico e animação aos seus assinantes como SVA, com licença de R$ 2,00 por assinante. Simule o impacto na sua receita.',
  openGraph: {
    title: 'SepiaStream para provedores — SVA por R$ 2,00 a licença',
    description: 'Streaming como SVA para provedores de internet, com a licença mais barata do mercado.',
    type: 'website',
    images: ['/logo-icon.png'],
  },
};

const NUMEROS = [
  { valor: VALOR_LICENCA, label: 'por licença / mês' },
  { valor: '+3.500', label: 'filmes e curtas no catálogo' },
  { valor: 'R$ 0', label: 'de infraestrutura pro provedor' },
  { valor: '100%', label: 'web, sem app pra instalar' },
];

const VANTAGENS = [
  {
    icon: 'savings',
    titulo: 'A licença mais barata do mercado',
    desc: `${VALOR_LICENCA} por assinante ativo. Sobra margem pra você compor o plano do jeito que fizer sentido pro seu negócio.`,
  },
  {
    icon: 'receipt_long',
    titulo: 'Mais eficiência na composição do plano',
    desc: 'Com um SVA de verdade no pacote, parte da mensalidade deixa de ser serviço de telecom. Use o simulador abaixo e valide com o seu contador.',
  },
  {
    icon: 'movie',
    titulo: 'Conteúdo que o assinante usa',
    desc: 'Catálogo estilo streaming com clássicos do cinema e curtas de animação, organizado por gênero e sempre crescendo.',
  },
  {
    icon: 'cloud_done',
    titulo: 'Zero servidor do seu lado',
    desc: 'Nós hospedamos e mantemos a plataforma. Você não compra equipamento, não contrata banda extra e não dá manutenção.',
  },
  {
    icon: 'bolt',
    titulo: 'Ativação rápida',
    desc: 'Mandou a lista de assinantes, eles recebem o acesso. Sem obra, sem instalação na casa do cliente.',
  },
  {
    icon: 'support_agent',
    titulo: 'Suporte direto com a gente',
    desc: 'Atendimento sem intermediário pra sua equipe e relatório mensal das licenças ativas.',
  },
];

const PACOTES = [
  {
    nome: 'Essencial',
    preco: VALOR_LICENCA,
    sufixo: '/ licença ativa',
    destaque: false,
    itens: [
      'Acesso completo ao catálogo',
      'Ativação por lista de assinantes',
      'Relatório mensal de licenças',
      'Suporte por WhatsApp e e-mail',
    ],
  },
  {
    nome: 'Integrado',
    preco: VALOR_LICENCA,
    sufixo: '/ licença ativa',
    destaque: true,
    itens: [
      'Tudo do Essencial',
      'Ativação e cancelamento automáticos via API',
      'Integração com o seu ERP',
      'Acompanhamento na homologação',
    ],
  },
  {
    nome: 'Marca parceira',
    preco: 'Sob consulta',
    sufixo: '',
    destaque: false,
    itens: [
      'Tudo do Integrado',
      'Sua marca junto com a SepiaStream',
      'Domínio próprio pros seus assinantes',
      'Condições para grandes volumes',
    ],
  },
];

const PASSOS = [
  { icon: 'handshake', titulo: 'Contrato', desc: 'Definimos o pacote e assinamos digitalmente.' },
  { icon: 'group_add', titulo: 'Ativação', desc: 'Seus assinantes são cadastrados por lista ou integração.' },
  { icon: 'play_circle', titulo: 'Assinante assiste', desc: 'Acesso pelo navegador, no celular, TV ou computador.' },
  { icon: 'request_quote', titulo: 'Fatura mensal', desc: `Você paga ${VALOR_LICENCA} por licença ativa no mês.` },
];

function BotaoContato({ className = '', children }) {
  return (
    <a
      href={LINK_CONTATO}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-body text-label-bold px-8 py-4 rounded-lg hover:shadow-[0_0_25px_rgba(var(--glow-primary),0.5)] transition-all ${className}`}
    >
      <span className="material-symbols-outlined">{CONTATO.whatsapp ? 'chat' : 'mail'}</span>
      {children}
    </a>
  );
}

export default function SvaFlyerPage() {
  return (
    <div className="overflow-x-hidden">
      <header className="container mx-auto px-container-margin py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image src="/logo-icon.png" alt="" width={40} height={40} />
          <span className="font-display text-body-lg font-bold text-on-background">
            SepiaStream <span className="text-secondary">SVA</span>
          </span>
        </div>
        <a href="#contato" className="font-body text-label-bold text-on-surface-variant hover:text-primary transition-colors">
          Fale com a gente
        </a>
      </header>

      <section className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--glow-primary),0.18),transparent_60%)]" />
        <div className="relative container mx-auto px-container-margin pt-12 pb-20 text-center max-w-4xl">
          <p className="inline-block font-body text-label-bold uppercase text-secondary border border-secondary/40 rounded-full px-4 py-1.5 mb-6">
            Para provedores de internet
          </p>
          <h1 className="font-display text-headline-lg-mobile md:text-display-xl text-on-background mb-6">
            Streaming como SVA por <span className="text-secondary whitespace-nowrap">{VALOR_LICENCA}</span> a licença
          </h1>
          <p className="font-body text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Inclua o SepiaStream nos seus planos, entregue mais valor pro assinante e ganhe margem para compor a
            mensalidade de forma mais eficiente. O menor custo de licença do mercado.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <BotaoContato>Quero oferecer aos meus assinantes</BotaoContato>
            <a
              href="#simulador"
              className="inline-flex items-center gap-2 text-on-background font-body text-label-bold px-6 py-4 rounded-lg border border-white/15 hover:border-white/40 transition-colors"
            >
              <span className="material-symbols-outlined">calculate</span>
              Simular no meu provedor
            </a>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-container-margin pb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {NUMEROS.map((n) => (
            <div key={n.label} className="glass-panel rounded-2xl p-6 text-center">
              <p className="font-display text-headline-lg-mobile md:text-headline-lg text-primary mb-1">{n.valor}</p>
              <p className="font-body text-body-sm text-on-surface-variant">{n.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-container-margin py-20">
        <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-center text-on-background mb-4">
          Por que oferecer o SepiaStream
        </h2>
        <p className="font-body text-body-md text-center text-on-surface-variant mb-12 max-w-2xl mx-auto">
          Um SVA que custa pouco, não dá trabalho pra sua equipe e que o assinante realmente usa.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VANTAGENS.map((v) => (
            <div key={v.titulo} className="glass-panel rounded-2xl p-6">
              <span className="material-symbols-outlined text-secondary text-4xl mb-3 inline-block">{v.icon}</span>
              <h3 className="font-display text-headline-md text-on-background mb-2">{v.titulo}</h3>
              <p className="font-body text-body-md text-on-surface-variant">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pacotes" className="container mx-auto px-container-margin py-20">
        <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-center text-on-background mb-4">
          Pacotes de licença
        </h2>
        <p className="font-body text-body-md text-center text-on-surface-variant mb-12 max-w-2xl mx-auto">
          Mesmo preço por licença, do primeiro ao milésimo assinante. Você só paga pelas licenças ativas no mês.
        </p>
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PACOTES.map((p) => (
            <div
              key={p.nome}
              className={`relative rounded-2xl p-8 flex flex-col ${
                p.destaque ? 'bg-surface-container border-2 border-primary shadow-[0_0_40px_rgba(var(--glow-primary),0.25)]' : 'glass-panel'
              }`}
            >
              {p.destaque ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary font-body text-label-bold px-4 py-1 rounded-full whitespace-nowrap">
                  Mais escolhido
                </span>
              ) : null}
              <h3 className="font-display text-headline-md text-on-background mb-4">{p.nome}</h3>
              <p className="mb-6">
                <span className="font-display text-headline-lg text-secondary">{p.preco}</span>
                {p.sufixo ? <span className="font-body text-body-sm text-on-surface-variant ml-2">{p.sufixo}</span> : null}
              </p>
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {p.itens.map((item) => (
                  <li key={item} className="flex gap-2 font-body text-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-secondary text-xl shrink-0">check_circle</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={LINK_CONTATO}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-center font-body text-label-bold px-6 py-3 rounded-lg transition-all ${
                  p.destaque
                    ? 'bg-primary text-on-primary hover:shadow-[0_0_25px_rgba(var(--glow-primary),0.5)]'
                    : 'border border-primary/40 text-primary hover:bg-primary/10'
                }`}
              >
                Contratar {p.nome}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section id="simulador" className="container mx-auto px-container-margin py-20 scroll-mt-8">
        <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-center text-on-background mb-4">
          Simule no seu provedor
        </h2>
        <p className="font-body text-body-md text-center text-on-surface-variant mb-12 max-w-2xl mx-auto">
          Coloque os valores do seu plano e veja quanto sobra por mês com o SepiaStream na composição.
        </p>
        <SvaSimulator />
      </section>

      <section className="container mx-auto px-container-margin py-20">
        <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-center text-on-background mb-12">
          Como funciona
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PASSOS.map((p, i) => (
            <div key={p.titulo} className="glass-panel rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-display text-headline-md text-primary">{i + 1}</span>
                <span className="material-symbols-outlined text-secondary text-3xl">{p.icon}</span>
              </div>
              <h3 className="font-display text-body-lg font-bold text-on-background mb-1">{p.titulo}</h3>
              <p className="font-body text-body-md text-on-surface-variant">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contato" className="container mx-auto px-container-margin py-20 scroll-mt-8">
        <div className="glass-panel rounded-2xl p-10 md:p-14 text-center max-w-3xl mx-auto">
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-background mb-4">
            Vamos colocar o SepiaStream no seu plano?
          </h2>
          <p className="font-body text-body-lg text-on-surface-variant mb-8">
            Fale com a gente e receba uma proposta para o tamanho da sua base.
          </p>
          <BotaoContato>{CONTATO.whatsapp ? 'Chamar no WhatsApp' : 'Enviar e-mail'}</BotaoContato>
          <p className="font-body text-body-sm text-on-surface-variant mt-6">{CONTATO.email}</p>
        </div>
      </section>

      <footer className="container mx-auto px-container-margin py-10 text-center font-body text-body-sm text-on-surface-variant border-t border-white/5">
        SepiaStream · <a href="https://sepiastream.com" className="hover:text-primary transition-colors">sepiastream.com</a>
      </footer>
    </div>
  );
}
