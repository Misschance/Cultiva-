import { CATALOGO, REGIOES, oQuePlantar, regiaoDaCidade, type Regiao } from '@cultivae/core';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { PlantaViva } from './planta-viva';
import { Texto, fontes, useCores } from './ui';

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

/**
 * "Plante agora": o que está na época de plantio no mês e na região da pessoa,
 * pelas épocas da base (Embrapa). Sem cidade no perfil, a pessoa escolhe a região aqui.
 */
export function PlanteAgora({ cidade, hoje }: { cidade: string | null | undefined; hoje: string }) {
  const c = useCores();
  const daCidade = regiaoDaCidade(cidade);
  const [escolhida, setEscolhida] = useState<Regiao | null>(null);
  const [trocando, setTrocando] = useState(false);
  const regiao = escolhida ?? daCidade;
  const mes = Number(hoje.slice(5, 7));
  const r = useMemo(() => (regiao ? oQuePlantar(CATALOGO, regiao, mes) : null), [regiao, mes]);

  const chip = (ativo: boolean) => ({
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: ativo ? c.verde : c.superficie,
  });

  return (
    <View style={{ borderRadius: 28, backgroundColor: c.doca, padding: 18, gap: 14, overflow: 'hidden' }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Texto style={{ fontSize: 12, fontWeight: '600', letterSpacing: 1, color: c.destaque }}>PLANTE AGORA</Texto>
          <Texto style={{ fontFamily: fontes.titulo, fontSize: 22, color: c.docaAtivo }}>
            {MESES[mes - 1]!.charAt(0).toUpperCase() + MESES[mes - 1]!.slice(1)}
            {regiao ? ` no ${regiao}` : ''}
          </Texto>
        </View>
        {regiao && (
          <Pressable
            onPress={() => setTrocando((t) => !t)}
            accessibilityRole="button"
            accessibilityLabel="Trocar a região"
            style={({ pressed }) => ({ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: c.docaTexto, opacity: pressed ? 0.6 : 1 })}
          >
            <Texto style={{ fontSize: 13, color: c.docaAtivo }}>{trocando ? 'Fechar' : 'Trocar região'}</Texto>
          </Pressable>
        )}
      </View>

      {(!regiao || trocando) && (
        <View style={{ gap: 8 }}>
          <Texto style={{ fontSize: 14, color: c.docaTexto }}>
            {regiao ? 'Escolha a região:' : 'Em que região você planta? Com a cidade na aba Conta, o app já sabe.'}
          </Texto>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {REGIOES.map((g) => (
              <Pressable
                key={g}
                onPress={() => {
                  setEscolhida(g);
                  setTrocando(false);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: g === regiao }}
                style={chip(g === regiao)}
              >
                <Texto style={{ fontSize: 14, color: g === regiao ? c.sobreVerde : c.texto }}>{g}</Texto>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {r && (
        <>
          {r.agora.length === 0 ? (
            <Texto style={{ fontSize: 15, color: c.docaTexto }}>Nenhuma planta da base está na época de plantio neste mês.</Texto>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingRight: 4 }} style={{ marginHorizontal: -2 }}>
              {r.agora.map(({ especie, variedades }) => (
                <Pressable
                  key={especie.id}
                  onPress={() => router.push({ pathname: '/planta/[id]', params: { id: especie.id } })}
                  accessibilityRole="link"
                  accessibilityLabel={`${especie.nomePopular}${variedades.length ? `, ${variedades.join(' e ')}` : ''}`}
                  style={({ pressed }) => ({ width: 112, borderRadius: 20, backgroundColor: c.cartao, paddingBottom: 10, overflow: 'hidden', opacity: pressed ? 0.8 : 1 })}
                >
                  <View style={{ alignItems: 'center', backgroundColor: c.verdeClaro, paddingTop: 4 }}>
                    <PlantaViva especieId={especie.id} nome={especie.nomePopular} estagio="crescendo" tamanho={88} ceu={false} />
                  </View>
                  <View style={{ paddingHorizontal: 10, paddingTop: 8, gap: 2 }}>
                    <Texto numberOfLines={1} style={{ fontSize: 14, fontWeight: '600' }}>
                      {especie.nomePopular.replace(/ \(.*\)$/, '')}
                    </Texto>
                    {variedades.length > 0 && (
                      <Texto numberOfLines={1} style={{ fontSize: 12, color: c.textoSuave }}>
                        {variedades.map((v) => `de ${v}`).join(', ')}
                      </Texto>
                    )}
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {r.depois.length > 0 && (
            <Texto style={{ fontSize: 14, color: c.docaTexto, lineHeight: 20 }}>
              <Texto style={{ fontSize: 14, fontWeight: '600', color: c.docaAtivo }}>Em breve: </Texto>
              {r.depois
                .slice(0, 5)
                .map((d) => `${d.especie.nomePopular.replace(/ \(.*\)$/, '')} em ${MESES[d.proximoMes - 1]}`)
                .join(' · ')}
            </Texto>
          )}
          {(r.naoRecomendadas.length > 0 || r.semDado.length > 0) && (
            <Texto style={{ fontSize: 12, color: c.docaTexto, lineHeight: 18 }}>
              {r.naoRecomendadas.length > 0 && `Não recomendadas na região: ${r.naoRecomendadas.map((e) => e.nomePopular).join(', ')}. `}
              {r.semDado.length > 0 && `Ainda sem época na base: ${r.semDado.map((e) => e.nomePopular).join(', ')}. `}
              Épocas dos calendários da Embrapa.
            </Texto>
          )}
        </>
      )}
    </View>
  );
}
