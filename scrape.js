const metacriticscrape = require('./scrapemetacritic');
const psencrape = require('./scrapepsen');
const psencrape2 = require('./scrapepsen2');

run();

async function run () {
  // Scrape Game Titles and Metascore from metacritics
  // await metacriticscrape();

  // Scrape Games URLs from Playstation website with exact title match, PS VR Game tag or PSN Game or Level tag and PS4 tag included in consoles
  // await psencrape();

  await psencrape2()
}