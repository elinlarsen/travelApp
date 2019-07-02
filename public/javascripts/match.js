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
        var match; 
        let countries1=trip1.countries; 
        let countries2=trip2.countries;
        let start1=trip1.start_date
        let start2=trip2.start_date
        let end1=trip1.end_date
        let end2=trip2.end_date

        countries1.forEach( country => {
            if( countries2.includes(country)){
                if( end1 < start2) {
                    match={
                        meetup: "false",
                        recommendation: "true",
                        advisor : this.user1._id,
                        }
                    }   
                else if(end2 < start1){
                    match={
                        meetup: "false",
                        recommendation: "true",
                        advisor : this.user2._id,
                        }
                    }
                else if( start1==start2 || end1==end2 || start2<end1 || start1<end2 ){
                    match={
                        meetup:"true",
                        recommandation: "false",
                        advisor:null,
                    }
                }
            }
        });
        return match
    }

    matchAllTrips(){
        var matchArr=[];
        const trips1=this.user1.trips
        const trips2 =this.user2.trips
        trips1.forEach( (trip1, index1) => {
            trips2.forEach( (trip2, index2) => {
                if (index1<index2){
                    matchArr[index1,index2] = this.matchTripsPair(trip1, trip2)
                }

            })
        })
    }
}