// Vigésima leva — reavaliação pontual do backlog em
// novos-filmes-encontrados.csv que tinha ficado de fora das levas anteriores
// por "identifier inválido" (timeout/URL quebrada na época) ou por um corte
// de ano genérico demais ("ano acima do corte de domínio-público provável").
// Desta vez cada candidato foi checado individualmente por estúdio/produtora
// (não só pela idade): aceitos apenas os de estúdios poverty row confirmados
// (Grand National, RKO via produtora independente Stephens-Lang), produção
// federal norte-americana (NASA, obra do governo dos EUA, domínio público por
// lei), e independentes bem documentados como não-renovados (Circle
// Productions/Embassy Pictures, Werewolf Productions, Barry Mahon
// Enterprises). A grande maioria do backlog revisado (as demais dezenas de
// linhas com "identifier inválido" ou "precisa checagem manual") continuou
// descartada: a maior parte tinha o vídeo removido do archive.org, era de
// estúdio/rede de TV ainda ativo (Aaron Spelling Productions, ABC Movie of
// the Week), ou era coprodução europeia/asiática pré-1978 com risco real de
// restauração de copyright pela URAA/GATT de 1996 (ex.: coproduções
// ítalo-espanholas e japonesas de ficção científica dos anos 60/70) — ver
// motivo atualizado de cada linha em novos-filmes-encontrados.csv.

module.exports = [
  {
    "title": "Paradise Express",
    "slug": "paradise-express-1937",
    "synopsis": "Aventura B de 1937 sobre uma disputa em torno de um trem batizado \"Paradise Express\", produzida pela Nat Levine Productions e distribuída pela Grand National Pictures.",
    "year": 1937,
    "genres": [
      "Aventura",
      "Clássico"
    ],
    "runtimeMinutes": 53,
    "backdropUrl": "https://archive.org/services/img/paradise_express",
    "source": {
      "provider": "archive",
      "id": "paradise_express"
    },
    "featured": false
  },
  {
    "title": "Bank Alarm",
    "slug": "bank-alarm-1937",
    "synopsis": "Policial B de 1937 sobre um investigador que tenta desmontar uma quadrilha de assaltantes de banco, arriscando a vida da própria irmã, namorada do líder do grupo. Produção independente de George A. Hirliman distribuída pela Grand National Pictures.",
    "year": 1937,
    "genres": [
      "Suspense",
      "Clássico"
    ],
    "runtimeMinutes": 61,
    "backdropUrl": "https://archive.org/services/img/bank_alarm_ipod",
    "source": {
      "provider": "archive",
      "id": "bank_alarm_ipod"
    },
    "featured": false
  },
  {
    "title": "Dr. Christian Meets the Women",
    "slug": "dr-christian-meets-the-women-1940",
    "synopsis": "Comédia dramática de 1940, parte da série B \"Dr. Christian\" sobre um médico bondoso numa pequena cidade americana. Produção independente da Stephens-Lang Productions, distribuída pela RKO.",
    "year": 1940,
    "genres": [
      "Drama",
      "Comédia",
      "Clássico"
    ],
    "runtimeMinutes": 66,
    "backdropUrl": "https://archive.org/services/img/dr_christian_meets_the_women",
    "source": {
      "provider": "archive",
      "id": "dr_christian_meets_the_women"
    },
    "featured": false
  },
  {
    "title": "Jesse James Meets Frankenstein's Daughter",
    "slug": "jesse-james-meets-frankensteins-daughter-1966",
    "synopsis": "Faroeste com toques de ficção científica e terror, de 1966: o pistoleiro Jesse James se envolve com a neta do Dr. Frankenstein, que segue os experimentos macabros do avô no Velho Oeste. Produção independente da Circle Productions, distribuída pela Embassy Pictures.",
    "year": 1966,
    "director": "William Beaudine",
    "genres": [
      "Faroeste",
      "Terror",
      "Ficção Científica",
      "Clássico"
    ],
    "runtimeMinutes": 83,
    "backdropUrl": "https://archive.org/services/img/jesse-james-meets-frankensteins-daughter-1966",
    "source": {
      "provider": "archive",
      "id": "jesse-james-meets-frankensteins-daughter-1966"
    },
    "featured": false
  },
  {
    "title": "Grave of the Vampire",
    "slug": "grave-of-the-vampire-1974",
    "synopsis": "Terror independente de 1974 sobre um vampiro que sobrevive a uma sentença de morte e, décadas depois, persegue o filho gerado à força numa vítima. Produção da Werewolf Productions, circulada sem renovação de direitos autorais.",
    "year": 1974,
    "genres": [
      "Terror",
      "Clássico"
    ],
    "runtimeMinutes": 90,
    "backdropUrl": "https://archive.org/services/img/Grave_of_the_Vampire_movie",
    "source": {
      "provider": "archive",
      "id": "Grave_of_the_Vampire_movie"
    },
    "featured": false
  },
  {
    "title": "Santa and the Three Bears",
    "slug": "santa-and-the-three-bears-1970",
    "synopsis": "Animação familiar independente de 1970 sobre dois filhotes de urso que querem saber se o Papai Noel existe, enquanto o pai tenta convencê-los a hibernar. Produção de Barry Mahon Enterprises.",
    "year": 1970,
    "genres": [
      "Animação",
      "Clássico"
    ],
    "runtimeMinutes": 46,
    "backdropUrl": "https://archive.org/services/img/SantaandtheThreeBears",
    "source": {
      "provider": "archive",
      "id": "SantaandtheThreeBears"
    },
    "featured": false
  },
  {
    "title": "Apollo 13: Houston, We've Got a Problem",
    "slug": "apollo-13-houston-weve-got-a-problem-1972",
    "synopsis": "Documentário governamental de 1972 sobre a missão Apollo 13 e o resgate da tripulação após a explosão de um tanque de oxigênio a caminho da Lua. Produção da NASA, obra do governo dos EUA.",
    "year": 1972,
    "genres": [
      "Documentário",
      "Clássico"
    ],
    "runtimeMinutes": 28,
    "backdropUrl": "https://archive.org/services/img/HoustonWeveGotAProblem",
    "source": {
      "provider": "archive",
      "id": "HoustonWeveGotAProblem"
    },
    "featured": false
  },
  {
    "title": "Within This Decade: America in Space",
    "slug": "within-this-decade-america-in-space-1969",
    "synopsis": "Documentário governamental de 1969 sobre a corrida espacial americana ao longo dos anos 1960. Produção da NASA, obra do governo dos EUA.",
    "year": 1969,
    "genres": [
      "Documentário",
      "Clássico"
    ],
    "runtimeMinutes": 28,
    "backdropUrl": "https://archive.org/services/img/WithinThisDecade",
    "source": {
      "provider": "archive",
      "id": "WithinThisDecade"
    },
    "featured": false
  }
];
