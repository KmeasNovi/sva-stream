import CopyPixKey from './CopyPixKey';

const PIX_KEY = 'fab40159-13ce-4b54-9669-4313a5c7de27';

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
        assistir — sem mensalidade, sem enrolação. Se o SepiaStream te ajudou a redescobrir o cinema, uma doação via
        PIX ajuda a manter esse acesso livre.
      </p>
      <p className="font-body text-body-md text-on-surface-variant mb-6 sm:mb-10">Qualquer valor é bem-vindo. Obrigado!</p>

      <div className="glass-panel rounded-3xl p-5 sm:p-8 md:p-10 max-w-md mx-auto space-y-5 sm:space-y-6">
        <div className="bg-white rounded-2xl p-3 sm:p-4 inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pix-qr.png" alt="QR code PIX" className="w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] max-w-full" />
        </div>

        <div>
          <p className="font-body text-label-bold text-on-surface-variant mb-2 uppercase tracking-wider text-sm">
            Ou copie a chave PIX (aleatória)
          </p>
          <CopyPixKey value={PIX_KEY} />
        </div>
      </div>
    </div>
  );
}
