import { CAUSAS_GERMINACAO, descreverTarefa, faseAposGerminacao, formatarData, tituloTarefa, type Tarefa } from '@cultivae/core';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Aviso, Botao, Cartao, Carregando, Paragrafo, Subtitulo, Tela, Titulo, cores } from '../../components/ui';
import { confirmarFase, encerrarPlantio, registrarAcao, registrarAcoes } from '../../lib/dados';
import { ESPECIES, useHorta } from '../../lib/horta';

export default function Hoje() {
  const { dados, carregando, erro, hoje, previsaoHoje, tarefas, locais, plantios, recarregar } = useHorta();
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [falha, setFalha] = useState<string | null>(null);

  if (carregando && !dados) return <Carregando />;

  async function agir(chave: string, acao: () => Promise<unknown>) {
    setOcupado(chave);
    setFalha(null);
    try {
      await acao();
      await recarregar();
    } catch (e) {
      setFalha(e instanceof Error ? e.message : 'Algo deu errado. Tente de novo.');
    } finally {
      setOcupado(null);
    }
  }

  // Agrupa por local, como o usuário anda pela casa (RF-2.2).
  const porLocal = new Map<string, Tarefa[]>();
  for (const t of tarefas) {
    const localId = plantios.get(t.plantioId)?.localId ?? '';
    porLocal.set(localId, [...(porLocal.get(localId) ?? []), t]);
  }

  const semPlantas = (dados?.plantios.length ?? 0) === 0;

  return (
    <Tela>
      <Titulo>Hoje, {formatarData(hoje)}</Titulo>
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      {falha && <Aviso tipo="erro">{falha}</Aviso>}

      {previsaoHoje ? (
        <Paragrafo suave>
          Previsão: {previsaoHoje.chuvaMm.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mm de chuva, máxima de{' '}
          {Math.round(previsaoHoje.tempMaxC)} °C{dados?.perfil.cidade ? ` em ${dados.perfil.cidade}` : ''}.
        </Paragrafo>
      ) : dados && dados.perfil.lat === null ? (
        <Paragrafo suave>Escolha sua cidade na aba Conta para a rega se ajustar à chuva e ao calor.</Paragrafo>
      ) : null}

      {semPlantas ? (
        <Cartao>
          <Paragrafo>Sua horta ainda está vazia.</Paragrafo>
          <Paragrafo suave>Escolha uma planta na aba Plantas e toque em "Plantar esta".</Paragrafo>
          <Botao titulo="Ver plantas" onPress={() => router.push('/plantas')} />
        </Cartao>
      ) : tarefas.length === 0 ? (
        <Aviso tipo="ok">Nada para fazer hoje. Sua horta está em dia.</Aviso>
      ) : null}

      {[...porLocal.entries()].map(([localId, lista]) => {
        const local = locais.get(localId);
        const regas = lista.filter((t) => t.tipo === 'rega');
        return (
          <View key={localId} style={{ gap: 8 }}>
            <Subtitulo>{local?.nome ?? 'Sem local'}</Subtitulo>
            {regas.length > 1 && (
              <Botao
                titulo={`Reguei tudo aqui (${regas.length})`}
                variante="secundario"
                carregando={ocupado === `local-${localId}`}
                onPress={() => agir(`local-${localId}`, () => registrarAcoes(regas.map((t) => t.plantioId), 'rega', hoje))}
              />
            )}
            {lista.map((t) => {
              const plantio = plantios.get(t.plantioId);
              const especie = plantio ? ESPECIES.get(plantio.especieId) : undefined;
              if (!plantio || !especie) return null;
              const chave = `${t.tipo}-${t.plantioId}`;
              const proxima = faseAposGerminacao(especie);
              return (
                <Cartao key={chave}>
                  <Text style={{ fontSize: 13, color: t.atrasada ? cores.erro : cores.textoSuave }}>
                    {tituloTarefa(t.tipo)}
                    {t.atrasada ? ` · desde ${formatarData(t.devidaEm)}` : ''}
                  </Text>
                  <Link href={{ pathname: '/plantio/[id]', params: { id: plantio.id } }}>
                    <Text style={{ fontSize: 17, fontWeight: '600', color: cores.texto }}>
                      {descreverTarefa(t, especie, plantio.apelido)}
                    </Text>
                  </Link>
                  {t.ajustes.map((a) => (
                    <Paragrafo key={a} suave>
                      {a}
                    </Paragrafo>
                  ))}
                  {t.tipo === 'germinacao-atrasada' &&
                    CAUSAS_GERMINACAO.map((c) => (
                      <Paragrafo key={c} suave>
                        • {c}
                      </Paragrafo>
                    ))}

                  <View style={{ gap: 8, marginTop: 8 }}>
                    {t.tipo === 'rega' && (
                      <Botao titulo="Reguei" carregando={ocupado === chave} onPress={() => agir(chave, () => registrarAcao(plantio.id, 'rega', hoje))} />
                    )}
                    {(t.tipo === 'verificar-germinacao' || t.tipo === 'germinacao-atrasada') && proxima && (
                      <Botao
                        titulo="Germinou"
                        carregando={ocupado === chave}
                        onPress={() => agir(chave, () => confirmarFase(plantio.id, proxima.nome, hoje))}
                      />
                    )}
                    {t.tipo === 'germinacao-atrasada' && (
                      <Botao
                        titulo="Não nasceu, encerrar"
                        variante="perigo"
                        carregando={ocupado === `${chave}-perdido`}
                        onPress={() => agir(`${chave}-perdido`, () => encerrarPlantio(plantio.id, 'perdido'))}
                      />
                    )}
                    {t.tipo === 'colheita' && (
                      <Botao titulo="Colhi" carregando={ocupado === chave} onPress={() => agir(chave, () => registrarAcao(plantio.id, 'colheita', hoje))} />
                    )}
                  </View>
                </Cartao>
              );
            })}
          </View>
        );
      })}
    </Tela>
  );
}
