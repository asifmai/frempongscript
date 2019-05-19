const fs = require('fs');

const fl = JSON.parse(fs.readFileSync('psen2.json'));

let filled = 0;
let nonfilled = 0;
    
for (let index = 0; index < fl.length; index++) {
  if (fl[index].url) {
    filled = filled + 1
  } else {
    nonfilled = nonfilled + 1
  }
}
console.log(`Number of Games: ${fl.length}`)
console.log(`Filled with urls: ${filled}`)
console.log(`Not filled with urls: ${nonfilled}`)