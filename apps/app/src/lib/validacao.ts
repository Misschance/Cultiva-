import { z } from 'zod';

export const SENHA_MINIMA = 8;

export const credenciais = z.object({
  email: z.string().trim().toLowerCase().max(254).email('Digite um e-mail válido.'),
  senha: z
    .string()
    .min(SENHA_MINIMA, `A senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.`)
    .max(72, 'A senha pode ter no máximo 72 caracteres.'),
});

/**
 * Mensagem única para falha de login: não revela se o e-mail existe (SEG-4).
 * O detalhe do erro não vai para a tela nem para os logs.
 */
export const ERRO_LOGIN = 'E-mail ou senha incorretos, ou e-mail ainda não confirmado.';
export const ERRO_CADASTRO = 'Não foi possível criar a conta agora. Tente de novo em alguns minutos.';
export const AVISO_CONFIRMAR_EMAIL =
  'Se este e-mail puder ser usado, enviamos um link de confirmação. Abra o link para entrar.';
