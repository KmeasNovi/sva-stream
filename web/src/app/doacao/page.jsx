import DonationContent from '../../components/DonationContent';
import AdBand from '../../components/AdBand';

const ADSENSE_SLOT_DOACAO = process.env.NEXT_PUBLIC_ADSENSE_SLOT_DOACAO;

export const metadata = {
  title: 'Apoie o SepiaStream — Faça uma doação',
  description: 'Ajude a manter vivo o acesso gratuito a clássicos do cinema e curtas de animação com uma doação.',
};

export default function DoacaoPage() {
  return (
    <div className="container mx-auto px-container-margin py-16 max-w-4xl">
      <DonationContent HeadingTag="h1" />
      <AdBand slotId={ADSENSE_SLOT_DOACAO} className="mt-16" />
    </div>
  );
}
