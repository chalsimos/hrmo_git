
const mongoose = require('mongoose');
const salarySchema = new mongoose.Schema({
    sg:{type:String, require},
    tranch:{type:String, require},
    amount:{type:String, require},
});
module.exports =mongoose.model('salarie', salarySchema);