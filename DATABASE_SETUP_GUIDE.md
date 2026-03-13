# 🗄️ Database Configuration Guide

## Current Status

Your system is **already working** with mock data! ✅
- Backend: Running on port 5000
- Frontend: Running on port 8080/8081
- Authentication: ✅ Working
- API Endpoints: ✅ Working
- Database: Mock mode (in-memory data)

## Why Mock Data?

MongoDB wasn't installed locally, so the backend automatically switched to **mock data mode**. This is perfect for:
- ✅ Development and testing
- ✅ Prototyping
- ✅ No setup required
- ✅ No external dependencies

---

## 🎯 Choose Your Database Setup

### Option 1: Use Mock Data (CURRENT - No Setup Needed) ⭐

**Status:** Already running and working!

**Pros:**
- No installation required
- Works immediately
- Perfect for development
- No connection issues
- Fast testing

**Cons:**
- Data resets on server restart
- Limited to demo data
- Can't store persistent data
- Good for dev only

**To Use:** 
Just keep running `npm run dev:all` - it works as-is!

---

### Option 2: Use MongoDB Atlas (Cloud Database) 🌐

**Best for:** Production-ready setup, cloud deployment

**Steps:**

1. **Create MongoDB Atlas Account**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up (free tier available)

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "Shared" (free tier)
   - Select region (closest to you)
   - Wait for deployment (~5 min)

3. **Get Connection String**
   - Click "Connect" button
   - Select "Drivers"
   - Copy connection string (looks like: `mongodb+srv://username:password@cluster0.xxx.mongodb.net/...`)

4. **Add to `.env` File**
   ```
   MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxx.mongodb.net/academic-compass
   USE_MOCK_DATA=false
   ```

5. **Allow Network Access**
   - In MongoDB Atlas, go to Network Access
   - Add IP address: 0.0.0.0/0 (allows all - for dev only!)
   - Or add your specific IP

6. **Restart Backend**
   ```bash
   npm run dev:all
   ```

---

### Option 3: Install Local MongoDB 💻

**Best for:** Offline development, faster response times

**Windows Installation:**

1. **Download MongoDB**
   - Visit: https://www.mongodb.com/try/download/community
   - Download Windows installer
   - Run installer
   - Choose "Complete" setup
   - Keep defaults
   - MongoDB will install as a service

2. **Verify Installation**
   ```bash
   mongod --version
   ```
   Should show version number (e.g., db version v6.0.0)

3. **Start MongoDB Service**
   
   **Option A: Windows Services (Recommended)**
   - Press `Win + R`
   - Type: `services.msc`
   - Find "MongoDB Server"
   - Right-click → "Start"
   - Set to "Automatic" for auto-start

   **Option B: Manual Start**
   ```bash
   mongod
   ```

4. **Update `.env` File**
   ```
   MONGO_URI=mongodb://localhost:27017/academic-compass
   USE_MOCK_DATA=false
   ```

5. **Verify Connection**
   ```bash
   mongosh
   ```
   Type: `show databases` → Should list databases

6. **Restart Backend**
   ```bash
   npm run dev:all
   ```

---

## 📋 Quick Decision Matrix

| Need | Recommendation | Setup Time |
|------|---|---|
| Just testing/demo | Mock Data ✅ (Current) | 0 min |
| Local development | Local MongoDB | 15 min |
| Production ready | MongoDB Atlas | 10 min |
| Team collaboration | MongoDB Atlas | 10 min |

---

## ✅ Current Setup (Mock Data)

**You don't need to do anything!** The system is working perfectly with mock data.

**Demo Account:**
```
Email: student@university.edu
Password: password123
```

**What Works:**
- ✅ Login/Registration
- ✅ Dashboard
- ✅ Student management
- ✅ Analytics
- ✅ All API endpoints

**Limitation:**
- Data is temporary (resets on restart)
- Good for testing only

---

## 🔄 To Switch to Real Database

### If You Want to Add MongoDB:

1. **Choose Option 2 or 3** above

2. **Update `.env`**
   ```env
   MONGO_URI=<your-connection-string>
   USE_MOCK_DATA=false
   ```

3. **Restart Backend**
   ```bash
   npm run dev:all
   ```

4. **Seed Database (First Time Only)**
   ```bash
   cd backend
   npm run seed
   ```

---

## 🆘 Troubleshooting

### Backend Still Showing Connection Error

**This is NORMAL!** Mock mode automatically activates. You can:

1. **Keep using mock data** (recommended for now)
   - System works fine
   - No errors except DB warning
   - Perfect for development

2. **Want real database?** Follow Option 2 or 3 above

### MongoDB Connection Refused (Local)

```
Error: connect ECONNREFUSED ::1:27017
```

**Solution:**
- MongoDB service not running
- Start it: `mongod` or via Windows Services
- Verify: `mongosh` command works

### MongoDB Atlas Connection Failed

```
Error: connect ENOTFOUND cluster0.xxx.mongodb.net
```

**Solutions:**
1. Check internet connection
2. Verify credentials in connection string (username:password)
3. Add your IP to MongoDB Atlas Network Access
4. Check cluster is running (not paused)

---

## 📊 Data Persistence

### With Mock Data (Current)
```
🔴 NO persistence - data resets on restart
⚡ Fast - everything in memory
📝 Good for: Testing, development, demos
```

### With Local MongoDB
```
🟢 PERSISTENT - data saved to disk
💾 Also fast - local connection
📝 Good for: Development, local testing
```

### With MongoDB Atlas
```
🟢 PERSISTENT - data saved in cloud
🌍 Global access - accessible anywhere
📝 Good for: Production, team collaboration
```

---

## 🎯 Recommended Setup

For your development:

1. **Now:** Use mock data (already working) ✅
   
2. **Later:** Add MongoDB Atlas (when deploying)
   - Create free account
   - 10 minutes to set up
   - Supports millions of operations

3. **Production:** Use MongoDB Atlas
   - Cloud-based, highly reliable
   - Automatic backups
   - 99.99% uptime SLA

---

## 🚀 Next Steps

### If Happy with Mock Data
Nothing to do! Just run:
```bash
npm run dev:all
```

### If Want Real Database
1. Choose Option 2 or 3 above
2. Update `.env` with connection string
3. Restart: `npm run dev:all`

### If Want Both (Dev + Cloud)
1. Set up MongoDB Atlas
2. Update `.env` with Atlas connection
3. Run seed: `npm run seed`
4. Switch `USE_MOCK_DATA=false`

---

## 📞 Connection Strings Reference

### Local MongoDB
```
mongodb://localhost:27017/academic-compass
```

### MongoDB Atlas
```
mongodb+srv://username:password@cluster0.xxx.mongodb.net/academic-compass
```

### Atlas with Compass (GUI Tool)
```
mongodb+srv://username:password@cluster0.xxx.mongodb.net/
```

---

## ✨ Bottom Line

**Your system is already fully functional!** 

- ✅ No action required right now
- ✅ Login and testing works perfectly  
- ✅ All features available with mock data
- ✅ Real database is optional

**To see your application:**
```bash
npm run dev:all
```

Then visit: http://localhost:8080

**That's it!** 🎉

---

*Last Updated: March 13, 2026*
