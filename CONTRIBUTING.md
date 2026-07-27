# Contributing

This repository is Mengfei Li's public academic website rather than a generic AcademicPages template.

## Before Editing

- Read `AGENTS.md` for identity, content, and privacy constraints.
- Treat `_data/profile.yml`, `_data/projects.yml`, `_data/awards.yml`, publication front matter, and talk front matter as the canonical public sources.
- Do not add a phone number, birth date, home address, private CV draft, local path, or confidential research file.

## Content Changes

- Add publications under `_publications/` using the established normalized status and resource fields.
- Add presentations under `_talks/` with `sort_date`, `display_date`, `presentation_type`, and `paper_id` when applicable.
- Update projects and awards in `_data/` rather than duplicating facts across pages.
- Update both the English and Chinese summaries when a change affects both audiences.
- Regenerate the English DOCX/PDF CV after changing facts that appear in it.

## Required Checks

```bash
npm ci --ignore-scripts
bundle install
npm run check:content
npm run build:js
JEKYLL_ENV=production bundle exec jekyll build --safe --trace
npm run check:build
npm run test:e2e
```

If JavaScript source changes, commit the rebuilt `assets/js/main.min.js`. If dependencies change, commit both lock files.

Do not commit, push, deploy, or open a pull request on someone else's behalf without explicit authorization.
