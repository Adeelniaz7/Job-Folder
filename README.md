# StackNova Jobs 🚀

A Full-Stack Job Board Application where Employers can post jobs and Job Seekers can browse and apply for them.

---

## 📁 Project Structure

```text
Job-folder/
├── Backend/          → Node.js + Express REST API
└── Frontend/         → Next.js 15 Web Application
```

---

## 🔧 Backend

**Technology:** Node.js, Express.js, MongoDB (Mongoose), JWT

### Files & Responsibilities

| File                                | Purpose                                                                                     |
| ----------------------------------- | ------------------------------------------------------------------------------------------- |
| `server.js`                         | Starts the server, connects to MongoDB, and mounts routes                                   |
| `models/User.js`                    | User schema containing name, email, password, and role (employer/jobseeker)                 |
| `models/Job.js`                     | Job schema containing title, description, company, location, salary, and job type           |
| `controllers/authcontroller.js`     | Handles user registration and login, hashes passwords with bcrypt, and generates JWT tokens |
| `controllers/jobauthcontrollers.js` | Handles Job CRUD operations (Create, Read, Update, Delete)                                  |
| `middleware/authmiddleware.js`      | Verifies JWT tokens for protected routes                                                    |
| `routes/authRoutes.js`              | Authentication routes for registration and login                                            |
| `routes/jobRoutes.js`               | Job-related routes for creating, retrieving, updating, and deleting jobs                    |
| `.env`                              | Stores environment variables such as MongoDB URI and JWT Secret                             |

### API Endpoints

```text
POST   /api/auth/register   → Register a new user
POST   /api/auth/login      → Login and receive a JWT token

POST   /api/job/create      → Create a new job (Employer only)
GET    /api/job/all         → Retrieve all jobs
GET    /api/job/:id         → Retrieve a single job
DELETE /api/job/:id         → Delete a job
PUT    /api/job/:id         → Update a job
```

### Dependencies

* `express` — Web application framework
* `mongoose` — MongoDB Object Data Modeling (ODM)
* `bcryptjs` — Password hashing
* `jsonwebtoken` — JWT-based authentication
* `dotenv` — Environment variable management
* `cors` — Cross-Origin Resource Sharing
* `nodemon` — Development server auto-reload

---

## 🎨 Frontend

**Technology:** Next.js 15, React 19, Tailwind CSS 4

### Pages & Functionality

| File                    | Route         | Purpose                                                                     |
| ----------------------- | ------------- | --------------------------------------------------------------------------- |
| `app/page.js`           | `/`           | Home page featuring hero section, statistics, and call-to-action cards      |
| `app/login/page.js`     | `/login`      | Login form with email and password fields; stores JWT token in localStorage |
| `app/register/page.js`  | `/register`   | Registration form with name, email, password, and role selection            |
| `app/jobs/page.js`      | `/jobs`       | Displays all jobs with search, filters, job detail modal, and apply button  |
| `app/dashboard/page.js` | `/dashboard`  | Employer dashboard for posting jobs, managing listings, and deleting jobs   |
| `app/layout.js`         | Global Layout | Includes Navbar, Footer, fonts, and metadata configuration                  |

### Components

| Component                 | Purpose                                                                                             |
| ------------------------- | --------------------------------------------------------------------------------------------------- |
| `Navbar.js`               | Sticky navigation bar with login state detection, role badge, logout functionality, and mobile menu |
| `PageTransitionLoader.js` | Displays loading animations during page transitions                                                 |

### Key Features

* ✅ **JWT Authentication** — Secure authentication with JWT tokens stored in localStorage
* ✅ **Role-Based Access Control** — Employers access the dashboard, while Job Seekers access job listings
* ✅ **Job Search & Filtering** — Search jobs by title, company, or location and filter by job type
* ✅ **Job Detail Modal** — View detailed job information in a popup modal with an apply option
* ✅ **Employer Dashboard** — Post jobs, manage listings, and delete jobs
* ✅ **Loading Indicators** — Animated loading overlays for better user experience
* ✅ **Dark Mode Support** — Fully supports both light and dark themes
* ✅ **Responsive Design** — Optimized for mobile, tablet, and desktop devices

---

## 🚀 Getting Started

### Backend Setup

```bash
cd Backend
npm install

# Create a .env file and add:
# MONGO_URI=<your_mongodb_uri>
# JWT_SECRET=<your_jwt_secret>
# PORT=5000

npm start
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

### Application URLs

```text
Frontend: http://localhost:3000
Backend API: http://localhost:5000
```

---

## 👤 User Roles

| Role           | Permissions                                              |
| -------------- | -------------------------------------------------------- |
| **Job Seeker** | Register, Login, Browse Jobs, Apply for Jobs             |
| **Employer**   | Register, Login, Post Jobs, Manage Listings, Delete Jobs |

---

## 🛠️ Tech Stack

| Layer          | Technology                           |
| -------------- | ------------------------------------ |
| Frontend       | Next.js 15, React 19, Tailwind CSS 4 |
| Backend        | Node.js, Express.js 5                |
| Database       | MongoDB with Mongoose                |
| Authentication | JWT (jsonwebtoken) and bcryptjs      |

---

## 📌 Project Overview

StackNova Jobs is a modern full-stack job portal designed to connect employers with job seekers. The platform provides secure authentication, role-based access control, job management, search and filtering capabilities, and a responsive user interface built with modern web technologies.

