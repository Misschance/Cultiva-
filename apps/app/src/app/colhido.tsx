import { descreverTotais, formatarData, resumirColheitas, type Colheita } from '@cultivae/core';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { PlantaViva } from '../components/planta-viva';
import { Aviso, Carregando, Paragrafo, Tela, Texto, Titulo, fontes, useCores } from '../components/ui';
import { carregarColhido } from '../lib/dados';
import { ESPECIES, useHorta } from '../lib/horta';

const MESES_CURTOS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** Minhas colheitas: quanto já saiu da horta, por planta e mês a mês. */
export default function Colhido() {
  const c = useCores();
  const { hoje } = useHorta();
  const [dados, setDados] = useState<{ colheitas: Colheita[]; especieDoPlantio: Map<string, string> } | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      carregarColhido().then(
        (d) => ativo && setDados(d),
        (e: Error) => ativo && setErro(e.message),
      );
      return () => {
        ativo = false;
      };
    }, []),
  );

  if (erro) return <Tela><Aviso tipo="erro">{erro}</Aviso></Tela>;
  if (!dados) return <Carregando />;

  const r = resumirColheitas(dados.colheitas, dados.especieDoPlantio, hoje);
  const maior = Math.max(1, ...r.porMes.map((m) => m.vezes));
  const total = descreverTotais(r.totais);

  return (
    <Tela>
      <Titulo>Minhas colheitas</Titulo>

      <View style={{ borderRadius: 28, backgroundColor: c.doca, padding: 20, gap: 18 }}>
        <View style={{ gap: 4 }}>
          <Texto style={{ fontSize: 12, fontWeight: '600', letterSpacing: 1, color: c.destaque }}>JÁ SAIU DA SUA HORTA</Texto>
          <Texto style={{ fontFamily: fontes.titulo, fontSize: 34, color: c.docaAtivo }}>
            {r.vezes} {r.vezes === 1 ? 'colheita' : 'colheitas'}
          </Texto>
          {total ? <Texto style={{ fontSize: 16, color: c.docaAtivo }}>{total}</Texto> : null}
          {r.ultima && <Texto style={{ fontSize: 13, color: c.docaTexto }}>Última em {formatarData(r.ultima)}</Texto>}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 120 }} accessibilityLabel="Colheitas por mês nos últimos seis meses">
          {r.porMes.map((m) => {
            const atual = m.mes === hoje.slice(0, 7);
            return (
              <View key={m.mes} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
                <Texto style={{ fontSize: 12, color: c.docaAtivo, opacity: m.vezes ? 1 : 0 }}>{m.vezes}</Texto>
                <View
                  style={{
                    width: '100%',
                    maxWidth: 36,
                    height: Math.max(6, (m.vezes / maior) * 72),
                    borderRadius: 10,
                    backgroundColor: atual ? c.destaque : m.vezes ? c.verde : c.docaTexto,
                    opacity: m.vezes || atual ? 1 : 0.25,
                  }}
                />
                <Texto style={{ fontSize: 12, color: atual ? c.docaAtivo : c.docaTexto }}>{MESES_CURTOS[Number(m.mes.slice(5)) - 1]}</Texto>
              </View>
            );
          })}
        </View>
      </View>

      {r.vezes === 0 ? (
        <Paragrafo suave>Quando colher, registre a quantidade no diário da planta. Ela aparece aqui somada.</Paragrafo>
      ) : (
        <View style={{ gap: 10 }}>
          {r.porEspecie.map((e) => {
            const especie = ESPECIES.get(e.especieId);
            return (
              <View
                key={e.especieId}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, borderRadius: 22, backgroundColor: c.cartao, borderWidth: 1, borderColor: c.borda }}
              >
                <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: c.verdeClaro, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <PlantaViva especieId={e.especieId} nome={especie?.nomePopular ?? e.especieId} estagio="colheita" tamanho={64} ceu={false} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Texto style={{ fontSize: 16, fontWeight: '600' }}>{especie?.nomePopular ?? e.especieId}</Texto>
                  <Texto style={{ fontSize: 14, color: c.texto }}>{descreverTotais(e.totais)}</Texto>
                  <Texto style={{ fontSize: 13, color: c.textoSuave }}>
                    {e.vezes} {e.vezes === 1 ? 'vez' : 'vezes'} · última em {formatarData(e.ultima)}
                  </Texto>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </Tela>
  );
}
