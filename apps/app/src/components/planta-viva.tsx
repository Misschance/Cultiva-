import type { EstagioVisual } from '@cultivae/core';
import { useEffect, useRef, useState, type ReactElement } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { useEscuro } from './tema';

/**
 * Planta desenhada em vetor para cada espécie do catálogo, com quatro estágios
 * (broto, folhas, crescendo, colheita), no vaso ou na terra do canteiro.
 * Com rega atrasada, as folhas amarelam, pendem e o balanço para.
 * Respeita a preferência de "reduzir movimento" do sistema.
 */

interface Paleta {
  folha: string;
  clara: string;
  viva: string;
  caule: string;
}

const NOMES: Record<EstagioVisual, string> = {
  broto: 'brotando',
  folhas: 'com as primeiras folhas',
  crescendo: 'crescendo',
  colheita: 'pronta para colher',
};

/** Quanto a terra do canteiro avança além do quadro do desenho (unidades do viewBox). */
const ALCANCE_TERRA = 300;

const ESCALA: Record<Exclude<EstagioVisual, 'broto'>, number> = { folhas: 0.55, crescendo: 0.82, colheita: 1 };

// Folha em gota, da base (x, y) até a ponta (x + dx, y + dy), com largura w.
function folha(x: number, y: number, dx: number, dy: number, w: number): string {
  const comp = Math.hypot(dx, dy) || 1;
  const nx = (-dy / comp) * w;
  const ny = (dx / comp) * w;
  const mx = x + dx * 0.5;
  const my = y + dy * 0.5;
  return `M${x} ${y} Q${mx + nx} ${my + ny} ${x + dx} ${y + dy} Q${mx - nx} ${my - ny} ${x} ${y} Z`;
}

type Desenho = (p: Paleta, colheita: boolean) => ReactElement;

const DESENHOS: Record<string, Desenho> = {
  alface: (p) => (
    <G>
      <Path d="M120 170 C84 168 52 150 50 124 C70 118 96 132 120 170 Z" fill={p.folha} />
      <Path d="M120 170 C156 168 188 150 190 124 C170 118 144 132 120 170 Z" fill={p.folha} />
      <Path d="M120 170 C92 150 74 116 84 92 C104 96 118 128 120 170 Z" fill={p.clara} />
      <Path d="M120 170 C148 150 166 116 156 92 C136 96 122 128 120 170 Z" fill={p.clara} />
      <Path d="M120 170 C108 138 106 104 120 82 C134 104 132 138 120 170 Z" fill={p.viva} />
      <Path d="M58 128 C66 126 72 130 78 128 M162 128 C170 126 176 130 184 128" stroke={p.clara} strokeWidth={3} fill="none" strokeLinecap="round" />
    </G>
  ),
  rucula: (p) => (
    <G>
      {[-58, -34, -12, 12, 34, 58].map((dx, i) => (
        <Path key={dx} d={folha(120, 170, dx, -96 + Math.abs(dx) * 0.5, 13)} fill={i % 2 ? p.clara : p.folha} />
      ))}
      {[-40, 0, 40].map((dx) => (
        <Path key={dx} d={folha(120, 170, dx * 0.6, -74, 9)} fill={p.viva} />
      ))}
    </G>
  ),
  couve: (p) => (
    <G>
      <Path d="M120 172 V70" stroke={p.caule} strokeWidth={8} strokeLinecap="round" />
      <Path d="M120 150 C90 120 50 130 46 154 C70 172 104 166 120 150 Z" fill={p.folha} />
      <Path d="M120 150 C150 120 190 130 194 154 C170 172 136 166 120 150 Z" fill={p.folha} />
      <Path d="M120 112 C94 86 58 94 56 116 C78 134 108 128 120 112 Z" fill={p.clara} />
      <Path d="M120 112 C146 86 182 94 184 116 C162 134 132 128 120 112 Z" fill={p.clara} />
      <Path d="M120 76 C104 48 128 36 140 50 C146 64 136 76 120 76 Z" fill={p.viva} />
      <Path d="M120 76 C102 66 88 52 98 42 C110 38 120 52 120 76 Z" fill={p.viva} />
    </G>
  ),
  tomate: (p, colheita) => (
    <G>
      <Path d="M150 40 V172" stroke="#B88C63" strokeWidth={4} strokeLinecap="round" />
      <Path d="M120 172 C118 140 124 100 120 44" stroke={p.caule} strokeWidth={6} fill="none" strokeLinecap="round" />
      <Path d="M120 150 C100 134 78 138 66 150 C86 164 106 162 120 150 Z" fill={p.folha} />
      <Path d="M120 150 C140 134 162 138 174 150 C154 164 134 162 120 150 Z" fill={p.clara} />
      <Path d="M121 112 C102 96 82 100 74 112 C92 124 110 122 121 112 Z" fill={p.clara} />
      <Path d="M121 112 C140 96 160 100 168 112 C150 124 132 122 121 112 Z" fill={p.folha} />
      <Path d="M120 76 C106 62 92 64 86 74 C100 84 112 84 120 76 Z" fill={p.folha} />
      <Path d="M120 76 C134 62 148 64 154 74 C140 84 128 84 120 76 Z" fill={p.clara} />
      {colheita && (
        <G>
          <Circle cx={94} cy={128} r={10} fill="#D9482F" />
          <Circle cx={106} cy={137} r={9} fill="#C23A24" />
          <Circle cx={146} cy={126} r={10} fill="#D9482F" />
          <Circle cx={136} cy={94} r={8} fill="#E8743E" />
        </G>
      )}
    </G>
  ),
  pimenta: (p, colheita) => (
    <G>
      <Path d="M120 172 V96 M120 130 L96 100 M120 120 L148 92" stroke={p.caule} strokeWidth={5} fill="none" strokeLinecap="round" />
      {[
        [96, 100, -24, -14],
        [96, 100, 6, -26],
        [148, 92, 24, -12],
        [148, 92, -4, -26],
        [120, 96, -14, -26],
        [120, 96, 14, -26],
        [120, 150, -34, -6],
        [120, 146, 34, -8],
      ].map(([x, y, dx, dy], i) => (
        <Path key={i} d={folha(x!, y!, dx!, dy!, 8)} fill={i % 2 ? p.clara : p.folha} />
      ))}
      {colheita && (
        <G>
          <Path d="M102 108 C96 118 94 132 98 140 C104 132 106 120 104 108 Z" fill="#C8281E" />
          <Path d="M140 100 C146 112 146 126 142 134 C136 124 136 112 138 100 Z" fill="#E0442A" />
          <Path d="M124 118 C122 130 124 140 128 146 C132 136 130 126 127 118 Z" fill="#C8281E" />
        </G>
      )}
    </G>
  ),
  cenoura: (p, colheita) => (
    <G>
      {colheita && <Path d="M106 168 C108 156 132 156 134 168 Z" fill="#D9822B" />}
      <Path d="M120 168 C112 130 96 98 80 70" stroke={p.folha} strokeWidth={3} fill="none" strokeLinecap="round" />
      <Path d="M120 168 C120 126 120 90 120 52" stroke={p.viva} strokeWidth={3} fill="none" strokeLinecap="round" />
      <Path d="M120 168 C128 130 144 98 160 70" stroke={p.folha} strokeWidth={3} fill="none" strokeLinecap="round" />
      <Path
        d="M92 92 l-12 -4 M98 110 l-14 -2 M86 78 l-10 -8 M120 80 l-12 -6 M120 100 l12 -6 M120 66 l10 -8 M148 92 l12 -4 M142 110 l14 -2 M154 78 l10 -8"
        stroke={p.clara}
        strokeWidth={5}
        strokeLinecap="round"
      />
    </G>
  ),
  rabanete: (p, colheita) => (
    <G>
      {colheita && <Ellipse cx={120} cy={168} rx={16} ry={11} fill="#C2365A" />}
      <Path d={folha(120, 164, -50, -62, 20)} fill={p.folha} />
      <Path d={folha(120, 164, 50, -62, 20)} fill={p.folha} />
      <Path d={folha(120, 164, -18, -86, 18)} fill={p.clara} />
      <Path d={folha(120, 164, 20, -84, 18)} fill={p.viva} />
    </G>
  ),
  cebolinha: (p) => (
    <G>
      {[-30, -18, -6, 6, 18, 30].map((dx, i) => (
        <Path
          key={dx}
          d={`M${120 + dx * 0.3} 170 C${120 + dx * 0.5} 130 ${120 + dx} 100 ${120 + dx * 1.3} ${60 + (i % 3) * 10}`}
          stroke={i % 2 ? p.clara : p.folha}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </G>
  ),
  salsa: (p) => (
    <G>
      {[
        [-44, -70],
        [-20, -92],
        [6, -100],
        [30, -88],
        [50, -64],
      ].map(([dx, dy], i) => (
        <G key={i}>
          <Path d={`M120 170 Q${120 + dx! * 0.4} ${170 + dy! * 0.6} ${120 + dx!} ${170 + dy!}`} stroke={p.caule} strokeWidth={3} fill="none" strokeLinecap="round" />
          <Circle cx={120 + dx!} cy={170 + dy!} r={11} fill={i % 2 ? p.clara : p.folha} />
          <Circle cx={120 + dx! - 9} cy={170 + dy! + 6} r={8} fill={p.viva} />
          <Circle cx={120 + dx! + 9} cy={170 + dy! + 6} r={8} fill={i % 2 ? p.folha : p.clara} />
        </G>
      ))}
    </G>
  ),
  coentro: (p) => (
    <G>
      {[
        [-50, -58],
        [-26, -84],
        [0, -96],
        [26, -84],
        [50, -58],
      ].map(([dx, dy], i) => (
        <G key={i}>
          <Path d={`M120 170 Q${120 + dx! * 0.3} ${170 + dy! * 0.5} ${120 + dx!} ${170 + dy!}`} stroke={p.caule} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <Path
            d={`M${120 + dx!} ${170 + dy!} m-14 2 a14 12 0 0 1 28 0 l-5 6 l-4 -4 l-5 6 l-5 -6 l-4 4 z`}
            fill={i % 2 ? p.clara : p.viva}
          />
        </G>
      ))}
    </G>
  ),
  manjericao: (p) => (
    <G>
      <Path d="M120 172 C120 140 120 110 120 70" stroke={p.caule} strokeWidth={5} fill="none" strokeLinecap="round" />
      <Path d="M120 150 C104 138 84 140 78 152 C94 162 110 160 120 150 Z" fill={p.folha} />
      <Path d="M120 150 C136 138 156 140 162 152 C146 162 130 160 120 150 Z" fill={p.folha} />
      <Path d="M120 122 C102 108 82 112 76 124 C92 136 110 132 120 122 Z" fill={p.clara} />
      <Path d="M120 122 C138 108 158 112 164 124 C148 136 130 132 120 122 Z" fill={p.clara} />
      <Path d="M120 96 C106 84 90 86 86 96 C98 106 112 104 120 96 Z" fill={p.viva} />
      <Path d="M120 96 C134 84 150 86 154 96 C142 106 128 104 120 96 Z" fill={p.viva} />
      <Path d="M120 72 C112 62 104 62 102 68 C108 74 116 76 120 72 Z M120 72 C128 62 136 62 138 68 C132 74 124 76 120 72 Z" fill={p.viva} />
    </G>
  ),
  hortela: (p) => (
    <G>
      {[
        [-40, -78],
        [0, -100],
        [40, -78],
      ].map(([dx, dy], i) => {
        const tx = 120 + dx!;
        const ty = 170 + dy!;
        return (
          <G key={i}>
            <Path d={`M120 170 Q${120 + dx! * 0.2} ${170 + dy! * 0.5} ${tx} ${ty}`} stroke={p.caule} strokeWidth={3.5} fill="none" strokeLinecap="round" />
            {[0.35, 0.65, 0.95].map((t, j) => {
              const x = 120 + dx! * t;
              const y = 170 + dy! * t;
              return (
                <G key={j}>
                  <Path d={folha(x, y, -18, -6, 7)} fill={j % 2 ? p.clara : p.folha} />
                  <Path d={folha(x, y, 18, -6, 7)} fill={j % 2 ? p.folha : p.clara} />
                </G>
              );
            })}
            <Path d={folha(tx, ty, 0, -14, 6)} fill={p.viva} />
          </G>
        );
      })}
    </G>
  ),
  morango: (p, colheita) => (
    <G>
      {[
        [-46, -60],
        [0, -82],
        [46, -60],
      ].map(([dx, dy], i) => {
        const x = 120 + dx!;
        const y = 170 + dy!;
        return (
          <G key={i}>
            <Path d={`M120 170 Q${120 + dx! * 0.3} ${170 + dy! * 0.6} ${x} ${y}`} stroke={p.caule} strokeWidth={3} fill="none" strokeLinecap="round" />
            <Path d={folha(x, y, -20, -10, 10)} fill={p.folha} />
            <Path d={folha(x, y, 20, -10, 10)} fill={p.clara} />
            <Path d={folha(x, y, 0, -24, 11)} fill={i === 1 ? p.viva : p.folha} />
          </G>
        );
      })}
      {colheita && (
        <G>
          <Path d="M90 150 C82 150 80 160 88 170 C96 162 98 152 90 150 Z" fill="#D2333A" />
          <Path d="M150 148 C142 148 140 158 148 168 C156 160 158 150 150 148 Z" fill="#D2333A" />
          <Path d="M84 150 h12 M144 148 h12" stroke={p.folha} strokeWidth={3} strokeLinecap="round" />
        </G>
      )}
    </G>
  ),
};

function useMenosMovimento(): boolean {
  const [menos, setMenos] = useState(false);
  useEffect(() => {
    let ativo = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => ativo && setMenos(v))
      .catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setMenos);
    return () => {
      ativo = false;
      sub.remove();
    };
  }, []);
  return menos;
}

export function PlantaViva({
  especieId,
  nome,
  estagio,
  sede = false,
  chao = false,
  tamanho = 200,
}: {
  especieId: string;
  nome: string;
  estagio: EstagioVisual;
  sede?: boolean;
  chao?: boolean;
  tamanho?: number;
}) {
  const escuro = useEscuro();
  const menosMovimento = useMenosMovimento();
  const balanco = useRef(new Animated.Value(0)).current;
  const entrada = useRef(new Animated.Value(menosMovimento ? 1 : 0.9)).current;
  const nativo = Platform.OS !== 'web';

  useEffect(() => {
    if (sede || menosMovimento) {
      balanco.stopAnimation();
      balanco.setValue(0.5);
      return;
    }
    const meia = { duration: 2250, easing: Easing.inOut(Easing.sin), useNativeDriver: nativo };
    const loop = Animated.loop(Animated.sequence([Animated.timing(balanco, { toValue: 1, ...meia }), Animated.timing(balanco, { toValue: 0, ...meia })]));
    loop.start();
    return () => loop.stop();
  }, [sede, menosMovimento, balanco, nativo]);

  // Ao mudar de estágio, a planta "cresce" com uma mola curta.
  useEffect(() => {
    if (menosMovimento) {
      entrada.setValue(1);
      return;
    }
    entrada.setValue(0.9);
    Animated.spring(entrada, { toValue: 1, friction: 5, tension: 80, useNativeDriver: nativo }).start();
  }, [estagio, menosMovimento, entrada, nativo]);

  const p: Paleta = sede
    ? { folha: '#8E9A4E', clara: '#B5B46A', viva: '#A3A65A', caule: '#7C8446' }
    : escuro
      ? { folha: '#4F8A55', clara: '#7DB07A', viva: '#9CCB86', caule: '#5E8A55' }
      : { folha: '#2E5E3A', clara: '#5E8F5A', viva: '#7FAE6B', caule: '#3E6B40' };
  const terra = escuro ? { topo: '#4A3A2C', fundo: '#3A2D22', grao: '#5E4A38' } : { topo: '#8A6A4F', fundo: '#6E5440', grao: '#A3826A' };

  const desenho = DESENHOS[especieId];
  const s = estagio === 'broto' || !desenho ? 1 : ESCALA[estagio];
  const transformacao = `translate(${120 * (1 - s)} ${172 * (1 - s)}) scale(${s})${sede ? ' rotate(6 120 172)' : ''}`;
  const rotacao = balanco.interpolate({ inputRange: [0, 1], outputRange: ['-2deg', '2deg'] });
  const rotulo = `${nome} ${NOMES[estagio]}${sede ? ', com sede' : ''}${chao ? ', no canteiro' : ', no vaso'}`;

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={rotulo} style={{ width: tamanho, height: tamanho }}>
      <Animated.View
        style={{
          position: 'absolute',
          width: tamanho,
          height: tamanho,
          transformOrigin: '50% 71.7%',
          transform: [{ rotate: rotacao }, { scale: entrada }],
        }}
      >
        <Svg width={tamanho} height={tamanho} viewBox="0 0 240 240">
          {estagio === 'broto' || !desenho ? (
            <G>
              <Path d="M120 172 C120 160 120 152 121 144" stroke={p.caule} strokeWidth={4} fill="none" strokeLinecap="round" />
              <Path d="M121 146 C108 136 96 138 92 146 C104 152 114 151 121 146 Z" fill={p.folha} />
              <Path d="M121 146 C134 136 146 138 150 146 C138 152 128 151 121 146 Z" fill={p.clara} />
            </G>
          ) : (
            <G transform={transformacao}>{desenho(p, estagio === 'colheita')}</G>
          )}
        </Svg>
      </Animated.View>
      {chao ? (
        // A terra passa das bordas do desenho: quem contém a planta corta com overflow hidden.
        <Svg
          width={tamanho * (ALCANCE_TERRA * 2 + 240) / 240}
          height={tamanho}
          viewBox={`${-ALCANCE_TERRA} 0 ${ALCANCE_TERRA * 2 + 240} 240`}
          style={{ position: 'absolute', left: (-tamanho * ALCANCE_TERRA) / 240 }}
        >
          <Path d={`M${-ALCANCE_TERRA} 178 H70 C92 166 148 166 170 178 H${240 + ALCANCE_TERRA} V240 H${-ALCANCE_TERRA} Z`} fill={terra.topo} />
          <Path d={`M${-ALCANCE_TERRA} 198 H${240 + ALCANCE_TERRA} V240 H${-ALCANCE_TERRA} Z`} fill={terra.fundo} />
          {[
            [34, 188, 3],
            [62, 210, 2.5],
            [186, 186, 3],
            [210, 212, 2.5],
            [140, 220, 2],
            [-40, 190, 3],
            [290, 192, 3],
          ].map(([cx, cy, r]) => (
            <Circle key={`${cx}`} cx={cx} cy={cy} r={r} fill={terra.grao} />
          ))}
        </Svg>
      ) : (
        <Svg width={tamanho} height={tamanho} viewBox="0 0 240 240" style={{ position: 'absolute' }}>
          <Ellipse cx={120} cy={228} rx={62} ry={6} fill="#000000" opacity={escuro ? 0.3 : 0.08} />
          <Path d="M72 172 H168 L158 226 H82 Z" fill="#C9A27E" />
          <Rect x={66} y={164} width={108} height={14} rx={5} fill="#B88C63" />
          <Path d="M74 166 C96 160 144 160 166 166" stroke="#6E5440" strokeWidth={3} fill="none" strokeLinecap="round" />
        </Svg>
      )}
    </View>
  );
}

/** Espécies com desenho próprio (as demais aparecem como broto genérico). */
export const ESPECIES_DESENHADAS = Object.keys(DESENHOS);
