'use client';

import { Fragment, useEffect, useState } from 'react';
import { api } from '../../../../lib/api';
import AdminNav from '../../AdminNav';
import useAdminToken from '../../useAdminToken';

// Pedidos de contratação do SVA enviados em flyer.sepiastream.com/contratar.
const STATUS = [
  { value: 'novo', label: 'Novo' },
  { value: 'em_contato', label: 'Em contato' },
  { value: 'proposta_enviada', label: 'Proposta enviada' },
  { value: 'contratado', label: 'Contratado' },
  { value: 'descartado', label: 'Descartado' },
];

const ATIVACAO = { lista: 'Lista', api: 'API / ERP', indefinido: 'Não sabe' };

function formatarCnpj(d) {
  return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

function moeda(v) {
  return Number.isFinite(v) ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—';
}

export default function AdminProvedoresPage() {
  const token = useAdminToken();
  const [leads, setLeads] = useState([]);
  const [erro, setErro] = useState('');
  const [aberto, setAberto] = useState(null);

  useEffect(() => {
    if (!token) return;
    api
      .adminListProviderLeads(token)
      .then(({ data }) => setLeads(data))
      .catch((err) => setErro(err.message));
  }, [token]);

  async function mudarStatus(id, status) {
    setErro('');
    try {
      const { data } = await api.adminUpdateProviderLead(id, { status }, token);
      setLeads((ls) => ls.map((l) => (l._id === id ? data : l)));
    } catch (err) {
      setErro(err.message);
    }
  }

  if (!token) return null;

  return (
    <div className="container mx-auto px-container-margin py-10">
      <AdminNav />
      <h1 className="font-display text-headline-md text-on-background mb-2">Provedores</h1>
      <p className="font-body text-body-md text-on-surface-variant mb-6">
        Pedidos de contratação do SVA enviados em flyer.sepiastream.com/contratar. Clique numa linha para ver os
        detalhes.
      </p>
      {erro ? <p className="text-error font-body text-body-md mb-4">{erro}</p> : null}

      {leads.length === 0 ? (
        <p className="font-body text-body-md text-on-surface-variant">Nenhum pedido ainda.</p>
      ) : (
        <div className="overflow-x-auto glass-panel rounded-2xl">
          <table className="w-full font-body text-body-sm text-left">
            <thead className="text-on-surface-variant border-b border-white/10">
              <tr>
                <th className="p-4">Data</th>
                <th className="p-4">Provedor</th>
                <th className="p-4">Cidade/UF</th>
                <th className="p-4">Responsável</th>
                <th className="p-4 text-right">Assinantes</th>
                <th className="p-4">Pacote</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <Fragment key={l._id}>
                  <tr
                    className="border-b border-white/5 hover:bg-white/5 cursor-pointer text-on-background"
                    onClick={() => setAberto(aberto === l._id ? null : l._id)}
                  >
                    <td className="p-4 whitespace-nowrap">{new Date(l.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td className="p-4">
                      <div className="font-semibold">{l.razaoSocial}</div>
                      <div className="text-on-surface-variant">{formatarCnpj(l.cnpj)}</div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {l.cidade}/{l.uf}
                    </td>
                    <td className="p-4">
                      <div>{l.responsavel}</div>
                      <div className="text-on-surface-variant">{l.email}</div>
                    </td>
                    <td className="p-4 text-right tabular-nums">{l.assinantes.toLocaleString('pt-BR')}</td>
                    <td className="p-4">{l.pacote}</td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={l.status}
                        onChange={(e) => mudarStatus(l._id, e.target.value)}
                        className="bg-[#111111] border border-white/10 rounded-lg px-2 py-1.5 text-on-background"
                      >
                        {STATUS.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  {aberto === l._id ? (
                    <tr className="border-b border-white/5 bg-white/[0.03]">
                      <td colSpan={7} className="p-4">
                        <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-on-surface-variant">
                          <div><dt className="inline font-semibold text-on-background">Nome fantasia: </dt><dd className="inline">{l.nomeFantasia || '—'}</dd></div>
                          <div><dt className="inline font-semibold text-on-background">Cargo: </dt><dd className="inline">{l.cargo || '—'}</dd></div>
                          <div><dt className="inline font-semibold text-on-background">Telefone: </dt><dd className="inline">{l.telefone}</dd></div>
                          <div><dt className="inline font-semibold text-on-background">ERP: </dt><dd className="inline">{l.erp || '—'}</dd></div>
                          <div><dt className="inline font-semibold text-on-background">Ativação: </dt><dd className="inline">{ATIVACAO[l.ativacao]}</dd></div>
                          <div><dt className="inline font-semibold text-on-background">Ganho mensal simulado: </dt><dd className="inline">{moeda(l.simulacao?.ganhoLiquidoMes)}</dd></div>
                          {l.simulacao?.mensalidadeAntes !== undefined ? (
                            <div className="sm:col-span-2 lg:col-span-3">
                              <dt className="inline font-semibold text-on-background">Simulação: </dt>
                              <dd className="inline">
                                hoje mensalidade {moeda(l.simulacao.mensalidadeAntes)} (internet {moeda(l.simulacao.internetAntes)}, SVA atual custa{' '}
                                {moeda(l.simulacao.custoSvaAntes)}) → com SepiaStream {moeda(l.simulacao.mensalidadeDepois)} (internet{' '}
                                {moeda(l.simulacao.internetDepois)}), ICMS {l.simulacao.icms}%
                              </dd>
                            </div>
                          ) : null}
                          <div className="sm:col-span-2 lg:col-span-3">
                            <dt className="inline font-semibold text-on-background">Observações: </dt>
                            <dd className="inline whitespace-pre-wrap">{l.observacoes || '—'}</dd>
                          </div>
                        </dl>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
