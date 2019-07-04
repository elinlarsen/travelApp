const geocoder = new google.maps.Geocoder();
const currentURL = window.location.pathname;
const td= "tripdetails"
const len= td.length
const tripId = currentURL.substring(currentURL.indexOf(td) + len);
const parisLatLong = { lat: 48.85, lng: 2.3488 };
const tripDetailsAjaxHandler = new ajaxHandler(
  "http://localhost:3000",
  "/tripdetails"
);
const tripAjaxHandler = new ajaxHandler("http://localhost:3000", "tripsData");
const stepsAjaxHandler = new ajaxHandler("http://localhost:3000", "/steps");

document.addEventListener("DOMContentLoaded", () => {
  map = new mapHandler("trip_details_map", 5, parisLatLong);
  extractTripSteps(tripId, showTripStepsInForm, showTripStepsInMap);
});

function refreshMap() {
  map = new mapHandler("trip_details_map", 5, parisLatLong);
}

//Data extraction functions//

function extractTripSteps(tripId, clbk1, clbk2, clbk3) {
  let tripData = {};

  if (!tripId) {
    showTripStepsInForm();
    console.log("no trip id");
  } else {
    tripAjaxHandler.getOne(tripId, res => {
      if (res.steps.length == 0) {
        addBlankStep();
        assignEventListeners();
      } else {
        sortedResSteps = res.steps.sort((a, b) => {
          if (a.start_date > b.start_date) return 1;
          else return -1;
        });
        clbk1(sortedResSteps);
        clbk2(sortedResSteps);
      }
    });
  }
}

//DOM Manipulation function

function addBlankStep() {
  allInputButtonsInForm = [
    ...document.getElementsByClassName("trip_details_input_button")
  ];
  currentLine = allInputButtonsInForm.length;
  randomIdNumber = String(Math.random());

  let formElementHTMLContent =
    '<input required type="text" id="date-picker-start' +
    randomIdNumber +
    '"class="input_date start_date"><input required type="text" id="date-picker-end' +
    randomIdNumber +
    '"class="input_date end_date"><input type="text" id="activity' +
    randomIdNumber +
    '" class="input_text activity" placeholder="Your plans??"><input type="text" id="location' +
    randomIdNumber +
    '"class="input_text location" placeholder="What are your plans?"> <div class="button_container"> <button id="trip_details_input_button' +
    randomIdNumber +
    '" class="trip_details_input_button input_button"> + </button><button id="trip_details_input_button2' +
    randomIdNumber +
    '" class="trip_details_update_button input_button"> Update </button> </div>';

  let formElement = document.createElement("form");
  formElement.classList.add("trip_details_form");
  formElement.innerHTML = formElementHTMLContent;
  formElement.classList.add("blank");

  document
    .getElementById("trip_details_form_container")
    .appendChild(formElement);

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

function showTripStepsInForm(steps, clbk) {
  [...document.getElementsByClassName("trip_details_form")].forEach(x =>
    x.remove()
  );

  steps.forEach(step => {
    console.log("Adding a blank step for " + step._id);

    newForm = addBlankStep();
    newForm.id = step._id;
    newForm.classList.remove("blank");

    console.log("Populating step for " + step._id);

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
    [...document.getElementsByClassName("blank")].forEach(x => x.remove());
    addBlankStep();
  });

  assignEventListeners();
}

function showTripStepsInMap(steps) {
  refreshMap();

  map.markersList = [];

  steps.forEach(step => {
    map.geoCodeAddress(step.city, result => {
      console.log("adding marker");
      startDate = document.getElementById(step._id).querySelector(".start_date")
        .value;

      map.addMarker(
        result,
        step._id,
        step.city,
        map.markersList.length + 1,
        startDate
      );
    });
  });
}

function postTripStep(e) {
  console.log(this);

  e.preventDefault();

  if (
    !this.parentNode.parentNode.querySelector(".start_date").value &&
    !this.parentNode.parentNode.querySelector(".end_date").value
  )
    window.alert("please enter valid dates");
  else {
    dataToPost = {
      start_date: this.parentNode.parentNode.querySelector(".start_date").value,
      end_date: this.parentNode.parentNode.querySelector(".end_date").value,
      city: this.parentNode.parentNode.querySelector(".location").value,
      other: this.parentNode.parentNode.querySelector(".activity").value
    };

    tripDetailsAjaxHandler.createOne(dataToPost, result => {
      tripAjaxHandler.getOne(tripId, resultTrip => {
        [...document.getElementsByClassName("blank")][0].id = result;
        [...document.getElementsByClassName("blank")][0].classList.remove(
          "blank"
        );

        stepsData = resultTrip.steps;

        let stepsIds = [];
        stepsData.forEach(step => stepsIds.push(step._id));
        stepsIds.push(result);
        console.log(stepsIds);

        console.log("The new steps are" + stepsData);

        tripAjaxHandler.updateOne(tripId, { steps: stepsIds }, res => {
          extractTripSteps(tripId, showTripStepsInForm, showTripStepsInMap);
          //    document.location.reload();
        });
      });
    });

    addBlankStep();
  }
}

function deleteTripStep(e) {
  e.preventDefault();
  let stepToDelete = this.parentNode.parentNode.id;
  console.log("step to delete is " + stepToDelete);

  tripAjaxHandler.getOne(tripId, resultTrip => {
    let stepIds = [];

    resultTrip.steps.forEach(step => stepIds.push(step._id));
    console.log("Before deleting, steps are " + stepIds);
    console.log(
      "Ready to remove step at the following index: " +
        stepIds.indexOf(stepToDelete)
    );

    stepIds.splice(stepIds.indexOf(stepToDelete), 1);
    // console.log("Steps data is now " + stepsData);

    tripAjaxHandler.updateOne(tripId, { steps: stepIds }, res => {
      extractTripSteps(tripId, showTripStepsInForm, showTripStepsInMap);
      console.log("updated after deletion");
    });
  });
  this.parentNode.parentNode.remove();
}

function updateTripStep(e) {
  e.preventDefault();

  if (
    !this.parentNode.parentNode.querySelector(".start_date").value &&
    !this.parentNode.parentNode.querySelector(".end_date").value
  )
    window.alert("please enter valid dates");
  else {
    dataToPost = {
      start_date: this.parentNode.parentNode.querySelector(".start_date").value,
      end_date: this.parentNode.parentNode.querySelector(".end_date").value,
      city: this.parentNode.parentNode.querySelector(".location").value,
      other: this.parentNode.parentNode.querySelector(".activity").value
    };

    stepsAjaxHandler.updateOne(
      this.parentNode.parentNode.id,
      dataToPost,
      result => {
        console.log("Updated at " + result);
        extractTripSteps(tripId, showTripStepsInForm, showTripStepsInMap);
      }
    );
  }

  //postTripStepBound = postTripStep.bind(this);
  //postTripStepBound(e);

  /* deleteTripStepBound = deleteTripStep.bind(this);
  deleteTripStepBound(e); */
}

function assignEventListeners() {
  console.log("hello");
  allInputButtonsInForm = [
    ...document.getElementsByClassName("trip_details_input_button")
  ];

  allUpdateButtonsInForm = [
    ...document.getElementsByClassName("trip_details_update_button")
  ];

  allInputButtonsInForm.forEach((button, index) => {
    if (index < currentLine) {
      button.removeEventListener("click", postTripStep);
      button.addEventListener("click", deleteTripStep);
    }
  });

  allInputButtonsInForm.forEach(button => (button.innerHTML = "Delete"));
  allInputButtonsInForm[currentLine].addEventListener("click", postTripStep);
  allInputButtonsInForm[currentLine].innerHTML = "Add";

  allUpdateButtonsInForm.forEach((button, index) => {
    if (index < allUpdateButtonsInForm.length - 1) {
      console.log(index);
      button.addEventListener("click", updateTripStep);
    } else button.style.display = "none";
  });
}
