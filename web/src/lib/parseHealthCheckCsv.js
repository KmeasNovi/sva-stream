// Parser bem simples pro CSV que a própria aba "Verificar links" gera
// (server/src/controllers/healthCheckController.js) — não é um parser CSV
// genérico, só entende exatamente esse formato: campos sempre entre aspas,
// vírgula como separador, aspas internas escapadas como "".
export function parseHealthCheckCsv(text) {
  const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length);
  if (lines.length < 2) return [];

  return lines.slice(1).map((line) => {
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (inQuotes) {
        if (char === '"') {
          if (line[i + 1] === '"') {
            current += '"';
            i += 1;
          } else {
            inQuotes = false;
          }
        } else {
          current += char;
        }
      } else if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        fields.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current);
    const [title, slug, field] = fields;
    return { title, slug, field };
  });
}

// Agrupa as linhas (uma por problema) em uma por filme, marcando se precisa
// corrigir pôster/backdrop e/ou vídeo — um filme pode aparecer 2x no CSV
// (pôster quebrado E vídeo quebrado ao mesmo tempo).
export function groupBrokenBySlug(rows) {
  const map = new Map();
  for (const row of rows) {
    if (!row.slug) continue;
    const fieldLower = (row.field || '').toLowerCase();
    const isPoster = fieldLower.includes('pôster') || fieldLower.includes('poster') || fieldLower.includes('backdrop');
    const isVideo = fieldLower.includes('vídeo') || fieldLower.includes('video');
    const entry = map.get(row.slug) || { slug: row.slug, title: row.title, needsPoster: false, needsVideo: false };
    if (isPoster) entry.needsPoster = true;
    if (isVideo) entry.needsVideo = true;
    map.set(row.slug, entry);
  }
  return [...map.values()];
}
