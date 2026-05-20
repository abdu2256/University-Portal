require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const { Course, Enrollment, Attendance, Marks, Fee, Announcement, FYP } = require('./models/index');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('🌱 Seeding database...');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}), Course.deleteMany({}), Enrollment.deleteMany({}),
    Attendance.deleteMany({}), Marks.deleteMany({}), Fee.deleteMany({}),
    Announcement.deleteMany({}), FYP.deleteMany({}),
  ]);

  // ── Admin ──────────────────────────────────────────────────────────────────
  const admin = await User.create({
    regNo: 'ADMIN-001', name: 'System Administrator',
    password: 'Admin@1234', role: 'admin',
    email: 'admin@university.edu.pk', department: 'Administration',
  });
  console.log('✅ Admin created: ADMIN-001 / Admin@1234');

  // ── Faculty ────────────────────────────────────────────────────────────────
  const facultyData = [
    { regNo: 'FAC-CS-001', name: 'Dr. Sana Mirza',       email: 'sana.mirza@cui.edu.pk',   department: 'CS & IT',   designation: 'Associate Professor' },
    { regNo: 'FAC-CS-002', name: 'Dr. Umar Farooq',      email: 'umar.farooq@cui.edu.pk',  department: 'CS & IT',   designation: 'Assistant Professor' },
    { regNo: 'FAC-CS-003', name: 'Dr. Hira Baig',        email: 'hira.baig@cui.edu.pk',    department: 'CS & IT',   designation: 'Lecturer' },
    { regNo: 'FAC-BBA-001', name: 'Maryam Saleem',       email: 'maryam@cui.edu.pk',       department: 'Business',  designation: 'Lecturer' },
    { regNo: 'FAC-BBA-002', name: 'Sara Sheraz',         email: 'sara.sheraz@cui.edu.pk',  department: 'Business',  designation: 'Lecturer' },
    { regNo: 'FAC-BBA-003', name: 'Shahkar Ullah Khan',  email: 'shahkar@cui.edu.pk',      department: 'Business',  designation: 'Assistant Professor' },
    { regNo: 'FAC-BBA-004', name: 'Muhammad Shahid Iqbal',email: 'shahid@cui.edu.pk',      department: 'Business',  designation: 'Associate Professor' },
    { regNo: 'FAC-BBA-005', name: 'Laeeq Hassan Jaswal', email: 'laeeq@cui.edu.pk',        department: 'Business',  designation: 'Lecturer' },
    { regNo: 'FAC-MT-001',  name: 'Dr. Kashif Ali',      email: 'kashif@cui.edu.pk',       department: 'Mathematics',designation: 'Assistant Professor' },
  ];
  const faculty = await User.create(facultyData.map(f => ({ ...f, password: 'Faculty@1234', role: 'faculty' })));
  console.log(`✅ ${faculty.length} faculty created (password: Faculty@1234)`);

  // ── Students ───────────────────────────────────────────────────────────────
  const studentData = [
    { regNo: 'SP24-BBA-201/ISB', name: 'Ali Raza',       program: 'BBA', semester: 5, section: 'A', cgpa: 3.71, department: 'Business', batch: 'Spring 2024', fatherName: 'Muhammad Raza', cnic: '35202-1234567-1', dob: 'March 15, 2002', address: 'House 45, G-9/2, Islamabad' },
    { regNo: 'SP24-BBA-202/ISB', name: 'Sara Malik',     program: 'BBA', semester: 5, section: 'A', cgpa: 3.85, department: 'Business', batch: 'Spring 2024', fatherName: 'Malik Ashraf' },
    { regNo: 'SP21-BCS-042/ISB', name: 'Ahmed Khan',     program: 'BSCS', semester: 7, section: 'B', cgpa: 3.55, department: 'CS & IT', batch: 'Spring 2021', fatherName: 'Iqbal Khan' },
    { regNo: 'FA22-BCS-089/ISB', name: 'Fatima Noor',   program: 'BSCS', semester: 5, section: 'A', cgpa: 3.92, department: 'CS & IT', batch: 'Fall 2022', fatherName: 'Noor Ahmed' },
    { regNo: 'FA23-BBA-055/ISB', name: 'Usman Tariq',   program: 'BBA', semester: 3, section: 'B', cgpa: 3.10, department: 'Business', batch: 'Fall 2023', fatherName: 'Tariq Mehmood' },
  ];
  const students = await User.create(studentData.map(s => ({ ...s, password: 'Student@1234', role: 'student', email: `${s.regNo.split('/')[0].toLowerCase().replace(/-/g,'.')}@student.cui.edu.pk`, campus: 'Islamabad' })));
  console.log(`✅ ${students.length} students created (password: Student@1234)`);

  // ── Courses ────────────────────────────────────────────────────────────────
  const f = (name) => faculty.find(f => f.name === name)?._id;
  const coursesData = [
    { code:'ECO400', name:'Business Economics',       creditHours:3, department:'Business', semester:5, faculty:f('Maryam Saleem'),        facultyName:'Maryam Saleem',       section:'BBA 5 A', program:'BBA', semesterName:'Spring 2025', academicYear:'2025', totalSeats:40, schedule:[{day:'Monday',startTime:'8:00',endTime:'9:30',room:'LR-1'},{day:'Wednesday',startTime:'8:00',endTime:'9:30',room:'LR-1'}] },
    { code:'MKT471', name:'Consumer Behavior',        creditHours:3, department:'Business', semester:5, faculty:f('Sara Sheraz'),          facultyName:'Sara Sheraz',         section:'BBA 5 A', program:'BBA', semesterName:'Spring 2025', academicYear:'2025', totalSeats:40, schedule:[{day:'Tuesday',startTime:'9:00',endTime:'10:30',room:'LR-2'},{day:'Thursday',startTime:'9:00',endTime:'10:30',room:'LR-2'}] },
    { code:'MGT243', name:'E-Business',               creditHours:3, department:'Business', semester:5, faculty:f('Shahkar Ullah Khan'),   facultyName:'Shahkar Ullah Khan',  section:'BBA 5 A', program:'BBA', semesterName:'Spring 2025', academicYear:'2025', totalSeats:40, schedule:[{day:'Tuesday',startTime:'10:00',endTime:'11:30',room:'LR-3'},{day:'Thursday',startTime:'10:00',endTime:'11:30',room:'LR-3'}] },
    { code:'MGT300', name:'Organizational Behavior',  creditHours:3, department:'Business', semester:5, faculty:f('Muhammad Shahid Iqbal'),facultyName:'Muhammad Shahid Iqbal',section:'BBA 5 A', program:'BBA', semesterName:'Spring 2025', academicYear:'2025', totalSeats:40, schedule:[{day:'Monday',startTime:'11:00',endTime:'12:30',room:'LR-1'},{day:'Wednesday',startTime:'11:00',endTime:'12:30',room:'LR-1'}] },
    { code:'MKT477', name:'Service Marketing',        creditHours:3, department:'Business', semester:5, faculty:f('Laeeq Hassan Jaswal'),  facultyName:'Laeeq Hassan Jaswal', section:'BBA 5 A', program:'BBA', semesterName:'Spring 2025', academicYear:'2025', totalSeats:40, schedule:[{day:'Monday',startTime:'14:00',endTime:'15:30',room:'LR-4'},{day:'Wednesday',startTime:'14:00',endTime:'15:30',room:'LR-4'}] },
    { code:'CS401',  name:'Software Engineering',     creditHours:3, department:'CS & IT',  semester:7, faculty:f('Dr. Sana Mirza'),       facultyName:'Dr. Sana Mirza',      section:'BSCS 7 B', program:'BSCS', semesterName:'Spring 2025', academicYear:'2025', totalSeats:35, schedule:[{day:'Monday',startTime:'9:00',endTime:'10:30',room:'CR-5'},{day:'Wednesday',startTime:'9:00',endTime:'10:30',room:'CR-5'}] },
    { code:'CS411',  name:'Database Systems',         creditHours:3, department:'CS & IT',  semester:7, faculty:f('Dr. Umar Farooq'),      facultyName:'Dr. Umar Farooq',     section:'BSCS 7 B', program:'BSCS', semesterName:'Spring 2025', academicYear:'2025', totalSeats:35, schedule:[{day:'Tuesday',startTime:'9:00',endTime:'10:30',room:'CR-6'},{day:'Thursday',startTime:'9:00',endTime:'10:30',room:'CR-6'}] },
  ];
  const courses = await Course.create(coursesData);
  console.log(`✅ ${courses.length} courses created`);

  // ── Enrollments for main student (Ali Raza) ────────────────────────────────
  const aliRaza = students[0];
  const bbaCoursesSpring25 = courses.filter(c => c.program === 'BBA' && c.semesterName === 'Spring 2025');
  const enrollments = await Enrollment.create(
    bbaCoursesSpring25.map(c => ({ student: aliRaza._id, course: c._id, semesterName: 'Spring 2025', status: 'active' }))
  );
  console.log(`✅ ${enrollments.length} enrollments for Ali Raza`);

  // ── Past semester enrollments with grades ──────────────────────────────────
  await Enrollment.create([
    { student: aliRaza._id, course: courses[0]._id, semesterName: 'Fall 2024', status: 'completed', grade: 'A',  gradePoints: 4.0 },
    { student: aliRaza._id, course: courses[1]._id, semesterName: 'Fall 2024', status: 'completed', grade: 'A-', gradePoints: 3.7 },
    { student: aliRaza._id, course: courses[2]._id, semesterName: 'Fall 2024', status: 'completed', grade: 'B+', gradePoints: 3.3 },
    { student: aliRaza._id, course: courses[3]._id, semesterName: 'Fall 2024', status: 'completed', grade: 'A',  gradePoints: 4.0 },
  ]);

  // ── Attendance records ────────────────────────────────────────────────────
  const attRecords = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today); date.setDate(today.getDate() - i);
    for (const enr of enrollments) {
      attRecords.push({
        student: aliRaza._id, course: enr.course,
        date, status: i % 7 === 3 ? 'A' : 'P',
        markedBy: bbaCoursesSpring25[0].faculty,
      });
    }
  }
  await Attendance.insertMany(attRecords);
  console.log(`✅ ${attRecords.length} attendance records created`);

  // ── Marks ─────────────────────────────────────────────────────────────────
  const marksData = [];
  for (const enr of enrollments) {
    for (let q = 1; q <= 3; q++) marksData.push({ student: aliRaza._id, course: enr.course, assessmentType: 'quiz', assessmentNo: q, obtained: Math.floor(Math.random() * 4) + 7, total: 10, semesterName: 'Spring 2025', uploadedBy: bbaCoursesSpring25[0].faculty });
    for (let a = 1; a <= 3; a++) marksData.push({ student: aliRaza._id, course: enr.course, assessmentType: 'assignment', assessmentNo: a, obtained: Math.floor(Math.random() * 4) + 16, total: 20, semesterName: 'Spring 2025', uploadedBy: bbaCoursesSpring25[0].faculty });
    marksData.push({ student: aliRaza._id, course: enr.course, assessmentType: 'midterm', assessmentNo: 1, obtained: Math.floor(Math.random() * 5) + 25, total: 30, semesterName: 'Spring 2025', uploadedBy: bbaCoursesSpring25[0].faculty });
  }
  await Marks.insertMany(marksData);
  console.log(`✅ ${marksData.length} marks records created`);

  // ── Fee records ────────────────────────────────────────────────────────────
  await Fee.create([
    { student: aliRaza._id, semesterName: 'Spring 2025', totalAmount: 72500, paidAmount: 72500, status: 'paid', paidDate: new Date('2025-01-18'), challanNo: '29847', breakdown: [{description:'Tuition Fee',amount:54000},{description:'Registration Fee',amount:5000},{description:'Lab Charges',amount:8000},{description:'Library Fee',amount:2500},{description:'Student Activity Fund',amount:3000}] },
    { student: aliRaza._id, semesterName: 'Fall 2024', totalAmount: 68000, paidAmount: 68000, status: 'paid', paidDate: new Date('2024-09-05'), challanNo: '28341' },
    { student: aliRaza._id, semesterName: 'Spring 2024', totalAmount: 65000, paidAmount: 65000, status: 'paid', paidDate: new Date('2024-01-20'), challanNo: '26102' },
  ]);
  console.log('✅ Fee records created');

  // ── Announcements ─────────────────────────────────────────────────────────
  await Announcement.create([
    { title: 'Mid-term exams schedule published', body: 'Mid-term examinations will be held from Nov 18-22, 2025.', postedBy: 'Examinations Office', targetRole: 'all' },
    { title: 'Fee deadline extended to Dec 1', body: 'The last date for fee submission has been extended.', postedBy: 'Accounts Office', targetRole: 'student' },
    { title: 'Library extended hours: 8am–11pm', body: 'Library will remain open until 11pm during exam week.', postedBy: 'Library', targetRole: 'all' },
    { title: 'FYP registration open for 7th semester', body: 'Students in 7th semester must register their FYP by Nov 30.', postedBy: 'CS Department', targetRole: 'student' },
    { title: 'Faculty meeting scheduled for Nov 20', body: 'All faculty members are required to attend.', postedBy: 'Admin Office', targetRole: 'faculty' },
  ]);
  console.log('✅ Announcements created');

  // ── FYP ───────────────────────────────────────────────────────────────────
  await FYP.create({
    student: students[2]._id, // Ahmed Khan (BSCS)
    title: 'AI-Powered Supply Chain Management System',
    supervisor: 'Dr. Sana Mirza',
    coSupervisor: 'Dr. Umar Farooq',
    fypId: 'FYP-2025-CS-042',
    status: 'in_progress',
    milestones: [
      { name: 'Proposal submission',  dueDate: 'Oct 15, 2024', status: 'Completed' },
      { name: 'Literature review',    dueDate: 'Nov 30, 2024', status: 'Completed' },
      { name: 'System design',        dueDate: 'Dec 30, 2024', status: 'In progress' },
      { name: 'Development phase',    dueDate: 'Feb 28, 2025', status: 'Pending' },
      { name: 'Final defense',        dueDate: 'Apr 15, 2025', status: 'Pending' },
    ],
  });
  console.log('✅ FYP created');

  console.log('\n🎉 Seeding complete!\n');
  console.log('─────────────────────────────────────');
  console.log('LOGIN CREDENTIALS:');
  console.log('  Admin:   ADMIN-001      / Admin@1234');
  console.log('  Student: SP24-BBA-201/ISB / Student@1234');
  console.log('  Faculty: FAC-BBA-001    / Faculty@1234');
  console.log('─────────────────────────────────────\n');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
