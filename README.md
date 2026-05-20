# 🎓 University Portal — CUOnline Style

> Full-stack university management system like COMSATS/Bahria — built with **Node.js · Express · MongoDB · React**

---

## ✨ Features

| Role | Features |
|---|---|
| 🎓 **Student** | Dashboard, Registered Courses + Attendance bars, Result Card, Fees, Timetable, Course Registration, Profile, FYP, APS, Clearance |
| 👨‍🏫 **Faculty** | Dashboard, My Courses, Mark Attendance (P/A/L), Upload Marks, Grades |
| 🛡️ **Admin** | System stats, Student management, Faculty management, Courses, Fees, Announcements |

---

## 🚀 Quick Start

### 1 — Install
```bash
unzip university-portal.zip
cd university-portal
npm run install:all
```

### 2 — Configure `backend/.env`
```env
MONGODB_URI=mongodb://localhost:27017/university_portal
JWT_SECRET=any_long_random_string_here
```

### 3 — Start MongoDB
```bash
mongod
```
Or use free MongoDB Atlas — paste URI in `.env`.

### 4 — Seed the database
```bash
cd backend
node seed.js
```

### 5 — Run
```bash
cd ..
npm run dev
# Backend  → http://localhost:5000
# Frontend → http://localhost:3000
```

---

## 🔑 Login Credentials

| Role    | Registration No        | Password       |
|---------|------------------------|----------------|
| Student | SP24-BBA-201/ISB       | Student@1234   |
| Faculty | FAC-BBA-001            | Faculty@1234   |
| Admin   | ADMIN-001              | Admin@1234     |

---

## 📁 Project Structure

```
university-portal/
├── backend/
│   ├── config/db.js              → MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     → login, me, profile
│   │   ├── studentController.js  → dashboard, attendance, result, fees, timetable, registration, fyp, aps
│   │   ├── facultyController.js  → courses, attendance marking, marks upload
│   │   └── adminController.js    → stats, users CRUD, courses, announcements, fees
│   ├── middleware/auth.js        → JWT protect + role restriction
│   ├── models/
│   │   ├── User.js               → student/faculty/admin schema
│   │   └── index.js              → Course, Enrollment, Attendance, Marks, Fee, Announcement, FYP
│   ├── routes/                   → auth, student, faculty, admin
│   ├── seed.js                   → full demo data seeder
│   └── server.js                 → Express entry point
├── frontend/
│   └── src/
│       ├── components/layout/PortalLayout.jsx  → header, nav icons, footer
│       ├── context/AuthContext.jsx             → global auth state
│       ├── pages/
│       │   ├── auth/Login.jsx        → COMSATS-style login
│       │   ├── student/              → 10 student pages
│       │   ├── faculty/              → 3 faculty pages
│       │   └── admin/                → 2 admin pages
│       ├── services/api.js           → all axios calls
│       └── App.jsx                   → routing + role guards
└── README.md
```

---

## 🌐 Deploy

### Backend → Render (free)
```
New Web Service → connect GitHub
Root: backend | Build: npm install | Start: node server.js
Add env vars: MONGODB_URI, JWT_SECRET, FRONTEND_URL
```

### Frontend → Vercel (free)
```
Import repo → root: frontend → build: npm run build
Add: REACT_APP_API_URL=https://your-backend.onrender.com/api
```

---

## 📝 CV Description

> **University Management Portal (CUOnline)** | Node.js · Express · MongoDB · React · JWT
>
> Built a full-stack university portal similar to COMSATS CUOnline with three role-based dashboards (Student, Faculty, Admin). Student features: registered courses with attendance bars, result cards, fee statements, weekly timetable, course registration, FYP tracking, APS, and clearance. Faculty: attendance marking, marks upload. Admin: user management, system stats. JWT authentication, bcrypt password hashing, MongoDB with 7 Mongoose models, 25+ REST API endpoints. Deployed on Render + Vercel.
