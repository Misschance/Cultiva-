import { z } from 'zod';
import { arredondarCoordenada } from './clima';

const OPEN_METEO_GEO = 'https://geocoding-api.open-meteo.com/v1/search';

export interface Cidade {
  nome: string;
  estado: string;
  /** Já arredondadas a ~1 km (SEG-14). */
  lat: number;
  lon: number;
}

/** Busca de cidade pelo nome: o app não precisa pedir a localização do GPS. */
export function urlBuscaCidade(nome: string): string {
  const termo = nome.trim();
  if (termo.length < 2 || termo.length > 80) throw new RangeError('Nome de cidade inválido');
  const params = new URLSearchParams({ name: termo, count: '5', language: 'pt', countryCode: 'BR', format: 'json' });
  return `${OPEN_METEO_GEO}?${params.toString()}`;
}

const RespostaGeo = z.object({
  results: z
    .array(
      z.object({
        name: z.string().max(200),
        admin1: z.string().max(200).optional(),
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
      }),
    )
    .optional(),
});

export function lerBuscaCidade(json: unknown): Cidade[] {
  const { results } = RespostaGeo.parse(json);
  return (results ?? []).map((r) => ({
    nome: r.name,
    estado: r.admin1 ?? '',
    lat: arredondarCoordenada(r.latitude),
    lon: arredondarCoordenada(r.longitude),
  }));
}

export async function buscarCidade(nome: string, buscar: typeof fetch = fetch): Promise<Cidade[]> {
  const resposta = await buscar(urlBuscaCidade(nome), { headers: { Accept: 'application/json' } });
  if (!resposta.ok) throw new Error(`Busca de cidade respondeu ${resposta.status}`);
  return lerBuscaCidade(await resposta.json());
}
