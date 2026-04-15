# 🚀 Doctor Appointment System - Deployment Guide

## Table of Contents
1. [Local Production Build](#1-local-production-build)
2. [Deploy to Render (Free)](#2-deploy-to-render-free)
3. [Deploy to Railway (Free)](#3-deploy-to-railway-free)
4. [Deploy to AWS](#4-deploy-to-aws)
5. [Deploy to Heroku](#5-deploy-to-heroku)

---

## 1. Local Production Build

### Step 1.1: Prepare Backend for Production

**A. Enable MySQL (Recommended for Production)**

1. Install MySQL on your system
2. Create database:
```sql
CREATE DATABASE doctorappointmentdb;
```

3. Update `backend/src/main/resources/application.properties`:
```properties
# Comment out H2, uncomment MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/doctorappointmentdb
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update
```

4. Uncomment MySQL dependency in `backend/pom.xml`:
```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

**B. Build Backend JAR**
```bash
cd backend
# If you have Maven installed:
mvn clean package -DskipTests

# Or use the JAR that's already built:
# backend/target/appointment-1.0.0.jar
```

### Step 1.2: Build Frontend for Production

```bash
cd frontend
npm install
npm run build
```

This creates a `frontend/dist` folder with optimized static files.

### Step 1.3: Run Production Build

**Backend:**
```bash
cd backend
java -jar target/appointment-1.0.0.jar
```

**Frontend:** Serve the `dist` folder using any static server:
```bash
cd frontend
npx serve -s dist -p 5173
```

---

## 2. Deploy to Render (Free) ⭐ RECOMMENDED

Render offers free hosting for both frontend and backend.

### Step 2.1: Prepare Your Code

1. **Push your code to GitHub** (if not already):
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/doctor-appointment.git
git push -u origin main
```

### Step 2.2: Deploy Backend on Render

1. Go to [render.com](https://render.com) and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `doctor-appointment-backend`
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Java`
   - **Build Command:** `./mvnw clean package -DskipTests`
   - **Start Command:** `java -jar target/appointment-1.0.0.jar`
   - **Instance Type:** `Free`

5. **Add Environment Variables:**
   - `SPRING_PROFILES_ACTIVE` = `prod`
   - `JWT_SECRET` = `YourSuperSecretKeyMinimum32CharactersLong123456`
   - `SPRING_DATASOURCE_URL` = (Render will provide PostgreSQL URL)
   - `SPRING_DATASOURCE_USERNAME` = (from Render PostgreSQL)
   - `SPRING_DATASOURCE_PASSWORD` = (from Render PostgreSQL)

6. Click **"Create Web Service"**

### Step 2.3: Add PostgreSQL Database (Free)

1. In Render Dashboard → **"New +"** → **"PostgreSQL"**
2. Name: `doctor-appointment-db`
3. Click **"Create Database"**
4. Copy the **Internal Database URL**
5. Go back to your backend service → **Environment** → Add:
   - `SPRING_DATASOURCE_URL` = (paste PostgreSQL URL)

### Step 2.4: Deploy Frontend on Render

1. **"New +"** → **"Static Site"**
2. Connect same GitHub repo
3. Configure:
   - **Name:** `doctor-appointment-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. **Add Environment Variable:**
   - `VITE_API_URL` = `https://doctor-appointment-backend.onrender.com`

5. Click **"Create Static Site"**

### Step 2.5: Update Frontend API URL

Update `frontend/src/api/axiosInstance.js` to use environment variable:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
```

---

## 3. Deploy to Railway (Free)

Railway offers $5 free credit monthly.

### Step 3.1: Deploy Backend

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Railway auto-detects Spring Boot
6. Add PostgreSQL:
   - Click **"+ New"** → **"Database"** → **"PostgreSQL"**
   - Railway auto-links it to your backend

### Step 3.2: Configure Backend

Add environment variables in Railway:
```
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=YourSuperSecretKeyMinimum32CharactersLong123456
```

### Step 3.3: Deploy Frontend

1. **"+ New"** → **"GitHub Repo"**
2. Select same repo
3. Configure:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npx serve -s dist`

4. Add environment variable:
```
VITE_API_URL=https://your-backend.railway.app
```

---

## 4. Deploy to AWS

### Option A: AWS Elastic Beanstalk (Easiest)

**Backend:**
1. Install AWS CLI and EB CLI
2. Package your app:
```bash
cd backend
mvn clean package -DskipTests
```
3. Deploy:
```bash
eb init -p java-17 doctor-appointment-backend
eb create doctor-appointment-env
eb deploy
```

**Frontend:**
1. Build frontend:
```bash
cd frontend
npm run build
```
2. Upload `dist` folder to **S3 bucket**
3. Enable **Static Website Hosting**
4. Use **CloudFront** for CDN (optional)

### Option B: AWS EC2 (Full Control)

1. Launch EC2 instance (Ubuntu 22.04)
2. SSH into instance
3. Install Java 17, Node.js, MySQL
4. Clone your repository
5. Build and run:
```bash
# Backend
cd backend
java -jar target/appointment-1.0.0.jar

# Frontend
cd frontend
npm install && npm run build
sudo npm install -g serve
serve -s dist -p 80
```

---

## 5. Deploy to Heroku

### Step 5.1: Install Heroku CLI
```bash
npm install -g heroku
heroku login
```

### Step 5.2: Deploy Backend

1. Create `Procfile` in `backend/`:
```
web: java -jar target/appointment-1.0.0.jar
```

2. Deploy:
```bash
cd backend
heroku create doctor-appointment-backend
heroku addons:create heroku-postgresql:mini
git subtree push --prefix backend heroku main
```

### Step 5.3: Deploy Frontend

1. Create `static.json` in `frontend/`:
```json
{
  "root": "dist",
  "clean_urls": true,
  "routes": {
    "/**": "index.html"
  }
}
```

2. Update `frontend/package.json`:
```json
"scripts": {
  "build": "vite build",
  "start": "serve -s dist -p $PORT"
}
```

3. Deploy:
```bash
cd frontend
heroku create doctor-appointment-frontend
heroku buildpacks:add heroku/nodejs
git subtree push --prefix frontend heroku main
```

---

## 📋 Pre-Deployment Checklist

### Backend
- [ ] Change JWT secret in production
- [ ] Switch from H2 to MySQL/PostgreSQL
- [ ] Set `spring.jpa.hibernate.ddl-auto=update` (not create-drop)
- [ ] Disable `spring.jpa.show-sql=true` in production
- [ ] Update CORS to allow only your frontend domain
- [ ] Remove H2 console in production
- [ ] Set proper logging levels

### Frontend
- [ ] Update API URL to production backend
- [ ] Build optimized production bundle (`npm run build`)
- [ ] Test all routes work with production API
- [ ] Enable HTTPS
- [ ] Add error boundaries

### Security
- [ ] Use strong JWT secret (min 32 characters)
- [ ] Enable HTTPS/SSL certificates
- [ ] Set secure CORS origins
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting (optional)

---

## 🎯 Quick Start: Deploy to Render (5 Minutes)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy Backend:**
   - Go to render.com → New Web Service
   - Connect GitHub → Select repo
   - Root: `backend`, Build: `./mvnw clean package -DskipTests`
   - Start: `java -jar target/appointment-1.0.0.jar`

3. **Add PostgreSQL:**
   - New → PostgreSQL → Copy URL
   - Add to backend environment variables

4. **Deploy Frontend:**
   - New → Static Site
   - Root: `frontend`, Build: `npm install && npm run build`
   - Publish: `dist`

5. **Done!** Your app is live 🎉

---

## 🆘 Troubleshooting

### Backend won't start
- Check Java version (needs 17+)
- Verify database connection
- Check logs for errors

### Frontend can't connect to backend
- Verify CORS settings in backend
- Check API URL in frontend
- Ensure backend is running

### Database errors
- Check connection string
- Verify credentials
- Ensure database exists

---

## 📞 Need Help?

- Check logs in your deployment platform
- Test locally first before deploying
- Verify all environment variables are set

Good luck with your deployment! 🚀
