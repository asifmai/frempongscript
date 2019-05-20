const fs = require('fs');
const util = require('util');

module.exports = () => new Promise((resolve, reject) => {
  try {
    const gamesData = JSON.parse(fs.readFileSync('gamesData2.json'));
    let newGamesData = [];
    for (let i = 0; i < gamesData.length; i++) {
      console.log(i + 1, '--', gamesData[i].title);
      const code1 = /[A-Z]+/g.exec(gamesData[i].codes[0])[0];
      const code2 = /[0-9]+/g.exec(gamesData[i].codes[0])[0];
      const newCode = [code1 + ' ' + code2];
      const img1 = [gamesData[i].coverImage];
      const img2 = gamesData[i].images.slice(0,3);
      const imgArray = img1.concat(img2);

      const newGameObj = {
        title: gamesData[i].title,
        releasedDate: gamesData[i].releasedDate,
        platform: gamesData[i].plateform,
        genre: gamesData[i].genre,
        publisher: gamesData[i].publisher,
        region: gamesData[i].region,
        description: gamesData[i].description,
        codes: newCode,
        metacritic: parseInt(gamesData[i].metacritic),
        audio: gamesData[i].audio,
        subtitles: gamesData[i].subtitles,
        coverImage: gamesData[i].coverImage,
        images: imgArray,
        comments: [],
        trailers: [],
        url: gamesData[i].url,
      }
      newGamesData.push(newGameObj);
    }
    fs.writeFileSync('gamesDataFinal.js', JSON.stringify(newGamesData));
  } catch (error) {
    reject(error);
  }
});