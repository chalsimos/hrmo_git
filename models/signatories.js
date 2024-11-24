
const mongoose = require('mongoose');
const signatorySchema = new mongoose.Schema({
    name:{type:String, require},
    position:{type:String, require},
    status:{type:String, require},
    campus:{type:String, require},
});
module.exports =mongoose.model('signatorie', signatorySchema);