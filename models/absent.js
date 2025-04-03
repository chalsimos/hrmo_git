const mongoose = require('mongoose');

const absentSchema = new mongoose.Schema({
  empno: String,
  name: String,
  date: Date,
  month: String,
  year: String,
  campus: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Absent', absentSchema);

