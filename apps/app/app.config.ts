import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Configuração dinâmica sobre o app.json. EXPO_BASE_URL serve para publicar a versão web
 * num subcaminho, como no GitHub Pages (/Cultiva-). Sem ela, o app fica na raiz.
 */
export default ({ config }: ConfigContext): ExpoConfig => {
  const baseUrl = process.env.EXPO_BASE_URL;
  return {
    ...(config as ExpoConfig),
    ...(baseUrl ? { experiments: { ...config.experiments, baseUrl } } : {}),
  };
};
