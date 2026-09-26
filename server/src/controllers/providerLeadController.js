const ProviderLead = require('../models/ProviderLead');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { sendProviderLeadEmails } = require('../utils/sendEmail');

// Mesmos nomes de web/src/lib/svaPackages.js (+ Corporativo, acima do maior).
const PACOTES = ['Start', 'Essencial', 'Profissional', 'Avançado', 'Corporativo'];
const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];
const STATUSES = ['novo', 'em_contato', 'proposta_enviada', 'contratado', 'descartado'];

function cnpjValido(digitos) {
  if (!/^\d{14}$/.test(digitos) || /^(\d)\1{13}$/.test(digitos)) return false;
  const dv = (base) => {
    const pesos = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const soma = base.split('').reduce((acc, n, i) => acc + Number(n) * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  const d1 = dv(digitos.slice(0, 12));
  const d2 = dv(digitos.slice(0, 12) + d1);
  return digitos.endsWith(`${d1}${d2}`);
}

const texto = (v, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const numero = (v) => (Number.isFinite(Number(v)) ? Number(v) : undefined);

exports.createLead = catchAsync(async (req, res, next) => {
  const b = req.body || {};

  // Honeypot: campo escondido no formulário — gente não preenche, robô sim.
  // Responde sucesso pra não ensinar o robô, mas não grava nada.
  if (texto(b.website)) return res.status(201).json({ success: true });

  const lead = {
    razaoSocial: texto(b.razaoSocial),
    nomeFantasia: texto(b.nomeFantasia),
    cnpj: texto(b.cnpj, 30).replace(/\D/g, ''),
    cidade: texto(b.cidade, 100),
    uf: texto(b.uf, 2).toUpperCase(),
    responsavel: texto(b.responsavel, 120),
    cargo: texto(b.cargo, 80),
    email: texto(b.email, 160).toLowerCase(),
    telefone: texto(b.telefone, 30),
    assinantes: Math.floor(numero(b.assinantes) || 0),
    pacote: texto(b.pacote, 30),
    ativacao: ['lista', 'api'].includes(b.ativacao) ? b.ativacao : 'indefinido',
    erp: texto(b.erp, 80),
    observacoes: texto(b.observacoes, 2000),
  };

  const faltando = ['razaoSocial', 'cnpj', 'cidade', 'uf', 'responsavel', 'email', 'telefone', 'pacote'].filter((k) => !lead[k]);
  if (faltando.length) return next(new AppError('Preencha todos os campos obrigatórios.', 400));
  if (!cnpjValido(lead.cnpj)) return next(new AppError('CNPJ inválido.', 400));
  if (!UFS.includes(lead.uf)) return next(new AppError('UF inválida.', 400));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return next(new AppError('E-mail inválido.', 400));
  if (lead.telefone.replace(/\D/g, '').length < 10) return next(new AppError('Telefone inválido — inclua o DDD.', 400));
  if (lead.assinantes < 1) return next(new AppError('Informe o número de assinantes.', 400));
  if (!PACOTES.includes(lead.pacote)) return next(new AppError('Pacote inválido.', 400));

  if (b.simulacao && typeof b.simulacao === 'object') {
    const s = b.simulacao;
    lead.simulacao = {
      mensalidadeAntes: numero(s.mensalidadeAntes),
      internetAntes: numero(s.internetAntes),
      custoSvaAntes: numero(s.custoSvaAntes),
      mensalidadeDepois: numero(s.mensalidadeDepois),
      internetDepois: numero(s.internetDepois),
      icms: numero(s.icms),
      ganhoLiquidoMes: numero(s.ganhoLiquidoMes),
    };
  }

  const salvo = await ProviderLead.create(lead);

  // E-mail é conveniência, não requisito: o pedido já está salvo e aparece
  // no admin mesmo se o Brevo falhar.
  sendProviderLeadEmails(salvo).catch((err) => console.error('Falha nos e-mails do pedido de provedor:', err));

  res.status(201).json({ success: true, data: { id: salvo._id } });
});

exports.adminListLeads = catchAsync(async (req, res) => {
  const leads = await ProviderLead.find().sort({ createdAt: -1 }).limit(500);
  res.json({ success: true, data: leads });
});

exports.adminUpdateLead = catchAsync(async (req, res, next) => {
  const { status } = req.body || {};
  if (!STATUSES.includes(status)) return next(new AppError('Status inválido.', 400));
  const lead = await ProviderLead.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!lead) return next(new AppError('Pedido não encontrado.', 404));
  res.json({ success: true, data: lead });
});
