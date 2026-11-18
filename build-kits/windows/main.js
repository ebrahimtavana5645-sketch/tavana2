// برنامه را با یک سرور محلی کوچک اجرا می‌کند تا خواندن فایل‌های شهرها (fetch) کار کند
const { app, BrowserWindow, shell } = require('electron');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, 'app');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '.webmanifest': 'application/manifest+json' };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      let p = decodeURIComponent(req.url.split('?')[0]); if (p === '/') p = '/index.html';
      const f = path.join(root, path.normalize(p).replace(/^(\.\.[\/\\])+/, ''));
      if (!f.startsWith(root)) { rsp.writeHead(403); return rsp.end(); }
      fs.readFile(f, (e, d) => { if (e) { rsp.writeHead(404); return rsp.end(); } rsp.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); rsp.end(d); });
    }).listen(0, '127.0.0.1', () => res(srv.address().port));
  });
}
app.whenReady().then(async () => {
  const port = await serve();
  const w = new BrowserWindow({ width: 1100, height: 850, autoHideMenuBar: true, icon: path.join(root, 'icons', 'icon-512.png'), title: 'اوقات شرعی' });
  w.loadURL(`http://127.0.0.1:${port}/index.html`);
  w.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
});
app.on('window-all-closed', () => app.quit());
