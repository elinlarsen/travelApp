export default class {
    constructor(user1, user2, userModel){
        this.user1=user1;
        this.user2=user2;
        this.userModel=userModel
    }

    isFriend(){
        var res;
        let id1=this.user1._id; 
        let friends2=this.user2.friends
        friends2.includes(id1) ?  res=true : res=false
        return res
    }

    matchTripsPair(trip1, trip2){
        var matchCountries=false; 
        var matchDates = {
            meetup:"false",
            recommandation: "false",
            advisor:null,
        }
        let countries1=trip1.countries; 
        let countries2=trip2.countries;
        let start1=trip1.start_date;
        let start2=trip2.start_date;
        let end1=trip1.end_date;
        let end2=trip2.end_date;


        countries1.forEach( (country, index) => {
            //console.log(`country in the loop ${index} : ${country}`)
            if( countries2.includes(country)){
                
                matchCountries=true;
                //console.log("MATCHHHHHH", matchCountries)
                if( end1 < start2) {
                    matchDates={
                        "country": country ,  
                        meetup: "false",
                        recommendation: "true",
                        advisor : this.user1._id,
                        }
                    }   
                else if(end2 < start1){
                    matchDates={
                        "country": country ,  
                        meetup: "false",
                        recommendation: "true",
                        advisor : this.user2._id,
                        }
                    }
                else if( start1==start2 || end1==end2 || start2<end1 || start1<end2 ){
                    matchDates={
                        "country": country ,
                        meetup:"true",
                        recommandation: "false",
                        advisor:"both",
                        dates : {
                            start : start1 > start2 ? start1 : start1,
                            end : end1 < end2 ? end1 : end2,
                            },
                    }
                }
            }
        });
        return {
            "matchCountries": matchCountries , 
            "matchDates": matchDates}
    }

    matchAllTrips(){
        var matchArr=[];
        var matchTrue=[];
        const trips1=this.user1.trips
        const trips2 =this.user2.trips
        trips1.forEach( (trip1, index1) => {
            trips2.forEach( (trip2, index2) => {
                    let id1= trip1._id;
                    let id2=trip2._id;
                    matchArr[[id1, id2]] = this.matchTripsPair(trip1, trip2)
                    this.matchTripsPair(trip1, trip2).matchCountries==true 
                    ? matchTrue[[id1, id2]] = this.matchTripsPair(trip1, trip2).matchDates 
                    : matchTrue[[id1, id2]] = false;
            })
        })
        return matchTrue
    }
}