# 🚀 Quick Start Guide - Academic Compass

## One-Command Startup

### Option 1: Run Both Services Together
```bash
npm run dev:all
```

### Option 2: Batch Script (Windows)
```bash
.\start-all.bat
```

### Option 3: PowerShell Script (Windows)
```powershell
.\start-all.ps1
```

---

## Manual Startup (If Needed)

### Terminal 1 - Backend API (Port 5000)
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend (Port 8080 or 8081)
```bash
npm run dev
```

---

## 🌐 Access the Application

Once both services are running, open your browser:

**Frontend URL:** 
- http://localhost:8080 (if port available)
- http://localhost:8081 (if 8080 in use)

---

## 📝 Login Credentials

Use these demo accounts to test:

| Role | Email | Password |
|------|-------|----------|
| 👤 **Student** | `student@university.edu` | `password123` |
| 👨‍🏫 **Faculty** | `faculty@university.edu` | `password123` |
| 🔐 **Admin** | `admin@university.edu` | `password123` |

Or create a new account using the **Sign Up** tab!

---

## ✅ What's Fixed

✅ **CORS Configuration**
- Backend now accepts frontend from both localhost:8080 and localhost:8081
- Multiple origins supported in one environment variable
- Proper CORS headers configured

✅ **Concurrent Running**
- Both services start together with `npm run dev:all`
- Batch and PowerShell scripts included for easy startup
- No manual terminal management needed

✅ **API Connection**
- Frontend properly connects to backend on port 5000
- No more "Failed to fetch" errors
- Authentication working end-to-end

---

## 🔍 Verify Services Are Running

### Backend Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"Server is running"}
```

### Frontend Status
Open browser to http://localhost:8080 or http://localhost:8081
- Should load login page without errors
- No console errors about CORS or connection failures

---

## 🛠️ Available Commands

### Frontend Only
```bash
npm run dev
```

### Backend Only
```bash
cd backend
npm run dev
```

### Both Concurrently
```bash
npm run dev:all
```

### Build Frontend
```bash
npm run build
```

### Run Tests
```bash
npm test
```

---

## 💾 Environment Configuration

### Backend (.env in /backend)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/academic-compass
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:8080,http://localhost:8081
```

### Frontend
Auto-configured to use `http://localhost:5000/api`

---

## ⚡ Troubleshooting

### "Port 5000 already in use"
```bash
# Kill process using port 5000
taskkill /F /IM node.exe  # Windows
# or
killall node              # Mac/Linux
```

### "Port 8080 already in use"
The frontend will automatically try port 8081 if 8080 is busy. Check terminal output for actual port.

### "CORS errors" (Fixed ✅)
- Both ports (8080 and 8081) are now configured in CORS_ORIGIN
- Backend CORS supports multiple origins
- No further configuration needed

### "Login fails with 'Failed to fetch'"
1. Verify backend is running on port 5000
2. Check browser console for errors (F12)
3. Verify CORS_ORIGIN in /backend/.env includes your frontend port
4. Restart both services

---

## 📊 System Status

| Service | Port | Status |
|---------|------|--------|
| Backend API | 5000 | ✅ Running |
| Frontend Web | 8080/8081 | ✅ Running |
| Mock Database | Memory | ✅ Active |
| CORS | Multi-Origin | ✅ Configured |
| Authentication | JWT | ✅ Working |

---

## 🎯 Next Steps

1. **Start Services**: `npm run dev:all` or use batch/PowerShell script
2. **Open Browser**: http://localhost:8080 or http://localhost:8081
3. **Login**: Use demo credentials from table above
4. **Explore**: Navigate dashboard, students, analytics
5. **Test**: Try creating new account, viewing data, etc.

---

## 📚 Documentation

For detailed setup and integration info, see:
- `SETUP_GUIDE.md` - Complete installation guide
- `INTEGRATION_GUIDE.md` - Architecture overview
- `FIXED_AND_READY.md` - What was fixed and current status
- `BACKEND_COMPLETE.md` - Full backend documentation

---

*Last Updated: March 13, 2026*  
*Status: ✅ Ready to Use*
