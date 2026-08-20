'use client';

import useIsPro from '../lib/useIsPro';

// Anúncio "Banner" do Adsterra — empilhado junto com o AdSense nos mesmos
// espaços (ver AdSlot.jsx), nunca substituindo. Cada tamanho usa uma "key"
// de zona diferente (Adsterra > Websites > sepiastream.com > Ad unit > Get
// code), configurada por env var — enquanto a key não existir, é um no-op
// silencioso, mesmo padrão do AdSlot/AdSense.
//
// O script oficial do Adsterra (`invoke.js`) lê a variável global
// `atOptions` de forma síncrona ao carregar e injeta o anúncio via
// document.write. Isso não dá pra usar direto na página: múltiplas
// instâncias com keys diferentes pisariam na mesma `atOptions` global, e
// document.write não funciona em script injetado depois do load inicial.
// Por isso cada instância roda isolada dentro do próprio <iframe srcDoc> —
// documento HTML completo à parte, sem esse conflito.
const SIZES = {
  '728x90': {
    key: process.env.NEXT_PUBLIC_ADSTERRA_BANNER_728X90_KEY,
    width: 728,
    height: 90,
  },
  '300x250': {
    key: process.env.NEXT_PUBLIC_ADSTERRA_BANNER_300X250_KEY,
    width: 300,
    height: 250,
  },
};

function buildSrcDoc(key, width, height) {
  const atOptions = { key, format: 'iframe', height, width, params: {} };
  return `<!DOCTYPE html><html><body style="margin:0;overflow:hidden">
<script>atOptions=${JSON.stringify(atOptions)};</script>
<script src="https://www.highperformanceformat.com/${key}/invoke.js"></script>
</body></html>`;
}

export default function AdsterraBanner({ size, className = '' }) {
  // Mesma regra do AdSlot.jsx: nunca tem anúncio em pro.sepiastream.com.
  const isPro = useIsPro();
  const hideAds = isPro;
  const config = SIZES[size];

  if (!config?.key || hideAds) return null;

  return (
    <iframe
      title={`adsterra-banner-${size}`}
      srcDoc={buildSrcDoc(config.key, config.width, config.height)}
      width={config.width}
      height={config.height}
      style={{ border: 0, display: 'block', maxWidth: '100%' }}
      className={className}
      scrolling="no"
    />
  );
}
