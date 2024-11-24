const mongoose = require("mongoose");
const serviceRecordSchema = new mongoose.Schema({
  empno: { type: String },
  empname: { type: String },
  position: { type: String },
  start: { type: String },
  end: { type: String },
  salaryGrade: { type: String },
  tranch: { type: String },
  salary: { type: String },
  station:{type:String},
  branch:{type:String},
  type: { type: String },
});
module.exports = mongoose.model("servicerecord", serviceRecordSchema);
