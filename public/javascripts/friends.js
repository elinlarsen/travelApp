const currentURL = window.location.pathname;
const userAjaxHandler = new ajaxHandler("http://localhost:3000", "/userData");
import Match from './Match.js'

const currentUserId="5d1c94888bfeca2479ef27ca" // TO CHANGE WHEN THE USER LOGIN and to define
var currentUser=null;

userAjaxHandler.getOne(currentUserId, result => currentUser=result)
console.log('------------------------------------------------------------')

// as a middleware used in app.js


// --------- Modular function ---------
function computeMatch(user2, allUsers){
    var allFriends=[]; var matchedFriends=[];var advisors=[]; var advisees=[]
        allUsers.forEach( user => {            
            let match= new Match(user, user2)            
            if( user._id != user2._id && match.isFriend() ){  
                console.log(`${user.username} and ${user2.username} are friends !!!!`)
                let friend=user;
                allFriends.push({"friend" : friend},) 
                let matchArray= match.matchAllTrips()
                let tripPairs= Object.keys(matchArray)
                tripPairs.forEach(tripPair => {
                    let result= {
                        "friend" : friend,
                        "country" : matchArray[tripPair].country,
                        "tripPair" : tripPair,
                        "dates" : matchArray[tripPair].dates,
                    }
                    if(matchArray[tripPair].meetup=="true")matchedFriends.push(result)
                    if (matchArray[tripPair].advisor===friend._id)advisors.push(result)
                    if (matchArray[tripPair].advisor===user2._id)advisees.push(result)                   
                })
            }  
            else { console.log(`${user.username} and ${user2.username} ARE NOT friends`)}            
        })
    return {allFriends,matchedFriends,advisors,advisees}
}

function createMessageElement(message){
    const allTripsDiv=document.getElementById("friends-details-container");
    let friendContainer=document.createElement("div");
    friendContainer.className="empty-wrapper";
    friendContainer.innerHTML=`<p class="friend-name">${message}</p>`
    allTripsDiv.append(friendContainer);
}

function cleanFriendsWrapper(){
    const wrapperEl=document.getElementById("friends-details-container")
    wrapperEl.innerHTML=''
}

function createFriendContainer(userObject){

    const allTripsDiv=document.getElementById("friends-details-container");
    let friendContainer=document.createElement("div");
    friendContainer.className="friend-wrapper";
    
    friendContainer.innerHTML=`
            <img class="friend-pic round" src=${userObject.friend.picture}>
            <span class="country-name">${userObject.friend.username}</span>`
    if(userObject.dates!= undefined){
        friendContainer.id=userObject.friend._id;
        let start=changeDateFormat(userObject.dates.start)
        let end =changeDateFormat(userObject.dates.end)
        friendContainer.innerHTML+=`
        <span> Meet up in ${userObject.country}</span>
        <span> From ${start} </span>
        <span> to ${end} </span>`
        }
    else{friendContainer.id=userObject._id;}
    allTripsDiv.append(friendContainer);
}


// --------- Creating and delement DOM elements ---------

function showAllFriends(user2){
    cleanFriendsWrapper()  
    userAjaxHandler.getAll(allUsers => { 
        let all=computeMatch(user2, allUsers).allFriends
        all.length===0 ? 
        createMessageElement(" You don't have friends yet!") : 
        all.forEach( friend => createFriendContainer(friend))
    })    
}

function showMeetUpFriends(user2){
    cleanFriendsWrapper()
    userAjaxHandler.getAll(allUsers => { 
        let m=computeMatch(user2, allUsers).matchedFriends
        m.length===0 ? 
        createMessageElement(" None of your friends are travelling to the same location and time as you."): 
        m.forEach( result => {
            console.log(result)
            createFriendContainer(result)
            //addFriendInfo(friend)
        })
    })
}

function showGetAdvisorsFriends(user2){
    cleanFriendsWrapper()
    userAjaxHandler.getAll(allUsers => { 
        let ad=computeMatch(user2, allUsers).advisors
        ad.length===0 ? 
        createMessageElement(" None of your friends can advise you on your next trip.") : 
        ad.forEach( friend => createFriendContainer(friend))

    })
 }

function showGiveAdvicesFriends(user2){
    cleanFriendsWrapper()
    userAjaxHandler.getAll(allUsers => { 
        let add=computeMatch(user2, allUsers).advisees
        add.length===0 ? 
        createMessageElement(" None of your friends are going to one of the countries you have already visited.") : 
        add.forEach( friend => { console.log("advisee friend ----------", friend);createFriendContainer(friend)})
    })
}


// --------- Event Listener ---------
document.addEventListener("DOMContentLoaded", () => {
    const buttonAll=document.getElementById("all-friends");
    const buttonMeet=document.getElementById("friends-match");
    const buttonGet=document.getElementById("get-reco");
    const buttonGive=document.getElementById("give-reco");

    buttonAll.addEventListener("click", (evt) =>showAllFriends(currentUser));
    buttonMeet.addEventListener("click", (evt) => showMeetUpFriends(currentUser));
    buttonGet.addEventListener("click", (evt) => showGetAdvisorsFriends(currentUser));
    buttonGive.addEventListener("click",(evt) =>  showGiveAdvicesFriends(currentUser));

})
   