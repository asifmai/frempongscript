const metacriticscrape = require('./scrapemetacritic');
const psencrape1 = require('./scrapepsen1');

run();

async function run () {
  // Scrape Game Titles and Metascore from metacritics
  // await metacriticscrape();

  // Scrape Games URLs from Playstation website with exact title match, Full Game tag and PS4 tag
  await psencrape1();
}