# AGENTS.md — Mengfei Li (李梦飞) Academic Personal Website

This repository is an academic personal homepage for **Mengfei Li / 李梦飞**, a PhD candidate in Management Science at the School of Management, Fudan University.

## Current Identity

```yaml
name: Mengfei Li
chinese_name: 李梦飞
email: mfli22@m.fudan.edu.cn
phone: private_not_public
affiliation: School of Management, Fudan University
department: Department of Management Science
advisor: Xiaole Wu
research_interests:
  - AI-based Empirical Operations Management
  - Causal Machine Learning
  - Structural Model Estimation
  - Manufacturing Efficiency and Consistency
  - Supply Chain Resilience
```

## Source Material

- Resume reference: `/Users/murphy/个人信息/简历/李梦飞.docx`
- Profile photo source: WeChat temp image copied into `images/profile.jpg`

Do not publish the phone number from the resume unless the user explicitly asks for it.

## Tech Stack

- Static site: Jekyll + academicpages
- Hosting target: GitHub Pages
- Current repository: `MurphyLiCN/MengfeiLi.github.io`
- Current Pages shape: project site with `baseurl: /MengfeiLi.github.io`
- CV: web CV only

## Key Files

| File | Purpose |
|---|---|
| `_config.yml` | Site identity, author profile, collections, SEO |
| `_pages/about.md` | Homepage |
| `_pages/publications.html` | Research listing page |
| `_pages/talks.html` | Talks listing page |
| `_pages/cv.md` | Web CV |
| `_publications/*.md` | Research entries |
| `_talks/*.md` | Talk and conference entries |
| `_teaching/*.md` | Teaching assistant entries |
| `_includes/person-schema.html` | Person JSON-LD and name-variant SEO metadata |
| `images/profile.jpg` | Public profile image |

## Commands

```bash
bundle install
bundle exec jekyll serve --livereload
bundle exec jekyll build
```

```bash
npm install
npm run build:js
```

## Content Conventions

- Keep the public site concise and academic.
- Add papers under `_publications/` with `collection: publications` and a `category` matching `_config.yml`.
- Add talks under `_talks/` with `collection: talks`.
- Keep phone numbers, private CV drafts, and private research materials out of tracked files.
- Avoid editing `_layouts/` and `_sass/` unless the user asks for structural or visual changes.
- If JavaScript source changes, regenerate `assets/js/main.min.js` with `npm run build:js`.
- Public CV changes should be made in `_pages/cv.md`.

## Open Items

- Current public URL is confirmed as `https://murphylicn.github.io/MengfeiLi.github.io/`.
- Add Google Scholar / ORCID / ResearchGate links if the user provides them.
- Add paper URLs, abstracts, and PDFs when public versions are available.
- Confirm exact dates for teaching assistant roles if needed.
