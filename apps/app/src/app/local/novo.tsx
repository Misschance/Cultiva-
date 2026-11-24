import type { MaterialVaso, TipoLocal } from '@cultivae/core';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { PerguntaSol } from '../../components/sol';
import { Aviso, Botao, Campo, Opcoes, Tela } from '../../components/ui';
import { criarLocal, novoLocal } from '../../lib/dados';
import { useHorta } from '../../lib/horta';
import { NOME_MATERIAL, NOME_TIPO_LOCAL, opcoesDe } from '../../lib/rotulos';

const numero = (t: string) => {
  const n = Number(t.replace(',', '.'));
  return t.trim() === '' || !Number.isFinite(n) ? null : n;
};

export default function NovoLocal() {
  const { voltarPara } = useLocalSearchParams<{ voltarPara?: string }>();
  const { recarregar } = useHorta();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<TipoLocal>('vaso');
  const [interno, setInterno] = useState<'sim' | 'nao'>('nao');
  const [horasSol, setHorasSol] = useState<number | null>(null);
  const [solInvalido, setSolInvalido] = useState(false);
  const aoMudarSol = useCallback((h: number | null, invalido: boolean) => {
    setHorasSol(h);
    setSolInvalido(invalido);
  }, []);
  const [volume, setVolume] = useState('');
  const [material, setMaterial] = useState<MaterialVaso | null>('plastico');
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const ehVaso = tipo === 'vaso' || tipo === 'jardineira';

  async function salvar() {
    setErro(null);
    if (solInvalido) {
      setErro('Confira o horário do sol.');
      return;
    }
    const dados = {
      nome,
      tipo,
      interno: interno === 'sim',
      horasSol,
      volumeLitros: ehVaso ? numero(volume) : null,
      material: ehVaso ? material : null,
    };
    const v = novoLocal.safeParse(dados);
    if (!v.success) {
      setErro(v.error.issues[0]?.message ?? 'Confira os dados.');
      return;
    }
    setSalvando(true);
    try {
      const id = await criarLocal(v.data);
      await recarregar();
      if (voltarPara === 'plantio') router.back();
      else router.replace({ pathname: '/horta', params: { novo: id } });
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível salvar.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Tela>
      <Campo rotulo="Nome do local" value={nome} onChangeText={setNome} placeholder="Ex.: Varanda, Canteiro 1" maxLength={60} />
      <Opcoes rotulo="Tipo" valor={tipo} onChange={setTipo} opcoes={opcoesDe(NOME_TIPO_LOCAL)} />
      <Opcoes
        rotulo="Fica dentro de casa?"
        valor={interno}
        onChange={setInterno}
        opcoes={[
          { valor: 'nao', texto: 'Não, pega chuva' },
          { valor: 'sim', texto: 'Sim, ou coberto' },
        ]}
      />
      <PerguntaSol onChange={aoMudarSol} />
      {ehVaso && (
        <>
          <Campo
            rotulo="Volume do vaso em litros (opcional)"
            value={volume}
            onChangeText={setVolume}
            keyboardType="decimal-pad"
            placeholder="Ex.: 10"
            maxLength={6}
          />
          <Opcoes rotulo="Material" valor={material} onChange={setMaterial} opcoes={opcoesDe(NOME_MATERIAL)} />
        </>
      )}
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      <Botao titulo="Salvar local" onPress={salvar} carregando={salvando} />
    </Tela>
  );
}
