import { formatarData, lerDataBr, paraDia, type Origem } from '@cultivae/core';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Aviso, Botao, Campo, Opcoes, Paragrafo, Tela, Titulo } from '../../components/ui';
import { criarPlantio, novoPlantio } from '../../lib/dados';
import { ESPECIES, useHorta } from '../../lib/horta';
import { NOME_ORIGEM, opcoesDe } from '../../lib/rotulos';

/** Horas mínimas de sol que a ficha pede para "sol pleno" (RF-5.3, alerta simples). */
function alertaLuz(localIdeal: string, horasSolLocal: number | null | undefined, luzMin: number | null): string | null {
  if (horasSolLocal == null || luzMin == null) return null;
  if (horasSolLocal >= luzMin) return null;
  if (localIdeal.includes('meia-sombra')) return null;
  return `Esta planta pede ${localIdeal} (pelo menos ${luzMin} h de sol), e este local recebe ${horasSolLocal} h. Ela pode crescer pouco.`;
}

export default function NovoPlantio() {
  const { especie: especieId } = useLocalSearchParams<{ especie: string }>();
  const especie = especieId ? ESPECIES.get(especieId) : undefined;
  const { dados, hoje, recarregar } = useHorta();
  const [localEscolhido, setLocalId] = useState<string | null>(null);
  const [origem, setOrigem] = useState<Origem>('semente');
  const [data, setData] = useState(formatarData(hoje));
  const [quantidade, setQuantidade] = useState('1');
  const [apelido, setApelido] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  if (!especie) return <Tela><Aviso tipo="erro">Escolha uma planta na aba Plantas.</Aviso></Tela>;
  const locais = dados?.locais ?? [];
  // Sem escolha ainda: sugere o último local cadastrado (os dados podem chegar depois da tela abrir).
  const localId = localEscolhido ?? locais.at(-1)?.id ?? null;
  const local = locais.find((l) => l.id === localId);
  const aviso = alertaLuz(especie.localIdeal, local?.horasSol, especie.luzHorasMin);

  async function salvar() {
    setErro(null);
    const dataIso = lerDataBr(data);
    if (!dataIso) return setErro('Use a data no formato dia/mês/ano, por exemplo 24/11/2026.');
    if (paraDia(dataIso) > paraDia(hoje)) return setErro('A data de plantio não pode ser no futuro.');
    const v = novoPlantio.safeParse({
      especieId: especie!.id,
      especieVersao: 1,
      localId: localId ?? '',
      origem,
      dataPlantio: dataIso,
      quantidade: Number(quantidade),
      apelido: apelido.trim() || null,
    });
    if (!v.success) return setErro(v.error.issues[0]?.message ?? 'Confira os dados.');
    setSalvando(true);
    try {
      const id = await criarPlantio(v.data);
      await recarregar();
      router.replace({ pathname: '/plantio/[id]', params: { id } });
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível salvar.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Tela>
      <Titulo>Plantar {especie.nomePopular}</Titulo>
      {locais.length === 0 ? (
        <>
          <Paragrafo>Primeiro cadastre onde vai plantar.</Paragrafo>
          <Botao titulo="Novo local" onPress={() => router.push({ pathname: '/local/novo', params: { voltarPara: 'plantio' } })} />
        </>
      ) : (
        <>
          <Opcoes rotulo="Onde" valor={localId} onChange={setLocalId} opcoes={locais.map((l) => ({ valor: l.id, texto: l.nome }))} />
          <Botao
            titulo="Outro local"
            variante="secundario"
            onPress={() => router.push({ pathname: '/local/novo', params: { voltarPara: 'plantio' } })}
          />
          {aviso && <Aviso>{aviso}</Aviso>}
          <Opcoes rotulo="Começou de" valor={origem} onChange={setOrigem} opcoes={opcoesDe(NOME_ORIGEM)} />
          <Campo rotulo="Data do plantio (dia/mês/ano)" value={data} onChangeText={setData} keyboardType="numbers-and-punctuation" maxLength={10} />
          <Campo rotulo="Quantidade de pés" value={quantidade} onChangeText={setQuantidade} keyboardType="number-pad" maxLength={5} />
          <Campo rotulo="Apelido (opcional)" value={apelido} onChangeText={setApelido} placeholder="Ex.: Alface da varanda" maxLength={60} />
          {erro && <Aviso tipo="erro">{erro}</Aviso>}
          <Botao titulo="Plantar" onPress={salvar} carregando={salvando} />
        </>
      )}
    </Tela>
  );
}
