// Décima quinta leva — cinema mudo (dramas, fantasia e adaptações de contos
// de fadas/Oz, cinema soviético mudo e expressionismo alemão) encontrados
// via publicdomainmovie.net e archivewatch.org. Como na leva anterior,
// evitamos aqui títulos mudos "de prestígio" que grandes estúdios ainda
// restauram e relançam ativamente (ex: produções silenciosas de prestígio
// da Paramount/MGM/Fox no fim dos anos 1920, que labels como Criterion
// seguem tratando como propriedade ativa) — preferimos filmes cujo domínio
// público já é bem documentado: produções soviéticas de antes das relações
// de copyright entre URSS e EUA, produções independentes pequenas (Oz Film
// Manufacturing Company, Micheaux Film Corporation) e adaptações de contos
// de domínio público (Dickens, Baum, Stevenson) de estúdios menores.
// source.id verificado manualmente na API do archive.org (duração real do
// vídeo). Sinopse escrita em português a partir dos fatos de cada filme,
// sem reproduzir texto de terceiros.
module.exports = [
  {
    title: 'Within Our Gates',
    slug: 'within-our-gates-1920',
    synopsis:
      'Uma jovem professora negra viaja ao norte dos Estados Unidos para arrecadar fundos para uma escola rural sem recursos, enquanto o filme revela, em flashback, a violência racial que marcou seu passado no sul. Dirigido por Oscar Micheaux, é o filme mais antigo de um cineasta negro americano que se preservou até hoje.',
    year: 1920,
    director: 'Oscar Micheaux',
    genres: ['Drama', 'Mudo', 'Clássico'],
    runtimeMinutes: 74,
    backdropUrl: 'https://archive.org/services/img/silent-within-our-gates',
    source: { provider: 'archive', id: 'silent-within-our-gates' },
    featured: false,
  },
  {
    title: "Tol'able David",
    slug: 'tolable-david-1921',
    synopsis:
      'Numa pequena comunidade rural dos Apalaches, o caçula de uma família é considerado jovem demais para assumir responsabilidades de adulto — até que a violência de uma família de forasteiros brutais o força a provar sua coragem.',
    year: 1921,
    director: 'Henry King',
    cast: ['Richard Barthelmess'],
    genres: ['Drama', 'Mudo', 'Clássico'],
    runtimeMinutes: 94,
    backdropUrl: 'https://archive.org/services/img/silent-tolable-david',
    source: { provider: 'archive', id: 'silent-tolable-david' },
    featured: false,
  },
  {
    title: 'He Who Gets Slapped',
    slug: 'he-who-gets-slapped-1924',
    synopsis:
      'Traído por sua esposa e por um colega que roubam sua pesquisa científica, um cientista humilhado reinventa-se como palhaço de circo cujo número consiste em apanhar tapas — mas o passado volta a persegui-lo quando reencontra os dois em nova forma.',
    year: 1924,
    director: 'Victor Sjöström',
    cast: ['Lon Chaney', 'Norma Shearer'],
    genres: ['Drama', 'Mudo', 'Clássico'],
    runtimeMinutes: 72,
    backdropUrl: 'https://archive.org/services/img/silent-he-who-gets-slapped',
    source: { provider: 'archive', id: 'silent-he-who-gets-slapped' },
    featured: false,
  },
  {
    title: 'Aelita: Queen of Mars',
    slug: 'aelita-queen-of-mars-1924',
    synopsis:
      'Um engenheiro soviético capta um sinal de rádio misterioso vindo de Marte e, entre a rotina conturbada de Moscou pós-revolucionária, sonha em viajar até lá — onde uma rainha marciana governa uma sociedade rigidamente dividida em classes.',
    year: 1924,
    director: 'Yakov Protazanov',
    genres: ['Ficção Científica', 'Mudo', 'Clássico'],
    runtimeMinutes: 111,
    backdropUrl: 'https://archive.org/services/img/AelitaQueenOfMarsoriginalVersion',
    source: { provider: 'archive', id: 'AelitaQueenOfMarsoriginalVersion' },
    featured: false,
  },
  {
    title: 'The Hands of Orlac',
    slug: 'the-hands-of-orlac-1924',
    synopsis:
      'Depois de perder as mãos num acidente de trem, um pianista de concerto recebe um transplante experimental — sem saber que as novas mãos pertenciam a um assassino executado. Aos poucos, ele se convence de que elas ainda têm vontade própria.',
    year: 1924,
    director: 'Robert Wiene',
    cast: ['Conrad Veidt'],
    genres: ['Terror', 'Mudo', 'Clássico'],
    runtimeMinutes: 95,
    backdropUrl: 'https://archive.org/services/img/the.-hands.-of.-orlac.-1924',
    source: { provider: 'archive', id: 'the.-hands.-of.-orlac.-1924' },
    featured: false,
  },
  {
    title: 'The Wonderful Wizard of Oz',
    slug: 'the-wonderful-wizard-of-oz-1910',
    synopsis:
      'A mais antiga adaptação sobrevivente do romance de L. Frank Baum: um furacão leva Dorothy e seu cachorro Totó à Terra de Oz, onde ela faz amizade com um Espantalho, um Homem de Lata e um Leão Covarde na jornada até o misterioso Mágico.',
    year: 1910,
    director: 'Otis Turner',
    genres: ['Aventura', 'Mudo', 'Clássico'],
    runtimeMinutes: 13,
    backdropUrl: 'https://archive.org/services/img/The_Wonderful_Wizard_of_Oz',
    source: { provider: 'archive', id: 'The_Wonderful_Wizard_of_Oz' },
    featured: false,
  },
  {
    title: 'The Magic Cloak of Oz',
    slug: 'the-magic-cloak-of-oz-1914',
    synopsis:
      'Produção da própria Oz Film Manufacturing Company de L. Frank Baum: uma princesa exilada usa uma capa mágica de invisibilidade para escapar de uma rainha usurpadora e recuperar seu lugar de direito.',
    year: 1914,
    director: 'J. Farrell MacDonald',
    genres: ['Aventura', 'Mudo', 'Clássico'],
    runtimeMinutes: 37,
    backdropUrl: 'https://archive.org/services/img/the-magic-cloak-of-oz-1914',
    source: { provider: 'archive', id: 'the-magic-cloak-of-oz-1914' },
    featured: false,
  },
  {
    title: 'The Patchwork Girl of Oz',
    slug: 'the-patchwork-girl-of-oz-1914',
    synopsis:
      'Um jovem fazendeiro de Oz acidentalmente petrifica seus tios com um pó mágico e parte numa jornada para conseguir o antídoto, acompanhado por uma boneca de retalhos que ganhou vida por engano.',
    year: 1914,
    director: 'J. Farrell MacDonald',
    genres: ['Aventura', 'Mudo', 'Clássico'],
    runtimeMinutes: 48,
    backdropUrl: 'https://archive.org/services/img/PatchworkOZ',
    source: { provider: 'archive', id: 'PatchworkOZ' },
    featured: false,
  },
  {
    title: 'His Majesty, the Scarecrow of Oz',
    slug: 'his-majesty-the-scarecrow-of-oz-1914',
    synopsis:
      'O Espantalho de Oz assume o trono depois que a bruxa Momba tenta usurpar o poder do reino, numa aventura repleta de transformações mágicas baseada nos livros de L. Frank Baum.',
    year: 1914,
    director: 'J. Farrell MacDonald',
    genres: ['Aventura', 'Mudo', 'Clássico'],
    runtimeMinutes: 59,
    backdropUrl: 'https://archive.org/services/img/His_Maj_Scarecrow_OZ',
    source: { provider: 'archive', id: 'His_Maj_Scarecrow_OZ' },
    featured: false,
  },
  {
    title: 'A Fool There Was',
    slug: 'a-fool-there-was-1915',
    synopsis:
      'Um diplomata respeitável abandona família e carreira depois de se apaixonar por uma sedutora sem escrúpulos, numa história que consagrou a palavra "vamp" para descrever mulheres fatais no cinema mudo americano.',
    year: 1915,
    director: 'Frank Powell',
    cast: ['Theda Bara'],
    genres: ['Drama', 'Mudo', 'Clássico'],
    runtimeMinutes: 66,
    backdropUrl: 'https://archive.org/services/img/A_Fool_There_Was',
    source: { provider: 'archive', id: 'A_Fool_There_Was' },
    featured: false,
  },
  {
    title: 'The Cheat',
    slug: 'the-cheat-1915',
    synopsis:
      'Uma socialite endividada aceita dinheiro emprestado de um comerciante em troca de favores, mas quando tenta devolver a quantia e recusar o acordo, ele a marca a ferro como se fosse uma posse — desencadeando um julgamento tenso pelo crime que se segue.',
    year: 1915,
    director: 'Cecil B. DeMille',
    cast: ['Sessue Hayakawa', 'Fannie Ward'],
    genres: ['Drama', 'Mudo', 'Clássico'],
    runtimeMinutes: 59,
    backdropUrl: 'https://archive.org/services/img/TheCheat1915',
    source: { provider: 'archive', id: 'TheCheat1915' },
    featured: false,
  },
  {
    title: 'Suds',
    slug: 'suds-1920',
    synopsis:
      'Uma lavadeira pobre e sonhadora se apaixona à distância por um cliente que nunca veio buscar sua camisa, e passa a viver de fantasias românticas sobre ele enquanto lida com a dureza do trabalho na lavanderia.',
    year: 1920,
    director: 'John Francis Dillon',
    cast: ['Mary Pickford'],
    genres: ['Comédia', 'Drama', 'Mudo', 'Clássico'],
    runtimeMinutes: 66,
    backdropUrl: 'https://archive.org/services/img/Suds1920MaryPickford',
    source: { provider: 'archive', id: 'Suds1920MaryPickford' },
    featured: false,
  },
  {
    title: 'Enoch Arden',
    slug: 'enoch-arden-1911',
    synopsis:
      'Baseado no poema de Tennyson: um marinheiro naufraga numa ilha deserta e, anos depois, ao finalmente conseguir voltar para casa, descobre que a esposa o deu por morto e refez a vida ao lado de outro homem.',
    year: 1911,
    director: 'D.W. Griffith',
    genres: ['Drama', 'Mudo', 'Clássico'],
    runtimeMinutes: 33,
    backdropUrl: 'https://archive.org/services/img/EnochArden',
    source: { provider: 'archive', id: 'EnochArden' },
    featured: false,
  },
  {
    title: 'A Corner in Wheat',
    slug: 'a-corner-in-wheat-1909',
    synopsis:
      'Um especulador financeiro monopoliza o mercado de trigo e enriquece enquanto o preço do pão dispara para os mais pobres, num curta que intercala a fartura dos ricos com a fome dos famintos numa crítica direta ao capitalismo desenfreado.',
    year: 1909,
    director: 'D.W. Griffith',
    genres: ['Drama', 'Mudo', 'Clássico'],
    runtimeMinutes: 11,
    backdropUrl: 'https://archive.org/services/img/acornerinwheat_201703_202410',
    source: { provider: 'archive', id: 'acornerinwheat_201703_202410' },
    featured: false,
  },
];
