mongoose=require('mongoose')
const Schema = mongoose.Schema;

const recoSchema = new Schema({
    user_id :  {type: Schema.Types.ObjectId , ref: "userModel"}, //relation to a user, a reco must be written by one and only one users
    // a recommodation is related to at least one of these activities
    accomodation_id: {type: Schema.Types.ObjectId , ref: "accModel"},
    restau_id : {type: Schema.Types.ObjectId , ref: "restauModel"},
    transport_id: {type: Schema.Types.ObjectId , ref: "transpoModel"},
    visit_id: {type: Schema.Types.ObjectId , ref: "visitModel"},
    //
    rate : {type : Number, min: 1, max:5, require: true}, 
    comment: {type : String}
})

const recoModel=mongoose.model("recoModel", recoSchema)
module.exports=recoModel; 