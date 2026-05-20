// routes/student.js
const express = require('express');
const r = express.Router();
const c = require('../controllers/studentController');
const { protect, restrictTo } = require('../middleware/auth');
r.use(protect, restrictTo('student', 'admin'));
r.get('/dashboard', c.getDashboard);
r.get('/attendance', c.getAttendance);
r.get('/marks', c.getMarks);
r.get('/result', c.getResult);
r.get('/fee', c.getFee);
r.get('/timetable', c.getTimetable);
r.get('/registration/available', c.getAvailableCourses);
r.post('/registration/enroll', c.enrollCourse);
r.get('/fyp', c.getFYP);
r.get('/aps', c.getAPS);
module.exports = r;
