# Deployment Notes

Repository: `MurphyLiCN/MengfeiLi.github.io`

The site is currently a GitHub Pages project site:

```yaml
url: "https://murphylicn.github.io"
baseurl: "/MengfeiLi.github.io"
repository: "MurphyLiCN/MengfeiLi.github.io"
```

Public URL: <https://murphylicn.github.io/MengfeiLi.github.io/>

## Automated Deployment

`.github/workflows/pages.yml` builds with the committed Ruby, Node, Bundler, npm, and gem lock files. It runs the content checker, regenerates and verifies JavaScript, performs a safe production Jekyll build, validates internal links and metadata, uploads the Pages artifact, and deploys it.

The workflow runs on pushes to `main` and via manual dispatch. It does not publish from local builds.

## Local Production Check

```bash
npm ci --ignore-scripts
bundle install
npm run check:content
npm run build:js
JEKYLL_ENV=production bundle exec jekyll build --safe --trace
python3 scripts/check_built_site.py _site
```

## Switching to a User Site

If the repository is moved to `<username>/<username>.github.io`, update:

```yaml
url: "https://<username>.github.io"
baseurl: ""
repository: "<username>/<username>.github.io"
```

Update `BASEURL` in `scripts/check_built_site.py`, the Playwright default URL, and the README URLs at the same time.

## Adding a Custom Domain

1. Add a root `CNAME` file containing the domain.
2. Set `_config.yml` `url` to the HTTPS custom domain and `baseurl` to an empty string.
3. Update the checker, Playwright default URL, and documentation.
4. Configure the standard GitHub Pages DNS records.
5. Set the custom domain in GitHub Pages settings and enable HTTPS after DNS validation.
