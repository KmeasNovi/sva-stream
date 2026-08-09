export const metadata = {
  title: 'Política de Privacidade — CulStream',
  description: 'Como o CulStream coleta, usa e protege seus dados, incluindo cookies de anúncios.',
};

export default function PrivacidadePage() {
  return (
    <div className="container mx-auto px-container-margin py-16 max-w-3xl">
      <h1 className="font-display text-headline-lg text-on-background mb-2">Política de Privacidade</h1>
      <p className="font-body text-body-md text-on-surface-variant mb-10">Última atualização: agosto de 2026.</p>

      <div className="space-y-10 font-body text-body-md text-on-surface">
        <section className="space-y-3">
          <h2 className="font-display text-headline-md text-on-background">O que é o CulStream</h2>
          <p>
            O CulStream é um catálogo de filmes clássicos e curtas de animação, no estilo streaming. Esta página
            explica quais dados coletamos de quem cria conta e usa o site, e como eles são usados.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-headline-md text-on-background">Dados que coletamos</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Cadastro:</strong> nome, email e senha (a senha nunca é guardada em texto puro, só um hash
              irreversível).
            </li>
            <li>
              <strong>Uso do site:</strong> os filmes que você marca como favoritos, pra montar sua "Minha Lista".
            </li>
            <li>
              <strong>Dados técnicos:</strong> endereço IP e informações do navegador, usados só pra manter o site
              funcionando com segurança (ex: limitar tentativas de login).
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-headline-md text-on-background">Cookies e publicidade</h2>
          <p>
            O CulStream exibe anúncios através do Google AdSense pra se manter no ar de graça pra todo mundo. O
            Google e seus parceiros podem usar cookies e identificadores parecidos pra exibir anúncios com base nas
            suas visitas a este e outros sites.
          </p>
          <p>
            Você pode ver, desativar ou personalizar os anúncios que o Google mostra pra você em{' '}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-fixed transition-colors underline"
            >
              adssettings.google.com
            </a>
            . Mais detalhes sobre como o Google usa esses dados estão em{' '}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-fixed transition-colors underline"
            >
              policies.google.com/technologies/partner-sites
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-headline-md text-on-background">Com quem compartilhamos dados</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Google AdSense</strong> — exibição de anúncios, como descrito acima.
            </li>
            <li>
              <strong>Brevo</strong> — envio do email de confirmação de cadastro. Só o email é compartilhado, com a
              finalidade específica de confirmar sua conta.
            </li>
          </ul>
          <p>Não vendemos nem alugamos seus dados pra ninguém.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-headline-md text-on-background">Seus direitos</h2>
          <p>
            Você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento, entrando em contato pelo
            email abaixo.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-headline-md text-on-background">Contato</h2>
          <p>
            Dúvidas sobre esta política? Escreva pra{' '}
            <a href="mailto:kmeasnovi@gmail.com" className="text-primary hover:text-primary-fixed transition-colors underline">
              kmeasnovi@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
