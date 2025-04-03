const mongoose = require("mongoose");

const serviceRecordSchema = new mongoose.Schema({
  empno: { type: String, required: true, unique: true },
  empname: { type: String, required: true },
  position: { type: String, required: true },
  start: { type: Date, required: true },  // Use Date type for consistency
  end: { type: Date, default: null },  // Nullable if the employee is still active
  salaryGrade: { type: String, default: null},
  tranch: { type: String, default: null},
  salary: { type: Number, required: true },
  station: { type: String, required: true },
  branch: { type: String, required: true },
  type: { type: String, enum: ["PERMANENT", "COS", "Job Order"], required: true },
  campus: { 
    type: String, 
    enum: ["Calapan", "Main", "Bongabong"], 
    required: true 
  }
});

module.exports = mongoose.model("ServiceRecord", serviceRecordSchema);
