// Renderiza o player embutido do provedor de origem — nunca servimos o arquivo
// de vídeo nós mesmos, só o metadado + a referência (source.provider/id).
//
// Quando o filme tem legenda em pt-BR (videoFileUrl + subtitleUrl), usamos um
// <video> nativo apontando direto pro arquivo no archive.org, com uma trilha
// de legenda nossa — não dá pra injetar isso no player embutido em iframe
// (é de outro domínio). Sem legenda, cai no embed padrão de sempre.
export default function Player({ source, title, videoFileUrl, subtitleUrl }) {
  if (!source?.id) return null;

  if (videoFileUrl && subtitleUrl) {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl shadow-primary/10">
        <video controls className="absolute inset-0 w-full h-full" crossOrigin="anonymous">
          <source src={videoFileUrl} type="video/mp4" />
          <track kind="subtitles" src={subtitleUrl} srcLang="pt-BR" label="Português" default />
        </video>
      </div>
    );
  }

  // source.id do archive.org pode ser só o identifier de um item ("nosferatu"),
  // ou "identifier/nome-do-arquivo.mp4" quando o filme é um dos arquivos dentro
  // de uma coleção com vários itens — nesse caso só o nome do arquivo precisa
  // ser url-encoded (o identifier e a barra ficam como estão).
  let archiveEmbedPath = source.id;
  if (source.provider === 'archive' && source.id.includes('/')) {
    const slashIndex = source.id.indexOf('/');
    const identifier = source.id.slice(0, slashIndex);
    const filename = source.id.slice(slashIndex + 1);
    archiveEmbedPath = `${identifier}/${encodeURIComponent(filename)}`;
  }

  const embedSrc =
    source.provider === 'youtube'
      ? `https://www.youtube.com/embed/${source.id}`
      : `https://archive.org/embed/${archiveEmbedPath}`;

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl shadow-primary/10">
      <iframe
        src={embedSrc}
        title={title}
        allow="autoplay; fullscreen"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
