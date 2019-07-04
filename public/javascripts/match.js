export default class {
    constructor(user1, user2, userModel){
        this.user1=user1;
        this.user2=user2;
        this.userModel=userModel
        this.id1=user1._id;
        this.id2=user2._id;
        this.trips1=user1.trips;
        this.trips2 =user2.trips;
    }

    isFriend(){
        var res;
        let friends2=this.user2.friends
        friends2.includes(this.id1) ?  res=true : res=false
        return res
    }

    matchTripsPair(trip1, trip2){
        var matchCountries=false; 
        var matchDates = {
            country: "",
            meetup:"false",
            recommandation: "false",
            advisor:null,
        }
        let countries1=trip1.countries; 
        let countries2=trip2.countries;
        let start1=changeDateFormat(trip1.start_date);
        let start2=changeDateFormat(trip2.start_date);
        let end1=changeDateFormat(trip1.end_date);
        let end2=changeDateFormat(trip2.end_date);

        let dateNow= getCurrentDate()
        
        /*console.log("start1 -----", start1)
        console.log("end1 -----", end1)
        console.log("dateNow -----", dateNow)
        console.log("start2 -----", start2)
        console.log("end2 -----", end2)
        console.log("end2 < dateNow< start1 -----", end2 < dateNow && dateNow < start1)
        console.log("end1 < dateNow < start2-----", end1 < dateNow && dateNow< start2)
*/
        countries1.forEach( (country, index) => {
            country=country.replace(/\s/g, '');
            countries1.forEach(country2 =>{
                country2=country2.replace(/\s/g, '')  
                if(country2==country && country!=""){
                    //console.log("matched for country -------", country)
                    matchCountries=true;
                    if( end1 < dateNow && dateNow< start2) {
                        matchDates={
                            country: country ,  
                            meetup: false,
                            reco: true,
                            advisor : this.id1, 
                            dates: {
                                start : start2,
                                end: end2
                            }
                            }
                        }   
                    else if(end2 < dateNow && dateNow < start1){
                        matchDates={
                            country: country,  
                            meetup: false,
                            reco: true,
                            advisor : this.id2,
                            dates : {
                                start : start1,
                                end: end1
                            }
                            }
                        }
                    else if(   (start1 > dateNow && start2> dateNow) && (start1==start2 || end1==end2 || start2<end1 || start1<end2) ){
                        matchDates={
                            country: country ,
                            meetup:true,
                            reco: false,
                            advisor:"both",
                            dates : {
                                start : start1 > start2 ? start1 : start1,
                                end : end1 < end2 ? end1 : end2,
                                },
                        }
                    }
                }
            })
        });
        return { "matchCountries": matchCountries , 
                 "matchDates": matchDates}
    }

    matchAllTrips(){
        var matchArr=[];
        var matchTrue=[];
        this.trips1.forEach( (trip1) => {
            this.trips2.forEach( (trip2) => {
                    let id1= trip1._id;
                    let id2=trip2._id;
                    matchArr[[id1, id2]] = this.matchTripsPair(trip1, trip2)
                    this.matchTripsPair(trip1, trip2).matchCountries==true 
                    ? matchTrue[[id1, id2]] = this.matchTripsPair(trip1, trip2).matchDates 
                    //: matchTrue[[id1, id2]] = false;
                    :console.log("lol")
            })
        })
        console.log("matchTrue ARRAY ---", matchTrue)
        return matchTrue
    }
}