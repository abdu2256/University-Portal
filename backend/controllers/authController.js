const User = require('../models/User');
const { signToken } = require('../middleware/auth');

const respond = (res, user, code = 200) => {
  const token = signToken(user._id);
  res.status(code).json({
    success: true, token,
    user: {
      id: user._id, regNo: user.regNo, name: user.name,
      role: user.role, email: user.email, department: user.department,
      program: user.program, semester: user.semester, section: user.section,
      cgpa: user.cgpa, campus: user.campus, batch: user.batch,
      designation: user.designation, avatar: user.avatar,
    },
  });
};

exports.login = async (req, res) => {
  try {
    const { regNo, password } = req.body;
    if (!regNo || !password)
      return res.status(400).json({ success: false, message: 'Registration number and password required' });
    const user = await User.findOne({ regNo: regNo.toUpperCase() }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    respond(res, user);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
};

exports.updateProfile = async (req, res) => {
  try {
    const allowed = ['email', 'phone', 'address', 'avatar'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword)))
      return res.status(400).json({ success: false, message: 'Current password incorrect' });
    user.password = newPassword;
    await user.save();
    respond(res, user);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
