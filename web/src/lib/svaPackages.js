// Pacotes de licença do SVA SepiaStream pra provedores — usados no flyer
// (app/sva/page.jsx) e no simulador, que sugere o pacote pelo nº de
// assinantes. O preço por licença é sempre o mesmo (a vantagem vendida é o
// R$ 2,00); o pacote só define quantas licenças ativas estão incluídas.
export const PRECO_LICENCA = 2;

export const PACOTES_SVA = [
  {
    nome: 'Start',
    licencas: 250,
    itens: ['Catálogo completo', 'Ativação por lista de assinantes', 'Relatório mensal de licenças', 'Suporte por e-mail'],
  },
  {
    nome: 'Essencial',
    licencas: 500,
    itens: ['Tudo do Start', 'Suporte prioritário', 'Material de divulgação pro assinante'],
  },
  {
    nome: 'Profissional',
    licencas: 1000,
    destaque: true,
    itens: ['Tudo do Essencial', 'Ativação e cancelamento automáticos via API', 'Integração com o seu ERP'],
  },
  {
    nome: 'Avançado',
    licencas: 2500,
    itens: ['Tudo do Profissional', 'Gerente de conta dedicado', 'Sua marca junto com a SepiaStream'],
  },
];

// Acima do maior pacote, a proposta é personalizada.
export const LIMITE_PACOTES = PACOTES_SVA[PACOTES_SVA.length - 1].licencas;

export function precoPacote(pacote) {
  return pacote.licencas * PRECO_LICENCA;
}

// Menor pacote que cobre a base inteira; null = acima do maior (sob consulta).
export function pacoteSugerido(assinantes) {
  return PACOTES_SVA.find((p) => p.licencas >= assinantes) || null;
}

export function moeda(valor, casas = 2) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
}
