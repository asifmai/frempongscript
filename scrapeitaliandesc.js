const puppeteer = require('puppeteer');
const fs = require('fs');

module.exports = () => new Promise(async (resolve, reject) => {
  try {
    const gamesData = JSON.parse(fs.readFileSync('gamesData.json'));
    
    // Launch Browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });

    // Launch New Page
    const page = await browser.newPage();

    // Set Request Interception to avoid receiving images, fonts and stylesheets
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if(req.resourceType() === 'image' || req.resourceType() === 'font' || req.resourceType() === 'stylesheet'){
        req.abort();
      }
      else {
        req.continue();
      }
    });

    for (let i = 0; i < gamesData.length; i++) {
      console.log(i + 1, '--', gamesData[i].title);
      const rawpgURL = gamesData[i].url;
      const pgURL = rawpgURL.replace('en-gb', 'it-it');
      
      const response = await page.goto(pgURL, {waitUntil: 'load', timeout: 0});
      if (response.status() === 403) {
        console.log(`Got IP Blocked at index: ${i}`);
        process.exit(0);
      }
      // await page.waitForSelector('.pdp__description');
      const rawItalianDesc = await page.$eval('.pdp__description', elm => elm.innerText);
      const italianDesc = rawItalianDesc.replace('Descrizione\n\n','');
      gamesData[i].description = italianDesc;

      fs.writeFileSync('gamesData2.json', JSON.stringify(gamesData));
      fs.writeFileSync('doneGameIndex.txt', i);
    }
    
    // Close the page
    await page.close();

    // Close the browser
    await browser.close();
  } catch (error) {
    reject(error);
  }
})
