const fs = require('fs');
// const final = require('../gamesDataFinal');

// console.log(final.length);
const gamesWithoutURLs = JSON.parse(fs.readFileSync('gamesDataFinal.js', 'utf8'))
console.log(gamesWithoutURLs.length);
// const gamesWithURLs = JSON.parse(fs.readFileSync('gamesWithURLs.json', 'utf8'))
// console.log(gamesWithURLs.length);