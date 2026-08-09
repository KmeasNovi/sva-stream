import CopyPixKey from './CopyPixKey';

const PIX_KEY = 'fab40159-13ce-4b54-9669-4313a5c7de27';

export default function DonationContent({ HeadingTag = 'h1' }) {
  return (
    <div className="text-center">
      <span className="material-symbols-outlined text-secondary text-5xl mb-4 inline-block">favorite</span>
      <HeadingTag className="font-display text-headline-lg text-on-background mb-4">Apoie o SepiaStream</HeadingTag>
      <p className="font-body text-body-lg text-on-surface-variant mb-2 max-w-lg mx-auto">
        Centenas de clássicos e curtas raros, catalogados, organizados e disponíveis de graça pra qualquer pessoa
        assistir — sem mensalidade, sem enrolação. Se o SepiaStream te ajudou a redescobrir o cinema, uma doação via
        PIX ajuda a manter esse acesso livre.
      </p>
      <p className="font-body text-body-md text-on-surface-variant mb-10">Qualquer valor é bem-vindo. Obrigado!</p>

      <div className="glass-panel rounded-3xl p-8 md:p-10 max-w-md mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-4 inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pix-qr.png" alt="QR code PIX" width={280} height={280} />
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
