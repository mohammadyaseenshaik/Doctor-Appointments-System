# 🚀 Quick Deploy Guide (5 Minutes)

## Choose Your Platform

### Option 1: Render (Recommended - Free Forever)
✅ Free tier available  
✅ Auto-deploys from GitHub  
✅ Free PostgreSQL database  
✅ Easy setup  

### Option 2: Railway (Free $5/month credit)
✅ Very fast deployment  
✅ Auto-detects everything  
✅ Great developer experience  

### Option 3: Heroku (Paid after free tier)
⚠️ No longer has free tier  
✅ Most mature platform  

---

## 🎯 Deploy to Render (Step by Step)

### Prerequisites
- GitHub account
- Your code pushed to GitHub

### Step 1: Prepare Your Code (2 minutes)

Run this script to build everything:
```bash
prepare-deployment.bat
```

Or manually:
```bash
# Build backend
cd backend
mvnw clean package -DskipTests

# Build frontend
cd ../frontend
npm install
npm run build
```

### Step 2: Push to GitHub (1 minute)

```bash
git init
git add .
git commit -m "Initial deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/doctor-appointment.git
git push -u origin main
```

### Step 3: Deploy Backend on Render (2 minutes)

1. Go to **https://render.com** → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your repository
4. Fill in:
   ```
   Name: doctor-appointment-backend
   Root Directory: backend
   Build Command: ./mvnw clean package -DskipTests
   Start Command: java -Dserver.port=$PORT -jar target/appointment-1.0.0.jar
   ```
5. Add environment variables:
   ```
   SPRING_PROFILES_ACTIVE=prod
   JWT_SECRET=ChangeThisToYourOwnSecretKeyMinimum32Characters123
   ```
6. Click **"Create Web Service"**
7. **Copy your backend URL** (e.g., `https://doctor-appointment-backend.onrender.com`)

### Step 4: Add Database (1 minute)

1. In Render → **"New +"** → **"PostgreSQL"**
2. Name: `doctor-appointment-db`
3. Click **"Create Database"**
4. Copy the **"Internal Database URL"**
5. Go to backend service → **"Environment"** → Add:
   ```
   DATABASE_URL=<paste the URL here>
   ```

### Step 5: Deploy Frontend (2 minutes)

1. **"New +"** → **"Static Site"**
2. Same repository
3. Fill in:
   ```
   Name: doctor-appointment-frontend
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```
4. Add environment variable:
   ```
   VITE_API_URL=https://doctor-appointment-backend.onrender.com
   ```
   (Use YOUR backend URL from Step 3)
5. Click **"Create Static Site"**

### Step 6: Update CORS (30 seconds)

1. Go to backend service → **"Environment"**
2. Add:
   ```
   CORS_ALLOWED_ORIGINS=https://doctor-appointment-frontend.onrender.com
   ```
   (Use YOUR frontend URL)

### Step 7: Test! 🎉

Open your frontend URL and test:
- Register a new user
- Login with: `admin@hospital.com` / `admin123`
- Book an appointment
- Check admin dashboard

---

## 🎯 Deploy to Railway (Even Faster!)

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy Everything (2 minutes)

1. Go to **https://railway.app** → Sign up
2. **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway auto-detects Spring Boot!
5. Click **"+ New"** → **"Database"** → **"PostgreSQL"**
6. Railway auto-connects it!

### Step 3: Add Environment Variables

Click on backend service → **"Variables"**:
```
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=ChangeThisToYourOwnSecretKeyMinimum32Characters123
```

Click on frontend service → **"Variables"**:
```
VITE_API_URL=https://your-backend.railway.app
```

### Done! 🚀

Railway gives you URLs automatically.

---

## 📋 Environment Variables Reference

### Backend
```bash
# Required
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:postgresql://host:5432/dbname
JWT_SECRET=YourSecretKeyMinimum32CharactersLong

# Optional
PORT=8080
CORS_ALLOWED_ORIGINS=https://your-frontend.com
```

### Frontend
```bash
# Required
VITE_API_URL=https://your-backend.com
```

---

## 🆘 Troubleshooting

### Backend won't start
- Check logs in Render/Railway dashboard
- Verify `DATABASE_URL` is set
- Ensure `JWT_SECRET` is at least 32 characters

### Frontend can't connect
- Check `VITE_API_URL` is correct
- Update `CORS_ALLOWED_ORIGINS` in backend
- Open browser console for errors

### Database errors
- Verify database is created
- Check connection string format
- Ensure backend and database are in same region

---

## 🎓 What Happens During Deployment?

### Backend
1. Render/Railway runs Maven build
2. Creates JAR file
3. Starts Spring Boot on port from `$PORT`
4. Connects to PostgreSQL database
5. Creates tables automatically
6. Seeds demo data

### Frontend
1. Runs `npm install`
2. Runs `npm run build` (creates optimized bundle)
3. Serves static files from `dist/` folder
4. Connects to backend API

---

## 📊 Free Tier Limits

### Render
- ✅ 750 hours/month (enough for 1 app 24/7)
- ✅ Free PostgreSQL (90 days, then $7/month)
- ⚠️ Sleeps after 15 min inactivity (wakes in ~30 sec)

### Railway
- ✅ $5 free credit/month
- ✅ ~500 hours of uptime
- ✅ No sleep mode

---

## 🚀 You're Live!

Your app is now deployed and accessible worldwide!

**Share your URLs:**
- Frontend: `https://your-app.onrender.com`
- Backend API: `https://your-api.onrender.com`

**Demo Credentials:**
- Admin: `admin@hospital.com` / `admin123`
- Patient: `patient@example.com` / `patient123`

---

## 📚 More Resources

- Full guide: `DEPLOYMENT_GUIDE.md`
- Checklist: `DEPLOYMENT_CHECKLIST.md`
- Render docs: https://render.com/docs
- Railway docs: https://docs.railway.app

Good luck! 🎉
