# Landing page de afiliado – Elephant Bet Angola

Landing page em Angular 21 + Tailwind CSS 4, pré-renderizada em HTML estático (bom para SEO).

## Configuração

Tudo o que muda com frequência está em [`src/app/site.config.ts`](src/app/site.config.ts):

- `affiliateUrl` – link de afiliado usado em todos os botões
- `promoCode` – código promocional opcional (vazio = escondido)
- `siteUrl` – domínio onde a página está publicada (usado no canonical, Open Graph e JSON-LD)

Se mudares o domínio, actualiza também `public/robots.txt` e `public/sitemap.xml`.

## Desenvolvimento

```bash
pnpm install
pnpm start          # http://localhost:4200
pnpm build          # gera dist/elephant-afiliado/browser
```

## Publicação gratuita (Cloudflare Pages)

1. Cria conta em https://dash.cloudflare.com (plano gratuito).
2. **Workers & Pages → Create → Pages → Connect to Git** e escolhe este repositório.
3. Definições de build:
   - Framework preset: **None**
   - Build command: `pnpm build`
   - Build output directory: `dist/elephant-afiliado/browser`
4. Nome do projecto: `landingelephant` → a página fica em `https://landingelephant.pages.dev`.

Cada `git push` para `main` publica automaticamente uma nova versão.
