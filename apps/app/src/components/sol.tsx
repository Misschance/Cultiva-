import { horasDeSol, periodoDoSol, type PeriodoSol } from '@cultivae/core';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Campo, Opcoes, Paragrafo } from './ui';

type Modo = 'horarios' | 'horas' | 'nao-sei';

const NOME_PERIODO: Record<PeriodoSol, string> = {
  manha: 'sol da manhã',
  tarde: 'sol da tarde',
  'manha-e-tarde': 'sol de manhã e à tarde',
};

const numero = (t: string) => {
  const n = Number(t.replace(',', '.'));
  return t.trim() === '' || !Number.isFinite(n) ? null : n;
};

/**
 * Questionário de luz do local (RF-5.2). A pessoa diz de que horas a que horas o sol
 * bate direto, ou digita as horas se já souber. Devolve as horas (ou null) por `onChange`,
 * e `invalido` quando o que foi digitado não dá para entender.
 */
export function PerguntaSol({
  inicial,
  onChange,
}: {
  inicial?: number | null;
  onChange: (horas: number | null, invalido: boolean) => void;
}) {
  const [modo, setModo] = useState<Modo>(inicial != null ? 'horas' : 'horarios');
  const [de, setDe] = useState('');
  const [ate, setAte] = useState('');
  const [horas, setHoras] = useState(inicial != null ? String(inicial).replace('.', ',') : '');

  const preenchido = modo === 'horarios' ? de.trim() !== '' || ate.trim() !== '' : modo === 'horas' && horas.trim() !== '';
  const calculado =
    modo === 'horarios' ? horasDeSol(de, ate) : modo === 'horas' ? numero(horas) : null;
  const invalido = preenchido && (calculado == null || calculado < 0 || calculado > 24);
  const periodo = modo === 'horarios' ? periodoDoSol(de, ate) : null;

  useEffect(() => {
    onChange(invalido ? null : calculado, invalido);
  }, [calculado, invalido, onChange]);

  return (
    <View style={{ gap: 8 }}>
      <Opcoes
        rotulo="Sol direto no local"
        valor={modo}
        onChange={setModo}
        opcoes={[
          { valor: 'horarios', texto: 'Sei os horários' },
          { valor: 'horas', texto: 'Sei as horas' },
          { valor: 'nao-sei', texto: 'Ainda não sei' },
        ]}
      />
      {modo === 'horarios' && (
        <>
          <Paragrafo suave>Num dia de sol, veja quando o sol começa e para de bater direto no local.</Paragrafo>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Campo rotulo="Das (HH:MM)" value={de} onChangeText={setDe} placeholder="9:00" maxLength={5} keyboardType="numbers-and-punctuation" />
            </View>
            <View style={{ flex: 1 }}>
              <Campo rotulo="Até (HH:MM)" value={ate} onChangeText={setAte} placeholder="13:00" maxLength={5} keyboardType="numbers-and-punctuation" />
            </View>
          </View>
        </>
      )}
      {modo === 'horas' && (
        <Campo
          rotulo="Horas de sol direto por dia"
          value={horas}
          onChangeText={setHoras}
          keyboardType="decimal-pad"
          placeholder="Ex.: 4"
          maxLength={4}
        />
      )}
      {modo === 'nao-sei' && <Paragrafo suave>Sem problema. Você pode preencher depois, na tela do local.</Paragrafo>}
      {invalido ? (
        <Paragrafo suave>
          {modo === 'horarios' ? 'Use horários como 9:00 e 13:00, com o fim depois do início.' : 'Use um número de 0 a 24.'}
        </Paragrafo>
      ) : calculado != null && modo === 'horarios' ? (
        <Paragrafo>
          {String(calculado).replace('.', ',')} h de sol direto{periodo ? `, ${NOME_PERIODO[periodo]}` : ''}.
        </Paragrafo>
      ) : null}
    </View>
  );
}
