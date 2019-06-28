mongoose=require('mongoose')
const Schema = mongoose.Schema;

const recoSchema = new Schema({
    user_id :  {type : String, require : true, unique : true}, 
    rate : {type : Number, min: 1, max:5, require: true}, 
    comment: {type : String}
})

const recoModel=mongoose.model("recoModel", recoSchema)
module.exports=recoModel; 