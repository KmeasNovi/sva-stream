const mongoose = require('mongoose');

// Pedido de contratação do SVA enviado por um provedor pela página
// flyer.sepiastream.com/contratar — é o ponto de partida da proposta e do
// contrato (Contrato_Licenca_SVA_SepiaStream.docx, Anexo I). Não cria acesso
// nenhum sozinho: o status é tocado à mão pelo admin.
const providerLeadSchema = new mongoose.Schema(
  {
    razaoSocial: { type: String, required: true, trim: true },
    nomeFantasia: { type: String, trim: true },
    cnpj: { type: String, required: true, trim: true }, // só dígitos
    cidade: { type: String, required: true, trim: true },
    uf: { type: String, required: true, trim: true, uppercase: true },
    responsavel: { type: String, required: true, trim: true },
    cargo: { type: String, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    telefone: { type: String, required: true, trim: true },
    assinantes: { type: Number, required: true, min: 1 },
    pacote: { type: String, required: true },
    ativacao: { type: String, enum: ['lista', 'api', 'indefinido'], default: 'indefinido' },
    erp: { type: String, trim: true },
    observacoes: { type: String, trim: true },
    // Valores que o provedor deixou no simulador na hora de enviar — só
    // referência pra proposta, nunca usados em cálculo de cobrança.
    simulacao: {
      mensalidadeAntes: Number,
      internetAntes: Number,
      custoSvaAntes: Number,
      mensalidadeDepois: Number,
      internetDepois: Number,
      icms: Number,
      ganhoLiquidoMes: Number,
    },
    status: {
      type: String,
      enum: ['novo', 'em_contato', 'proposta_enviada', 'contratado', 'descartado'],
      default: 'novo',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProviderLead', providerLeadSchema);
