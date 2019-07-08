const currentURL = window.location.pathname;
const siteUrl = document.getElementById("site_url").content;
const userAjaxHandler = new ajaxHandler(siteUrl, "/usersData");

const u= "users";
const f="friend_add"; 
const userId = currentURL.substring(currentURL.indexOf(u) + u.length+1,currentURL.length-f.length-1 );

// --------- Event Listener ---------
document.addEventListener("DOMContentLoaded", () => {

    showAllUsers(userId)

    const searchUsernameBtn=document.getElementById("searchUsernameBtn")
    searchUsernameBtn.addEventListener("click",(evt)=> showUserSearched(userId))

})


function showAllUsers(userId){    
    userAjaxHandler.getAll(users => {
        users.forEach( user => {
            //console.log("user --------", user)
            if(user._id !=userId)
                {   const wrapperUserId="users-wrapper"
                    createUserContainer(user, wrapperUserId)}
        })      
    }) 
}

function showUserSearched( userId ){
    const usernameSearched=document.getElementById("searchValue").value.toLowerCase();
    if(usernameSearched==""){showAllUsers(userId)}
    else{

        userAjaxHandler.getAll(users => {

            const wrapperUserId="users-wrapper"
            const wrapMessage="errorMessage";
            const message= "Sorry, this username does not exist. Please, try again or invit your friend !"
            const usernameSearched=document.getElementById("searchValue").value.toLowerCase();
            cleanWrapper(wrapMessage) 
            cleanWrapper(wrapperUserId)     

            let match=false;
            users.forEach( user => {
                if(user._id !=userId && user.username == usernameSearched)
                    {   
                        createUserContainer(user, wrapperUserId)
                        match=true;
                        console.log(match)
                    }
            })   
            if(match==false)createMessageElement(message, wrapMessage) 
        })  
    }   
}

function createAddUserIcon(){
    return `
    <div class="add-friend-icon"><i class="icon fa fa-user-plus"></i><span class="onhover">Add Friend</span>
    </div>`
}


function createUserContainer(user, wrapperUserId){
    const userWrapper=document.getElementById(wrapperUserId)
    let friendWrapper=document.createElement("div");
    friendWrapper.className="friend-wrapper"; // see friends.js & friends.css
    friendWrapper.id=user._id; 
    friendWrapper.innerHTML=createAddUserIcon()
    friendWrapper.innerHTML+=createUserDescription(user) // see utils.js 
    userWrapper.append(friendWrapper)
}

