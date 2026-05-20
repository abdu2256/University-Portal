import axios from 'axios';
const api = axios.create({ baseURL: '/api' });
// Student
export const getDashboard    = (p) => api.get('/student/dashboard', { params: p });
export const getAttendance   = (p) => api.get('/student/attendance', { params: p });
export const getMarks        = (p) => api.get('/student/marks', { params: p });
export const getResult       = ()  => api.get('/student/result');
export const getFee          = ()  => api.get('/student/fee');
export const getTimetable    = (p) => api.get('/student/timetable', { params: p });
export const getAvailCourses = (p) => api.get('/student/registration/available', { params: p });
export const enrollCourse    = (d) => api.post('/student/registration/enroll', d);
export const getFYP          = ()  => api.get('/student/fyp');
export const getAPS          = ()  => api.get('/student/aps');
// Faculty
export const getFacDashboard = ()  => api.get('/faculty/dashboard');
export const getFacCourses   = ()  => api.get('/faculty/courses');
export const getCourseStudents=(id)=> api.get(`/faculty/courses/${id}/students`);
export const markAttendance  = (d) => api.post('/faculty/attendance', d);
export const getAttReport    = (id)=> api.get(`/faculty/attendance/${id}`);
export const uploadMarks     = (d) => api.post('/faculty/marks', d);
export const uploadGrades    = (d) => api.post('/faculty/grades', d);
// Admin
export const getAdminStats   = ()  => api.get('/admin/stats');
export const getUsers        = (p) => api.get('/admin/users', { params: p });
export const createUser      = (d) => api.post('/admin/users', d);
export const updateUser      = (id,d)=> api.patch(`/admin/users/${id}`, d);
export const deleteUser      = (id)=> api.delete(`/admin/users/${id}`);
export const getCourses      = ()  => api.get('/admin/courses');
export const createCourse    = (d) => api.post('/admin/courses', d);
export const getAnnouncements= ()  => api.get('/admin/announcements');
export const createAnn       = (d) => api.post('/admin/announcements', d);
export const deleteAnn       = (id)=> api.delete(`/admin/announcements/${id}`);
export const getAllFees       = (p) => api.get('/admin/fees', { params: p });
export default api;
