# Olympiad Prep

A lightweight static site for planning math olympiad study.

## Development

```bash
npm ci
npm test
npm run build
```

The build outputs to `dist/`. Serve the folder locally with any static server:

```bash
npx serve dist
```

## Deployment

Push to `main` and GitHub Pages deploys automatically via the workflow in `.github/workflows/build.yml`.

## Audits

Run Lighthouse locally against the built site:

```bash
npx lighthouse http://localhost:3000/index.html --chrome-flags="--headless" --only-categories=performance,accessibility,best-practices,seo
```

Ensure scores are ≥95 on the home page and ≥90 elsewhere.
