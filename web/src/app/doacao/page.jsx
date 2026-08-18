import DonationContent from '../../components/DonationContent';

export const metadata = {
  title: 'Apoie o SepiaStream — Faça uma doação',
  description: 'Ajude a manter vivo o acesso gratuito a clássicos do cinema e curtas de animação com uma doação.',
};

export default function DoacaoPage() {
  return (
    <div className="container mx-auto px-container-margin py-16 max-w-4xl">
      <DonationContent HeadingTag="h1" />
    </div>
  );
}
