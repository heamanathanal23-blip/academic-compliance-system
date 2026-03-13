# Academic Compass Integration Guide

This document covers the full integration of the React frontend with the Node.js backend.

## Project Structure

```
academic-compass/
├── backend/                     # Node.js + Express server
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── ...
├── src/                         # React frontend
│   ├── services/
│   │   ├── authService.ts
│   │   ├── studentService.ts
│   │   ├── analyticsService.ts
│   │   ├── assistantService.ts
│   │   ├── alertService.ts
│   │   ├── interventionService.ts
│   │   └── predictionService.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── components/
│   │   ├── ProtectedRoute.tsx
│   │   └── ... existing components
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   └── ... existing pages
│   ├── App.tsx
│   └── main.tsx
├── package.json                 # Frontend dependencies
└── README.md
```

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/academic-compass
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

Start backend:
```bash
npm run dev
```

### 2. Frontend Setup

From root directory:
```bash
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3. Database Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update MONGO_URI in backend .env

## API Integration

### Authentication Flow

1. User navigates to `/login`
2. Enters credentials and submits form
3. Frontend calls `authService.login(email, password)`
4. Backend validates and returns JWT token
5. Frontend stores token in localStorage
6. AuthContext updates global auth state
7. User redirected to dashboard
8. All subsequent requests include Authorization header

### Service Layer

Each service module provides async functions that:
- Add Authorization header with JWT token
- Make HTTP requests to backend API
- Handle responses and errors
- Return structured data to components

Example usage in components:
```tsx
import { useQuery } from '@tanstack/react-query';
import { studentService } from '@/services/studentService';

function StudentsList() {
  const { data, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentService.getAll()
  });

  if (isLoading) return <div>Loading...</div>;
  return <div>{/* render data */}</div>;
}
```

### Protected Routes

Routes are protected using the `ProtectedRoute` component:

```tsx
<Route
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminPanel />
    </ProtectedRoute>
  }
  path="/admin"
/>
```

## Data Flow Example

### Dashboard Page Flow

1. **Mount**: ComponentFetch KPI data from backend
   ```tsx
   const { data: kpi } = useQuery({
     queryKey: ['analytics', 'kpi'],
     queryFn: () => analyticsService.getKPI()
   });
   ```

2. **API Call**: Frontend → Backend
   ```
   GET /api/analytics/kpi
   Authorization: Bearer <token>
   ```

3. **Backend Processing**:
   - Authenticate JWT token
   - Query Student collection
   - Calculate KPI metrics
   - Return JSON response

4. **Frontend Display**: Render KPI cards with data

## Role-Based Features

### Admin
- View all students across departments
- Manage student records (create, edit, delete)
- View institution-wide analytics
- Access risk alerts
- View faculty performance
- Generate reports

### Faculty
- View only their department's students
- Create and track interventions
- View department analytics
- Access alerts for advised students
- View predictive risk models

### Student
- View personal dashboard
- View GPA and attendance history
- See risk classification
- Receive personalized recommendations
- Access AI assistant queries

## Frontend Components Integration

### DashboardLayout with Auth
```tsx
export function DashboardLayout() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <Sidebar user={user} onLogout={logout} />
      <main>
        <Outlet /> {/* Routes render here */}
      </main>
    </div>
  );
}
```

### Dashboard Page with Real Data
```tsx
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analyticsService';

export default function DashboardPage() {
  const { data: kpi } = useQuery({
    queryKey: ['kpi'],
    queryFn: analyticsService.getKPI
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <KpiCard 
          title="Total Students" 
          value={kpi?.totalStudents || 0}
        />
        {/* More cards */}
      </div>
    </div>
  );
}
```

## Error Handling

### Global Error Handling
```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    },
    mutations: {
      onError: (error: any) => {
        toast.error(error.message || 'Something went wrong');
      }
    }
  }
});
```

### Service-Level Error Handling
```tsx
try {
  const response = await authService.login(email, password);
  // Handle success
} catch (error: any) {
  setError(error.message || 'Login failed');
}
```

## Testing the Integration

### Demo Credentials

Create these users in MongoDB or use the provided seed data:

**Admin**
- Email: admin@university.edu
- Password: password123
- Role: admin

**Faculty**
- Email: faculty@university.edu
- Password: password123
- Role: faculty
- Department: Computer Science

**Student**
- Email: student@university.edu
- Password: password123
- Role: student

### Manual Testing Checklist

- [ ] User can register new account
- [ ] User can login with credentials
- [ ] JWT token is stored in localStorage
- [ ] Protected routes redirect to login when not authenticated
- [ ] Dashboard loads with KPI data from backend
- [ ] Students list displays with backend data
- [ ] Can create/edit/delete students (admin only)
- [ ] Analytics display real data
- [ ] Risk alerts generate based on student data
- [ ] AI assistant processes queries correctly
- [ ] Faculty can create interventions
- [ ] Role-based features work correctly
- [ ] Logout clears token and redirects to login

## Deployment

### Backend Deployment (Heroku)
```bash
cd backend
heroku create your-app-name
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

Update frontend `.env` with production backend URL:
```
VITE_API_URL=https://your-app-name.herokuapp.com/api
```

### Frontend Deployment (Vercel)
```bash
npm run build
# Drag dist folder to Vercel, or:
vercel
```

## Troubleshooting

### Backend Connection Issues
- Ensure backend is running on port 5000
- Check CORS_ORIGIN matches frontend URL
- Verify MongoDB connection string

### Auth Issues
- Clear localStorage and try login again
- Check JWT_SECRET is set in .env
- Verify token format in Authorization header

### Data Not Loading
- Check network tab in browser DevTools
- Verify API endpoints in services match backend routes
- Check user has permission for requested resource

### MongoDB Issues
- Ensure MongoDB service is running
- Check connection string syntax
- Verify database name in connection string
- Check network access on MongoDB Atlas

## Next Steps

1. **Seed Database** - Create seed script with sample data
2. **Advanced Filtering** - Add more filter options to student list
3. **Export Reports** - Add CSV export functionality
4. **Notifications** - Implement real-time alerts with WebSockets
5. **File Upload** - Allow importing student data from CSV
6. **SMS/Email** - Send notifications to students/faculty
7. **Analytics Charts** - Add more detailed visualizations
8. **Mobile App** - React Native version

## Support

For issues or questions:
1. Check backend console for errors
2. Check browser DevTools Network tab
3. Review API response in Network tab
4. Check console for client-side errors
5. Verify .env configuration

## License

MIT License
