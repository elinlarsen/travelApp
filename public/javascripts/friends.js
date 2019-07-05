const currentURL = window.location.pathname;
const siteUrl = document.getElementById("site_url").content;
const userAjaxHandler = new ajaxHandler(siteUrl, "/usersData");
import Match from './Match.js'


const u= "users";
const f="friends"; 
const userId = currentURL.substring(currentURL.indexOf(u) + u.length+1,currentURL.length-f.length-1 );
console.log(userId)

var currentUser=null;
userAjaxHandler.getOne(userId, result => {
    currentUser=result
    console.log("currentUser._id", currentUser._id)
})
console.log('------------------------------------------------------------')

// as a middleware used in app.js


// --------- Modular function ---------
function computeMatch(user1, allUsers){
    var allFriends=[]; var matchedFriends=[];var advisors=[]; var advisees=[]
        allUsers.forEach( user => {            

            let match= new Match(user1,user) 
            if( user._id != user1._id && match.user1IsFriendWithUser2() ){  
                //console.log(`${user.username} and ${user1.username} are friends !!!!`)
                let friend=user;
                allFriends.push({"friend" : friend},) 
                let matchArray= match.matchAllTrips()

                let tripPairs= Object.keys(matchArray)
                tripPairs.forEach(tripPair => {
                    let result= {
                        friend,
                        tripPair,
                        "country" : matchArray[tripPair].country,
                        "dates" : matchArray[tripPair].dates,
                        "advisor": matchArray[tripPair].advisor,
                        "meetup": matchArray[tripPair].meetup,
                        "reco": matchArray[tripPair].reco,
                    }
                    if(matchArray[tripPair].meetup==true) {
                            matchedFriends.push(result); 
                            console.log("result --------", result ) }
                    if (matchArray[tripPair].advisor===friend._id)advisors.push(result)
                    if (matchArray[tripPair].advisor===user1._id)advisees.push(result)  
                                   
                })
            }  
            //else { console.log(`${user.username} and ${user1.username} ARE NOT friends`)}            
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


/*function createUserDescription(user){
    let content=`<img class="friend-pic round" src=${user.picture}>
    <span class="friend-username">${user.username}</span>`
    return content
}*/

function tripContent(userObject){
    let message="";
    if (userObject.meetup==true)
    {message= "Meet up in"}
    else if (userObject.advisor==userObject.friend._id)
    {message = "Get some advice about your trip in"}
    else if (userObject.reco==true && userObject.advisor!=userObject.friend._id)
    {message = `Give some advice about ${userObject.friend.username} trip in`}

    if(userObject.dates!= undefined){
        let start=changeDateFormat(userObject.dates.start)
        let end =changeDateFormat(userObject.dates.end)    
        return `<section class="friend-trip-description" id="section-${userObject.friend._id}">  
            <span class="common-country"> ${message} ${userObject.country}</span>
            <span class="common-start">  ${start} - ${end}</span>  
        </section>`
    }
    else{
        console.log("dates undefined")
        return ``}
}



function createFriendContainer(userObject){
    const allTripsDiv=document.getElementById("friends-details-container");

   if(document.getElementById(userObject.friend._id)!=undefined){
       let existingFriend=document.getElementById(userObject.friend._id)
        console.log("friend wrapper already exist")
        //allTripsDiv.remove(friendWrapper)
        //existingFriend.innerHTML += tripContent(userObject)
        //allTripsDiv.append(existingFriend)
   }
   else{
        console.log("friend wrapper empty")
        let friendWrapper=document.createElement("div");
        friendWrapper.className="friend-wrapper";
        friendWrapper.id=userObject.friend._id; 
        friendWrapper.innerHTML=createUserDescription(userObject.friend)  // see utils.js 
        friendWrapper.innerHTML += tripContent(userObject)
        allTripsDiv.append(friendWrapper)
   }
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
            console.log(  "-----------------------------",createFriendContainer(result))
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
        console.log("res : ", ad)
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
   