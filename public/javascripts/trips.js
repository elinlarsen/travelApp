
const currentURL = window.location.pathname;
const tripsDataAjaxHandler = new ajaxHandler("http://localhost:3000","/tripsData");
import Match from './Match.js'

// --------- Fake users ---------
const user1={
        "_id": "1",
        "first_name": "elin",
        "last_name": "larsen", 
        "trips": ['trip11','trip12'],
        "picture" : "https://randomuser.me/api/portraits/women/65.jpg",
        "friends": ["2", "5"]
    };
const user2=  {
    "_id": "2",
    "first_name": "yasin",
    "last_name": "hegdal", 
    "trips": ['trip12', 'trip13', 'trip22'],
    "picture" : "https://randomuser.me/api/portraits/men/65.jpg",
    "friends": ["5", "3"],
};
const user3={
    "_id": "3",
    "firstname": "user3name",
    "lastname": "lastname3", 
    "trip": ['trip33', 'trip'],
    "picture" : "https://randomuser.me/api/portraits/men/55.jpg",
    "friends": ["2"]

};

const match= new Match(user1, user2)
console.log("match class----", match)
console.log(match.isFriend())

console.log(match. matchAllTrips())

// --------- Event Listener ---------
document.addEventListener("DOMContentLoaded", () => {
    showTrips();
})

// --------- Creating and delement DOM elements ---------
function showTrips(){ 
    
    tripsDataAjaxHandler.getAll(trips => {
        trips.forEach( trip => createTripContainer(trip))
        
        const trashButtons=document.querySelectorAll(".fa-trash")
        trashButtons.forEach(link => {
            //console.log(link)
            link.onclick = deleteTripElement;
        })
    }) 
}


function createTripContainer(tripInfoObject){
    const allTripsDiv=document.getElementById("all-trips")
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
    tripsDataAjaxHandler.deleteOne(ID, res => console.log("DELETED"))
}







