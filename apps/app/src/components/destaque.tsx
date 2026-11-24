import { Pressable, View } from 'react-native';
import type { ResumoPlanta } from '../lib/visual';
import { PlantaViva } from './planta-viva';
import { BarraProgresso, Selo, Texto, fontes, useCores } from './ui';

function Status({ rotulo, valor, alerta }: { rotulo: string; valor: string; alerta?: boolean }) {
  const c = useCores();
  return (
    <View style={{ flex: 1, gap: 2, padding: 10, borderRadius: 14, backgroundColor: alerta ? c.fundoAlerta : c.superficie }}>
      <Texto style={{ fontSize: 12, color: alerta ? c.alerta : c.textoSuave }}>{rotulo}</Texto>
      <Texto style={{ fontSize: 18, fontFamily: fontes.titulo, color: alerta ? c.alerta : c.texto }}>{valor}</Texto>
    </View>
  );
}

function Seta({ texto, rotulo, onPress }: { texto: string; rotulo: string; onPress: () => void }) {
  const c = useCores();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      hitSlop={4}
      style={({ pressed }) => ({
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: c.borda,
        backgroundColor: c.cartao,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ scale: pressed ? 0.92 : 1 }],
      })}
    >
      <Texto style={{ fontSize: 22, lineHeight: 24 }}>{texto}</Texto>
    </Pressable>
  );
}

/** Cartão da tela Hoje: a planta animada com rega, sol, colheita e progresso. */
export function DestaquePlanta({
  resumo,
  especieId,
  local,
  indice,
  total,
  onAnterior,
  onProxima,
  onAbrir,
}: {
  resumo: ResumoPlanta;
  especieId: string;
  local: string;
  indice: number;
  total: number;
  onAnterior: () => void;
  onProxima: () => void;
  onAbrir: () => void;
}) {
  const c = useCores();
  const { visual } = resumo;
  return (
    <View style={{ backgroundColor: c.cartao, borderWidth: 1, borderColor: c.borda, borderRadius: 24, padding: 16, gap: 12 }}>
      <Pressable onPress={onAbrir} accessibilityRole="button" accessibilityLabel={`Abrir ${resumo.nome}`} style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <View style={{ flexShrink: 1, gap: 2 }}>
            <Texto style={{ fontSize: 22, fontFamily: fontes.titulo }}>{resumo.nome}</Texto>
            <Texto style={{ fontSize: 13, color: c.textoSuave }}>{local}</Texto>
          </View>
          <Selo texto={resumo.selo.texto} alerta={resumo.selo.alerta} />
        </View>
        <View style={{ height: 200, borderRadius: 18, backgroundColor: c.superficie, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <PlantaViva especieId={especieId} nome={resumo.nome} estagio={visual.estagio} sede={resumo.sede} chao={resumo.chao} tamanho={210} />
        </View>
      </Pressable>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Status rotulo="Rega" valor={resumo.rega} alerta={resumo.sede} />
        <Status rotulo="Sol" valor={resumo.sol} />
        <Status rotulo="Colheita" valor={resumo.colheita} />
      </View>
      {visual.progresso !== null && (
        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Texto style={{ fontSize: 13, color: c.textoSuave }}>
              Dia {visual.dia} · {resumo.fase}
            </Texto>
            <Texto style={{ fontSize: 13, color: c.textoSuave, fontWeight: '600' }}>{Math.round(visual.progresso * 100)}%</Texto>
          </View>
          <BarraProgresso valor={visual.progresso} alerta={resumo.sede} rotulo={`${resumo.nome}: caminho até a colheita`} />
        </View>
      )}
      {total > 1 && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
          <Seta texto="‹" rotulo="Planta anterior" onPress={onAnterior} />
          <View style={{ flexDirection: 'row', gap: 6 }} accessibilityLabel={`Planta ${indice + 1} de ${total}`}>
            {Array.from({ length: Math.min(total, 8) }, (_, k) => (
              <View key={k} style={{ width: k === Math.min(indice, 7) ? 22 : 8, height: 8, borderRadius: 4, backgroundColor: k === Math.min(indice, 7) ? c.verde : c.trilho }} />
            ))}
          </View>
          <Seta texto="›" rotulo="Próxima planta" onPress={onProxima} />
        </View>
      )}
    </View>
  );
}
