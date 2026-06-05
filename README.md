# Mengfei Li (李梦飞) — Academic Personal Website

Source code for Mengfei Li's academic personal website.

This site is based on the [academicpages](https://github.com/academicpages/academicpages.github.io) Jekyll template and is intended for GitHub Pages.

## Quick Start

```bash
bundle install
bundle exec jekyll serve --livereload
```

Open `http://localhost:4000/MengfeiLi.github.io/` when using the current project-site configuration.

## Build

```bash
bundle exec jekyll build
```

## JavaScript Assets

Only needed after changing JavaScript source files:

```bash
npm install
npm run build:js
```

## CV

The public CV is maintained as the web page at `_pages/cv.md`.

## Content Files

- `_pages/about.md`: homepage
- `_publications/*.md`: research entries
- `_talks/*.md`: talks and conference presentations
- `_pages/cv.md`: web CV
- `images/profile.jpg`: profile photo

## Privacy

Phone numbers and private materials should not be committed to this public repository. The current public site exposes only the academic email address.
