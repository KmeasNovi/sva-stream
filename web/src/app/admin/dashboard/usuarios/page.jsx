'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../../lib/api';
import AdminNav from '../../AdminNav';
import useAdminToken from '../../useAdminToken';

const emptyForm = { name: '', email: '', password: '' };

const inputClass =
  'w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 text-on-background font-body text-body-md focus:outline-none focus:ring-1 focus:ring-primary';

const BULK_PLACEHOLDER = `[
  { "name": "Fulano de Tal", "email": "fulano@example.com" },
  { "name": "Ciclana", "email": "ciclana@example.com", "password": "opcional-8-caracteres" }
]`;

export default function AdminUsersPage() {
  const token = useAdminToken();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [bulkResult, setBulkResult] = useState(null);
  const [bulkError, setBulkError] = useState('');
  const [showBulk, setShowBulk] = useState(false);

  async function loadUsers(searchTerm) {
    const { data } = await api.adminListUsers(
      searchTerm ? { search: searchTerm, limit: 200 } : { limit: 100 },
      token
    );
    setUsers(data);
  }

  useEffect(() => {
    if (token) loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function startEdit(user) {
    setEditingId(user._id);
    setForm({ name: user.name || '', email: user.email || '', password: '' });
    setError('');
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setNotice('');

    try {
      if (editingId) {
        const payload = { name: form.name, email: form.email };
        if (form.password) payload.password = form.password;
        await api.adminUpdateUser(editingId, payload, token);
        cancelEdit();
      } else {
        const { data } = await api.adminCreateUser(
          { name: form.name, email: form.email, password: form.password || undefined },
          token
        );
        if (data.generatedPassword) {
          setNotice(`Usuário criado. Senha gerada: ${data.generatedPassword} (só aparece uma vez — copie agora)`);
        }
        setForm(emptyForm);
      }
      loadUsers(search);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remover este usuário? Essa ação não pode ser desfeita.')) return;
    await api.adminDeleteUser(id, token);
    if (editingId === id) cancelEdit();
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

  if (!token) return null;

  return (
    <div className="container mx-auto px-container-margin py-12 space-y-10">
      <AdminNav />
      <h1 className="font-display text-headline-lg text-on-background">Usuários</h1>

      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 space-y-4 max-w-md">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-headline-md text-on-background">
            {editingId ? 'Editar usuário' : 'Adicionar usuário'}
          </h2>
          {editingId ? (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-on-surface-variant hover:text-on-background font-body text-label-bold"
            >
              Cancelar edição
            </button>
          ) : null}
        </div>
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
          placeholder={editingId ? 'Nova senha (deixe em branco pra manter)' : 'Senha (deixe em branco pra gerar uma)'}
          value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
          className={inputClass}
        />
        {error ? <p className="text-error font-body text-body-md">{error}</p> : null}
        {notice ? <p className="text-primary font-body text-body-md break-words">{notice}</p> : null}
        <button
          type="submit"
          className="bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
        >
          {editingId ? 'Salvar alterações' : 'Salvar'}
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
              className="bg-primary text-on-primary font-body text-label-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
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

        <div className="glass-panel rounded-2xl overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="text-left font-body text-label-bold text-on-surface-variant border-b border-white/10">
                <th className="p-4">Nome</th>
                <th className="p-4">Email</th>
                <th className="p-4">Verificado</th>
                <th className="p-4">Favoritos</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-white/5 font-body text-body-md text-on-background">
                  <td className="p-4 max-w-[200px] truncate">{user.name}</td>
                  <td className="p-4 max-w-[240px] truncate text-on-surface-variant">{user.email}</td>
                  <td className="p-4">{user.emailVerified ? 'Sim' : 'Não'}</td>
                  <td className="p-4">{user.favorites?.length || 0}</td>
                  <td className="p-4 flex gap-2 justify-end">
                    <button
                      onClick={() => startEdit(user)}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
