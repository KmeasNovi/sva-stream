// Gera o payload "Copia e Cola" do PIX (padrão BR Code / EMV do Banco
// Central) a partir de uma chave estática, sem valor fixo (o doador
// escolhe quanto quer mandar). Testado contra o vetor de teste conhecido
// de CRC-16/CCITT-FALSE ("123456789" -> 0x29B1) antes de usar em produção.
function crc16(str) {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function field(id, value) {
  return `${id}${String(value.length).padStart(2, '0')}${value}`;
}

export function generatePixPayload({ key, name, city }) {
  const merchantAccountInfo = field('00', 'BR.GOV.BCB.PIX') + field('01', key);
  const additionalData = field('05', '***');

  const payloadWithoutCrc =
    field('00', '01') +
    field('01', '11') +
    field('26', merchantAccountInfo) +
    field('52', '0000') +
    field('53', '986') +
    field('58', 'BR') +
    field('59', name) +
    field('60', city) +
    field('62', additionalData) +
    '6304';

  return payloadWithoutCrc + crc16(payloadWithoutCrc);
}
