
const currentURL = window.location.pathname;

const siteUrl = document.getElementById("site_url").content;
const tripsDataAjaxHandler = new ajaxHandler(siteUrl,"/tripsData");
const usersDataAjaxHandler = new ajaxHandler(siteUrl,"/usersData");


const u= "users";
const t="trips"; 
console.log("currentURL",currentURL )
const userId = currentURL.substring(currentURL.indexOf(u) + u.length+1,currentURL.length-t.length-1 );
console.log("userId",userId)

// --------- Event Listener ---------
document.addEventListener("DOMContentLoaded", () => {
    // have to catch the url and depinding on the url, function showTrips (public) or function showUserTrips()
    userId=="/"? showPublicTrips(): showUserTrips(userId)
})

// --------- Creating and delement DOM elements ---------
function showPublicTrips(){    
    tripsDataAjaxHandler.getAll(trips => {
        trips.forEach( trip => createTripContainer(trip, "")) 
      
    }) 
}

function showUserTrips(userId){
    usersDataAjaxHandler.getOne(userId, dbRes => {
        dbRes.trips.forEach ( userTrip => {
            let visible="visible";
            createTripContainer(userTrip, visible)
            const trashButtons=document.querySelectorAll(".fa-trash")
            trashButtons.forEach(link => {
                link.onclick = deleteTripElement})  
        })   
    })
}


function createTripContainer(tripInfoObject, visible){
    console.log("tripInfoObject", tripInfoObject)
    const allTripsDiv=document.getElementById("all-trips")
    let tripContainerEl=document.createElement("div");    
    tripContainerEl.className="wrapper-trip-container";
    tripContainerEl.id=tripInfoObject._id;
    let countries=tripInfoObject.countries.join(" & ")
    let start=changeDateFormat(tripInfoObject.start_date)
    let end=changeDateFormat(tripInfoObject.end_date)
    //<div class="trip-container" style="background-image: url(${tripInfoObject.picture})"> 
    tripContainerEl.innerHTML=`  
    <img  class="trip-container"src='${tripInfoObject.picture}' >
    
    <p> ${tripInfoObject.name}  </p>
    <p>  ${countries}  </p>
    <p> ${start} - ${end}  </p>  `
    if (visible=="visible"){
        tripContainerEl.innerHTML+=`<div class="cta-trip ${visible}" >
        <a href="/tripdetails/${tripInfoObject._id}" class="fa fa-eye table-icon" ></a> 
        <a href="/trip_edit/${tripInfoObject._id}" class="fa fa-edit table-icon"></a>
        <button id="${tripInfoObject._id}" class="fa fa-trash table-icon"></button>
    </div> 
    `

    }
 
    allTripsDiv.appendChild(tripContainerEl)
}



function deleteTripElement(evt) {
    evt.preventDefault();
    let ID=evt.target.id
    console.log( "id ---", ID)
    let deleteButton= evt.target
    let divButton=deleteButton.parentNode
    let wrapperTrip=divButton.parentNode
    wrapperTrip.remove();
    tripsDataAjaxHandler.deleteOne(ID, res => console.log("DELETED"))
}







