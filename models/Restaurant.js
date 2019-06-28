mongoose=require('mongoose')
const Schema = mongoose.Schema;

const restauSchema= new Schema({
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
    cuisine: {type : String}, 
    recommendation: {type: Schema.Types.ObjectId , ref: "recommendationModel"},
})

const restauModel=mongoose.model("restauModel", restauSchema)
module.exports=restauModel; 