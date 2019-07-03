mongoose = require("mongoose");
const Schema = mongoose.Schema;

const countrySchema= new Schema({

    id:String,
    name: String,
    localname: String,
    iso2: String,
    iso3: String,
    ison: String,
    e164: String,
    fips: String,
    tld: String,
    area: String,
    phone_code: String,
    continent: String,
    capital: String,
    capital_timezone: String,
    currency: String,
    created: String,
    updated: String,
})


const countryModel=mongoose.model("countryModel", countrySchema)
module.exports=countryModel; 