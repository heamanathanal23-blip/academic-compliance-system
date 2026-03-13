# Academic Compass - Complete Project Overview

**Project Type**: Student Analytics & Support Platform  
**Current Date**: March 13, 2026  
**Version**: 1.0.0  

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Pages & Role-Based Access](#pages--role-based-access)
4. [Features by User Role](#features-by-user-role)
5. [Tech Stack](#tech-stack)
6. [Database Models](#database-models)
7. [API Endpoints](#api-endpoints)

---

## 🎯 Project Overview

**Academic Compass** is a comprehensive student analytics and academic support platform designed for institutions to:
- Track student academic performance in real-time
- Identify at-risk students and manage interventions
- Analyze department-wide and institutional trends
- Provide role-based dashboards for different user types
- Support faculty-student mentorship and interventions
- Generate institutional reports and analytics

**Target Users**: 
- **Admins**: Full system access and institutional oversight
- **Faculty**: Student management and intervention tracking
- **Students**: Personal analytics and academic insights

---

## 🏗️ System Architecture

### Frontend Structure
```
src/
├── pages/                 # Page components (11 total)
├── components/            # Reusable UI components
│   ├── dashboard/        # Role-specific dashboards
│   └── ui/               # shadcn/ui components
├── services/             # API client services (7 services)
├── context/              # Global state (Auth, Notifications)
├── hooks/                # Custom React hooks
├── lib/                  # Utilities
└── data/                 # Mock data templates
```

### Backend Structure
```
backend/
├── server.js             # Express server
├── config/               # Database configuration
├── models/               # MongoDB schemas (6 models)
├── controllers/          # Route handlers (7 controllers)
├── routes/               # API route definitions
├── services/             # Business logic
├── middleware/           # Auth, error handling
└── utils/                # Helpers and utilities
```

---

## 📄 Pages & Role-Based Access

### Complete Navigation Matrix

| Page | Route | Admin | Faculty | Student | Features |
|------|-------|:-----:|:-------:|:-------:|----------|
| **Dashboard** | `/` | ✅ | ✅ | ✅ | Role-specific KPI cards, charts, alerts |
| **Students** | `/students` | ✅ | ✅ | ❌ | View/Add/Edit/Delete student records |
| **Faculty** | `/faculty` | ✅ | ❌ | ❌ | Manage faculty, view assignments |
| **Departments** | `/departments` | ✅ | ✅ | ❌ | Department analytics & comparisons |
| **Analytics** | `/analytics` | ✅ | ❌ | ✅ | Institution/personal performance trends |
| **Risk Alerts** | `/risk-alerts` | ✅ | ✅ | ❌ | Monitor at-risk students, alerts |
| **Interventions** | `/interventions` | ✅ | ✅ | ❌ | Track intervention programs |
| **Reports** | `/reports` | ✅ | ❌ | ❌ | Generate & download reports |
| **AI Assistant** | `/assistant` | ✅ | ✅ | ✅ | AI-powered insights & recommendations |
| **Settings** | `/settings` | ✅ | ✅ | ✅ | User preferences, profile management |
| **Login** | `/login` | - | - | - | Authentication for all users |

### Navigation by Role

**Admin (10 pages)**
```
Dashboard → Students → Faculty → Departments → Analytics → 
Risk Alerts → Interventions → Reports → AI Assistant → Settings
```

**Faculty (8 pages)**
```
Dashboard → Students → Departments → Risk Alerts → 
Interventions → Reports → AI Assistant → Settings
```

**Student (3 pages)**
```
Dashboard → Analytics → AI Assistant → Settings
```

---

## 🎨 Features by User Role

### 👨‍💼 ADMIN ROLE - Complete System Control

#### 1. **Dashboard** (Admin Dashboard)
- **KPI Cards**: Total Students, Average GPA, Attendance %, At-Risk Count
- **GPA Trend Analysis**: Line chart showing semester-wise trends
- **Department Comparison**: Performance metrics across departments
- **Recent Alerts**: Real-time risk alerts with severity levels
- **AI Chat Integration**: Get insights and recommendations

#### 2. **Students Page** - Full CRUD Management
- **Features**:
  - View all students with real-time data from backend
  - Search & filter students by ID, name, department
  - **Add New Student** button with form modal
  - **Edit Student** - Modify student records
  - **Delete Student** - Remove from system
  - Inline action buttons for quick access
  - Real-time data syncing via React Query

#### 3. **Faculty Page** - Faculty Management
- **Features**:
  - View all faculty members and departments
  - Display assigned student count per faculty
  - Search by faculty name or ID
  - **Add Faculty** button (modal form)
  - **Edit Faculty** details
  - **Delete Faculty** action
  - Email and department information

#### 4. **Departments Page** - Department Analytics
- **Features**:
  - Real-time department performance data
  - Metrics: Student count, GPA, Attendance, At-Risk students
  - Department comparison cards
  - Search & filter functionality
  - Load real data from `analyticsService.getDepartmentPerformance()`

#### 5. **Analytics Page** - Institutional Insights
- **Features**:
  - Risk distribution visualization (Pie chart)
  - Real-time risk data: Low, Medium, High risk students
  - Department-wise breakdowns
  - Attendance trends
  - Performance metrics across the institution
  - Drill-down analytics

#### 6. **Risk Alerts Page** - Alert Management
- **Features**:
  - Real-time risk alerts for at-risk students
  - Severity levels: Low, Medium, High
  - Severity icons and color-coded badges
  - Alert messages and student information
  - Priority-based sorting
  - Quick action buttons for interventions

#### 7. **Interventions Page** - Intervention Tracking
- **Features**:
  - Track all student interventions
  - Intervention types: Tutoring, Counseling, Mentoring
  - Status tracking: Planned, Ongoing, Completed
  - Faculty assignment tracking
  - Start/End date monitoring
  - Search by student ID or name
  - Real-time status updates

#### 8. **Reports Page** - Report Management (Admin Only)
- **Features**:
  - **Generate Report** button (admin-only):
    - Select time period: Week, Month, Quarter, Year
    - Choose department scope
  - **Report Types**: Performance, Attendance, Risk Assessment, Department Comparison
  - **Download Reports**: Export to file format
  - **Generate Date**: Automatic timestamping
  - Report history and management

#### 9. **AI Assistant Page** - Intelligent Insights
- **Features**:
  - Chat-based interface for asking questions
  - Real-time data integration from students & analytics
  - Generate insights on:
    - Performance trends
    - At-risk student recommendations
    - Department comparisons
    - Intervention suggestions
  - Smart recommendations based on real data

#### 10. **Settings Page** - Configuration
- **Features**:
  - Profile management
  - Security settings
  - Notification preferences
  - Theme preferences (Light/Dark)
  - Account management
  - Logout functionality

---

### 👨‍🏫 FACULTY ROLE - Student & Intervention Management

#### Navigation Access (8 pages)
Dashboard → Students → Departments → Risk Alerts → Interventions → Reports → AI Assistant → Settings

#### Key Features

#### 1. **Dashboard** (Faculty Dashboard)
- **KPI Cards**: 
  - Assigned Students (under supervision)
  - Average GPA (of assigned students only)
  - Attendance % (of assigned students)
  - At-Risk Count (students needing intervention)
- **Charts**: GPA trends, Department performance
- **Recent Alerts**: Specific to assigned students
- **Filtered Data**: Only shows faculty's assigned students

#### 2. **Students Page** - Manage Assigned Students
- **Features**:
  - View assigned students only
  - Add new student to assignment
  - Edit student records
  - Remove/Delete student assignment
  - Search by ID or name
  - Department and GPA information
  - Attendance tracking

#### 3. **Departments Page** - View Department Details
- **Read-Only Features**:
  - View department information
  - Compare departments
  - See performance metrics
  - Cannot modify department data

#### 4. **Risk Alerts Page** - Monitor Student Risks
- **Features**:
  - Alerts for assigned students only
  - Severity-based filtering
  - Take intervention actions
  - Track alert resolution
  - Generate intervention records

#### 5. **Interventions Page** - Track Interventions
- **Features**:
  - Create new interventions
  - Track intervention progress
  - Update status (Planned → Ongoing → Completed)
  - Monitor multiple students
  - Set intervention dates
  - Assign intervention types

#### 6. **Reports Page** - View Reports (Read-Only)
- **Features**:
  - View generated reports
  - Download reports for personal records
  - Track intervention effectiveness
  - View department comparisons
  - Cannot modify or generate reports

#### 7. **AI Assistant** - Get Recommendations
- **Features**:
  - Ask for intervention suggestions
  - Get insights on at-risk students
  - Receive study recommendations
  - Performance analysis
  - Real-time student data integration

#### 8. **Settings** - Personal Configuration
- **Features**:
  - Profile management
  - Notification preferences
  - Email settings
  - Theme preferences
  - Account security
  - Logout

---

### 👨‍🎓 STUDENT ROLE - Personal Academic Tracking

#### Navigation Access (3 pages)
Dashboard → Analytics → AI Assistant → Settings

#### Key Features

#### 1. **Dashboard** (Student Dashboard)
- **Personal KPI Cards**:
  - Current GPA
  - Attendance Percentage
  - At-Risk Status (if applicable)
  - Performance metrics
- **Personal Trends**: GPA progress over semesters
- **Performance Charts**: Personal analytics
- **AI Chat**: Get personalized recommendations
- **Personalized Alerts**: Relevant to student only

#### 2. **Analytics Page** - Personal Performance
- **Features**:
  - Personal GPA trends (Semester-wise)
  - Performance metrics
  - Attendance tracking
  - Risk assessment (if at-risk)
  - Institutional benchmarking
  - Subject-wise performance breakdown
  - Easy-to-understand visualizations

#### 3. **AI Assistant** - Personal Insights
- **Features**:
  - Ask questions about academic performance
  - Get study recommendations
  - Receive intervention suggestions
  - Performance analysis
  - Time management advice
  - Goal-setting assistance
  - Personalized learning resources

#### 4. **Settings** - Personal Configuration
- **Features**:
  - Update personal info
  - Change password
  - Email preferences
  - Notification settings
  - Theme selection (Dark/Light)
  - Logout

---

## 💻 Tech Stack

### Frontend Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | React | 18.3.1 | UI library |
| **Language** | TypeScript | Latest | Type safety |
| **Build Tool** | Vite | Latest | Fast bundling & HMR |
| **Routing** | React Router | 6.30.1 | Client-side routing |
| **State Management** | React Context | Built-in | Global state (Auth, Notifications) |
| **Data Fetching** | TanStack React Query | 5.83.0 | Server state management |
| **UI Components** | shadcn/ui + Radix UI | Latest | Pre-built accessible components |
| **Styling** | Tailwind CSS | Latest | Utility-first CSS |
| **Animations** | Framer Motion | 12.35.2 | Smooth animations & transitions |
| **Charts** | Recharts | 2.15.4 | Data visualization |
| **Forms** | React Hook Form | 7.61.1 | Efficient form handling |
| **Validation** | Zod | 3.25.76 | Schema validation |
| **Icons** | Lucide React | 0.462.0 | Icon library |
| **Toasts/Alerts** | Sonner | 1.7.4 | Toast notifications |
| **Date Handling** | date-fns | 3.6.0 | Date utilities |
| **Theme Management** | next-themes | 0.3.0 | Dark/Light mode |
| **Markdown** | react-markdown | 10.1.0 | Render markdown content |
| **CSV Tools** | cmdk | 1.1.1 | Command menu |

### Backend Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | Node.js | Latest | JavaScript runtime |
| **Server Framework** | Express | 4.18.2 | Web framework |
| **Language** | JavaScript (ES Modules) | ES2022 | Backend logic |
| **Database** | MongoDB | 7.1.0 | NoSQL database |
| **ODM** | Mongoose | 7.0.0 | MongoDB object modeling |
| **Authentication** | JWT (jsonwebtoken) | 9.0.0 | Token-based auth |
| **Encryption** | bcryptjs | 2.4.3 | Password hashing |
| **CORS** | cors | 2.8.5 | Cross-origin requests |
| **Validation** | express-validator | 7.0.0 | Input validation |
| **Dev Server** | nodemon | 2.0.20 | Auto-restart on changes |
| **Environment** | dotenv | 16.0.3 | Environment variables |

### Development Tools

| Tool | Purpose | Version |
|------|---------|---------|
| **ESLint** | Code linting | 9.32.0 |
| **Playwright** | E2E testing | 1.57.0 |
| **Vitest** | Unit testing | Latest |
| **TypeScript** | Type checking | Latest |
| **Prettier** | Code formatting | (via ESLint) |

---

## 📊 Database Models

### MongoDB Collections (6 Models)

#### 1. **User Model**
```
- _id (ObjectId)
- email (String, unique)
- password (String, hashed with bcrypt)
- name (String)
- role (Enum: 'admin', 'faculty', 'student')
- createdAt (Date)
- updatedAt (Date)
```

#### 2. **Student Model**
```
- _id (ObjectId)
- studentId (String, unique)
- name (String)
- email (String)
- department (String, reference to Department)
- year (Number)
- gpa (Number, 0-4.0)
- attendance (Number, 0-100%)
- status (Enum: 'active', 'inactive', 'graduated')
- createdAt (Date)
- updatedAt (Date)
```

#### 3. **Faculty Model**
```
- _id (ObjectId)
- facultyId (String, unique)
- name (String)
- email (String)
- department (String, reference to Department)
- specialization (String)
- studentCount (Number)
- createdAt (Date)
- updatedAt (Date)
```

#### 4. **Prediction Model** (Risk Assessment)
```
- _id (ObjectId)
- studentId (String, reference to Student)
- riskLevel (Enum: 'low', 'medium', 'high')
- factors (Array of risk factors)
- confidence (Number, 0-1)
- generatedAt (Date)
- updatedAt (Date)
```

#### 5. **Intervention Model**
```
- _id (ObjectId)
- studentId (String, reference to Student)
- type (Enum: 'tutoring', 'counseling', 'mentoring')
- description (String)
- status (Enum: 'planned', 'ongoing', 'completed')
- facultyId (String, reference to Faculty)
- startDate (Date)
- endDate (Date, nullable)
- createdAt (Date)
- updatedAt (Date)
```

#### 6. **Alert Model**
```
- _id (ObjectId)
- studentId (String, reference to Student)
- message (String)
- severity (Enum: 'low', 'medium', 'high')
- category (String: 'academic', 'attendance', 'behavior')
- read (Boolean)
- createdAt (Date)
- acknowledgedAt (Date, nullable)
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints
```
POST   /auth/login              - User login
POST   /auth/register           - User registration
POST   /auth/logout             - User logout
GET    /auth/me                 - Get current user
```

### Student Endpoints
```
GET    /students                - Get all students
GET    /students/:id            - Get student by ID
POST   /students                - Create new student
PUT    /students/:id            - Update student
DELETE /students/:id            - Delete student
```

### Faculty Endpoints
```
GET    /faculty                 - Get all faculty
GET    /faculty/:id             - Get faculty by ID
POST   /faculty                 - Create new faculty
PUT    /faculty/:id             - Update faculty
DELETE /faculty/:id             - Delete faculty
```

### Analytics Endpoints
```
GET    /analytics/kpi           - Get KPI metrics
GET    /analytics/risk-distribution - Get risk distribution
GET    /analytics/department-performance - Get department analytics
GET    /analytics/gpa-trends    - Get GPA trends over time
```

### Alerts Endpoints
```
GET    /alerts                  - Get all alerts
GET    /alerts/:studentId       - Get alerts for student
POST   /alerts                  - Create new alert
PUT    /alerts/:id              - Update alert
GET    /alerts/read/:id         - Mark alert as read
```

### Predictions Endpoints
```
GET    /predictions             - Get all predictions
GET    /predictions/:studentId  - Get predictions for student
POST   /predictions             - Generate prediction
PUT    /predictions/:id         - Update prediction
```

### Interventions Endpoints
```
GET    /interventions           - Get all interventions
GET    /interventions/:studentId - Get interventions for student
POST   /interventions           - Create intervention
PUT    /interventions/:id       - Update intervention
DELETE /interventions/:id       - Delete intervention
```

---

## 🔐 Authentication Flow

### Login Process
1. User enters email and password on Login page
2. Frontend sends credentials to `/api/auth/login`
3. Backend validates and returns JWT token
4. Token stored in localStorage
5. Frontend redirects to Dashboard based on role
6. All subsequent API calls include Bearer token in header

### Security Features
- ✅ JWT token-based authentication
- ✅ Password hashing with bcryptjs
- ✅ CORS protection
- ✅ Input validation (express-validator)
- ✅ Protected routes (ProtectedRoute component)
- ✅ Role-based access control (RBAC)

### Demo Credentials
```
Admin:   email: admin@example.com  | password: password123
Faculty: email: faculty@example.com | password: password123  
Student: email: student@example.com | password: password123
```

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v16+)
- npm or bun
- MongoDB (local or Atlas)

### Setup Instructions

**1. Install Dependencies**
```bash
npm install
cd backend && npm install && cd ..
```

**2. Configure Environment**
```bash
# Create .env in backend directory
MONGODB_URI=mongodb://localhost:27017/academic-compass
JWT_SECRET=your_secret_key
PORT=3000
NODE_ENV=development
```

**3. Start MongoDB**
```bash
# Windows
mongod

# Or use MongoDB Atlas connection
```

**4. Seed Database**
```bash
cd backend && npm run seed
```

**5. Run Development Servers**
```bash
# Option 1: Run all together
npm run dev:all

# Option 2: Run separately in different terminals
npm run dev:backend
npm run dev:frontend
```

**6. Access Application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api`
- Default Admin: `admin@example.com` / `password123`

---

## 📈 Performance & Status

### Current State
- ✅ Authentication & JWT working
- ✅ Role-based dashboard rendering
- ✅ Real-time API data integration
- ✅ All 10 pages functional
- ✅ 7 backend services created
- ✅ 3-role RBAC system operational
- ✅ Responsive design (mobile-friendly)
- ✅ Dark/Light theme support

### Data Flow
```
1. User Login
   ↓
2. JWT Token Generation
   ↓
3. Store Token in localStorage
   ↓
4. Fetch User Profile
   ↓
5. Route to Role-Specific Dashboard
   ↓
6. Load Real Data from Services
   ↓
7. Display Role-Based Pages
```

---

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Tailwind CSS responsive classes
- ✅ Collapsible sidebar
- ✅ Responsive grids (columns: 1, 2, 4)
- ✅ Touch-friendly buttons and inputs
- ✅ Optimized for all screen sizes

---

## 🎯 Key Achievements

1. **Multi-Role System**: Completely separate dashboards and feature sets for Admin, Faculty, and Student
2. **Real-Time Data**: All pages integrated with backend API using React Query
3. **Type Safety**: Full TypeScript implementation with proper interfaces
4. **Accessibility**: Radix UI components ensure WCAG compliance
5. **Performance**: React Query caching and optimized re-renders
6. **User Experience**: Smooth animations with Framer Motion
7. **Data Visualization**: Recharts for comprehensive analytics
8. **Responsive**: Works on all devices from mobile to desktop

---

## 📞 Support & Maintenance

For issues or questions:
1. Check error messages in browser console
2. Review API responses in Network tab
3. Verify MongoDB connection
4. Ensure JWT token is valid
5. Check role-based access controls

---

**Last Updated**: March 13, 2026  
**Project Status**: ✅ Production Ready  
