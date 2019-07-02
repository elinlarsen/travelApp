function extractTrip(tripId) {
  if (!tripId) tripData = {};
  else {
    let tripData = {};
    tripAjaxHandler.getAll(res => console.log(res));
  }

  return tripData;
}

function changeDateFormat(dateMongo) {
  let date = new Date(dateMongo);
  let day = date.getDate() < 10 ? [0, date.getDate()].join("") : date.getDate();
  let month =
    date.getMonth() + 1 < 10 ? [0, date.getMonth()].join("") : date.getMonth();
  let year = date.getFullYear();
  return `${month}/${day}/${year}`;
}
