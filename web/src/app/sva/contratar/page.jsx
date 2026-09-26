import { Suspense } from 'react';
import SvaFlyerHeader from '../../../components/SvaFlyerHeader';
import SvaContratarForm from '../../../components/SvaContratarForm';

// flyer.sepiastream.com/contratar (reescrita em middleware.js pra esta rota).
// O provedor simula os ganhos (mesmo simulador do flyer) e envia os dados da
// operação — vira um pedido no admin (aba Provedores) e um e-mail pro
// comercial. A proposta e o contrato saem a partir daí, fora do site.
export const metadata = {
  title: 'Contratar o SVA SepiaStream — dados do provedor',
  description:
    'Simule os ganhos e envie os dados do seu provedor para receber a proposta e o contrato do SVA SepiaStream, com licenças a R$ 2,00.',
};

export default function SvaContratarPage() {
  return (
    <div className="overflow-x-hidden">
      <SvaFlyerHeader acao={{ href: '/', label: 'Voltar ao flyer' }} />

      <section className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--glow-primary),0.18),transparent_60%)]" />
        <div className="relative container mx-auto px-container-margin pt-10 pb-12 text-center max-w-3xl">
          <p className="inline-block font-body text-label-bold uppercase text-secondary border border-secondary/40 rounded-full px-4 py-1.5 mb-6">
            Contratar agora
          </p>
          <h1 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-background mb-4">
            Leve o SepiaStream para os seus assinantes
          </h1>
          <p className="font-body text-body-lg text-on-surface-variant">
            Simule os ganhos com os números do seu provedor e envie os dados da sua operação. Respondemos com a
            proposta e o contrato em até 1 dia útil.
          </p>
        </div>
      </section>

      <Suspense fallback={null}>
        <SvaContratarForm />
      </Suspense>

      <footer className="container mx-auto px-container-margin py-10 text-center font-body text-body-sm text-on-surface-variant border-t border-white/5">
        SepiaStream · contato@sepiastream.com
      </footer>
    </div>
  );
}
