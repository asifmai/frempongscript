const puppeteer = require('puppeteer');
const fs = require('fs');
const similarity = require('./similar');
const _ = require('underscore');

module.exports = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const gamesData = JSON.parse(fs.readFileSync('gamesDataFinal.js'));

      // Launch Browser
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
      });

      // Launch New Page
      const page = await browser.newPage();

      for (let i = 0; i < gamesData.length; i++) {
        console.log(`${i + 1} -- ${gamesData[i].title}`);
        const rawpgURL = gamesData[i].url;
        const pgURL = rawpgURL.replace('en-gb', 'it-it') 
        const response = await page.goto(pgURL, {waitUntil: 'load', timeout: 0});
        if (response.status() === 403) {
          console.log(`Got IP Blocked at index: ${i}`);
          process.exit(0);
        }
        if (response.status() === 404) {
          console.log(`Page not found at index: ${i}`);
        } else {
          // await page.waitForSelector('.pdp.padding-medium .row');
          const res = await page.evaluate(() => {
            const headers = document.querySelectorAll('.large-3.columns.pdp__left-content .tech-specs .tech-specs__pivot-menus .tech-specs__menu-header');
            let results = []
            for (let z = 0; z < headers.length; z++) {
              results.push(headers[z].innerText);
            }
            return results;
          });
          let genre;
          if (_.contains(res, 'Genere')) {
            const index = findIndex(res, 'Genere');
            genre = await page.$$eval(`.large-3.columns.pdp__left-content .tech-specs .tech-specs__pivot-menus .tech-specs__menu-header:nth-of-type(${index + 1}) + ul li`, elms => elms.map(el => el.innerText.trim()));
          } else {
            genre = [];
          }
          let audio;
          if (_.contains(res, 'Audio')) {
            const index = findIndex(res, 'Audio');
            audio = await page.$$eval(`.large-3.columns.pdp__left-content .tech-specs .tech-specs__pivot-menus .tech-specs__menu-header:nth-of-type(${index + 1}) + ul li.tech-specs__menu-items`, elms => elms.map(el => el.innerText.trim()));
          } else {
            audio = [];
          }
          let subtitles;
          if (_.contains(res, 'Sottotitoli')) {
            const index = findIndex(res, 'Sottotitoli');
            subtitles = await page.$$eval(`.large-3.columns.pdp__left-content .tech-specs .tech-specs__pivot-menus .tech-specs__menu-header:nth-of-type(${index + 1}) + ul li.tech-specs__menu-items`, elms => elms.map(el => el.innerText.trim()));
          } else {
            subtitles = [];
          }
          const rawcodes = /(?<=-)[A-Z0-9]+(?=_)/g.exec(pgURL)[0]
          const code1 = /[A-Z]+/g.exec(rawcodes)[0];
          const code2 = /[0-9]+/g.exec(rawcodes)[0];
          const codes = [code1 + ' ' + code2];

          gamesData[i].genre = genre;
          gamesData[i].audio = audio;
          gamesData[i].subtitles = subtitles;
          gamesData[i].region = 'italy';
          gamesData[i].codes = codes;
          fs.writeFileSync('gamesDataFinalItaly.js', JSON.stringify(gamesData));
          fs.writeFileSync('doneGameIndex.txt', i);
        }
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

function findIndex(arr, str) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == str) {
      return i;
    }
  }
  return -1;
}