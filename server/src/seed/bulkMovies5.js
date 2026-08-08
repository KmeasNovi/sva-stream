// Terceira leva de filmes/curtas internacionais em domínio público.
// Fonte: lista curada de 101 filmes mudos da Open Culture
// ('101 Free Silent Films: The Great Classics'), cruzada contra o catálogo
// existente pra não duplicar (inclusive checando variação de artigo, ex:
// 'Trip to the Moon' vs 'A Trip to the Moon' já cadastrado).
// source.id resolvido via busca na API do archive.org, verificado
// (metadata do item confirmado carregável) e checado quanto ao ano —
// alguns matches iniciais eram versão errada do mesmo título (ex: 'The
// Wizard of Oz' 1910 bateu com a versão de 1925) ou clipe/trailer em vez
// do filme completo ('The Last Man' bateu com um excerto de poucos
// segundos) -- descartados.
// Sinopse é a primeira frase do resumo da Wikipedia (CC BY-SA) só quando
// o artigo é comprovadamente sobre o filme certo (ex: 'Abraham Lincoln'
// bateu com a Wikipedia de 'Abraham Lincoln: Vampire Hunter' de 2012 por
// coincidência de busca -- descartado, ficou com sinopse genérica).
// Alguns identifiers podem estar errados -- confira e corrija pelo /admin
// se notar algum player quebrado ou fora do filme.
//
// Nota de conteúdo: 'After the Ball' (1897) é um dos primeiros filmes
// eróticos da história do cinema (uma cena de despir sem nudez explícita
// pelos padrões atuais), incluído aqui por relevância histórica
// documentada (consta em listas sérias de história do cinema como a
// fonte usada), não por conteúdo adulto propriamente dito -- mas vale
// reavaliar se cabe no tom do catálogo.
module.exports = [
  {
    "title": "Abraham Lincoln",
    "slug": "abraham-lincoln-1930",
    "synopsis": "Filme de drama de 1930.",
    "year": 1930,
    "genres": [
      "Drama",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/abraham_lincoln",
    "source": {
      "provider": "archive",
      "id": "abraham_lincoln"
    },
    "featured": false
  },
  {
    "title": "A Burlesque On Carmen",
    "slug": "a-burlesque-on-carmen-1915",
    "synopsis": "A Burlesque on Carmen is a 1915 film and Charlie Chaplin's thirteenth for Essanay Studios, originally released as Carmen on December 18, 1915. (resumo: Wikipedia, CC BY-SA)",
    "year": 1915,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "posterUrl": "https://upload.wikimedia.org/wikipedia/commons/2/29/Burlesque_on_Carmen_poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "backdropUrl": "https://archive.org/services/img/CC_1915_12_18_ABurlesqueOnCarmen",
    "source": {
      "provider": "archive",
      "id": "CC_1915_12_18_ABurlesqueOnCarmen"
    },
    "featured": false
  },
  {
    "title": "Aelita",
    "slug": "aelita-1924",
    "synopsis": "Aelita, also known as Aelita: Queen of Mars, is a 1924 Soviet silent science fiction film directed by Yakov Protazanov and produced at the Mezhrabpom-Rus film studio. (resumo: Wikipedia, CC BY-SA)",
    "year": 1924,
    "genres": [
      "Ficção Científica",
      "Mudo",
      "Clássico"
    ],
    "posterUrl": "https://upload.wikimedia.org/wikipedia/commons/c/ce/1929._%D0%AE%D0%BB%D0%B8%D1%8F_%D0%A1%D0%BE%D0%BB%D0%BD%D1%86%D0%B5%D0%B2%D0%B0_%D0%B2_%D1%84%D0%B8%D0%BB%D1%8C%D0%BC%D0%B5_%D0%90%D1%8D%D0%BB%D0%B8%D1%82%D0%B0.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "backdropUrl": "https://archive.org/services/img/Aelita-QueenOfMarsrussianScience-fictionFilm1924",
    "source": {
      "provider": "archive",
      "id": "Aelita-QueenOfMarsrussianScience-fictionFilm1924"
    },
    "featured": false
  },
  {
    "title": "Anémic Cinéma",
    "slug": "anemic-cinema-1926",
    "synopsis": "Anemic Cinema or Anémic Cinéma is a 1926 Dada/surrealist French experimental film by Marcel Duchamp, made in collaboration with Man Ray and Marc Allégret. (resumo: Wikipedia, CC BY-SA)",
    "year": 1926,
    "genres": [
      "Mudo",
      "Clássico"
    ],
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/thumb/1/10/Marcel_Duchamp_-_Anemic_Cinema_%281926%29.webm/1280px--Marcel_Duchamp_-_Anemic_Cinema_%281926%29.webm.jpg",
    "backdropUrl": "https://archive.org/services/img/1016-sam-anemic-cinema-4-184-030",
    "source": {
      "provider": "archive",
      "id": "1016-sam-anemic-cinema-4-184-030"
    },
    "featured": false
  },
  {
    "title": "A Christmas Carol",
    "slug": "a-christmas-carol-1910",
    "synopsis": "Filme de drama de 1910.",
    "year": 1910,
    "genres": [
      "Drama",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/silent-a-christmas-carol",
    "source": {
      "provider": "archive",
      "id": "silent-a-christmas-carol"
    },
    "featured": false
  },
  {
    "title": "Behind the Screen",
    "slug": "behind-the-screen-1916",
    "synopsis": "Filme de comédia de 1916.",
    "year": 1916,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/CC_1916_11_13_BehindtheScreen",
    "source": {
      "provider": "archive",
      "id": "CC_1916_11_13_BehindtheScreen"
    },
    "featured": false
  },
  {
    "title": "After the Ball",
    "slug": "after-the-ball",
    "synopsis": "Filme de drama.",
    "genres": [
      "Drama",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/apres-le-bal-after-the-ball-1897-silent-erotic-film",
    "source": {
      "provider": "archive",
      "id": "apres-le-bal-after-the-ball-1897-silent-erotic-film"
    },
    "featured": false
  },
  {
    "title": "Between Showers",
    "slug": "between-showers-1914",
    "synopsis": "Filme de comédia de 1914.",
    "year": 1914,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/CC_1914_02_28_BetweenShowers",
    "source": {
      "provider": "archive",
      "id": "CC_1914_02_28_BetweenShowers"
    },
    "featured": false
  },
  {
    "title": "Champagne",
    "slug": "champagne-1928",
    "synopsis": "Champagne is a 1928 British silent comedy film directed by Alfred Hitchcock and starring Betty Balfour, Gordon Harker and Jean Bradin. (resumo: Wikipedia, CC BY-SA)",
    "year": 1928,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/champagne_1928",
    "source": {
      "provider": "archive",
      "id": "champagne_1928"
    },
    "featured": false
  },
  {
    "title": "Alice in Wonderland",
    "slug": "alice-in-wonderland-1903",
    "synopsis": "Alice in Wonderland is a 1903 British silent fantasy film directed by Cecil Hepworth and Percy Stow. (resumo: Wikipedia, CC BY-SA)",
    "year": 1903,
    "genres": [
      "Aventura",
      "Mudo",
      "Clássico"
    ],
    "posterUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Norman_Whitten_Mad_Hatter_1903.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "backdropUrl": "https://archive.org/services/img/AliceInWonderland1903",
    "source": {
      "provider": "archive",
      "id": "AliceInWonderland1903"
    },
    "featured": false
  },
  {
    "title": "Charlie's Recreation",
    "slug": "charlie-s-recreation-1914",
    "synopsis": "Recreation is an American short silent comedy film written, directed by, and starring Charlie Chaplin. (resumo: Wikipedia, CC BY-SA)",
    "year": 1914,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "posterUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Recreation_%281914%29_-_CHARLIE_CHAPLIN_-_Mack_Sennett.webm/960px--Recreation_%281914%29_-_CHARLIE_CHAPLIN_-_Mack_Sennett.webm.jpg",
    "backdropUrl": "https://archive.org/services/img/CC_1914_08_13_CharliesRecreation",
    "source": {
      "provider": "archive",
      "id": "CC_1914_08_13_CharliesRecreation"
    },
    "featured": false
  },
  {
    "title": "Cinderella",
    "slug": "cinderella-1899",
    "synopsis": "Cinderella is an 1899 French trick film directed by Georges Méliès, based on the fairy tale by Charles Perrault. (resumo: Wikipedia, CC BY-SA)",
    "year": 1899,
    "genres": [
      "Aventura",
      "Mudo",
      "Clássico"
    ],
    "posterUrl": "https://upload.wikimedia.org/wikipedia/commons/d/de/M%C3%A9li%C3%A8s%2C_Cinderella_%28Star_Film_219-224%2C_1899%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "backdropUrl": "https://archive.org/services/img/1899-cinderella",
    "source": {
      "provider": "archive",
      "id": "1899-cinderella"
    },
    "featured": false
  },
  {
    "title": "Downhill",
    "slug": "downhill-1927",
    "synopsis": "Filme de drama de 1927.",
    "year": 1927,
    "genres": [
      "Drama",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/downhill-1927",
    "source": {
      "provider": "archive",
      "id": "downhill-1927"
    },
    "featured": false
  },
  {
    "title": "Dr. Jekyll And Mr. Hyde",
    "slug": "dr-jekyll-and-mr-hyde-1912",
    "synopsis": "Filme de terror de 1912.",
    "year": 1912,
    "genres": [
      "Terror",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/Dr.JekyllAndMr.Hyde1912_201312",
    "source": {
      "provider": "archive",
      "id": "Dr.JekyllAndMr.Hyde1912_201312"
    },
    "featured": false
  },
  {
    "title": "Dr. Jekyll And Mr. Hyde",
    "slug": "dr-jekyll-and-mr-hyde-1920",
    "synopsis": "Filme de terror de 1920.",
    "year": 1920,
    "genres": [
      "Terror",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/DrJekyllandMrHyde",
    "source": {
      "provider": "archive",
      "id": "DrJekyllandMrHyde"
    },
    "featured": false
  },
  {
    "title": "Easy Street",
    "slug": "easy-street-1917",
    "synopsis": "Filme de comédia de 1917.",
    "year": 1917,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/EasyStreet1917",
    "source": {
      "provider": "archive",
      "id": "EasyStreet1917"
    },
    "featured": false
  },
  {
    "title": "Die Nibelungen",
    "slug": "die-nibelungen-1924",
    "synopsis": "Filme de aventura de 1924.",
    "year": 1924,
    "genres": [
      "Aventura",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/1922Nibelungos01",
    "source": {
      "provider": "archive",
      "id": "1922Nibelungos01"
    },
    "featured": false
  },
  {
    "title": "Frankenstein",
    "slug": "frankenstein-1910",
    "synopsis": "Filme de terror de 1910.",
    "year": 1910,
    "genres": [
      "Terror",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/FrankensteinfullMovie",
    "source": {
      "provider": "archive",
      "id": "FrankensteinfullMovie"
    },
    "featured": false
  },
  {
    "title": "Ghosts Before Breakfast",
    "slug": "ghosts-before-breakfast-1928",
    "synopsis": "Filme de 1928.",
    "year": 1928,
    "genres": [
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/vormittagsspuk-aka-ghosts-before-breakfast_1928",
    "source": {
      "provider": "archive",
      "id": "vormittagsspuk-aka-ghosts-before-breakfast_1928"
    },
    "featured": false
  },
  {
    "title": "Greed",
    "slug": "greed-1924",
    "synopsis": "Filme de drama de 1924.",
    "year": 1924,
    "genres": [
      "Drama",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/1924LesRapacesGreedDeErichVonStroheimFreeDownload",
    "source": {
      "provider": "archive",
      "id": "1924LesRapacesGreedDeErichVonStroheimFreeDownload"
    },
    "featured": false
  },
  {
    "title": "Harakiri",
    "slug": "harakiri-1919",
    "synopsis": "Filme de drama de 1919.",
    "year": 1919,
    "genres": [
      "Drama",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/silent-harakiri",
    "source": {
      "provider": "archive",
      "id": "silent-harakiri"
    },
    "featured": false
  },
  {
    "title": "Kid Auto Races at Venice",
    "slug": "kid-auto-races-at-venice-1914",
    "synopsis": "Filme de comédia de 1914.",
    "year": 1914,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/silent-kid-auto-races-at-venice",
    "source": {
      "provider": "archive",
      "id": "silent-kid-auto-races-at-venice"
    },
    "featured": false
  },
  {
    "title": "Entr'Acte",
    "slug": "entr-acte-1924",
    "synopsis": "Filme de 1924.",
    "year": 1924,
    "genres": [
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/silent-entracte",
    "source": {
      "provider": "archive",
      "id": "silent-entracte"
    },
    "featured": false
  },
  {
    "title": "Joyless Street",
    "slug": "joyless-street-1925",
    "synopsis": "Filme de drama de 1925.",
    "year": 1925,
    "genres": [
      "Drama",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/JoylessStreet",
    "source": {
      "provider": "archive",
      "id": "JoylessStreet"
    },
    "featured": false
  },
  {
    "title": "La Souriante Madame Beudet",
    "slug": "la-souriante-madame-beudet-1922",
    "synopsis": "Filme de drama de 1922.",
    "year": 1922,
    "genres": [
      "Drama",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/LaSourianteMadameBeudet",
    "source": {
      "provider": "archive",
      "id": "LaSourianteMadameBeudet"
    },
    "featured": false
  },
  {
    "title": "Easy Virtue",
    "slug": "easy-virtue-1928",
    "synopsis": "Filme de drama de 1928.",
    "year": 1928,
    "genres": [
      "Drama",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/easy-virtue-1928-by-alfred-hitchcock",
    "source": {
      "provider": "archive",
      "id": "easy-virtue-1928-by-alfred-hitchcock"
    },
    "featured": false
  },
  {
    "title": "Laughing Gas",
    "slug": "laughing-gas-1914",
    "synopsis": "Filme de comédia de 1914.",
    "year": 1914,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/CC_1914_07_09_LaffingGas",
    "source": {
      "provider": "archive",
      "id": "CC_1914_07_09_LaffingGas"
    },
    "featured": false
  },
  {
    "title": "La Passion de Jeanne d'Arc",
    "slug": "la-passion-de-jeanne-d-arc-1928",
    "synopsis": "Filme de drama de 1928.",
    "year": 1928,
    "genres": [
      "Drama",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/MartyreDeJeanneDarc",
    "source": {
      "provider": "archive",
      "id": "MartyreDeJeanneDarc"
    },
    "featured": false
  },
  {
    "title": "L'Arrivée D'un Train En Gare De La Ciotat",
    "slug": "l-arrivee-d-un-train-en-gare-de-la-ciotat-1895",
    "synopsis": "Filme de documentário de 1895.",
    "year": 1895,
    "genres": [
      "Documentário",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/arrival-of-a-train-at-la-ciotat-1895-animation-mp-4",
    "source": {
      "provider": "archive",
      "id": "arrival-of-a-train-at-la-ciotat-1895-animation-mp-4"
    },
    "featured": false
  },
  {
    "title": "Le Retour à la Raison",
    "slug": "le-retour-a-la-raison-1923",
    "synopsis": "Filme de 1923.",
    "year": 1923,
    "genres": [
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/LeRetourLaRaison",
    "source": {
      "provider": "archive",
      "id": "LeRetourLaRaison"
    },
    "featured": false
  },
  {
    "title": "Le Ballet Mécanique",
    "slug": "le-ballet-mecanique-1924",
    "synopsis": "Filme de 1924.",
    "year": 1924,
    "genres": [
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/balletmecanique",
    "source": {
      "provider": "archive",
      "id": "balletmecanique"
    },
    "featured": false
  },
  {
    "title": "Mabel's Strange Predicament",
    "slug": "mabel-s-strange-predicament-1914",
    "synopsis": "Filme de comédia de 1914.",
    "year": 1914,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/charlie-chaplin-.-mabels-strange-predicament-1914-restored-short-silent-film-noir-comedy",
    "source": {
      "provider": "archive",
      "id": "charlie-chaplin-.-mabels-strange-predicament-1914-restored-short-silent-film-noir-comedy"
    },
    "featured": false
  },
  {
    "title": "Making a Living",
    "slug": "making-a-living-1914",
    "synopsis": "Filme de comédia de 1914.",
    "year": 1914,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/CC_1914_02_02_MakingALiving",
    "source": {
      "provider": "archive",
      "id": "CC_1914_02_02_MakingALiving"
    },
    "featured": false
  },
  {
    "title": "Old and New",
    "slug": "old-and-new-1929",
    "synopsis": "Filme de documentário de 1929.",
    "year": 1929,
    "genres": [
      "Documentário",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/old-and-new_1930",
    "source": {
      "provider": "archive",
      "id": "old-and-new_1930"
    },
    "featured": false
  },
  {
    "title": "One A.M.",
    "slug": "one-a-m-1916",
    "synopsis": "One A.M. is a unique Charlie Chaplin silent film created for Mutual Film in 1916. (resumo: Wikipedia, CC BY-SA)",
    "year": 1916,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "posterUrl": "https://upload.wikimedia.org/wikipedia/commons/f/fa/One_A.M._poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "backdropUrl": "https://archive.org/services/img/CC_1916_08_07_One_A_M",
    "source": {
      "provider": "archive",
      "id": "CC_1916_08_07_One_A_M"
    },
    "featured": false
  },
  {
    "title": "Romance Sentimentale",
    "slug": "romance-sentimentale-1930",
    "synopsis": "Romance sentimentale is a 1930 French film directed by Grigori Aleksandrov and Sergei M. Eisenstein. (resumo: Wikipedia, CC BY-SA)",
    "year": 1930,
    "genres": [
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/RomanceSentimentale",
    "source": {
      "provider": "archive",
      "id": "RomanceSentimentale"
    },
    "featured": false
  },
  {
    "title": "Sherlock Holmes and the Secret Weapon",
    "slug": "sherlock-holmes-and-the-secret-weapon-1943",
    "synopsis": "Filme de suspense de 1943.",
    "year": 1943,
    "genres": [
      "Suspense",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/secret_weapon",
    "source": {
      "provider": "archive",
      "id": "secret_weapon"
    },
    "featured": false
  },
  {
    "title": "Sunrise: A Song of Two Humans",
    "slug": "sunrise-a-song-of-two-humans-1927",
    "synopsis": "Filme de drama de 1927.",
    "year": 1927,
    "genres": [
      "Drama",
      "Romance",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/sunrise-1927_202301",
    "source": {
      "provider": "archive",
      "id": "sunrise-1927_202301"
    },
    "featured": false
  },
  {
    "title": "The Adventurer",
    "slug": "the-adventurer-1917",
    "synopsis": "Filme de comédia de 1917.",
    "year": 1917,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/CC_1917_10_22_TheAdventurer",
    "source": {
      "provider": "archive",
      "id": "CC_1917_10_22_TheAdventurer"
    },
    "featured": false
  },
  {
    "title": "Pandora's Box",
    "slug": "pandora-s-box-1929",
    "synopsis": "Filme de drama de 1929.",
    "year": 1929,
    "genres": [
      "Drama",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/pandoras-box-1929-by-georg-wilhelm-pabst",
    "source": {
      "provider": "archive",
      "id": "pandoras-box-1929-by-georg-wilhelm-pabst"
    },
    "featured": false
  },
  {
    "title": "October: Ten Days That Shook the World",
    "slug": "october-ten-days-that-shook-the-world-1928",
    "synopsis": "Filme de drama de 1928.",
    "year": 1928,
    "genres": [
      "Drama",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/october-ten-days-that-shook-the-world_1928",
    "source": {
      "provider": "archive",
      "id": "october-ten-days-that-shook-the-world_1928"
    },
    "featured": false
  },
  {
    "title": "The Count",
    "slug": "the-count-1916",
    "synopsis": "Filme de comédia de 1916.",
    "year": 1916,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/CC_1916_09_04_TheCount",
    "source": {
      "provider": "archive",
      "id": "CC_1916_09_04_TheCount"
    },
    "featured": false
  },
  {
    "title": "The Bond",
    "slug": "the-bond-1918",
    "synopsis": "Filme de comédia de 1918.",
    "year": 1918,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/CC_1918_09_29_TheBond",
    "source": {
      "provider": "archive",
      "id": "CC_1918_09_29_TheBond"
    },
    "featured": false
  },
  {
    "title": "The Cure",
    "slug": "the-cure-1917",
    "synopsis": "Filme de comédia de 1917.",
    "year": 1917,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/CharlieChaplinsTheCure1917",
    "source": {
      "provider": "archive",
      "id": "CharlieChaplinsTheCure1917"
    },
    "featured": false
  },
  {
    "title": "The Devilish Tenant",
    "slug": "the-devilish-tenant-1909",
    "synopsis": "Filme de aventura de 1909.",
    "year": 1909,
    "genres": [
      "Aventura",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/TheDevilishTenant",
    "source": {
      "provider": "archive",
      "id": "TheDevilishTenant"
    },
    "featured": false
  },
  {
    "title": "The Dreyfus Affair",
    "slug": "the-dreyfus-affair-1899",
    "synopsis": "Filme de documentário de 1899.",
    "year": 1899,
    "genres": [
      "Documentário",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/TheDreyfusAffair_49",
    "source": {
      "provider": "archive",
      "id": "TheDreyfusAffair_49"
    },
    "featured": false
  },
  {
    "title": "The Floorwalker",
    "slug": "the-floorwalker-1916",
    "synopsis": "Filme de comédia de 1916.",
    "year": 1916,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/CC_1916_05_15_TheFloorwalker",
    "source": {
      "provider": "archive",
      "id": "CC_1916_05_15_TheFloorwalker"
    },
    "featured": false
  },
  {
    "title": "The Four Horsemen of the Apocalypse",
    "slug": "the-four-horsemen-of-the-apocalypse-1921",
    "synopsis": "Filme de drama de 1921.",
    "year": 1921,
    "genres": [
      "Drama",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/The_Four_Horsemen_of_the_Apocalypse",
    "source": {
      "provider": "archive",
      "id": "The_Four_Horsemen_of_the_Apocalypse"
    },
    "featured": false
  },
  {
    "title": "The Goddess",
    "slug": "the-goddess-1934",
    "synopsis": "Filme de drama de 1934.",
    "year": 1934,
    "genres": [
      "Drama",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/thegoddess",
    "source": {
      "provider": "archive",
      "id": "thegoddess"
    },
    "featured": false
  },
  {
    "title": "The Fireman",
    "slug": "the-fireman-1916",
    "synopsis": "Filme de comédia de 1916.",
    "year": 1916,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/TheFireman1916",
    "source": {
      "provider": "archive",
      "id": "TheFireman1916"
    },
    "featured": false
  },
  {
    "title": "The Good for Nothing",
    "slug": "the-good-for-nothing-1914",
    "synopsis": "Filme de comédia de 1914.",
    "year": 1914,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/CC_1914_08_31_TheGoodforNothing",
    "source": {
      "provider": "archive",
      "id": "CC_1914_08_31_TheGoodforNothing"
    },
    "featured": false
  },
  {
    "title": "The Immigrant",
    "slug": "the-immigrant-1917",
    "synopsis": "Filme de comédia de 1917.",
    "year": 1917,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/CC_1917_06_17_TheImmigrant",
    "source": {
      "provider": "archive",
      "id": "CC_1917_06_17_TheImmigrant"
    },
    "featured": false
  },
  {
    "title": "The Impossible Voyage",
    "slug": "the-impossible-voyage-1904",
    "synopsis": "Filme de aventura de 1904.",
    "year": 1904,
    "genres": [
      "Aventura",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/The_Impossible_Voyage",
    "source": {
      "provider": "archive",
      "id": "The_Impossible_Voyage"
    },
    "featured": false
  },
  {
    "title": "The Hearts of Age",
    "slug": "the-hearts-of-age-1934",
    "synopsis": "Filme de 1934.",
    "year": 1934,
    "genres": [
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/theHeartsOfAge1934",
    "source": {
      "provider": "archive",
      "id": "theHeartsOfAge1934"
    },
    "featured": false
  },
  {
    "title": "The Little Match Girl",
    "slug": "the-little-match-girl-1928",
    "synopsis": "Filme de drama de 1928.",
    "year": 1928,
    "genres": [
      "Drama",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/the-little-match-girl_1928",
    "source": {
      "provider": "archive",
      "id": "the-little-match-girl_1928"
    },
    "featured": false
  },
  {
    "title": "The Golem: How He Came Into the World",
    "slug": "the-golem-how-he-came-into-the-world-1920",
    "synopsis": "Filme de terror de 1920.",
    "year": 1920,
    "genres": [
      "Terror",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/gulomfinal_0",
    "source": {
      "provider": "archive",
      "id": "gulomfinal_0"
    },
    "featured": false
  },
  {
    "title": "The Manxman",
    "slug": "the-manxman-1929",
    "synopsis": "The Manxman is a 1929 British silent romance film directed by Alfred Hitchcock and starring Anny Ondra, Carl Brisson and Malcolm Keen. (resumo: Wikipedia, CC BY-SA)",
    "year": 1929,
    "genres": [
      "Drama",
      "Romance",
      "Mudo",
      "Clássico"
    ],
    "posterUrl": "https://upload.wikimedia.org/wikipedia/commons/3/32/The_manxman.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "backdropUrl": "https://archive.org/services/img/the-manxman_1929",
    "source": {
      "provider": "archive",
      "id": "the-manxman_1929"
    },
    "featured": false
  },
  {
    "title": "The Pawnshop",
    "slug": "the-pawnshop-1916",
    "synopsis": "The Pawnshop is Charlie Chaplin's sixth film for Mutual Film Corporation. (resumo: Wikipedia, CC BY-SA)",
    "year": 1916,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "posterUrl": "https://upload.wikimedia.org/wikipedia/commons/3/37/%27The_Pawnshop%27.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "backdropUrl": "https://archive.org/services/img/CC_1916_10_02_ThePawnshop",
    "source": {
      "provider": "archive",
      "id": "CC_1916_10_02_ThePawnshop"
    },
    "featured": false
  },
  {
    "title": "The Phantom Carriage",
    "slug": "the-phantom-carriage-1921",
    "synopsis": "The Phantom Carriage is a 1921 Swedish silent film directed by and starring Victor Sjöström, based on the 1912 novel Thy Soul Shall Bear Witness! (Körkarlen) by Swedish author Selma Lagerlöf. (resumo: Wikipedia, CC BY-SA)",
    "year": 1921,
    "genres": [
      "Drama",
      "Mudo",
      "Clássico"
    ],
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/5/56/The_Phantom_Carriage_%281921%29_poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "backdropUrl": "https://archive.org/services/img/ThePhantomCarriage_201405",
    "source": {
      "provider": "archive",
      "id": "ThePhantomCarriage_201405"
    },
    "featured": false
  },
  {
    "title": "The Ring",
    "slug": "the-ring-1927",
    "synopsis": "The Ring is a 1927 British silent romance film written and directed by Alfred Hitchcock and starring Carl Brisson, Lillian Hall-Davis and Ian Hunter. (resumo: Wikipedia, CC BY-SA)",
    "year": 1927,
    "genres": [
      "Drama",
      "Romance",
      "Mudo",
      "Clássico"
    ],
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/6/64/The_Ring_%281927_movie_poster%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "backdropUrl": "https://archive.org/services/img/the-ring-1927-by-alfred-hitchcock",
    "source": {
      "provider": "archive",
      "id": "the-ring-1927-by-alfred-hitchcock"
    },
    "featured": false
  },
  {
    "title": "The Pleasure Garden",
    "slug": "the-pleasure-garden-1925",
    "synopsis": "The Pleasure Garden is a 1926 silent drama film directed by Alfred Hitchcock in his feature film directorial debut. (resumo: Wikipedia, CC BY-SA)",
    "year": 1925,
    "genres": [
      "Drama",
      "Mudo",
      "Clássico"
    ],
    "posterUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9e/The_Pleasure_Garden_%281925%29_-_poster.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "backdropUrl": "https://archive.org/services/img/silent-the-pleasure-garden",
    "source": {
      "provider": "archive",
      "id": "silent-the-pleasure-garden"
    },
    "featured": false
  },
  {
    "title": "The Rink",
    "slug": "the-rink-1916",
    "synopsis": "Filme de comédia de 1916.",
    "year": 1916,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/CC_1916_12_04_TheRink",
    "source": {
      "provider": "archive",
      "id": "CC_1916_12_04_TheRink"
    },
    "featured": false
  },
  {
    "title": "The Sealed Room",
    "slug": "the-sealed-room",
    "synopsis": "Filme de drama.",
    "genres": [
      "Drama",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/DWGriffithsTheSealedRoom1909",
    "source": {
      "provider": "archive",
      "id": "DWGriffithsTheSealedRoom1909"
    },
    "featured": false
  },
  {
    "title": "The Seashell and the Clergyman",
    "slug": "the-seashell-and-the-clergyman-1928",
    "synopsis": "Filme de 1928.",
    "year": 1928,
    "genres": [
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/la-coquille-et-le-clergyman-1928_202507",
    "source": {
      "provider": "archive",
      "id": "la-coquille-et-le-clergyman-1928_202507"
    },
    "featured": false
  },
  {
    "title": "The Toll of the Sea",
    "slug": "the-toll-of-the-sea-1922",
    "synopsis": "Filme de drama de 1922.",
    "year": 1922,
    "genres": [
      "Drama",
      "Romance",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/TheTollOfTheSeanovember261922",
    "source": {
      "provider": "archive",
      "id": "TheTollOfTheSeanovember261922"
    },
    "featured": false
  },
  {
    "title": "The Tramp",
    "slug": "the-tramp-1915",
    "synopsis": "Filme de comédia de 1915.",
    "year": 1915,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/TheTramp1915",
    "source": {
      "provider": "archive",
      "id": "TheTramp1915"
    },
    "featured": false
  },
  {
    "title": "The Lodger: A Story of the London Fog",
    "slug": "the-lodger-a-story-of-the-london-fog-1927",
    "synopsis": "Filme de suspense de 1927.",
    "year": 1927,
    "genres": [
      "Suspense",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/the.-lodger.-a.-story.-of.-the.-london.-fog.-1927",
    "source": {
      "provider": "archive",
      "id": "the.-lodger.-a.-story.-of.-the.-london.-fog.-1927"
    },
    "featured": false
  },
  {
    "title": "The Vagabond",
    "slug": "the-vagabond-1916",
    "synopsis": "Filme de comédia de 1916.",
    "year": 1916,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/TheVagabond1916",
    "source": {
      "provider": "archive",
      "id": "TheVagabond1916"
    },
    "featured": false
  },
  {
    "title": "The Wizard of Oz",
    "slug": "the-wizard-of-oz-1925",
    "synopsis": "Filme de aventura de 1925.",
    "year": 1925,
    "genres": [
      "Aventura",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/OliverHardyTheWizardOfOz1925",
    "source": {
      "provider": "archive",
      "id": "OliverHardyTheWizardOfOz1925"
    },
    "featured": false
  },
  {
    "title": "Tillie's Punctured Romance",
    "slug": "tillie-s-punctured-romance-1914",
    "synopsis": "Filme de comédia de 1914.",
    "year": 1914,
    "genres": [
      "Comédia",
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/tillies-punctured-romance-1914",
    "source": {
      "provider": "archive",
      "id": "tillies-punctured-romance-1914"
    },
    "featured": false
  },
  {
    "title": "Un Chien Andalou",
    "slug": "un-chien-andalou-1929",
    "synopsis": "Filme de 1929.",
    "year": 1929,
    "genres": [
      "Mudo",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/LuisBunuelUnChienAndalou1928YouTube",
    "source": {
      "provider": "archive",
      "id": "LuisBunuelUnChienAndalou1928YouTube"
    },
    "featured": false
  }
];
