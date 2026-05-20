const { Enrollment, Attendance, Marks, Course, Announcement } = require('../models/index');
const User = require('../models/User');

// GET /api/faculty/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const courses = await Course.find({ faculty: req.user._id, isActive: true });
    const totalStudents = await Enrollment.countDocuments({
      course: { $in: courses.map(c => c._id) }, status: 'active'
    });
    const pendingMarks = await Marks.countDocuments({ uploadedBy: req.user._id });
    res.json({ success: true, data: { courses, totalStudents, pendingMarks, faculty: req.user } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/faculty/courses
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ faculty: req.user._id, isActive: true });
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/faculty/courses/:courseId/students
exports.getCourseStudents = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ course: req.params.courseId, status: 'active' })
      .populate('student', 'name regNo section program semester');
    res.json({ success: true, data: enrollments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/faculty/attendance
exports.markAttendance = async (req, res) => {
  try {
    const { courseId, date, records } = req.body;
    // records = [{ studentId, status }]
    const ops = records.map(r => ({
      updateOne: {
        filter: { student: r.studentId, course: courseId, date: new Date(date) },
        update: { $set: { status: r.status, markedBy: req.user._id } },
        upsert: true,
      },
    }));
    await Attendance.bulkWrite(ops);
    res.json({ success: true, message: `Attendance saved for ${records.length} students` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/faculty/attendance/:courseId
exports.getAttendanceReport = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ course: req.params.courseId, status: 'active' })
      .populate('student', 'name regNo');
    const report = await Promise.all(enrollments.map(async enr => {
      const total   = await Attendance.countDocuments({ student: enr.student._id, course: req.params.courseId });
      const present = await Attendance.countDocuments({ student: enr.student._id, course: req.params.courseId, status: 'P' });
      const absent  = await Attendance.countDocuments({ student: enr.student._id, course: req.params.courseId, status: 'A' });
      const leave   = await Attendance.countDocuments({ student: enr.student._id, course: req.params.courseId, status: 'L' });
      const pct     = total > 0 ? Math.round((present / total) * 100) : 0;
      return { student: enr.student, total, present, absent, leave, percentage: pct };
    }));
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/faculty/marks
exports.uploadMarks = async (req, res) => {
  try {
    const { courseId, semesterName, assessmentType, assessmentNo, total, records } = req.body;
    const ops = records.map(r => ({
      updateOne: {
        filter: { student: r.studentId, course: courseId, assessmentType, assessmentNo },
        update: { $set: { obtained: r.obtained, total, semesterName, uploadedBy: req.user._id } },
        upsert: true,
      },
    }));
    await Marks.bulkWrite(ops);
    res.json({ success: true, message: 'Marks uploaded successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/faculty/marks/:courseId
exports.getCourseMarks = async (req, res) => {
  try {
    const marks = await Marks.find({ course: req.params.courseId })
      .populate('student', 'name regNo');
    res.json({ success: true, data: marks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/faculty/grades
exports.uploadGrades = async (req, res) => {
  try {
    const { records } = req.body;
    const ops = records.map(r => ({
      updateOne: {
        filter: { student: r.studentId, course: r.courseId },
        update: { $set: { grade: r.grade, gradePoints: r.gradePoints, status: 'completed' } },
      },
    }));
    await Enrollment.bulkWrite(ops);
    res.json({ success: true, message: 'Grades uploaded' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
