const fs = require('fs');

const fl = JSON.parse(fs.readFileSync('psen1.json'));

for (let index = 0; index < fl.length; index++) {
  if (!fl.url) console.log(index);
  
}