# Invoice Generator

A free, no-login web tool for generating professional PDF invoices. Built for the German/European market with locale presets for Germany, USA, and Spain.

## Features

- **No login required** — works entirely in the browser
- **PDF download** — generates real PDF files via html2canvas + jsPDF
- **Locale presets** — Germany (DE), USA (EN), Spain (ES) with localized labels, tax rates, date/number formats
- **LocalStorage persistence** — auto-saves your work, supports named templates
- **Custom logo** — upload your company logo
- **Bank details** — IBAN, BIC, account holder fields
- **Reverse charge** — optional notice for EU cross-border services
- **Tax quick-select** — preset buttons per locale (19%/7%/0% for DE, 21%/10%/4% for ES, etc.)

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- html2canvas + jsPDF for PDF generation
- Self-hosted fonts via @fontsource

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Deploy to Cloudflare Pages

### Option 1: Git integration (recommended)

1. Push this repo to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers & Pages → Create → Pages → Connect to Git
3. Select this repository
4. Set build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Deploy

Every push to `main` will auto-deploy.

### Option 2: Direct upload via CLI

```bash
npm run build
npx wrangler pages deploy dist --project-name=invoice-generator
```

## License

MIT
