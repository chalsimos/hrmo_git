const mongoose =  require("mongoose");
const deductionSchema = new mongoose.Schema({
    empno:{type:String, required:true},
    deduction:{type:String, required:true},
    avalue:{type:String, required:true},
});
module.exports = mongoose.model("deductions", deductionSchema);