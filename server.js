'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0';
const BASE_DIR = path.resolve(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  if (body) res.end(body); else res.end();
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  const stream = fs.createReadStream(filePath);
  stream.on('open', () => {
    res.writeHead(200, {
      'Content-Type': type,
      'Cache-Control': 'no-store'
    });
  });
  stream.on('error', (err) => {
    if (err.code === 'ENOENT') return send(res, 404, {'Content-Type': 'text/plain; charset=utf-8'}, '404 Not Found');
    send(res, 500, {'Content-Type': 'text/plain; charset=utf-8'}, '500 Internal Server Error');
  });
  stream.pipe(res);
}

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const decodedPath = decodeURIComponent(url.pathname);
    const normalized = path.posix.normalize(decodedPath);
    const safeRel = normalized.replace(/^\/+/, '');
    let target = path.join(BASE_DIR, safeRel);

    if (!target.startsWith(BASE_DIR)) {
      return send(res, 403, {'Content-Type': 'text/plain; charset=utf-8'}, '403 Forbidden');
    }

    fs.stat(target, (err, stats) => {
      if (err) {
        // Try SPA-style or index fallback for "/"
        if (decodedPath === '/' || decodedPath === '') {
          const indexPath = path.join(BASE_DIR, 'index.html');
          return fs.existsSync(indexPath)
            ? serveFile(res, indexPath)
            : send(res, 404, {'Content-Type': 'text/plain; charset=utf-8'}, '404 Not Found');
        }
        return send(res, 404, {'Content-Type': 'text/plain; charset=utf-8'}, '404 Not Found');
      }

      if (stats.isDirectory()) {
        const indexPath = path.join(target, 'index.html');
        if (fs.existsSync(indexPath)) return serveFile(res, indexPath);
        return send(res, 403, {'Content-Type': 'text/plain; charset=utf-8'}, '403 Directory listing denied');
      }

      return serveFile(res, target);
    });
  } catch (e) {
    return send(res, 500, {'Content-Type': 'text/plain; charset=utf-8'}, '500 Internal Server Error');
  }
});

server.listen(PORT, HOST, () => {
  const hostShown = HOST === '0.0.0.0' ? 'localhost' : HOST;
  console.log(`Server running: http://${hostShown}:${PORT}`);
});

