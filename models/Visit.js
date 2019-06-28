mongoose=require('mongoose')
const Schema = mongoose.Schema;

const visitSchema= new Schema({
    name : {type : String, require : true},
    start_date: {type: Date}, 
    address : {
        streetNb : Number,
        streetName: String,
        zipcode: String,
        city: String,
        country: String,
    },      
    type : {type : String},
    budget : {type : String, emum : ["$", "$$", "$$$", "$$$$"]},
    recommendation: {type: Schema.Types.ObjectId , ref: "recommendationModel"},
})

const visitModel=mongoose.model("visitModel", visitSchema)
module.exports=visitModel; 