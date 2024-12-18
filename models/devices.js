const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ipAddress: { type: String, required: true, unique: true },
  campus: { type: String, required: true },
});
module.exports = mongoose.model('devices', deviceSchema);
