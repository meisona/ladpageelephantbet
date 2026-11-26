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
      league: 'Girabola',
      home: 'Petro de Luanda', away: '1º de Agosto',
      homeTag: 'PET', awayTag: 'AGO', homeColor: '#f4c20d', awayColor: '#d62828',
      status: "63'", live: true, score: [1, 0],
      odds: ['1.45', '3.90', '6.25'],
    },
    {
      league: 'Girabola',
      home: 'Sagrada Esperança', away: 'Interclube',
      homeTag: 'SAG', awayTag: 'INT', homeColor: '#1f8a4c', awayColor: '#1d4ed8',
      status: 'Hoje 18:00', live: false,
      odds: ['2.05', '3.10', '3.45'],
    },
    {
      league: 'Liga dos Campeões',
      home: 'Benfica', away: 'Real Madrid',
      homeTag: 'SLB', awayTag: 'RMA', homeColor: '#e30613', awayColor: '#e8e8e8',
      status: 'Amanhã 20:00', live: false,
      odds: ['3.60', '3.75', '1.95'],
    },
    {
      league: 'Premier League',
      home: 'Arsenal', away: 'Liverpool',
      homeTag: 'ARS', awayTag: 'LIV', homeColor: '#ef0107', awayColor: '#c8102e',
      status: 'Sáb 17:30', live: false,
      odds: ['2.30', '3.40', '2.95'],
    },
  ];

  protected readonly ticker = [
    'Petro de Luanda 1–0 1º de Agosto · 63\'',
    'Wiliete × Kabuscorp · 1 2.40 · X 3.05 · 2 2.85',
    'Aviator · último voo x 8.32',
    'Benfica × Real Madrid · 1 3.60 · X 3.75 · 2 1.95',
    'NBA · Lakers × Celtics · 1.88 / 1.94',
    'Arsenal × Liverpool · 1 2.30 · X 3.40 · 2 2.95',
    'Casino ao vivo · Roleta Europeia · 24h',
  ];

  protected readonly steps: { title: string; text: string }[] = [
    { title: 'Abre o registo', text: 'Toca em «Criar conta». Abres o formulário oficial da Elephant Bet, já com o meu código de parceiro.' },
    { title: 'Preenche os dados', text: 'Número de telemóvel angolano (+244), palavra-passe e dados pessoais. Menos de 2 minutos.' },
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
