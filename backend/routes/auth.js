// routes/auth.js
const express = require('express');
const r = express.Router();
const c = require('../controllers/authController');
const { protect } = require('../middleware/auth');
r.post('/login', c.login);
r.get('/me', protect, c.getMe);
r.patch('/profile', protect, c.updateProfile);
r.patch('/change-password', protect, c.changePassword);
module.exports = r;
