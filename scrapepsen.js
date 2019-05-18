const puppeteer = require('puppeteer');
const fs = require('fs');
const psenURL = 'https://store.playstation.com/en-gb/home/games';
const similarity = require('./similar');

module.exports = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const gamesData = JSON.parse(fs.readFileSync('metacritic.json'));

      // Launch Browser
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
      });

      // Launch New Page
      const page = await browser.newPage();

      // Set Page view port
      await page.setViewport({
        width: 1366,
        height: 768
      });

      // Goto the URL

      for (let i = 0; i < gamesData.length; i++) {
        const response = await page.goto(psenURL, {timeout: 0, waitUntil: 'load'});
        if (response.status() === 403) {
          console.log(`Got IP Blocked at index: ${i}`);
          process.exit(0);
        }
        await page.waitForSelector('input#ember942');
        await page.type('input#ember942', gamesData[i].title);
        await Promise.all([
          page.waitForNavigation({waitUntil: 'load', timeout: 0}),
          page.click('i#ember943'),
        ]);
        const seemorelink = await page.$('.bucket-row__bucket-link')
        let bucket;
        if (seemorelink) {
          // console.log(i + 1, 'Found See more link');
          await Promise.all([
            page.waitForNavigation({waitUntil: 'load', timeout: 0}),
            page.click('.bucket-row__bucket-link a'),
          ]);

          bucket = await page.$('.grid-cell-container');
        } else {
          // console.log(i + 1, 'No see more link');
          bucket = await page.$('.bucket-row__container');
        }
        const items = await bucket.$$('.grid-cell');
        for (let a = 0; a < items.length; a++) {
          const gameTitle = await items[a].$eval('.grid-cell__body a', el => el.innerText.trim());
          const gameType = await items[a].$eval('.grid-cell__body .grid-cell__left-detail.grid-cell__left-detail--detail-2', el => el.innerText.trim());
          const gameConsole = await items[a].$eval('.grid-cell__body .grid-cell__left-detail.grid-cell__left-detail--detail-1', el => el.innerText.trim());
          const sim = similarity(gamesData[i].title.toLowerCase(), gameTitle.toLowerCase());
          if (sim > 0.9 && gameType.toLowerCase() == 'full game' && gameConsole.toLowerCase() == 'ps4') {
            console.log(i + 1, '---', gameTitle, '--', gameType, '--', gameConsole);
            const gameURL = await items[a].$eval('.grid-cell__body a', el => el.href);
            gamesData[i].url = gameURL;
            break;
          }
        }
        fs.writeFileSync('psen.json', JSON.stringify(gamesData));
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