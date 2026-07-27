#!/usr/bin/env node

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { gzipSync } from "node:zlib";

const root = resolve(process.argv[2] || "_site");
const port = Number(process.env.PORT || 4000);
const host = process.env.HOST || "localhost";
const baseurl = (process.env.BASEURL ?? "/MengfeiLi.github.io").replace(/\/$/, "");
const mimeTypes = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};
const compressible = new Set([".css", ".html", ".js", ".json", ".svg", ".txt", ".xml"]);

async function findFile(pathname) {
  const decoded = decodeURIComponent(pathname);
  const relative = normalize(decoded).replace(/^[/\\]+/, "");
  let candidate = resolve(join(root, relative));
  if (candidate !== root && !candidate.startsWith(root + sep)) return null;

  try {
    const metadata = await stat(candidate);
    if (metadata.isDirectory()) candidate = join(candidate, "index.html");
  } catch (_error) {
    if (!extname(candidate)) candidate += ".html";
  }

  try {
    return (await stat(candidate)).isFile() ? candidate : null;
  } catch (_error) {
    return null;
  }
}

const server = createServer(async (request, response) => {
  let pathname = new URL(request.url || "/", `http://${request.headers.host}`).pathname;
  if (baseurl && (pathname === baseurl || pathname.startsWith(`${baseurl}/`))) {
    pathname = pathname.slice(baseurl.length) || "/";
  }
  const file = await findFile(pathname);
  if (!file) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const extension = extname(file).toLowerCase();
  let body = await readFile(file);
  const headers = {
    "Content-Type": mimeTypes[extension] || "application/octet-stream",
    "Cache-Control": extension === ".html" ? "no-cache" : "public, max-age=3600",
    "X-Content-Type-Options": "nosniff",
  };
  if (
    compressible.has(extension) &&
    /\bgzip\b/.test(request.headers["accept-encoding"] || "")
  ) {
    body = gzipSync(body, { level: 9 });
    headers["Content-Encoding"] = "gzip";
    headers.Vary = "Accept-Encoding";
  }
  headers["Content-Length"] = String(body.length);
  response.writeHead(200, headers);
  response.end(request.method === "HEAD" ? undefined : body);
});

server.listen(port, host, () => {
  console.log(`Serving ${root} at http://${host}:${port}/`);
});
