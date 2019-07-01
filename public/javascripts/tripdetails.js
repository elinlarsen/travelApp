/*const geocoder = new google.maps.Geocoder();
const currentURL = window.location.pathname;
const tripId = currentURL.substring(currentURL.indexOf("tripdetails") + 12);
var markersList = [];

const tripDetailsAjaxHandler = new ajaxHandler(
  "http://localhost:3000",
  "/tripdetails"
);

const tripAjaxHandler = new ajaxHandler("http://localhost:3000", "/tripsdata");
const stepsAjaxHandler = new ajaxHandler("http://localhost:3000", "/steps");

console.log("trip id is " + tripId);

document.addEventListener("DOMContentLoaded", () => {
  extractTripSteps(tripId, showTripSteps);
  map = startMap();
});

function extractTripSteps(tripId, clbk) {
  let tripData = {};

  if (!tripId) showTripSteps();
  else {
    console.log("Extracting trip " + tripId);

    tripAjaxHandler.getOne(tripId, res => {
      if (res.steps.length == 0) addBlankStep();
      else
        res.steps.forEach((step, index) => {
          stepsAjaxHandler.getOne(step, res => {
            showTripSteps(res);
          });
        });
    });
  }
}

function addBlankStep() {
  currentLine = allButtonsInForm().length;

  let formElementHTMLContent =
    '<input type="date" id="start_date' +
    currentLine +
    '+"class="input_date start_date"><input type="date" id="end_date' +
    currentLine +
    '"class="input_date end_date"><input type="text" id="activity' +
    currentLine +
    '" class="input_text activity" placeholder="What did you do?"><input type="text" id="location' +
    currentLine +
    '"class="input_text location" placeholder="Where were you?"> <button id="trip_details_input_button' +
    currentLine +
    '" class="trip_details_input_button"> + </button>';

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

  allButtonsInForm().forEach(button => (button.innerHTML = "Delete step"));
  allButtonsInForm()[currentLine].addEventListener("click", postTripStep);
  allButtonsInForm()[currentLine].innerHTML = "Add step";

  return formElement;
}

function showTripSteps(step, clbk) {
  newForm = addBlankStep();
  newForm.id = step._id;
  newForm.classList.remove("blank");

  document.getElementById(step._id).querySelector(".start_date").value =
    step.start_date;
  document.getElementById(step._id).querySelector(".end_date").value =
    step.end_date;
  document.getElementById(step._id).querySelector(".location").value =
    step.city;
  document.getElementById(step._id).querySelector(".activity").value =
    step.other;

  geocodeAddress(step.city, geocoder, map, step._id);

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
    console.log(result);

    tripAjaxHandler.getOne(tripId, resultTrip => {
      stepsData = resultTrip.steps;
      geocodeAddress(dataToPost.city, geocoder, map, result);
      stepsData.push(result);

      tripAjaxHandler.updateOne(tripId, { steps: stepsData }, res =>
        console.log("new step added")
      );

      //tripAjaxHandler.updateOne (tripId, ) 
    });
  });

  addBlankStep();
}

function deleteTripStep(e) {
  e.preventDefault();
  let stepToDelete = this.parentNode.id;
  console.log("step to Deletes is " + stepToDelete);

  tripAjaxHandler.getOne(tripId, resultTrip => {
    stepsData = resultTrip.steps;
    console.log("Before deleting, steps are " + stepsData);
    console.log(
      "Ready to remove step at the following index: " +
        stepsData.indexOf(stepToDelete)
    );
    stepsData.splice(stepsData.indexOf(stepToDelete), 1);
    console.log("Steps data is now " + stepsData);

    tripAjaxHandler.updateOne(tripId, { steps: stepsData }, res => {
      console.log("step removed");
    });
  });

  console.log(markersList);
  console.log(stepToDelete);

  console.log(
    markersList.find(x => {
      return x.stepIndex == stepToDelete;
    })
  );
  //.setMap(null);

    this.parentNode.remove();
  }
}

//Functions to deal with google map API = to be exported in separate file for later

var markers = [];

function startMap() {
  map = new google.maps.Map(document.getElementById("trip_details_map"), {
    zoom: 5,
    center: { lat: 48.85, lng: 2.3488 }
  });

  //geocodeAddress("Paris", geocoder, map);
  return map;
}

function geocodeAddress(address, geocoder, resultsMap, stepIndex) {
  geocoder.geocode({ address: address }, function(results, status) {
    if (status === "OK") {
      resultsMap.setCenter(results[0].geometry.location);

      let marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });

      markersList.push({ marker, stepIndex });
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

*/