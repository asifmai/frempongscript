const puppeteer = require('puppeteer');
const fs = require('fs');
let gamesData = [];
const metacriticURL = 'https://www.metacritic.com/browse/games/release-date/available/ps4/metascore';
const metacriticPageURL = 'https://www.metacritic.com/browse/games/release-date/available/ps4/metascore?page=';

module.exports = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Launch Browser
      const browser = await puppeteer.launch({ headless: false, args: ['--window-size=1366,768'] });

      // Launch New Page
      const page = await browser.newPage();
      
      // Set Page view port
      await page.setViewport({ width: 1366, height: 768 });
      
      // Goto the URL
      await page.goto(metacriticURL, { timeout: 0, waitUntil: 'load' });
      
      await page.waitForSelector('ul.pages');
      const pages = await page.$$('ul.pages li.page');
      console.log(`No of Pages: ${pages.length}`);
      
      for (let a = 0; a < pages.length; a++) {
        console.log(`Now on page ${a + 1}`);
        if (a != 0) {
          const pageURL = metacriticPageURL + a;
          const response = await page.goto(pageURL, { timeout: 0, waitUntil: 'load' });
          console.log(response);
        }
        await page.waitForSelector('.list_products.list_product_condensed');

        const gameItems = await page.$$('.list_products .game_product');
        console.log(`No of Game Items ${gameItems.length}`);
        for (let i = 0; i < gameItems.length; i++) {
          const gameTitle = await gameItems[i].$eval('.product_wrap .product_title a', el => el.innerText);
          const gameMetascore = await gameItems[i].$eval('.product_wrap .brief_metascore div', el => el.innerText);
          console.log(i + 1, gameTitle, gameMetascore);
          const gameObj = {
            title: gameTitle,
            metacritic: gameMetascore
          };
          gamesData.push(gameObj);
        }
      }

      fs.writeFileSync('metacritic.json', JSON.stringify(gamesData));

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