const metacriticscrape = require('./scrapemetacritic');
const psencrape1 = require('./scrapepsen1');
const psencrape2 = require('./scrapepsen2');
const psencrape3 = require('./scrapepsen3');

run();

async function run () {
  // Scrape Game Titles and Metascore from metacritics
  // await metacriticscrape();

  // Scrape Games URLs from Playstation website with exact title match, Full Game tag and PS4 tag
  // await psencrape1();

  // Scrape Games URLs from Playstation website with exact title match, PS VR Game tag or PSN Game and PS4 tag
  // await psencrape2();

  // Scrape Games URLs from Playstation website with exact title match, PS VR Game tag or PSN Game or Level tag and PS4 tag included in consoles
  await psencrape3();
}