const User = require('../models/User');
const { Course, Enrollment, Attendance, Marks, Fee, Announcement, FYP } = require('../models/index');

// GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [students, faculty, courses, enrollments, fees] = await Promise.all([
      User.countDocuments({ role: 'student', isActive: true }),
      User.countDocuments({ role: 'faculty', isActive: true }),
      Course.countDocuments({ isActive: true }),
      Enrollment.countDocuments({ status: 'active' }),
      Fee.countDocuments({ status: 'paid' }),
    ]);
    const recentStudents = await User.find({ role: 'student' }).sort({ createdAt: -1 }).limit(5).select('name regNo program semester createdAt');
    res.json({ success: true, data: { students, faculty, courses, enrollments, feesPaid: fees, recentStudents } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── USERS ────────────────────────────────────────────────────────────────────
exports.getUsers = async (req, res) => {
  try {
    const { role, department, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (department) filter.department = department;
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { regNo: { $regex: search, $options: 'i' } },
    ];
    const total = await User.countDocuments(filter);
    const users = await User.find(filter).sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(parseInt(limit)).select('-password');
    res.json({ success: true, total, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── COURSES ───────────────────────────────────────────────────────────────────
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('faculty', 'name regNo').sort({ createdAt: -1 });
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── ANNOUNCEMENTS ────────────────────────────────────────────────────────────
exports.getAnnouncements = async (req, res) => {
  try {
    const ann = await Announcement.find().sort({ createdAt: -1 });
    res.json({ success: true, data: ann });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const ann = await Announcement.create({ ...req.body, postedBy: req.user.name });
    res.status(201).json({ success: true, data: ann });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── FEES ─────────────────────────────────────────────────────────────────────
exports.getAllFees = async (req, res) => {
  try {
    const { status, semesterName } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (semesterName) filter.semesterName = semesterName;
    const fees = await Fee.find(filter).populate('student', 'name regNo program').sort({ createdAt: -1 });
    res.json({ success: true, data: fees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createFee = async (req, res) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json({ success: true, data: fee });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: fee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
