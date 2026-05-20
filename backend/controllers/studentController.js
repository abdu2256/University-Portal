const { Enrollment, Attendance, Marks, Fee, Announcement, FYP, Course } = require('../models/index');
const User = require('../models/User');

// GET /api/student/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const uid = req.user._id;
    const semName = req.query.semester || 'Spring 2025';

    const [enrollments, fee, announcements] = await Promise.all([
      Enrollment.find({ student: uid, semesterName: semName, status: 'active' }).populate('course'),
      Fee.findOne({ student: uid, semesterName: semName }),
      Announcement.find({ isActive: true, targetRole: { $in: ['all', 'student'] } }).sort({ createdAt: -1 }).limit(5),
    ]);

    // Compute attendance % per course
    const attData = await Promise.all(enrollments.map(async (enr) => {
      const total = await Attendance.countDocuments({ student: uid, course: enr.course._id });
      const present = await Attendance.countDocuments({ student: uid, course: enr.course._id, status: 'P' });
      const pct = total > 0 ? Math.round((present / total) * 100) : 0;
      return { course: enr.course, creditHours: enr.course.creditHours, attendance: pct };
    }));

    res.json({ success: true, data: { enrollments: attData, fee, announcements, student: req.user } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/student/attendance
exports.getAttendance = async (req, res) => {
  try {
    const uid = req.user._id;
    const semName = req.query.semester || 'Spring 2025';
    const enrollments = await Enrollment.find({ student: uid, semesterName: semName, status: 'active' }).populate('course');

    const result = await Promise.all(enrollments.map(async (enr) => {
      const total   = await Attendance.countDocuments({ student: uid, course: enr.course._id });
      const present = await Attendance.countDocuments({ student: uid, course: enr.course._id, status: 'P' });
      const leave   = await Attendance.countDocuments({ student: uid, course: enr.course._id, status: 'L' });
      const absent  = total - present - leave;
      const pct     = total > 0 ? Math.round((present / total) * 100) : 0;
      return { course: enr.course, total, present, absent, leave, percentage: pct };
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/student/marks
exports.getMarks = async (req, res) => {
  try {
    const uid = req.user._id;
    const semName = req.query.semester || 'Spring 2025';
    const enrollments = await Enrollment.find({ student: uid, semesterName: semName }).populate('course');

    const result = await Promise.all(enrollments.map(async (enr) => {
      const marks = await Marks.find({ student: uid, course: enr.course._id, semesterName: semName });
      return { course: enr.course, grade: enr.grade, gradePoints: enr.gradePoints, marks };
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/student/result
exports.getResult = async (req, res) => {
  try {
    const uid = req.user._id;
    const semesters = ['Spring 2025', 'Fall 2024', 'Spring 2024', 'Fall 2023'];
    const result = await Promise.all(semesters.map(async (sem) => {
      const enrollments = await Enrollment.find({ student: uid, semesterName: sem }).populate('course');
      if (!enrollments.length) return null;
      const totalPoints = enrollments.reduce((s, e) => s + (e.gradePoints || 0) * (e.course?.creditHours || 3), 0);
      const totalCr = enrollments.reduce((s, e) => s + (e.course?.creditHours || 3), 0);
      const gpa = totalCr > 0 ? (totalPoints / totalCr).toFixed(2) : '0.00';
      return { semester: sem, gpa, courses: enrollments, creditHours: totalCr };
    }));
    res.json({ success: true, data: result.filter(Boolean) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/student/fee
exports.getFee = async (req, res) => {
  try {
    const fees = await Fee.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: fees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/student/timetable
exports.getTimetable = async (req, res) => {
  try {
    const uid = req.user._id;
    const semName = req.query.semester || 'Spring 2025';
    const enrollments = await Enrollment.find({ student: uid, semesterName: semName, status: 'active' })
      .populate({ path: 'course', select: 'code name schedule facultyName creditHours' });
    res.json({ success: true, data: enrollments.map(e => e.course) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/student/registration/available
exports.getAvailableCourses = async (req, res) => {
  try {
    const { semester, program } = req.query;
    const filter = { isActive: true };
    if (semester) filter.semesterName = semester;
    if (program)  filter.program = program;
    const courses = await Course.find(filter).populate('faculty', 'name');
    const enrolled = await Enrollment.find({ student: req.user._id }).select('course');
    const enrolledIds = enrolled.map(e => e.course.toString());
    const available = courses.map(c => ({ ...c.toObject(), alreadyEnrolled: enrolledIds.includes(c._id.toString()) }));
    res.json({ success: true, data: available });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/student/registration/enroll
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId, semesterName } = req.body;
    const existing = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (existing) return res.status(400).json({ success: false, message: 'Already enrolled' });
    const enrollment = await Enrollment.create({ student: req.user._id, course: courseId, semesterName });
    res.status(201).json({ success: true, data: enrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/student/fyp
exports.getFYP = async (req, res) => {
  try {
    const fyp = await FYP.findOne({ student: req.user._id });
    res.json({ success: true, data: fyp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/student/aps
exports.getAPS = async (req, res) => {
  try {
    const uid = req.user._id;
    const allEnrollments = await Enrollment.find({ student: uid, status: { $in: ['active', 'completed'] } }).populate('course');
    const totalCr = allEnrollments.reduce((s, e) => s + (e.course?.creditHours || 0), 0);
    const completedEnr = allEnrollments.filter(e => e.status === 'completed');
    const completedCr = completedEnr.reduce((s, e) => s + (e.course?.creditHours || 0), 0);
    res.json({ success: true, data: { cgpa: req.user.cgpa, totalCreditHours: totalCr, completedCreditHours: completedCr, requiredCreditHours: 130 } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
