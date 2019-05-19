convertDate('1 Aug 2018');

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