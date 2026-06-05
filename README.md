# Mengfei Li (李梦飞) — Academic Personal Website

Source code for Mengfei Li's academic personal website.

This site is based on the [academicpages](https://github.com/academicpages/academicpages.github.io) Jekyll template and is intended for GitHub Pages. The public CV source is maintained in [`cv/`](cv/).

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

```bash
cd cv
make
```

The default `make` target compiles `cv/cv.tex` and copies the result to `files/cv.pdf`, which is the public download target.

## Content Files

- `_pages/about.md`: homepage
- `_publications/*.md`: research entries
- `_talks/*.md`: talks and conference presentations
- `_pages/cv.md`: web CV
- `cv/cv.tex`: LaTeX CV
- `images/profile.jpg`: profile photo

## Privacy

Phone numbers and private materials should not be committed to this public repository. The current public site exposes only the academic email address.
