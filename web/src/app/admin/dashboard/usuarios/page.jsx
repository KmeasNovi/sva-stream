'use client';

import { Fragment, useEffect, useState } from 'react';
import { api } from '../../../../lib/api';
import AdminNav from '../../AdminNav';
import useAdminToken from '../../useAdminToken';

const emptyForm = { name: '', email: '', password: '' };
const emptyEditForm = { name: '', email: '', password: '', status: 'none', currentPeriodEnd: '', provider: '' };

const inputClass =
  'w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 text-on-background font-body text-body-md focus:outline-none focus:ring-1 focus:ring-primary';

const smallInputClass =
  'w-full bg-[#111111] border border-white/10 rounded-lg px-3 py-2 text-on-background font-body text-body-sm focus:outline-none focus:ring-1 focus:ring-primary';

const SUBSCRIPTION_STATUSES = ['none', 'pending', 'active', 'canceled', 'past_due'];

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('pt-BR');
}

const BULK_PLACEHOLDER = `[
  { "name": "Fulano de Tal", "email": "fulano@example.com" },
  { "name": "Ciclana", "email": "ciclana@example.com", "password": "opcional-8-caracteres" }
]`;

export default function AdminUsersPage() {
  const token = useAdminToken();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [bulkResult, setBulkResult] = useState(null);
  const [bulkError, setBulkError] = useState('');
  const [showBulk, setShowBulk] = useState(false);

  // Edição inline (por linha) — separada do formulário do topo, que agora
  // só cria usuário novo.
  const [editingRowId, setEditingRowId] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [rowError, setRowError] = useState('');
  const [rowSaving, setRowSaving] = useState(false);

  // Seleção múltipla — pra aplicar Premium em lote sem precisar editar
  // usuário por usuário.
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkActionBusy, setBulkActionBusy] = useState(false);

  async function loadUsers(searchTerm) {
    const { data } = await api.adminListUsers(
      searchTerm ? { search: searchTerm, limit: 200 } : { limit: 100 },
      token
    );
    setUsers(data);
    setSelectedIds(new Set());
  }

  useEffect(() => {
    if (token) loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setNotice('');

    try {
      const { data } = await api.adminCreateUser(
        { name: form.name, email: form.email, password: form.password || undefined },
        token
      );
      if (data.generatedPassword) {
        setNotice(`Usuário criado. Senha gerada: ${data.generatedPassword} (só aparece uma vez — copie agora)`);
      }
      setForm(emptyForm);
      loadUsers(search);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remover este usuário? Essa ação não pode ser desfeita.')) return;
    await api.adminDeleteUser(id, token);
    if (editingRowId === id) setEditingRowId(null);
    loadUsers(search);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    loadUsers(search.trim());
  }

  async function handleBulkImport(e) {
    e.preventDefault();
    setBulkError('');
    setBulkResult(null);

    let parsed;
    try {
      parsed = JSON.parse(bulkText);
      if (!Array.isArray(parsed)) throw new Error('O JSON precisa ser uma lista (array) de usuários');
    } catch (err) {
      setBulkError(`JSON inválido: ${err.message}`);
      return;
    }

    try {
      const { data } = await api.adminBulkCreateUsers(parsed, token);
      setBulkResult(data);
      loadUsers(search);
    } catch (err) {
      setBulkError(err.message);
    }
  }

  function startRowEdit(user) {
    setEditingRowId(user._id);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      password: '',
      status: user.subscription?.status || 'none',
      currentPeriodEnd: user.subscription?.currentPeriodEnd ? user.subscription.currentPeriodEnd.slice(0, 10) : '',
      provider: user.subscription?.provider || '',
    });
    setRowError('');
  }

  function cancelRowEdit() {
    setEditingRowId(null);
    setEditForm(emptyEditForm);
    setRowError('');
  }

  function handleEditChange(field, value) {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }

  async function saveRowEdit(id) {
    setRowError('');
    setRowSaving(true);

    try {
      const payload = {
        name: editForm.name,
        email: editForm.email,
        subscriptionStatus: editForm.status,
        subscriptionCurrentPeriodEnd: editForm.currentPeriodEnd || null,
        subscriptionProvider: editForm.provider || null,
      };
      if (editForm.password) payload.password = editForm.password;

      await api.adminUpdateUser(id, payload, token);
      cancelRowEdit();
      loadUsers(search);
    } catch (err) {
      setRowError(err.message);
    } finally {
      setRowSaving(false);
    }
  }

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds((prev) => (prev.size === users.length ? new Set() : new Set(users.map((u) => u._id))));
  }

  // Mesmo atalho de outorga manual do botão único de antes, só que aplicado
  // a todos os usuários selecionados de uma vez.
  async function applyBulkPremium(isPremium) {
    setBulkActionBusy(true);
    try {
      await Promise.all([...selectedIds].map((id) => api.adminUpdateUser(id, { isPremium }, token)));
      loadUsers(search);
    } finally {
      setBulkActionBusy(false);
    }
  }

  if (!token) return null;

  return (
    <div className="container mx-auto px-container-margin py-12 space-y-10">
      <AdminNav />
      <h1 className="font-display text-headline-lg text-on-background">Usuários</h1>

      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 space-y-4 max-w-md">
        <h2 className="font-display text-headline-md text-on-background">Adicionar usuário</h2>
        <input
          placeholder="Nome"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
          className={inputClass}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
          className={inputClass}
        />
        <input
          type="text"
          placeholder="Senha (deixe em branco pra gerar uma)"
          value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
          className={inputClass}
        />
        {error ? <p className="text-error font-body text-body-md">{error}</p> : null}
        {notice ? <p className="text-primary font-body text-body-md break-words">{notice}</p> : null}
        <button
          type="submit"
          className="bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(var(--glow-primary),0.4)] transition-all"
        >
          Salvar
        </button>
      </form>

      <div className="glass-panel rounded-2xl p-8 max-w-md space-y-4">
        <button
          type="button"
          onClick={() => setShowBulk((v) => !v)}
          className="font-display text-headline-md text-on-background flex items-center gap-2"
        >
          Importação em lote {showBulk ? '▾' : '▸'}
        </button>
        {showBulk ? (
          <form onSubmit={handleBulkImport} className="space-y-4">
            <p className="font-body text-body-md text-on-surface-variant">
              Cole um array JSON de usuários. Contas já cadastradas com o mesmo email são
              atualizadas em vez de duplicadas. Senha é opcional — se não informada, uma senha
              aleatória é gerada e devolvida na resposta.
            </p>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={BULK_PLACEHOLDER}
              rows={8}
              className={`${inputClass} font-mono text-body-sm`}
            />
            {bulkError ? <p className="text-error font-body text-body-md">{bulkError}</p> : null}
            {bulkResult ? (
              <div className="font-body text-body-md text-on-surface-variant space-y-2">
                <p>
                  Criados: {bulkResult.created} · Atualizados: {bulkResult.updated} · Falhas:{' '}
                  {bulkResult.failed}
                </p>
                {bulkResult.generatedPasswords?.length ? (
                  <div>
                    <p className="text-primary">Senhas geradas (só aparecem essa vez):</p>
                    <ul className="list-disc list-inside">
                      {bulkResult.generatedPasswords.map((g) => (
                        <li key={g.email}>
                          {g.email}: {g.password}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {bulkResult.errors?.length ? (
                  <ul className="list-disc list-inside text-error">
                    {bulkResult.errors.map((e) => (
                      <li key={e.index}>
                        {e.email}: {e.message}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
            <button
              type="submit"
              className="bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(var(--glow-primary),0.4)] transition-all"
            >
              Importar
            </button>
          </form>
        ) : null}
      </div>

      <div className="space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-3 max-w-md">
          <input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputClass}
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-lg border border-white/20 text-on-background hover:bg-white/10 transition-colors font-body text-label-bold whitespace-nowrap"
          >
            Buscar
          </button>
        </form>
        <p className="font-body text-body-sm text-on-surface-variant">
          {search ? `Resultados para "${search}"` : 'Mostrando os 100 usuários mais recentes — use a busca para achar outros.'}{' '}
          ({users.length})
        </p>

        {selectedIds.size > 0 ? (
          <div className="glass-panel rounded-xl p-4 flex flex-wrap items-center gap-3">
            <span className="font-body text-body-sm text-on-surface-variant">
              {selectedIds.size} selecionado{selectedIds.size > 1 ? 's' : ''}
            </span>
            <button
              type="button"
              disabled={bulkActionBusy}
              onClick={() => applyBulkPremium(true)}
              className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors font-body text-label-bold text-xs disabled:opacity-50"
            >
              Marcar Premium em lote
            </button>
            <button
              type="button"
              disabled={bulkActionBusy}
              onClick={() => applyBulkPremium(false)}
              className="px-3 py-1.5 rounded-lg bg-white/5 text-on-surface-variant border border-white/10 hover:bg-white/10 transition-colors font-body text-label-bold text-xs disabled:opacity-50"
            >
              Remover Premium em lote
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="font-body text-label-bold text-xs text-on-surface-variant hover:text-on-background ml-auto"
            >
              Limpar seleção
            </button>
          </div>
        ) : null}

        <div className="glass-panel rounded-2xl overflow-x-auto">
          <table className="w-full min-w-[1400px]">
            <thead>
              <tr className="text-left font-body text-label-bold text-on-surface-variant border-b border-white/10">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={users.length > 0 && selectedIds.size === users.length}
                    onChange={toggleSelectAll}
                    className="accent-primary"
                  />
                </th>
                <th className="p-4">Nome</th>
                <th className="p-4">Email</th>
                <th className="p-4">Verificado</th>
                <th className="p-4">Premium</th>
                <th className="p-4">Cadastro</th>
                <th className="p-4">Atualizado</th>
                <th className="p-4">ID cliente Asaas</th>
                <th className="p-4">ID assinatura Asaas</th>
                <th className="p-4">Favoritos</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isEditing = editingRowId === user._id;
                return (
                  <Fragment key={user._id}>
                    <tr className="border-b border-white/5 font-body text-body-md text-on-background">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(user._id)}
                          onChange={() => toggleSelect(user._id)}
                          className="accent-primary"
                        />
                      </td>
                      <td className="p-4 max-w-[200px]">
                        {isEditing ? (
                          <input
                            value={editForm.name}
                            onChange={(e) => handleEditChange('name', e.target.value)}
                            className={smallInputClass}
                          />
                        ) : (
                          <span className="truncate block">{user.name}</span>
                        )}
                      </td>
                      <td className="p-4 max-w-[240px] text-on-surface-variant">
                        {isEditing ? (
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => handleEditChange('email', e.target.value)}
                            className={smallInputClass}
                          />
                        ) : (
                          <span className="truncate block">{user.email}</span>
                        )}
                      </td>
                      <td className="p-4">{user.emailVerified ? 'Sim' : 'Não'}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full font-body text-label-bold text-xs ${
                            user.subscription?.status === 'active'
                              ? 'bg-primary/20 text-primary border border-primary/30'
                              : 'bg-white/5 text-on-surface-variant border border-white/10'
                          }`}
                        >
                          {user.subscription?.status || 'none'}
                        </span>
                      </td>
                      <td className="p-4 text-on-surface-variant whitespace-nowrap">{formatDate(user.createdAt)}</td>
                      <td className="p-4 text-on-surface-variant whitespace-nowrap">{formatDate(user.updatedAt)}</td>
                      <td className="p-4 font-mono text-body-sm text-on-surface-variant max-w-[160px] truncate" title={user.subscription?.providerCustomerId || ''}>
                        {user.subscription?.providerCustomerId || '—'}
                      </td>
                      <td className="p-4 font-mono text-body-sm text-on-surface-variant max-w-[160px] truncate" title={user.subscription?.providerSubscriptionId || ''}>
                        {user.subscription?.providerSubscriptionId || '—'}
                      </td>
                      <td className="p-4">{user.favorites?.length || 0}</td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-end">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => saveRowEdit(user._id)}
                                disabled={rowSaving}
                                className="px-3 py-1 rounded-lg bg-primary text-on-primary hover:shadow-[0_0_15px_rgba(var(--glow-primary),0.4)] transition-all font-body text-label-bold whitespace-nowrap disabled:opacity-60"
                              >
                                Salvar
                              </button>
                              <button
                                onClick={cancelRowEdit}
                                className="px-3 py-1 rounded-lg border border-white/20 text-on-background hover:bg-white/10 transition-colors font-body text-label-bold whitespace-nowrap"
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startRowEdit(user)}
                                className="px-3 py-1 rounded-lg border border-white/20 text-on-background hover:bg-white/10 transition-colors font-body text-label-bold whitespace-nowrap"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="px-3 py-1 rounded-lg border border-error/30 text-error hover:bg-error/10 transition-colors font-body text-label-bold whitespace-nowrap"
                              >
                                Remover
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isEditing ? (
                      <tr className="border-b border-white/10 bg-white/[0.02]">
                        <td colSpan={11} className="p-4">
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="font-body text-body-sm text-on-surface-variant block mb-1">
                                Status da assinatura
                              </label>
                              <select
                                value={editForm.status}
                                onChange={(e) => handleEditChange('status', e.target.value)}
                                className={smallInputClass}
                              >
                                {SUBSCRIPTION_STATUSES.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="font-body text-body-sm text-on-surface-variant block mb-1">
                                Validade do plano
                              </label>
                              <input
                                type="date"
                                value={editForm.currentPeriodEnd}
                                onChange={(e) => handleEditChange('currentPeriodEnd', e.target.value)}
                                className={smallInputClass}
                              />
                            </div>
                            <div>
                              <label className="font-body text-body-sm text-on-surface-variant block mb-1">Provedor</label>
                              <input
                                placeholder="manual, asaas..."
                                value={editForm.provider}
                                onChange={(e) => handleEditChange('provider', e.target.value)}
                                className={smallInputClass}
                              />
                            </div>
                            <div>
                              <label className="font-body text-body-sm text-on-surface-variant block mb-1">
                                Nova senha
                              </label>
                              <input
                                type="text"
                                placeholder="deixe em branco pra manter"
                                value={editForm.password}
                                onChange={(e) => handleEditChange('password', e.target.value)}
                                className={smallInputClass}
                              />
                            </div>
                          </div>
                          {rowError ? <p className="text-error font-body text-body-sm mt-3">{rowError}</p> : null}
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
