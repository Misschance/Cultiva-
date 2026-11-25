import { formatarData, lerDataBr, paraDia } from '@cultivae/core';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { CasaViva } from '../../components/casa-viva';
import { Aviso, Botao, Campo, Paragrafo, Tela, Titulo, useCores } from '../../components/ui';
import { criarPlantaCasa, novaPlantaCasa } from '../../lib/dados';
import { CASA, useHorta } from '../../lib/horta';

/** Cadastro de uma planta de casa na lista do usuário. */
export default function NovaPlantaCasa() {
  const c = useCores();
  const { planta: plantaId } = useLocalSearchParams<{ planta: string }>();
  const planta = plantaId ? CASA.get(plantaId) : undefined;
  const { dados, hoje, recarregar } = useHorta();
  const [apelido, setApelido] = useState('');
  const [comodo, setComodo] = useState('');
  const [desde, setDesde] = useState(formatarData(hoje));
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  if (!planta) return <Tela largura="estreita"><Aviso tipo="erro">Escolha uma planta na aba Plantas, em "Plantas de casa".</Aviso></Tela>;
  if (dados && !dados.casa) {
    return (
      <Tela largura="estreita">
        <Aviso>O cadastro de plantas de casa ainda não está disponível. Tente de novo mais tarde.</Aviso>
      </Tela>
    );
  }

  async function salvar() {
    setErro(null);
    const dataIso = lerDataBr(desde);
    if (!dataIso) return setErro('Use a data no formato dia/mês/ano, por exemplo 24/11/2026.');
    if (paraDia(dataIso) > paraDia(hoje)) return setErro('A data não pode ser no futuro.');
    const v = novaPlantaCasa.safeParse({
      plantaId: planta!.id,
      apelido: apelido.trim() || null,
      comodo: comodo.trim() || null,
      desde: dataIso,
    });
    if (!v.success) return setErro(v.error.issues[0]?.message ?? 'Confira os dados.');
    setSalvando(true);
    try {
      const id = await criarPlantaCasa(v.data);
      await recarregar();
      router.replace({ pathname: '/minha-casa/[id]', params: { id } });
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível salvar.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Tela largura="estreita">
      <View style={{ alignItems: 'center', borderRadius: 28, backgroundColor: c.verdeClaro, paddingTop: 8, overflow: 'hidden' }}>
        <CasaViva plantaId={planta.id} nome={planta.nomePopular} tamanho={160} />
      </View>
      <Titulo>Tenho {planta.nomePopular.toLowerCase()} em casa</Titulo>
      <Paragrafo suave>O app vai lembrar você de tocar na terra. Quem decide se rega é o toque: terra úmida, espere mais um pouco.</Paragrafo>
      <Campo rotulo="Apelido (opcional)" value={apelido} onChangeText={setApelido} placeholder={`Ex.: ${planta.nomePopular} da sala`} maxLength={60} />
      <Campo rotulo="Cômodo (opcional)" value={comodo} onChangeText={setComodo} placeholder="Ex.: Sala, varanda, quarto" maxLength={40} />
      <Campo rotulo="Última rega (dia/mês/ano)" value={desde} onChangeText={setDesde} keyboardType="numbers-and-punctuation" maxLength={10} />
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      <Botao titulo="Salvar" onPress={salvar} carregando={salvando} />
    </Tela>
  );
}
