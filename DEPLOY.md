# Deployment Notes

Current repository:

```text
MurphyLiCN/MengfeiLi.github.io
```

Current `_config.yml` is configured as a GitHub Pages **project site**:

```yaml
url: "https://murphylicn.github.io"
baseurl: "/MengfeiLi.github.io"
repository: "MurphyLiCN/MengfeiLi.github.io"
```

With this setup, the expected Pages URL is:

```text
https://murphylicn.github.io/MengfeiLi.github.io/
```

## Local Build

```bash
bundle exec jekyll build
bundle exec jekyll serve --livereload
```

## If Switching to a User Site

If the repository is renamed or moved to `<username>/<username>.github.io`, update `_config.yml`:

```yaml
url: "https://<username>.github.io"
baseurl: ""
repository: "<username>/<username>.github.io"
```

## If Using a Custom Domain

1. Create `CNAME` at the repository root with one line:

   ```text
   your-domain.com
   ```

2. Update `_config.yml`:

   ```yaml
   url: "https://your-domain.com"
   baseurl: ""
   ```

3. Configure DNS with the standard GitHub Pages records.

4. In GitHub Settings -> Pages, set the custom domain and enable HTTPS after DNS validation passes.
