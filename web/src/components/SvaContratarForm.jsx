'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SvaSimulator from './SvaSimulator';
import { api } from '../lib/api';
import { PACOTES_SVA, LIMITE_PACOTES, moeda, precoPacote } from '../lib/svaPackages';

const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

const ERPS = ['IXC Soft', 'SGP', 'MK Solutions', 'Voalle', 'Hubsoft', 'RBX ISP', 'Outro', 'Não uso ERP'];

const OPCOES_PACOTE = [
  ...PACOTES_SVA.map((p) => ({
    value: p.nome,
    label: `${p.nome} — ${p.licencas.toLocaleString('pt-BR')} licenças (${moeda(precoPacote(p), 0)}/mês)`,
  })),
  { value: 'Corporativo', label: `Corporativo — acima de ${LIMITE_PACOTES.toLocaleString('pt-BR')} licenças (sob proposta)` },
];

const NOMES_PACOTE = OPCOES_PACOTE.map((o) => o.value);

const inputClass =
  'w-full bg-surface-container-lowest border border-white/10 rounded-lg px-3 py-2.5 font-body text-body-md text-on-background focus:outline-none focus:border-primary transition-colors';

function formatarCnpj(v) {
  const d = v.replace(/\D/g, '').slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

function formatarTelefone(v) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10) return d.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
  return d.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
}

function Campo({ label, obrigatorio, children, className = '' }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="font-body text-body-sm text-on-surface-variant">
        {label}
        {obrigatorio ? <span className="text-primary"> *</span> : null}
      </span>
      {children}
    </label>
  );
}

function Grupo({ titulo, children }) {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="font-display text-body-lg font-bold text-on-background mb-3">{titulo}</legend>
      {children}
    </fieldset>
  );
}

export default function SvaContratarForm() {
  const searchParams = useSearchParams();
  const pacoteUrl = searchParams.get('pacote');

  const [form, setForm] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    cidade: '',
    uf: '',
    responsavel: '',
    cargo: '',
    email: '',
    telefone: '',
    assinantes: '',
    pacote: NOMES_PACOTE.includes(pacoteUrl) ? pacoteUrl : '',
    ativacao: 'indefinido',
    erp: '',
    observacoes: '',
    website: '', // honeypot
  });
  const [aceite, setAceite] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [enviado, setEnviado] = useState(false);

  // O simulador pré-preenche assinantes e pacote até a pessoa mexer nesses
  // campos à mão (ou chegar com ?pacote= vindo de um botão do flyer).
  const editouAssinantes = useRef(false);
  const escolheuPacote = useRef(NOMES_PACOTE.includes(pacoteUrl));
  const simulacao = useRef(null);

  const onResultado = useCallback((res) => {
    simulacao.current = res;
    setForm((f) => ({
      ...f,
      assinantes: editouAssinantes.current ? f.assinantes : String(res.assinantes || ''),
      pacote: escolheuPacote.current ? f.pacote : res.pacote,
    }));
  }, []);

  function set(campo, valor) {
    if (campo === 'assinantes') editouAssinantes.current = true;
    if (campo === 'pacote') escolheuPacote.current = true;
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    if (!aceite) {
      setErro('Confirme que concorda em ser contatado para prosseguir.');
      return;
    }
    setEnviando(true);
    try {
      const s = simulacao.current;
      await api.createProviderLead({
        ...form,
        assinantes: Number(form.assinantes),
        simulacao: s
          ? {
              mensalidadeAntes: s.mensalidadeAntes,
              internetAntes: s.internetAntes,
              custoSvaAntes: s.custoSvaAntes,
              mensalidadeDepois: s.mensalidadeDepois,
              internetDepois: s.internetDepois,
              icms: s.icms,
              ganhoLiquidoMes: s.ganhoLiquidoMes,
            }
          : undefined,
      });
      setEnviado(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErro(err.message || 'Não foi possível enviar agora. Tente de novo em instantes.');
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <section className="container mx-auto px-container-margin pb-20">
        <div className="glass-panel rounded-2xl p-10 md:p-14 text-center max-w-2xl mx-auto">
          <span className="material-symbols-outlined text-secondary text-5xl mb-4 inline-block">task_alt</span>
          <h2 className="font-display text-headline-md text-on-background mb-3">Pedido recebido!</h2>
          <p className="font-body text-body-lg text-on-surface-variant mb-2">
            Obrigado, {form.responsavel.split(' ')[0]}. Recebemos os dados da {form.razaoSocial}.
          </p>
          <p className="font-body text-body-md text-on-surface-variant mb-8">
            Vamos enviar a proposta e o contrato do pacote <strong className="text-on-background">{form.pacote}</strong>{' '}
            para <strong className="text-on-background">{form.email}</strong> em até 1 dia útil.
          </p>
          <Link
            href="/"
            className="inline-block border border-primary/40 text-primary font-body text-label-bold px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors"
          >
            Voltar ao flyer
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="simulador" className="container mx-auto px-container-margin py-12">
        <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-center text-on-background mb-4">
          Simule os seus ganhos
        </h2>
        <p className="font-body text-body-md text-center text-on-surface-variant mb-12 max-w-2xl mx-auto">
          Coloque os valores do seu plano e veja quanto sobra por mês com o SepiaStream na composição. O número de
          assinantes e o pacote indicado já vão para o formulário abaixo.
        </p>
        <SvaSimulator onResultado={onResultado} />
      </section>

      <section id="dados" className="container mx-auto px-container-margin py-12 pb-20">
        <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-center text-on-background mb-4">
          Dados da sua operação
        </h2>
        <p className="font-body text-body-md text-center text-on-surface-variant mb-12 max-w-2xl mx-auto">
          Com esses dados preparamos a proposta e o contrato. Campos com <span className="text-primary">*</span> são
          obrigatórios.
        </p>

        <form onSubmit={enviar} className="glass-panel rounded-2xl p-6 md:p-10 max-w-4xl mx-auto flex flex-col gap-10" noValidate>
          <Grupo titulo="Empresa">
            <div className="grid sm:grid-cols-2 gap-4">
              <Campo label="Razão social" obrigatorio>
                <input className={inputClass} value={form.razaoSocial} onChange={(e) => set('razaoSocial', e.target.value)} required maxLength={200} />
              </Campo>
              <Campo label="Nome fantasia">
                <input className={inputClass} value={form.nomeFantasia} onChange={(e) => set('nomeFantasia', e.target.value)} maxLength={200} />
              </Campo>
              <Campo label="CNPJ" obrigatorio>
                <input
                  className={inputClass}
                  inputMode="numeric"
                  placeholder="00.000.000/0000-00"
                  value={form.cnpj}
                  onChange={(e) => set('cnpj', formatarCnpj(e.target.value))}
                  required
                />
              </Campo>
              <div className="grid grid-cols-[1fr_96px] gap-4">
                <Campo label="Cidade" obrigatorio>
                  <input className={inputClass} value={form.cidade} onChange={(e) => set('cidade', e.target.value)} required maxLength={100} />
                </Campo>
                <Campo label="UF" obrigatorio>
                  <select className={inputClass} value={form.uf} onChange={(e) => set('uf', e.target.value)} required>
                    <option value="">—</option>
                    {UFS.map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </select>
                </Campo>
              </div>
            </div>
          </Grupo>

          <Grupo titulo="Responsável pela contratação">
            <div className="grid sm:grid-cols-2 gap-4">
              <Campo label="Nome" obrigatorio>
                <input className={inputClass} value={form.responsavel} onChange={(e) => set('responsavel', e.target.value)} required maxLength={120} />
              </Campo>
              <Campo label="Cargo">
                <input className={inputClass} value={form.cargo} onChange={(e) => set('cargo', e.target.value)} maxLength={80} />
              </Campo>
              <Campo label="E-mail" obrigatorio>
                <input type="email" className={inputClass} value={form.email} onChange={(e) => set('email', e.target.value)} required maxLength={160} />
              </Campo>
              <Campo label="Telefone / WhatsApp" obrigatorio>
                <input
                  className={inputClass}
                  inputMode="tel"
                  placeholder="(00) 00000-0000"
                  value={form.telefone}
                  onChange={(e) => set('telefone', formatarTelefone(e.target.value))}
                  required
                />
              </Campo>
            </div>
          </Grupo>

          <Grupo titulo="Operação">
            <div className="grid sm:grid-cols-2 gap-4">
              <Campo label="Assinantes na base" obrigatorio>
                <input
                  type="number"
                  min="1"
                  inputMode="numeric"
                  className={inputClass}
                  value={form.assinantes}
                  onChange={(e) => set('assinantes', e.target.value)}
                  required
                />
              </Campo>
              <Campo label="Pacote desejado" obrigatorio>
                <select className={inputClass} value={form.pacote} onChange={(e) => set('pacote', e.target.value)} required>
                  <option value="">Selecione</option>
                  {OPCOES_PACOTE.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo label="ERP / sistema de gestão">
                <select className={inputClass} value={form.erp} onChange={(e) => set('erp', e.target.value)}>
                  <option value="">Selecione</option>
                  {ERPS.map((erp) => (
                    <option key={erp} value={erp}>
                      {erp}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo label="Como prefere ativar os assinantes">
                <select className={inputClass} value={form.ativacao} onChange={(e) => set('ativacao', e.target.value)}>
                  <option value="indefinido">Ainda não sei</option>
                  <option value="lista">Envio de lista de assinantes</option>
                  <option value="api">Integração automática (API / ERP)</option>
                </select>
              </Campo>
              <Campo label="Observações" className="sm:col-span-2">
                <textarea
                  rows={4}
                  className={inputClass}
                  placeholder="Ex.: planos em que pretende incluir o SVA, data desejada de início, dúvidas..."
                  value={form.observacoes}
                  onChange={(e) => set('observacoes', e.target.value)}
                  maxLength={2000}
                />
              </Campo>
            </div>
          </Grupo>

          {/* honeypot: fora da tela, só robô preenche */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] w-px h-px opacity-0"
            value={form.website}
            onChange={(e) => set('website', e.target.value)}
          />

          <label className="flex gap-3 items-start font-body text-body-sm text-on-surface-variant">
            <input type="checkbox" checked={aceite} onChange={(e) => setAceite(e.target.checked)} className="mt-1 accent-[rgb(var(--color-primary))]" />
            <span>
              Concordo em ser contatado pela SepiaStream sobre esta proposta e com o tratamento destes dados para essa
              finalidade, conforme a{' '}
              <a href="https://sepiastream.com/privacidade" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Política de Privacidade
              </a>
              .
            </span>
          </label>

          {erro ? <p className="font-body text-body-md text-error -mt-4">{erro}</p> : null}

          <button
            type="submit"
            disabled={enviando}
            className="self-center bg-primary text-on-primary font-body text-label-bold px-10 py-4 rounded-lg hover:shadow-[0_0_25px_rgba(var(--glow-primary),0.5)] transition-all disabled:opacity-60"
          >
            {enviando ? 'Enviando...' : 'Enviar e receber a proposta'}
          </button>
        </form>
      </section>
    </>
  );
}
