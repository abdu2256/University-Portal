const mongoose = require('mongoose');

// ── Course ────────────────────────────────────────────────────────────────────
const courseSchema = new mongoose.Schema({
  code:        { type: String, required: true, unique: true, uppercase: true },
  name:        { type: String, required: true },
  creditHours: { type: Number, default: 3 },
  department:  { type: String },
  semester:    { type: Number },
  faculty:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  facultyName: { type: String },
  section:     { type: String },
  program:     { type: String },
  schedule:    [{ day: String, startTime: String, endTime: String, room: String }],
  totalSeats:  { type: Number, default: 40 },
  isActive:    { type: Boolean, default: true },
  academicYear:{ type: String },
  semesterName:{ type: String },
}, { timestamps: true });

// ── Enrollment ────────────────────────────────────────────────────────────────
const enrollmentSchema = new mongoose.Schema({
  student:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course:      { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  semesterName:{ type: String },
  status:      { type: String, enum: ['active','dropped','completed'], default: 'active' },
  grade:       { type: String },
  gradePoints: { type: Number },
}, { timestamps: true });
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// ── Attendance ────────────────────────────────────────────────────────────────
const attendanceSchema = new mongoose.Schema({
  student:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course:    { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  date:      { type: Date, required: true },
  status:    { type: String, enum: ['P','A','L'], default: 'P' }, // Present/Absent/Leave
  markedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
attendanceSchema.index({ student: 1, course: 1, date: 1 }, { unique: true });

// ── Marks ─────────────────────────────────────────────────────────────────────
const marksSchema = new mongoose.Schema({
  student:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course:         { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  assessmentType: { type: String, enum: ['assignment','quiz','midterm','final','lab'], required: true },
  assessmentNo:   { type: Number, default: 1 },
  obtained:       { type: Number, required: true },
  total:          { type: Number, required: true },
  semesterName:   { type: String },
  uploadedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// ── Fee ───────────────────────────────────────────────────────────────────────
const feeSchema = new mongoose.Schema({
  student:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  semesterName:{ type: String, required: true },
  totalAmount: { type: Number, required: true },
  paidAmount:  { type: Number, default: 0 },
  status:      { type: String, enum: ['paid','unpaid','partial'], default: 'unpaid' },
  dueDate:     { type: Date },
  paidDate:    { type: Date },
  challanNo:   { type: String },
  breakdown:   [{ description: String, amount: Number }],
}, { timestamps: true });

// ── Announcement ──────────────────────────────────────────────────────────────
const announcementSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  body:        { type: String },
  postedBy:    { type: String, default: 'Admin Office' },
  targetRole:  { type: String, enum: ['all','student','faculty'], default: 'all' },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

// ── FYP ───────────────────────────────────────────────────────────────────────
const fypSchema = new mongoose.Schema({
  student:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title:       { type: String },
  supervisor:  { type: String },
  coSupervisor:{ type: String },
  fypId:       { type: String },
  status:      { type: String, enum: ['pending','in_progress','completed'], default: 'pending' },
  milestones:  [{ name: String, dueDate: String, status: String }],
}, { timestamps: true });

module.exports = {
  Course:       mongoose.model('Course', courseSchema),
  Enrollment:   mongoose.model('Enrollment', enrollmentSchema),
  Attendance:   mongoose.model('Attendance', attendanceSchema),
  Marks:        mongoose.model('Marks', marksSchema),
  Fee:          mongoose.model('Fee', feeSchema),
  Announcement: mongoose.model('Announcement', announcementSchema),
  FYP:          mongoose.model('FYP', fypSchema),
};
