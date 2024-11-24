const mongoose = require("mongoose");
const leaveSchema = new mongoose.Schema({
    empno: { type: String},
    name:{type:String},
    from: { type: String},
    to: { type: String},
    reason: { type: String},
    others: { type: String},

});
module.exports = mongoose.model("leave", leaveSchema);
