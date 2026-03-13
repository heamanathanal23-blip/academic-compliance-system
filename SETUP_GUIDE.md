# Academic Compass - Complete Setup Guide

This guide walks you through setting up and running the complete Academic Compass system - both frontend and backend.

## Prerequisites

- **Node.js** v14+ ([Download](https://nodejs.org))
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas cloud)
- **Git** (optional)

## Quick Start (5 minutes)

### 1. Start Backend Server

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file with your configuration
# (Use .env.example as template)

# Seed database with test data
npm run seed

# Start development server
npm run dev
```

Server runs on `http://localhost:5000`

### 2. Start Frontend Application

In a new terminal:

```bash
# From project root
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

### 3. Login

Visit `http://localhost:5173/login` and use test credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@university.edu | password123 |
| Faculty | faculty@university.edu | password123 |
| Student | student@university.edu | password123 |

---

## Detailed Setup

### Backend Configuration

#### Step 1: Install Dependencies
```bash
cd backend
npm install
```

#### Step 2: Create Environment File
Create `backend/.env`:

**For Local MongoDB:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/academic-compass
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**For MongoDB Atlas (Cloud):**
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/academic-compass?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

#### Step 3: Setup MongoDB

**Option A: Local MongoDB**
```bash
# On Windows (if installed via MSI)
# MongoDB should auto-start

# Or start manually:
mongod

# Verify connection:
mongo
> db.version()
```

**Option B: MongoDB Atlas**
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string
5. Replace username, password in .env MONGO_URI

#### Step 4: Seed Database
```bash
npm run seed
```

Expected output:
```
Connecting to MongoDB...
Clearing existing data...
Creating test users and data...
✓ Admin created: admin@university.edu
✓ Faculty created: faculty@university.edu
✓ Students created...
✓ Faculty-student relationships set up

✅ Database seeded successfully!
```

#### Step 5: Start Backend
```bash
npm run dev
```

Expected output:
```
Server running on port 5000
Environment: development
```

Test connection:
```bash
curl http://localhost:5000/health
# Should return: {"status":"Server is running"}
```

---

### Frontend Configuration

#### Step 1: Ensure Dependencies Installed
```bash
# From project root
npm install
```

#### Step 2: Verify Services Configuration

All API services are pre-configured to connect to `http://localhost:5000/api`

If you need to change the API URL, update these files:
- `src/services/authService.ts`
- `src/services/studentService.ts`
- `src/services/analyticsService.ts`
- etc.

Change `const API_URL = 'http://localhost:5000/api'`

#### Step 3: Start Development Server
```bash
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  Press q to quit
```

#### Step 4: Build for Production
```bash
npm run build
```

---

## Testing the Integration

### Manual Testing Checklist

After both servers are running, verify:

#### Authentication
- [ ] Navigate to http://localhost:5173/login
- [ ] Login with admin@university.edu / password123
- [ ] Token appears in browser DevTools > Application > localStorage > token
- [ ] Redirected to dashboard
- [ ] Click logout
- [ ] Redirected back to login

#### Dashboard
- [ ] KPI cards display with correct totals
- [ ] GPA Trend chart loads
- [ ] Department Performance chart loads
- [ ] All metrics come from backend (check Network tab)

#### Students Page
- [ ] Students list displays all students
- [ ] Can filter by department
- [ ] Can search by name
- [ ] Can filter by risk level
- [ ] Student details show backend data

#### Analytics Page
- [ ] GPA trends visualized
- [ ] Risk distribution pie chart shows correct counts
- [ ] Department comparison chart works
- [ ] All data is real-time from backend

#### AI Assistant
- [ ] Type query: "How many high-risk students?"
- [ ] Receives correct response from backend
- [ ] Response includes student details
- [ ] Try different queries to see NLP processing

#### Alerts (Admin Only)
- [ ] Admin sees alerts generated during student creation
- [ ] Can view unresolved alerts
- [ ] Can mark alerts as resolved
- [ ] Faculty sees only department alerts

#### Interventions (Faculty)
- [ ] Faculty can create intervention
- [ ] Can update intervention status
- [ ] Can add notes and follow-up dates
- [ ] Cannot delete others' interventions

---

## Project Architecture

### Backend Architecture

```
Express Server
├── Routes (7 route files)
├── Controllers (7 controller files)
├── Services (5 service files)
├── Models (6 MongoDB schemas)
├── Middleware (Auth, error handling)
├── Utils & Config
└── MongoDB Database
```

### Frontend Architecture

```
React App
├── AuthContext (Global auth state)
├── ProtectedRoute (Route guards)
├── Services (API clients)
├── Pages (Full-screen views)
├── Components (Reusable UI)
├── Hooks (Custom React hooks)
└── TypeScript (Type safety)
```

### Data Flow Example: Viewing Students

```
1. User clicks "Students" in sidebar
2. React renders StudentsPage.tsx
3. StudentsPage uses useQuery to fetch data
   → studentService.getAll(filters)
4. Service adds JWT token and calls:
   → GET /api/students?department=Computer%20Science
5. Backend Route receives request
   → auth middleware validates JWT
   → controller fetches from MongoDB
   → applies filters
   → returns JSON response
6. React Query caches response
7. Components re-render with data from query cache
```

---

## API Endpoints Reference

### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login and get JWT
GET    /api/auth/me             - Get current user (protected)
```

### Students
```
GET    /api/students            - List all (with filters/search)
GET    /api/students/:id        - Get single student
POST   /api/students            - Create (admin only)
PUT    /api/students/:id        - Update (admin/faculty)
DELETE /api/students/:id        - Delete (admin only)
```

### Analytics
```
GET    /api/analytics/kpi       - Get KPI metrics
GET    /api/analytics/gpa-trend - GPA trends by semester
GET    /api/analytics/department-performance
GET    /api/analytics/risk-distribution
GET    /api/analytics/faculty-performance
GET    /api/analytics/student-dashboard/:id
```

### Alerts
```
GET    /api/alerts              - Get all alerts
GET    /api/alerts/unresolved   - Get unresolved (admin)
GET    /api/alerts/student/:id  - Get student alerts
PUT    /api/alerts/:id/resolve  - Resolve alert
```

### Interventions
```
POST   /api/interventions       - Create (faculty)
GET    /api/interventions/student/:id
GET    /api/interventions/faculty
PUT    /api/interventions/:id   - Update
DELETE /api/interventions/:id   - Delete
```

### AI Assistant
```
POST   /api/assistant/query     - Natural language query
```

### Predictions
```
GET    /api/predictions/student/:id
GET    /api/predictions         - All predictions
```

---

## Debugging Tips

### Backend Issues

**Check server is running:**
```bash
curl http://localhost:5000/health
```

**View MongoDB logs:**
```bash
# In mongo shell
> db.users.find().pretty()
> use academic-compass
> show collections
```

**Check environment variables:**
```bash
# In backend directory
echo $MONGO_URI
echo $JWT_SECRET
```

### Frontend Issues

**Check API calls in DevTools:**
1. Open DevTools (F12)
2. Go to Network tab
3. Look for API requests
4. Check response status and data

**Clear cache and re-login:**
```javascript
// In browser console:
localStorage.clear();
location.reload();
```

**Check Auth Context:**
```javascript
// In browser console:
console.log(JSON.parse(localStorage.getItem('user')))
console.log(localStorage.getItem('token'))
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "MongoDB connection failed" | MongoDB not running | Start MongoDB service |
| "CORS error" | Wrong CORS_ORIGIN | Update .env CORS_ORIGIN |
| "401 Unauthorized" | Invalid/expired token | Clear localStorage, re-login |
| "Cannot GET /api/..." | Wrong route | Check backend routes file |
| "Cannot find token" | localStorage cleared | Login again |

---

## Environment Files

### Backend .env Template
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/academic-compass

# JWT
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Production Deployment

**Backend (Heroku):**
```bash
heroku create academic-compass-api

heroku config:set \
  MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/academic-compass \
  JWT_SECRET=production_secret_key \
  NODE_ENV=production

git push heroku main
```

**Frontend (Vercel):**
```bash
# Update frontend API URL to production backend
# Then deploy:
npm run build
vercel deploy --prod
```

---

## Performance & Security

### Security Best Practices
- ✅ Passwords hashed with bcryptjs (salt: 10)
- ✅ JWT tokens with 7-day expiration
- ✅ Role-based access control on all endpoints
- ✅ CORS restricted to frontend origin
- ✅ Input validation on all requests

### Performance Optimizations
- ✅ Database indexes on frequently queried fields
- ✅ React Query for client-side caching
- ✅ Lazy loading for large datasets
- ✅ Gzip compression enabled
- ✅ Connection pooling in MongoDB

---

## Support & Troubleshooting

### Can't Connect to MongoDB?
```bash
# Check MongoDB service on Windows
Get-Service MongoDB

# Start service
Start-Service MongoDB

# Or for mongod:
mongod --dbpath "C:\data\db"
```

### Backend server won't start?
```bash
# Check port 5000 is available
netstat -ano | findstr :5000

# Kill process on port 5000 if needed
taskkill /PID <process_id> /F
```

### Frontend won't load?
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart dev server
npm run dev
```

### Still have issues?
1. Check all error messages in console
2. Review backend logs: `npm run dev`
3. Check DevTools Network tab
4. Verify all .env variables are set correctly
5. Ensure MongoDB is accessible

---

## Next Steps

After successful setup:

1. ✅ Explore the dashboard with different user roles
2. ✅ Create custom students via API
3. ✅ Test all AI assistant queries
4. ✅ Generate reports and analytics
5. ✅ Implement additional features (SMS alerts, file uploads, etc.)

---

## File Structure Reference

```
academic-compass/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── utils/
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   ├── .env
│   └── README.md
├── src/
│   ├── context/AuthContext.tsx
│   ├── services/
│   │   ├── authService.ts
│   │   ├── studentService.ts
│   │   ├── analyticsService.ts
│   │   └── ...
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   └── ...
│   ├── components/ProtectedRoute.tsx
│   ├── App.tsx
│   └── main.tsx
├── INTEGRATION_GUIDE.md
└── README.md
```

---

## License

MIT License

---

## Questions?

Refer to:
- [Backend README](./backend/README.md) - Backend-specific docs
- [Integration Guide](./INTEGRATION_GUIDE.md) - Frontend-backend integration
- API documentation in backend README

Happy coding! 🎓
