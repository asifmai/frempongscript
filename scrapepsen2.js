const puppeteer = require('puppeteer');
const fs = require('fs');
const similarity = require('./similar');

module.exports = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const gamesData = JSON.parse(fs.readFileSync('psen1.json'));

      // Launch Browser
      const browser = await puppeteer.launch({
        headless: false,
        // args: ['--no-sandbox'],
      });

      // Launch New Page
      const page = await browser.newPage();
      for (let a = 1; a < 75; a++) {
        console.log(`Now of page: ${a}`);
        const pgURL = `https://store.playstation.com/en-gb/grid/STORE-MSF75508-PS4CAT/${a}?gameContentType=games`
        const response = await page.goto(pgURL, {waitUntil: 'load', timeout: 0});
        if (response.status() === 403) {
          console.log(`Got IP Blocked at index: ${i}`);
          process.exit(0);
        }
        await page.waitForSelector('.grid-cell-container');
        const gamesTiles = await page.$$('.grid-cell--game');
        for (let b = 0; b < gamesTiles.length; b++) {
          const gameTitle = await gamesTiles[b].$eval('.grid-cell__title', el => el.innerText.trim());
          for (let c = 0; c < gamesData.length; c++) {
            if (!gamesData[c].url) {
              const sim = similarity(gamesData[c].title, gameTitle);
              if (sim >= 0.9) {
                const gamelink = await gamesTiles[b].$eval('.grid-cell__body a', el => el.href.trim());
                console.log(`Matched "${gamesData[c].title}" -- href: "${gamelink}"`);
                gamesData[c].url = gamelink;
                break;
              }
            }
          }
        }
        fs.writeFileSync('currentpage.txt', a);
        fs.writeFileSync('psen2.json', JSON.stringify(gamesData));
        console.log(`Done with page: ${a}`);
      }

      // Close the page
      await page.close();

      // Close the browser
      await browser.close();
      resolve('Completed...');
    } catch (error) {
      reject(error);
    }
  });
}