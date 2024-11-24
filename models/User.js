const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  campus: { type: String, required: true },
  role: { type: String, enum: ['hr', 'chief', 'cashier'], default: 'hr' }
});

UserSchema.pre('save', async function (next) {
  this.email = this.email.toLowerCase(); 
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', UserSchema);
