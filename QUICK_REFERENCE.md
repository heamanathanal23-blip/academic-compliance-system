# Academic Compass - Quick Reference & Troubleshooting

## Quick Start (TL;DR)

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run seed
npm run dev

# Terminal 2 - Frontend (from root)
npm install
npm run dev

# Browser
http://localhost:5173/login
# Email: admin@university.edu
# Password: password123
```

---

## Project Structure at a Glance

```
academic-compass/
├── backend/                    ← Node.js + Express + MongoDB
│   ├── server.js              ← Main entry point
│   ├── models/                ← 6 MongoDB schemas
│   ├── controllers/           ← 7 API handlers
│   ├── routes/                ← 7 endpoint definitions
│   ├── services/              ← 5 business logic layers
│   ├── middleware/            ← Auth & error handling
│   ├── seed.js                ← Test data
│   └── package.json
│
├── src/                        ← React TypeScript
│   ├── services/              ← 7 API clients
│   ├── context/               ← Authentication state
│   ├── pages/                 ← 5 full-page components
│   ├── components/            ← Reusable UI components
│   └── App.tsx                ← Main app with routes
│
├── SETUP_GUIDE.md             ← Start here!
├── INTEGRATION_GUIDE.md       ← Architecture details
├── BACKEND_SUMMARY.md         ← Features overview
└── README.md                  ← Project info
```

---

## API Quick Reference

### Base URL
```
http://localhost:5000/api
```

### Headers Required
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Endpoints by Category

**Auth (No auth needed for register/login)**
```
POST   /auth/register           Register new user
POST   /auth/login              Login (returns JWT)
GET    /auth/me                 Current user info
```

**Students (Admin/Faculty)**
```
GET    /students                List all
GET    /students/:id            Get one
POST   /students                Create
PUT    /students/:id            Update
DELETE /students/:id            Delete

Filters: ?department=...&risk=high&search=name
```

**Analytics (All roles)**
```
GET    /analytics/kpi                   → { totalStudents, avgGpa, ... }
GET    /analytics/gpa-trend             → [ { semester, avgGpa } ]
GET    /analytics/department-performance
GET    /analytics/risk-distribution
GET    /analytics/faculty-performance
GET    /analytics/student-dashboard/:id
```

**Alerts (Admin/Faculty/Student)**
```
GET    /alerts                Get all
GET    /alerts/student/:id    Get for student
PUT    /alerts/:id/resolve    Mark resolved
```

**Interventions (Faculty)**
```
POST   /interventions         Create intervention
GET    /interventions/student/:id
GET    /interventions/faculty
PUT    /interventions/:id     Update
DELETE /interventions/:id     Delete
```

**AI Assistant**
```
POST   /assistant/query       { "query": "How many..." }
```

**Predictions**
```
GET    /predictions/student/:id
GET    /predictions           (all predictions)
```

---

## Common Tasks

### Task 1: Create a Student
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STU999",
    "name": "John Doe",
    "email": "john@univ.edu",
    "department": "Computer Science",
    "semester": 3,
    "gpa": 3.5,
    "attendance": 85,
    "enrollmentYear": 2022
  }'
```

### Task 2: Get All High-Risk Students
```bash
curl -X GET "http://localhost:5000/api/students?risk=high" \
  -H "Authorization: Bearer TOKEN"
```

### Task 3: Query AI Assistant
```bash
curl -X POST http://localhost:5000/api/assistant/query \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "Top 5 students by GPA"}'
```

### Task 4: Create Intervention
```bash
curl -X POST http://localhost:5000/api/interventions \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STUDENT_ID",
    "issue": "Low GPA",
    "description": "GPA dropped to 2.1",
    "actionTaken": "Tutoring Arranged",
    "actionDetails": "Math tutoring 3x/week",
    "followUpDate": "2024-03-20"
  }'
```

---

## Common Issues & Solutions

### Issue 1: "Cannot connect to MongoDB"
**Symptoms:** Error on backend startup
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
```bash
# Option 1: Start local MongoDB
mongod

# Option 2: Use MongoDB Atlas
# Update MONGO_URI in backend/.env with cloud connection string

# Option 3: Check MongoDB is running
# Windows: Get-Service MongoDB
# Mac: brew services list
```

---

### Issue 2: "CORS Error"
**Symptoms:** Frontend can't call backend
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solutions:**
```bash
# 1. Check CORS_ORIGIN in backend/.env
echo $CORS_ORIGIN  # Should be http://localhost:5173

# 2. Ensure backend restarted after .env change
npm run dev

# 3. Check frontend API URL in src/services/*
# Should be: http://localhost:5000/api
```

---

### Issue 3: "401 Unauthorized"
**Symptoms:** API returns "Token is not valid"

**Solutions:**
```javascript
// In browser console:
// Check if token exists
console.log(localStorage.getItem('token'))

// If missing:
// 1. Go to /login page
// 2. Login again
// 3. Token should be saved

// If token is invalid:
// Clear and retry
localStorage.clear()
location.reload()
```

---

### Issue 4: "Port already in use"
**Symptoms:** "Port 5000 already in use" or "Port 5173 already in use"

**Solutions:**
```bash
# Find process on port
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>

# Or use different ports
PORT=5001 npm run dev     # Backend
npm run dev -- --port 5174  # Frontend
```

---

### Issue 5: "Cannot find module 'mongoose'"
**Symptoms:** Backend fails to start with module error

**Solutions:**
```bash
cd backend
npm install              # Install all dependencies
npm install mongoose     # Specific package
npm update              # Update all packages
```

---

### Issue 6: "Authentication fails on login"
**Symptoms:** "Invalid credentials" even with correct password

**Solutions:**
```bash
# 1. Check database has users
# In MongoDB:
use academic-compass
db.users.find()

# 2. If empty, seed database
cd backend
npm run seed

# 3. Check .env EMAIL and PASSWORD are correct
cat .env

# 4. Reset password in MongoDB:
db.users.updateOne(
  { email: "admin@university.edu" },
  { password: "temporary_hash" }
)
# Then clear localStorage and try login again
```

---

### Issue 7: "Cannot GET /api/students"
**Symptoms:** 404 error on API endpoint

**Solutions:**
```bash
# 1. Check backend is running
curl http://localhost:5000/health
# Should return: {"status":"Server is running"}

# 2. Verify endpoint exists in routes
# Check backend/routes/studentRoutes.js

# 3. Check full URL and method
# GET  http://localhost:5000/api/students
# Not: http://localhost:5000/students
# Not: POST instead of GET

# 4. Restart backend server
npm run dev
```

---

### Issue 8: "Dashboard shows no data"
**Symptoms:** KPI cards show 0 or empty charts

**Solutions:**
```bash
# 1. Seed database with test data
cd backend
npm run seed

# 2. Check students exist in MongoDB
# In MongoDB:
db.students.find()
# Should show 10+ students

# 3. Check API returns data
curl http://localhost:5000/api/analytics/kpi \
  -H "Authorization: Bearer TOKEN"

# 4. Check React Query is working
# DevTools > Application > localStorage > check token exists
```

---

### Issue 9: "Alerts not generating"
**Symptoms:** No alerts appear in alerts list

**Solutions:**
```bash
# 1. Create/update a student to trigger alert generation
curl -X PUT http://localhost:5000/api/students/<STUDENT_ID> \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"gpa": 1.9, "attendance": 50}'

# 2. Check alerts in database
# In MongoDB:
db.alerts.find()

# 3. Alert should be generated if:
# - GPA < 2.5 OR Attendance < 70
```

---

### Issue 10: "TypeScript errors in IDE"
**Symptoms:** Red squiggly lines in VS Code

**Solutions:**
```bash
# 1. Install TypeScript
npm install -D typescript

# 2. Generate tsconfig.json
npx tsc --init

# 3. Reload VS Code
# Ctrl+Shift+P → TypeScript: Restart TS Server

# 4. Update service API URLs to match backend
# Check: src/services/*.ts
```

---

## Debugging Tools

### Browser DevTools

**Network Tab:**
1. Open DevTools (F12)
2. Go to Network tab
3. Perform an action
4. Check API requests:
   - Status code (should be 200)
   - Response body (should be valid JSON)
   - Headers (should have Authorization)

**Console Tab:**
1. Open DevTools (F12)
2. Go to Console tab
3. Check for JavaScript errors
4. Try commands:
   ```javascript
   fetch('http://localhost:5000/health')
     .then(r => r.json())
     .then(d => console.log(d))
   ```

**Application Tab:**
1. Open DevTools (F12)
2. Go to Application tab
3. LocalStorage → Check token and user data
4. Can manually edit/delete for testing

### Backend Debugging

**Check Logs:**
```bash
npm run dev
# Look for console output
# Should show: "Server running on port 5000"
```

**Test Endpoints:**
```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@university.edu", "password": "password123"}'
```

**MongoDB Inspection:**
```bash
# Connect to MongoDB
mongo

# Switch database
> use academic-compass

# Check collections
> show collections

# Check users
> db.users.find().pretty()

# Check students
> db.students.find().pretty()

# Count records
> db.students.countDocuments()
```

---

## Performance Tips

### For Development
```bash
# Use dev mode (with hot reload)
npm run dev

# Don't build during development
# Building slows down iteration

# Clear browser cache if stuck
# DevTools > Network > Disable cache
```

### For Production
```bash
# Build frontend
npm run build
# Creates optimized dist/ folder

# Use production MongoDB URI
# MONGO_URI=mongodb+srv://...

# Set NODE_ENV=production
NODE_ENV=production npm start
```

---

## Environment Variables Explained

### Backend .env

```bash
PORT=5000
# Server port. Change if 5000 is busy

MONGO_URI=mongodb://localhost:27017/academic-compass
# Database connection. Use Atlas URI for cloud

JWT_SECRET=your_secret_key
# Secret for signing JWTs. Change in production!

JWT_EXPIRE=7d
# How long before JWT expires

NODE_ENV=development
# development or production mode

CORS_ORIGIN=http://localhost:5173
# Frontend URL. Restricts API access
```

---

## Key Files to Know

| File | Purpose | Edit? |
|------|---------|-------|
| `backend/server.js` | Main Express app | ❌ No |
| `backend/.env` | Config values | ✅ Yes |
| `backend/seed.js` | Test data | ✅ Yes (to add users) |
| `src/App.tsx` | Routes & providers | ❌ No |
| `src/services/*.ts` | API clients | ❌ No |
| `src/context/AuthContext.tsx` | Auth state | ❌ No |
| `backend/models/*.js` | Database schemas | ⚠️  Carefully |
| `backend/routes/*.js` | API endpoints | ⚠️  Carefully |

---

## Testing Checklist

After setup, verify:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:5173
- [ ] Can navigate to login page
- [ ] Can login with admin credentials
- [ ] Dashboard loads with data
- [ ] Can view students list
- [ ] Can view analytics
- [ ] Can query AI assistant
- [ ] Can create intervention (faculty only)
- [ ] Can view alerts
- [ ] Logout works
- [ ] Redirect to login on logout
- [ ] Browser console has no errors
- [ ] Network requests have 200 status

---

## Support Resources

### Documentation
- `SETUP_GUIDE.md` - Detailed setup
- `INTEGRATION_GUIDE.md` - Architecture
- `backend/README.md` - API reference
- `BACKEND_SUMMARY.md` - Features overview

### Code Examples
- `backend/seed.js` - Database examples
- `src/services/*.ts` - API call examples
- `src/pages/*.tsx` - React examples

### External Resources
- [Express.js Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org)

---

## Quick Commands Reference

```bash
# Backend
cd backend
npm install              # Install dependencies
npm run dev             # Start development server
npm run seed            # Seed test data
npm start               # Start production server

# Frontend
npm install             # Install dependencies
npm run dev            # Start development server
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Run linter

# MongoDB
mongo                  # Connect to local MongoDB
mongod                 # Start MongoDB service (Windows/Mac)

# Git (if using version control)
git add .
git commit -m "message"
git push origin main
```

---

## Getting Help

### Step 1: Check Documentation
- Read SETUP_GUIDE.md
- Check backend/README.md
- Look for similar issue above

### Step 2: Check Console
- Browser console (F12)
- Backend console output
- MongoDB logs

### Step 3: Isolate Problem
- Test frontend alone
- Test backend alone
- Test database connection

### Step 4: Reset & Retry
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install

# Reseed database
cd backend
npm run seed

# Restart both servers
```

---

## Contact & Support

For issues not covered here:
1. Check the full README files
2. Review error messages carefully
3. Search online for the specific error
4. Check MongoDB Atlas status page
5. Verify all .env variables are correct

---

## Version Info

- Node.js: v14+
- MongoDB: 4.4+
- React: 18.3
- Express: 4.18
- TypeScript: 5.8

---

**Happy coding! 🎓**

*Last Updated: March 2026*
