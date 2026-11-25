import { NOME_CUIDADO_CASA, formatarData, regiaoDaCidade, situacaoDaCasa, type CuidadoCasa } from '@cultivae/core';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { CasaViva } from '../../components/casa-viva';
import { Colunas, Aviso, Botao, Cartao, Carregando, Paragrafo, Subtitulo, Tela, Texto, Titulo, useCores } from '../../components/ui';
import { registrarCuidadoCasa, removerPlantaCasa } from '../../lib/dados';
import { CASA, useHorta } from '../../lib/horta';

/** Uma planta de casa do usuário: quando tocar na terra, botões de cuidado e histórico. */
export default function MinhaPlantaCasa() {
  const c = useCores();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dados, carregando, hoje, recarregar } = useHorta();
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [falha, setFalha] = useState<string | null>(null);
  const [confirmarRemocao, setConfirmarRemocao] = useState(false);

  if (carregando && !dados) return <Carregando />;
  const minha = dados?.casa?.plantas.find((p) => p.id === id);
  const planta = minha ? CASA.get(minha.plantaId) : undefined;
  if (!dados?.casa || !minha || !planta) return <Tela><Aviso tipo="erro">Planta não encontrada.</Aviso></Tela>;

  const s = situacaoDaCasa(minha, planta, dados.casa.registros, hoje, regiaoDaCidade(dados.perfil.cidade));
  const historico = dados.casa.registros.filter((r) => r.plantaCasaId === minha.id).slice(0, 20);
  const nome = minha.apelido ?? planta.nomePopular;

  async function agir(chave: string, acao: () => Promise<unknown>): Promise<boolean> {
    setOcupado(chave);
    setFalha(null);
    try {
      await acao();
      await recarregar();
      return true;
    } catch (e) {
      setFalha(e instanceof Error ? e.message : 'Algo deu errado. Tente de novo.');
      return false;
    } finally {
      setOcupado(null);
    }
  }
  const cuidar = (tipo: CuidadoCasa) => agir(tipo, () => registrarCuidadoCasa(minha.id, tipo, hoje));

  let quando: string;
  if (s.atraso === null && s.proximaConferencia) quando = `Próxima vez de tocar na terra: ${formatarData(s.proximaConferencia)}.`;
  else if (s.atraso === 0) quando = 'Hoje é dia de tocar na terra.';
  else if (s.atraso) quando = `Toque na terra: passou ${s.atraso === 1 ? '1 dia' : `${s.atraso} dias`} da data.`;
  else quando = 'A base ainda não tem um intervalo para esta planta. Toque na terra de vez em quando.';

  return (
    <Tela largura="larga">
      <Colunas
        larguraFixa={380}
        esquerda={
          <>
            <View style={{ alignItems: 'center', borderRadius: 28, backgroundColor: c.verdeClaro, paddingTop: 8, overflow: 'hidden' }}>
              <CasaViva plantaId={planta.id} nome={planta.nomePopular} tamanho={200} />
            </View>
            <View style={{ gap: 2 }}>
              <Titulo>{nome}</Titulo>
              <Texto style={{ fontSize: 15, color: c.textoSuave }}>
                {minha.apelido ? planta.nomePopular : planta.nomeCientifico}
                {minha.comodo ? ` · ${minha.comodo}` : ''}
              </Texto>
            </View>
          </>
        }
      >
        {falha && <Aviso tipo="erro">{falha}</Aviso>}
        <Aviso tipo={s.atraso !== null ? 'alerta' : 'ok'}>{quando}</Aviso>
        {s.intervaloDias !== null && !s.intervaloComFonte && (
          <Paragrafo suave>
            O intervalo de {s.intervaloDias} dias é só um lembrete aproximado, ainda sem fonte confirmada. A regra da ficha vale mais.
          </Paragrafo>
        )}
        {s.estacao.rega && (
          <Cartao>
            <Texto style={{ fontSize: 13, fontWeight: '600', color: c.textoSuave }}>Como regar agora</Texto>
            <Texto style={{ fontSize: 16 }}>{s.estacao.rega}</Texto>
          </Cartao>
        )}

        <View style={{ gap: 8 }}>
          <Botao titulo="Toquei: ainda úmida" carregando={ocupado === 'conferir'} onPress={() => cuidar('conferir')} />
          <Botao titulo="Estava seca, reguei" variante="secundario" carregando={ocupado === 'rega'} onPress={() => cuidar('rega')} />
          <Botao titulo="Adubei" variante="secundario" carregando={ocupado === 'adubo'} onPress={() => cuidar('adubo')} />
          <Botao titulo="Ver ficha completa" variante="secundario" onPress={() => router.push({ pathname: '/casa/[id]', params: { id: planta.id } })} />
        </View>

        <Subtitulo>Histórico</Subtitulo>
        {historico.length === 0 ? (
          <Paragrafo suave>Nada registrado ainda. Na lista desde {formatarData(minha.desde)}.</Paragrafo>
        ) : (
          historico.map((r, i) => (
            <Texto key={`${r.data}-${r.tipo}-${i}`} style={{ fontSize: 15 }}>
              {formatarData(r.data)} · {NOME_CUIDADO_CASA[r.tipo]}
            </Texto>
          ))
        )}

        {confirmarRemocao ? (
          <View style={{ gap: 8 }}>
            <Paragrafo>Tirar {nome} da sua lista? O histórico fica guardado.</Paragrafo>
            <Botao
              titulo="Sim, tirar da lista"
              variante="perigo"
              carregando={ocupado === 'remover'}
              onPress={() => agir('remover', () => removerPlantaCasa(minha.id)).then((ok) => ok && router.replace('/horta'))}
            />
            <Botao titulo="Cancelar" variante="secundario" onPress={() => setConfirmarRemocao(false)} />
          </View>
        ) : (
          <Botao titulo="Tirar da lista" variante="perigo" onPress={() => setConfirmarRemocao(true)} />
        )}
      </Colunas>
    </Tela>
  );
}
