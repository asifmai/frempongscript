const puppeteer = require('puppeteer');
const fs = require('fs');
const similarity = require('./similar');
const _ = require('underscore');

module.exports = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const gamesData = JSON.parse(fs.readFileSync('gamesWithURLs.json'));

      // Launch Browser
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
      });

      // Launch New Page
      const page = await browser.newPage();

      for (let i = 0; i < gamesData.length; i++) {
        console.log(`${i + 1} -- ${gamesData[i].title}`);
        const pgURL = gamesData[i].url; 
        // + '?ageMonth=9&ageDay=10&ageYear=1984';
        const response = await page.goto(pgURL, {waitUntil: 'load', timeout: 0});
        if (response.status() === 403) {
          console.log(`Got IP Blocked at index: ${i}`);
          process.exit(0);
        }
        await page.waitForSelector('.pdp.padding-medium .row');
        const res = await page.evaluate(() => {
          const headers = document.querySelectorAll('.large-3.columns.pdp__left-content .tech-specs .tech-specs__pivot-menus .tech-specs__menu-header');
          let results = []
          for (let z = 0; z < headers.length; z++) {
            results.push(headers[z].innerText);
          }
          return results;
        });
        let genre;
        if (_.contains(res, 'Genre')) {
          const index = findIndex(res, 'Genre');
          genere = await page.$$eval(`.large-3.columns.pdp__left-content .tech-specs .tech-specs__pivot-menus .tech-specs__menu-header:nth-of-type(${index + 1}) + ul li`, elms => elms.map(el => el.innerText.trim()));
        } else {
          genere = [];
        }
        let audio;
        if (_.contains(res, 'Audio')) {
          const index = findIndex(res, 'Audio');
          audio = await page.$$eval(`.large-3.columns.pdp__left-content .tech-specs .tech-specs__pivot-menus .tech-specs__menu-header:nth-of-type(${index + 1}) + ul li.tech-specs__menu-items`, elms => elms.map(el => el.innerText.trim()));
        } else {
          audio = [];
        }
        let subtitles;
        if (_.contains(res, 'Subtitles')) {
          const index = findIndex(res, 'Subtitles');
          subtitles = await page.$$eval(`.large-3.columns.pdp__left-content .tech-specs .tech-specs__pivot-menus .tech-specs__menu-header:nth-of-type(${index + 1}) + ul li.tech-specs__menu-items`, elms => elms.map(el => el.innerText.trim()));
        } else {
          subtitles = [];
        }
        const coverImage = await page.$eval('.large-3.columns.pdp__left-content .product-image__img.product-image__img--main img', elm => elm.getAttribute('src'));
        const publisher = await page.$eval('.large-9.columns.pdp__right-content .provider-info .provider-info__text:first-of-type', elm => elm.innerText.trim());
        let releaseDate = await page.$eval('.large-9.columns.pdp__right-content .provider-info .provider-info__text:nth-of-type(2) .provider-info__list-item:nth-of-type(2)', elm => elm.innerText.trim());
        releaseDate = releaseDate.replace('Released ', '');
        releaseDate = convertDate(releaseDate);

        const ageContainer = await page.$('.age-gate-form__container');
        if (ageContainer) {
          await page.waitForSelector('.age-gate-form__container');
          await page.select('select[name="ageMonth"]', '9');
          await page.select('select[name="ageDay"]', '10');
          await page.select('select[name="ageYear"]', '1984');
          // await Promise.all([
          //   page.waitForNavigation(),
          //   page.click('.age-gate-form__container + input')
          // ])
          await page.waitFor(10000);
          await page.waitForSelector('.age-gate-form__container');
          await page.select('select[name="ageMonth"]', '9');
          await page.select('select[name="ageDay"]', '10');
          await page.select('select[name="ageYear"]', '1984');
          await page.click('.age-gate-form__container + input')
          await page.waitFor(10000);
          await page.waitForSelector('.pdp-carousel__thumbnail-pages-container');
        }
        const carouselContainer = await page.$('div#pdp-carousel-pages');
        const gameImages = await carouselContainer.$$eval('img', elms => elms.map(el => el.getAttribute('src')));

        const plateform = 'ps4';
        const region = 'uk';
        const rawcodes = /(?<=-)[A-Z0-9]+(?=_)/g.exec(pgURL)[0]
        const codes = [rawcodes];
        // console.log(genere);
        gamesData[i].genre = genere;
        // console.log(audio);
        gamesData[i].audio = audio;
        // console.log(subtitles);
        gamesData[i].subtitles = subtitles;
        // console.log(publisher);
        gamesData[i].publisher = publisher;
        // console.log(releaseDate);
        gamesData[i].releasedDate = releaseDate;
        // console.log(codes);
        gamesData[i].codes = codes;
        // console.log(coverImage);
        gamesData[i].coverImage = coverImage;
        // console.log(plateform);
        gamesData[i].plateform = plateform;
        // console.log(region);
        gamesData[i].region = region;
        // console.log(gameImages);
        gamesData[i].images = gameImages;
        fs.writeFileSync('gamesData.json', JSON.stringify(gamesData));
        fs.writeFileSync('doneGameIndex.txt', i);
      }

      // Close the page
      // await page.close();

      // Close the browser
      // await browser.close();
      resolve('Completed...');
    } catch (error) {
      reject(error);
    }
  });
}

function convertDate (dtString) {
  const months = {
    Jan : '01',
    Feb : '02',
    Mar : '03',
    Apr : '04',
    May : '05',
    Jun : '06',
    Jul : '07',
    Aug : '08',
    Sep : '09',
    Oct : '10',
    Nov : '11',
    Dec : '12',
  }

  let date = parseInt(/[0-9]+\s/g.exec(dtString)[0].trim());
  if (date < 10) date = '0' + date;
  const year = /\s[0-9]+/g.exec(dtString)[0].trim();
  const monthinString = /\s[A-Za-z]+\s/g.exec(dtString)[0].trim();
  const month = months[monthinString];
  const returnDate = `${month}/${date}/${year}`
  return returnDate;
}

function findIndex(arr, str) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == str) {
      return i;
    }
  }
  return -1;
}