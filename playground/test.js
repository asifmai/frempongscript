const fs = require('fs');
const gamesWithoutURLs = JSON.parse(fs.readFileSync('gamesWithoutURLs.json', 'utf8'))
console.log(gamesWithoutURLs.length);
const gamesWithURLs = JSON.parse(fs.readFileSync('gamesWithURLs.json', 'utf8'))
console.log(gamesWithURLs.length);