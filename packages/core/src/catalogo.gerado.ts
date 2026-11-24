// Arquivo gerado por scripts/gerar-catalogo.ts a partir de data/base-plantas/. Não edite à mão.
import type { Especie } from './tipos';

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
        "intervencoes": "Colher no ponto: R1 Tab.1",
        "fonte": "R1 Tab.1",
        "confianca": "A"
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
        "intervencoes": "Colher no ponto: R1 Tab.1",
        "fonte": "R1 Tab.1",
        "confianca": "A"
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
        "intervencoes": "Colher no ponto: R1 Tab.1 (R2: 25-30)",
        "fonte": "R1 Tab.1 (R2: 25-30)",
        "confianca": "A"
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
        "intervencoes": "Colher no ponto: R5: colher na floração, de manhã até 11 h",
        "fonte": "R5: colher na floração, de manhã até 11 h",
        "confianca": "A"
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
        "intervencoes": "Colher no ponto: R6: folhas a partir do 4º mês",
        "fonte": "R6: folhas a partir do 4º mês",
        "confianca": "A"
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
  }
];
