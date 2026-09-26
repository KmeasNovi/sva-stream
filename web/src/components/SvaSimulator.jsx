'use client';

import { useState } from 'react';

// Versão interativa da "calculadora sva.html" (raiz do repositório), com
// dois acréscimos pra conversa com o provedor: número de assinantes (o
// resultado vira mensal, não só por assinante) e o custo que o provedor já
// paga hoje pelo SVA atual — sem isso a comparação "antes x depois" não
// desconta o fornecedor atual e superestima o ganho.
const DEFAULTS = {
  assinantes: 1000,
  internetAntes: 59.9,
  svaAntes: 20,
  custoSvaAntes: 5,
  internetDepois: 1,
  svaDepois: 58.9,
  licenca: 2,
  icms: 18,
};

const CAMPOS = [
  { key: 'assinantes', label: 'Assinantes ativos', step: 1, grupo: 'geral' },
  { key: 'icms', label: 'Alíquota de ICMS (%)', step: 0.01, grupo: 'geral' },
  { key: 'internetAntes', label: 'Internet (R$)', step: 0.01, grupo: 'antes' },
  { key: 'svaAntes', label: 'SVA cobrado do assinante (R$)', step: 0.01, grupo: 'antes' },
  { key: 'custoSvaAntes', label: 'Custo do SVA atual por assinante (R$)', step: 0.01, grupo: 'antes' },
  { key: 'internetDepois', label: 'Internet (R$)', step: 0.01, grupo: 'depois' },
  { key: 'svaDepois', label: 'SVA SepiaStream cobrado do assinante (R$)', step: 0.01, grupo: 'depois' },
  { key: 'licenca', label: 'Licença SepiaStream por assinante (R$)', step: 0.01, grupo: 'depois' },
];

function moeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcular(v) {
  const aliquota = v.icms / 100;

  const cenario = (internet, sva, custoSva) => {
    const receita = internet + sva;
    const icms = internet * aliquota;
    return { internet, sva, receita, icms, custoSva, liquido: receita - icms - custoSva };
  };

  const antes = cenario(v.internetAntes, v.svaAntes, v.custoSvaAntes);
  const depois = cenario(v.internetDepois, v.svaDepois, v.licenca);

  return {
    antes,
    depois,
    economiaIcmsMes: (antes.icms - depois.icms) * v.assinantes,
    ganhoLiquidoMes: (depois.liquido - antes.liquido) * v.assinantes,
  };
}

function Campo({ campo, valor, onChange }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-body text-body-sm text-on-surface-variant">{campo.label}</span>
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

export default function SvaSimulator() {
  const [valores, setValores] = useState(DEFAULTS);

  function onChange(key, raw) {
    setValores((prev) => ({ ...prev, [key]: raw === '' ? '' : Number(raw) }));
  }

  // Campo apagado no meio da digitação vira 0 só no cálculo — o input
  // continua vazio pra pessoa terminar de digitar.
  const numeros = Object.fromEntries(Object.entries(valores).map(([k, v]) => [k, Number(v) || 0]));
  const r = calcular(numeros);

  const grupo = (g) => CAMPOS.filter((c) => c.grupo === g);

  return (
    <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
      <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
        <div className="grid sm:grid-cols-2 gap-4">
          {grupo('geral').map((c) => (
            <Campo key={c.key} campo={c} valor={valores[c.key]} onChange={onChange} />
          ))}
        </div>
        <div>
          <h4 className="font-display text-body-lg font-bold text-on-surface-variant mb-3">Hoje</h4>
          <div className="grid sm:grid-cols-3 gap-4">
            {grupo('antes').map((c) => (
              <Campo key={c.key} campo={c} valor={valores[c.key]} onChange={onChange} />
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display text-body-lg font-bold text-secondary mb-3">Com o SepiaStream</h4>
          <div className="grid sm:grid-cols-3 gap-4">
            {grupo('depois').map((c) => (
              <Campo key={c.key} campo={c} valor={valores[c.key]} onChange={onChange} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="glass-panel rounded-2xl p-5 border-secondary/40">
            <p className="font-body text-body-sm text-on-surface-variant mb-1">ICMS a menos por mês</p>
            <p className="font-display text-headline-md text-secondary tabular-nums">{moeda(r.economiaIcmsMes)}</p>
          </div>
          <div className="glass-panel rounded-2xl p-5 border-primary/40">
            <p className="font-body text-body-sm text-on-surface-variant mb-1">Ganho líquido por mês</p>
            <p className={`font-display text-headline-md tabular-nums ${r.ganhoLiquidoMes >= 0 ? 'text-primary' : 'text-error'}`}>
              {moeda(r.ganhoLiquidoMes)}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="glass-panel rounded-2xl p-5">
            <h4 className="font-display text-body-lg font-bold text-on-surface-variant mb-2">Hoje, por assinante</h4>
            <Linha label="Internet" valor={moeda(r.antes.internet)} />
            <Linha label="SVA" valor={moeda(r.antes.sva)} />
            <Linha label="Receita" valor={moeda(r.antes.receita)} destaque />
            <Linha label="ICMS estimado" valor={`− ${moeda(r.antes.icms)}`} />
            <Linha label="Custo do SVA" valor={`− ${moeda(r.antes.custoSva)}`} />
            <Linha label="Sobra pro provedor" valor={moeda(r.antes.liquido)} destaque />
          </div>
          <div className="glass-panel rounded-2xl p-5">
            <h4 className="font-display text-body-lg font-bold text-secondary mb-2">Com o SepiaStream</h4>
            <Linha label="Internet" valor={moeda(r.depois.internet)} />
            <Linha label="SVA" valor={moeda(r.depois.sva)} />
            <Linha label="Receita" valor={moeda(r.depois.receita)} destaque />
            <Linha label="ICMS estimado" valor={`− ${moeda(r.depois.icms)}`} />
            <Linha label="Licença SepiaStream" valor={`− ${moeda(r.depois.custoSva)}`} />
            <Linha label="Sobra pro provedor" valor={moeda(r.depois.liquido)} destaque />
          </div>
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
