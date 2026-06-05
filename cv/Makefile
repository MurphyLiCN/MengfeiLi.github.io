# Makefile for compiling Mengfei Li's LaTeX CV
# Compiles cv.tex via XeLaTeX and copies output to ../files/cv.pdf
# (which is what the website's CV download link points to).

LATEX     = xelatex
LATEXOPTS = -interaction=nonstopmode -halt-on-error
SRC       = cv.tex
PDF       = cv.pdf
DEST      = ../files/cv.pdf

.PHONY: all clean publish view

all: $(PDF)

$(PDF): $(SRC) awesome-cv.cls
	$(LATEX) $(LATEXOPTS) $(SRC)
	@echo ""
	@echo "✓ Built $(PDF)"

publish: $(PDF)
	@mkdir -p ../files
	cp $(PDF) $(DEST)
	@echo "✓ Copied to $(DEST) (will be deployed on next git push)"

view: $(PDF)
	open $(PDF)

clean:
	rm -f *.aux *.log *.out *.toc *.fls *.fdb_latexmk *.synctex.gz *.bbl *.blg

# `make` builds and publishes in one step (default for daily use)
.DEFAULT_GOAL := publish
