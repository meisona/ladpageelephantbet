import { Component, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { SITE_CONFIG } from './site.config';
import { Icon } from './icon';

interface Faq {
  q: string;
  a: string;
}

interface Match {
  league: string;
  home: string;
  away: string;
  homeTag: string;
  awayTag: string;
  homeColor: string;
  awayColor: string;
  status: string;
  live: boolean;
  score?: [number, number];
  odds: [string, string, string];
}

@Component({
  selector: 'app-root',
  imports: [Icon],
  templateUrl: './app.html',
})
export class App {
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly document = inject(DOCUMENT);

  protected readonly cfg = SITE_CONFIG;
  protected readonly year = new Date().getFullYear();
  protected readonly copied = signal(false);

  /** Selecção activa no boletim de demonstração (índice do jogo, índice da odd). */
  protected readonly pick = signal<[number, number]>([0, 0]);
  protected readonly stake = 1000;

  protected readonly sportsTabs = ['Futebol', 'Basquetebol', 'Ténis', 'Andebol'];

  protected readonly matches: Match[] = [
    {
      league: 'Premier League',
      home: 'Manchester City', away: 'Arsenal',
      homeTag: 'MCI', awayTag: 'ARS', homeColor: '#6cabdd', awayColor: '#ef0107',
      status: "63'", live: true, score: [1, 0],
      odds: ['1.55', '3.80', '5.40'],
    },
    {
      league: 'La Liga',
      home: 'Real Madrid', away: 'Barcelona',
      homeTag: 'RMA', awayTag: 'BAR', homeColor: '#e8e8e8', awayColor: '#a50044',
      status: 'Hoje 20:00', live: false,
      odds: ['2.25', '3.60', '2.90'],
    },
    {
      league: 'Liga dos Campeões',
      home: 'Bayern Munique', away: 'Liverpool',
      homeTag: 'BAY', awayTag: 'LIV', homeColor: '#dc052d', awayColor: '#c8102e',
      status: 'Amanhã 20:00', live: false,
      odds: ['2.10', '3.70', '3.20'],
    },
    {
      league: 'Ligue 1',
      home: 'PSG', away: 'Marseille',
      homeTag: 'PSG', awayTag: 'OM', homeColor: '#004170', awayColor: '#2faee0',
      status: 'Dom 19:45', live: false,
      odds: ['1.50', '4.40', '6.00'],
    },
    {
      league: 'Girabola',
      home: 'Petro de Luanda', away: '1º de Agosto',
      homeTag: 'PET', awayTag: 'AGO', homeColor: '#f4c20d', awayColor: '#d62828',
      status: 'Sáb 16:00', live: false,
      odds: ['1.95', '3.10', '3.80'],
    },
  ];

  protected readonly ticker = [
    'Premier League · Man. City 1–0 Arsenal · 63\'',
    'La Liga · Real Madrid × Barcelona · 1 2.25 · X 3.60 · 2 2.90',
    'Aviator · último voo x 8.32',
    'Champions · Bayern × Liverpool · 1 2.10 · X 3.70 · 2 3.20',
    'Ligue 1 · PSG × Marseille · 1 1.50 · X 4.40 · 2 6.00',
    'Serie A · Inter × Juventus · 1 2.05 · X 3.30 · 2 3.60',
    'Premier League · Chelsea × Man. United · 1 1.95 · X 3.50 · 2 3.75',
    'Girabola · Petro × 1º de Agosto · 1 1.95 · X 3.10 · 2 3.80',
    'Casino ao vivo · Roleta Europeia · 24h',
  ];

  /** Ligas em destaque (secção própria, todas levam ao registo). */
  protected readonly leagues = [
    { name: 'Premier League', country: 'Inglaterra' },
    { name: 'La Liga', country: 'Espanha' },
    { name: 'Liga dos Campeões', country: 'Europa' },
    { name: 'Ligue 1', country: 'França' },
    { name: 'Serie A', country: 'Itália' },
    { name: 'Bundesliga', country: 'Alemanha' },
    { name: 'Liga Portugal', country: 'Portugal' },
    { name: 'Girabola', country: 'Angola' },
  ];

  protected readonly steps: { title: string; text: string }[] = [
    { title: 'Abre o registo', text: 'Toca em «Criar conta». Preenche o formulário oficial da Elephant Bet, já com o código de parceiro que te habilita a ganhar bónus de primeiro depósito.' },
    { title: 'Completa os dados',text: 'Número de telemóvel angolano (+244), palavra-passe e dados pessoais. Menos de 2 minutos.' },
    { title: 'Verifica e deposita', text: 'Confirma a conta, faz o primeiro depósito em Kwanzas e escolhe o teu primeiro jogo.' },
  ];

  protected readonly faqs: Faq[] = [
    {
      q: 'Como criar conta na Elephant Bet Angola?',
      a: 'Clica no botão "Criar conta" desta página, preenche o formulário de registo com o teu número de telefone e dados pessoais, confirma a conta e faz o primeiro depósito.',
    },
    {
      q: 'A Elephant Bet é legal em Angola?',
      a: 'Sim. A Elephant Bet Angola é licenciada e regulada pelo Instituto de Supervisão de Jogos (ISJ) de Angola.',
    },
    {
      q: 'Qual é a idade mínima para apostar?',
      a: 'É obrigatório ter 18 anos ou mais. O jogo é estritamente proibido para menores de idade.',
    },
  ];

  constructor() {
    this.setupSeo();
  }

  protected selectOdd(match: number, odd: number) {
    this.pick.set([match, odd]);
  }

  protected isPicked(match: number, odd: number) {
    const [m, o] = this.pick();
    return m === match && o === odd;
  }

  protected pickedMatch() {
    return this.matches[this.pick()[0]];
  }

  protected pickedOdd() {
    const [m, o] = this.pick();
    return this.matches[m].odds[o];
  }

  protected pickedLabel() {
    const [m, o] = this.pick();
    const match = this.matches[m];
    return o === 0 ? match.home : o === 1 ? 'Empate' : match.away;
  }

  protected payout() {
    const value = Math.round(this.stake * parseFloat(this.pickedOdd()));
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  protected async copyCode() {
    try {
      await navigator.clipboard.writeText(this.cfg.promoCode);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      /* clipboard indisponível */
    }
  }

  /** Meta tags + JSON-LD. Renderizados no HTML estático (prerender) para os motores de busca. */
  private setupSeo() {
    const { seo, siteUrl, siteName } = this.cfg;
    const url = `${siteUrl}/`;
    const image = `${siteUrl}${seo.ogImage}`;

    this.titleService.setTitle(seo.title);
    this.meta.addTags([
      { name: 'description', content: seo.description },
      { name: 'keywords', content: seo.keywords },
      { name: 'robots', content: 'index, follow, max-image-preview:large' },
      { name: 'author', content: siteName },
      { name: 'theme-color', content: '#07080f' },
      { name: 'rating', content: 'adult' },
      { name: 'geo.region', content: 'AO' },
      { name: 'geo.placename', content: 'Luanda' },
      // Open Graph (Facebook, WhatsApp, Instagram)
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: siteName },
      { property: 'og:locale', content: seo.locale },
      { property: 'og:url', content: url },
      { property: 'og:title', content: seo.title },
      { property: 'og:description', content: seo.description },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: seo.title },
      // Twitter / X
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: seo.title },
      { name: 'twitter:description', content: seo.description },
      { name: 'twitter:image', content: image },
    ]);

    const head = this.document.head;
    // No browser o HTML pré-renderizado já traz estas tags; evita duplicar.
    if (head.querySelector('link[rel="canonical"]')) return;

    const canonical = this.document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', url);
    head.appendChild(canonical);

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebSite', '@id': `${url}#website`, url, name: siteName, inLanguage: 'pt-AO' },
        {
          '@type': 'WebPage',
          '@id': `${url}#webpage`,
          url,
          name: seo.title,
          description: seo.description,
          isPartOf: { '@id': `${url}#website` },
          inLanguage: 'pt-AO',
          primaryImageOfPage: image,
        },
        {
          '@type': 'FAQPage',
          '@id': `${url}#faq`,
          mainEntity: this.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
      ],
    };
    const script = this.document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify(jsonLd);
    head.appendChild(script);
  }
}
