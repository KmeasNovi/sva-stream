import QRCode from 'qrcode';
import { generatePixPayload } from '../../lib/pix';
import CopyPixKey from '../../components/CopyPixKey';

export const metadata = {
  title: 'Apoie o SepiaStream — Doação via PIX',
  description: 'Ajude a manter o SepiaStream no ar com uma doação via PIX.',
};

const PIX_KEY = 'fab40159-13ce-4b54-9669-4313a5c7de27';
const PIX_NAME = 'SepiaStream';
const PIX_CITY = 'SAO PAULO';

export default async function DoacaoPage() {
  const payload = generatePixPayload({ key: PIX_KEY, name: PIX_NAME, city: PIX_CITY });
  const qrCodeDataUrl = await QRCode.toDataURL(payload, { width: 320, margin: 1 });

  return (
    <div className="container mx-auto px-container-margin py-16 max-w-2xl text-center">
      <span className="material-symbols-outlined text-secondary text-5xl mb-4 inline-block">favorite</span>
      <h1 className="font-display text-headline-lg text-on-background mb-4">Apoie o SepiaStream</h1>
      <p className="font-body text-body-lg text-on-surface-variant mb-2 max-w-lg mx-auto">
        O SepiaStream é gratuito e vive de anúncios — mas a aprovação pode levar semanas. Enquanto isso, qualquer
        doação via PIX ajuda a manter o site no ar.
      </p>
      <p className="font-body text-body-md text-on-surface-variant mb-10">Qualquer valor é bem-vindo. Obrigado!</p>

      <div className="glass-panel rounded-3xl p-8 md:p-10 max-w-md mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-4 inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrCodeDataUrl} alt="QR code PIX" width={280} height={280} />
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
