import { useEffect, useRef, useState, type ReactElement } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { useEscuro } from './tema';

/**
 * Desenho em vetor de cada planta de casa, num vaso de cerâmica, com o mesmo
 * balanço leve das plantas da horta. Respeita "reduzir movimento".
 */

interface Cor {
  folha: string;
  clara: string;
  escura: string;
  caule: string;
}

// Folha em gota da base (x, y) até a ponta (x + dx, y + dy), com largura w.
function folha(x: number, y: number, dx: number, dy: number, w: number): string {
  const comp = Math.hypot(dx, dy) || 1;
  const nx = (-dy / comp) * w;
  const ny = (dx / comp) * w;
  const mx = x + dx * 0.5;
  const my = y + dy * 0.5;
  return `M${x} ${y} Q${mx + nx} ${my + ny} ${x + dx} ${y + dy} Q${mx - nx} ${my - ny} ${x} ${y} Z`;
}

// Folha em coração, presa pelo topo em (x, y), apontando para baixo.
const coracao = (x: number, y: number, s: number) =>
  `M${x} ${y} C${x - 10 * s} ${y - 8 * s} ${x - 18 * s} ${y + 6 * s} ${x} ${y + 20 * s} C${x + 18 * s} ${y + 6 * s} ${x + 10 * s} ${y - 8 * s} ${x} ${y} Z`;

type Desenho = (c: Cor) => ReactElement;

const BASE = 168;

const DESENHOS: Record<string, Desenho> = {
  jiboia: (c) => (
    <G>
      <Path d={`M100 ${BASE} C70 170 56 196 60 226`} stroke={c.caule} strokeWidth={3} fill="none" strokeLinecap="round" />
      <Path d={`M140 ${BASE} C172 172 186 196 182 222`} stroke={c.caule} strokeWidth={3} fill="none" strokeLinecap="round" />
      {[[64, 186, 1], [58, 210, 0.9], [178, 186, 1], [184, 208, 0.85]].map(([x, y, s], i) => (
        <Path key={i} d={coracao(x!, y!, s!)} fill={i % 2 ? c.clara : c.folha} />
      ))}
      {[[96, 120, 1.3], [120, 104, 1.4], [144, 122, 1.3], [108, 144, 1.1], [134, 146, 1.1]].map(([x, y, s], i) => (
        <G key={`c${i}`}>
          <Path d={`M120 ${BASE} L${x} ${y! + 4}`} stroke={c.caule} strokeWidth={2.5} />
          <Path d={coracao(x!, y!, s!)} fill={i % 2 ? c.folha : c.clara} />
          <Path d={`M${x! - 4} ${y! + 10} q6 4 10 -2`} stroke="#E8E2A8" strokeWidth={2} fill="none" opacity={0.7} />
        </G>
      ))}
    </G>
  ),
  samambaia: (c) => (
    <G>
      {[-70, -45, -20, 0, 20, 45, 70].map((dx, i) => {
        const fx = 120 + dx * 1.2;
        const fy = 96 + Math.abs(dx) * 0.9;
        return (
          <G key={dx}>
            <Path d={`M120 ${BASE} Q${120 + dx * 0.3} ${fy - 30} ${fx} ${fy}`} stroke={c.caule} strokeWidth={2.5} fill="none" />
            {[0.25, 0.45, 0.65, 0.82].map((t) => {
              const px = 120 + (fx - 120) * t;
              const py = BASE + (fy - BASE) * t - Math.sin(t * Math.PI) * 18;
              return (
                <G key={t}>
                  <Path d={folha(px, py, -12, -6, 3.5)} fill={i % 2 ? c.clara : c.folha} />
                  <Path d={folha(px, py, 12, -6, 3.5)} fill={i % 2 ? c.folha : c.clara} />
                </G>
              );
            })}
          </G>
        );
      })}
    </G>
  ),
  espada_sao_jorge: (c) => (
    <G>
      {[[-30, -100, 11], [-12, -128, 12], [8, -118, 12], [26, -92, 11], [-2, -80, 10]].map(([dx, dy, w], i) => (
        <G key={i}>
          <Path d={folha(120 + dx! * 0.3, BASE, dx!, dy!, w!)} fill={i % 2 ? c.escura : c.folha} />
          <Path d={folha(120 + dx! * 0.3, BASE, dx!, dy!, w! * 0.92)} fill="none" stroke="#D9C766" strokeWidth={2} opacity={0.8} />
        </G>
      ))}
    </G>
  ),
  zamioculca: (c) => (
    <G>
      {[[-46, -86], [-18, -112], [12, -118], [42, -90]].map(([dx, dy], i) => {
        const x2 = 120 + dx!;
        const y2 = BASE + dy!;
        return (
          <G key={i}>
            <Path d={`M120 ${BASE} Q${120 + dx! * 0.4} ${BASE + dy! * 0.6} ${x2} ${y2}`} stroke={c.caule} strokeWidth={4} fill="none" strokeLinecap="round" />
            {[0.35, 0.55, 0.75, 0.95].map((t) => {
              const px = 120 + dx! * t;
              const py = BASE + dy! * t;
              return (
                <G key={t}>
                  <Path d={folha(px, py, -13, -5, 5)} fill={c.escura} />
                  <Path d={folha(px, py, 13, -5, 5)} fill={c.folha} />
                </G>
              );
            })}
          </G>
        );
      })}
    </G>
  ),
  comigo_ninguem_pode: (c) => (
    <G>
      {[[-50, -70, 20], [50, -66, 20], [-22, -108, 22], [24, -104, 22]].map(([dx, dy, w], i) => (
        <G key={i}>
          <Path d={folha(120, BASE, dx!, dy!, w!)} fill={c.folha} />
          {[0.35, 0.55, 0.72].map((t) => (
            <Ellipse key={t} cx={120 + dx! * t} cy={BASE + dy! * t} rx={6} ry={3} fill="#E9EDC7" opacity={0.8} />
          ))}
        </G>
      ))}
    </G>
  ),
  lirio_da_paz: (c) => (
    <G>
      {[[-54, -64, 15], [54, -62, 15], [-28, -96, 16], [30, -92, 16]].map(([dx, dy, w], i) => (
        <Path key={i} d={folha(120, BASE, dx!, dy!, w!)} fill={i % 2 ? c.folha : c.escura} />
      ))}
      <Path d={`M120 ${BASE} L122 78`} stroke={c.caule} strokeWidth={3} />
      <Path d="M122 56 C104 66 106 92 122 100 C138 92 140 66 122 56 Z" fill="#F6F4EC" />
      <Rect x={119} y={70} width={6} height={20} rx={3} fill="#E9D98A" />
    </G>
  ),
  costela_de_adao: (c) => (
    <G>
      {[[-44, -84, 30], [44, -80, 30], [0, -112, 30]].map(([dx, dy, w], i) => {
        const cx = 120 + dx! * 0.8;
        const cy = BASE + dy! * 0.8;
        return (
          <G key={i}>
            <Path d={`M120 ${BASE} L${cx} ${cy + w! * 0.6}`} stroke={c.caule} strokeWidth={3} />
            <Circle cx={cx} cy={cy} r={w!} fill={i === 2 ? c.clara : c.folha} />
            {[-1, 1].map((lado) =>
              [0.35, 0.7].map((t) => (
                <Ellipse key={`${lado}${t}`} cx={cx + lado * w! * 0.62} cy={cy - w! * 0.5 + t * w!} rx={6} ry={2.5} fill="#F0ECE1" opacity={0.9} />
              )),
            )}
            <Path d={`M${cx} ${cy - w! * 0.9} L${cx} ${cy + w! * 0.9}`} stroke={c.escura} strokeWidth={2} />
          </G>
        );
      })}
    </G>
  ),
  clorofito: (c) => (
    <G>
      {[-80, -60, -40, -20, 0, 20, 40, 60, 80].map((dx, i) => (
        <G key={dx}>
          <Path d={`M120 ${BASE} Q${120 + dx * 0.5} ${100 - (40 - Math.abs(dx) * 0.4)} ${120 + dx} ${BASE - 40 + Math.abs(dx) * 0.6}`} stroke={i % 2 ? c.folha : c.clara} strokeWidth={6} fill="none" strokeLinecap="round" />
          <Path d={`M120 ${BASE} Q${120 + dx * 0.5} ${100 - (40 - Math.abs(dx) * 0.4)} ${120 + dx} ${BASE - 40 + Math.abs(dx) * 0.6}`} stroke="#F2F0DC" strokeWidth={1.6} fill="none" strokeLinecap="round" />
        </G>
      ))}
    </G>
  ),
  babosa: (c) => (
    <G>
      {[[-52, -70, 10], [52, -68, 10], [-26, -104, 11], [26, -100, 11], [0, -118, 11]].map(([dx, dy, w], i) => (
        <G key={i}>
          <Path d={folha(120, BASE, dx!, dy!, w!)} fill={i % 2 ? c.clara : c.folha} />
          {[0.3, 0.5, 0.7].map((t) => (
            <Circle key={t} cx={120 + dx! * t} cy={BASE + dy! * t} r={1.6} fill="#EDF1D8" />
          ))}
        </G>
      ))}
    </G>
  ),
  anturio: (c) => (
    <G>
      {[[-50, -70, 18], [48, -64, 18], [-14, -100, 18]].map(([dx, dy, w], i) => (
        <Path key={i} d={folha(120, BASE, dx!, dy!, w!)} fill={i % 2 ? c.folha : c.escura} />
      ))}
      <Path d={`M120 ${BASE} Q140 120 146 92`} stroke={c.caule} strokeWidth={3} fill="none" />
      <Path d="M146 74 C126 70 122 96 146 104 C170 96 166 70 146 74 Z" fill="#D8333F" />
      <Path d="M146 88 L156 70" stroke="#F1D27A" strokeWidth={5} strokeLinecap="round" />
    </G>
  ),
  orquidea: (c) => (
    <G>
      <Path d={folha(120, BASE - 4, -46, -10, 12)} fill={c.folha} />
      <Path d={folha(120, BASE - 4, 46, -12, 12)} fill={c.escura} />
      <Path d={`M120 ${BASE - 6} Q112 90 150 58`} stroke={c.caule} strokeWidth={2.5} fill="none" />
      <Path d="M120 160 L124 64" stroke="#B88C63" strokeWidth={2} />
      {[[124, 96], [138, 74], [154, 56]].map(([x, y], i) => (
        <G key={i}>
          {[0, 72, 144, 216, 288].map((a) => (
            <Ellipse key={a} cx={x!} cy={y! - 8} rx={6} ry={10} fill="#E7A6D0" transform={`rotate(${a} ${x} ${y})`} />
          ))}
          <Circle cx={x} cy={y} r={4} fill="#B2457E" />
        </G>
      ))}
    </G>
  ),
  suculentas: (c) => (
    <G>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <Path key={a} d={folha(120, 146, 0, -32, 12)} fill={c.clara} transform={`rotate(${a} 120 146) scale(1 1)`} opacity={0.95} />
      ))}
      {[22, 67, 112, 157, 202, 247, 292, 337].map((a) => (
        <Path key={a} d={folha(120, 146, 0, -22, 9)} fill={c.folha} transform={`rotate(${a} 120 146)`} />
      ))}
      <Circle cx={120} cy={146} r={7} fill={c.escura} />
    </G>
  ),
  cacto: (c) => (
    <G>
      <Rect x={104} y={70} width={32} height={102} rx={16} fill={c.folha} />
      <Path d="M104 128 H90 a10 10 0 0 1 -10 -10 V98 a8 8 0 0 1 16 0 V112 H104" fill={c.folha} />
      <Path d="M136 112 H150 a10 10 0 0 0 10 -10 V86 a8 8 0 0 0 -16 0 V98 H136" fill={c.clara} />
      {[84, 100, 116, 132, 148].map((y) => (
        <G key={y}>
          <Path d={`M112 ${y} l-4 -3 M128 ${y + 6} l4 -3`} stroke="#F3EBD0" strokeWidth={1.5} strokeLinecap="round" />
        </G>
      ))}
      <Path d="M120 70 V172" stroke={c.escura} strokeWidth={2} opacity={0.5} />
      <Circle cx={120} cy={68} r={6} fill="#E36C8A" />
    </G>
  ),
};

function useMenosMovimento(): boolean {
  const [menos, setMenos] = useState(false);
  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setMenos, () => undefined);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setMenos);
    return () => sub.remove();
  }, []);
  return menos;
}

export function CasaViva({ plantaId, nome, tamanho = 200 }: { plantaId: string; nome: string; tamanho?: number }) {
  const escuro = useEscuro();
  const menos = useMenosMovimento();
  const balanco = useRef(new Animated.Value(0.5)).current;
  const nativo = Platform.OS !== 'web';

  useEffect(() => {
    if (menos) {
      balanco.setValue(0.5);
      return;
    }
    const meia = { duration: 2600, easing: Easing.inOut(Easing.sin), useNativeDriver: nativo };
    const loop = Animated.loop(Animated.sequence([Animated.timing(balanco, { toValue: 1, ...meia }), Animated.timing(balanco, { toValue: 0, ...meia })]));
    loop.start();
    return () => loop.stop();
  }, [menos, balanco, nativo]);

  const c: Cor = escuro
    ? { folha: '#4F8A55', clara: '#7DB07A', escura: '#356B3E', caule: '#5E8A55' }
    : { folha: '#2E6B3A', clara: '#5E9A5A', escura: '#1F4D2A', caule: '#3E6B40' };
  const desenho = DESENHOS[plantaId];
  const rotate = balanco.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={`${nome} no vaso`} style={{ width: tamanho, height: tamanho }}>
      <Animated.View style={{ position: 'absolute', width: tamanho, height: tamanho, transformOrigin: '50% 70%', transform: [{ rotate }] }}>
        <Svg width={tamanho} height={tamanho} viewBox="0 0 240 240">
          {desenho ? desenho(c) : <Path d={folha(120, BASE, 0, -60, 16)} fill={c.folha} />}
        </Svg>
      </Animated.View>
      <Svg width={tamanho} height={tamanho} viewBox="0 0 240 240" style={{ position: 'absolute' }}>
        <Ellipse cx={120} cy={228} rx={56} ry={6} fill="#000" opacity={escuro ? 0.3 : 0.08} />
        <Path d="M80 168 H160 L152 224 Q150 228 146 228 H94 Q90 228 88 224 Z" fill={escuro ? '#D9D4C7' : '#EFEAE0'} />
        <Rect x={76} y={162} width={88} height={12} rx={6} fill={escuro ? '#C9C3B4' : '#E2DCCF'} />
        <Path d="M86 196 H154" stroke={escuro ? '#B8B1A0' : '#D4CDBE'} strokeWidth={3} />
      </Svg>
    </View>
  );
}
