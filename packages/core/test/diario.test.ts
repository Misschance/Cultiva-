import { describe, expect, it } from 'vitest';
import { caminhoDaFoto, ehJpeg, linhaDoTempo, totalColhido, uuidV4, type Colheita, type EntradaDiario } from '../src';

const entrada = (id: string, data: string, texto: string | null = 'nota', foto: string | null = null): EntradaDiario => ({
  id,
  plantioId: 'p',
  data,
  texto,
  fotoCaminho: foto,
});
const colheita = (id: string, data: string, quantidade: number, unidade: Colheita['unidade']): Colheita => ({
  id,
  plantioId: 'p',
  data,
  quantidade,
  unidade,
});

describe('linha do tempo', () => {
  it('junta tudo do mais recente para o mais antigo, anotação primeiro no mesmo dia', () => {
    const itens = linhaDoTempo(
      [entrada('e1', '2026-11-10'), entrada('e2', '2026-11-12')],
      [colheita('c1', '2026-11-12', 2, 'macos')],
      [
        { plantioId: 'p', tipo: 'rega', data: '2026-11-12' },
        { plantioId: 'p', tipo: 'adubacao', data: '2026-11-11' },
      ],
    );
    expect(itens.map((i) => `${i.data}:${i.tipo}`)).toEqual([
      '2026-11-12:anotacao',
      '2026-11-12:colheita',
      '2026-11-12:acao',
      '2026-11-11:acao',
      '2026-11-10:anotacao',
    ]);
  });

  it('não repete a ação "colheita" quando há colheita com quantidade no mesmo dia', () => {
    const itens = linhaDoTempo([], [colheita('c1', '2026-12-01', 1, 'kg')], [
      { plantioId: 'p', tipo: 'colheita', data: '2026-12-01' },
      { plantioId: 'p', tipo: 'colheita', data: '2026-12-05' },
    ]);
    expect(itens.map((i) => `${i.data}:${i.tipo}`)).toEqual(['2026-12-05:acao', '2026-12-01:colheita']);
  });
});

describe('colheitas e fotos', () => {
  it('soma o colhido por unidade', () => {
    expect(
      totalColhido([colheita('a', '2026-12-01', 0.1, 'kg'), colheita('b', '2026-12-02', 0.2, 'kg'), colheita('c', '2026-12-02', 3, 'macos')]),
    ).toEqual([
      { unidade: 'kg', quantidade: 0.3 },
      { unidade: 'macos', quantidade: 3 },
    ]);
  });

  it('reconhece JPEG pelos bytes, não pelo nome', () => {
    expect(ehJpeg(new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0]))).toBe(true);
    expect(ehJpeg(new Uint8Array([0x89, 0x50, 0x4e, 0x47]))).toBe(false);
    expect(ehJpeg(new Uint8Array([0x3c, 0x73, 0x76, 0x67]))).toBe(false); // "<svg"
  });

  it('monta o caminho na pasta do usuário e recusa ids inválidos', () => {
    const u = '00000000-0000-4000-8000-00000000000a';
    const f = uuidV4(new Uint8Array(16).fill(7));
    expect(f).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(caminhoDaFoto(u, f)).toBe(`${u}/${f}.jpg`);
    expect(() => caminhoDaFoto('../outro', f)).toThrow();
  });
});
