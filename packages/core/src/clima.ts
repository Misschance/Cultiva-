import { z } from 'zod';
import type { PrevisaoDia } from './tipos';

const OPEN_METEO = 'https://api.open-meteo.com/v1/forecast';

/**
 * Coordenadas arredondadas para 2 casas (cerca de 1 km): bastam para o clima
 * e evitam enviar o endereço exato do usuário a terceiros (SEG-14).
 */
export function arredondarCoordenada(valor: number): number {
  return Math.round(valor * 100) / 100;
}

export function urlPrevisao(lat: number, lon: number, dias = 3): string {
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) throw new RangeError('Latitude inválida');
  if (!Number.isFinite(lon) || lon < -180 || lon > 180) throw new RangeError('Longitude inválida');
  if (!Number.isInteger(dias) || dias < 1 || dias > 16) throw new RangeError('Número de dias inválido');
  const params = new URLSearchParams({
    latitude: String(arredondarCoordenada(lat)),
    longitude: String(arredondarCoordenada(lon)),
    daily: 'precipitation_sum,temperature_2m_max',
    timezone: 'auto',
    forecast_days: String(dias),
  });
  return `${OPEN_METEO}?${params.toString()}`;
}

const RespostaOpenMeteo = z.object({
  daily: z.object({
    time: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    precipitation_sum: z.array(z.number().nullable()),
    temperature_2m_max: z.array(z.number().nullable()),
  }),
});

/** Valida a resposta externa antes de usar; dias sem dado são descartados. */
export function lerPrevisao(json: unknown): PrevisaoDia[] {
  const { daily } = RespostaOpenMeteo.parse(json);
  const previsoes: PrevisaoDia[] = [];
  daily.time.forEach((data, i) => {
    const chuva = daily.precipitation_sum[i];
    const temp = daily.temperature_2m_max[i];
    if (chuva == null || temp == null) return;
    previsoes.push({ data, chuvaMm: chuva, tempMaxC: temp });
  });
  return previsoes;
}

export async function buscarPrevisao(
  lat: number,
  lon: number,
  buscar: typeof fetch = fetch,
): Promise<PrevisaoDia[]> {
  const resposta = await buscar(urlPrevisao(lat, lon), { headers: { Accept: 'application/json' } });
  if (!resposta.ok) throw new Error(`Open-Meteo respondeu ${resposta.status}`);
  return lerPrevisao(await resposta.json());
}
