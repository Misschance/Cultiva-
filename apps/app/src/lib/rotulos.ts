import type { MaterialVaso, Origem, TipoLocal } from '@cultivae/core';

export const NOME_TIPO_LOCAL: Record<TipoLocal, string> = {
  vaso: 'Vaso',
  canteiro: 'Canteiro',
  quintal: 'Quintal',
  jardineira: 'Jardineira',
  estufa: 'Estufa',
};

export const NOME_MATERIAL: Record<MaterialVaso, string> = {
  plastico: 'Plástico',
  barro: 'Barro',
  tecido: 'Tecido',
};

export const NOME_ORIGEM: Record<Origem, string> = {
  semente: 'Semente',
  muda: 'Muda',
  estaca: 'Estaca ou pedaço',
};

export const NOME_GRUPO: Record<string, string> = {
  folhosa: 'Folhosas',
  fruto: 'Frutos',
  raiz: 'Raízes',
  condimento: 'Temperos',
};

export const opcoesDe = <T extends string>(nomes: Record<T, string>) =>
  (Object.keys(nomes) as T[]).map((valor) => ({ valor, texto: nomes[valor] }));
