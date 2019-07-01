
const currentURL = window.location.pathname;
const tripsDataAjaxHandler = new ajaxHandler("http://localhost:3000","/tripsData");

document.addEventListener("DOMContentLoaded", () => {
  
    showTrips();
    
})

function createTripContainer(tripInfoObject){
    console.log("tripInfoObject---------", tripInfoObject)
    let tripContainerEl=document.createElement("div");
    console.log(tripContainerEl)
    
    tripContainerEl.className="wrapper-trip-container";
    tripContainerEl.id=tripInfoObject._id;
    //tripContainerEl.style.backgroundImage = tripInfoObject.picture;
    //tripContainerEl.style.backgroundRepeat = "no-repeat"; 
    tripContainerEl.innerHTML=` 
    <div class="cta-trip visible" >
        <a href="/trip_view/${tripInfoObject._id}" class="fa fa-eye table-icon" ></a> 
        <a href="/trip_edit/${tripInfoObject._id}" class="fa fa-edit table-icon"></a>
        <a href="/trip_delete/${tripInfoObject._id}" class="fa fa-trash table-icon"></a> 
    </div>
    
     <div class="trip-container" style="background-image: url(${tripInfoObject.picture})"> 
     ${tripInfoObject.name}
    </div>
`
    console.log("tripContainerEl.style.backgroundImage --------- :",tripContainerEl.style.backgroundImage)
    parent=document.getElementById("all-trips")
    parent.appendChild(tripContainerEl)
}

function showTrips(){
  
    tripsDataAjaxHandler.getAll(trips => {
        trips.forEach(
            trip => createTripContainer(trip))
    })
   
}

function postTrip(){

}

function deleteTrip(){

}