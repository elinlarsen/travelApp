mongoose=require('mongoose')
const Schema = mongoose.Schema;

const accSchema= new Schema({
    name : {type : String, require : true},
    start_date: {type: Date}, 
    end_date: {type: Date}, 
    address : {
        streetNb : Number,
        streetName: String,
        zipcode: String,
        city: String,
        country: String,
    },
    booking : {
        ref : {type : String},
        price : {type : Number}, 
        link: {type: String}, 
    },  
    type : {type : String},   
    budget : {type : String, emum : ["$", "$$", "$$$", "$$$$"]},
    recommendation: [{type: Schema.Types.ObjectId , ref: "recoModel"}], // nested array of reviews
})

const accModel=mongoose.model("accModel", accSchema)
module.exports=accModel; 