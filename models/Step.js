mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stepSchema = new Schema({
  name: { type: String },
  start_date: { type: Date },
  end_date: { type: Date },
  country: { type: String },
  city: { type: String },
  landmark: { type: String },
  coordinates: {
    latitude: { type: String },
    longitude: { type: String }
  },
  accommodation: { type: String },
  restaurant: { type: String },
  transportation: { type: String },
  visit: { type: String },
  other: { type: String },
  //activities: {type: Schema.Types.ObjectId , ref: "activityModel"},
  other: { type: String },
  pictures: { type: Array } //check
});

const stepModel = mongoose.model("stepModel", stepSchema);
module.exports = stepModel;
