// Segunda leva de filmes brasileiros em domínio público, categoria
// 'Nacionais'. Fonte: categoria da Wikipédia 'Filmes do Brasil em domínio
// público', cruzada contra o catálogo existente pra não duplicar.
// source.id foi resolvido via busca na API do archive.org e verificado
// (metadata do item confirmado carregável). Vários matches iniciais eram
// filmes errados com título parecido (remakes, documentários sobre outro
// assunto, vídeos de YouTube sem relação) -- filtrados manualmente
// checando o ano real do item contra a era esperada (~1900-1960).
// Sinopse é a primeira frase do resumo da Wikipedia em português (CC
// BY-SA) só quando o artigo é comprovadamente sobre o filme certo (ex:
// 'Floradas na Serra' tem artigo na Wikipedia, mas é sobre uma minissérie
// de TV de 1991 com o mesmo nome -- descartado, ficou com sinopse
// genérica). Caso contrário, frase genérica com o ano.
// Alguns identifiers podem estar errados -- confira e corrija pelo /admin
// se notar algum player quebrado ou fora do filme.
module.exports = [
  {
    "title": "Aitaré da Praia",
    "slug": "aitare-da-praia-1925",
    "synopsis": "Aitaré da Praia é um filme brasileiro dos gêneros drama e romance, dirigido por Gentil Roiz e Ary Severo, tendo o último também interpretado o personagem principal, Aitaré. (resumo: Wikipedia, CC BY-SA)",
    "year": 1925,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "posterUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Aitar%C3%A9_da_Praia_-_Cart%C3%A3o_de_t%C3%ADtulo.png?utm_source=pt.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "backdropUrl": "https://archive.org/services/img/AitarDaPraiaGentilRoiz1925Drama",
    "source": {
      "provider": "archive",
      "id": "AitarDaPraiaGentilRoiz1925Drama"
    },
    "featured": false
  },
  {
    "title": "Angu de Caroço",
    "slug": "angu-de-caroco-1955",
    "synopsis": "Filme brasileiro de 1955.",
    "year": 1955,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/angu_de_caroco_1955",
    "source": {
      "provider": "archive",
      "id": "angu_de_caroco_1955"
    },
    "featured": false
  },
  {
    "title": "A Sogra",
    "slug": "a-sogra-1954",
    "synopsis": "Filme brasileiro de 1954.",
    "year": 1954,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/a.-sogra",
    "source": {
      "provider": "archive",
      "id": "a.-sogra"
    },
    "featured": false
  },
  {
    "title": "Candinho",
    "slug": "candinho-1953",
    "synopsis": "Filme brasileiro de 1953.",
    "year": 1953,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/1953MazzaropiCandinho",
    "source": {
      "provider": "archive",
      "id": "1953MazzaropiCandinho"
    },
    "featured": false
  },
  {
    "title": "Berlim na Batucada",
    "slug": "berlim-na-batucada-1944",
    "synopsis": "Filme brasileiro de 1944.",
    "year": 1944,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/BerlimNaBatucadaLuizDeBarros1944",
    "source": {
      "provider": "archive",
      "id": "BerlimNaBatucadaLuizDeBarros1944"
    },
    "featured": false
  },
  {
    "title": "Carnaval no Fogo",
    "slug": "carnaval-no-fogo-1949",
    "synopsis": "Filme brasileiro de 1949.",
    "year": 1949,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/CarnavalNoFogoWatsonMacedo1949",
    "source": {
      "provider": "archive",
      "id": "CarnavalNoFogoWatsonMacedo1949"
    },
    "featured": false
  },
  {
    "title": "O Comprador de Fazendas",
    "slug": "o-comprador-de-fazendas-1951",
    "synopsis": "Filme brasileiro de 1951.",
    "year": 1951,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/o-comprador-de-fazendas-1951-low",
    "source": {
      "provider": "archive",
      "id": "o-comprador-de-fazendas-1951-low"
    },
    "featured": false
  },
  {
    "title": "Coração Materno",
    "slug": "coracao-materno-1951",
    "synopsis": "Filme brasileiro de 1951.",
    "year": 1951,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/CoraoMaternoGildaDeAbreu1951",
    "source": {
      "provider": "archive",
      "id": "CoraoMaternoGildaDeAbreu1951"
    },
    "featured": false
  },
  {
    "title": "É Fogo na Roupa",
    "slug": "e-fogo-na-roupa-1952",
    "synopsis": "É Fogo na Roupa é um filme brasileiro de 1952 do gênero \"Comédia Musical\", dirigido por Watson Macedo. (resumo: Wikipedia, CC BY-SA)",
    "year": 1952,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/1952-e-fogo-na-roupa",
    "source": {
      "provider": "archive",
      "id": "1952-e-fogo-na-roupa"
    },
    "featured": false
  },
  {
    "title": "Casamento É Negócio?",
    "slug": "casamento-e-negocio-1933",
    "synopsis": "Casamento É Negócio? é um filme mudo brasileiro de 1933 do gênero drama, dirigido e roteirizado por Guilherme Rogato, com produção da Gáudio Filmes. (resumo: Wikipedia, CC BY-SA)",
    "year": 1933,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "posterUrl": "https://upload.wikimedia.org/wikipedia/commons/6/62/Casamento_%C3%A9_Neg%C3%B3cio_cart%C3%A3o_de_t%C3%ADtulo.png?utm_source=pt.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "backdropUrl": "https://archive.org/services/img/casamento-e-negocio-1933-completo-360-p",
    "source": {
      "provider": "archive",
      "id": "casamento-e-negocio-1933-completo-360-p"
    },
    "featured": false
  },
  {
    "title": "Floradas na Serra",
    "slug": "floradas-na-serra-1954",
    "synopsis": "Filme brasileiro de 1954.",
    "year": 1954,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/floradas.na.-serra",
    "source": {
      "provider": "archive",
      "id": "floradas.na.-serra"
    },
    "featured": false
  },
  {
    "title": "Luz Apagada",
    "slug": "luz-apagada-1953",
    "synopsis": "Filme brasileiro de 1953.",
    "year": 1953,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/luz-apagada-1953-ok.-ru-3",
    "source": {
      "provider": "archive",
      "id": "luz-apagada-1953-ok.-ru-3"
    },
    "featured": false
  },
  {
    "title": "Matar ou Correr",
    "slug": "matar-ou-correr-1954",
    "synopsis": "Filme brasileiro de 1954.",
    "year": 1954,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/Mataroucorrer.1954.720p",
    "source": {
      "provider": "archive",
      "id": "Mataroucorrer.1954.720p"
    },
    "featured": false
  },
  {
    "title": "Meu Destino É Pecar",
    "slug": "meu-destino-e-pecar-1952",
    "synopsis": "Filme brasileiro de 1952.",
    "year": 1952,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/meudestinoepecarmanuelpeluffo1952",
    "source": {
      "provider": "archive",
      "id": "meudestinoepecarmanuelpeluffo1952"
    },
    "featured": false
  },
  {
    "title": "O Homem dos Papagaios",
    "slug": "o-homem-dos-papagaios-1953",
    "synopsis": "Filme brasileiro de 1953.",
    "year": 1953,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/homem-dos-papagaios-o-armando-couto-bra-1953_202602",
    "source": {
      "provider": "archive",
      "id": "homem-dos-papagaios-o-armando-couto-bra-1953_202602"
    },
    "featured": false
  },
  {
    "title": "Luz dos Meus Olhos",
    "slug": "luz-dos-meus-olhos-1949",
    "synopsis": "Filme brasileiro de 1949.",
    "year": 1949,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/luz-dos-meus-olhos-1949-ok.-ru-2",
    "source": {
      "provider": "archive",
      "id": "luz-dos-meus-olhos-1949-ok.-ru-2"
    },
    "featured": false
  },
  {
    "title": "Onde Estás Felicidade?",
    "slug": "onde-estas-felicidade-1939",
    "synopsis": "Filme brasileiro de 1939.",
    "year": 1939,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/1939-onde-estas-felicidade",
    "source": {
      "provider": "archive",
      "id": "1939-onde-estas-felicidade"
    },
    "featured": false
  },
  {
    "title": "Uma Pulga na Balança",
    "slug": "uma-pulga-na-balanca-1953",
    "synopsis": "Filme brasileiro de 1953.",
    "year": 1953,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/uma.-pulga.-na.-balanca",
    "source": {
      "provider": "archive",
      "id": "uma.-pulga.-na.-balanca"
    },
    "featured": false
  },
  {
    "title": "O Petróleo É Nosso",
    "slug": "o-petroleo-e-nosso-1954",
    "synopsis": "Filme brasileiro de 1954.",
    "year": 1954,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/filme-o-petroleo-e-nosso-1954-completo-480-p",
    "source": {
      "provider": "archive",
      "id": "filme-o-petroleo-e-nosso-1954-completo-480-p"
    },
    "featured": false
  },
  {
    "title": "Romance Proibido",
    "slug": "romance-proibido-1944",
    "synopsis": "Filme brasileiro de 1944.",
    "year": 1944,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/romance-proibido-1944-360-p",
    "source": {
      "provider": "archive",
      "id": "romance-proibido-1944-360-p"
    },
    "featured": false
  },
  {
    "title": "O Saci",
    "slug": "o-saci-1953",
    "synopsis": "Filme brasileiro de 1953.",
    "year": 1953,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/o-saci-1953",
    "source": {
      "provider": "archive",
      "id": "o-saci-1953"
    },
    "featured": false
  },
  {
    "title": "Sinfonia Amazônica",
    "slug": "sinfonia-amazonica-1953",
    "synopsis": "Sinfonia Amazônica é o primeiro longa-metragem de animação da história do Brasil, lançado em 1953. (resumo: Wikipedia, CC BY-SA)",
    "year": 1953,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "posterUrl": "https://upload.wikimedia.org/wikipedia/pt/e/e7/Sinfonia_Amaz%C3%B4nica.jpg?utm_source=pt.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "backdropUrl": "https://archive.org/services/img/sinfoniaamazonicaaneliolatinifilho1953",
    "source": {
      "provider": "archive",
      "id": "sinfoniaamazonicaaneliolatinifilho1953"
    },
    "featured": false
  },
  {
    "title": "Sinhá Moça",
    "slug": "sinha-moca-1953",
    "synopsis": "Sinhá Moça é um filme brasileiro de 1953, do gênero drama histórico, dirigido pelo britânico Tom Payne para a Companhia Cinematográfica Vera Cruz. (resumo: Wikipedia, CC BY-SA)",
    "year": 1953,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "posterUrl": "https://upload.wikimedia.org/wikipedia/pt/8/84/Sinha_Moca_CN_0270A.jpg?utm_source=pt.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "backdropUrl": "https://archive.org/services/img/sinha-moca-filme-1953",
    "source": {
      "provider": "archive",
      "id": "sinha-moca-filme-1953"
    },
    "featured": false
  },
  {
    "title": "Rio, 40 Graus",
    "slug": "rio-40-graus-1955",
    "synopsis": "Rio, 40 graus é um filme brasileiro de 1955, com roteiro e direção de Nelson Pereira dos Santos. (resumo: Wikipedia, CC BY-SA)",
    "year": 1955,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "posterUrl": "https://upload.wikimedia.org/wikipedia/pt/8/89/Rio_40_Graus.png?utm_source=pt.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
    "backdropUrl": "https://archive.org/services/img/10701671631416",
    "source": {
      "provider": "archive",
      "id": "10701671631416"
    },
    "featured": false
  },
  {
    "title": "Também Somos Irmãos",
    "slug": "tambem-somos-irmaos-1949",
    "synopsis": "Também Somos Irmãos é um filme brasileiro de drama de 1949, dirigido por José Carlos Burle e escrito por Alinor Azevedo. (resumo: Wikipedia, CC BY-SA)",
    "year": 1949,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/tambem-somos-irmaos-1949",
    "source": {
      "provider": "archive",
      "id": "tambem-somos-irmaos-1949"
    },
    "featured": false
  },
  {
    "title": "O Samba da Vida",
    "slug": "o-samba-da-vida-1937",
    "synopsis": "Filme brasileiro de 1937.",
    "year": 1937,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/O.samba-da-vida-filme-de-luiz-de-barros-1937-480-p",
    "source": {
      "provider": "archive",
      "id": "O.samba-da-vida-filme-de-luiz-de-barros-1937-480-p"
    },
    "featured": false
  },
  {
    "title": "Terra É Sempre Terra",
    "slug": "terra-e-sempre-terra-1951",
    "synopsis": "Filme brasileiro de 1951.",
    "year": 1951,
    "genres": [
      "Nacionais",
      "Clássico"
    ],
    "backdropUrl": "https://archive.org/services/img/terra-e-sempre-terra-1951_202602",
    "source": {
      "provider": "archive",
      "id": "terra-e-sempre-terra-1951_202602"
    },
    "featured": false
  }
];
