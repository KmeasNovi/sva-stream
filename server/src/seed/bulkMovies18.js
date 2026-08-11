// Décima oitava leva — miscelânea (documentário de guerra, cinema mudo
// alemão pré-1923, animação em silhueta, vanguarda francesa e um B-movie de
// ação) que fecha os itens pendentes da correção do bug de duração mínima
// mencionada em bulkMovies13.js, mais achados avulsos de archivewatch.org.
// source.id verificado manualmente na API do archive.org (duração real do
// vídeo). Sinopse escrita em português a partir dos fatos de cada filme,
// sem reproduzir texto de terceiros.
module.exports = [
  {
    title: 'The Student of Prague',
    slug: 'the-student-of-prague-1913',
    synopsis:
      'Um estudante pobre e endividado faz um pacto com um misterioso feiticeiro, vendendo o próprio reflexo no espelho em troca de riqueza — mas o duplo ganha vida própria e passa a arruinar tudo que ele mais valoriza. Um dos marcos fundadores do cinema fantástico alemão.',
    year: 1913,
    director: 'Stellan Rye',
    cast: ['Paul Wegener'],
    genres: ['Terror', 'Mudo', 'Clássico'],
    runtimeMinutes: 19,
    backdropUrl: 'https://archive.org/services/img/silent-the-student-of-prague',
    source: { provider: 'archive', id: 'silent-the-student-of-prague' },
    featured: false,
  },
  {
    title: 'Listen to Britain',
    slug: 'listen-to-britain-1942',
    synopsis:
      'Documentário de propaganda britânica sem narração, montado a partir de sons e imagens do cotidiano em tempo de guerra — fábricas, trens, rádios, um piano numa cantina de operários — para retratar a resistência silenciosa do país sob bombardeio.',
    year: 1942,
    director: 'Humphrey Jennings',
    genres: ['Documentário', 'Clássico'],
    runtimeMinutes: 20,
    backdropUrl: 'https://archive.org/services/img/gov.archives.arc.38651',
    source: { provider: 'archive', id: 'gov.archives.arc.38651' },
    featured: false,
  },
  {
    title: 'Battle of Midway',
    slug: 'battle-of-midway-1942',
    synopsis:
      'Documentário de guerra filmado em cores durante a própria Batalha de Midway, com o diretor John Ford ferido em combate enquanto operava a câmera — um retrato direto e cru de um dos pontos de virada da Guerra do Pacífico.',
    year: 1942,
    director: 'John Ford',
    genres: ['Documentário', 'Clássico'],
    runtimeMinutes: 18,
    backdropUrl: 'https://archive.org/services/img/gov.archives.arc.13196',
    source: { provider: 'archive', id: 'gov.archives.arc.13196' },
    featured: false,
  },
  {
    title: 'The Star of Bethlehem',
    slug: 'the-star-of-bethlehem-1956',
    synopsis:
      'Animação em silhuetas recortadas que narra a história do nascimento de Jesus e a jornada dos Reis Magos guiados pela estrela, na técnica característica da pioneira da animação Lotte Reiniger.',
    year: 1956,
    director: 'Lotte Reiniger',
    genres: ['Animação', 'Clássico'],
    runtimeMinutes: 11,
    backdropUrl: 'https://archive.org/services/img/reiniger_the_star_of_bethlehem',
    source: { provider: 'archive', id: 'reiniger_the_star_of_bethlehem' },
    featured: false,
  },
  {
    title: 'Ménilmontant',
    slug: 'menilmontant-1926',
    synopsis:
      'Filme mudo de vanguarda francesa contado quase inteiramente por imagens e montagem, sem cartelas de diálogo: duas irmãs órfãs se mudam para Paris, onde a traição de um homem e a dureza da cidade grande as separam.',
    year: 1926,
    director: 'Dimitri Kirsanoff',
    genres: ['Drama', 'Mudo', 'Clássico'],
    runtimeMinutes: 38,
    backdropUrl: 'https://archive.org/services/img/menilmontant1924-25',
    source: { provider: 'archive', id: 'menilmontant1924-25' },
    featured: false,
  },
  {
    title: 'The Fast and the Furious',
    slug: 'the-fast-and-the-furious-1955',
    synopsis:
      'Um homem foragido, injustamente acusado de assassinato, sequestra uma piloto de corridas e a força a ajudá-lo a fugir para o México disputando um rali automobilístico internacional — sem nenhuma relação com a franquia de ação homônima que viria décadas depois.',
    year: 1955,
    director: 'John Ireland',
    cast: ['John Ireland', 'Dorothy Malone'],
    genres: ['Suspense', 'Clássico'],
    runtimeMinutes: 73,
    backdropUrl: 'https://archive.org/services/img/The_Fast_and_the_Furious',
    source: { provider: 'archive', id: 'The_Fast_and_the_Furious' },
    featured: false,
  },
];
