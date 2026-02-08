/**
 * Configurações do Sistema
 *
 * Roles disponíveis no sistema.
 * O controle de admin é feito 100% pelo banco de dados.
 */

export const ADMIN_CONFIG = {
  // Mensagem exibida na página de acesso negado
  ACCESS_DENIED_MESSAGE:
    "Você não tem permissão para acessar o painel administrativo.",

  // Título do painel
  PANEL_TITLE: "Admin",
  PANEL_SUBTITLE: "Painel de Controle",

  // Roles disponíveis no sistema
  ROLES: {
    ADMIN: "admin",
    CLIENTE: "cliente",
  } as const,
};
