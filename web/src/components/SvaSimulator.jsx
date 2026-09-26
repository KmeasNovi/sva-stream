'use client';

import { useEffect, useState } from 'react';
import { PRECO_LICENCA, moeda, pacoteSugerido, precoPacote } from '../lib/svaPackages';

// Versão interativa da "calculadora sva.html" (raiz do repositório). A
// diferença de modelagem: em vez de pedir "internet" e "SVA" soltos, pede a
// MENSALIDADE do plano e quanto dela é internet — o SVA é o resto. Assim a
// mensalidade "com o SepiaStream" começa igual à de hoje, e o ganho mostrado
// vem da composição, não de uma queda de preço escondida (os valores da
// calculadora original baixavam a mensalidade em R$ 20 e davam ganho negativo).
const DEFAULTS = {
  assinantes: 1000,
  icms: 18,
  mensalidadeAntes: 79.9,
  internetAntes: 59.9,
  custoSvaAntes: 5,
  mensalidadeDepois: 79.9,
  internetDepois: 1,
};

const CAMPOS = {
  geral: [
    { key: 'assinantes', label: 'Assinantes na base', step: 1 },
    { key: 'icms', label: 'Alíquota de ICMS (%)', step: 0.01 },
  ],
  antes: [
    { key: 'mensalidadeAntes', label: 'Mensalidade do plano (R$)', step: 0.01 },
    { key: 'internetAntes', label: 'Parte cobrada como internet (R$)', step: 0.01 },
    { key: 'custoSvaAntes', label: 'Quanto você paga pelo SVA atual, por assinante (R$)', step: 0.01 },
  ],
  depois: [
    { key: 'mensalidadeDepois', label: 'Mensalidade do plano (R$)', step: 0.01 },
    { key: 'internetDepois', label: 'Parte cobrada como internet (R$)', step: 0.01 },
  ],
};

function cenario(mensalidade, internet, custoSva, aliquota) {
  const sva = Math.max(mensalidade - internet, 0);
  const icms = internet * aliquota;
  return { mensalidade, internet, sva, icms, custoSva, liquido: mensalidade - icms - custoSva };
}

function calcular(v) {
  const aliquota = v.icms / 100;
  const antes = cenario(v.mensalidadeAntes, v.internetAntes, v.custoSvaAntes, aliquota);
  const depois = cenario(v.mensalidadeDepois, v.internetDepois, PRECO_LICENCA, aliquota);
  const n = v.assinantes;

  return {
    antes,
    depois,
    porAssinante: {
      icms: antes.icms - depois.icms,
      custoSva: antes.custoSva - depois.custoSva,
      mensalidade: depois.mensalidade - antes.mensalidade,
      liquido: depois.liquido - antes.liquido,
    },
    mes: {
      icms: (antes.icms - depois.icms) * n,
      liquido: (depois.liquido - antes.liquido) * n,
    },
    internetMaiorQueMensalidade: v.internetAntes > v.mensalidadeAntes || v.internetDepois > v.mensalidadeDepois,
  };
}

function Campo({ campo, valor, onChange }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-body text-body-sm text-on-surface-variant min-h-[40px] flex items-end">{campo.label}</span>
      <input
        type="number"
        inputMode="decimal"
        min="0"
        step={campo.step}
        value={valor}
        onChange={(e) => onChange(campo.key, e.target.value)}
        className="bg-surface-container-lowest border border-white/10 rounded-lg px-3 py-2.5 font-body text-body-md text-on-background focus:outline-none focus:border-primary transition-colors"
      />
    </label>
  );
}

function Linha({ label, valor, destaque }) {
  return (
    <div className={`flex justify-between gap-4 py-2 border-b border-white/5 ${destaque ? 'font-semibold text-on-background' : 'text-on-surface-variant'}`}>
      <span className="font-body text-body-sm">{label}</span>
      <span className="font-body text-body-sm tabular-nums">{valor}</span>
    </div>
  );
}

function sinal(valor) {
  return `${valor >= 0 ? '+' : '−'} ${moeda(Math.abs(valor))}`;
}

function TabelaCenario({ titulo, cor, c, rotuloCusto }) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <h4 className={`font-display text-body-lg font-bold mb-2 ${cor}`}>{titulo}</h4>
      <Linha label="Mensalidade" valor={moeda(c.mensalidade)} destaque />
      <Linha label="· Internet (com ICMS)" valor={moeda(c.internet)} />
      <Linha label="· SVA (sem ICMS)" valor={moeda(c.sva)} />
      <Linha label="ICMS estimado" valor={`− ${moeda(c.icms)}`} />
      <Linha label={rotuloCusto} valor={`− ${moeda(c.custoSva)}`} />
      <Linha label="Sobra pro provedor" valor={moeda(c.liquido)} destaque />
    </div>
  );
}

// onResultado (opcional): a página /contratar usa pra pré-preencher o
// formulário (assinantes, pacote indicado) e anexar a simulação ao pedido.
export default function SvaSimulator({ onResultado }) {
  const [valores, setValores] = useState(DEFAULTS);

  function onChange(key, raw) {
    setValores((prev) => ({ ...prev, [key]: raw === '' ? '' : Number(raw) }));
  }

  // Campo apagado no meio da digitação vira 0 só no cálculo — o input
  // continua vazio pra pessoa terminar de digitar.
  const numeros = Object.fromEntries(Object.entries(valores).map(([k, v]) => [k, Number(v) || 0]));
  const r = calcular(numeros);
  const pacote = pacoteSugerido(numeros.assinantes);

  const chave = JSON.stringify(numeros);
  useEffect(() => {
    if (!onResultado) return;
    onResultado({
      ...numeros,
      pacote: pacote ? pacote.nome : 'Corporativo',
      ganhoLiquidoMes: r.mes.liquido,
    });
    // chave resume numeros (e, portanto, pacote e r) — evita disparar a cada render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave, onResultado]);

  return (
    <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
      <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
        <div className="grid sm:grid-cols-2 gap-4">
          {CAMPOS.geral.map((c) => (
            <Campo key={c.key} campo={c} valor={valores[c.key]} onChange={onChange} />
          ))}
        </div>
        <div>
          <h4 className="font-display text-body-lg font-bold text-on-surface-variant mb-3">Hoje</h4>
          <div className="grid sm:grid-cols-3 gap-4">
            {CAMPOS.antes.map((c) => (
              <Campo key={c.key} campo={c} valor={valores[c.key]} onChange={onChange} />
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display text-body-lg font-bold text-secondary mb-3">Com o SepiaStream</h4>
          <div className="grid sm:grid-cols-3 gap-4">
            {CAMPOS.depois.map((c) => (
              <Campo key={c.key} campo={c} valor={valores[c.key]} onChange={onChange} />
            ))}
            <div className="flex flex-col gap-1.5">
              <span className="font-body text-body-sm text-on-surface-variant min-h-[40px] flex items-end">Licença SepiaStream</span>
              <span className="px-3 py-2.5 font-body text-body-md text-secondary font-semibold">{moeda(PRECO_LICENCA)} / assinante</span>
            </div>
          </div>
        </div>
        {r.internetMaiorQueMensalidade ? (
          <p className="font-body text-body-sm text-error">A parte de internet não pode ser maior que a mensalidade.</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="glass-panel rounded-2xl p-5">
            <p className="font-body text-body-sm text-on-surface-variant mb-1">ICMS a menos por mês</p>
            <p className="font-display text-headline-md text-secondary tabular-nums">{moeda(r.mes.icms)}</p>
          </div>
          <div className="glass-panel rounded-2xl p-5">
            <p className="font-body text-body-sm text-on-surface-variant mb-1">Ganho líquido por mês</p>
            <p className={`font-display text-headline-md tabular-nums ${r.mes.liquido >= 0 ? 'text-primary' : 'text-error'}`}>
              {moeda(r.mes.liquido)}
            </p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <h4 className="font-display text-body-lg font-bold text-on-background mb-2">De onde vem o ganho, por assinante</h4>
          <Linha label="ICMS que deixa de pagar" valor={sinal(r.porAssinante.icms)} />
          <Linha label="Diferença no custo do SVA" valor={sinal(r.porAssinante.custoSva)} />
          <Linha label="Mudança na mensalidade" valor={sinal(r.porAssinante.mensalidade)} />
          <Linha label="Ganho líquido por assinante" valor={sinal(r.porAssinante.liquido)} destaque />
          {r.porAssinante.mensalidade < 0 ? (
            <p className="font-body text-body-sm text-on-surface-variant mt-3">
              Você baixou a mensalidade em {moeda(Math.abs(r.porAssinante.mensalidade))} — essa redução de preço entra
              como perda de receita no cálculo.
            </p>
          ) : null}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <TabelaCenario titulo="Hoje, por assinante" cor="text-on-surface-variant" c={r.antes} rotuloCusto="Custo do SVA atual" />
          <TabelaCenario titulo="Com o SepiaStream" cor="text-secondary" c={r.depois} rotuloCusto="Licença SepiaStream" />
        </div>

        <div className="glass-panel rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
          <p className="font-body text-body-md text-on-surface-variant">
            Pacote indicado pra {numeros.assinantes.toLocaleString('pt-BR')} assinantes:
          </p>
          <p className="font-display text-body-lg font-bold text-primary">
            {pacote
              ? `${pacote.nome} · ${pacote.licencas.toLocaleString('pt-BR')} licenças · ${moeda(precoPacote(pacote), 0)}/mês`
              : 'Corporativo · sob consulta'}
          </p>
        </div>

        <p className="font-body text-body-sm text-on-surface-variant bg-surface-container-low border-l-4 border-primary/60 rounded-lg p-4">
          <strong className="text-on-background">Importante:</strong> simulação matemática, não é consultoria tributária.
          A tributação efetiva depende do enquadramento do provedor, da legislação do seu estado, da natureza dos
          serviços e dos contratos. Valide a composição do plano com o seu contador antes de aplicar.
        </p>
      </div>
    </div>
  );
}
