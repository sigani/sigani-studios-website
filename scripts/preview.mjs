import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('../public/', import.meta.url)));
const config = JSON.parse(await readFile(path.join(root, 'staticwebapp.config.json'), 'utf8'));
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.txt': 'text/plain; charset=utf-8' };
const port = Number(process.env.PORT || 4280);

http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      return res.end();
    }
    const mapped = config.routes.find(route => route.route === urlPath)?.rewrite || urlPath;
    let file = path.resolve(root, `.${mapped}`);
    if (file !== root && !file.startsWith(root + path.sep)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }
    let status = 200;
    try {
      if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
      await stat(file);
    } catch {
      status = 404;
      file = path.join(root, '404.html');
    }
    const data = await readFile(file);
    res.writeHead(status, {
      ...config.globalHeaders,
      'Content-Type': mime[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {
    res.writeHead(400);
    res.end('Bad request');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Sigani Studios preview: http://127.0.0.1:${port}`);
});
