// Quadragésima terceira leva — primeira rodada usando o serviço de busca em
// Python (scraper/), rodado pelo usuário via /admin/dashboard/busca com as
// 6 fontes ativas de uma vez. Resultado bruto: 1.586 aprovados de 9.958
// candidatos avaliados. Só 12 vieram de fontes que exigem revisão jurídica
// título a título (archivewatch.org/emol.org, que indexam qualquer coisa do
// archive.org sem filtro de origem) — os outros 1.574 (retroflix.org +
// coleções prelinger do archive.org) já têm licenseurl de domínio público
// confirmado e forma o grosso desta leva em arquivos separados
// (bulkMovies44.js em diante).
//
// Desta parte (os 12 revisados manualmente), 5 aprovados: Scared to Death e
// The Kid Brother e Battle Beyond the Sun têm licenseurl de domínio público
// explícito no archive.org; The Kid Brother e Eyes of Youth e Au Bonheur
// des Dames também são pré-1930 (domínio público por idade, 95 anos).
// Rejeitados: Tarantula e Bride of Frankenstein (Universal, clássicos ainda
// muito explorados comercialmente), The Harder They Fall (Columbia), This
// Gun for Hire (Paramount), Libel (MGM), Los Tallos Amargos (clássico
// argentino com restauração recente e ativa por instituição de preservação
// fílmica), Felix The Cat Classic Cartoons (a própria descrição no
// archive.org lista vários curtas diferentes bundlados num item só, não um
// filme único).
module.exports = [
  {
    "title": "Scared to Death",
    "slug": "scared-to-death-1947",
    "synopsis": "Único filme colorido estrelado por Bela Lugosi: um mistério policial narrado em flashback pela própria vítima, já morta, reconstituindo a cadeia de eventos que levou ao seu assassinato.",
    "year": 1947,
    "genres": ["Suspense", "Terror", "Clássico"],
    "backdropUrl": "https://archive.org/services/img/Scared_to_Death",
    "source": { "provider": "archive", "id": "Scared_to_Death" },
    "featured": false,
    "runtimeMinutes": 67
  },
  {
    "title": "Battle Beyond the Sun",
    "slug": "battle-beyond-the-sun",
    "synopsis": "Ficção científica sobre uma corrida entre duas potências rivais para ser a primeira a pousar em Marte, readaptada por Roger Corman a partir de um filme soviético original para o mercado americano.",
    "genres": ["Ficção Científica", "Clássico"],
    "backdropUrl": "https://archive.org/services/img/BattleBeyondTheSun",
    "source": { "provider": "archive", "id": "BattleBeyondTheSun" },
    "featured": false,
    "runtimeMinutes": 67
  },
  {
    "title": "The Kid Brother",
    "slug": "the-kid-brother-1927",
    "synopsis": "Comédia muda estrelada por Harold Lloyd como o caçula desajeitado de uma família de homens fortes, que precisa provar seu valor ao enfrentar bandidos que roubam o dinheiro da cidade.",
    "year": 1927,
    "director": "Ted Wilde, J.A. Howe",
    "genres": ["Comédia", "Mudo", "Clássico"],
    "backdropUrl": "https://archive.org/services/img/the-kid-brother-1927_202508",
    "source": { "provider": "archive", "id": "the-kid-brother-1927_202508" },
    "featured": false,
    "runtimeMinutes": 83
  },
  {
    "title": "Au Bonheur des Dames",
    "slug": "au-bonheur-des-dames-1930",
    "synopsis": "Adaptação muda francesa do romance de Émile Zola sobre a ascensão de uma grande loja de departamentos parisiense e o impacto disso sobre os pequenos comerciantes ao redor.",
    "year": 1930,
    "director": "Julien Duvivier",
    "genres": ["Drama", "Mudo", "Clássico"],
    "backdropUrl": "https://archive.org/services/img/au-bonheur-des-dames_1930",
    "source": { "provider": "archive", "id": "au-bonheur-des-dames_1930" },
    "featured": false,
    "runtimeMinutes": 89
  },
  {
    "title": "Eyes of Youth",
    "slug": "eyes-of-youth-1919",
    "synopsis": "Drama mudo sobre uma jovem numa encruzilhada da vida, que ganha a chance de vislumbrar o futuro que cada escolha possível reservaria para ela.",
    "year": 1919,
    "director": "Albert Parker",
    "genres": ["Drama", "Mudo", "Clássico"],
    "backdropUrl": "https://archive.org/services/img/EyesOfYouthPd19",
    "source": { "provider": "archive", "id": "EyesOfYouthPd19" },
    "featured": false,
    "runtimeMinutes": 169
  }
];
