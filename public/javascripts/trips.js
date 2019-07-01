
const currentURL = window.location.pathname;
const tripsDataAjaxHandler = new ajaxHandler("http://localhost:3000","/tripsData");

// --------- DOM ---------
const allTripsDiv=document.getElementById("all-trips")
const trashButtons=document.querySelectorAll(".fa-trash")

// --------- Event Listener ---------
document.addEventListener("DOMContentLoaded", () => {
    showTrips();
})

// --------- Creating and delement DOM elements ---------
function showTrips(){ 
    tripsDataAjaxHandler.getAll(trips => {
        trips.forEach(
            trip => createTripContainer(trip))
        
        trashButtons.forEach(link => {
            //console.log(link)
            link.onclick = deleteTripElement;
        })
    }) 
}


function createTripContainer(tripInfoObject){
    let tripContainerEl=document.createElement("div");    
    tripContainerEl.className="wrapper-trip-container";
    tripContainerEl.id=tripInfoObject._id;
    tripContainerEl.innerHTML=` 
    <div class="cta-trip visible" >
        <a href="/tripdetails/${tripInfoObject._id}" class="fa fa-eye table-icon" ></a> 
        <a href="/trip_edit/${tripInfoObject._id}" class="fa fa-edit table-icon"></a>
        <button id="${tripInfoObject._id}" class="fa fa-trash table-icon"></button>
    </div>  
     <div class="trip-container" style="background-image: url(${tripInfoObject.picture})"> 
     ${tripInfoObject.name}
    </div>
`
    allTripsDiv.appendChild(tripContainerEl)
}

function deleteTripElement(evt) {
    evt.preventDefault();
    ID=evt.target.id
    let deleteButton= evt.target
    let divButton=deleteButton.parentNode
    let wrapperTrip=divButton.parentNode
    wrapperTrip.remove();
}









