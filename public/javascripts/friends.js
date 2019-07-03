const currentURL = window.location.pathname;
const userAjaxHandler = new ajaxHandler("http://localhost:3000", "/userData");

//import Match from './Match.js'



// --------- Fake users ---------
/*
const match= new Match(user1, user2)
console.log("match class----", match)
console.log(match.isFriend())
console.log(match. matchAllTrips())
*/

// --------- Event Listener ---------
document.addEventListener("DOMContentLoaded", () => {
    
    showAllFriends()
    //TODO : filter bby friends in button all
    //const buttonAll=document.getElementById("all-friends")
    //buttonAll.addEventListener("click", showAllFriends);
})

// --------- Creating and delement DOM elements ---------
function showAllFriends(){
    console.log("--------------------coucou--------------------")
    userAjaxHandler.getAll(friends => {
        console.log(friends)
        friends.forEach( friend => {
            console.log("in function ajax get all ----", friend)
            createFriendContainer(friend)})
    }) 
}

function createFriendContainer(userObject){
    console.log("in function createFriendContainer", userObject)
    const allTripsDiv=document.getElementById("friends-details-container");
    let friendContainer=document.createElement("div");
    friendContainer.className="friend-wrapper";
    friendContainer.id=userObject._id;
    friendContainer.innerHTML=`
            <div class="friend-pic round" style="background-image: url(${userObject.picture})"></div>
            <p class="friend-name">${userObject.username} </p>
    `
    allTripsDiv.append(friendContainer);

}
   