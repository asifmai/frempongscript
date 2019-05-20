const metacriticscrape = require('./scrapemetacritic');
const psencrape1 = require('./scrapepsen1');
const psencrape2 = require('./scrapepsen2');
const scrapegamespropspsen = require('./scrapegamespropspsen');
const splitGamesData = require('./splitGamesData');
const scrapeItalianDesc = require('./scrapeitaliandesc');
const correctFinalFile = require('./correctFinalFile');

(async function run () {
  // Scrape Game Titles and Metascore from metacritics
  // await metacriticscrape();

  // Scrape Games URLs from Playstation website with exact title match, PS VR Game/PSN Game/Level/Bundle tag and PS4 tag included in consoles
  // await psencrape1();

  // Scrape Games URLs from Playstation website list of ps4 games
  // await psencrape2();

  // Split Games between with URLs and without URLs
  // await splitGamesData();

  // Scrape Games Properties from Playstation en website
  // await scrapegamespropspsen();

  // Scrape Italian Description from Playstation it website
  // await scrapeItalianDesc();

  // Correct Final JS file
  await correctFinalFile();
})();