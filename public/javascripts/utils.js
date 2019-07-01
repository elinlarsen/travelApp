function extractTrip(tripId) {
    if (!tripId) tripData = {};
    else {
      let tripData = {};
      tripAjaxHandler.getAll(res => console.log(res));
    }
  
    return tripData;
}

