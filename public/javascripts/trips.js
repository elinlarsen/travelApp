
const currentURL = window.location.pathname;
const tripsDataAjaxHandler = new ajaxHandler("http://localhost:3000","/tripsData");
const usersDataAjaxHandler = new ajaxHandler("http://localhost:3000","/usersData");


const u= "users";
const t="trips"; 
console.log("currentURL",currentURL )
const userId = currentURL.substring(currentURL.indexOf(u) + u.length+1,currentURL.length-t.length-1 );
console.log("userId",userId)

// --------- Event Listener ---------
document.addEventListener("DOMContentLoaded", () => {
    // have to catch the url and depinding on the url, function showTrips (public) or function showUserTrips()
    !userId ? showPublicTrips(): showUserTrips(userId)
})

// --------- Creating and delement DOM elements ---------
function showPublicTrips(){    
    tripsDataAjaxHandler.getAll(trips => {
        trips.forEach( trip => createTripContainer(trip))        
    }) 
}

function showUserTrips(userId){
    usersDataAjaxHandler.getOne(userId, dbRes => {
        dbRes.trips.forEach ( userTrip => {
            createTripContainer(userTrip)
        })
    })
    const trashButtons=document.querySelectorAll(".fa-trash")
    trashButtons.forEach(link => {link.onclick = deleteTripElement})
}


function createTripContainer(tripInfoObject){
    const allTripsDiv=document.getElementById("all-trips")
    let tripContainerEl=document.createElement("div");    
    tripContainerEl.className="wrapper-trip-container";
    tripContainerEl.id=tripInfoObject._id;
    countries=tripInfoObject.countries.join(", ")
    start=changeDateFormat(tripInfoObject.start_date)
    end=changeDateFormat(tripInfoObject.start_date)
    //<div class="trip-container" style="background-image: url(${tripInfoObject.picture})"> 
    tripContainerEl.innerHTML=`  
    <img  class="trip-container"src='${tripInfoObject.picture}' >
    
    <span> ${tripInfoObject.name}  </span>
    <span> in ${countries}  </span>
    <span> ${start} - ${end}  </span>

    <div class="cta-trip visible" >
        <a href="/tripdetails/${tripInfoObject._id}" class="fa fa-eye table-icon" ></a> 
        <a href="/trip_edit/${tripInfoObject._id}" class="fa fa-edit table-icon"></a>
        <button id="${tripInfoObject._id}" class="fa fa-trash table-icon"></button>
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
    tripsDataAjaxHandler.deleteOne(ID, res => console.log("DELETED"))
}







