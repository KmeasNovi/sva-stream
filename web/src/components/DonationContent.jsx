const VAKINHA_URL = 'https://www.vakinha.com.br/6263806';

export default function DonationContent({ HeadingTag = 'h1' }) {
  return (
    <div className="text-center px-2">
      <span className="material-symbols-outlined text-secondary text-4xl sm:text-5xl mb-3 sm:mb-4 inline-block">
        favorite
      </span>
      <HeadingTag className="font-display text-headline-md sm:text-headline-lg text-on-background mb-3 sm:mb-4">
        Apoie o SepiaStream
      </HeadingTag>
      <p className="font-body text-body-md sm:text-body-lg text-on-surface-variant mb-2 max-w-lg mx-auto">
        Centenas de clássicos e curtas raros, catalogados, organizados e disponíveis de graça pra qualquer pessoa
        assistir — sem mensalidade, sem enrolação. Se o SepiaStream te ajudou a redescobrir o cinema, uma doação
        ajuda a manter esse acesso livre.
      </p>
      <p className="font-body text-body-md text-on-surface-variant mb-6 sm:mb-10">Qualquer valor é bem-vindo. Obrigado!</p>

      <div className="glass-panel rounded-3xl p-5 sm:p-8 md:p-10 max-w-md mx-auto space-y-5 sm:space-y-6">
        <a
          href={VAKINHA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full bg-primary text-on-primary font-body text-label-bold px-6 py-4 rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
        >
          <span className="material-symbols-outlined">volunteer_activism</span>
          Fazer uma doação
        </a>
        <p className="font-body text-body-sm text-on-surface-variant">
          Aceita PIX e cartão, processado com segurança pela Vakinha.
        </p>
      </div>
    </div>
  );
}
