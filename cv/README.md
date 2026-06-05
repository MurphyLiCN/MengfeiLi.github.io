# LaTeX CV — Mengfei Li

Academic CV source based on [Awesome-CV](https://github.com/posquit0/Awesome-CV).

## Build

```bash
make
make view
make clean
```

The default `make` target compiles `cv.tex` with XeLaTeX and copies `cv.pdf` to `../files/cv.pdf` for the website.

## Notes

- The public CV intentionally omits the phone number.
- Edit `cv.tex` for CV content changes.
- Run `make` after editing so the website PDF is refreshed.
- If Source Sans 3 is missing, install it via macOS Font Book or switch the font in `awesome-cv.cls`.
