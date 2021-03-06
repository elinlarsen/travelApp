function extractTrip(tripId) {
  if (!tripId) tripData = {};
  else {
    let tripData = {};
    tripAjaxHandler.getAll(res => console.log(res));
  }

  return tripData;
}

function changeDateFormat(dateMongo) {
  let date = new Date(dateMongo);
  let day = date.getDate() < 10 ? [0, date.getDate()].join("") : date.getDate();
  let month = date.getMonth() + 1;
  month = month < 10 ? [0, month].join("") : month;
  let year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function convertToJavascriptDateFormat(a) {
  let date = a.split("/");
  return new Date(date[2], date[0] - 1, date[1]);
}

function getCurrentDate(){
  var today = new Date();
  var year=  today.getFullYear()
  let day = today.getDate() < 10 ? [0, today.getDate()].join("") : today.getDate();
  var month= today.getMonth()+1;
  month = month < 10 ? [0, month].join("") : month;
  var date =`${month}/${day}/${year}`;
  //var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return date;
}

function createUserDescription(user){
  let content=`<img class="pic round" src=${user.picture}>
  <p class="username">${user.username}</p>`
  return content
}

function cleanWrapper(wrapperId){
  const wrapperEl=document.getElementById(wrapperId)
  wrapperEl.innerHTML=''
}

function createMessageElement(message, wrapperId){
  const wrapper=document.getElementById(wrapperId);
  let messageContainer=document.createElement("div");
  messageContainer.className="empty-wrapper";
  messageContainer.innerHTML=`<p class="friend-name">${message}</p>`
  wrapper.append(messageContainer);
}



