const path = require('path');
const copyApp = require('../copy-app');
copyApp(path.resolve(__dirname, '..', '..'), path.join(__dirname, 'app'));
console.log('app آماده شد');
