function changeDateFormat(dateMongo){
    let date= new Date(dateMongo)
    let day=date.getDate() <10 ? [0, date.getDate()].join("") : date.getDate()
    let month=date.getMonth()+1 <10 ? [0, date.getMonth()].join("") : date.getMonth()
    let year=date.getFullYear()
    return `${day}/${month}/${year}`
  
  }

module.exports=changeDateFormat