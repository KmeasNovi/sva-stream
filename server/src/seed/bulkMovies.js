// Filmes adicionados em lote a partir de uma lista publica de dominio publico.
// source.id foi resolvido automaticamente via busca na API do archive.org
// (nome do filme + ano, com checagem de similaridade de titulo). A sinopse
// foi escrita em português a partir dos fatos do filme (direção, elenco,
// enredo), sem reproduzir o texto original da Wikipedia.
// Alguns identifiers podem estar errados -- confira e corrija pelo /admin
// se notar algum player quebrado ou fora do filme.
module.exports = [
  {
    title: "The Little Princess",
    slug: "the-little-princess-1939",
    synopsis: "The Little Princess é um filme de drama americano de 1939, dirigido por Walter Lang e estrelado por Shirley Temple.",
    year: 1939,
    genres: [
      "Drama",
      "Clássico"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/1/10/Poster_of_the_movie_The_Little_Princess.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/TheLittlePrincess1939",
    source: {
      provider: "archive",
      id: "TheLittlePrincess1939"
    },
    featured: false
  },
  {
    title: "Of Human Bondage",
    slug: "of-human-bondage-1934",
    synopsis: "Of Human Bondage é um filme de drama americano de 1934, dirigido por John Cromwell, considerado o papel que consagrou Bette Davis como estrela.",
    year: 1934,
    genres: [
      "Drama",
      "Clássico"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Of_Human_Bondage_Poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/of.-human.-bondage.-1934.1080p.-blu-ray.-h-264.-aac-rarbg",
    source: {
      provider: "archive",
      id: "of.-human.-bondage.-1934.1080p.-blu-ray.-h-264.-aac-rarbg"
    },
    featured: false
  },
  {
    title: "Penny Serenade",
    slug: "penny-serenade-1941",
    synopsis: "Penny Serenade é um melodrama americano de 1941, dirigido por George Stevens, estrelado por Irene Dunne e Cary Grant como um casal que enfrenta adversidades para manter o casamento e criar um filho.",
    year: 1941,
    genres: [
      "Drama",
      "Clássico"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/e/e8/Penny_Serenade_1941_Poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/PennySerenade1941_201711",
    source: {
      provider: "archive",
      id: "PennySerenade1941_201711"
    },
    featured: false
  },
  {
    title: "The General",
    slug: "the-general-1926",
    synopsis: "The General é uma comédia muda americana de 1926 estrelada e codirigida por Buster Keaton, sobre um maquinista que persegue o próprio trem roubado durante a Guerra Civil americana.",
    year: 1926,
    genres: [
      "Drama",
      "Clássico"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0c/The_General_%281926%29_-_Movie_Poster_2.png",
    backdropUrl: "https://archive.org/services/img/The_General_Buster_Keaton",
    source: {
      provider: "archive",
      id: "The_General_Buster_Keaton"
    },
    featured: false
  },
  {
    title: "The Phantom of the Opera",
    slug: "the-phantom-of-the-opera-1925",
    synopsis: "The Phantom of the Opera é um filme de terror mudo americano de 1925, adaptação do romance de Gaston Leroux, dirigido por Rupert Julian e estrelado por Lon Chaney no papel do Fantasma desfigurado que assombra a Ópera de Paris.",
    year: 1925,
    genres: [
      "Drama",
      "Clássico"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/5/53/Phantom_of_the_opera_1925_poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/ThePhantomOfTheOpera1925NewYorkGeneralReleasePrint_620",
    source: {
      provider: "archive",
      id: "ThePhantomOfTheOpera1925NewYorkGeneralReleasePrint_620"
    },
    featured: false
  },
  {
    title: "The Gold Rush",
    slug: "the-gold-rush-1925",
    synopsis: "The Gold Rush é uma comédia muda americana de 1925 escrita, produzida e dirigida por Charlie Chaplin, que interpreta um garimpeiro solitário em busca de fortuna durante a corrida do ouro no Alasca.",
    year: 1925,
    genres: [
      "Drama",
      "Clássico"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Gold_rush_poster.jpg",
    backdropUrl: "https://archive.org/services/img/the-gold-rush-film-1925",
    source: {
      provider: "archive",
      id: "the-gold-rush-film-1925"
    },
    featured: false
  },
  {
    title: "Intolerance",
    slug: "intolerance-1916",
    synopsis: "Intolerance é um filme mudo americano de 1916 dirigido por D. W. Griffith, que entrelaça quatro histórias de épocas diferentes para retratar os efeitos da intolerância humana.",
    year: 1916,
    genres: [
      "Drama",
      "Clássico"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/8/88/Intolerance_%28film%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/INTOLERANCE_201407",
    source: {
      provider: "archive",
      id: "INTOLERANCE_201407"
    },
    featured: false
  },
  {
    title: "Broken Blossoms",
    slug: "broken-blossoms-1919",
    synopsis: "Broken Blossoms é um melodrama mudo americano de 1919 dirigido por D. W. Griffith, sobre a amizade entre um imigrante chinês e uma jovem maltratada pelo pai em Londres.",
    year: 1919,
    genres: [
      "Drama",
      "Clássico"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/Let%C3%B6rt_bimb%C3%B3k_magyar_filmplak%C3%A1t_%28Nemes_Gy%C3%B6rgy%2C_1923%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/brokenblossoms1919",
    source: {
      provider: "archive",
      id: "brokenblossoms1919"
    },
    featured: false
  },
  {
    title: "The Birth of a Nation",
    slug: "the-birth-of-a-nation-1915",
    synopsis: "The Birth of a Nation é um drama épico mudo americano de 1915 dirigido por D. W. Griffith, ambientado na Guerra Civil e na Reconstrução — um marco técnico da linguagem cinematográfica, mas também amplamente criticado por seu retrato racista da história americana.",
    year: 1915,
    genres: [
      "Drama",
      "Clássico"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/6/61/Birth_of_a_Nation_theatrical_poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/TheBirthOfANation19151080p",
    source: {
      provider: "archive",
      id: "TheBirthOfANation19151080p"
    },
    featured: false
  },
  {
    title: "Steamboat Bill Jr.",
    slug: "steamboat-bill-jr-1928",
    synopsis: "Steamboat Bill Jr. é uma comédia muda americana de 1928 estrelada por Buster Keaton, sobre um jovem desajeitado que tenta impressionar o pai, capitão de um barco a vapor — famosa pela cena em que a fachada de uma casa desaba sobre Keaton, que escapa ileso pelo vão de uma janela.",
    year: 1928,
    genres: [
      "Comédia",
      "Clássico"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Steamboat_bill_poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/STEAMBOATBILLJR.1928BusterKeaton",
    source: {
      provider: "archive",
      id: "STEAMBOATBILLJR.1928BusterKeaton"
    },
    featured: false
  },
  {
    title: "Sherlock Jr.",
    slug: "sherlock-jr-1924",
    synopsis: "Sherlock Jr. é uma comédia muda americana de 1924 estrelada e dirigida por Buster Keaton, sobre um projecionista de cinema que sonha entrar na tela e viver as aventuras de um detetive.",
    year: 1924,
    genres: [
      "Comédia",
      "Clássico"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Sherlock_jr_poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/sherlockjr1924_201909",
    source: {
      provider: "archive",
      id: "sherlockjr1924_201909"
    },
    featured: false
  },
  {
    title: "The Kid",
    slug: "the-kid-1921",
    synopsis: "The Kid é uma comédia dramática muda americana de 1921 escrita, produzida, dirigida e estrelada por Charlie Chaplin, sobre um vagabundo que cria um menino abandonado, interpretado por Jackie Coogan.",
    year: 1921,
    genres: [
      "Comédia",
      "Clássico"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b5/The_Kid_%281921%29_poster.jpg",
    backdropUrl: "https://archive.org/services/img/the-kid_202509",
    source: {
      provider: "archive",
      id: "the-kid_202509"
    },
    featured: false
  },
  {
    title: "One Week",
    slug: "one-week-1920",
    synopsis: "One Week é uma comédia muda americana de 1920, o primeiro curta-metragem produzido de forma independente por Buster Keaton, sobre um casal recém-casado que tenta montar uma casa pré-fabricada cujas peças vêm fora de ordem.",
    year: 1920,
    genres: [
      "Comédia",
      "Clássico"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Buster_Keaton_One_Week_Ad_-_Motion_Picture_News_%28Oct_9%2C_1920%29.jpg",
    backdropUrl: "https://archive.org/services/img/one_week_1920",
    source: {
      provider: "archive",
      id: "one_week_1920"
    },
    featured: false
  },
  {
    title: "The Navigator",
    slug: "the-navigator-1924",
    synopsis: "The Navigator é uma comédia muda americana de 1924 estrelada e dirigida por Buster Keaton, sobre um casal de ricos mimados que se vê sozinho a bordo de um transatlântico à deriva.",
    year: 1924,
    genres: [
      "Comédia",
      "Clássico"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ac/The_Navigator_%281924%29_Window_Card.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/the-navigator-keaton-1924-high-quality-1080p-fgo-qarunxf-q",
    source: {
      provider: "archive",
      id: "the-navigator-keaton-1924-high-quality-1080p-fgo-qarunxf-q"
    },
    featured: false
  },
  {
    title: "Seven Chances",
    slug: "seven-chances-1925",
    synopsis: "Seven Chances é uma comédia muda americana de 1925 estrelada e dirigida por Buster Keaton, baseada na peça homônima, sobre um homem que precisa se casar até as sete da noite para receber uma herança milionária.",
    year: 1925,
    genres: [
      "Comédia",
      "Clássico"
    ],
    backdropUrl: "https://archive.org/services/img/seven-chances-keaton-1925-high-quality-1080p-wnfl-tnu-8cb-a",
    source: {
      provider: "archive",
      id: "seven-chances-keaton-1925-high-quality-1080p-wnfl-tnu-8cb-a"
    },
    featured: false
  },
  {
    title: "The Cameraman",
    slug: "the-cameraman-1928",
    synopsis: "The Cameraman é uma comédia romântica muda americana de 1928 estrelada por Buster Keaton, sobre um fotógrafo de rua que tenta virar cinegrafista de jornal para conquistar uma mulher.",
    year: 1928,
    genres: [
      "Comédia",
      "Clássico"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Poster_for_The_Cameraman_%281928%29.jpg",
    backdropUrl: "https://archive.org/services/img/TheCameraman",
    source: {
      provider: "archive",
      id: "TheCameraman"
    },
    featured: false
  },
  {
    title: "Cops",
    slug: "cops-1922",
    synopsis: "Cops é uma comédia muda americana de 1922 estrelada por Buster Keaton, sobre um rapaz perseguido por todo o departamento de polícia de Los Angeles após um mal-entendido durante um desfile.",
    year: 1922,
    genres: [
      "Comédia",
      "Clássico"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/4/45/Cops_1922_poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/Cops1922",
    source: {
      provider: "archive",
      id: "Cops1922"
    },
    featured: false
  },
  {
    title: "Our Hospitality",
    slug: "our-hospitality-1923",
    synopsis: "Our Hospitality é uma comédia de época muda americana de 1923 dirigida e estrelada por Buster Keaton, sobre um homem que se apaixona pela filha de uma família rival envolvida numa disputa de gerações.",
    year: 1923,
    genres: [
      "Comédia",
      "Clássico"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/1/18/Keaton_Our_Hospitality_1923.jpg",
    backdropUrl: "https://archive.org/services/img/our-hospitality-keaton-and-blystone-1923-high-quality-1080p-db-1-iz-urnfr-m",
    source: {
      provider: "archive",
      id: "our-hospitality-keaton-and-blystone-1923-high-quality-1080p-db-1-iz-urnfr-m"
    },
    featured: false
  },
  {
    title: "Carnival of Souls",
    slug: "carnival-of-souls-1962",
    synopsis: "Carnival of Souls é um filme de terror psicológico americano de 1962 dirigido por Herk Harvey e estrelado por Candace Hilligoss, sobre uma mulher assombrada por uma figura fantasmagórica após sobreviver a um acidente de carro.",
    year: 1962,
    genres: [
      "Terror",
      "Suspense"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Carnival_of_Souls_%281962_pressbook_cover%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/CarnivalOfSouls1962",
    source: {
      provider: "archive",
      id: "CarnivalOfSouls1962"
    },
    featured: false
  },
  {
    title: "White Zombie",
    slug: "white-zombie-1932",
    synopsis: "White Zombie é um filme de terror americano de 1932 estrelado por Bela Lugosi, considerado o primeiro longa-metragem sobre zumbis da história do cinema.",
    year: 1932,
    genres: [
      "Terror",
      "Suspense"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Poster_-_White_Zombie_01_Crisco_restoration.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/WhiteZombie1932",
    source: {
      provider: "archive",
      id: "WhiteZombie1932"
    },
    featured: false
  },
  {
    title: "The Brain That Wouldn’t Die",
    slug: "the-brain-that-wouldn-t-die-1962",
    synopsis: "Filme de terror/suspense de 1962.",
    year: 1962,
    genres: [
      "Terror",
      "Suspense"
    ],
    backdropUrl: "https://archive.org/services/img/TheBrainThatWouldntDie-ExtendedVersion1962",
    source: {
      provider: "archive",
      id: "TheBrainThatWouldntDie-ExtendedVersion1962"
    },
    featured: false
  },
  {
    title: "House on Haunted Hill",
    slug: "house-on-haunted-hill-1959",
    synopsis: "House on Haunted Hill é um filme de terror americano de 1959 estrelado por Vincent Price, sobre um grupo de convidados trancados numa mansão mal-assombrada em troca de uma recompensa em dinheiro.",
    year: 1959,
    genres: [
      "Terror",
      "Suspense"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/2/24/House_on_Haunted_Hill.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/HouseOnHauntedHill1959",
    source: {
      provider: "archive",
      id: "HouseOnHauntedHill1959"
    },
    featured: false
  },
  {
    title: "The Bat",
    slug: "the-bat-1959",
    synopsis: "The Bat é um suspense policial americano de 1959 estrelado por Vincent Price e Agnes Moorehead, sobre uma escritora que se hospeda numa mansão isolada aterrorizada por um assassino mascarado.",
    year: 1959,
    genres: [
      "Terror",
      "Suspense"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/4/45/Thebat_2poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/The_Bat_Vincent_Price",
    source: {
      provider: "archive",
      id: "The_Bat_Vincent_Price"
    },
    featured: false
  },
  {
    title: "The Devil Bat",
    slug: "the-devil-bat-1940",
    synopsis: "The Devil Bat é um filme de terror americano de 1940 estrelado por Bela Lugosi, sobre um cientista que usa um morcego gigante geneticamente modificado para se vingar dos antigos sócios.",
    year: 1940,
    genres: [
      "Terror",
      "Suspense"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cd/The_Devil_Bat_%281940%29_Poster.jpg",
    backdropUrl: "https://archive.org/services/img/TheDevilBat720p1940",
    source: {
      provider: "archive",
      id: "TheDevilBat720p1940"
    },
    featured: false
  },
  {
    title: "The Terror",
    slug: "the-terror-1963",
    synopsis: "The Terror é um filme de terror americano de 1963 produzido e dirigido por Roger Corman, estrelado por Boris Karloff e, em um de seus primeiros papéis, Jack Nicholson.",
    year: 1963,
    genres: [
      "Terror",
      "Suspense"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/9/93/The_Terror_%281963%29_-_Poster.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/PhantasmagoriaTheater-TheTerror1963627",
    source: {
      provider: "archive",
      id: "PhantasmagoriaTheater-TheTerror1963627"
    },
    featured: false
  },
  {
    title: "Dementia 13",
    slug: "dementia-13-1963",
    synopsis: "Dementia 13 é um suspense de terror americano de 1963, estreia de Francis Ford Coppola na direção de longas-metragens, sobre uma família assombrada por uma série de assassinatos brutais.",
    year: 1963,
    genres: [
      "Terror",
      "Suspense"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/b/b3/Dementia_13_%28movie_poster%29.jpg",
    backdropUrl: "https://archive.org/services/img/dementia-13-1963_202312",
    source: {
      provider: "archive",
      id: "dementia-13-1963_202312"
    },
    featured: false
  },
  {
    title: "The Last Man on Earth",
    slug: "the-last-man-on-earth-1964",
    synopsis: "The Last Man on Earth é um filme de terror e ficção científica pós-apocalíptico americano de 1964, estrelado por Vincent Price e baseado no romance Eu Sou a Lenda, de Richard Matheson, sobre o último sobrevivente de uma praga que transforma a humanidade em criaturas vampirescas.",
    year: 1964,
    genres: [
      "Terror",
      "Suspense"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/7/73/Lastmanonearth1960s.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/TheLastManOnEarth_72",
    source: {
      provider: "archive",
      id: "TheLastManOnEarth_72"
    },
    featured: false
  },
  {
    title: "The Outlaw",
    slug: "the-outlaw-1943",
    synopsis: "The Outlaw é um faroeste americano de 1943 dirigido por Howard Hughes, estrelado por Jack Buetel e Jane Russell, sobre o pistoleiro Billy the Kid.",
    year: 1943,
    genres: [
      "Faroeste"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/b/ba/The_Outlaw_poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/886-the-outlaw",
    source: {
      provider: "archive",
      id: "886-the-outlaw"
    },
    featured: false
  },
  {
    title: "The Iron Horse",
    slug: "the-iron-horse-1924",
    synopsis: "The Iron Horse é um faroeste épico mudo americano de 1924 dirigido por John Ford, sobre a construção da ferrovia transcontinental americana.",
    year: 1924,
    genres: [
      "Faroeste"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Iron_Horse_Poster.jpg",
    backdropUrl: "https://archive.org/services/img/the-iron-horse-1924-john-ford",
    source: {
      provider: "archive",
      id: "the-iron-horse-1924-john-ford"
    },
    featured: false
  },
  {
    title: "Santa Fe Trail",
    slug: "santa-fe-trail-1940",
    synopsis: "Santa Fe Trail é um drama histórico americano de 1940 estrelado por Errol Flynn, Olivia de Havilland e Ronald Reagan, ambientado nos anos que antecederam a Guerra Civil americana.",
    year: 1940,
    genres: [
      "Faroeste"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/e/e2/Santa_Fe_Trail_%28film%29_poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/SantaFeTrail1940",
    source: {
      provider: "archive",
      id: "SantaFeTrail1940"
    },
    featured: false
  },
  {
    title: "The Big Trail",
    slug: "the-big-trail-1930",
    synopsis: "The Big Trail é um faroeste épico americano de 1930 dirigido por Raoul Walsh, filmado em locações pelo oeste americano e primeiro papel principal de John Wayne, então com 23 anos.",
    year: 1930,
    genres: [
      "Faroeste"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b7/The_Big_Trail_%281930_film_poster%29.jpg",
    backdropUrl: "https://archive.org/services/img/the-big-trail_1930",
    source: {
      provider: "archive",
      id: "the-big-trail_1930"
    },
    featured: false
  },
  {
    title: "Hell’s Hinges",
    slug: "hell-s-hinges-1916",
    synopsis: "Filme de faroeste de 1916.",
    year: 1916,
    genres: [
      "Faroeste"
    ],
    backdropUrl: "https://archive.org/services/img/hells-hinges-1916_202507",
    source: {
      provider: "archive",
      id: "hells-hinges-1916_202507"
    },
    featured: false
  },
  {
    title: "Metropolis",
    slug: "metropolis-1927",
    synopsis: "Metropolis é um filme de ficção científica mudo alemão de 1927 dirigido por Fritz Lang, ambientado numa cidade futurista dividida entre a elite que vive no luxo e os trabalhadores que sustentam a máquina da cidade nos subterrâneos.",
    year: 1927,
    genres: [
      "Ficção Científica"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/9/97/Metropolis_%28German_three-sheet_poster%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/Metropolis1927EnglishVersion",
    source: {
      provider: "archive",
      id: "Metropolis1927EnglishVersion"
    },
    featured: false
  },
  {
    title: "Things to Come",
    slug: "things-to-come-1936",
    synopsis: "Things to Come é um filme de ficção científica britânico de 1936, baseado numa obra de H. G. Wells, que imagina o futuro da humanidade através de guerra, peste e reconstrução até um mundo utópico e tecnológico.",
    year: 1936,
    genres: [
      "Ficção Científica"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/b/ba/Things-to-Come-UK-poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/things_to_come_ipod",
    source: {
      provider: "archive",
      id: "things_to_come_ipod"
    },
    featured: false
  },
  {
    title: "Plan 9 from Outer Space",
    slug: "plan-9-from-outer-space-1959",
    synopsis: "Plan 9 from Outer Space é um filme de ficção científica e terror americano de 1959 escrito e dirigido por Ed Wood, frequentemente citado como um dos piores filmes já feitos, sobre alienígenas que reanimam mortos na Terra.",
    year: 1959,
    genres: [
      "Ficção Científica"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Plan_9_Alternative_poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/plan-94-k",
    source: {
      provider: "archive",
      id: "plan-94-k"
    },
    featured: false
  },
  {
    title: "Destination Moon",
    slug: "destination-moon-1950",
    synopsis: "Destination Moon é um filme de ficção científica americano de 1950 produzido por George Pal, sobre a primeira viagem tripulada à Lua.",
    year: 1950,
    genres: [
      "Ficção Científica"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/7/73/Destination-moon-movie-poster-md.jpg",
    backdropUrl: "https://archive.org/services/img/DestinationMoon1950",
    source: {
      provider: "archive",
      id: "DestinationMoon1950"
    },
    featured: false
  },
  {
    title: "Rocketship X-M",
    slug: "rocketship-x-m-1950",
    synopsis: "Rocketship X-M é um filme de ficção científica americano de 1950, uma das primeiras aventuras espaciais do pós-guerra, sobre uma tripulação que parte rumo à Lua e acaba desviada para Marte.",
    year: 1950,
    genres: [
      "Ficção Científica"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/9/94/201-rocketshipxm.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/rocketship-x-m-1950",
    source: {
      provider: "archive",
      id: "rocketship-x-m-1950"
    },
    featured: false
  },
  {
    title: "Häxan",
    slug: "haxan-1922",
    synopsis: "Häxan é um filme de terror sueco-dinamarquês de 1922 dirigido por Benjamin Christensen, um ensaio quase documental sobre a história da bruxaria e da perseguição às bruxas na Europa.",
    year: 1922,
    genres: [
      "Mudo",
      "Clássico"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/6/6c/Haxan_sv_poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/Hxan1922720p",
    source: {
      provider: "archive",
      id: "Hxan1922720p"
    },
    featured: false
  },
  {
    title: "Battleship Potemkin",
    slug: "battleship-potemkin-1925",
    synopsis: "Battleship Potemkin é um filme mudo soviético de 1925 produzido pela Mosfilm, que recria o motim dos marinheiros do encouraçado Potemkin durante a Revolução Russa de 1905 e é considerado um marco da linguagem de montagem no cinema.",
    year: 1925,
    genres: [
      "Mudo",
      "Clássico"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/8/85/Vintage_Potemkin.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/PhantasmagoriaTheater-BattleshipPotemkin1925396",
    source: {
      provider: "archive",
      id: "PhantasmagoriaTheater-BattleshipPotemkin1925396"
    },
    featured: false
  },
  {
    title: "A Trip to the Moon",
    slug: "a-trip-to-the-moon-1902",
    synopsis: "A Trip to the Moon é um curta-metragem francês de ficção científica e aventura de 1902, escrito, dirigido e produzido por Georges Méliès, sobre um grupo de astrônomos que viaja à Lua a bordo de uma cápsula disparada por canhão.",
    year: 1902,
    genres: [
      "Mudo",
      "Clássico"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/Le_Voyage_dans_la_lune.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/ATripToTheMoon1902",
    source: {
      provider: "archive",
      id: "ATripToTheMoon1902"
    },
    featured: false
  },
  {
    title: "The Mark of Zorro",
    slug: "the-mark-of-zorro-1920",
    synopsis: "The Mark of Zorro é um faroeste romântico mudo americano de 1920 estrelado por Douglas Fairbanks, sobre um jovem aristocrata que assume a identidade secreta de Zorro para defender os oprimidos da Califórnia colonial.",
    year: 1920,
    genres: [
      "Aventura",
      "Clássico"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a6/FairbanksMarkofZorro.jpg",
    backdropUrl: "https://archive.org/services/img/the-mark-of-zorro-1920",
    source: {
      provider: "archive",
      id: "the-mark-of-zorro-1920"
    },
    featured: false
  },
  {
    title: "Dr. Mabuse the Gambler",
    slug: "dr-mabuse-the-gambler-1922",
    synopsis: "Dr. Mabuse the Gambler é um filme mudo alemão de 1922 dirigido por Fritz Lang, sobre um gênio do crime que manipula a bolsa de valores e a sociedade de Berlim através de disfarces e hipnose.",
    year: 1922,
    genres: [
      "Suspense",
      "Mudo"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Dr._Mabuse%2C_der_Spieler.jpg",
    backdropUrl: "https://archive.org/services/img/Dr.MabuseTheGamblerdr.MabuseDerSpieler1922Part1",
    source: {
      provider: "archive",
      id: "Dr.MabuseTheGamblerdr.MabuseDerSpieler1922Part1"
    },
    featured: false
  },
  {
    title: "The Golem",
    slug: "the-golem-1920",
    synopsis: "The Golem: How He Came into the World é um filme de terror mudo alemão de 1920, um dos grandes exemplos do expressionismo alemão, sobre um rabino que cria uma criatura de barro para proteger a comunidade judaica de Praga.",
    year: 1920,
    genres: [
      "Terror",
      "Mudo"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/3/32/Golem_1920_Poster.jpg",
    backdropUrl: "https://archive.org/services/img/the-golem-1920",
    source: {
      provider: "archive",
      id: "the-golem-1920"
    },
    featured: false
  },
  {
    title: "Man with a Movie Camera",
    slug: "man-with-a-movie-camera-1929",
    synopsis: "Man with a Movie Camera é um documentário experimental mudo soviético de 1929 escrito e dirigido por Dziga Vertov, que retrata o cotidiano urbano soviético através de uma montagem inovadora de imagens.",
    year: 1929,
    genres: [
      "Documentário",
      "Mudo"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Man_with_a_movie_camera_1929_2.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/manwithcamera4k",
    source: {
      provider: "archive",
      id: "manwithcamera4k"
    },
    featured: false
  },
  {
    title: "Nanook of the North",
    slug: "nanook-of-the-north-1922",
    synopsis: "Nanook of the North é um filme mudo americano de 1922 que mistura documentário e ficção — pioneiro do gênero, numa época em que essa distinção ainda não existia — retratando o cotidiano de uma família inuíte no Ártico canadense.",
    year: 1922,
    genres: [
      "Documentário",
      "Mudo"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/3/33/Nanook_of_the_north.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/nanookOfTheNorth1922",
    source: {
      provider: "archive",
      id: "nanookOfTheNorth1922"
    },
    featured: false
  },
  {
    title: "Robin Hood",
    slug: "robin-hood-1922",
    synopsis: "Robin Hood é um filme de aventura mudo de 1922 estrelado por Douglas Fairbanks e Wallace Beery, sobre o lendário fora-da-lei que rouba dos ricos para dar aos pobres na Inglaterra medieval.",
    year: 1922,
    genres: [
      "Aventura",
      "Mudo"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/Douglas_Fairbanks_Robin_Hood_1922_film_poster.jpg",
    backdropUrl: "https://archive.org/services/img/FairbanksRobinHood1922",
    source: {
      provider: "archive",
      id: "FairbanksRobinHood1922"
    },
    featured: false
  },
  {
    title: "The Thief of Bagdad",
    slug: "the-thief-of-bagdad-1924",
    synopsis: "The Thief of Bagdad é um filme de fantasia e aventura mudo americano de 1924 estrelado por Douglas Fairbanks, sobre um ladrão que se apaixona por uma princesa e embarca numa jornada mágica pelo Oriente para conquistá-la.",
    year: 1924,
    genres: [
      "Aventura",
      "Mudo"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/d/de/The_Thief_of_Bagdad_%281924%29_-_film_poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/TheThiefOfBagdad1924",
    source: {
      provider: "archive",
      id: "TheThiefOfBagdad1924"
    },
    featured: false
  },
  {
    title: "The Black Pirate",
    slug: "the-black-pirate-1926",
    synopsis: "The Black Pirate é um filme de aventura mudo americano de 1926, um dos primeiros longas-metragens filmados em cores, estrelado por Douglas Fairbanks como um homem que se infiltra num bando de piratas para vingar a morte do pai.",
    year: 1926,
    genres: [
      "Aventura",
      "Mudo"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Black_Pirate_Poster_2.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/TheBlackPirate1926DouglasFairbanksSRAndy",
    source: {
      provider: "archive",
      id: "TheBlackPirate1926DouglasFairbanksSRAndy"
    },
    featured: false
  },
  {
    title: "Tarzan of the Apes",
    slug: "tarzan-of-the-apes-1918",
    synopsis: "Tarzan of the Apes é um filme de aventura mudo americano de 1918 estrelado por Elmo Lincoln, a primeira adaptação para o cinema do personagem criado por Edgar Rice Burroughs.",
    year: 1918,
    genres: [
      "Aventura",
      "Mudo"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Tarzan_of_the_Apes_1918.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/TarzanoftheApes1918AndyDivx",
    source: {
      provider: "archive",
      id: "TarzanoftheApes1918AndyDivx"
    },
    featured: false
  },
  {
    title: "Beau Geste",
    slug: "beau-geste-1926",
    synopsis: "Beau Geste é um drama de aventura mudo americano de 1926, baseado no romance de P. C. Wren, sobre três irmãos que se alistam na Legião Estrangeira francesa após o desaparecimento de uma joia da família.",
    year: 1926,
    genres: [
      "Aventura"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/Beau_Geste_poster.jpg",
    backdropUrl: "https://archive.org/services/img/beau-geste",
    source: {
      provider: "archive",
      id: "beau-geste"
    },
    featured: false
  },
  {
    title: "The Most Dangerous Game",
    slug: "the-most-dangerous-game-1932",
    synopsis: "The Most Dangerous Game é um filme de terror e aventura americano de 1932, sobre um caçador insano que abandona presas animais para caçar seres humanos em sua ilha particular.",
    year: 1932,
    genres: [
      "Suspense",
      "Aventura"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3d/The_Most_Dangerous_Game_%281932%29_poster_card.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/the.most.dangerous.game.1932.1080p",
    source: {
      provider: "archive",
      id: "the.most.dangerous.game.1932.1080p"
    },
    featured: false
  },
  {
    title: "Captain Kidd",
    slug: "captain-kidd-1945",
    synopsis: "Captain Kidd é um filme de aventura americano de 1945 estrelado por Charles Laughton no papel do lendário pirata escocês Capitão Kidd.",
    year: 1945,
    genres: [
      "Aventura"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/4/46/Captain-Kidd-1945.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/kidd-4-k",
    source: {
      provider: "archive",
      id: "kidd-4-k"
    },
    featured: false
  },
  {
    title: "The Prisoner of Zenda",
    slug: "the-prisoner-of-zenda-1937",
    synopsis: "The Prisoner of Zenda é um filme de aventura americano de 1937, baseado no romance de Anthony Hope, sobre um inglês que precisa se passar por um rei sequestrado para evitar uma crise no trono de um reino fictício europeu.",
    year: 1937,
    genres: [
      "Aventura",
      "Drama"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cb/The_Prisoner_of_Zenda_%281937_film_poster%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/the-prisoner-of-zenda-1937",
    source: {
      provider: "archive",
      id: "the-prisoner-of-zenda-1937"
    },
    featured: false
  },
  {
    title: "The Sea Hawk",
    slug: "the-sea-hawk-1924",
    synopsis: "The Sea Hawk é um filme de aventura mudo americano de 1924 sobre um nobre inglês vendido como escravo que escapa e se transforma num rei pirata.",
    year: 1924,
    genres: [
      "Aventura",
      "Mudo"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1a/The_Sea_Hawk_-_1924_theatrical_poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/the-sea-hawk-1924-with-sync-symphonic-music",
    source: {
      provider: "archive",
      id: "the-sea-hawk-1924-with-sync-symphonic-music"
    },
    featured: false
  },
  {
    title: "The Lost World",
    slug: "the-lost-world-1925",
    synopsis: "The Lost World é um filme de aventura e fantasia mudo americano de 1925, baseado no romance de Arthur Conan Doyle, sobre uma expedição que descobre dinossauros vivos numa região isolada da América do Sul.",
    year: 1925,
    genres: [
      "Ficção Científica",
      "Aventura",
      "Mudo"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/7/76/The_Lost_World_%281925%29_-_film_poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/TheLostWorld512",
    source: {
      provider: "archive",
      id: "TheLostWorld512"
    },
    featured: false
  },
  {
    title: "Detour",
    slug: "detour-1945",
    synopsis: "Detour é um filme noir independente americano de 1945 dirigido por Edgar G. Ulmer, sobre um pianista que pega carona rumo à Califórnia e se envolve numa série de eventos que o transformam em fugitivo.",
    year: 1945,
    genres: [
      "Suspense",
      "Drama"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/4/47/Detour_%28poster%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/detour-1945",
    source: {
      provider: "archive",
      id: "detour-1945"
    },
    featured: false
  },
  {
    title: "Too Late for Tears",
    slug: "too-late-for-tears-1949",
    synopsis: "Too Late for Tears é um filme noir americano de 1949 estrelado por Lizabeth Scott, sobre um casal que encontra uma maleta cheia de dinheiro e é consumido pela ganância e pela desconfiança.",
    year: 1949,
    genres: [
      "Suspense",
      "Drama"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/1/19/Too_Late_for_Tears_DVD.jpg",
    backdropUrl: "https://archive.org/services/img/TooLateForTears1949",
    source: {
      provider: "archive",
      id: "TooLateForTears1949"
    },
    featured: false
  },
  {
    title: "The Hitch-Hiker",
    slug: "the-hitch-hiker-1953",
    synopsis: "The Hitch-Hiker é um filme noir americano de 1953 dirigido por Ida Lupino, sobre dois amigos que dão carona a um assassino em série durante uma viagem de pesca.",
    year: 1953,
    genres: [
      "Suspense"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/9/90/The_Hitch-Hiker_%281953_poster%29.jpeg",
    backdropUrl: "https://archive.org/services/img/IdaLupinostheHitch-hiker1953",
    source: {
      provider: "archive",
      id: "IdaLupinostheHitch-hiker1953"
    },
    featured: false
  },
  {
    title: "Kansas City Confidential",
    slug: "kansas-city-confidential-1952",
    synopsis: "Kansas City Confidential é um filme noir policial americano de 1952 estrelado por John Payne, sobre um ex-condenado injustamente acusado de participar de um assalto a banco que sai em busca dos verdadeiros culpados.",
    year: 1952,
    genres: [
      "Suspense"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/0/00/KCConfidential.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/Kansas_City_Confidential_1952",
    source: {
      provider: "archive",
      id: "Kansas_City_Confidential_1952"
    },
    featured: false
  },
  {
    title: "He Walked by Night",
    slug: "he-walked-by-night-1948",
    synopsis: "He Walked by Night é um filme noir policial americano de 1948 sobre a caçada de um criminoso solitário e metódico pelas ruas de Los Angeles, num dos primeiros exemplos do gênero policial procedural no cinema.",
    year: 1948,
    genres: [
      "Suspense"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/4/48/He_Walked_by_Night_poster.jpg",
    backdropUrl: "https://archive.org/services/img/He_Walked_by_Night_1948",
    source: {
      provider: "archive",
      id: "He_Walked_by_Night_1948"
    },
    featured: false
  },
  {
    title: "Woman on the Run",
    slug: "woman-on-the-run-1950",
    synopsis: "Woman on the Run é um filme noir americano de 1950 estrelado por Ann Sheridan, sobre uma mulher que sai em busca do próprio marido, testemunha de um assassinato que desaparece por medo de ser o próximo alvo.",
    year: 1950,
    genres: [
      "Suspense"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/a/a2/Woman_on_the_Run.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/womanontherun1950_202001",
    source: {
      provider: "archive",
      id: "womanontherun1950_202001"
    },
    featured: false
  },
  {
    title: "Suddenly",
    slug: "suddenly-1954",
    synopsis: "Suddenly é um filme noir policial americano de 1954 estrelado por Frank Sinatra como um assassino de aluguel contratado para matar o presidente dos Estados Unidos numa pequena cidade.",
    year: 1954,
    genres: [
      "Suspense"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/8/82/Suddenly_%281954_movie_poster%29.jpg",
    backdropUrl: "https://archive.org/services/img/Suddenly_1954",
    source: {
      provider: "archive",
      id: "Suddenly_1954"
    },
    featured: false
  },
  {
    title: "D.O.A.",
    slug: "d-o-a-1950",
    synopsis: "D.O.A. é um filme noir americano de 1950 sobre um homem que descobre ter sido envenenado com uma substância letal e passa seus últimos dias tentando descobrir quem o matou.",
    year: 1950,
    genres: [
      "Suspense"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9e/D.O.A._%281950_poster%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/DOA1950",
    source: {
      provider: "archive",
      id: "DOA1950"
    },
    featured: false
  },
  {
    title: "Scarlet Street",
    slug: "scarlet-street-1945",
    synopsis: "Scarlet Street é um filme noir americano de 1945 dirigido por Fritz Lang, sobre um caixa de banco reprimido que se apaixona por uma golpista e é manipulado por ela e seu amante.",
    year: 1945,
    genres: [
      "Suspense",
      "Drama"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Edward_G._Robinson_and_Joan_Bennett_in_%27Scarlet_Street%27%2C_1946.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/Scarlet.Street.194517",
    source: {
      provider: "archive",
      id: "Scarlet.Street.194517"
    },
    featured: false
  },
  {
    title: "The Amazing Mr. X",
    slug: "the-amazing-mr-x-1948",
    synopsis: "The Amazing Mr. X é um suspense noir americano de 1948 sobre uma viúva que se envolve com um suposto médium que afirma se comunicar com seu falecido marido.",
    year: 1948,
    genres: [
      "Suspense",
      "Terror"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/a/ad/Amazingmrx.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/TheAmazingMr.X1948Avi",
    source: {
      provider: "archive",
      id: "TheAmazingMr.X1948Avi"
    },
    featured: false
  },
  {
    title: "The Brain from Planet Arous",
    slug: "the-brain-from-planet-arous-1957",
    synopsis: "The Brain from Planet Arous é um filme de ficção científica americano de 1957 sobre um cientista possuído por um cérebro alienígena gigante com planos de dominar a Terra.",
    year: 1957,
    genres: [
      "Ficção Científica"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a5/The-Brain-from-Planet-Arous.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/brain-from-planet-arous-colorized",
    source: {
      provider: "archive",
      id: "brain-from-planet-arous-colorized"
    },
    featured: false
  },
  {
    title: "The Man from Planet X",
    slug: "the-man-from-planet-x-1951",
    synopsis: "The Man from Planet X é um filme de ficção científica e terror americano de 1951, produzido de forma independente, sobre um visitante alienígena pacífico que pousa numa ilha escocesa e é explorado por um cientista ambicioso.",
    year: 1951,
    genres: [
      "Ficção Científica"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/1/1b/The_Man_from_Planet_X.jpg",
    backdropUrl: "https://archive.org/services/img/man-from-planet-x",
    source: {
      provider: "archive",
      id: "man-from-planet-x"
    },
    featured: false
  },
  {
    title: "The Giant Gila Monster",
    slug: "the-giant-gila-monster-1959",
    synopsis: "The Giant Gila Monster é um filme de monstro americano de 1959 sobre um enorme lagarto que aterroriza uma pequena cidade do Texas.",
    year: 1959,
    genres: [
      "Ficção Científica",
      "Terror"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Giant_Gila_Monster_poster.jpg",
    backdropUrl: "https://archive.org/services/img/the-giant-gila-monster-1959",
    source: {
      provider: "archive",
      id: "the-giant-gila-monster-1959"
    },
    featured: false
  },
  {
    title: "The Beast of Yucca Flats",
    slug: "the-beast-of-yucca-flats-1961",
    synopsis: "The Beast of Yucca Flats é um filme de terror B americano de 1961 sobre um cientista soviético transformado em monstro radioativo após uma explosão nuclear no deserto de Nevada.",
    year: 1961,
    genres: [
      "Ficção Científica",
      "Terror"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/5/53/The_Beast_of_Yucca_Flats_poster.webp",
    backdropUrl: "https://archive.org/services/img/TheBeastOfYuccaFlats1961",
    source: {
      provider: "archive",
      id: "TheBeastOfYuccaFlats1961"
    },
    featured: false
  },
  {
    title: "Teenagers from Outer Space",
    slug: "teenagers-from-outer-space-1959",
    synopsis: "Teenagers from Outer Space é um filme de ficção científica independente americano de 1959, hoje um cult, sobre um jovem alienígena que se rebela contra o plano de sua espécie de exterminar a vida na Terra.",
    year: 1959,
    genres: [
      "Ficção Científica"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Teenagersouterspace.jpg",
    backdropUrl: "https://archive.org/services/img/TeenagersFromOuterSpace1959",
    source: {
      provider: "archive",
      id: "TeenagersFromOuterSpace1959"
    },
    featured: false
  },
  {
    title: "The Cosmic Man",
    slug: "the-cosmic-man-1959",
    synopsis: "The Cosmic Man é um filme de ficção científica americano de 1959, produzido de forma independente, sobre um misterioso visitante alienígena capaz de curar doenças que desperta a desconfiança do exército americano.",
    year: 1959,
    genres: [
      "Ficção Científica"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/e/e7/The_Cosmic_Man_1959.jpg",
    backdropUrl: "https://archive.org/services/img/the-cosmic-man-1959",
    source: {
      provider: "archive",
      id: "the-cosmic-man-1959"
    },
    featured: false
  },
  {
    title: "The Amazing Transparent Man",
    slug: "the-amazing-transparent-man-1960",
    synopsis: "The Amazing Transparent Man é um suspense de ficção científica B americano de 1960 sobre um ex-presidiário tornado invisível por um cientista para realizar um roubo.",
    year: 1960,
    genres: [
      "Ficção Científica"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/7/7a/The-amazing-transparent-man-movie-poster-md.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/TheAmazingTransparentMan1960",
    source: {
      provider: "archive",
      id: "TheAmazingTransparentMan1960"
    },
    featured: false
  },
  {
    title: "The Phantom Planet",
    slug: "the-phantom-planet-1961",
    synopsis: "The Phantom Planet é um filme de ficção científica independente americano de 1961 sobre um astronauta que, após pousar num pequeno planeta desconhecido, é misteriosamente reduzido ao tamanho de seus habitantes.",
    year: 1961,
    genres: [
      "Ficção Científica"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/0/06/Thephantomplanet.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/Phantom_Planet",
    source: {
      provider: "archive",
      id: "Phantom_Planet"
    },
    featured: false
  },
  {
    title: "The Giant Claw",
    slug: "the-giant-claw-1957",
    synopsis: "The Giant Claw é um filme de monstro americano de 1957 produzido pela Columbia Pictures, sobre um pássaro gigante do tamanho de um porta-aviões que ataca aviões e cidades ao redor do mundo.",
    year: 1957,
    genres: [
      "Ficção Científica"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/f/f0/GiantClawmp.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/the-giant-claw-1957-colorized",
    source: {
      provider: "archive",
      id: "the-giant-claw-1957-colorized"
    },
    featured: false
  },
  {
    title: "The Lucky Texan",
    slug: "the-lucky-texan-1934",
    synopsis: "The Lucky Texan é um faroeste B americano de 1934 estrelado por John Wayne, sobre a busca por ouro roubado no oeste americano.",
    year: 1934,
    genres: [
      "Faroeste"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Lucky_Texan_lobby_card.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/luckytexanthe1934",
    source: {
      provider: "archive",
      id: "luckytexanthe1934"
    },
    featured: false
  },
  {
    title: "Blue Steel",
    slug: "blue-steel-1934",
    synopsis: "Blue Steel é um faroeste B americano de 1934 estrelado por John Wayne, sobre um agente disfarçado que investiga uma série de assaltos numa cidade do oeste.",
    year: 1934,
    genres: [
      "Faroeste"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Blue_steel_%281934_film%29_poster.jpg",
    backdropUrl: "https://archive.org/services/img/blue-steel-4-k",
    source: {
      provider: "archive",
      id: "blue-steel-4-k"
    },
    featured: false
  },
  {
    title: "Riders of Destiny",
    slug: "riders-of-destiny-1933",
    synopsis: "Riders of Destiny é um faroeste musical americano de 1933 estrelado por um John Wayne de 26 anos como o cowboy cantor Singin' Sandy Saunders, um dos primeiros exemplos do gênero no cinema.",
    year: 1933,
    genres: [
      "Faroeste"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Ridersdestiny1933.jpg",
    backdropUrl: "https://archive.org/services/img/ridersofdestiny1933",
    source: {
      provider: "archive",
      id: "ridersofdestiny1933"
    },
    featured: false
  },
  {
    title: "Nevada City",
    slug: "nevada-city-1941",
    synopsis: "Nevada City é um faroeste americano de 1941 dirigido por Joseph Kane, estrelado por Roy Rogers, George 'Gabby' Hayes e Sally Payne.",
    year: 1941,
    genres: [
      "Faroeste"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/0/03/Nevada_City_FilmPoster.jpeg",
    backdropUrl: "https://archive.org/services/img/nevada_city_ipod",
    source: {
      provider: "archive",
      id: "nevada_city_ipod"
    },
    featured: false
  },
  {
    title: "The Green Archer",
    slug: "the-green-archer-1940",
    synopsis: "The Green Archer é o décimo segundo seriado lançado pela Columbia Pictures, sobre um justiceiro mascarado armado com arco e flecha que investiga uma série de crimes ligados a um castelo misterioso.",
    year: 1940,
    genres: [
      "Aventura",
      "Suspense"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/6/68/The_Green_Archer.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/green_archer_ep1",
    source: {
      provider: "archive",
      id: "green_archer_ep1"
    },
    featured: false
  },
  {
    title: "The Ape Man",
    slug: "the-ape-man-1943",
    synopsis: "The Ape Man é um filme de terror americano de 1943 dirigido por William Beaudine, estrelado por Bela Lugosi como um cientista que se transforma parcialmente em macaco após um experimento malsucedido.",
    year: 1943,
    genres: [
      "Terror"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cf/The-Ape-Man-Poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/TheApeMan720p1943",
    source: {
      provider: "archive",
      id: "TheApeMan720p1943"
    },
    featured: false
  },
  {
    title: "The Vampire Bat",
    slug: "the-vampire-bat-1933",
    synopsis: "The Vampire Bat é um filme de terror americano pré-Código de 1933, sobre uma série de assassinatos misteriosos numa vila alemã atribuídos a um vampiro, investigados por um médico que esconde um segredo sinistro.",
    year: 1933,
    genres: [
      "Terror"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/2/21/Vampirebat.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/TheVampireBat1933",
    source: {
      provider: "archive",
      id: "TheVampireBat1933"
    },
    featured: false
  },
  {
    title: "The Ghoul",
    slug: "the-ghoul-1933",
    synopsis: "The Ghoul é um filme de terror britânico de 1933 estrelado por Boris Karloff como um egiptólogo que retorna dos mortos para recuperar uma joia sagrada roubada de seu túmulo.",
    year: 1933,
    genres: [
      "Terror"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/The_Ghoul_1933.ogv/330px--The_Ghoul_1933.ogv.jpg",
    backdropUrl: "https://archive.org/services/img/TheGhoul",
    source: {
      provider: "archive",
      id: "TheGhoul"
    },
    featured: false
  },
  {
    title: "The Monster Walks",
    slug: "the-monster-walks-1932",
    synopsis: "The Monster Walks é um filme de terror americano pré-Código de 1932, ambientado numa mansão isolada onde uma herdeira é ameaçada por um misterioso assassino durante a leitura de um testamento.",
    year: 1932,
    genres: [
      "Terror"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/9/91/The-Monster-Walks-Poster.jpg",
    backdropUrl: "https://archive.org/services/img/MonsterWalks19321080p",
    source: {
      provider: "archive",
      id: "MonsterWalks19321080p"
    },
    featured: false
  },
  {
    title: "Maniac",
    slug: "maniac-1934",
    synopsis: "Maniac é um filme de terror de exploração americano de 1934, livremente baseado no conto 'O Gato Preto' de Edgar Allan Poe, sobre um ator que assume a identidade de um médico louco após sua morte.",
    year: 1934,
    genres: [
      "Terror"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/6/63/Sex_Maniac_%281934_film%29_poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/Maniac1934",
    source: {
      provider: "archive",
      id: "Maniac1934"
    },
    featured: false
  },
  {
    title: "The Devil’s Sleep",
    slug: "the-devil-s-sleep-1949",
    synopsis: "Filme de clássico de 1949.",
    year: 1949,
    genres: [
      "Clássico"
    ],
    backdropUrl: "https://archive.org/services/img/the-devils-sleep-1949-720p",
    source: {
      provider: "archive",
      id: "the-devils-sleep-1949-720p"
    },
    featured: false
  },
  {
    title: "The Sin of Nora Moran",
    slug: "the-sin-of-nora-moran-1933",
    synopsis: "The Sin of Nora Moran é um melodrama pré-Código americano de 1933, considerado um precursor do filme noir, contado em flashbacks sobre uma mulher condenada à morte por um crime que não cometeu.",
    year: 1933,
    genres: [
      "Drama"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d3/The_Sin_of_Nora_Moran_FilmPoster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/BillSpragueCollectionTheSinOfNoraMoran-1933ZitaJohann-PUBLICDOMAIN",
    source: {
      provider: "archive",
      id: "BillSpragueCollectionTheSinOfNoraMoran-1933ZitaJohann-PUBLICDOMAIN"
    },
    featured: false
  },
  {
    title: "The Black Raven",
    slug: "the-black-raven-1943",
    synopsis: "The Black Raven é um filme de mistério americano de 1943 sobre um grupo de viajantes isolados numa pousada durante uma tempestade, onde uma série de assassinatos começa a acontecer.",
    year: 1943,
    genres: [
      "Suspense",
      "Terror"
    ],
    backdropUrl: "https://archive.org/services/img/Black_Raven_1943",
    source: {
      provider: "archive",
      id: "Black_Raven_1943"
    },
    featured: false
  },
  {
    title: "Little Shop of Horrors",
    slug: "little-shop-of-horrors-1960",
    synopsis: "Little Shop of Horrors é uma comédia de terror americana de 1960 dirigida e produzida por Roger Corman, sobre um florista desajeitado que cultiva uma planta carnívora que precisa de sangue humano para sobreviver.",
    year: 1960,
    genres: [
      "Terror",
      "Comédia"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1c/The_Little_Shop_of_Horrors_%281960%29_-_Half-Sheet_poster.webp?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/TheLittleShopOfHorrors1960_765",
    source: {
      provider: "archive",
      id: "TheLittleShopOfHorrors1960_765"
    },
    featured: false
  },
  {
    title: "The Bat Whispers",
    slug: "the-bat-whispers-1930",
    synopsis: "The Bat Whispers é um filme de mistério pré-Código americano de 1930 sobre um criminoso mascarado conhecido como 'O Morcego' que aterroriza os hóspedes de uma mansão isolada.",
    year: 1930,
    genres: [
      "Terror",
      "Suspense"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Batwhispers.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/the-bat-whispers-1930",
    source: {
      provider: "archive",
      id: "the-bat-whispers-1930"
    },
    featured: false
  },
  {
    title: "The Lost Continent",
    slug: "the-lost-continent-1951",
    synopsis: "Filme de ficção científica de 1951.",
    year: 1951,
    genres: [
      "Ficção Científica"
    ],
    backdropUrl: "https://archive.org/services/img/hammers-the-lost-continent-1968-son-of-svengoolie",
    source: {
      provider: "archive",
      id: "hammers-the-lost-continent-1968-son-of-svengoolie"
    },
    featured: false
  },
  {
    title: "The Horror of Party Beach",
    slug: "the-horror-of-party-beach-1964",
    synopsis: "The Horror of Party Beach é um filme de terror americano de 1964 do subgênero praiano, sobre criaturas mutantes geradas por resíduos radioativos que atacam jovens numa praia.",
    year: 1964,
    genres: [
      "Terror",
      "Ficção Científica"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/a/a0/The_Horror_of_Party_Beach.jpg",
    backdropUrl: "https://archive.org/services/img/HOPBFinal3.9.19.2",
    source: {
      provider: "archive",
      id: "HOPBFinal3.9.19.2"
    },
    featured: false
  },
  {
    title: "The Screaming Skull",
    slug: "the-screaming-skull-1958",
    synopsis: "The Screaming Skull é um filme de terror independente americano de 1958 sobre um casal recém-casado assombrado por um crânio misterioso na mansão onde a primeira esposa do marido morreu.",
    year: 1958,
    genres: [
      "Terror"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Poster_for_The_Screaming_Skull.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/TheScreamingSkullHD1958",
    source: {
      provider: "archive",
      id: "TheScreamingSkullHD1958"
    },
    featured: false
  },
  {
    title: "Earth vs. the Flying Saucers",
    slug: "earth-vs-the-flying-saucers-1956",
    synopsis: "Earth vs. the Flying Saucers é um filme de ficção científica americano de 1956 sobre uma invasão alienígena à Terra e a corrida de cientistas para desenvolver uma arma capaz de deter os discos voadores.",
    year: 1956,
    genres: [
      "Ficção Científica"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/c/c3/Earth_vs_the_Flying_Saucers_DVD.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/earth-vs-the-flying-saucers-color",
    source: {
      provider: "archive",
      id: "earth-vs-the-flying-saucers-color"
    },
    featured: false
  },
  {
    title: "The Man They Could Not Hang",
    slug: "the-man-they-could-not-hang-1939",
    synopsis: "The Man They Could Not Hang é um filme de terror americano de 1939 estrelado por Boris Karloff como um cientista executado e ressuscitado por sua própria invenção, que retorna para se vingar dos jurados que o condenaram.",
    year: 1939,
    genres: [
      "Ficção Científica",
      "Terror"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/2/2c/Themantheycouldnothangposter.jpg",
    backdropUrl: "https://archive.org/services/img/the.-man.-they.-could.-not.-hang.-1939",
    source: {
      provider: "archive",
      id: "the.-man.-they.-could.-not.-hang.-1939"
    },
    featured: false
  },
  {
    title: "Invisible Ghost",
    slug: "invisible-ghost-1941",
    synopsis: "Invisible Ghost é um filme de terror americano de 1941 estrelado por Bela Lugosi como um homem que, sem saber, comete assassinatos sob transe hipnótico.",
    year: 1941,
    genres: [
      "Terror"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/3/33/Invisible-ghost-movie-poster-md.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/InvisibleGhost1941",
    source: {
      provider: "archive",
      id: "InvisibleGhost1941"
    },
    featured: false
  },
  {
    title: "Triumph of the Will",
    slug: "triumph-of-the-will-1935",
    synopsis: "Triumph of the Will é um filme de propaganda nazista alemão de 1935 dirigido por Leni Riefenstahl, que documenta o congresso do Partido Nazista em Nuremberg de 1934 — hoje estudado como exemplo histórico do uso do cinema como ferramenta de propaganda totalitária.",
    year: 1935,
    genres: [
      "Documentário"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/1/1a/Triumph_des_Willens_poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/triumph_of_the_will_1935_colorized",
    source: {
      provider: "archive",
      id: "triumph_of_the_will_1935_colorized"
    },
    featured: false
  },
  {
    title: "Why We Fight",
    slug: "why-we-fight-1942",
    synopsis: "Why We Fight é uma série de sete filmes de propaganda produzidos pelo Departamento de Guerra dos Estados Unidos entre 1942 e 1945, durante a Segunda Guerra Mundial, para explicar aos soldados americanos os motivos do conflito.",
    year: 1942,
    genres: [
      "Documentário"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Why_We_Fight_title.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/BattleOfRussiaI",
    source: {
      provider: "archive",
      id: "BattleOfRussiaI"
    },
    featured: false
  },
  {
    title: "The Plow That Broke the Plains",
    slug: "the-plow-that-broke-the-plains-1936",
    synopsis: "The Plow That Broke the Plains é um curta documentário americano de 1936 sobre a ocupação agrícola das Grandes Planícies dos Estados Unidos e Canadá após a Guerra Civil, que culminou na tragédia ambiental do Dust Bowl.",
    year: 1936,
    genres: [
      "Documentário"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/1/10/The_plow_that_broke_the_plains.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/plow_that_broke_the_plains",
    source: {
      provider: "archive",
      id: "plow_that_broke_the_plains"
    },
    featured: false
  },
  {
    title: "The River",
    slug: "the-river-1938",
    synopsis: "The River é um curta documentário americano de 1938 escrito e dirigido por Pare Lorentz sobre a história e os efeitos ambientais da ocupação da bacia do rio Mississippi.",
    year: 1938,
    genres: [
      "Documentário"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Film_Poster_for_%22The_River%22_-_NARA_-_95115895.jpg/3840px-Film_Poster_for_%22The_River%22_-_NARA_-_95115895.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    backdropUrl: "https://archive.org/services/img/the.-river.-1997.-chinese.-1080p.-blu-ray.-h-264.-aac-vxt",
    source: {
      provider: "archive",
      id: "the.-river.-1997.-chinese.-1080p.-blu-ray.-h-264.-aac-vxt"
    },
    featured: false
  },
  {
    title: "Night Mail",
    slug: "night-mail-1936",
    synopsis: "Night Mail é um documentário britânico de 1936 produzido pela unidade de cinema do correio britânico (GPO), que acompanha o trem noturno que transporta correspondência entre Londres e a Escócia.",
    year: 1936,
    genres: [
      "Documentário"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Night-Mail_1936_GPO_documentary_poster_artwork_%28border_cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/night-mail-1936",
    source: {
      provider: "archive",
      id: "night-mail-1936"
    },
    featured: false
  },
  {
    title: "Our Daily Bread",
    slug: "our-daily-bread-1934",
    synopsis: "Our Daily Bread é um drama americano de 1934 dirigido por King Vidor, sobre um grupo de desempregados durante a Grande Depressão que forma uma cooperativa agrícola para sobreviver.",
    year: 1934,
    genres: [
      "Drama"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/9/95/Our_Daily_Bread_%281934_film_poster%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/our-daily-bread-1934-restored-movie-720p-hd",
    source: {
      provider: "archive",
      id: "our-daily-bread-1934-restored-movie-720p-hd"
    },
    featured: false
  },
  {
    title: "Earth",
    slug: "earth-1930",
    synopsis: "Earth é um filme mudo soviético ucraniano de 1930 dirigido por Alexander Dovzhenko, sobre os conflitos gerados pela coletivização agrícola numa vila ucraniana.",
    year: 1930,
    genres: [
      "Drama",
      "Mudo"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/f/f4/Zemlya_1930_poster.jpg",
    backdropUrl: "https://archive.org/services/img/EarthInHd",
    source: {
      provider: "archive",
      id: "EarthInHd"
    },
    featured: false
  },
  {
    title: "The Great Train Robbery",
    slug: "the-great-train-robbery-1903",
    synopsis: "The Great Train Robbery é um faroeste de ação mudo americano de 1903 dirigido por Edwin S. Porter, um dos filmes mais influentes da história do cinema por seu uso pioneiro de montagem narrativa.",
    year: 1903,
    genres: [
      "Faroeste",
      "Mudo"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/5/51/The_Great_Train_Robbery%2C_Edwin_S._Porter%2C_Edison_Films%2C_1903_Poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/TheGreatTrainRobbery1903_201307",
    source: {
      provider: "archive",
      id: "TheGreatTrainRobbery1903_201307"
    },
    featured: false
  },
  {
    title: "The Stranger",
    slug: "the-stranger-1946",
    synopsis: "The Stranger é um filme noir americano de 1946 dirigido e estrelado por Orson Welles, sobre um investigador que caça um ex-oficial nazista escondido sob identidade falsa numa cidade pacata dos Estados Unidos.",
    year: 1946,
    genres: [
      "Suspense",
      "Drama"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/7/71/The_Stranger_%281946_film_poster%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/the.stranger.1946.remastered.1080p.bluray.x264amiable",
    source: {
      provider: "archive",
      id: "the.stranger.1946.remastered.1080p.bluray.x264amiable"
    },
    featured: false
  },
  {
    title: "It Happened One Night",
    slug: "it-happened-one-night-1934",
    synopsis: "It Happened One Night é uma comédia romântica americana de 1934 dirigida por Frank Capra, sobre uma herdeira fugitiva e um jornalista que se apaixonam durante uma viagem de ônibus.",
    year: 1934,
    genres: [
      "Comédia",
      "Romance"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/d/dc/It-happened-one-night-poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/it.-happened.-one.-night.-1934.1080p.-blu-ray.x-264.-yify",
    source: {
      provider: "archive",
      id: "it.-happened.-one.-night.-1934.1080p.-blu-ray.x-264.-yify"
    },
    featured: false
  },
  {
    title: "The 39 Steps",
    slug: "the-39-steps-1935",
    synopsis: "The 39 Steps é um suspense de espionagem britânico de 1935 dirigido por Alfred Hitchcock, sobre um homem comum que se vê envolvido numa conspiração de espionagem após testemunhar um assassinato.",
    year: 1935,
    genres: [
      "Suspense"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ce/The_39_Steps_%281935%29_-_poster.jpg",
    backdropUrl: "https://archive.org/services/img/The39Steps_1935",
    source: {
      provider: "archive",
      id: "The39Steps_1935"
    },
    featured: false
  },
  {
    title: "The Lady Vanishes",
    slug: "the-lady-vanishes-1938",
    synopsis: "The Lady Vanishes é um suspense de mistério britânico de 1938 dirigido por Alfred Hitchcock, sobre uma jovem que, durante uma viagem de trem pela Europa, tenta provar que uma senhora idosa desapareceu, apesar de todos negarem tê-la visto.",
    year: 1938,
    genres: [
      "Suspense"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/1/1e/The_Lady_Vanishes_1938_Poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/the-lady-vanishes-1938",
    source: {
      provider: "archive",
      id: "the-lady-vanishes-1938"
    },
    featured: false
  },
  {
    title: "Foreign Correspondent",
    slug: "foreign-correspondent-1940",
    synopsis: "Foreign Correspondent é um suspense de espionagem americano de 1940 dirigido por Alfred Hitchcock, sobre um jornalista americano que descobre uma conspiração nazista às vésperas da Segunda Guerra Mundial.",
    year: 1940,
    genres: [
      "Suspense"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/f/f6/ForeignCorrespondent.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/Foreign.Correspondent.1940.Eng-Ita.Bluray",
    source: {
      provider: "archive",
      id: "Foreign.Correspondent.1940.Eng-Ita.Bluray"
    },
    featured: false
  },
  {
    title: "Suspicion",
    slug: "suspicion-1941",
    synopsis: "Suspicion é um suspense psicológico romântico americano de 1941 dirigido por Alfred Hitchcock, sobre uma mulher que passa a suspeitar que o marido planeja assassiná-la.",
    year: 1941,
    genres: [
      "Suspense"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/8/88/Suspicion_%281941_poster%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/suspicion.-1941.-restored.-1080p.-blu-ray.x-265-rarbg",
    source: {
      provider: "archive",
      id: "suspicion.-1941.-restored.-1080p.-blu-ray.x-265-rarbg"
    },
    featured: false
  },
  {
    title: "Shadow of a Doubt",
    slug: "shadow-of-a-doubt-1943",
    synopsis: "Shadow of a Doubt é um suspense psicológico americano de 1943 dirigido por Alfred Hitchcock, sobre uma jovem que começa a suspeitar que seu tio favorito é, na verdade, um assassino em série procurado pela polícia.",
    year: 1943,
    genres: [
      "Suspense"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Shadow_of_a_Doubt_%281942_poster_-_Style_C%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/shadowofadoubt1943_202003",
    source: {
      provider: "archive",
      id: "shadowofadoubt1943_202003"
    },
    featured: false
  },
  {
    title: "Saboteur",
    slug: "saboteur-1942",
    synopsis: "Saboteur é um suspense de espionagem americano de 1942 dirigido por Alfred Hitchcock, sobre um operário injustamente acusado de sabotagem que atravessa o país perseguindo o verdadeiro culpado.",
    year: 1942,
    genres: [
      "Suspense"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/7/78/Saboteurposter.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/saboteur-1942",
    source: {
      provider: "archive",
      id: "saboteur-1942"
    },
    featured: false
  },
  {
    title: "Notorious",
    slug: "notorious-1946",
    synopsis: "Notorious é um filme noir de espionagem americano de 1946 dirigido e produzido por Alfred Hitchcock, estrelado por Cary Grant, Ingrid Bergman e Claude Rains, sobre uma missão de infiltração numa rede de nazistas refugiados no Brasil.",
    year: 1946,
    genres: [
      "Suspense",
      "Romance"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/Notorious_%281946_film_poster%29.jpg",
    backdropUrl: "https://archive.org/services/img/notorious-1946-restored-movie-720p-hd",
    source: {
      provider: "archive",
      id: "notorious-1946-restored-movie-720p-hd"
    },
    featured: false
  },
  {
    title: "The Hunchback of Notre Dame",
    slug: "the-hunchback-of-notre-dame-1923",
    synopsis: "The Hunchback of Notre Dame é um drama mudo americano de 1923 estrelado por Lon Chaney no papel de Quasimodo, o sineiro corcunda da Catedral de Notre Dame, adaptação do romance de Victor Hugo.",
    year: 1923,
    genres: [
      "Drama",
      "Mudo"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/The_Hunchback_of_Notre_Dame_%28theatrical_poster%2C_1923%29.jpg",
    backdropUrl: "https://archive.org/services/img/THEHUNCHBACKOFNOTREDAME1923LonChaneyPatsyRuthMiller",
    source: {
      provider: "archive",
      id: "THEHUNCHBACKOFNOTREDAME1923LonChaneyPatsyRuthMiller"
    },
    featured: false
  },
  {
    title: "The Scarlet Letter",
    slug: "the-scarlet-letter-1926",
    synopsis: "The Scarlet Letter é um drama mudo americano de 1926 dirigido pelo sueco Victor Sjöström, adaptação do romance homônimo de Nathaniel Hawthorne sobre uma mulher condenada ao ostracismo social após ser acusada de adultério na Nova Inglaterra puritana.",
    year: 1926,
    genres: [
      "Drama",
      "Mudo"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d7/The_Scarlet_Letter_1926_lobby_card.jpg",
    backdropUrl: "https://archive.org/services/img/MajesticPicturesPublicDomainTheScarletLetter",
    source: {
      provider: "archive",
      id: "MajesticPicturesPublicDomainTheScarletLetter"
    },
    featured: false
  },
  {
    title: "The Sheik",
    slug: "the-sheik-1921",
    synopsis: "The Sheik é um drama romântico mudo americano de 1921 estrelado por Rudolph Valentino como um xeque árabe que se apaixona por uma aristocrata inglesa após sequestrá-la no deserto.",
    year: 1921,
    genres: [
      "Romance",
      "Mudo"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bc/The_Sheik_with_Agnes_Ayres_and_Rudolph_Valentino%2C_movie_poster%2C_1921.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/THESHEIKSilent1921RudolphValentino",
    source: {
      provider: "archive",
      id: "THESHEIKSilent1921RudolphValentino"
    },
    featured: false
  },
  {
    title: "The Son of the Sheik",
    slug: "the-son-of-the-sheik-1926",
    synopsis: "The Son of the Sheik é um drama de aventura mudo americano de 1926 estrelado por Rudolph Valentino, sequência de The Sheik, sobre o filho do xeque original que se apaixona por uma dançarina de um acampamento nômade.",
    year: 1926,
    genres: [
      "Romance",
      "Mudo"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Thesonofthesheik.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/THESONOFTHESHEIK1926RudolphValentinoVilmaBanky",
    source: {
      provider: "archive",
      id: "THESONOFTHESHEIK1926RudolphValentinoVilmaBanky"
    },
    featured: false
  },
  {
    title: "The Unholy Three",
    slug: "the-unholy-three-1925",
    synopsis: "The Unholy Three é um melodrama policial mudo americano de 1925 estrelado por Lon Chaney, sobre um trio de golpistas de circo — um ventríloquo, um forçudo e um anão — que monta um esquema criminoso disfarçado de loja de animais.",
    year: 1925,
    genres: [
      "Suspense",
      "Mudo"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/7/70/Poster_-_Unholy_Three%2C_The_%281925%29_02.jpg",
    backdropUrl: "https://archive.org/services/img/the.unholy.three.1925",
    source: {
      provider: "archive",
      id: "the.unholy.three.1925"
    },
    featured: false
  },
  {
    title: "Wings",
    slug: "wings-1927",
    synopsis: "Wings é um filme de guerra americano de 1927 sobre dois aviadores rivais que se tornam amigos ao lutarem juntos na aviação americana durante a Primeira Guerra Mundial — o primeiro filme a vencer o Oscar de Melhor Filme.",
    year: 1927,
    genres: [
      "Drama",
      "Mudo"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Wings_%281927%29_poster.jpg",
    backdropUrl: "https://archive.org/services/img/wings.-1927.720p.-blu-ray.x-264.-yify",
    source: {
      provider: "archive",
      id: "wings.-1927.720p.-blu-ray.x-264.-yify"
    },
    featured: false
  },
  {
    title: "The Big Parade",
    slug: "the-big-parade-1925",
    synopsis: "The Big Parade é um drama de guerra mudo americano de 1925 dirigido por King Vidor, estrelado por John Gilbert, sobre um jovem rico que se alista no exército americano durante a Primeira Guerra Mundial e se apaixona por uma francesa.",
    year: 1925,
    genres: [
      "Drama",
      "Mudo"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/2/28/The_Big_Parade_%281925%29_poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/the-big-parade-1925-synchronized-sound-restored-from-original-vitaphone-type-soundtrack-discs",
    source: {
      provider: "archive",
      id: "the-big-parade-1925-synchronized-sound-restored-from-original-vitaphone-type-soundtrack-discs"
    },
    featured: false
  },
  {
    title: "Ben-Hur",
    slug: "ben-hur-1925",
    synopsis: "Ben-Hur: A Tale of the Christ é um drama de aventura épico mudo americano de 1925 dirigido por Fred Niblo, baseado no romance de Lew Wallace, sobre um príncipe judeu traído pelo amigo de infância que se torna oficial romano, ambientado na época de Cristo.",
    year: 1925,
    genres: [
      "Drama",
      "Aventura",
      "Mudo"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/6/63/Ben-Hur-1925.jpg",
    backdropUrl: "https://archive.org/services/img/BenHurVOSEFredNiblo1925",
    source: {
      provider: "archive",
      id: "BenHurVOSEFredNiblo1925"
    },
    featured: false
  },
  {
    title: "Flesh and the Devil",
    slug: "flesh-and-the-devil-1926",
    synopsis: "Flesh and the Devil é um drama romântico mudo americano de 1926 dirigido por Clarence Brown, estrelado por Greta Garbo e John Gilbert, sobre uma mulher sedutora que causa uma ruptura entre dois amigos de infância.",
    year: 1926,
    genres: [
      "Romance",
      "Mudo"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Flesh_devil_poster.jpg",
    backdropUrl: "https://archive.org/services/img/flesh-and-the-devil-1926-by-clarence-brown",
    source: {
      provider: "archive",
      id: "flesh-and-the-devil-1926-by-clarence-brown"
    },
    featured: false
  },
  {
    title: "Faust",
    slug: "faust-1926",
    synopsis: "Faust – A German Folktale é um filme de fantasia mudo alemão de 1926 dirigido por F. W. Murnau, adaptação da lenda de Fausto sobre um alquimista que faz um pacto com o demônio Mefistófeles em troca de juventude e poder.",
    year: 1926,
    genres: [
      "Terror",
      "Mudo"
    ],
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/0/0e/Faust_poster_%28Karl_Michel%2C_1926%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    backdropUrl: "https://archive.org/services/img/1926-faust",
    source: {
      provider: "archive",
      id: "1926-faust"
    },
    featured: false
  }
];
