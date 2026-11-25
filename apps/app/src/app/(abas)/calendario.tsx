import {
  calendarioDoMes,
  diaDaSemana,
  gradeDoMes,
  mesDe,
  somarMeses,
  type DataISO,
  type Especie,
  type EventoCalendario,
  type TipoAcao,
  type TipoEvento,
} from '@cultivae/core';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Carregando, ComLargura, Colunas, Paragrafo, Tela, Texto, Titulo, fontes, useCores, useEscuro } from '../../components/ui';
import { ESPECIES, useHorta } from '../../lib/horta';

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const SEMANA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const maiuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const INICIAIS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const FEITO: Record<TipoAcao, string> = {
  rega: 'Regada',
  adubacao: 'Adubada',
  poda: 'Podada',
  desbaste: 'Desbaste feito',
  tutoramento: 'Tutorada',
  transplante: 'Transplantada',
  colheita: 'Colheita registrada',
};

type Grupo = 'rega' | 'colheita' | 'plantio' | 'ciclo' | 'feito';

const GRUPO: Record<TipoEvento, Grupo> = {
  'rega-prevista': 'rega',
  'colheita-prevista': 'colheita',
  plantio: 'plantio',
  germinacao: 'ciclo',
  fase: 'ciclo',
  feito: 'feito',
};

const LEGENDA: { grupo: Grupo; texto: string }[] = [
  { grupo: 'rega', texto: 'Rega prevista' },
  { grupo: 'colheita', texto: 'Colheita' },
  { grupo: 'ciclo', texto: 'Germinação e fases' },
  { grupo: 'plantio', texto: 'Plantio' },
  { grupo: 'feito', texto: 'Feito' },
];

function useCoresGrupo(): Record<Grupo, string> {
  const c = useCores();
  const escuro = useEscuro();
  return {
    rega: escuro ? '#7FB6E6' : '#3F7FB5',
    colheita: escuro ? '#F29A62' : '#D2642C',
    ciclo: c.barraAlerta,
    plantio: c.verde,
    feito: c.textoSuave,
  };
}

function descrever(ev: EventoCalendario, hoje: DataISO): string {
  switch (ev.tipo) {
    case 'rega-prevista':
      return ev.data === hoje ? 'Regar hoje' : 'Regar';
    case 'colheita-prevista':
      return 'A colheita pode começar';
    case 'germinacao':
      return 'Pode começar a germinar: confira a terra';
    case 'fase':
      return `Entra na fase ${ev.fase}`;
    case 'plantio':
      return 'Plantada';
    case 'feito':
      return ev.acao ? FEITO[ev.acao] : 'Ação registrada';
  }
}

/** Junta os eventos do dia que dizem a mesma coisa: "Regar hoje" com todas as plantas. */
function agrupar(eventos: EventoCalendario[], hoje: DataISO): { titulo: string; grupo: Grupo; plantios: string[] }[] {
  const grupos = new Map<string, { titulo: string; grupo: Grupo; plantios: string[] }>();
  for (const ev of eventos) {
    const titulo = descrever(ev, hoje);
    const g = grupos.get(titulo) ?? { titulo, grupo: GRUPO[ev.tipo], plantios: [] };
    if (!g.plantios.includes(ev.plantioId)) g.plantios.push(ev.plantioId);
    grupos.set(titulo, g);
  }
  return [...grupos.values()];
}

function Seta({ direcao, onPress, rotulo }: { direcao: 'esq' | 'dir'; onPress: () => void; rotulo: string }) {
  const c = useCores();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      hitSlop={8}
      style={({ pressed }) => ({ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: c.borda, backgroundColor: c.cartao, opacity: pressed ? 0.6 : 1 })}
    >
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={c.texto} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d={direcao === 'esq' ? 'M15 18l-6-6 6-6' : 'M9 6l6 6-6 6'} />
      </Svg>
    </Pressable>
  );
}

/** Calendário do mês: o que foi feito e o que vem pela frente em cada dia, para toda a horta. */
export default function Calendario() {
  const c = useCores();
  const corGrupo = useCoresGrupo();
  const { dados, hoje, locais } = useHorta();
  const [mes, setMes] = useState(() => mesDe(hoje));
  const [escolhido, setEscolhido] = useState<DataISO>(hoje);

  const dias = useMemo(() => {
    if (!dados) return [];
    return calendarioDoMes({
      plantios: dados.plantios,
      especies: ESPECIES as ReadonlyMap<string, Especie>,
      locais,
      registros: dados.registros,
      hoje,
      mes,
    });
  }, [dados, locais, hoje, mes]);

  if (!dados) return <Carregando />;

  const porData = new Map(dias.map((d) => [d.data, d.eventos]));
  const grade = gradeDoMes(mes);
  const [ano, numMes] = mes.split('-').map(Number) as [number, number];
  const eventosDoDia = porData.get(escolhido) ?? [];
  const nomePlantio = (id: string) => {
    const p = dados.plantios.find((x) => x.id === id);
    return p ? p.apelido || ESPECIES.get(p.especieId)?.nomePopular || 'Planta' : 'Planta';
  };
  const irPara = (n: number) => {
    const novo = somarMeses(mes, n);
    setMes(novo);
    setEscolhido(mesDe(hoje) === novo ? hoje : `${novo}-01`);
  };
  const [, mEsc, dEsc] = escolhido.split('-').map(Number) as [number, number, number];

  return (
    <Tela topo largura="larga">
      <Titulo>Calendário</Titulo>

      <Colunas
        fixa="direita"
        larguraFixa={380}
        grudar
        esquerda={
          // No computador os dias ficam mais altos, para o mês ocupar bem a coluna.
          <ComLargura>
            {(largura) => {
              const alturaDia = largura >= 560 ? 76 : 52;
              return (
          <>
            <View style={{ borderRadius: 24, backgroundColor: c.cartao, borderWidth: 1, borderColor: c.borda, padding: 14, gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Seta direcao="esq" rotulo="Mês anterior" onPress={() => irPara(-1)} />
                <Pressable onPress={() => { setMes(mesDe(hoje)); setEscolhido(hoje); }} accessibilityRole="button" accessibilityLabel="Voltar para hoje">
                  <Texto style={{ fontFamily: fontes.titulo, fontSize: 20, textAlign: 'center' }}>
                    {maiuscula(MESES[numMes - 1]!)} {ano}
                  </Texto>
                </Pressable>
                <Seta direcao="dir" rotulo="Próximo mês" onPress={() => irPara(1)} />
              </View>

              <View style={{ flexDirection: 'row' }}>
                {INICIAIS.map((l, i) => (
                  <Texto key={i} style={{ flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600', color: c.textoSuave }}>
                    {l}
                  </Texto>
                ))}
              </View>

              {grade.map((semana, i) => (
                <View key={i} style={{ flexDirection: 'row' }}>
                  {semana.map((data, j) => {
                    if (!data) return <View key={j} style={{ flex: 1, height: alturaDia }} />;
                    const eventos = porData.get(data) ?? [];
                    const grupos = [...new Set(eventos.map((e) => GRUPO[e.tipo]))].slice(0, 4);
                    const ehHoje = data === hoje;
                    const sel = data === escolhido;
                    const passado = data < hoje;
                    return (
                      <Pressable
                        key={j}
                        onPress={() => setEscolhido(data)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: sel }}
                        accessibilityLabel={`${Number(data.slice(8))} de ${MESES[numMes - 1]}${eventos.length ? `, ${eventos.length} ${eventos.length === 1 ? 'evento' : 'eventos'}` : ''}`}
                        style={{ flex: 1, height: alturaDia, alignItems: 'center', paddingTop: 4, gap: 4 }}
                      >
                        <View
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 17,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: ehHoje ? c.verde : sel ? c.verdeClaro : 'transparent',
                            borderWidth: sel && !ehHoje ? 1.5 : 0,
                            borderColor: c.verde,
                          }}
                        >
                          <Texto style={{ fontSize: 15, fontWeight: ehHoje || sel ? '600' : '400', color: ehHoje ? c.sobreVerde : passado ? c.textoSuave : c.texto }}>
                            {Number(data.slice(8))}
                          </Texto>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 3, height: 6 }}>
                          {grupos.map((g) => (
                            <View key={g} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: corGrupo[g] }} />
                          ))}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 14, rowGap: 6 }}>
              {LEGENDA.map((l) => (
                <View key={l.grupo} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: corGrupo[l.grupo] }} />
                  <Texto style={{ fontSize: 13, color: c.textoSuave }}>{l.texto}</Texto>
                </View>
              ))}
            </View>
          </>
              );
            }}
          </ComLargura>
        }
      >
        <View style={{ gap: 10 }}>
          <Texto style={{ fontFamily: fontes.titulo, fontSize: 20 }}>
            {escolhido === hoje ? 'Hoje, ' : ''}
            {escolhido === hoje ? SEMANA[diaDaSemana(escolhido)] : maiuscula(SEMANA[diaDaSemana(escolhido)]!)}, {dEsc} de {MESES[mEsc - 1]}
          </Texto>
          {eventosDoDia.length === 0 ? (
            <Paragrafo suave>Nada marcado para este dia.</Paragrafo>
          ) : (
            agrupar(eventosDoDia, hoje).map((g) => (
              <View
                key={g.titulo}
                style={{ flexDirection: 'row', gap: 12, padding: 14, borderRadius: 20, backgroundColor: c.cartao, borderWidth: 1, borderColor: c.borda }}
              >
                <View style={{ width: 4, borderRadius: 2, backgroundColor: corGrupo[g.grupo] }} />
                <View style={{ flex: 1, gap: 8 }}>
                  <Texto style={{ fontSize: 15, fontWeight: '600' }}>{g.titulo}</Texto>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    {g.plantios.map((id) => (
                      <Pressable
                        key={id}
                        onPress={() => router.push({ pathname: '/plantio/[id]', params: { id } })}
                        accessibilityRole="link"
                        style={({ pressed }) => ({ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: c.superficie, opacity: pressed ? 0.6 : 1 })}
                      >
                        <Texto style={{ fontSize: 14 }}>{nomePlantio(id)}</Texto>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>
            ))
          )}
          <Paragrafo suave>
            As regas previstas seguem o intervalo da ficha de cada planta e se ajustam com o clima e com as regas que você registrar.
          </Paragrafo>
        </View>
      </Colunas>
    </Tela>
  );
}
