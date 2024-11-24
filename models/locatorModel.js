const mongoose = require("mongoose");
const locatorSchema = new mongoose.Schema({
   campus:String,
   count: Number,
});
module.exports = mongoose.model("locator", locatorSchema);
