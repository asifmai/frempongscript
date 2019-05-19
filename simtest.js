const similarity = require('./similar');

const a = 'uno';
const b = 'uno®';

console.log(similarity(a,b));   // 0.75