const mongoose = require("mongoose");
const filedLocatorSchema = new mongoose.Schema({
   locatorNo: String,
   empname: String,
   empno: String,
   location: String,
   purpose: String,
   departure: String,
   arrival: String,
});
module.exports = mongoose.model("filedlocator", filedLocatorSchema);
