# Academic Compass - Backend API

Complete production-ready backend for the Academic Compass student analytics platform built with Node.js, Express, and MongoDB.

## Features

✅ **JWT Authentication** - Secure token-based authentication  
✅ **Role-Based Access Control** - Admin, Faculty, and Student roles  
✅ **Student Management** - Full CRUD operations with filtering and search  
✅ **Analytics Engine** - KPI calculations, GPA trends, department performance  
✅ **Risk Detection** - Automatic risk classification based on GPA and attendance  
✅ **Alert System** - Automatic alerts for low attendance, GPA drops, high risk  
✅ **Intervention Tracking** - Faculty can record support actions  
✅ **Predictive Analytics** - ML-based risk and GPA predictions  
✅ **AI Assistant** - Natural language query processing  
✅ **MongoDB Integration** - Persistent data storage with Mongoose ORM  

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **CORS**: cors middleware
- **Environment**: dotenv

## Project Structure

```
backend/
├── config/
│   └── db.js                    # MongoDB connection
├── controllers/
│   ├── authController.js        # Authentication endpoints
│   ├── studentController.js     # Student CRUD & management
│   ├── analyticsController.js   # Analytics endpoints
│   ├── alertController.js       # Alert management
│   ├── interventionController.js # Intervention tracking
│   ├── assistantController.js   # AI assistant
│   └── predictionController.js  # Risk predictions
├── middleware/
│   ├── auth.js                  # JWT authentication & role checks
│   └── errorHandler.js          # Error handling middleware
├── models/
│   ├── User.js                  # User schema (admin, faculty, student)
│   ├── Student.js               # Student academic data
│   ├── Faculty.js               # Faculty profile
│   ├── Intervention.js          # Support interventions
│   ├── Alert.js                 # Academic alerts
│   └── Prediction.js            # Risk predictions
├── routes/
│   ├── authRoutes.js            # /api/auth/*
│   ├── studentRoutes.js         # /api/students/*
│   ├── analyticsRoutes.js       # /api/analytics/*
│   ├── alertRoutes.js           # /api/alerts/*
│   ├── interventionRoutes.js    # /api/interventions/*
│   ├── assistantRoutes.js       # /api/assistant/*
│   └── predictionRoutes.js      # /api/predictions/*
├── services/
│   ├── riskDetectionService.js  # Risk calculation logic
│   ├── alertService.js          # Alert management service
│   ├── analyticsService.js      # Analytics calculations
│   ├── assistantService.js      # NLP query processing
│   └── predictionService.js     # Prediction algorithms
├── utils/
│   └── helpers.js               # Utility functions
├── .env                         # Environment variables (local)
├── .env.example                 # Environment template
├── server.js                    # Express server entry point
└── package.json                 # Dependencies
```

## Installation

### 1. Prerequisites
- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment

Create `.env` file in backend directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/academic-compass
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**For MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/academic-compass?retryWrites=true&w=majority
```

### 4. Start Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Students
- `GET /api/students` - Get all students (with filters)
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create student (admin only)
- `PUT /api/students/:id` - Update student (admin/faculty)
- `DELETE /api/students/:id` - Delete student (admin only)

**Query Parameters:**
- `department` - Filter by department
- `search` - Search by name/email/ID
- `risk` - Filter by risk level (low/medium/high)

### Analytics
- `GET /api/analytics/kpi` - Get KPI metrics
- `GET /api/analytics/gpa-trend` - Get GPA trends by semester
- `GET /api/analytics/department-performance` - Department stats
- `GET /api/analytics/risk-distribution` - Risk distribution
- `GET /api/analytics/faculty-performance` - Faculty metrics
- `GET /api/analytics/student-dashboard/:studentId` - Student dashboard

### Alerts
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/unresolved` - Get unresolved alerts (admin)
- `GET /api/alerts/student/:studentId` - Get student alerts
- `PUT /api/alerts/:alertId/resolve` - Resolve alert

### Interventions
- `POST /api/interventions` - Create intervention (faculty)
- `GET /api/interventions/student/:studentId` - Get student interventions
- `GET /api/interventions/faculty` - Get faculty's interventions
- `PUT /api/interventions/:interventionId` - Update intervention
- `DELETE /api/interventions/:interventionId` - Delete intervention

### AI Assistant
- `POST /api/assistant/query` - Query AI assistant

**Body:**
```json
{
  "query": "How many high-risk students are there?"
}
```

### Predictions
- `GET /api/predictions/student/:studentId` - Get student prediction
- `GET /api/predictions` - Get all predictions

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

**Roles:**
- `admin` - Full access
- `faculty` - Department-level access
- `student` - Personal data only

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "admin" | "faculty" | "student",
  department: String,
  createdAt: Date
}
```

### Student
```javascript
{
  studentId: String (unique),
  userId: ObjectId (ref: User),
  name: String,
  email: String,
  department: String,
  semester: Number (1-8),
  gpa: Number (0-4.0),
  attendance: Number (0-100),
  riskLevel: "low" | "medium" | "high",
  enrollmentYear: Number,
  advisorId: ObjectId (ref: User),
  gpaHistory: Array,
  attendanceHistory: Array,
  createdAt: Date,
  updatedAt: Date
}
```

### Intervention
```javascript
{
  studentId: ObjectId (ref: Student),
  facultyId: ObjectId (ref: User),
  issue: String,
  description: String,
  actionTaken: String,
  actionDetails: String,
  status: "open" | "in-progress" | "resolved",
  followUpDate: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Alert
```javascript
{
  studentId: ObjectId (ref: Student),
  reason: String,
  severity: "low" | "medium" | "high" | "critical",
  description: String,
  resolved: Boolean,
  resolvedAt: Date,
  acknowledgedBy: ObjectId (ref: User),
  acknowledgedAt: Date,
  createdAt: Date
}
```

### Prediction
```javascript
{
  studentId: ObjectId (ref: Student),
  currentGPA: Number,
  currentAttendance: Number,
  predictedRisk: "low" | "medium" | "high",
  riskProbability: Number (0-100),
  predictedGPA: Number,
  predictedAttendance: Number,
  factors: Array,
  recommendations: Array,
  createdAt: Date,
  updatedAt: Date
}
```

## Risk Classification Logic

```
High Risk:
  - GPA < 2.5 OR Attendance < 70%

Medium Risk:
  - GPA between 2.5-3.0 OR Attendance 70-80%

Low Risk:
  - GPA >= 3.0 AND Attendance > 80%
```

## Alert Generation Rules

Alerts are automatically created when:
1. **Low Attendance**: Attendance < 70%
2. **GPA Drop**: GPA drops by 0.5+ points
3. **High Risk**: Student classified as high risk
4. **Failing Grade**: GPA < 1.5

## Example Requests

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@university.edu",
    "password": "securepass123",
    "role": "student",
    "department": "Computer Science"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@university.edu",
    "password": "securepass123"
  }'
```

### Get All Students (with filter)
```bash
curl -X GET "http://localhost:5000/api/students?department=Computer%20Science&risk=high" \
  -H "Authorization: Bearer <token>"
```

### Create Student
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STU001",
    "name": "Alice Smith",
    "email": "alice@university.edu",
    "department": "Computer Science",
    "semester": 4,
    "gpa": 3.5,
    "attendance": 85,
    "enrollmentYear": 2022
  }'
```

### Query AI Assistant
```bash
curl -X POST http://localhost:5000/api/assistant/query \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How many students are at high risk?"
  }'
```

## Error Handling

All errors follow this format:

```json
{
  "message": "Error description"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Security

- Passwords are hashed using bcryptjs with salt rounds of 10
- JWTs expire in 7 days (configurable)
- CORS is restricted to frontend origin
- All sensitive endpoints require authentication
- Role-based access control on protected routes
- Input validation on all requests

## Development Tips

### Enable Logging
Add debug logs to see detailed requests:
```bash
DEBUG=* npm run dev
```

### MongoDB Atlas Connection
1. Create cluster on MongoDB Atlas
2. Get connection string
3. Add to `.env` MONGO_URI
4. Ensure IP whitelist includes your machine

### Testing with Postman
1. Import `/backend/postman-collection.json` (create this)
2. Set `{{token}}` environment variable after login
3. Test each endpoint

## Performance Optimization

- Database indexes on frequently queried fields
- Pagination for large datasets
- Query optimization with populate()
- Caching with React Query (frontend)
- Request compression with gzip

## Deployment

### Heroku
```bash
cd backend
heroku login
heroku create your-app-name
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret_key
git push heroku main
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running locally or MongoDB Atlas credentials are correct
- Check MONGO_URI in .env
- Verify network access on MongoDB Atlas

**JWT Expired Error**
- User needs to log in again
- Token expiry is 7 days by default

**CORS Errors**
- Verify frontend URL matches CORS_ORIGIN in .env
- Check request includes proper headers

## Support & Contributing

For issues or contributions, please open an issue or pull request on GitHub.

## License

MIT License - See LICENSE file for details
