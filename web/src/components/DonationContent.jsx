import CopyPixKey from './CopyPixKey';
import SubscribeCard from './SubscribeCard';

const VAKINHA_URL = 'https://www.vakinha.com.br/6263806';
// Chave PIX da própria Vakinha (não é uma chave pessoal) — o pagamento passa
// pela infraestrutura deles, então quem doa nunca vê nome nem dados pessoais.
const VAKINHA_PIX_KEY = '6263806@vakinha.com.br';

export default function DonationContent({ HeadingTag = 'h1' }) {
  return (
    <div className="text-center px-2">
      <span className="material-symbols-outlined text-secondary text-4xl sm:text-5xl mb-3 sm:mb-4 inline-block">
        favorite
      </span>
      <HeadingTag className="font-display text-headline-md sm:text-headline-lg text-on-background mb-3 sm:mb-4">
        Apoie o SepiaStream
      </HeadingTag>
      <p className="font-body text-body-md sm:text-body-lg text-on-surface-variant mb-6 sm:mb-10 max-w-lg mx-auto">
        Catálogo grátis, mantido por quem quiser apoiar.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-3xl mx-auto items-stretch">
        <SubscribeCard />

        <div className="glass-panel rounded-3xl p-5 sm:p-8 md:p-10 h-full space-y-5 sm:space-y-6">
          <div className="text-center space-y-2">
            <span className="material-symbols-outlined text-secondary text-4xl sm:text-5xl inline-block">favorite</span>
            <h2 className="font-display text-headline-sm sm:text-headline-md text-on-background">Doação avulsa</h2>
            <p className="font-body text-body-md text-on-surface-variant">Qualquer valor é bem-vindo, sem compromisso.</p>
          </div>
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

          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="h-px flex-1 bg-white/10" />
            <span className="font-body text-body-sm">ou pague direto por PIX</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <CopyPixKey value={VAKINHA_PIX_KEY} />
        </div>
      </div>
    </div>
  );
}
