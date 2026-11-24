import { CATALOGO, descreverTarefa, proximosDias, tarefasDoDia, type DataISO, type Especie } from '@cultivae/core';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { DadosHorta } from './dados';

/**
 * Lembretes locais: agendados no próprio celular para os próximos 7 dias, então funcionam
 * sem internet (RNF-2). São refeitos toda vez que a horta muda. Na web não há lembretes.
 */
const DIAS = 7;
const CANAL = 'tarefas-da-horta';
const especies = new Map<string, Especie>(CATALOGO.map((e) => [e.id, e]));

export const lembretesDisponiveis = Platform.OS !== 'web';

if (lembretesDisponiveis) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export async function lembretesPermitidos(): Promise<boolean> {
  if (!lembretesDisponiveis) return false;
  const { granted } = await Notifications.getPermissionsAsync();
  return granted;
}

export async function pedirPermissaoLembretes(): Promise<boolean> {
  if (!lembretesDisponiveis) return false;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CANAL, {
      name: 'Tarefas da horta',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  const { granted } = await Notifications.requestPermissionsAsync();
  return granted;
}

export async function agendarLembretes(dados: DadosHorta, hoje: DataISO): Promise<number> {
  if (!(await lembretesPermitidos())) return 0;
  await Notifications.cancelAllScheduledNotificationsAsync();

  const [hora, minuto] = dados.perfil.horarioLembrete.split(':').map(Number);
  const locais = new Map(dados.locais.map((l) => [l.id, l]));
  const apelidos = new Map(dados.plantios.map((p) => [p.id, p.apelido]));
  const agora = Date.now();
  let agendados = 0;

  for (const dia of proximosDias(hoje, DIAS)) {
    const tarefas = tarefasDoDia({ plantios: dados.plantios, especies, locais, registros: dados.registros, hoje: dia });
    if (tarefas.length === 0) continue;

    const [a, m, d] = dia.split('-').map(Number);
    const quando = new Date(a!, m! - 1, d!, hora ?? 8, minuto ?? 0); // horário local do aparelho
    if (quando.getTime() <= agora) continue;

    const frases = tarefas.slice(0, 4).map((t) => {
      const plantio = dados.plantios.find((p) => p.id === t.plantioId);
      const especie = plantio ? especies.get(plantio.especieId) : undefined;
      return especie ? descreverTarefa(t, especie, apelidos.get(t.plantioId)) : '';
    });
    const resto = tarefas.length - 4;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: tarefas.length === 1 ? '1 tarefa na horta hoje' : `${tarefas.length} tarefas na horta hoje`,
        // Sem dados pessoais além do nome das plantas.
        body: frases.filter(Boolean).join('\n') + (resto > 0 ? `\ne mais ${resto}` : ''),
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: quando, channelId: CANAL },
    });
    agendados++;
  }
  return agendados;
}

/** Apaga os lembretes agendados no celular (ex.: ao excluir a conta). */
export async function cancelarLembretes(): Promise<void> {
  if (!lembretesDisponiveis) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}
