# Mengfei Li (李梦飞) — Academic Website

Source for Mengfei Li's academic personal website, built with Jekyll and AcademicPages and published as a GitHub Pages project site.

Public URL: <https://murphylicn.github.io/MengfeiLi.github.io/>

## Prerequisites

- Ruby 3.4.10
- Bundler 2.5.11
- Node.js 24.18.0
- Python 3 for the dependency-free built-site checker

The Ruby and Node versions are pinned in `.ruby-version` and `.node-version`. Install dependencies from the committed lock files:

```bash
bundle install
npm ci --ignore-scripts
```

## Local Development

Use the development override to serve the project at the site root:

```bash
bundle exec jekyll serve --livereload --config _config.yml,_config.development.yml
```

Open <http://localhost:4000/>.

To reproduce the production project-site URL shape instead:

```bash
bundle exec jekyll serve --livereload --config _config.yml
```

Open <http://localhost:4000/MengfeiLi.github.io/>.

## Production Build and Checks

```bash
npm run check:content
npm run build:js
JEKYLL_ENV=production bundle exec jekyll build --safe --trace
npm run check:build
```

Browser and accessibility checks use Playwright and axe:

```bash
npx playwright install chromium
npm run test:e2e
```

Run the three-sample mobile Lighthouse check while the site is being served:

```bash
npm run serve:static
npm run lighthouse -- http://localhost:4000/MengfeiLi.github.io/
```

## Content Sources

- `_data/profile.yml`: job-market positioning and research interests
- `_data/projects.yml`: funded and applied projects
- `_data/awards.yml`: honors and awards
- `_publications/*.md`: publication metadata and abstracts
- `_talks/*.md`: presentations and conference participation
- `_pages/about.md`: English homepage
- `_pages/zh.md`: Chinese profile
- `_pages/cv.md`: web CV

The English academic CV is generated from these structured site sources:

```bash
python3 scripts/build_english_cv.py
```

Generated public artifacts:

- `cv/Mengfei-Li-CV-English.docx`
- `files/Mengfei-Li-CV-English.pdf`
- `files/Mengfei-Li-CV.pdf` (authoritative Chinese CV)

After changing the English CV builder or structured data, regenerate the DOCX, export the PDF through LibreOffice, and visually inspect every page before publishing.

## Privacy

This is a public repository. Do not commit or publish phone numbers, birth dates, home addresses, private drafts, local filesystem paths, or confidential research materials. The content checker enforces the most important public-data rules.

## Deployment

GitHub Actions builds and deploys the site from `main`. Actions are pinned to full commit SHAs. See [DEPLOY.md](DEPLOY.md) for the project-site configuration and migration notes.
