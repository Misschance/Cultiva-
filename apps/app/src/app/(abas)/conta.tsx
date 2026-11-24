import { buscarCidade, type Cidade } from '@cultivae/core';
import { useEffect, useState } from 'react';
import { Aviso, Botao, Campo, Cartao, Paragrafo, Subtitulo, Tela, Titulo } from '../../components/ui';
import { removerLocalizacao, salvarHorarioLembrete, salvarLocalizacao } from '../../lib/dados';
import { useHorta } from '../../lib/horta';
import { agendarLembretes, lembretesDisponiveis, lembretesPermitidos, pedirPermissaoLembretes } from '../../lib/lembretes';
import { useSessao } from '../../lib/sessao';
import { supabase } from '../../lib/supabase';

export default function Conta() {
  const { sessao } = useSessao();
  const { dados, hoje, recarregar } = useHorta();
  const perfil = dados?.perfil;

  const [termo, setTermo] = useState('');
  const [cidades, setCidades] = useState<Cidade[] | null>(null);
  const [horario, setHorario] = useState(perfil?.horarioLembrete ?? '08:00');
  const [permitido, setPermitido] = useState(false);
  const [msg, setMsg] = useState<{ tipo: 'erro' | 'ok'; texto: string } | null>(null);
  const [ocupado, setOcupado] = useState<string | null>(null);

  useEffect(() => {
    void lembretesPermitidos().then(setPermitido);
  }, []);
  useEffect(() => {
    if (perfil) setHorario(perfil.horarioLembrete);
  }, [perfil]);

  async function agir(chave: string, acao: () => Promise<string | void>) {
    setOcupado(chave);
    setMsg(null);
    try {
      const ok = await acao();
      if (ok) setMsg({ tipo: 'ok', texto: ok });
    } catch (e) {
      setMsg({ tipo: 'erro', texto: e instanceof Error ? e.message : 'Algo deu errado.' });
    } finally {
      setOcupado(null);
    }
  }

  if (!perfil) return <Tela><Paragrafo>Carregando…</Paragrafo></Tela>;

  return (
    <Tela>
      <Titulo>Conta</Titulo>
      <Paragrafo suave>Entrou como {sessao?.user.email}</Paragrafo>
      {msg && <Aviso tipo={msg.tipo === 'erro' ? 'erro' : 'ok'}>{msg.texto}</Aviso>}

      <Subtitulo>Cidade (para o clima)</Subtitulo>
      {perfil.cidade ? (
        <Cartao>
          <Paragrafo>{perfil.cidade}</Paragrafo>
          <Paragrafo suave>A rega das plantas ao ar livre se ajusta à chuva e ao calor previstos aqui.</Paragrafo>
          <Botao
            titulo="Remover cidade"
            variante="secundario"
            carregando={ocupado === 'remover'}
            onPress={() =>
              agir('remover', async () => {
                await removerLocalizacao(perfil.id);
                await recarregar();
                return 'Cidade removida.';
              })
            }
          />
        </Cartao>
      ) : (
        <>
          <Paragrafo suave>
            Guardamos só a cidade e a posição aproximada (cerca de 1 km), usadas para buscar a previsão do tempo no
            Open-Meteo. Você pode remover quando quiser.
          </Paragrafo>
          <Campo rotulo="Sua cidade" value={termo} onChangeText={setTermo} placeholder="Ex.: Campinas" maxLength={80} />
          <Botao
            titulo="Buscar cidade"
            variante="secundario"
            carregando={ocupado === 'buscar'}
            desativado={termo.trim().length < 2}
            onPress={() =>
              agir('buscar', async () => {
                const r = await buscarCidade(termo);
                setCidades(r);
                if (r.length === 0) return 'Nenhuma cidade encontrada com esse nome.';
              })
            }
          />
          {cidades?.map((c) => (
            <Cartao
              key={`${c.nome}-${c.lat}-${c.lon}`}
              rotulo={`${c.nome}, ${c.estado}`}
              onPress={() =>
                agir('salvar-cidade', async () => {
                  await salvarLocalizacao(perfil.id, `${c.nome}${c.estado ? ` - ${c.estado}` : ''}`, c.lat, c.lon);
                  setCidades(null);
                  setTermo('');
                  await recarregar();
                  return 'Cidade salva.';
                })
              }
            >
              <Paragrafo>
                {c.nome}
                {c.estado ? `, ${c.estado}` : ''}
              </Paragrafo>
            </Cartao>
          ))}
        </>
      )}

      <Subtitulo>Lembretes</Subtitulo>
      {!lembretesDisponiveis ? (
        <Paragrafo suave>Os lembretes chegam pelo app do celular. Na web, confira a aba Hoje.</Paragrafo>
      ) : (
        <>
          <Campo rotulo="Horário do lembrete diário (HH:MM)" value={horario} onChangeText={setHorario} maxLength={5} keyboardType="numbers-and-punctuation" />
          <Botao
            titulo="Salvar horário"
            variante="secundario"
            carregando={ocupado === 'horario'}
            onPress={() =>
              agir('horario', async () => {
                await salvarHorarioLembrete(perfil.id, horario.trim());
                await recarregar();
                return 'Horário salvo.';
              })
            }
          />
          <Botao
            titulo={permitido ? 'Lembretes ativos: reagendar' : 'Ativar lembretes'}
            carregando={ocupado === 'lembretes'}
            onPress={() =>
              agir('lembretes', async () => {
                const ok = permitido || (await pedirPermissaoLembretes());
                setPermitido(ok);
                if (!ok) throw new Error('Sem permissão para notificações. Ative nas configurações do celular.');
                const n = await agendarLembretes(dados!, hoje);
                return n === 0 ? 'Lembretes ativos. Nada a lembrar nos próximos 7 dias.' : `${n} lembretes agendados para os próximos 7 dias.`;
              })
            }
          />
        </>
      )}

      <Subtitulo>Sessão</Subtitulo>
      <Botao titulo="Sair" variante="perigo" onPress={() => void supabase.auth.signOut()} />
    </Tela>
  );
}
