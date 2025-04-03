// 'sid','date','am_time_in','am_time_out','pm_time_in','pm_time_out','ot_time_in','ot_time_out',
const mongoose= require('mongoose');
const timeSchema = new mongoose.Schema({
    sid: String,
    date: String,
    am_time_in: { type: String},
    am_time_out: { type: String},
    pm_time_in: { type: String},
    pm_time_out: { type: String},
    ot_time_in: { type: String},
    ot_time_out: { type: String},
    status: { type: String }, // To store "on-travel" or "holiday"
    modifiedBy: { type: String }, // Name of the user who modified the record

});
module.exports = mongoose.model('time', timeSchema);