mongoose=require('mongoose')
const Schema = mongoose.Schema;

const tripSchema= new Schema({
    name: {type: String, require: true},
    picture: {type : String},
    //main_country: {type: String, require: true},
    start_date: {type: Date}, 
    end_date : {type: Date},
    steps: {type: Schema.Types.ObjectId , ref: "stepModel"}, // array   
})

const tripModel=mongoose.model("tripModel", tripSchema)
module.exports=tripModel; 