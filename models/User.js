mongoose=require('mongoose')
const Schema = mongoose.Schema;

const userSchema= new Schema({
    first_name: {type : String, require:true},
    last_name: {type: String, require: true},
    username: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    adress: {
        street_number: {type: Number},
        street_name: {type: String},
        zipcode: {type: Number},
        city: {type: String},
        country: {type: String},
    },
    mobile_phone_number: {type : Number, require: true, unique : true},
    email: {type : String, require: true, unique : true},
    trip: {type: Schema.Types.ObjectId , ref: "tripModel"}, // array of ids 
    picture: {type : String, unique : true}, 
    friends:{type: Schema.Types.ObjectId , ref: "userModel"}//array of ids
})

const userModel=mongoose.model("userModel", userSchema)
module.exports=userModel; 
