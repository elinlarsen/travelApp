function changeDateFormat(dateMongo){
    let date= new Date(dateMongo)
    let day=date.getDate() <10 ? [0, date.getDate()].join("") : date.getDate()
    let month=date.getMonth()+1
    month=month <10 ? [0, month].join("") : month
    let year=date.getFullYear()
    return `${day}/${month}/${year}`
  
  }

module.exports=changeDateFormat