// کپی امن پوشهٔ برنامه به مقصد (مقصد داخل پوشهٔ مبدأ است، پس cpSync مستقیم خطا می‌دهد)
const fs = require('fs'), path = require('path');
const SKIP_DIRS = new Set(['build-kits', '.github', 'node_modules', '.git']);
module.exports = function copyApp(src, dst) {
  fs.rmSync(dst, { recursive: true, force: true });
  (function walk(from, to) {
    fs.mkdirSync(to, { recursive: true });
    for (const e of fs.readdirSync(from, { withFileTypes: true })) {
      if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) walk(path.join(from, e.name), path.join(to, e.name)); }
      else if (!e.name.endsWith('.txt')) fs.copyFileSync(path.join(from, e.name), path.join(to, e.name));
    }
  })(src, dst);
};
