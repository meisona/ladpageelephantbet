/**
 * Configuração central da landing page.
 * >>> Altere AFFILIATE_URL para o SEU link de afiliado. <<<
 * Todos os botões "Criar conta" da página usam este link.
 */
export const SITE_CONFIG = {
  /** O teu link de afiliado (copiado do painel de afiliados da Elephant Bet). */
  affiliateUrl: 'https://www.elephantbet.co.ao/affiliates/?btag=2070663_l366188',

  /** Código promocional opcional para mostrar na página (deixe '' para esconder). */
  promoCode: '',

  /** Domínio final onde a landing page vai ficar publicada (sem barra no fim). */
  siteUrl: 'https://ladpageelephantbet.pages.dev',

  siteName: 'Aposta Angola – Guia Elephant Bet',

  seo: {
    title: 'Elephant Bet Angola: Cria a tua Conta e Começa a Apostar | Registo Rápido',
    description:
      'Cria a tua conta na Elephant Bet Angola em menos de 2 minutos. Apostas desportivas, Aviator, Casino e Casino ao vivo, com depósitos em Kwanzas. Só para maiores de 18 anos.',
    keywords:
      'elephant bet, elephantbet, elephant bet angola, apostas online angola, criar conta elephant bet, registo elephant bet, aviator angola, casino online angola, apostas desportivas angola',
    ogImage: '/og-image.png',
    locale: 'pt_AO',
  },
} as const;
