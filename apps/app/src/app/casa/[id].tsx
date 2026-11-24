import {
  NOME_LUZ_CASA,
  PLANTAS_DE_CASA,
  REFERENCIAS,
  conferirTerraComFonte,
  estacaoDaCasa,
  regiaoDaCidade,
  resumoPets,
  toxicidadeAlta,
  type Confianca,
} from '@cultivae/core';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking, View } from 'react-native';
import { CasaViva } from '../../components/casa-viva';
import { Aviso, Botao, Dado, Fato, Secao, Subtitulo, Tela, Texto, Titulo, fontes, useCores } from '../../components/ui';
import { useHorta } from '../../lib/horta';

const ESTACAO = { crescimento: 'Crescimento (set a mar)', repouso: 'Repouso (abr a ago)' } as const;

const maiuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** Ficha de planta de casa (base v2). Campo sem dado na base não aparece. */
export default function FichaCasa() {
  const c = useCores();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dados, hoje } = useHorta();
  const p = PLANTAS_DE_CASA.find((x) => x.id === id);
  if (!p) return <Tela><Aviso tipo="erro">Planta não encontrada.</Aviso></Tela>;

  const regiao = regiaoDaCidade(dados?.perfil.cidade);
  const agora = estacaoDaCasa(p, hoje, regiao);
  const pets = resumoPets(p);
  const alta = toxicidadeAlta(p);
  const dias = conferirTerraComFonte(agora);
  const codigos = new Set(
    [p.luz.fonte, p.rega.fonte, p.substrato.fonte, p.adubo.fonte, p.temperatura.fonte, p.toxicidade.fonte, ...p.estacoes.flatMap((e) => [e.verificarFonte, e.adubacaoFonte])]
      .flatMap((f) => (f ?? '').split(/[;,]/))
      .map((f) => f.trim())
      .filter(Boolean),
  );
  const referencias = REFERENCIAS.filter((r) => codigos.has(r.id));
  const conf = (v: Confianca | null) => v ?? undefined;

  return (
    <Tela>
      <View style={{ alignItems: 'center', borderRadius: 28, backgroundColor: c.verdeClaro, paddingTop: 12, overflow: 'hidden' }}>
        <CasaViva plantaId={p.id} nome={p.nomePopular} tamanho={220} />
      </View>

      <View style={{ gap: 2 }}>
        <Titulo>{p.nomePopular}</Titulo>
        <Texto style={{ fontSize: 15, fontStyle: 'italic', color: c.textoSuave }}>
          {p.nomeCientifico}
          {p.outrosNomes ? ` · ${p.outrosNomes}` : ''}
        </Texto>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Fato rotulo="Luz" valor={NOME_LUZ_CASA[p.luz.categoria]} detalhe={p.luz.horasSolDireto ? `Sol direto: ${p.luz.horasSolDireto} h` : undefined} />
        <Fato rotulo="Terra" valor={p.rega.umidadeSolo ? maiuscula(p.rega.umidadeSolo) : '—'} />
        <Fato
          rotulo="Pets"
          valor={pets.situacao === 'toxica' ? 'Tóxica' : pets.situacao === 'segura' ? 'Não tóxica' : 'Sem informação'}
          alerta={pets.situacao === 'toxica'}
          detalhe={pets.situacao === 'toxica' ? pets.texto.replace('Tóxica para ', 'Para ') : undefined}
        />
        {p.crescimento ? <Fato rotulo="Crescimento" valor={maiuscula(p.crescimento)} /> : null}
      </View>

      {dados?.casa && (
        <Botao
          titulo={dados.casa.plantas.some((m) => m.plantaId === p.id) ? 'Tenho outra dessa em casa' : 'Tenho essa em casa'}
          onPress={() => router.push({ pathname: '/minha-casa/nova', params: { planta: p.id } })}
        />
      )}

      {alta && (
        <Aviso tipo="erro">
          Toxicidade alta: {p.toxicidade.sintomas ?? 'pode causar reação grave se for mastigada.'} Deixe longe de crianças e pets.
        </Aviso>
      )}
      {p.dica ? <Aviso tipo="ok">{p.dica}</Aviso> : null}

      <Subtitulo>Agora: {ESTACAO[agora.estacao]}</Subtitulo>
      <View style={{ borderRadius: 24, backgroundColor: c.cartao, borderWidth: 1, borderColor: c.borda, padding: 16, gap: 10 }}>
        <Dado titulo="Rega" texto={agora.rega} confianca={conf(p.rega.confianca)} />
        {dias ? <Texto style={{ fontSize: 14, color: c.textoSuave }}>Confira a terra a cada {dias} dias.</Texto> : null}
        <Dado titulo="Adubo" texto={agora.adubacao} />
        <Texto style={{ fontSize: 13, color: c.textoSuave }}>Na dúvida, toque na terra antes de regar: a regra vale mais que o calendário.</Texto>
      </View>

      <Subtitulo>Como cuidar</Subtitulo>
      <Secao titulo="Luz" resumo={NOME_LUZ_CASA[p.luz.categoria]} inicialAberta>
        <Dado titulo="Onde colocar" texto={p.luz.texto} confianca={conf(p.luz.confianca)} />
      </Secao>
      <Secao titulo="Água" resumo={p.rega.regra ?? undefined}>
        <Dado titulo="Regra geral" texto={p.rega.regra} confianca={conf(p.rega.confianca)} />
        {p.estacoes.map((e) => (
          <Dado key={e.estacao} titulo={ESTACAO[e.estacao]} texto={e.rega} />
        ))}
      </Secao>
      {(p.substrato.texto || p.substrato.vaso) && (
        <Secao titulo="Terra e vaso" resumo={p.substrato.texto ?? undefined}>
          <Dado titulo="Substrato" texto={p.substrato.texto} />
          <Dado titulo="Vaso" texto={p.substrato.vaso} />
        </Secao>
      )}
      {p.adubo.texto && (
        <Secao titulo="Adubo" resumo={p.adubo.texto}>
          <Dado titulo="Quando adubar" texto={p.adubo.texto} confianca={conf(p.adubo.confianca)} />
        </Secao>
      )}
      {(p.temperatura.ideal || p.umidadeAr || p.temperatura.minimaC != null) && (
        <Secao titulo="Clima da casa" resumo={p.temperatura.ideal ?? undefined}>
          <Dado titulo="Temperatura ideal" texto={p.temperatura.ideal} />
          <Dado titulo="Mínima" texto={p.temperatura.minimaC != null ? `${p.temperatura.minimaC} °C` : null} />
          <Dado titulo="Umidade do ar" texto={p.umidadeAr} />
        </Secao>
      )}
      <Secao titulo="Pets e crianças" resumo={pets.texto}>
        <Dado titulo="Cães e gatos" texto={pets.texto} confianca={conf(p.toxicidade.confianca)} />
        <Dado titulo="Pessoas" texto={p.toxicidade.gravidadeHumanos ? `Gravidade ${p.toxicidade.gravidadeHumanos}` : null} />
        <Dado titulo="Sintomas" texto={p.toxicidade.sintomas} />
        {pets.situacao === 'sem-dado' && (
          <Texto style={{ fontSize: 14, color: c.textoSuave }}>As fontes lidas não informam. Isso não quer dizer que seja segura.</Texto>
        )}
      </Secao>
      {(p.propagacao || p.problemas) && (
        <Secao titulo="Mudas e problemas" resumo={p.problemas ?? undefined}>
          <Dado titulo="Como fazer mudas" texto={p.propagacao} />
          <Dado titulo="Problemas comuns" texto={p.problemas} />
        </Secao>
      )}
      {referencias.length > 0 && (
        <Secao titulo="Fontes" resumo={referencias.length === 1 ? '1 referência' : `${referencias.length} referências`}>
          {referencias.map((r) => (
            <Texto
              key={r.id}
              style={{ fontSize: 13, color: r.url ? c.verde : c.textoSuave, fontFamily: fontes.texto }}
              onPress={r.url ? () => void Linking.openURL(r.url) : undefined}
              accessibilityRole={r.url ? 'link' : 'text'}
            >
              {r.id}. {r.citacao}
            </Texto>
          ))}
        </Secao>
      )}
    </Tela>
  );
}
