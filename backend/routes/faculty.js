// routes/faculty.js
const express = require('express');
const r = express.Router();
const c = require('../controllers/facultyController');
const { protect, restrictTo } = require('../middleware/auth');
r.use(protect, restrictTo('faculty', 'admin'));
r.get('/dashboard', c.getDashboard);
r.get('/courses', c.getMyCourses);
r.get('/courses/:courseId/students', c.getCourseStudents);
r.get('/attendance/:courseId', c.getAttendanceReport);
r.post('/attendance', c.markAttendance);
r.post('/marks', c.uploadMarks);
r.get('/marks/:courseId', c.getCourseMarks);
r.post('/grades', c.uploadGrades);
module.exports = r;
