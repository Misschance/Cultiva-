import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

/** Lado maior da foto enviada. Suficiente para ver a planta e leve para o plano gratuito. */
const LADO_MAXIMO = 1600;

export type Origem = 'camera' | 'galeria';

export interface FotoPronta {
  /** Endereço local, para a prévia na tela. */
  uri: string;
  bytes: Uint8Array;
}

/**
 * Escolhe ou tira uma foto e prepara para envio: redimensiona e regrava como JPEG.
 * Regravar descarta os metadados EXIF, incluindo o GPS (SEG-13). O tipo final é sempre JPEG.
 * Devolve null se a pessoa cancelar.
 */
export async function escolherFoto(origem: Origem): Promise<FotoPronta | null> {
  const permissao =
    origem === 'camera' ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissao.granted) throw new Error(origem === 'camera' ? 'Sem permissão para usar a câmera.' : 'Sem permissão para abrir as fotos.');

  const opcoes: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 1, exif: false, allowsMultipleSelection: false };
  const r = origem === 'camera' ? await ImagePicker.launchCameraAsync(opcoes) : await ImagePicker.launchImageLibraryAsync(opcoes);
  const original = r.canceled ? undefined : r.assets[0];
  if (!original) return null;

  const contexto = ImageManipulator.manipulate(original.uri);
  if (Math.max(original.width, original.height) > LADO_MAXIMO) {
    contexto.resize(original.width >= original.height ? { width: LADO_MAXIMO } : { height: LADO_MAXIMO });
  }
  const imagem = await contexto.renderAsync();
  const salva = await imagem.saveAsync({ format: SaveFormat.JPEG, compress: 0.8 });
  const bytes = new Uint8Array(await (await fetch(salva.uri)).arrayBuffer());
  return { uri: salva.uri, bytes };
}
