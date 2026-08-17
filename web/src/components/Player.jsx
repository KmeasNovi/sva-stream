'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { proxiedImage } from '../lib/imageProxy';

// Renderiza o player embutido do provedor de origem — nunca servimos o arquivo
// de vídeo nós mesmos, só o metadado + a referência (source.provider/id).
//
// Quando existe videoFileUrl (link direto pro arquivo no archive.org), usamos
// um <video> nativo em vez do iframe de embed padrão — necessário sempre que
// o filme tem legenda em pt-BR (subtitleUrl, que não dá pra injetar num
// iframe de outro domínio) E também para itens que são um arquivo específico
// dentro de uma coleção com vários arquivos (archive.org/embed/<id>/<arquivo>
// não funciona de verdade — carrega a página geral da coleção, não o arquivo
// escolhido; só o link direto de download resolve o arquivo certo).
//
// Sem o atributo crossOrigin de propósito: alguns nós de armazenamento do
// archive.org não mandam Access-Control-Allow-Origin no arquivo final (depois
// do redirect de /download/), e com crossOrigin="anonymous" o navegador exige
// esse header pra tocar — sem ele, o vídeo carregava a página mas ficava preto/
// travado. Não precisamos de crossOrigin de verdade (não lemos pixel via
// canvas, e a legenda é servida do nosso próprio domínio), então tocar sem
// esse atributo funciona em qualquer nó, com ou sem CORS configurado.
// A maior parte dos filmes toca via iframe de embed de terceiro
// (archive.org) — como é cross-origin, não temos acesso ao DOM/eventos de
// lá dentro, então não dá pra saber com certeza quando o vídeo termina, e o
// que o player deles mostra ao final (inclusive sugestões de outros itens
// do archive.org, fora da plataforma) foge do nosso controle. Pra resolver
// isso, sobrepomos nosso próprio painel de "assista também" (só com filmes
// do catálogo, sempre levando pra dentro do site) por cima do player:
// - quando existe <video> nativo (videoFileUrl), disparamos no evento real
//   `ended`, sem incerteza;
// - quando é o iframe, aproximamos usando a duração do filme
//   (runtimeMinutes) como temporizador a partir do início da reprodução.
//   Não é perfeito (a pessoa pode pausar/voltar), por isso o painel tem um
//   botão de fechar pra quem ainda está assistindo.
function UpNextOverlay({ movies, onClose }) {
  if (!movies?.length) return null;

  // Layout pensado pro pior caso: player em aspect-video numa tela de
  // celular na vertical tem pouca altura disponível (ex: ~210px numa tela
  // de 375px de largura). overflow-y-auto garante que sempre dá pra rolar
  // até o fim em vez de cortar cards/título; tamanhos e espaçamentos menores
  // no mobile (só crescem a partir de sm:) evitam que isso seja necessário
  // na maioria dos casos.
  return (
    <div className="absolute inset-0 z-20 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center overflow-y-auto p-3 sm:p-6 md:p-8 animate-in fade-in duration-300">
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar e continuar assistindo"
        className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
      >
        <span className="material-symbols-outlined text-lg sm:text-xl">close</span>
      </button>

      <h3 className="font-display text-sm sm:text-headline-sm md:text-headline-md text-on-background mb-3 sm:mb-6 text-center px-8">
        Assista também no SepiaStream
      </h3>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 max-w-3xl">
        {movies.slice(0, 4).map((movie) => (
          <Link
            key={movie._id}
            href={`/movie/${movie.slug}`}
            className="w-[85px] sm:w-[120px] md:w-[160px] group flex-none"
          >
            <div className="relative aspect-[2/3] rounded-lg sm:rounded-xl overflow-hidden border border-white/10 bg-surface-container">
              {movie.posterUrl || movie.backdropUrl ? (
                <Image
                  src={proxiedImage(movie.posterUrl || movie.backdropUrl, 320)}
                  alt={movie.title}
                  fill
                  sizes="160px"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : null}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <span className="material-symbols-outlined text-white text-2xl sm:text-3xl">play_arrow</span>
              </div>
            </div>
            <p className="font-body text-on-background text-xs sm:text-sm mt-1 sm:mt-2 leading-snug text-center line-clamp-2 group-hover:text-primary transition-colors">
              {movie.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Capa clicável que substitui o player até a pessoa decidir assistir — o
// <iframe> do archive.org carrega uma página inteira de terceiro (HTML, CSS,
// JS do player deles), e sem isso ele começava a baixar tudo isso assim que
// a página do filme abria, mesmo que a pessoa só estivesse lendo a sinopse.
// Mesmo padrão usado por embeds de vídeo profissionais (YouTube, Vimeo).
function PlayFacade({ posterUrl, title, onPlay }) {
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`Assistir ${title}`}
      className="group absolute inset-0 w-full h-full cursor-pointer"
    >
      {posterUrl ? (
        <Image
          src={proxiedImage(posterUrl, 1280)}
          alt={title}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      ) : null}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors flex items-center justify-center">
        <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/90 group-hover:bg-primary group-hover:scale-110 transition-all flex items-center justify-center shadow-2xl">
          <span className="material-symbols-outlined text-on-primary text-4xl sm:text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            play_arrow
          </span>
        </span>
      </div>
    </button>
  );
}

export default function Player({ source, title, videoFileUrl, subtitleUrl, posterUrl, relatedMovies, runtimeMinutes }) {
  const mediaRef = useRef(null);
  const [showUpNext, setShowUpNext] = useState(false);
  const [started, setStarted] = useState(false);

  // Iframe (maioria dos filmes): aproxima o "fim" pela duração conhecida do
  // filme. O temporizador só começa a contar quando `started` vira true —
  // ou seja, no clique real na capa (ver PlayFacade acima), não quando a
  // página carrega (antes disso a pessoa pode só estar lendo a sinopse).
  // Como a capa clicável já nos dá o momento exato do clique, não precisa
  // mais da heurística de detectar foco entrando no iframe.
  useEffect(() => {
    if (!started || videoFileUrl || !runtimeMinutes || !relatedMovies?.length) return undefined;
    const timer = setTimeout(() => setShowUpNext(true), runtimeMinutes * 60 * 1000);
    return () => clearTimeout(timer);
  }, [started, videoFileUrl, runtimeMinutes, relatedMovies]);

  // No mobile, o botão de tela cheia é do player do archive.org (dentro do
  // iframe) — não temos como colocar um botão nosso ali. Mas o Fullscreen
  // API propaga pro documento pai: quando o elemento dentro do iframe entra
  // em fullscreen, `document.fullscreenElement` no NOSSO documento vira o
  // próprio <iframe>/<video>. Detectando isso, giramos a tela pra paisagem
  // via Screen Orientation API — só funciona em navegadores que suportam
  // lock() em fullscreen (Chrome/Android; Safari/iOS não suporta, então
  // simplesmente não faz nada lá, sem quebrar).
  useEffect(() => {
    function handleFullscreenChange() {
      const fsElement = document.fullscreenElement || document.webkitFullscreenElement;
      const orientation = window.screen?.orientation;
      if (fsElement && fsElement === mediaRef.current) {
        orientation?.lock?.('landscape').catch(() => {});
      } else if (!fsElement) {
        try {
          orientation?.unlock?.();
        } catch {
          // ignora — nem todo navegador permite unlock fora de fullscreen
        }
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!source?.id) return null;

  if (videoFileUrl) {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl shadow-primary/10">
        {started ? (
          <video
            ref={mediaRef}
            controls
            autoPlay
            preload="metadata"
            poster={posterUrl ? proxiedImage(posterUrl, 1280) : undefined}
            onEnded={() => setShowUpNext(true)}
            className="absolute inset-0 w-full h-full"
          >
            <source src={videoFileUrl} type="video/mp4" />
            {subtitleUrl ? <track kind="subtitles" src={subtitleUrl} srcLang="pt-BR" label="Português" default /> : null}
          </video>
        ) : (
          <PlayFacade posterUrl={posterUrl} title={title} onPlay={() => setStarted(true)} />
        )}
        {showUpNext ? <UpNextOverlay movies={relatedMovies} onClose={() => setShowUpNext(false)} /> : null}
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
      ? `https://www.youtube.com/embed/${source.id}?autoplay=1`
      : `https://archive.org/embed/${archiveEmbedPath}?autoplay=1`;

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl shadow-primary/10">
      {started ? (
        <iframe
          ref={mediaRef}
          src={embedSrc}
          title={title}
          allow="autoplay; fullscreen"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <PlayFacade posterUrl={posterUrl} title={title} onPlay={() => setStarted(true)} />
      )}
      {showUpNext ? <UpNextOverlay movies={relatedMovies} onClose={() => setShowUpNext(false)} /> : null}
    </div>
  );
}
