const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
  lname: { type: String, required: true },
  fname: { type: String, required: true },
  mname: { type: String },
  birthdate:{type: String, required:true },
  birthplace:{type:String, required:true},
  cat_type: { type: String },
  area:{ type:String },
  empno: { type: String, required: true, unique: true },
  schedule: { type: String },
  // sg: { type: String, required: true },
  // tranch: { type: String, required: true },
  // amount: { type: String, required: true },
  status: { type: String, required: true },
  campus: { type: String, required: true },
});
module.exports = mongoose.model("employee", employeeSchema);
