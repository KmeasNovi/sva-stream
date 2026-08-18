const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Ausente para contas criadas via Google — só contas locais têm senha.
    passwordHash: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    avatarUrl: { type: String },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordTokenExpires: { type: Date },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
    // Estrutura da assinatura paga (plano Premium, ver server/src/config/plans.js)
    // — campos escolhidos pra espelhar de perto o que qualquer gateway de
    // pagamento por assinatura (Stripe, Mercado Pago, etc.) já expõe, então a
    // integração futura só preenche esses campos em vez de exigir modelagem
    // nova. Enquanto não há gateway configurado, status só muda via admin
    // (outorga manual) — não existe checkout ainda.
    subscription: {
      // 'pending' = assinatura criada no gateway, aguardando confirmação do
      // primeiro pagamento (webhook ainda não chegou ou fatura ainda não paga).
      status: {
        type: String,
        enum: ['none', 'pending', 'active', 'canceled', 'past_due'],
        default: 'none',
      },
      provider: { type: String }, // 'stripe' | 'mercadopago' | 'manual' — preenchido quando um gateway for integrado
      providerCustomerId: { type: String },
      providerSubscriptionId: { type: String },
      // Até quando o acesso pago vale — mesmo com cancelAtPeriodEnd, o
      // acesso continua liberado até essa data (já pago, não é revogado na hora).
      currentPeriodEnd: { type: Date },
      cancelAtPeriodEnd: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// Confere status E validade da data — status "active" sozinho não basta se
// o período pago já venceu (evita depender só de um webhook de expiração
// rodar na hora certa).
userSchema.methods.isPremiumActive = function isPremiumActive() {
  if (!this.subscription || this.subscription.status !== 'active') return false;
  if (this.subscription.currentPeriodEnd && new Date(this.subscription.currentPeriodEnd) < new Date()) return false;
  return true;
};

userSchema.methods.comparePassword = function comparePassword(candidate) {
  // Contas via Google não têm passwordHash — nunca "batem" com senha nenhuma.
  if (!this.passwordHash) return Promise.resolve(false);
  return bcrypt.compare(candidate, this.passwordHash);
};

userSchema.statics.hashPassword = function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
};

module.exports = mongoose.model('User', userSchema);
