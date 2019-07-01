const geocoder = new google.maps.Geocoder();

document.addEventListener("DOMContentLoaded", () => {
  showTripSteps();
  tripDetailsAjaxHandler = new ajaxHandler(
    "http://localhost:3000",
    "/tripdetails"
  );
  map = startMap();

  geocodeAddress("Paris", geocoder, map);
});

function showTripSteps(tripId) {
  if (!tripId) {
    currentLine = allButtonsInForm().length;

    let formElementHTMLContent =
      '<input type="date" id="start_date' +
      currentLine +
      '+"class="input_date start_date"placeholder="2020-01-01" value="2020-01-01"><input type="date" id="end_date' +
      currentLine +
      '"class="input_date end_date" placeholder="2020-01-01" value="2020-01-01"><input type="text" id="activity' +
      currentLine +
      '" class="input_text activity" placeholder="Visit" value="Visit"><input type="text" id="location' +
      currentLine +
      '"class="input_text location" placeholder="New Delhi" value="New Delhi"> <button id="trip_details_input_button' +
      currentLine +
      '" class="trip_details_input_button"> + </button>';

    let formElement = document.createElement("form");
    formElement.id = "trip_details_form" + currentLine;
    formElement.classList.add("trip_details_form");
    formElement.innerHTML = formElementHTMLContent;
    document
      .getElementById("trip_details_form_container")
      .appendChild(formElement);
  }

  allButtonsInForm().forEach((button, index) => {
    if (index < currentLine) {
      button.removeEventListener("click", postTripStep);
      button.addEventListener("click", deleteTripStep);
    }
  });

  allButtonsInForm().forEach(button => (button.innerHTML = "-"));
  allButtonsInForm()[currentLine].addEventListener("click", postTripStep);
  allButtonsInForm()[currentLine].innerHTML = "+";
}

function allButtonsInForm() {
  return [...document.getElementsByClassName("trip_details_input_button")];
}

function postTripStep(e) {
  currentLine = allButtonsInForm().length;

  e.preventDefault();

  dataToPost = {
    start_date: this.parentNode.querySelector(".start_date").value,
    end_date: this.parentNode.querySelector(".end_date").value,
    city: this.parentNode.querySelector(".location").value,
    other: this.parentNode.querySelector(".activity").value
  };

  tripDetailsAjaxHandler.createOne(dataToPost, () => console.log("test"));
  console.log(dataToPost.city);
  geocodeAddress(dataToPost.city, geocoder, map);
  showTripSteps();
}

function deleteTripStep(e) {
  e.preventDefault();
  //  tripDetailsAjaxHandler.deleteOne ()
  this.parentNode.remove();
}

function startMap() {
  const ironhackBCN = {
    lat: 41.3977381,
    lng: 2.190471916
  };

  const latlng = new google.maps.LatLng(39.305, -76.617);

  map = new google.maps.Map(document.getElementById("trip_details_map"), {
    zoom: 5,
    center: ironhackBCN
  });

  return map;
}

function geocodeAddress(address, geocoder, resultsMap) {
  geocoder.geocode({ address: address }, function(results, status) {
    if (status === "OK") {
      resultsMap.setCenter(results[0].geometry.location);
      let marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}
