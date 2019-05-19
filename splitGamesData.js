const fs = require('fs');

module.exports = () => new Promise((resolve, reject) => {
  try {
    let gamesWithURLs = [];
    let gamesWithoutURLs = [];
    const gamesData = JSON.parse(fs.readFileSync('psen2.json'));
    for (let i = 0; i < gamesData.length; i++) {
      if (gamesData[i].url) {
        gamesWithURLs.push(gamesData[i]);
      } else {
        gamesWithoutURLs.push(gamesData[i]);
      }
    }
    fs.writeFileSync('gamesWithURLs.json', JSON.stringify(gamesWithURLs));
    fs.writeFileSync('gamesWithoutURLs.json', JSON.stringify(gamesWithoutURLs));
  } catch (error) {
    reject(error);
  }
});