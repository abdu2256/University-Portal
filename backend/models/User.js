const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  regNo:       { type: String, required: true, unique: true, uppercase: true, trim: true },
  name:        { type: String, required: true, trim: true },
  password:    { type: String, required: true, minlength: 6, select: false },
  role:        { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
  email:       { type: String, lowercase: true },
  phone:       { type: String },
  avatar:      { type: String, default: '' },
  isActive:    { type: Boolean, default: true },
  lastLogin:   { type: Date },
  department:  { type: String },
  campus:      { type: String, default: 'Islamabad' },
  // Student-specific
  program:     { type: String },
  batch:       { type: String },
  semester:    { type: Number, default: 1 },
  section:     { type: String },
  cgpa:        { type: Number, default: 0 },
  fatherName:  { type: String },
  cnic:        { type: String },
  dob:         { type: String },
  address:     { type: String },
  // Faculty-specific
  designation: { type: String },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
