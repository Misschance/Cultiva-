// Arquivo gerado por scripts/gerar-catalogo.ts a partir de data/base-plantas/. Não edite à mão.
import type { Especie, PlantaDeCasa } from './tipos';

export const CATALOGO: readonly Especie[] = [
  {
    "id": "alface",
    "nomePopular": "Alface",
    "nomeCientifico": "Lactuca sativa",
    "grupo": "folhosa",
    "propagacao": "muda (sementeira e transplante)",
    "germinacaoDias": {
      "min": 4,
      "max": 7
    },
    "colheitaInicioDias": {
      "min": 60,
      "max": 90
    },
    "regaAdultaIntervaloDias": {
      "min": 1,
      "max": 1
    },
    "luzHorasMin": 5,
    "localIdeal": "sol pleno ou meia-sombra",
    "dicaAcessivel": "Use cultivar de verão na época quente. Colha antes de soltar o pendão, senão amarga.",
    "pontoColheita": null,
    "fases": [
      {
        "ordem": 1,
        "nome": "germinação",
        "diaInicio": 0,
        "diaFim": 7,
        "rega": "Manter a terra sempre úmida; regar 2 vezes ao dia, ao amanhecer e no fim da tarde (R3 p.27).",
        "adubacao": "Nenhuma.",
        "intervencoes": "Cobrir sementes com 0,5 a 1,5 cm de terra peneirada (R3 p.27).",
        "fonte": "germinação 4-7 dias: R7 (C)",
        "confianca": "C"
      },
      {
        "ordem": 2,
        "nome": "muda",
        "diaInicio": 7,
        "diaFim": 35,
        "rega": "1 a 2 vezes ao dia (R3 p.27).",
        "adubacao": "Nenhuma até o transplante.",
        "intervencoes": "Transplantar com 4-6 folhas e 8-10 cm, 25-35 dias após semear, no fim da tarde, e regar (R1 p.8-9).",
        "fonte": "R1",
        "confianca": "A"
      },
      {
        "ordem": 3,
        "nome": "vegetativo",
        "diaInicio": 35,
        "diaFim": 60,
        "rega": "Quase todo dia, de manhã cedo ou fim da tarde. Canteiro: 4 a 10 L/m² aplicados devagar (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C).",
        "adubacao": "Cobertura aos 20-30 dias após germinar ou transplantar: 10 a 20 g por planta (ou 20 g/m²) de sulfato de amônio ou NPK 20-5-20 aos 20 a 30 dias, ou 2 kg/m² de esterco/composto (R1 p.10).",
        "intervencoes": "Tirar mato.",
        "fonte": "R1, R3",
        "confianca": "A"
      },
      {
        "ordem": 4,
        "nome": "colheita",
        "diaInicio": 60,
        "diaFim": 90,
        "rega": "Quase todo dia, de manhã cedo ou fim da tarde. Canteiro: 4 a 10 L/m² aplicados devagar (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C).",
        "adubacao": "Seguir cobertura parcelada em plantas de colheita longa (R1 p.10).",
        "intervencoes": "Colher no ponto: R1 Tab.1 (verão: 60-80)",
        "fonte": "R1 Tab.1 (verão: 60-80)",
        "confianca": "A"
      }
    ],
    "epocas": [
      {
        "variedade": "inverno",
        "regiao": "Sul",
        "mesInicio": 2,
        "mesFim": 10,
        "recomendado": true
      },
      {
        "variedade": "inverno",
        "regiao": "Sudeste",
        "mesInicio": 2,
        "mesFim": 7,
        "recomendado": true
      },
      {
        "variedade": "inverno",
        "regiao": "Nordeste",
        "mesInicio": 3,
        "mesFim": 9,
        "recomendado": true
      },
      {
        "variedade": "inverno",
        "regiao": "Centro-Oeste",
        "mesInicio": 3,
        "mesFim": 9,
        "recomendado": true
      },
      {
        "variedade": "inverno",
        "regiao": "Norte",
        "mesInicio": 3,
        "mesFim": 7,
        "recomendado": true
      },
      {
        "variedade": "verão",
        "regiao": "Sul",
        "mesInicio": 1,
        "mesFim": 12,
        "recomendado": true
      },
      {
        "variedade": "verão",
        "regiao": "Sudeste",
        "mesInicio": 1,
        "mesFim": 12,
        "recomendado": true
      },
      {
        "variedade": "verão",
        "regiao": "Nordeste",
        "mesInicio": 1,
        "mesFim": 12,
        "recomendado": true
      },
      {
        "variedade": "verão",
        "regiao": "Centro-Oeste",
        "mesInicio": 1,
        "mesFim": 12,
        "recomendado": true
      },
      {
        "variedade": "verão",
        "regiao": "Norte",
        "mesInicio": 1,
        "mesFim": 12,
        "recomendado": true
      }
    ]
  },
  {
    "id": "rucula",
    "nomePopular": "Rúcula",
    "nomeCientifico": "Eruca sativa",
    "grupo": "folhosa",
    "propagacao": "semeadura direta em linha",
    "germinacaoDias": {
      "min": 4,
      "max": 7
    },
    "colheitaInicioDias": {
      "min": 40,
      "max": 60
    },
    "regaAdultaIntervaloDias": {
      "min": 1,
      "max": 1
    },
    "luzHorasMin": 5,
    "localIdeal": "sol pleno ou meia-sombra",
    "dicaAcessivel": "Semeie direto no vaso e desbaste deixando 15 cm entre plantas.",
    "pontoColheita": null,
    "fases": [
      {
        "ordem": 1,
        "nome": "germinação",
        "diaInicio": 0,
        "diaFim": 7,
        "rega": "Manter a terra sempre úmida; regar 2 vezes ao dia, ao amanhecer e no fim da tarde (R3 p.27).",
        "adubacao": "Nenhuma.",
        "intervencoes": "Cobrir sementes com 0,5 a 1,5 cm de terra peneirada (R3 p.27).",
        "fonte": "germinação 4-7 dias: R7 (C)",
        "confianca": "C"
      },
      {
        "ordem": 2,
        "nome": "vegetativo",
        "diaInicio": 7,
        "diaFim": 40,
        "rega": "Quase todo dia, de manhã cedo ou fim da tarde. Canteiro: 4 a 10 L/m² aplicados devagar (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C).",
        "adubacao": "Cobertura aos 20-30 dias após germinar ou transplantar: 10 a 20 g por planta (ou 20 g/m²) de sulfato de amônio ou NPK 20-5-20 aos 20 a 30 dias, ou 2 kg/m² de esterco/composto (R1 p.10).",
        "intervencoes": "Desbastar 20 a 35 dias após semear, deixando o espaçamento final (R1 p.9). Tirar mato.",
        "fonte": "R1, R3",
        "confianca": "A"
      },
      {
        "ordem": 3,
        "nome": "colheita",
        "diaInicio": 40,
        "diaFim": 60,
        "rega": "Quase todo dia, de manhã cedo ou fim da tarde. Canteiro: 4 a 10 L/m² aplicados devagar (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C).",
        "adubacao": "Seguir cobertura parcelada em plantas de colheita longa (R1 p.10).",
        "intervencoes": "Colher no ponto: R2 Tab.8",
        "fonte": "R2 Tab.8",
        "confianca": "B"
      }
    ],
    "epocas": [
      {
        "variedade": null,
        "regiao": "Sul",
        "mesInicio": 3,
        "mesFim": 8,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Sudeste",
        "mesInicio": 3,
        "mesFim": 8,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Nordeste",
        "mesInicio": 3,
        "mesFim": 7,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Centro-Oeste",
        "mesInicio": 3,
        "mesFim": 7,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Norte",
        "mesInicio": null,
        "mesFim": null,
        "recomendado": false
      }
    ]
  },
  {
    "id": "couve",
    "nomePopular": "Couve-manteiga",
    "nomeCientifico": "Brassica oleracea var. acephala",
    "grupo": "folhosa",
    "propagacao": "muda de semente ou brotação lateral",
    "germinacaoDias": {
      "min": 5,
      "max": 10
    },
    "colheitaInicioDias": {
      "min": 70,
      "max": 90
    },
    "regaAdultaIntervaloDias": {
      "min": 1,
      "max": 1
    },
    "luzHorasMin": 5,
    "localIdeal": "sol pleno",
    "dicaAcessivel": "Colha as folhas de baixo para cima; a planta produz por meses. Pode ser feita de broto lateral (R3 p.36).",
    "pontoColheita": null,
    "fases": [
      {
        "ordem": 1,
        "nome": "germinação",
        "diaInicio": 0,
        "diaFim": 10,
        "rega": "Manter a terra sempre úmida; regar 2 vezes ao dia, ao amanhecer e no fim da tarde (R3 p.27).",
        "adubacao": "Nenhuma.",
        "intervencoes": "Cobrir sementes com 0,5 a 1,5 cm de terra peneirada (R3 p.27).",
        "fonte": "germinação 5-10 dias: R7 (C)",
        "confianca": "C"
      },
      {
        "ordem": 2,
        "nome": "muda",
        "diaInicio": 10,
        "diaFim": 35,
        "rega": "1 a 2 vezes ao dia (R3 p.27).",
        "adubacao": "Nenhuma até o transplante.",
        "intervencoes": "Transplantar com 4-6 folhas e 8-10 cm, 25-35 dias após semear, no fim da tarde, e regar (R1 p.8-9).",
        "fonte": "R1",
        "confianca": "A"
      },
      {
        "ordem": 3,
        "nome": "vegetativo",
        "diaInicio": 35,
        "diaFim": 70,
        "rega": "Quase todo dia, de manhã cedo ou fim da tarde. Canteiro: 4 a 10 L/m² aplicados devagar (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C).",
        "adubacao": "Cobertura aos 20-30 dias após germinar ou transplantar: 10 a 20 g por planta (ou 20 g/m²) de sulfato de amônio ou NPK 20-5-20 aos 20 a 30 dias, ou 2 kg/m² de esterco/composto (R1 p.10); dividir em 2 a 3 aplicações (R1 p.10).",
        "intervencoes": "Tirar mato.",
        "fonte": "R1, R3",
        "confianca": "A"
      },
      {
        "ordem": 4,
        "nome": "colheita",
        "diaInicio": 70,
        "diaFim": 90,
        "rega": "Quase todo dia, de manhã cedo ou fim da tarde. Canteiro: 4 a 10 L/m² aplicados devagar (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C).",
        "adubacao": "Seguir cobertura parcelada em plantas de colheita longa (R1 p.10).",
        "intervencoes": "Colher no ponto: R1 Tab.1",
        "fonte": "R1 Tab.1",
        "confianca": "A"
      }
    ],
    "epocas": [
      {
        "variedade": null,
        "regiao": "Sul",
        "mesInicio": 2,
        "mesFim": 7,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Sudeste",
        "mesInicio": 2,
        "mesFim": 7,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Nordeste",
        "mesInicio": 4,
        "mesFim": 8,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Centro-Oeste",
        "mesInicio": 2,
        "mesFim": 7,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Norte",
        "mesInicio": 4,
        "mesFim": 7,
        "recomendado": true
      }
    ]
  },
  {
    "id": "tomate",
    "nomePopular": "Tomate (inclui cereja)",
    "nomeCientifico": "Solanum lycopersicum",
    "grupo": "fruto",
    "propagacao": "muda, transplante aos 25 dias com 4-5 folhas (R4 p.13)",
    "germinacaoDias": {
      "min": 5,
      "max": 14
    },
    "colheitaInicioDias": {
      "min": 90,
      "max": 100
    },
    "regaAdultaIntervaloDias": {
      "min": 2,
      "max": 3
    },
    "luzHorasMin": 5,
    "localIdeal": "sol pleno",
    "dicaAcessivel": "Amarre a planta num tutor quando tiver 30 cm e tire os brotos laterais de 2 a 5 cm (R4 p.14).",
    "pontoColheita": {
      "texto": "Colher os frutos maduros ou quase maduros.",
      "fonte": "R1 p.15",
      "confianca": "A"
    },
    "fases": [
      {
        "ordem": 1,
        "nome": "germinação",
        "diaInicio": 0,
        "diaFim": 14,
        "rega": "Manter a terra sempre úmida; regar 2 vezes ao dia, ao amanhecer e no fim da tarde (R3 p.27).",
        "adubacao": "Nenhuma.",
        "intervencoes": "Cobrir sementes com 0,5 a 1,5 cm de terra peneirada (R3 p.27).",
        "fonte": "germinação 5-14 dias: R7 (C)",
        "confianca": "C"
      },
      {
        "ordem": 2,
        "nome": "muda",
        "diaInicio": 14,
        "diaFim": 35,
        "rega": "1 a 2 vezes ao dia (R3 p.27).",
        "adubacao": "Nenhuma até o transplante.",
        "intervencoes": "Transplantar com 4-6 folhas e 8-10 cm, 25-35 dias após semear, no fim da tarde, e regar (R1 p.8-9).",
        "fonte": "R1",
        "confianca": "A"
      },
      {
        "ordem": 3,
        "nome": "vegetativo",
        "diaInicio": 35,
        "diaFim": 90,
        "rega": "A cada 2 a 3 dias na planta adulta; quase todo dia no início. Canteiro: 4 a 10 L/m²; cova: 3 a 5 L (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C). Molhar só o pé, nunca as folhas (R4 p.13).",
        "adubacao": "Cobertura aos 20-30 dias após germinar ou transplantar: 1 kg de esterco curtido por cova no plantio e 300 g de vermicomposto por planta aos 20 dias (R4 p.13). 10 a 20 g por planta (ou 20 g/m²) de sulfato de amônio ou NPK 20-5-20 aos 20 a 30 dias, ou 2 kg/m² de esterco/composto (R1 p.10); dividir em 2 a 3 aplicações (R1 p.10).",
        "intervencoes": "Tirar mato; tutorar quando tiver 30 cm e desbrotar (R4 p.14).",
        "fonte": "R1, R3",
        "confianca": "A"
      },
      {
        "ordem": 4,
        "nome": "colheita",
        "diaInicio": 90,
        "diaFim": 100,
        "rega": "A cada 2 a 3 dias na planta adulta; quase todo dia no início. Canteiro: 4 a 10 L/m²; cova: 3 a 5 L (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C). Molhar só o pé, nunca as folhas (R4 p.13).",
        "adubacao": "Seguir cobertura parcelada em plantas de colheita longa (R1 p.10).",
        "intervencoes": "Ponto de colheita: Colher os frutos maduros ou quase maduros. (R1 p.15)",
        "fonte": "R1 Tab.1",
        "confianca": "A"
      }
    ],
    "epocas": [
      {
        "variedade": "mesa",
        "regiao": "Sul",
        "mesInicio": 1,
        "mesFim": 12,
        "recomendado": true
      },
      {
        "variedade": "mesa",
        "regiao": "Sudeste",
        "mesInicio": 1,
        "mesFim": 12,
        "recomendado": true
      },
      {
        "variedade": "mesa",
        "regiao": "Nordeste",
        "mesInicio": 1,
        "mesFim": 12,
        "recomendado": true
      },
      {
        "variedade": "mesa",
        "regiao": "Centro-Oeste",
        "mesInicio": 1,
        "mesFim": 12,
        "recomendado": true
      },
      {
        "variedade": "mesa",
        "regiao": "Norte",
        "mesInicio": 1,
        "mesFim": 12,
        "recomendado": true
      }
    ]
  },
  {
    "id": "pimenta",
    "nomePopular": "Pimenta",
    "nomeCientifico": "Capsicum spp.",
    "grupo": "fruto",
    "propagacao": "muda",
    "germinacaoDias": {
      "min": 7,
      "max": 14
    },
    "colheitaInicioDias": {
      "min": 100,
      "max": 120
    },
    "regaAdultaIntervaloDias": {
      "min": 2,
      "max": 3
    },
    "luzHorasMin": 5,
    "localIdeal": "sol pleno",
    "dicaAcessivel": "Boa para vaso grande ao sol. Colha os frutos maduros para estimular novos.",
    "pontoColheita": null,
    "fases": [
      {
        "ordem": 1,
        "nome": "germinação",
        "diaInicio": 0,
        "diaFim": 14,
        "rega": "Manter a terra sempre úmida; regar 2 vezes ao dia, ao amanhecer e no fim da tarde (R3 p.27).",
        "adubacao": "Nenhuma.",
        "intervencoes": "Cobrir sementes com 0,5 a 1,5 cm de terra peneirada (R3 p.27).",
        "fonte": "germinação 7-14 dias: R7 (C)",
        "confianca": "C"
      },
      {
        "ordem": 2,
        "nome": "muda",
        "diaInicio": 14,
        "diaFim": 35,
        "rega": "1 a 2 vezes ao dia (R3 p.27).",
        "adubacao": "Nenhuma até o transplante.",
        "intervencoes": "Transplantar com 4-6 folhas e 8-10 cm, 25-35 dias após semear, no fim da tarde, e regar (R1 p.8-9).",
        "fonte": "R1",
        "confianca": "A"
      },
      {
        "ordem": 3,
        "nome": "vegetativo",
        "diaInicio": 35,
        "diaFim": 100,
        "rega": "A cada 2 a 3 dias na planta adulta; quase todo dia no início. Canteiro: 4 a 10 L/m²; cova: 3 a 5 L (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C).",
        "adubacao": "Cobertura aos 20-30 dias após germinar ou transplantar: 10 a 20 g por planta (ou 20 g/m²) de sulfato de amônio ou NPK 20-5-20 aos 20 a 30 dias, ou 2 kg/m² de esterco/composto (R1 p.10).",
        "intervencoes": "Tirar mato.",
        "fonte": "R1, R3",
        "confianca": "A"
      },
      {
        "ordem": 4,
        "nome": "colheita",
        "diaInicio": 100,
        "diaFim": 120,
        "rega": "A cada 2 a 3 dias na planta adulta; quase todo dia no início. Canteiro: 4 a 10 L/m²; cova: 3 a 5 L (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C).",
        "adubacao": "Seguir cobertura parcelada em plantas de colheita longa (R1 p.10).",
        "intervencoes": "Colher no ponto: R1 Tab.1",
        "fonte": "R1 Tab.1",
        "confianca": "A"
      }
    ],
    "epocas": [
      {
        "variedade": null,
        "regiao": "Sul",
        "mesInicio": 9,
        "mesFim": 2,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Sudeste",
        "mesInicio": 8,
        "mesFim": 3,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Nordeste",
        "mesInicio": 1,
        "mesFim": 12,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Centro-Oeste",
        "mesInicio": 8,
        "mesFim": 12,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Norte",
        "mesInicio": 7,
        "mesFim": 12,
        "recomendado": true
      }
    ]
  },
  {
    "id": "cenoura",
    "nomePopular": "Cenoura",
    "nomeCientifico": "Daucus carota",
    "grupo": "raiz",
    "propagacao": "semeadura direta; não aceita transplante (R3 p.36)",
    "germinacaoDias": {
      "min": 7,
      "max": 14
    },
    "colheitaInicioDias": {
      "min": 90,
      "max": 110
    },
    "regaAdultaIntervaloDias": {
      "min": 2,
      "max": 3
    },
    "luzHorasMin": 5,
    "localIdeal": "sol pleno",
    "dicaAcessivel": "Precisa de vaso fundo e terra solta, sem pedras. Desbaste aos 20-35 dias (R1 p.9).",
    "pontoColheita": {
      "texto": "Colher quando a raiz estiver bem desenvolvida, antes de ficar fibrosa e antes de a planta pendoar (soltar a haste de flor).",
      "fonte": "R1 p.15",
      "confianca": "A"
    },
    "fases": [
      {
        "ordem": 1,
        "nome": "germinação",
        "diaInicio": 0,
        "diaFim": 14,
        "rega": "Manter a terra sempre úmida; regar 2 vezes ao dia, ao amanhecer e no fim da tarde (R3 p.27).",
        "adubacao": "Nenhuma.",
        "intervencoes": "Cobrir sementes com 0,5 a 1,5 cm de terra peneirada (R3 p.27).",
        "fonte": "germinação 7-14 dias: R7 (C)",
        "confianca": "C"
      },
      {
        "ordem": 2,
        "nome": "vegetativo",
        "diaInicio": 14,
        "diaFim": 90,
        "rega": "A cada 2 a 3 dias na planta adulta; quase todo dia no início. Canteiro: 4 a 10 L/m²; cova: 3 a 5 L (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C).",
        "adubacao": "Cobertura aos 20-30 dias após germinar ou transplantar: 10 a 20 g por planta (ou 20 g/m²) de sulfato de amônio ou NPK 20-5-20 aos 20 a 30 dias, ou 2 kg/m² de esterco/composto (R1 p.10).",
        "intervencoes": "Desbastar 20 a 35 dias após semear, deixando o espaçamento final (R1 p.9). Tirar mato.",
        "fonte": "R1, R3",
        "confianca": "A"
      },
      {
        "ordem": 3,
        "nome": "colheita",
        "diaInicio": 90,
        "diaFim": 110,
        "rega": "A cada 2 a 3 dias na planta adulta; quase todo dia no início. Canteiro: 4 a 10 L/m²; cova: 3 a 5 L (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C).",
        "adubacao": "Seguir cobertura parcelada em plantas de colheita longa (R1 p.10).",
        "intervencoes": "Ponto de colheita: Colher quando a raiz estiver bem desenvolvida, antes de ficar fibrosa e antes de a planta pendoar (soltar a haste de flor). (R1 p.15)",
        "fonte": "R1 Tab.1",
        "confianca": "A"
      }
    ],
    "epocas": [
      {
        "variedade": "inverno",
        "regiao": "Sul",
        "mesInicio": 2,
        "mesFim": 8,
        "recomendado": true
      },
      {
        "variedade": "inverno",
        "regiao": "Sudeste",
        "mesInicio": 3,
        "mesFim": 7,
        "recomendado": true
      },
      {
        "variedade": "inverno",
        "regiao": "Nordeste",
        "mesInicio": null,
        "mesFim": null,
        "recomendado": false
      },
      {
        "variedade": "inverno",
        "regiao": "Centro-Oeste",
        "mesInicio": 4,
        "mesFim": 7,
        "recomendado": true
      },
      {
        "variedade": "inverno",
        "regiao": "Norte",
        "mesInicio": null,
        "mesFim": null,
        "recomendado": false
      },
      {
        "variedade": "verão",
        "regiao": "Sul",
        "mesInicio": 11,
        "mesFim": 1,
        "recomendado": true
      },
      {
        "variedade": "verão",
        "regiao": "Sudeste",
        "mesInicio": 10,
        "mesFim": 3,
        "recomendado": true
      },
      {
        "variedade": "verão",
        "regiao": "Nordeste",
        "mesInicio": 10,
        "mesFim": 3,
        "recomendado": true
      },
      {
        "variedade": "verão",
        "regiao": "Centro-Oeste",
        "mesInicio": 10,
        "mesFim": 3,
        "recomendado": true
      },
      {
        "variedade": "verão",
        "regiao": "Norte",
        "mesInicio": 10,
        "mesFim": 3,
        "recomendado": true
      }
    ]
  },
  {
    "id": "rabanete",
    "nomePopular": "Rabanete",
    "nomeCientifico": "Raphanus sativus",
    "grupo": "raiz",
    "propagacao": "semeadura direta em sulco; não transplantar (R3 p.36)",
    "germinacaoDias": {
      "min": 4,
      "max": 10
    },
    "colheitaInicioDias": {
      "min": 30,
      "max": 35
    },
    "regaAdultaIntervaloDias": {
      "min": 2,
      "max": 3
    },
    "luzHorasMin": 5,
    "localIdeal": "sol pleno",
    "dicaAcessivel": "O mais rápido da horta: colha em cerca de um mês. Desbaste quando tiver 5 cm (R3 p.36).",
    "pontoColheita": {
      "texto": "Colher quando a raiz estiver bem desenvolvida, antes de ficar fibrosa e antes de pendoar; em geral 25 a 30 dias após semear.",
      "fonte": "R1 p.15",
      "confianca": "A"
    },
    "fases": [
      {
        "ordem": 1,
        "nome": "germinação",
        "diaInicio": 0,
        "diaFim": 10,
        "rega": "Manter a terra sempre úmida; regar 2 vezes ao dia, ao amanhecer e no fim da tarde (R3 p.27).",
        "adubacao": "Nenhuma.",
        "intervencoes": "Cobrir sementes com 0,5 a 1,5 cm de terra peneirada (R3 p.27).",
        "fonte": "germinação 4-10 dias: R7 (C)",
        "confianca": "C"
      },
      {
        "ordem": 2,
        "nome": "vegetativo",
        "diaInicio": 10,
        "diaFim": 30,
        "rega": "A cada 2 a 3 dias na planta adulta; quase todo dia no início. Canteiro: 4 a 10 L/m²; cova: 3 a 5 L (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C).",
        "adubacao": "Cobertura aos 20-30 dias após germinar ou transplantar: 10 a 20 g por planta (ou 20 g/m²) de sulfato de amônio ou NPK 20-5-20 aos 20 a 30 dias, ou 2 kg/m² de esterco/composto (R1 p.10).",
        "intervencoes": "Desbastar quando as plantinhas tiverem 5 cm de altura (R3 p.36). Tirar mato.",
        "fonte": "R1, R3",
        "confianca": "A"
      },
      {
        "ordem": 3,
        "nome": "colheita",
        "diaInicio": 30,
        "diaFim": 35,
        "rega": "A cada 2 a 3 dias na planta adulta; quase todo dia no início. Canteiro: 4 a 10 L/m²; cova: 3 a 5 L (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C).",
        "adubacao": "Seguir cobertura parcelada em plantas de colheita longa (R1 p.10).",
        "intervencoes": "Ponto de colheita: Colher quando a raiz estiver bem desenvolvida, antes de ficar fibrosa e antes de pendoar; em geral 25 a 30 dias após semear. (R1 p.15)",
        "fonte": "R1 Tab.1 (R2: 25-30)",
        "confianca": "A"
      }
    ],
    "epocas": [
      {
        "variedade": null,
        "regiao": "Sul",
        "mesInicio": 3,
        "mesFim": 8,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Sudeste",
        "mesInicio": 3,
        "mesFim": 8,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Nordeste",
        "mesInicio": 3,
        "mesFim": 7,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Centro-Oeste",
        "mesInicio": 4,
        "mesFim": 9,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Norte",
        "mesInicio": 3,
        "mesFim": 8,
        "recomendado": true
      }
    ]
  },
  {
    "id": "cebolinha",
    "nomePopular": "Cebolinha",
    "nomeCientifico": "Allium fistulosum",
    "grupo": "condimento",
    "propagacao": "muda ou divisão de touceira",
    "germinacaoDias": {
      "min": 6,
      "max": 12
    },
    "colheitaInicioDias": {
      "min": 70,
      "max": 90
    },
    "regaAdultaIntervaloDias": {
      "min": 1,
      "max": 1
    },
    "luzHorasMin": 5,
    "localIdeal": "sol pleno ou meia-sombra",
    "dicaAcessivel": "Corte as folhas a uns 3 cm do chão que ela rebrota.",
    "pontoColheita": null,
    "fases": [
      {
        "ordem": 1,
        "nome": "germinação",
        "diaInicio": 0,
        "diaFim": 12,
        "rega": "Manter a terra sempre úmida; regar 2 vezes ao dia, ao amanhecer e no fim da tarde (R3 p.27).",
        "adubacao": "Nenhuma.",
        "intervencoes": "Cobrir sementes com 0,5 a 1,5 cm de terra peneirada (R3 p.27).",
        "fonte": "germinação 6-12 dias: R7 (C)",
        "confianca": "C"
      },
      {
        "ordem": 2,
        "nome": "muda",
        "diaInicio": 12,
        "diaFim": 35,
        "rega": "1 a 2 vezes ao dia (R3 p.27).",
        "adubacao": "Nenhuma até o transplante.",
        "intervencoes": "Transplantar com 4-6 folhas e 8-10 cm, 25-35 dias após semear, no fim da tarde, e regar (R1 p.8-9).",
        "fonte": "R1",
        "confianca": "A"
      },
      {
        "ordem": 3,
        "nome": "vegetativo",
        "diaInicio": 35,
        "diaFim": 70,
        "rega": "Quase todo dia, de manhã cedo ou fim da tarde. Canteiro: 4 a 10 L/m² aplicados devagar (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C).",
        "adubacao": "Cobertura aos 20-30 dias após germinar ou transplantar: 10 a 20 g por planta (ou 20 g/m²) de sulfato de amônio ou NPK 20-5-20 aos 20 a 30 dias, ou 2 kg/m² de esterco/composto (R1 p.10).",
        "intervencoes": "Tirar mato.",
        "fonte": "R1, R3",
        "confianca": "A"
      },
      {
        "ordem": 4,
        "nome": "colheita",
        "diaInicio": 70,
        "diaFim": 90,
        "rega": "Quase todo dia, de manhã cedo ou fim da tarde. Canteiro: 4 a 10 L/m² aplicados devagar (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C).",
        "adubacao": "Seguir cobertura parcelada em plantas de colheita longa (R1 p.10).",
        "intervencoes": "Colher no ponto: R1 Tab.1",
        "fonte": "R1 Tab.1",
        "confianca": "A"
      }
    ],
    "epocas": [
      {
        "variedade": null,
        "regiao": "Sul",
        "mesInicio": 1,
        "mesFim": 12,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Sudeste",
        "mesInicio": 1,
        "mesFim": 12,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Nordeste",
        "mesInicio": 3,
        "mesFim": 7,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Centro-Oeste",
        "mesInicio": 4,
        "mesFim": 8,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Norte",
        "mesInicio": 4,
        "mesFim": 10,
        "recomendado": true
      }
    ]
  },
  {
    "id": "salsa",
    "nomePopular": "Salsa (salsinha)",
    "nomeCientifico": "Petroselinum crispum",
    "grupo": "condimento",
    "propagacao": "semeadura direta ou muda",
    "germinacaoDias": {
      "min": 10,
      "max": 28
    },
    "colheitaInicioDias": {
      "min": 65,
      "max": 70
    },
    "regaAdultaIntervaloDias": {
      "min": 1,
      "max": 1
    },
    "luzHorasMin": 5,
    "localIdeal": "sol pleno ou meia-sombra",
    "dicaAcessivel": "Germina devagar, tenha paciência. Desbaste com 3-4 folhas definitivas (R3 p.36).",
    "pontoColheita": null,
    "fases": [
      {
        "ordem": 1,
        "nome": "germinação",
        "diaInicio": 0,
        "diaFim": 28,
        "rega": "Manter a terra sempre úmida; regar 2 vezes ao dia, ao amanhecer e no fim da tarde (R3 p.27).",
        "adubacao": "Nenhuma.",
        "intervencoes": "Cobrir sementes com 0,5 a 1,5 cm de terra peneirada (R3 p.27).",
        "fonte": "germinação 10-28 dias: R7 (C)",
        "confianca": "C"
      },
      {
        "ordem": 2,
        "nome": "vegetativo",
        "diaInicio": 28,
        "diaFim": 65,
        "rega": "Quase todo dia, de manhã cedo ou fim da tarde. Canteiro: 4 a 10 L/m² aplicados devagar (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C).",
        "adubacao": "Cobertura aos 20-30 dias após germinar ou transplantar: 10 a 20 g por planta (ou 20 g/m²) de sulfato de amônio ou NPK 20-5-20 aos 20 a 30 dias, ou 2 kg/m² de esterco/composto (R1 p.10).",
        "intervencoes": "Desbastar 20 a 35 dias após semear, deixando o espaçamento final (R1 p.9). Tirar mato.",
        "fonte": "R1, R3",
        "confianca": "A"
      },
      {
        "ordem": 3,
        "nome": "colheita",
        "diaInicio": 65,
        "diaFim": 70,
        "rega": "Quase todo dia, de manhã cedo ou fim da tarde. Canteiro: 4 a 10 L/m² aplicados devagar (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C).",
        "adubacao": "Seguir cobertura parcelada em plantas de colheita longa (R1 p.10).",
        "intervencoes": "Colher no ponto: R1 Tab.1",
        "fonte": "R1 Tab.1",
        "confianca": "A"
      }
    ],
    "epocas": [
      {
        "variedade": null,
        "regiao": "Sul",
        "mesInicio": 3,
        "mesFim": 9,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Sudeste",
        "mesInicio": 3,
        "mesFim": 9,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Nordeste",
        "mesInicio": 3,
        "mesFim": 8,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Centro-Oeste",
        "mesInicio": 3,
        "mesFim": 8,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Norte",
        "mesInicio": null,
        "mesFim": null,
        "recomendado": false
      }
    ]
  },
  {
    "id": "coentro",
    "nomePopular": "Coentro",
    "nomeCientifico": "Coriandrum sativum",
    "grupo": "condimento",
    "propagacao": "semeadura direta",
    "germinacaoDias": {
      "min": 7,
      "max": 21
    },
    "colheitaInicioDias": {
      "min": 50,
      "max": 70
    },
    "regaAdultaIntervaloDias": {
      "min": 1,
      "max": 1
    },
    "luzHorasMin": 5,
    "localIdeal": "sol pleno",
    "dicaAcessivel": "Bom para o calor. Faça semeaduras a cada 3-4 semanas para ter sempre.",
    "pontoColheita": null,
    "fases": [
      {
        "ordem": 1,
        "nome": "germinação",
        "diaInicio": 0,
        "diaFim": 21,
        "rega": "Manter a terra sempre úmida; regar 2 vezes ao dia, ao amanhecer e no fim da tarde (R3 p.27).",
        "adubacao": "Nenhuma.",
        "intervencoes": "Cobrir sementes com 0,5 a 1,5 cm de terra peneirada (R3 p.27).",
        "fonte": "germinação 7-21 dias: R7 (C)",
        "confianca": "C"
      },
      {
        "ordem": 2,
        "nome": "vegetativo",
        "diaInicio": 21,
        "diaFim": 50,
        "rega": "Quase todo dia, de manhã cedo ou fim da tarde. Canteiro: 4 a 10 L/m² aplicados devagar (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C).",
        "adubacao": "Cobertura aos 20-30 dias após germinar ou transplantar: 10 a 20 g por planta (ou 20 g/m²) de sulfato de amônio ou NPK 20-5-20 aos 20 a 30 dias, ou 2 kg/m² de esterco/composto (R1 p.10).",
        "intervencoes": "Desbastar 20 a 35 dias após semear, deixando o espaçamento final (R1 p.9). Tirar mato.",
        "fonte": "R1, R3",
        "confianca": "A"
      },
      {
        "ordem": 3,
        "nome": "colheita",
        "diaInicio": 50,
        "diaFim": 70,
        "rega": "Quase todo dia, de manhã cedo ou fim da tarde. Canteiro: 4 a 10 L/m² aplicados devagar (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C).",
        "adubacao": "Seguir cobertura parcelada em plantas de colheita longa (R1 p.10).",
        "intervencoes": "Colher no ponto: R1 Tab.1",
        "fonte": "R1 Tab.1",
        "confianca": "A"
      }
    ],
    "epocas": [
      {
        "variedade": null,
        "regiao": "Sul",
        "mesInicio": 9,
        "mesFim": 1,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Sudeste",
        "mesInicio": 8,
        "mesFim": 2,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Nordeste",
        "mesInicio": 1,
        "mesFim": 12,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Centro-Oeste",
        "mesInicio": 8,
        "mesFim": 4,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Norte",
        "mesInicio": 4,
        "mesFim": 10,
        "recomendado": true
      }
    ]
  },
  {
    "id": "manjericao",
    "nomePopular": "Manjericão",
    "nomeCientifico": "Ocimum basilicum",
    "grupo": "condimento",
    "propagacao": "semente ou estaca (R5)",
    "germinacaoDias": {
      "min": 4,
      "max": 14
    },
    "colheitaInicioDias": null,
    "regaAdultaIntervaloDias": {
      "min": 1,
      "max": 1
    },
    "luzHorasMin": 5,
    "localIdeal": "sol pleno",
    "dicaAcessivel": "Desbaste 2-3 semanas após germinar e transplante com 3 cm (R5). Adubo: 5 kg de esterco por m² (R5).",
    "pontoColheita": {
      "texto": "Colher quando a planta começar a florir, de manhã até as 11 h, para não perder o aroma.",
      "fonte": "R5",
      "confianca": "A"
    },
    "fases": [
      {
        "ordem": 1,
        "nome": "germinação",
        "diaInicio": 0,
        "diaFim": 14,
        "rega": "Manter a terra sempre úmida; regar 2 vezes ao dia, ao amanhecer e no fim da tarde (R3 p.27).",
        "adubacao": "Nenhuma.",
        "intervencoes": "Cobrir sementes com 0,5 a 1,5 cm de terra peneirada (R3 p.27).",
        "fonte": "germinação 4-14 dias: R7 (C)",
        "confianca": "C"
      },
      {
        "ordem": 2,
        "nome": "vegetativo",
        "diaInicio": 14,
        "diaFim": null,
        "rega": "Quase todo dia, de manhã cedo ou fim da tarde. Canteiro: 4 a 10 L/m² aplicados devagar (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C).",
        "adubacao": "Cobertura aos 20-30 dias após germinar ou transplantar: 10 a 20 g por planta (ou 20 g/m²) de sulfato de amônio ou NPK 20-5-20 aos 20 a 30 dias, ou 2 kg/m² de esterco/composto (R1 p.10).",
        "intervencoes": "Desbastar cedo, com 3-4 folhas definitivas (R3 p.36). Tirar mato.",
        "fonte": "R1, R3",
        "confianca": "C"
      },
      {
        "ordem": 3,
        "nome": "colheita",
        "diaInicio": null,
        "diaFim": null,
        "rega": "Quase todo dia, de manhã cedo ou fim da tarde. Canteiro: 4 a 10 L/m² aplicados devagar (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C).",
        "adubacao": "Seguir cobertura parcelada em plantas de colheita longa (R1 p.10).",
        "intervencoes": "Ponto de colheita: Colher quando a planta começar a florir, de manhã até as 11 h, para não perder o aroma. (R5)",
        "fonte": "R5: colher na floração, de manhã até 11 h",
        "confianca": "A"
      }
    ],
    "epocas": [
      {
        "variedade": null,
        "regiao": "Sul",
        "mesInicio": null,
        "mesFim": null,
        "recomendado": null
      },
      {
        "variedade": null,
        "regiao": "Sudeste",
        "mesInicio": null,
        "mesFim": null,
        "recomendado": null
      },
      {
        "variedade": null,
        "regiao": "Nordeste",
        "mesInicio": null,
        "mesFim": null,
        "recomendado": null
      },
      {
        "variedade": null,
        "regiao": "Centro-Oeste",
        "mesInicio": null,
        "mesFim": null,
        "recomendado": null
      },
      {
        "variedade": null,
        "regiao": "Norte",
        "mesInicio": null,
        "mesFim": null,
        "recomendado": null
      }
    ]
  },
  {
    "id": "hortela",
    "nomePopular": "Hortelã",
    "nomeCientifico": "Mentha spp. (ref.: M. x piperita)",
    "grupo": "condimento",
    "propagacao": "pedaço de rizoma de cerca de 10 cm (R6)",
    "germinacaoDias": null,
    "colheitaInicioDias": {
      "min": 120,
      "max": 120
    },
    "regaAdultaIntervaloDias": {
      "min": 1,
      "max": 1
    },
    "luzHorasMin": 5,
    "localIdeal": "sol pleno ou meia-sombra",
    "dicaAcessivel": "Espalha muito: plante sozinha no vaso. Não misture tipos de hortelã (R6).",
    "pontoColheita": {
      "texto": "Colher as folhas a partir do 4º mês após o plantio, bem cedo ou à noite, para não perder o óleo essencial.",
      "fonte": "R6",
      "confianca": "A"
    },
    "fases": [
      {
        "ordem": 1,
        "nome": "vegetativo",
        "diaInicio": 0,
        "diaFim": 120,
        "rega": "Gosta de terra sempre úmida, sem encharcar (C).",
        "adubacao": "Cobertura aos 20-30 dias após germinar ou transplantar: 10 a 20 g por planta (ou 20 g/m²) de sulfato de amônio ou NPK 20-5-20 aos 20 a 30 dias, ou 2 kg/m² de esterco/composto (R1 p.10).",
        "intervencoes": "Tirar mato.",
        "fonte": "R1, R3",
        "confianca": "C"
      },
      {
        "ordem": 2,
        "nome": "colheita",
        "diaInicio": 120,
        "diaFim": null,
        "rega": "Gosta de terra sempre úmida, sem encharcar (C).",
        "adubacao": "Seguir cobertura parcelada em plantas de colheita longa (R1 p.10).",
        "intervencoes": "Ponto de colheita: Colher as folhas a partir do 4º mês após o plantio, bem cedo ou à noite, para não perder o óleo essencial. (R6)",
        "fonte": "R6: folhas a partir do 4º mês",
        "confianca": "A"
      }
    ],
    "epocas": [
      {
        "variedade": null,
        "regiao": "Sul",
        "mesInicio": null,
        "mesFim": null,
        "recomendado": null
      },
      {
        "variedade": null,
        "regiao": "Sudeste",
        "mesInicio": null,
        "mesFim": null,
        "recomendado": null
      },
      {
        "variedade": null,
        "regiao": "Nordeste",
        "mesInicio": null,
        "mesFim": null,
        "recomendado": null
      },
      {
        "variedade": null,
        "regiao": "Centro-Oeste",
        "mesInicio": null,
        "mesFim": null,
        "recomendado": null
      },
      {
        "variedade": null,
        "regiao": "Norte",
        "mesInicio": null,
        "mesFim": null,
        "recomendado": null
      }
    ]
  },
  {
    "id": "morango",
    "nomePopular": "Morango",
    "nomeCientifico": "Fragaria x ananassa",
    "grupo": "fruto",
    "propagacao": "muda",
    "germinacaoDias": null,
    "colheitaInicioDias": {
      "min": 70,
      "max": 80
    },
    "regaAdultaIntervaloDias": {
      "min": 2,
      "max": 3
    },
    "luzHorasMin": 5,
    "localIdeal": "sol pleno",
    "dicaAcessivel": "Compre mudas sadias; não se planta morango por semente em casa. Não deixe os frutos encostarem na terra.",
    "pontoColheita": null,
    "fases": [
      {
        "ordem": 1,
        "nome": "vegetativo",
        "diaInicio": 0,
        "diaFim": 70,
        "rega": "A cada 2 a 3 dias na planta adulta; quase todo dia no início. Canteiro: 4 a 10 L/m²; cova: 3 a 5 L (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C).",
        "adubacao": "Cobertura aos 20-30 dias após germinar ou transplantar: 10 a 20 g por planta (ou 20 g/m²) de sulfato de amônio ou NPK 20-5-20 aos 20 a 30 dias, ou 2 kg/m² de esterco/composto (R1 p.10).",
        "intervencoes": "Tirar mato.",
        "fonte": "R1, R3",
        "confianca": "A"
      },
      {
        "ordem": 2,
        "nome": "colheita",
        "diaInicio": 70,
        "diaFim": 80,
        "rega": "A cada 2 a 3 dias na planta adulta; quase todo dia no início. Canteiro: 4 a 10 L/m²; cova: 3 a 5 L (R1 p.9). Vaso: regar quando a terra de cima estiver seca ao toque (C).",
        "adubacao": "Seguir cobertura parcelada em plantas de colheita longa (R1 p.10).",
        "intervencoes": "Colher no ponto: R1 Tab.1",
        "fonte": "R1 Tab.1",
        "confianca": "A"
      }
    ],
    "epocas": [
      {
        "variedade": null,
        "regiao": "Sul",
        "mesInicio": 3,
        "mesFim": 4,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Sudeste",
        "mesInicio": 3,
        "mesFim": 4,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Nordeste",
        "mesInicio": null,
        "mesFim": null,
        "recomendado": false
      },
      {
        "variedade": null,
        "regiao": "Centro-Oeste",
        "mesInicio": 2,
        "mesFim": 3,
        "recomendado": true
      },
      {
        "variedade": null,
        "regiao": "Norte",
        "mesInicio": null,
        "mesFim": null,
        "recomendado": false
      }
    ]
  }
];

/** Plantas de casa (ornamentais, base v2): sem colheita nem época por região. */
export const PLANTAS_DE_CASA: readonly PlantaDeCasa[] = [
  {
    "id": "jiboia",
    "nomePopular": "Jiboia",
    "outrosNomes": "Pothos",
    "nomeCientifico": "Epipremnum aureum",
    "tipo": "folhagem",
    "luz": {
      "categoria": "indireta_forte",
      "texto": "Luz clara sem sol direto; aguenta bastante tempo com pouca luz, mas as folhas mescladas perdem a cor.",
      "horasSolDireto": null,
      "fonte": "N1; C1",
      "confianca": "A"
    },
    "rega": {
      "regra": "Deixar o substrato secar entre as regas.",
      "umidadeSolo": "seco entre regas",
      "fonte": "N1; C1",
      "confianca": "A"
    },
    "substrato": {
      "texto": "Substrato aerado e bem drenado, rico em matéria orgânica.",
      "vaso": "Com furo de drenagem.",
      "fonte": "N1; C1"
    },
    "adubo": {
      "texto": "Adubo para plantas de casa a cada 2 meses na primavera e no verão; não adubar no inverno.",
      "fonte": "N1; C1",
      "confianca": "A"
    },
    "temperatura": {
      "ideal": "21 a 29 °C de dia, 16 a 21 °C à noite",
      "minimaC": null,
      "fonte": "C1"
    },
    "umidadeAr": "Ideal 50 a 70%; tolera o ar comum de casa (30 a 60%).",
    "propagacao": "Estaca com pelo menos um nó; enraíza fácil na água.",
    "crescimento": "médio",
    "toxicidade": {
      "caes": {
        "toxica": true,
        "nota": null
      },
      "gatos": {
        "toxica": true,
        "nota": null
      },
      "gravidadeHumanos": "média (N1) / leve (C1)",
      "sintomas": "Irritação, dor e inchaço na boca, salivação, vômito e dificuldade para engolir (oxalato de cálcio). Pode irritar a pele.",
      "fonte": "N1; C1",
      "confianca": "A"
    },
    "problemas": "Excesso de água: raiz podre e bordas pretas. Cochonilha e ácaro.",
    "dica": "Uma das plantas mais fáceis. Na dúvida, espere a terra secar antes de regar.",
    "estacoes": [
      {
        "estacao": "crescimento",
        "meses": "set-mar",
        "rega": "Deixar o substrato secar entre as regas.",
        "verificarTerraDias": 7,
        "verificarConfianca": "C",
        "verificarFonte": null,
        "adubacao": "Adubo para plantas de casa a cada 2 meses na primavera e no verão; não adubar no inverno.",
        "adubacaoFonte": "N1; C1"
      },
      {
        "estacao": "repouso",
        "meses": "abr-ago",
        "rega": "Deixar o substrato secar entre as regas.",
        "verificarTerraDias": 10,
        "verificarConfianca": "C",
        "verificarFonte": null,
        "adubacao": "Não adubar.",
        "adubacaoFonte": "N1; C1"
      }
    ]
  },
  {
    "id": "samambaia",
    "nomePopular": "Samambaia",
    "outrosNomes": "Samambaia-americana, samambaia-de-boston",
    "nomeCientifico": "Nephrolepis exaltata",
    "tipo": "folhagem",
    "luz": {
      "categoria": "indireta_forte",
      "texto": "Luz clara indireta, sem sol direto.",
      "horasSolDireto": null,
      "fonte": "N2",
      "confianca": "A"
    },
    "rega": {
      "regra": "Manter a terra sempre úmida, sem deixar secar; regar menos no inverno, quando o excesso apodrece a raiz.",
      "umidadeSolo": "sempre úmido",
      "fonte": "N2",
      "confianca": "A"
    },
    "substrato": {
      "texto": "Terra bem drenada.",
      "vaso": "Com furo de drenagem.",
      "fonte": "N2"
    },
    "adubo": {
      "texto": null,
      "fonte": null,
      "confianca": null
    },
    "temperatura": {
      "ideal": "16 a 21 °C",
      "minimaC": null,
      "fonte": "N2"
    },
    "umidadeAr": "Alta. Perto de cozinha ou banheiro, ou sobre bandeja com pedrinhas molhadas.",
    "propagacao": null,
    "crescimento": "rápido",
    "toxicidade": {
      "caes": {
        "toxica": false,
        "nota": null
      },
      "gatos": {
        "toxica": false,
        "nota": null
      },
      "gravidadeHumanos": null,
      "sintomas": null,
      "fonte": "A2; N2",
      "confianca": "A"
    },
    "problemas": "Ar seco favorece cochonilha e ácaro.",
    "dica": "Ar seco é o maior inimigo. Borrifar ou usar bandeja com pedras molhadas ajuda.",
    "estacoes": [
      {
        "estacao": "crescimento",
        "meses": "set-mar",
        "rega": "Manter a terra sempre úmida, sem deixar secar; regar menos no inverno, quando o excesso apodrece a raiz.",
        "verificarTerraDias": 2,
        "verificarConfianca": "C",
        "verificarFonte": null,
        "adubacao": null,
        "adubacaoFonte": null
      },
      {
        "estacao": "repouso",
        "meses": "abr-ago",
        "rega": "Manter a terra sempre úmida, sem deixar secar; regar menos no inverno, quando o excesso apodrece a raiz.",
        "verificarTerraDias": 4,
        "verificarConfianca": "C",
        "verificarFonte": null,
        "adubacao": null,
        "adubacaoFonte": null
      }
    ]
  },
  {
    "id": "espada_sao_jorge",
    "nomePopular": "Espada-de-são-jorge",
    "outrosNomes": "Sansevieria, língua-de-sogra",
    "nomeCientifico": "Dracaena trifasciata (sin. Sansevieria trifasciata)",
    "tipo": "folhagem",
    "luz": {
      "categoria": "meia_sombra",
      "texto": "2 a 6 horas de sol direto por dia; tolera muito pouca luz.",
      "horasSolDireto": "2-6",
      "fonte": "N3",
      "confianca": "A"
    },
    "rega": {
      "regra": "Da primavera ao outono, deixar a terra secar entre as regas. No inverno, regar só a cada 1 ou 2 meses. Excesso de água apodrece a raiz.",
      "umidadeSolo": "seco entre regas",
      "fonte": "N3",
      "confianca": "A"
    },
    "substrato": {
      "texto": "Terra bem drenada, pode ser arenosa.",
      "vaso": "Com furo de drenagem.",
      "fonte": "N3"
    },
    "adubo": {
      "texto": null,
      "fonte": null,
      "confianca": null
    },
    "temperatura": {
      "ideal": "Tolera frescor, por volta de 10 °C",
      "minimaC": null,
      "fonte": "N3"
    },
    "umidadeAr": "Tolera ar seco.",
    "propagacao": "Divisão da touceira ou estaca de folha.",
    "crescimento": "médio",
    "toxicidade": {
      "caes": {
        "toxica": true,
        "nota": null
      },
      "gatos": {
        "toxica": true,
        "nota": null
      },
      "gravidadeHumanos": "baixa",
      "sintomas": "Se ingerida: vômito, náusea, diarreia, salivação (saponinas). A seiva pode irritar a pele.",
      "fonte": "N3",
      "confianca": "A"
    },
    "problemas": "Excesso de água: raiz podre. Cochonilha e ácaro.",
    "dica": "Aguenta pouca luz e ar seco; o que mais mata é água demais (N3).",
    "estacoes": [
      {
        "estacao": "crescimento",
        "meses": "set-mar",
        "rega": "Da primavera ao outono, deixar a terra secar entre as regas. No inverno, regar só a cada 1 ou 2 meses. Excesso de água apodrece a raiz.",
        "verificarTerraDias": 14,
        "verificarConfianca": "C",
        "verificarFonte": "N3: no inverno regar a cada 1-2 meses",
        "adubacao": null,
        "adubacaoFonte": null
      },
      {
        "estacao": "repouso",
        "meses": "abr-ago",
        "rega": "Da primavera ao outono, deixar a terra secar entre as regas. No inverno, regar só a cada 1 ou 2 meses. Excesso de água apodrece a raiz.",
        "verificarTerraDias": 30,
        "verificarConfianca": "A",
        "verificarFonte": "N3: no inverno regar a cada 1-2 meses",
        "adubacao": null,
        "adubacaoFonte": null
      }
    ]
  },
  {
    "id": "zamioculca",
    "nomePopular": "Zamioculca",
    "outrosNomes": "ZZ",
    "nomeCientifico": "Zamioculcas zamiifolia",
    "tipo": "folhagem",
    "luz": {
      "categoria": "indireta_forte",
      "texto": "Melhor com luz clara indireta; tolera pouca luz. Sol direto queima as folhas.",
      "horasSolDireto": null,
      "fonte": "N4",
      "confianca": "A"
    },
    "rega": {
      "regra": "No verão, 2 vezes por mês, só se a terra estiver totalmente seca. No inverno, 1 vez por mês. Não tolera encharcamento.",
      "umidadeSolo": "seco entre regas",
      "fonte": "N4",
      "confianca": "A"
    },
    "substrato": {
      "texto": "Terra orgânica ou arenosa, bem drenada.",
      "vaso": "Com furo de drenagem.",
      "fonte": "N4"
    },
    "adubo": {
      "texto": "Adubo líquido equilibrado para plantas de casa, 1 ou 2 vezes por ano.",
      "fonte": "N4",
      "confianca": "A"
    },
    "temperatura": {
      "ideal": "Proteger abaixo de 15 °C",
      "minimaC": 15,
      "fonte": "N4"
    },
    "umidadeAr": null,
    "propagacao": "Divisão ou estaca de folha.",
    "crescimento": "lento",
    "toxicidade": {
      "caes": {
        "toxica": true,
        "nota": null
      },
      "gatos": {
        "toxica": true,
        "nota": null
      },
      "gravidadeHumanos": "média",
      "sintomas": "Diarreia e vômito se as folhas forem comidas em quantidade (oxalato de cálcio).",
      "fonte": "N4",
      "confianca": "A"
    },
    "problemas": "Poucos problemas; observar cochonilha.",
    "dica": "Boa para quem esquece de regar. Cresce devagar, é normal.",
    "estacoes": [
      {
        "estacao": "crescimento",
        "meses": "set-mar",
        "rega": "No verão, 2 vezes por mês, só se a terra estiver totalmente seca. No inverno, 1 vez por mês. Não tolera encharcamento.",
        "verificarTerraDias": 15,
        "verificarConfianca": "A",
        "verificarFonte": "N4: 2x/mês no verão, 1x/mês no inverno",
        "adubacao": "Adubo líquido equilibrado para plantas de casa, 1 ou 2 vezes por ano.",
        "adubacaoFonte": "N4"
      },
      {
        "estacao": "repouso",
        "meses": "abr-ago",
        "rega": "No verão, 2 vezes por mês, só se a terra estiver totalmente seca. No inverno, 1 vez por mês. Não tolera encharcamento.",
        "verificarTerraDias": 30,
        "verificarConfianca": "A",
        "verificarFonte": "N4: 2x/mês no verão, 1x/mês no inverno",
        "adubacao": "Reduzir ou suspender (C).",
        "adubacaoFonte": "N4"
      }
    ]
  },
  {
    "id": "comigo_ninguem_pode",
    "nomePopular": "Comigo-ninguém-pode",
    "outrosNomes": "Difembáquia",
    "nomeCientifico": "Dieffenbachia seguine",
    "tipo": "folhagem",
    "luz": {
      "categoria": "indireta_forte",
      "texto": "Luz indireta; proteger do sol direto e de correntes de ar frio.",
      "horasSolDireto": null,
      "fonte": "N5",
      "confianca": "A"
    },
    "rega": {
      "regra": "Regar bem e esperar os 2,5 cm de cima da terra secarem antes de regar de novo.",
      "umidadeSolo": "levemente úmido",
      "fonte": "N5",
      "confianca": "A"
    },
    "substrato": {
      "texto": "Terra solta, fértil e rica em matéria orgânica; pH ácido a neutro.",
      "vaso": "Com furo de drenagem.",
      "fonte": "N5"
    },
    "adubo": {
      "texto": null,
      "fonte": null,
      "confianca": null
    },
    "temperatura": {
      "ideal": "Temperaturas moderadas, sem vento frio",
      "minimaC": null,
      "fonte": "N5"
    },
    "umidadeAr": "Alta.",
    "propagacao": "Divisão ou estaca de caule ou raiz.",
    "crescimento": null,
    "toxicidade": {
      "caes": {
        "toxica": true,
        "nota": null
      },
      "gatos": {
        "toxica": true,
        "nota": null
      },
      "gravidadeHumanos": "alta",
      "sintomas": "Queimação e inchaço de lábios, língua e garganta, dificuldade para falar e engolir, náusea e vômito. Seiva nos olhos pode lesar a córnea. Pode ser fatal para pets.",
      "fonte": "N5",
      "confianca": "A"
    },
    "problemas": "Ácaro, cochonilha, mosca-branca, mosquitinho do substrato, pulgão; mancha de folha e raiz podre.",
    "dica": "Muito tóxica: deixe longe de crianças e pets e use luvas ao podar.",
    "estacoes": [
      {
        "estacao": "crescimento",
        "meses": "set-mar",
        "rega": "Regar bem e esperar os 2,5 cm de cima da terra secarem antes de regar de novo.",
        "verificarTerraDias": 5,
        "verificarConfianca": "C",
        "verificarFonte": null,
        "adubacao": null,
        "adubacaoFonte": null
      },
      {
        "estacao": "repouso",
        "meses": "abr-ago",
        "rega": "Regar bem e esperar os 2,5 cm de cima da terra secarem antes de regar de novo.",
        "verificarTerraDias": 7,
        "verificarConfianca": "C",
        "verificarFonte": null,
        "adubacao": null,
        "adubacaoFonte": null
      }
    ]
  },
  {
    "id": "lirio_da_paz",
    "nomePopular": "Lírio-da-paz",
    "outrosNomes": "Espatifilo",
    "nomeCientifico": "Spathiphyllum spp.",
    "tipo": "flor",
    "luz": {
      "categoria": "pouca_luz",
      "texto": "Meia-sombra a sombra. Não colocar no sol direto.",
      "horasSolDireto": null,
      "fonte": "N6",
      "confianca": "A"
    },
    "rega": {
      "regra": "Manter a terra úmida, sem encharcar; deixar secar um pouco entre as regas. Regar por baixo funciona bem.",
      "umidadeSolo": "úmido",
      "fonte": "N6",
      "confianca": "A"
    },
    "substrato": {
      "texto": "Rico em matéria orgânica, pH ácido.",
      "vaso": "Com furo de drenagem.",
      "fonte": "N6"
    },
    "adubo": {
      "texto": "Usar 1/4 da dose do rótulo e lavar o substrato com água entre as adubações.",
      "fonte": "N6",
      "confianca": "A"
    },
    "temperatura": {
      "ideal": "20 a 29 °C de dia",
      "minimaC": 4,
      "fonte": "N6 (abaixo de 4 °C por muito tempo danifica a planta)"
    },
    "umidadeAr": "Ar seco causa pontas marrons.",
    "propagacao": "Divisão.",
    "crescimento": null,
    "toxicidade": {
      "caes": {
        "toxica": true,
        "nota": null
      },
      "gatos": {
        "toxica": true,
        "nota": null
      },
      "gravidadeHumanos": "média",
      "sintomas": "Dor forte e queimação na boca, lábios e garganta, salivação, vômito, dificuldade para engolir (oxalato de cálcio).",
      "fonte": "N6",
      "confianca": "A"
    },
    "problemas": "Cochonilha é a praga mais comum.",
    "dica": "Uma das poucas que florescem na sombra. Regar por baixo funciona bem (N6).",
    "estacoes": [
      {
        "estacao": "crescimento",
        "meses": "set-mar",
        "rega": "Manter a terra úmida, sem encharcar; deixar secar um pouco entre as regas. Regar por baixo funciona bem.",
        "verificarTerraDias": 3,
        "verificarConfianca": "C",
        "verificarFonte": null,
        "adubacao": "Usar 1/4 da dose do rótulo e lavar o substrato com água entre as adubações.",
        "adubacaoFonte": "N6"
      },
      {
        "estacao": "repouso",
        "meses": "abr-ago",
        "rega": "Manter a terra úmida, sem encharcar; deixar secar um pouco entre as regas. Regar por baixo funciona bem.",
        "verificarTerraDias": 5,
        "verificarConfianca": "C",
        "verificarFonte": null,
        "adubacao": "Reduzir ou suspender (C).",
        "adubacaoFonte": "N6"
      }
    ]
  },
  {
    "id": "costela_de_adao",
    "nomePopular": "Costela-de-adão",
    "outrosNomes": "Monstera",
    "nomeCientifico": "Monstera deliciosa",
    "tipo": "folhagem",
    "luz": {
      "categoria": "indireta_forte",
      "texto": "Claridade moderada, sem sol direto. As mescladas precisam de mais luz.",
      "horasSolDireto": null,
      "fonte": "N7",
      "confianca": "A"
    },
    "rega": {
      "regra": "Regar bem e deixar secar de 1/4 a 1/3 da terra antes de regar de novo.",
      "umidadeSolo": "levemente úmido",
      "fonte": "N7",
      "confianca": "A"
    },
    "substrato": {
      "texto": "Rico em matéria orgânica, bem drenado.",
      "vaso": "Com furo de drenagem.",
      "fonte": "N7"
    },
    "adubo": {
      "texto": null,
      "fonte": null,
      "confianca": null
    },
    "temperatura": {
      "ideal": "16 a 29 °C",
      "minimaC": null,
      "fonte": "N7"
    },
    "umidadeAr": "Alta; umidificador ou bandeja com pedrinhas molhadas.",
    "propagacao": "Alporquia ou estaca de caule.",
    "crescimento": "rápido",
    "toxicidade": {
      "caes": {
        "toxica": true,
        "nota": null
      },
      "gatos": {
        "toxica": true,
        "nota": null
      },
      "gravidadeHumanos": "baixa",
      "sintomas": "Queimação na boca e garganta, náusea, vômito, salivação; só em grande quantidade. Pode irritar a pele.",
      "fonte": "N7",
      "confianca": "A"
    },
    "problemas": "Poucos problemas; cochonilha.",
    "dica": "Cresce rápido e fica grande, então precisa de espaço (N7).",
    "estacoes": [
      {
        "estacao": "crescimento",
        "meses": "set-mar",
        "rega": "Regar bem e deixar secar de 1/4 a 1/3 da terra antes de regar de novo.",
        "verificarTerraDias": 7,
        "verificarConfianca": "C",
        "verificarFonte": null,
        "adubacao": null,
        "adubacaoFonte": null
      },
      {
        "estacao": "repouso",
        "meses": "abr-ago",
        "rega": "Regar bem e deixar secar de 1/4 a 1/3 da terra antes de regar de novo.",
        "verificarTerraDias": 10,
        "verificarConfianca": "C",
        "verificarFonte": null,
        "adubacao": null,
        "adubacaoFonte": null
      }
    ]
  },
  {
    "id": "clorofito",
    "nomePopular": "Clorofito",
    "outrosNomes": "Gravatinha, planta-aranha",
    "nomeCientifico": "Chlorophytum comosum",
    "tipo": "folhagem",
    "luz": {
      "categoria": "meia_sombra",
      "texto": "Luz média; tolera sombra. Não tolera sol direto.",
      "horasSolDireto": null,
      "fonte": "N8",
      "confianca": "A"
    },
    "rega": {
      "regra": "Cresce melhor com terra úmida, mas tolera seca. Regar menos no inverno. Cloro e flúor da água da torneira podem queimar as pontas.",
      "umidadeSolo": "úmido",
      "fonte": "N8",
      "confianca": "A"
    },
    "substrato": {
      "texto": "Terra bem drenada.",
      "vaso": "Com furo de drenagem.",
      "fonte": "N8"
    },
    "adubo": {
      "texto": "Não exagerar no adubo, porque reduz as mudinhas.",
      "fonte": "N8",
      "confianca": "A"
    },
    "temperatura": {
      "ideal": "Acima de 7 °C",
      "minimaC": 7,
      "fonte": "N8"
    },
    "umidadeAr": "Média.",
    "propagacao": "Mudinhas que nascem nas hastes, ou divisão.",
    "crescimento": "médio",
    "toxicidade": {
      "caes": {
        "toxica": false,
        "nota": null
      },
      "gatos": {
        "toxica": false,
        "nota": null
      },
      "gravidadeHumanos": null,
      "sintomas": null,
      "fonte": "A1; N8",
      "confianca": "A"
    },
    "problemas": "Poucos problemas. Pontas queimadas pela água da torneira.",
    "dica": "Segura para casa com pets. As mudinhas penduradas viram plantas novas.",
    "estacoes": [
      {
        "estacao": "crescimento",
        "meses": "set-mar",
        "rega": "Cresce melhor com terra úmida, mas tolera seca. Regar menos no inverno. Cloro e flúor da água da torneira podem queimar as pontas.",
        "verificarTerraDias": 5,
        "verificarConfianca": "C",
        "verificarFonte": null,
        "adubacao": "Não exagerar no adubo, porque reduz as mudinhas.",
        "adubacaoFonte": "N8"
      },
      {
        "estacao": "repouso",
        "meses": "abr-ago",
        "rega": "Cresce melhor com terra úmida, mas tolera seca. Regar menos no inverno. Cloro e flúor da água da torneira podem queimar as pontas.",
        "verificarTerraDias": 10,
        "verificarConfianca": "C",
        "verificarFonte": null,
        "adubacao": "Reduzir ou suspender (C).",
        "adubacaoFonte": "N8"
      }
    ]
  },
  {
    "id": "babosa",
    "nomePopular": "Babosa",
    "outrosNomes": "Aloe",
    "nomeCientifico": "Aloe vera",
    "tipo": "suculenta",
    "luz": {
      "categoria": "sol_direto",
      "texto": "Sol pleno (6 horas ou mais) a meia-sombra.",
      "horasSolDireto": "6+",
      "fonte": "N9",
      "confianca": "A"
    },
    "rega": {
      "regra": "Deixar a terra secar completamente entre as regas; regar menos no inverno. Excesso apodrece a raiz.",
      "umidadeSolo": "seco entre regas",
      "fonte": "N9",
      "confianca": "A"
    },
    "substrato": {
      "texto": "Muito bem drenado, próprio para suculentas.",
      "vaso": "Com vários furos; vaso de barro é o melhor.",
      "fonte": "N9"
    },
    "adubo": {
      "texto": null,
      "fonte": null,
      "confianca": null
    },
    "temperatura": {
      "ideal": null,
      "minimaC": null,
      "fonte": null
    },
    "umidadeAr": null,
    "propagacao": "Mudas laterais (divisão).",
    "crescimento": "médio",
    "toxicidade": {
      "caes": {
        "toxica": true,
        "nota": null
      },
      "gatos": {
        "toxica": true,
        "nota": null
      },
      "gravidadeHumanos": "baixa",
      "sintomas": "Cólica, diarreia, urina avermelhada; o látex irrita a pele.",
      "fonte": "N9",
      "confianca": "A"
    },
    "problemas": "Cochonilha e pulgão; mancha de folha, ferrugem.",
    "dica": "Gosta de sol e de pouca água. Vaso de barro ajuda a terra secar.",
    "estacoes": [
      {
        "estacao": "crescimento",
        "meses": "set-mar",
        "rega": "Deixar a terra secar completamente entre as regas; regar menos no inverno. Excesso apodrece a raiz.",
        "verificarTerraDias": 14,
        "verificarConfianca": "C",
        "verificarFonte": null,
        "adubacao": null,
        "adubacaoFonte": null
      },
      {
        "estacao": "repouso",
        "meses": "abr-ago",
        "rega": "Deixar a terra secar completamente entre as regas; regar menos no inverno. Excesso apodrece a raiz.",
        "verificarTerraDias": 21,
        "verificarConfianca": "C",
        "verificarFonte": null,
        "adubacao": null,
        "adubacaoFonte": null
      }
    ]
  },
  {
    "id": "anturio",
    "nomePopular": "Antúrio",
    "outrosNomes": null,
    "nomeCientifico": "Anthurium andraeanum",
    "tipo": "flor",
    "luz": {
      "categoria": "indireta_forte",
      "texto": "Luz clara indireta; sol direto queima as folhas.",
      "horasSolDireto": null,
      "fonte": "N10",
      "confianca": "A"
    },
    "rega": {
      "regra": "Regar quando os 2,5 cm de cima da terra estiverem secos.",
      "umidadeSolo": "levemente úmido",
      "fonte": "N10",
      "confianca": "A"
    },
    "substrato": {
      "texto": "Úmido e bem drenado.",
      "vaso": "Com furo de drenagem.",
      "fonte": "N10"
    },
    "adubo": {
      "texto": "Adubo líquido toda semana na época de crescimento.",
      "fonte": "N10",
      "confianca": "A"
    },
    "temperatura": {
      "ideal": "18 a 27 °C, sem vento frio",
      "minimaC": null,
      "fonte": "N10"
    },
    "umidadeAr": "60 a 80%.",
    "propagacao": "Divisão ou estaca.",
    "crescimento": "lento",
    "toxicidade": {
      "caes": {
        "toxica": true,
        "nota": null
      },
      "gatos": {
        "toxica": true,
        "nota": null
      },
      "gravidadeHumanos": "baixa",
      "sintomas": "Salivação, dor e inchaço na boca, dificuldade para engolir, vômito. A seiva irrita pele e olhos.",
      "fonte": "N10",
      "confianca": "A"
    },
    "problemas": "Excesso de água: raiz podre. Pulgão, ácaro, cochonilha; mancha de folha com pouca ventilação.",
    "dica": "Gosta de ar úmido. Ambiente com ar-condicionado resseca.",
    "estacoes": [
      {
        "estacao": "crescimento",
        "meses": "set-mar",
        "rega": "Regar quando os 2,5 cm de cima da terra estiverem secos.",
        "verificarTerraDias": 4,
        "verificarConfianca": "C",
        "verificarFonte": null,
        "adubacao": "Adubo líquido toda semana na época de crescimento.",
        "adubacaoFonte": "N10"
      },
      {
        "estacao": "repouso",
        "meses": "abr-ago",
        "rega": "Regar quando os 2,5 cm de cima da terra estiverem secos.",
        "verificarTerraDias": 7,
        "verificarConfianca": "C",
        "verificarFonte": null,
        "adubacao": "Reduzir ou suspender (C).",
        "adubacaoFonte": "N10"
      }
    ]
  },
  {
    "id": "orquidea",
    "nomePopular": "Orquídea-borboleta",
    "outrosNomes": "Falenópsis",
    "nomeCientifico": "Phalaenopsis spp.",
    "tipo": "flor",
    "luz": {
      "categoria": "pouca_luz",
      "texto": "Prefere pouca luz. Melhor lugar: janela voltada para o nascente (leste).",
      "horasSolDireto": null,
      "fonte": "N11",
      "confianca": "A"
    },
    "rega": {
      "regra": "Planta adulta: 1 vez por semana, mais no calor. Deixar o substrato secar um pouco. Regar de manhã, com água morna, e deixar escorrer bem.",
      "umidadeSolo": "seco um pouco entre regas",
      "fonte": "N11",
      "confianca": "A"
    },
    "substrato": {
      "texto": "À base de casca (não usar só musgo).",
      "vaso": "Drenagem excelente.",
      "fonte": "N11"
    },
    "adubo": {
      "texto": "Adubo equilibrado a meia dose 2 vezes por mês, ou 1/4 da dose toda semana.",
      "fonte": "N11",
      "confianca": "A"
    },
    "temperatura": {
      "ideal": "Quente",
      "minimaC": null,
      "fonte": "N11"
    },
    "umidadeAr": "Alta.",
    "propagacao": null,
    "crescimento": null,
    "toxicidade": {
      "caes": {
        "toxica": false,
        "nota": null
      },
      "gatos": {
        "toxica": false,
        "nota": null
      },
      "gravidadeHumanos": null,
      "sintomas": null,
      "fonte": "N11 (etiqueta da página)",
      "confianca": "A"
    },
    "problemas": "Cochonilha; mancha de botrytis nas flores; queda de botões com mudança de lugar ou temperatura.",
    "dica": "Para refazer a flor, algumas precisam de noites frescas (cerca de 13 °C) por uma semana no outono (N11).",
    "estacoes": [
      {
        "estacao": "crescimento",
        "meses": "set-mar",
        "rega": "Planta adulta: 1 vez por semana, mais no calor. Deixar o substrato secar um pouco. Regar de manhã, com água morna, e deixar escorrer bem.",
        "verificarTerraDias": 7,
        "verificarConfianca": "A",
        "verificarFonte": "N11: 1x/semana, mais no calor",
        "adubacao": "Adubo equilibrado a meia dose 2 vezes por mês, ou 1/4 da dose toda semana.",
        "adubacaoFonte": "N11"
      },
      {
        "estacao": "repouso",
        "meses": "abr-ago",
        "rega": "Planta adulta: 1 vez por semana, mais no calor. Deixar o substrato secar um pouco. Regar de manhã, com água morna, e deixar escorrer bem.",
        "verificarTerraDias": 7,
        "verificarConfianca": "A",
        "verificarFonte": "N11: 1x/semana, mais no calor",
        "adubacao": "Reduzir ou suspender (C).",
        "adubacaoFonte": "N11"
      }
    ]
  },
  {
    "id": "suculentas",
    "nomePopular": "Suculentas (ex.: echevéria)",
    "outrosNomes": "Rosinha-de-pedra",
    "nomeCientifico": "vários gêneros; referência Echeveria spp.",
    "tipo": "suculenta",
    "luz": {
      "categoria": "sol_direto",
      "texto": "Muita luz: echevéria em sol pleno, 6 horas ou mais (N12). Com pouca luz fica comprida e pálida (I1).",
      "horasSolDireto": "6+",
      "fonte": "N12; I1",
      "confianca": "A"
    },
    "rega": {
      "regra": "Regar até escorrer e só regar de novo com a terra totalmente seca. Comece a cada 2 a 3 semanas e ajuste. No inverno com pouca luz, só o bastante para não murchar.",
      "umidadeSolo": "seco entre regas",
      "fonte": "I1; U1",
      "confianca": "A"
    },
    "substrato": {
      "texto": "1 parte de terra ou casca para 2 partes de material mineral (perlita, areia grossa, pedrisco), ou mistura pronta para cactos e suculentas.",
      "vaso": "Obrigatório ter furo. Terracota é o ideal; pedra no fundo não substitui o furo.",
      "fonte": "I1"
    },
    "adubo": {
      "texto": "Primavera e verão: adubo a 1/2 ou 1/4 da dose do rótulo a cada 3 ou 4 regas. Não adubar no inverno.",
      "fonte": "I1",
      "confianca": "A"
    },
    "temperatura": {
      "ideal": "13 a 24 °C, com noites mais frescas; algumas toleram de 7 a 29 °C",
      "minimaC": 7,
      "fonte": "I1"
    },
    "umidadeAr": null,
    "propagacao": "Folha, estaca de caule ou mudinhas laterais.",
    "crescimento": null,
    "toxicidade": {
      "caes": {
        "toxica": false,
        "nota": "echevéria"
      },
      "gatos": {
        "toxica": false,
        "nota": "echevéria"
      },
      "gravidadeHumanos": null,
      "sintomas": null,
      "fonte": "N12 (etiqueta da página)",
      "confianca": "A"
    },
    "problemas": "Não tolera ficar molhada: amarela, amolece e apodrece. Cochonilha e ácaro.",
    "dica": "Erro número 1 é regar demais. Folha mole e transparente é sinal de água em excesso.",
    "estacoes": [
      {
        "estacao": "crescimento",
        "meses": "set-mar",
        "rega": "Regar até escorrer e só regar de novo com a terra totalmente seca. Comece a cada 2 a 3 semanas e ajuste. No inverno com pouca luz, só o bastante para não murchar.",
        "verificarTerraDias": 14,
        "verificarConfianca": "A",
        "verificarFonte": "I1: começar a cada 2-3 semanas",
        "adubacao": "Primavera e verão: adubo a 1/2 ou 1/4 da dose do rótulo a cada 3 ou 4 regas. Não adubar no inverno.",
        "adubacaoFonte": "I1"
      },
      {
        "estacao": "repouso",
        "meses": "abr-ago",
        "rega": "Regar até escorrer e só regar de novo com a terra totalmente seca. Comece a cada 2 a 3 semanas e ajuste. No inverno com pouca luz, só o bastante para não murchar.",
        "verificarTerraDias": 21,
        "verificarConfianca": "C",
        "verificarFonte": "I1: começar a cada 2-3 semanas",
        "adubacao": "Não adubar.",
        "adubacaoFonte": "I1"
      }
    ]
  },
  {
    "id": "cacto",
    "nomePopular": "Cacto",
    "outrosNomes": null,
    "nomeCientifico": "família Cactaceae (cactos de deserto)",
    "tipo": "cacto",
    "luz": {
      "categoria": "sol_direto",
      "texto": "Janela com sol direto várias horas por dia (C2). Cactos de mata, como a flor-de-maio, preferem luz filtrada.",
      "horasSolDireto": "várias",
      "fonte": "C2; U1",
      "confianca": "A"
    },
    "rega": {
      "regra": "Na primavera e no verão, regar quando a terra secar. No inverno, quase seco: rega leve a cada poucas semanas. Nunca deixar água parada no prato.",
      "umidadeSolo": "seco entre regas",
      "fonte": "C2; U1",
      "confianca": "A"
    },
    "substrato": {
      "texto": "Partes iguais de terra para vasos e areia grossa; deve esfarelar ao ser apertada.",
      "vaso": "Com furo; só um pouco maior que o anterior, porque vaso grande demais segura umidade.",
      "fonte": "C2; U1"
    },
    "adubo": {
      "texto": "Adubo com pouco nitrogênio (ex.: 5-10-5) 1 vez por mês no verão (C2), ou 1 a 2 vezes por ano a meia dose (U1). Não adubar no inverno.",
      "fonte": "C2; U1",
      "confianca": "A"
    },
    "temperatura": {
      "ideal": "18 a 29 °C no crescimento; 7 a 13 °C no repouso de inverno ajuda a florir",
      "minimaC": 7,
      "fonte": "C2"
    },
    "umidadeAr": "Ar seco (10 a 30%) é tolerado.",
    "propagacao": "Sementes, estacas, mudinhas laterais ou enxertia.",
    "crescimento": "lento",
    "toxicidade": {
      "caes": null,
      "gatos": null,
      "gravidadeHumanos": null,
      "sintomas": null,
      "fonte": null,
      "confianca": null
    },
    "problemas": "Raiz e caule podres por excesso de água ou terra que não drena. Pulgão, ácaro e cochonilha.",
    "dica": "Menos água do que você imagina, e o máximo de sol.",
    "estacoes": [
      {
        "estacao": "crescimento",
        "meses": "set-mar",
        "rega": "Na primavera e no verão, regar quando a terra secar. No inverno, quase seco: rega leve a cada poucas semanas. Nunca deixar água parada no prato.",
        "verificarTerraDias": 14,
        "verificarConfianca": "C",
        "verificarFonte": "C2: no inverno rega leve a cada poucas semanas",
        "adubacao": "Adubo com pouco nitrogênio (ex.: 5-10-5) 1 vez por mês no verão (C2), ou 1 a 2 vezes por ano a meia dose (U1). Não adubar no inverno.",
        "adubacaoFonte": "C2; U1"
      },
      {
        "estacao": "repouso",
        "meses": "abr-ago",
        "rega": "Na primavera e no verão, regar quando a terra secar. No inverno, quase seco: rega leve a cada poucas semanas. Nunca deixar água parada no prato.",
        "verificarTerraDias": 21,
        "verificarConfianca": "A",
        "verificarFonte": "C2: no inverno rega leve a cada poucas semanas",
        "adubacao": "Não adubar.",
        "adubacaoFonte": "C2; U1"
      }
    ]
  }
];

export const REFERENCIAS: readonly { id: string; citacao: string; url: string }[] = [
  {
    "id": "R1",
    "citacao": "AMARO, G. B.; SILVA, D. M.; MARINHO, A. G.; NASCIMENTO, W. M. Recomendações técnicas para o cultivo de hortaliças em agricultura familiar. Brasília, DF: Embrapa Hortaliças, 2007. (Circular Técnica, 47).",
    "url": "https://core.ac.uk/download/15428632.pdf"
  },
  {
    "id": "R2",
    "citacao": "CLEMENTE, F. M. V. T. (ed. téc.). Produção de hortaliças para agricultura familiar. Brasília, DF: Embrapa Hortaliças, 2015. 108 p. ISBN 978-85-7035-412-9.",
    "url": "https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1020866/1/Producao-de-Hortalicas-para-a-Agricultura-Familiar.pdf"
  },
  {
    "id": "R3",
    "citacao": "CLEMENTE, F. M. V. T.; HABER, L. L. (ed. téc.). Horta em pequenos espaços. Brasília, DF: Embrapa Hortaliças, 2012 (4ª impr. 2017). 56 p. ISBN 978-85-7035-047-3.",
    "url": "https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/927690/1/HORTA-EM-PEQUENOS-ESPACOS-4-IMP-2017.pdf"
  },
  {
    "id": "R4",
    "citacao": "RICCI, M. S. F. Cultivo doméstico do tomateiro em ambiente protegido de baixo custo. Seropédica: Embrapa Agrobiologia, 2018. 21 p. (Documentos, 309).",
    "url": "https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1100367/1/SerieDoc309CULTIVODOMESTICOTOMATEIRO.pdf"
  },
  {
    "id": "R5",
    "citacao": "RODRIGUES, V. G. S.; GONZAGA, D. S. O. M. Manjericão (Ocimum basilicum L.). Porto Velho: Embrapa Rondônia, 2001. (Folder Plantas Medicinais, 10).",
    "url": "https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/984042/1/foldermanjericao.pdf"
  },
  {
    "id": "R6",
    "citacao": "RODRIGUES, V. G. S.; GONZAGA, D. S. O. M. Hortelã-pimenta (Mentha x piperita L.). Porto Velho: Embrapa Rondônia, 2001. (Folder Plantas Medicinais, 09).",
    "url": "https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/984010/1/folderhortelapimenta.pdf"
  },
  {
    "id": "R7",
    "citacao": "BRASIL. Ministério da Agricultura, Pecuária e Abastecimento. Regras para análise de sementes. Brasília: MAPA/ACS, 2009. 399 p.",
    "url": "https://www.gov.br/agricultura/pt-br/assuntos/insumos-agropecuarios/arquivos-publicacoes-insumos/2946_regras_analise__sementes.pdf"
  },
  {
    "id": "N1",
    "citacao": "NC State Extension Gardener Plant Toolbox, NC State University. Ficha Epipremnum aureum. Acesso em 24 nov. 2026.",
    "url": "https://plants.ces.ncsu.edu/plants/epipremnum-aureum/common-name/devils-vine"
  },
  {
    "id": "N2",
    "citacao": "NC State Extension Gardener Plant Toolbox, NC State University. Ficha Nephrolepis exaltata. Acesso em 24 nov. 2026.",
    "url": "https://plants.ces.ncsu.edu/plants/nephrolepis-exaltata/"
  },
  {
    "id": "N3",
    "citacao": "NC State Extension Gardener Plant Toolbox, NC State University. Ficha Dracaena trifasciata. Acesso em 24 nov. 2026.",
    "url": "https://plants.ces.ncsu.edu/plants/dracaena-trifasciata/"
  },
  {
    "id": "N4",
    "citacao": "NC State Extension Gardener Plant Toolbox, NC State University. Ficha Zamioculcas zamiifolia. Acesso em 24 nov. 2026.",
    "url": "https://plants.ces.ncsu.edu/plants/zamioculcas-zamiifolia/"
  },
  {
    "id": "N5",
    "citacao": "NC State Extension Gardener Plant Toolbox, NC State University. Ficha Dieffenbachia seguine. Acesso em 24 nov. 2026.",
    "url": "https://plants.ces.ncsu.edu/plants/dieffenbachia-seguine/common-name/dieffenbachia/"
  },
  {
    "id": "N6",
    "citacao": "NC State Extension Gardener Plant Toolbox, NC State University. Ficha Spathiphyllum. Acesso em 24 nov. 2026.",
    "url": "https://plants.ces.ncsu.edu/plants/spathiphyllum/"
  },
  {
    "id": "N7",
    "citacao": "NC State Extension Gardener Plant Toolbox, NC State University. Ficha Monstera deliciosa. Acesso em 24 nov. 2026.",
    "url": "https://plants.ces.ncsu.edu/plants/monstera-deliciosa/"
  },
  {
    "id": "N8",
    "citacao": "NC State Extension Gardener Plant Toolbox, NC State University. Ficha Chlorophytum comosum. Acesso em 24 nov. 2026.",
    "url": "https://plants.ces.ncsu.edu/plants/chlorophytum-comosum/"
  },
  {
    "id": "N9",
    "citacao": "NC State Extension Gardener Plant Toolbox, NC State University. Ficha Aloe vera. Acesso em 24 nov. 2026.",
    "url": "https://plants.ces.ncsu.edu/plants/aloe-vera/"
  },
  {
    "id": "N10",
    "citacao": "NC State Extension Gardener Plant Toolbox, NC State University. Ficha Anthurium andraeanum. Acesso em 24 nov. 2026.",
    "url": "https://plants.ces.ncsu.edu/plants/anthurium-andraeanum/"
  },
  {
    "id": "N11",
    "citacao": "NC State Extension Gardener Plant Toolbox, NC State University. Ficha Phalaenopsis. Acesso em 24 nov. 2026.",
    "url": "https://plants.ces.ncsu.edu/plants/phalaenopsis/"
  },
  {
    "id": "N12",
    "citacao": "NC State Extension Gardener Plant Toolbox, NC State University. Ficha Echeveria. Acesso em 24 nov. 2026.",
    "url": "https://plants.ces.ncsu.edu/plants/echeveria/"
  },
  {
    "id": "C1",
    "citacao": "Clemson Cooperative Extension, Home & Garden Information Center. How to grow pothos indoors. Acesso em 24 nov. 2026.",
    "url": "https://hgic.clemson.edu/factsheet/how-to-grow-pothos-indoors-epipremnum-spp-care-cultivars-and-common-problems/"
  },
  {
    "id": "C2",
    "citacao": "RUSS, K.; PERTUIT, A.; SMITH, B. H. Indoor cacti. Clemson Cooperative Extension, HGIC 1502, rev. 2015.",
    "url": "https://hgic.clemson.edu/factsheet/indoor-cacti/"
  },
  {
    "id": "U1",
    "citacao": "BROWN, D. L. Cacti and succulents. University of Minnesota Extension (revisado 2026).",
    "url": "https://extension.umn.edu/houseplants/cacti-and-succulents"
  },
  {
    "id": "I1",
    "citacao": "STEIL, A. Growing succulents indoors. Iowa State University Extension, revisado dez. 2024.",
    "url": "https://yardandgarden.extension.iastate.edu/how-to/growing-succulents-indoors"
  },
  {
    "id": "A1",
    "citacao": "ASPCA Animal Poison Control. Spider plant. Acesso em 24 nov. 2026.",
    "url": "https://www.aspca.org/pet-care/aspca-poison-control/toxic-and-non-toxic-plants/spider-plant"
  },
  {
    "id": "A2",
    "citacao": "ASPCA Animal Poison Control. Boston fern. Acesso em 24 nov. 2026.",
    "url": "https://www.aspca.org/pet-care/aspca-poison-control/toxic-and-non-toxic-plants/boston-fern"
  }
];
