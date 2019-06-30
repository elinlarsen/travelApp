document.addEventListener("DOMContentLoaded", () => {
  populateFormDetails();
  tripDetailsAjaxHandler = new ajaxHandler("http://localhost:3000");
});

function populateFormDetails(tripId) {
  if (!tripId) {
    currentLine = allButtonsInForm().length;

    let formElementHTMLContent =
      '<input type="date" name="start_date" class="input_date" placeholder="2020-01-01" value="2020-01-01"><input type="date" name="end_date" class="input_date" placeholder="2020-01-01" value="2020-01-01"><input type="text" name="activity" class="input_text" placeholder="Visit" value="Visit"><input type="text" name="location" class="input_text" placeholder="New Delhi" value="New Delhi"> <button id="trip_details_input_button' +
      currentLine +
      '" class="trip_details_input_button"> + </button>';

    let formElement = document.createElement("form");
    formElement.id = "trip_details_form" + tripId;
    formElement.classList.add("trip_details_form");
    formElement.innerHTML = formElementHTMLContent;
    document
      .getElementById("trip_details_form_container")
      .appendChild(formElement);
  }

  allButtonsInForm().forEach((button, index) => {
    if (index < currentLine) {
      button.removeEventListener("click", addAFormLine);
      button.addEventListener("click", deleteAFormLine);
    }
  });

  allButtonsInForm().forEach(button => (button.innerHTML = "-"));
  allButtonsInForm()[currentLine].addEventListener("click", addAFormLine);
  allButtonsInForm()[currentLine].innerHTML = "+";
}

function allButtonsInForm() {
  return [...document.getElementsByClassName("trip_details_input_button")];
}

function addAFormLine(e) {
  e.preventDefault();
  tripDetailsAjaxHandler.createOneStep({ name: "test" }, () =>
    console.log("test")
  );
  populateFormDetails();
}

function deleteAFormLine(e) {
  e.preventDefault();
  this.parentNode.remove();
}
