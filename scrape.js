const metacriticscrape = require('./scrapemetacritic');
const psencrape = require('./scrapepsen');

run();

async function run () {
  // await metacriticscrape();

  await psencrape();
}