// پوشهٔ برنامه (دو سطح بالاتر از این فایل) را در www کپی می‌کند
const path = require('path');
const copyApp = require('../copy-app');
copyApp(path.resolve(__dirname, '..', '..'), path.join(__dirname, 'www'));
console.log('www آماده شد');
