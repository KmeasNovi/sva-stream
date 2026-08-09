import DonationContent from '../../components/DonationContent';

export const metadata = {
  title: 'Apoie o SepiaStream — Doação via PIX',
  description: 'Ajude a manter vivo o acesso gratuito a clássicos do cinema e curtas de animação com uma doação via PIX.',
};

export default function DoacaoPage() {
  return (
    <div className="container mx-auto px-container-margin py-16 max-w-2xl">
      <DonationContent HeadingTag="h1" />
    </div>
  );
}
