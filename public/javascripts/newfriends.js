const currentURL = window.location.pathname;
const siteUrl = document.getElementById("site_url").content;
//const siteUrl = window.location.hostname;
const userAjaxHandler = new ajaxHandler(siteUrl, "/usersData");


// --------- Event Listener ---------
document.addEventListener("DOMContentLoaded", () => {
    // search bar 
    showAllUsers()
    //buttonAll.addEventListener("click", (evt) =>showAllFriends(currentUser));
})


function showAllUsers(){    
    userAjaxHandler.getAll(users => {
        users.forEach( user => {
            console.log("user --------", user)
            createUserContainer(user)}
            )      
    }) 
}


function createUserContainer(user){
    const userWrapper=document.getElementById("users-wrapper")
    let friendWrapper=document.createElement("div");
    friendWrapper.className="friend-wrapper";
    friendWrapper.id=user._id; 
    friendWrapper.innerHTML=createUserDescription(user) // see utils.js 
    userWrapper.append(friendWrapper)
}
