import * as SecureStore from 'expo-secure-store';

/**
 * Armazenamento da sessão no Keychain (iOS) e no Keystore (Android), nunca em AsyncStorage (SEG-2).
 * O SecureStore guarda até ~2 KB por chave e a sessão do Supabase pode passar disso,
 * então o valor é dividido em partes.
 */
const TAMANHO_PARTE = 1800;
const OPCOES: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
};

// SecureStore aceita só letras, números, ".", "-" e "_" nas chaves.
const chaveSegura = (chave: string) => chave.replace(/[^A-Za-z0-9._-]/g, '_');

export const armazenamentoSeguro = {
  async getItem(chave: string): Promise<string | null> {
    const base = chaveSegura(chave);
    const total = await SecureStore.getItemAsync(`${base}.partes`, OPCOES);
    if (total === null) return null;
    const partes: string[] = [];
    for (let i = 0; i < Number(total); i++) {
      const parte = await SecureStore.getItemAsync(`${base}.${i}`, OPCOES);
      if (parte === null) return null;
      partes.push(parte);
    }
    return partes.join('');
  },

  async setItem(chave: string, valor: string): Promise<void> {
    const base = chaveSegura(chave);
    await this.removeItem(chave);
    const total = Math.ceil(valor.length / TAMANHO_PARTE);
    for (let i = 0; i < total; i++) {
      await SecureStore.setItemAsync(`${base}.${i}`, valor.slice(i * TAMANHO_PARTE, (i + 1) * TAMANHO_PARTE), OPCOES);
    }
    await SecureStore.setItemAsync(`${base}.partes`, String(total), OPCOES);
  },

  async removeItem(chave: string): Promise<void> {
    const base = chaveSegura(chave);
    const total = await SecureStore.getItemAsync(`${base}.partes`, OPCOES);
    await SecureStore.deleteItemAsync(`${base}.partes`, OPCOES);
    for (let i = 0; i < Number(total ?? 0); i++) {
      await SecureStore.deleteItemAsync(`${base}.${i}`, OPCOES);
    }
  },
};
