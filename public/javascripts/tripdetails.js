const geocoder = new google.maps.Geocoder();
const currentURL = window.location.pathname;
const tripId = currentURL.substring(currentURL.indexOf("tripdetails") + 12);
var markersList = [];

const parisLatLong = { lat: 48.85, lng: 2.3488 };
const tripDetailsAjaxHandler = new ajaxHandler(
  "http://localhost:3000",
  "/tripdetails"
);

const tripAjaxHandler = new ajaxHandler("http://localhost:3000", "/tripsdata");
const stepsAjaxHandler = new ajaxHandler("http://localhost:3000", "/steps");

var map = {};

//console.log("trip id is " + tripId);

document.addEventListener("DOMContentLoaded", () => {
  extractTripSteps(tripId, showTripSteps);
  map = new mapHandler("trip_details_map", 5, parisLatLong);
});

function extractTripSteps(tripId, clbk) {
  let tripData = {};

  if (!tripId) showTripSteps();
  else {
    tripAjaxHandler.getOne(tripId, res => {
      if (res.steps.length == 0) addBlankStep();
      else {
        /* console.log("Res steps 0 is " + res.steps[0].city);
        console.log("Res steps 1 is " + res.steps[1].city);
        console.log("Res steps 2 is " + res.steps[2].city);
        console.log("Res steps 3 is " + res.steps[3].city);
        console.log("Res steps 4 is " + res.steps[4].city);*/

        sortedResSteps = res.steps.sort((a, b) => {
          if (a.start_date > b.start_date) return 1;
          else return -1;
        });

        /*  console.log("Sorted Res steps 0 is " + sortedResSteps[0].city);
        console.log("Sorted Res steps 1 is " + sortedResSteps[1].city);
        console.log("Sorted Res steps 2 is " + sortedResSteps[2].city);
        console.log("Sorted Res steps 3 is " + sortedResSteps[3].city);
        console.log("Sorted Res steps 4 is " + sortedResSteps[4].city);*/

        sortedResSteps.forEach((step, index) => {
          // stepsAjaxHandler.getOne(step._id, res => {
          clbk(step);
          // });
        });
      }
    });
  }
}

function addBlankStep() {
  currentLine = allButtonsInForm().length;

  let formElementHTMLContent =
    '<input type="text" id="date-picker-start' +
    currentLine +
    '"class="input_date start_date"><input type="text" id="date-picker-end' +
    currentLine +
    '"class="input_date end_date"><input type="text" id="activity' +
    currentLine +
    '" class="input_text activity" placeholder="What did you do?"><input type="text" id="location' +
    currentLine +
    '"class="input_text location" placeholder="Where were you?"> <button id="trip_details_input_button' +
    currentLine +
    '" class="trip_details_input_button input_button"> + </button>';

  let formElement = document.createElement("form");
  formElement.classList.add("trip_details_form");
  formElement.innerHTML = formElementHTMLContent;
  formElement.classList.add("blank");

  document
    .getElementById("trip_details_form_container")
    .appendChild(formElement);

  allButtonsInForm().forEach((button, index) => {
    if (index < currentLine) {
      button.removeEventListener("click", postTripStep);
      button.addEventListener("click", deleteTripStep);
    }
  });

  allButtonsInForm().forEach(button => (button.innerHTML = "-"));
  allButtonsInForm()[currentLine].addEventListener("click", postTripStep);
  allButtonsInForm()[currentLine].innerHTML = "+";

  const button = document.getElementById("date-picker-start" + currentLine);

  new Lightpick({
    field: document.getElementById("date-picker-start" + currentLine),
    format: "MM/DD/YYYY"
  });

  new Lightpick({
    field: document.getElementById("date-picker-end" + currentLine),
    format: "MM/DD/YYYY"
  });

  return formElement;
}

function showTripSteps(step, clbk) {
  newForm = addBlankStep();
  newForm.id = step._id;
  newForm.classList.remove("blank");

  console.log("Start date is " + changeDateFormat(step.start_date));

  document
    .getElementById(step._id)
    .querySelector(".start_date").value = changeDateFormat(step.start_date);
  document
    .getElementById(step._id)
    .querySelector(".end_date").value = changeDateFormat(step.end_date);
  document.getElementById(step._id).querySelector(".location").value =
    step.city;
  document.getElementById(step._id).querySelector(".activity").value =
    step.other;

  map.geoCodeAddress(step.city, result => {
    map.addMarker(result, step._id, step.city);
    displayMapConnections();
  });

  //geocodeAddress(step.city, geocoder, map, step._id);

  [...document.getElementsByClassName("blank")].forEach(x => x.remove());
  addBlankStep();
}

function allButtonsInForm() {
  return [...document.getElementsByClassName("trip_details_input_button")];
}

function postTripStep(e) {
  currentLine = allButtonsInForm().length;
  e.preventDefault();
  console.log("creating entry");

  dataToPost = {
    start_date: this.parentNode.querySelector(".start_date").value,
    end_date: this.parentNode.querySelector(".end_date").value,
    city: this.parentNode.querySelector(".location").value,
    other: this.parentNode.querySelector(".activity").value
  };

  tripDetailsAjaxHandler.createOne(dataToPost, result => {
    //  console.log(result);

    tripAjaxHandler.getOne(tripId, resultTrip => {
      [...document.getElementsByClassName("blank")][0].id = result;
      [...document.getElementsByClassName("blank")][0].classList.remove(
        "blank"
      );

      stepsData = resultTrip.steps;
      if (dataToPost.city) {
        map.geoCodeAddress(dataToPost.city, resultLocation => {
          map.addMarker(resultLocation, result);
          displayMapConnections();
          console.log(map.markersList);
        });
      } else {
        map.addMarker(null, result);
        displayMapConnections();
      }
      // geocodeAddress(dataToPost.city, geocoder, map, result);
      stepsData.push(result);

      tripAjaxHandler.updateOne(tripId, { steps: stepsData }, res =>
        console.log("new step added")
      );

      //tripAjaxHandler.updateOne (tripId, ) */
    });
  });

  addBlankStep();
}

function deleteTripStep(e) {
  e.preventDefault();
  let stepToDelete = this.parentNode.id;
  // console.log("step to Deletes is " + stepToDelete);

  tripAjaxHandler.getOne(tripId, resultTrip => {
    stepsData = resultTrip.steps;
    // console.log("Before deleting, steps are " + stepsData);
    //console.log(
    //   "Ready to remove step at the following index: " +
    //    stepsData.indexOf(stepToDelete)
    //);
    map.deleteMarker(stepsData.indexOf(stepToDelete));
    map = new mapHandler("trip_details_map", 5, parisLatLong);
    refreshMap();
    stepsData.splice(stepsData.indexOf(stepToDelete), 1);
    // console.log("Steps data is now " + stepsData);

    tripAjaxHandler.updateOne(tripId, { steps: stepsData }, res => {
      //    console.log("step removed");
    });
  });

  //console.log(markersList);

  /*  markersListItemToDelete = map.markersList.find(x => {
    return toString(x.stepIndex) == toString(stepToDelete);
  });
  //console.log(markersListItemToDelete.marker);
  markersListItemToDelete.marker.setMap(null);
  map.markersList.splice(map.markersList.indexOf(markersListItemToDelete), 1);
  //.setMap(null); */

  this.parentNode.remove();
}

function refreshMap() {
  map = new mapHandler("trip_details_map", 5, parisLatLong);
}

function displayMarker() {}

function displayMapConnections() {
  if (map.markersList.length >= 2) {
    for (i = 2; i <= map.markersList.length; i++) {
      map.displayOrHideMarkers(
        map.markersList[i - 2].marker,
        map.markersList[i - 1].marker,
        "display"
      );
    }
  }
}

function deleteMapConnections() {
  if (map.markersList.length >= 2) {
    for (i = 2; i <= map.markersList.length; i++) {
      map.displayOrHideMarkers(
        map.markersList[i - 2].marker,
        map.markersList[i - 1].marker,
        "hide"
      );
    }
  }
}

function sortArrayByDate(Array) {
  return Array.sort((a, b) => new Date(a) - new Date(b));
}
