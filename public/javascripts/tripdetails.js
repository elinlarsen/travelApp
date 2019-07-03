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
        sortedResSteps = res.steps.sort((a, b) => {
          if (a.start_date > b.start_date) return 1;
          else return -1;
        });
        sortedResSteps.forEach((step, index) => {
          clbk(step);
        });
      }
    });
  }
}

function addBlankStep() {
  currentLine = allButtonsInForm().length;
  randomIdNumber = String(Math.random());

  let formElementHTMLContent =
    '<input required type="text" id="date-picker-start' +
    randomIdNumber +
    '"class="input_date start_date"><input required type="text" id="date-picker-end' +
    randomIdNumber +
    '"class="input_date end_date"><input type="text" id="activity' +
    randomIdNumber +
    '" class="input_text activity" placeholder="What did you do?"><input type="text" id="location' +
    randomIdNumber +
    '"class="input_text location" placeholder="Where were you?"> <button id="trip_details_input_button' +
    randomIdNumber +
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
    field: document.getElementById("date-picker-start" + randomIdNumber),
    format: "MM/DD/YYYY"
  });

  new Lightpick({
    field: document.getElementById("date-picker-end" + randomIdNumber),
    format: "MM/DD/YYYY"
  });

  return formElement;
}

function showTripSteps(step, clbk) {
  console.log("ready to display trip step");
  newForm = addBlankStep();
  newForm.id = step._id;
  newForm.classList.remove("blank");

  //console.log("Start date is " + changeDateFormat(step.start_date));

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
    label = map.markersList.length + 1;

    map.addMarker(result, step._id, step.city, label);
    console.log("label is " + label);
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
  //currentLine = allButtonsInForm().length;
  e.preventDefault();

  console.log("creating entry");

  if (
    !this.parentNode.querySelector(".start_date").value &&
    !this.parentNode.querySelector(".end_date").value
  )
    window.alert("please enter valid dates");
  else {
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

        let stepsIds = [];
        stepsData.forEach(step => stepsIds.push(step._id));
        stepsIds.push(result);
        console.log(stepsIds);

        console.log("The new ste data are " + stepsData);

        tripAjaxHandler.updateOne(tripId, { steps: stepsIds }, res => {
          //extractTripSteps(tripId, showTripSteps);
          document.location.reload();
          console.log(res);
        });
      });
    });

    addBlankStep();
  }
}

function deleteTripStep(e) {
  e.preventDefault();
  let stepToDelete = this.parentNode.id;
  console.log("step to delete is " + stepToDelete);

  tripAjaxHandler.getOne(tripId, resultTrip => {
    let stepIds = [];
    resultTrip.steps.forEach(step => stepIds.push(step._id));
    console.log("Before deleting, steps are " + stepIds);
    console.log(
      "Ready to remove step at the following index: " +
        stepIds.indexOf(stepToDelete)
    );

    /*
    map.deleteMarker(stepsIds.indexOf(stepToDelete));
    map = new mapHandler("trip_details_map", 5, parisLatLong);
    refreshMap(); */

    stepIds.splice(stepIds.indexOf(stepToDelete), 1);
    // console.log("Steps data is now " + stepsData);

    tripAjaxHandler.updateOne(tripId, { steps: stepIds }, res => {
      document.location.reload();
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
