# ✅ Deployment Checklist

## Before You Deploy

### 1. Code Preparation
- [ ] All code is committed to Git
- [ ] `.gitignore` is properly configured
- [ ] No sensitive data (passwords, API keys) in code
- [ ] All tests pass locally

### 2. Backend Configuration
- [ ] MySQL/PostgreSQL dependency added to `pom.xml`
- [ ] Production profile created (`application-prod.properties`)
- [ ] CORS origins updated for production domain
- [ ] JWT secret will be set via environment variable
- [ ] Database connection will use environment variables
- [ ] `spring.jpa.hibernate.ddl-auto` set to `update` (not `create-drop`)
- [ ] H2 console disabled in production
- [ ] Logging levels appropriate for production

### 3. Frontend Configuration
- [ ] API URL uses environment variable (`VITE_API_URL`)
- [ ] Production build tested (`npm run build`)
- [ ] All routes work correctly
- [ ] Error handling in place

### 4. Database
- [ ] Database schema is finalized
- [ ] Migration strategy planned (if needed)
- [ ] Backup strategy in place

---

## Deployment Steps (Render - Recommended)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/doctor-appointment.git
git push -u origin main
```

### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 3: Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Select your repository
3. Configure:
   - **Name:** `doctor-appointment-backend`
   - **Region:** Choose closest region
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Java`
   - **Build Command:** `./mvnw clean package -DskipTests`
   - **Start Command:** `java -Dserver.port=$PORT -jar target/appointment-1.0.0.jar`
   - **Instance Type:** `Free`

4. Click **"Advanced"** and add environment variables:
   ```
   SPRING_PROFILES_ACTIVE=prod
   JWT_SECRET=YourSuperSecretKeyMinimum32CharactersLongChangeThis123456
   CORS_ALLOWED_ORIGINS=https://your-frontend-url.onrender.com
   ```

5. Click **"Create Web Service"**
6. Wait for deployment (5-10 minutes first time)
7. Copy your backend URL (e.g., `https://doctor-appointment-backend.onrender.com`)

### Step 4: Add PostgreSQL Database
1. In Render Dashboard → **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name:** `doctor-appointment-db`
   - **Database:** `doctorappointmentdb`
   - **User:** `doctoruser`
   - **Region:** Same as backend
   - **Instance Type:** `Free`

3. Click **"Create Database"**
4. Once created, go to **"Info"** tab
5. Copy **"Internal Database URL"**
6. Go to your backend service → **"Environment"** tab
7. Add these variables:
   ```
   DATABASE_URL=<paste Internal Database URL>
   DB_USERNAME=doctoruser
   DB_PASSWORD=<from database info>
   ```

8. Backend will auto-redeploy with database connection

### Step 5: Deploy Frontend
1. Click **"New +"** → **"Static Site"**
2. Select same repository
3. Configure:
   - **Name:** `doctor-appointment-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. Add environment variable:
   ```
   VITE_API_URL=https://doctor-appointment-backend.onrender.com
   ```

5. Click **"Create Static Site"**
6. Wait for deployment (3-5 minutes)

### Step 6: Update CORS
1. Go back to backend service → **"Environment"**
2. Update `CORS_ALLOWED_ORIGINS`:
   ```
   CORS_ALLOWED_ORIGINS=https://doctor-appointment-frontend.onrender.com
   ```
3. Backend will redeploy

### Step 7: Test Your Deployment
1. Open your frontend URL
2. Try to register a new user
3. Login with demo credentials:
   - Admin: `admin@hospital.com` / `admin123`
   - Patient: `patient@example.com` / `patient123`
4. Test booking an appointment
5. Test admin dashboard

---

## Post-Deployment

### Verify Everything Works
- [ ] Frontend loads without errors
- [ ] Can register new users
- [ ] Can login
- [ ] Can view doctors list
- [ ] Can book appointments
- [ ] Admin can manage appointments
- [ ] Payment simulation works

### Monitor
- [ ] Check Render logs for errors
- [ ] Monitor database usage
- [ ] Check API response times

### Optional Improvements
- [ ] Add custom domain
- [ ] Enable HTTPS (Render does this automatically)
- [ ] Set up monitoring/alerts
- [ ] Add analytics
- [ ] Implement email notifications
- [ ] Add rate limiting

---

## Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify all environment variables are set
- Check database connection string
- Ensure Java 17 is specified in `system.properties`

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Open browser console for errors
- Verify backend is running

### Database connection errors
- Check `DATABASE_URL` format
- Verify database credentials
- Ensure database is in same region as backend
- Check if database is running

### 401 Unauthorized errors
- Check JWT secret is set
- Verify token is being sent in requests
- Check token expiration time

---

## Alternative: Quick Deploy with Railway

If Render doesn't work, try Railway:

1. Go to https://railway.app
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway auto-detects Spring Boot and React
6. Add PostgreSQL: **"+ New"** → **"Database"** → **"PostgreSQL"**
7. Set environment variables (same as Render)
8. Done!

---

## Need Help?

Common issues:
- **Build fails:** Check Java version, Maven dependencies
- **Database errors:** Verify connection string format
- **CORS errors:** Update allowed origins
- **Port errors:** Use `$PORT` environment variable

Your app should be live! 🎉

Backend: `https://your-backend.onrender.com`
Frontend: `https://your-frontend.onrender.com`
