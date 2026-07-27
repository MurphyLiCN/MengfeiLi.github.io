#!/usr/bin/env python3
"""Validate the generated site without network access or third-party packages."""

from __future__ import annotations

import json
import gzip
import os
import re
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse
from xml.etree import ElementTree


BASEURL = os.environ.get("SITE_BASEURL", "/MengfeiLi.github.io").rstrip("/")
HOST = os.environ.get("SITE_HOST", "murphylicn.github.io")


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: list[str] = []
        self.links: list[tuple[str, str]] = []
        self.images_without_alt: list[str] = []
        self.blank_targets_without_rel: list[str] = []
        self.descriptions = 0
        self.h1 = 0
        self.main = 0
        self.title = 0
        self.canonicals: list[str] = []
        self.robots: list[str] = []
        self.citation_titles = 0
        self.citation_authors = 0
        self.script_sources: list[str] = []
        self.html_lang = ""
        self.skip_links = 0
        self.is_redirect = False
        self.json_ld: list[str] = []
        self._json_buffer: list[str] | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        if tag == "html":
            self.html_lang = data.get("lang") or ""
        if tag == "title":
            self.title += 1
        if tag == "main":
            self.main += 1
        if data.get("id"):
            self.ids.append(data["id"])
        if tag == "h1":
            self.h1 += 1
        if tag == "meta":
            name = (data.get("name") or "").lower()
            if name == "description":
                self.descriptions += 1
            elif name == "robots":
                self.robots.append(data.get("content") or "")
            elif name == "citation_title":
                self.citation_titles += 1
            elif name == "citation_author":
                self.citation_authors += 1
            if (data.get("http-equiv") or "").lower() == "refresh":
                self.is_redirect = True
        if tag in {"a", "link"} and data.get("href"):
            self.links.append(("href", data["href"]))
        if tag == "link" and "canonical" in (data.get("rel") or "").split():
            self.canonicals.append(data.get("href") or "")
        if (
            tag == "a"
            and data.get("href") == "#main"
            and "screen-reader-shortcut" in (data.get("class") or "").split()
        ):
            self.skip_links += 1
        if tag in {"img", "script", "source"} and data.get("src"):
            self.links.append(("src", data["src"]))
        if tag == "script" and data.get("src"):
            self.script_sources.append(data["src"])
        if tag == "source" and data.get("srcset"):
            for candidate in data["srcset"].split(","):
                self.links.append(("srcset", candidate.strip().split()[0]))
        if tag == "img" and "alt" not in data:
            self.images_without_alt.append(data.get("src", "<unknown>"))
        if tag == "a" and data.get("target") == "_blank":
            rel = set((data.get("rel") or "").split())
            if not {"noopener", "noreferrer"}.issubset(rel):
                self.blank_targets_without_rel.append(data.get("href", "<unknown>"))
        if tag == "script" and data.get("type") == "application/ld+json":
            self._json_buffer = []

    def handle_data(self, data: str) -> None:
        if self._json_buffer is not None:
            self._json_buffer.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == "script" and self._json_buffer is not None:
            self.json_ld.append("".join(self._json_buffer))
            self._json_buffer = None


def resolve_internal(site: Path, url: str) -> tuple[Path | None, str]:
    parsed = urlparse(url)
    if parsed.scheme in {"mailto", "tel", "data", "javascript"}:
        return None, ""
    if parsed.scheme in {"http", "https"} and parsed.netloc != HOST:
        return None, ""
    path = unquote(parsed.path)
    if not path:
        return None, parsed.fragment
    if path.startswith(BASEURL):
        path = path[len(BASEURL) :]
    elif parsed.scheme in {"http", "https"}:
        return None, ""
    if not path.startswith("/"):
        return None, parsed.fragment
    relative = path.lstrip("/")
    candidate = site / relative
    if path.endswith("/"):
        candidate /= "index.html"
    elif not candidate.suffix:
        html_candidate = candidate.with_suffix(".html")
        index_candidate = candidate / "index.html"
        candidate = html_candidate if html_candidate.exists() else index_candidate
    return candidate, parsed.fragment


def main() -> int:
    site = Path(sys.argv[1] if len(sys.argv) > 1 else "_site").resolve()
    if not site.is_dir():
        print(f"ERROR: site directory does not exist: {site}", file=sys.stderr)
        return 1

    errors: list[str] = []
    parsed_pages: dict[Path, PageParser] = {}
    for html_file in site.rglob("*.html"):
        parser = PageParser()
        text = html_file.read_text(encoding="utf-8", errors="replace")
        parser.feed(text)
        parsed_pages[html_file] = parser

        duplicate_ids = [item for item, count in Counter(parser.ids).items() if count > 1]
        if duplicate_ids:
            errors.append(f"{html_file}: duplicate IDs {duplicate_ids}")
        if parser.images_without_alt:
            errors.append(f"{html_file}: images without alt {parser.images_without_alt}")
        if parser.blank_targets_without_rel:
            errors.append(f"{html_file}: target=_blank missing noopener/noreferrer {parser.blank_targets_without_rel}")
        is_verification_file = html_file.parent == site and html_file.name.startswith("google")
        is_formal_page = not parser.is_redirect and not is_verification_file
        if is_formal_page:
            if parser.h1 != 1:
                errors.append(f"{html_file}: expected one H1, found {parser.h1}")
            if parser.descriptions != 1:
                errors.append(f"{html_file}: expected one description, found {parser.descriptions}")
            if parser.title != 1:
                errors.append(f"{html_file}: expected one title, found {parser.title}")
            if parser.main != 1:
                errors.append(f"{html_file}: expected one main landmark, found {parser.main}")
            if parser.skip_links != 1:
                errors.append(f"{html_file}: expected one skip link to #main, found {parser.skip_links}")
            if not parser.html_lang:
                errors.append(f"{html_file}: missing html lang")
            if len(parser.canonicals) != 1:
                errors.append(f"{html_file}: expected one canonical, found {len(parser.canonicals)}")
            else:
                canonical = urlparse(parser.canonicals[0])
                if canonical.scheme != "https" or canonical.netloc != HOST:
                    errors.append(f"{html_file}: unexpected canonical origin {parser.canonicals[0]}")
                if BASEURL and not canonical.path.startswith(f"{BASEURL}/"):
                    errors.append(f"{html_file}: canonical omits baseurl {parser.canonicals[0]}")

        relative_html = html_file.relative_to(site).as_posix()
        if relative_html.startswith("publication/") and is_formal_page:
            if parser.citation_titles != 1 or parser.citation_authors < 1:
                errors.append(f"{html_file}: incomplete citation metadata")
            schema_types: set[str] = set()
            for block in parser.json_ld:
                try:
                    parsed = json.loads(block)
                except json.JSONDecodeError:
                    continue
                schema_type = parsed.get("@type") if isinstance(parsed, dict) else None
                if isinstance(schema_type, str):
                    schema_types.add(schema_type)
            if "ScholarlyArticle" not in schema_types:
                errors.append(f"{html_file}: missing ScholarlyArticle JSON-LD")

        noindex_expected = (
            relative_html == "projects/index.html"
            or relative_html.startswith("talks/") and relative_html != "talks/index.html"
            or relative_html
            in {
                "categories/index.html",
                "collection-archive/index.html",
                "page-archive/index.html",
                "tags/index.html",
            }
        )
        if noindex_expected and not any("noindex" in value.lower() for value in parser.robots):
            errors.append(f"{html_file}: thin/compatibility page must be noindex")
        for block in parser.json_ld:
            try:
                json.loads(block)
            except json.JSONDecodeError as exc:
                errors.append(f"{html_file}: invalid JSON-LD ({exc})")

    for html_file, parser in parsed_pages.items():
        for attribute, url in parser.links:
            target, fragment = resolve_internal(site, url)
            if target is None:
                continue
            if not target.exists():
                errors.append(f"{html_file}: broken {attribute} {url}")
                continue
            if fragment and target.suffix == ".html":
                target_parser = parsed_pages.get(target)
                if target_parser and fragment not in target_parser.ids:
                    errors.append(f"{html_file}: missing fragment #{fragment} in {url}")

    required = [
        "files/Mengfei-Li-CV.pdf",
        "files/Mengfei-Li-CV-English.pdf",
        "cv/Mengfei-Li-CV-English.docx",
        "assets/js/main.min.js",
        "assets/css/main.css",
        "sitemap.xml",
    ]
    for relative in required:
        target = site / relative
        if not target.is_file() or target.stat().st_size == 0:
            errors.append(f"missing built artifact: {relative}")

    js_path = site / "assets" / "js" / "main.min.js"
    if js_path.exists() and len(gzip.compress(js_path.read_bytes())) > 50_000:
        errors.append("main.min.js exceeds the 50 KB gzip budget")

    css_path = site / "assets" / "css" / "main.css"
    if css_path.exists() and len(gzip.compress(css_path.read_bytes())) > 40_000:
        errors.append("main.css exceeds the 40 KB gzip budget")

    home_path = site / "index.html"
    if home_path.exists() and len(gzip.compress(home_path.read_bytes())) > 20_000:
        errors.append("homepage HTML exceeds the 20 KB gzip budget")

    for profile_asset in ("images/profile-320.avif", "images/profile-320.webp"):
        asset = site / profile_asset
        if asset.exists() and asset.stat().st_size > 150_000:
            errors.append(f"{profile_asset} exceeds the 150 KB first-screen budget")

    external_scripts = []
    for page in parsed_pages.values():
        for script_source in page.script_sources:
            parsed = urlparse(script_source)
            if parsed.scheme in {"http", "https"} and parsed.netloc != HOST:
                external_scripts.append(script_source)
    if external_scripts:
        errors.append(f"external global scripts found: {sorted(set(external_scripts))}")

    all_html = "\n".join(path.read_text(encoding="utf-8", errors="replace") for path in parsed_pages)
    for forbidden in [
        "Workshop on Empirical Operations Management",
        "presentation by the supervisor",
        "Learning by Doing in SME Manufacturing",
        "Cheng Yue",
        "Ming Liu",
        "10 Ph.D. students annually",
        "10 students per year",
        "(CCF-A)",
        "polyfill.min.js",
        "mathjax",
        "mermaid.esm",
        "plotly",
    ]:
        if forbidden.lower() in all_html.lower():
            errors.append(f"built HTML contains forbidden or stale text: {forbidden}")

    sitemap = (site / "sitemap.xml").read_text(encoding="utf-8", errors="replace")
    if "/projects/" in sitemap:
        errors.append("noindex projects compatibility page appears in sitemap")
    if "eom-workshop-learning-curve" in sitemap:
        errors.append("deleted workshop appears in sitemap")
    try:
        sitemap_root = ElementTree.fromstring(sitemap)
        namespace = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        for location in sitemap_root.findall("s:url/s:loc", namespace):
            parsed = urlparse(location.text or "")
            if parsed.scheme != "https" or parsed.netloc != HOST:
                errors.append(f"sitemap contains unexpected origin: {location.text}")
            if BASEURL and not parsed.path.startswith(f"{BASEURL}/"):
                errors.append(f"sitemap URL omits baseurl: {location.text}")
            talks_root = f"{BASEURL}/talks/"
            if parsed.path.startswith(talks_root) and parsed.path != talks_root:
                errors.append(f"thin talk detail page appears in sitemap: {location.text}")
    except ElementTree.ParseError as exc:
        errors.append(f"invalid sitemap XML: {exc}")

    manifest_path = site / "images" / "manifest.json"
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        expected_scope = f"{BASEURL}/" if BASEURL else "/"
        for field in ("start_url", "scope"):
            if manifest.get(field) != expected_scope:
                errors.append(f"manifest {field} should be {expected_scope}")
        if manifest.get("display") != "standalone":
            errors.append("manifest display should be standalone")
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(f"invalid web manifest: {exc}")

    if (site / "feed.xml").exists():
        errors.append("empty RSS feed should not be generated")

    robots_path = site / "robots.txt"
    if robots_path.exists():
        expected_sitemap = f"https://{HOST}{BASEURL}/sitemap.xml"
        if expected_sitemap not in robots_path.read_text(encoding="utf-8", errors="replace"):
            errors.append(f"robots.txt should reference {expected_sitemap}")

    public_text = "\n".join(
        path.read_text(encoding="utf-8", errors="replace")
        for path in site.rglob("*")
        if path.is_file() and path.suffix.lower() in {".html", ".xml", ".json", ".txt", ".js", ".css"}
    )
    privacy_patterns = {
        r"\b1[3-9]\d{9}\b": "possible mainland-China mobile number",
        r"2000-06": "private birth month",
        r"(?:/Users/|/home/)[^/\s]+/": "private local path",
        r"[A-Z]:\\Users\\[^\\\s]+\\": "private Windows path",
    }
    for pattern, label in privacy_patterns.items():
        if re.search(pattern, public_text):
            errors.append(f"built site contains {label}")

    if errors:
        print("\n".join(f"ERROR: {message}" for message in errors), file=sys.stderr)
        return 1

    print(
        f"Built-site checks passed: {len(parsed_pages)} HTML pages and "
        f"{sum(len(page.links) for page in parsed_pages.values())} references inspected."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
