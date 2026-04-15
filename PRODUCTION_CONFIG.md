# 🔧 Production Configuration Summary

## Files Created for Deployment

### Configuration Files
- ✅ `backend/src/main/resources/application-prod.properties` - Production settings
- ✅ `backend/Procfile` - Heroku deployment config
- ✅ `backend/system.properties` - Java version specification
- ✅ `frontend/static.json` - Static site routing config
- ✅ `.gitignore` - Ignore build artifacts and secrets

### Environment Templates
- ✅ `backend/.env.example` - Backend environment variables template
- ✅ `frontend/.env.example` - Frontend environment variables template

### Documentation
- ✅ `DEPLOYMENT_GUIDE.md` - Complete deployment guide (all platforms)
- ✅ `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist
- ✅ `QUICK_DEPLOY.md` - 5-minute quick start guide
- ✅ `PRODUCTION_CONFIG.md` - This file

### Scripts
- ✅ `prepare-deployment.bat` - Automated build script

---

## Code Changes Made

### 1. Frontend API Configuration
**File:** `frontend/src/api/axiosInstance.js`

Changed from:
```javascript
baseURL: 'http://localhost:8080'
```

To:
```javascript
baseURL: import.meta.env.VITE_API_URL || 'https://doctor-appointmentbackend.onrender.com'
```

**Why:** Allows dynamic API URL based on environment

---

### 2. Backend CORS Configuration
**File:** `backend/src/main/java/com/doctor/appointment/config/CorsConfig.java`

Added:
```java
@Value("${cors.allowed.origins:http://localhost:5173,http://localhost:3000}")
private String allowedOrigins;
```

**Why:** Allows configuring allowed origins via environment variable

---

### 3. Backend Dependencies
**File:** `backend/pom.xml`

Added:
```xml
<!-- PostgreSQL for cloud deployment -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- MySQL for traditional hosting -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

**Why:** Support for production databases

---

## Environment Variables Required

### Backend (Production)

| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `SPRING_PROFILES_ACTIVE` | `prod` | ✅ Yes | Activates production profile |
| `DATABASE_URL` | `jdbc:postgresql://host:5432/db` | ✅ Yes | Database connection string |
| `DB_USERNAME` | `postgres` | ✅ Yes | Database username |
| `DB_PASSWORD` | `secret123` | ✅ Yes | Database password |
| `JWT_SECRET` | `Min32CharactersLong...` | ✅ Yes | JWT signing key (32+ chars) |
| `PORT` | `8080` | ⚠️ Auto | Server port (set by platform) |
| `CORS_ALLOWED_ORIGINS` | `https://myapp.com` | ⚠️ Recommended | Frontend URL |

### Frontend (Production)

| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `VITE_API_URL` | `https://api.myapp.com` | ✅ Yes | Backend API URL |

---

## Database Configuration

### Development (H2 - In-Memory)
```properties
spring.datasource.url=jdbc:h2:mem:doctordb
spring.jpa.hibernate.ddl-auto=create-drop
```
- ✅ Zero configuration
- ✅ Fast startup
- ⚠️ Data lost on restart

### Production (PostgreSQL - Recommended)
```properties
spring.datasource.url=jdbc:postgresql://host:5432/doctorappointmentdb
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
```
- ✅ Persistent data
- ✅ Free tier on Render/Railway
- ✅ Production-ready

### Production (MySQL - Alternative)
```properties
spring.datasource.url=jdbc:mysql://host:3306/doctorappointmentdb
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
```
- ✅ Persistent data
- ✅ Widely supported
- ⚠️ May require paid hosting

---

## Security Checklist

### ✅ Completed
- [x] JWT secret uses environment variable
- [x] Database credentials use environment variables
- [x] CORS configured for specific origins
- [x] H2 console disabled in production
- [x] SQL logging disabled in production
- [x] HTTPS enforced (by hosting platform)

### 🔒 Recommended (Post-Deployment)
- [ ] Change default admin password
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Enable CSRF protection (if using cookies)
- [ ] Set up monitoring/logging
- [ ] Configure backup strategy
- [ ] Add health check endpoints

---

## Deployment Platforms Comparison

| Feature | Render | Railway | Heroku | AWS |
|---------|--------|---------|--------|-----|
| **Free Tier** | ✅ Yes | ✅ $5/mo credit | ❌ No | ⚠️ Limited |
| **Auto-Deploy** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ Manual |
| **Database** | ✅ PostgreSQL | ✅ PostgreSQL | ✅ PostgreSQL | ⚠️ RDS (paid) |
| **Setup Time** | 5 min | 3 min | 5 min | 30+ min |
| **Sleep Mode** | ⚠️ Yes (15 min) | ❌ No | ⚠️ Yes | ❌ No |
| **Custom Domain** | ✅ Free | ✅ Free | ✅ Free | ✅ Free |
| **Best For** | Beginners | Developers | Enterprise | Scale |

---

## Build Commands Reference

### Backend Build
```bash
# Using Maven Wrapper (recommended)
./mvnw clean package -DskipTests

# Using Maven (if installed)
mvn clean package -DskipTests

# Output: backend/target/appointment-1.0.0.jar
```

### Frontend Build
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Output: frontend/dist/
```

### Test Locally
```bash
# Backend
java -jar backend/target/appointment-1.0.0.jar

# Frontend
cd frontend
npx serve -s dist -p 5173
```

---

## Port Configuration

### Development
- Frontend: `5173` (Vite default)
- Backend: `8080` (Spring Boot default)

### Production
- Frontend: Handled by platform (usually 80/443)
- Backend: `$PORT` environment variable (set by platform)

**Important:** Always use `$PORT` in production:
```bash
java -Dserver.port=$PORT -jar app.jar
```

---

## Database Migration Strategy

### First Deployment
```properties
spring.jpa.hibernate.ddl-auto=create
```
- Creates all tables
- Seeds demo data (via DataInitializer)

### Subsequent Deployments
```properties
spring.jpa.hibernate.ddl-auto=update
```
- Updates schema without data loss
- Adds new columns/tables
- ⚠️ Doesn't remove columns

### Production Best Practice
```properties
spring.jpa.hibernate.ddl-auto=validate
```
- Only validates schema
- Use Flyway/Liquibase for migrations
- Full control over schema changes

---

## Monitoring & Logs

### View Logs

**Render:**
```
Dashboard → Your Service → Logs tab
```

**Railway:**
```
Dashboard → Your Service → Deployments → View Logs
```

**Heroku:**
```bash
heroku logs --tail -a your-app-name
```

### Common Log Patterns

**Successful Startup:**
```
Started DoctorAppointmentApplication in X seconds
Tomcat started on port 8080
```

**Database Connection:**
```
HikariPool-1 - Starting...
HikariPool-1 - Start completed
```

**Errors to Watch:**
```
java.sql.SQLException - Database connection failed
java.lang.OutOfMemoryError - Increase memory
BindException: Address already in use - Port conflict
```

---

## Performance Optimization

### Backend
- ✅ Connection pooling (HikariCP - enabled by default)
- ✅ JPA query optimization
- ⚠️ Add caching (Redis) for high traffic
- ⚠️ Enable compression

### Frontend
- ✅ Production build (minified, tree-shaken)
- ✅ Code splitting (React lazy loading)
- ⚠️ Add CDN for static assets
- ⚠️ Enable gzip compression

---

## Cost Estimation

### Free Tier (Render)
- Backend: Free (with sleep mode)
- Frontend: Free
- Database: Free for 90 days, then $7/month
- **Total: $0-7/month**

### Railway
- Backend + Frontend + Database: ~$5/month
- **Total: $5/month** (covered by free credit)

### AWS (Minimal)
- EC2 t2.micro: $8/month
- RDS db.t2.micro: $15/month
- S3 + CloudFront: $1/month
- **Total: ~$24/month**

---

## Next Steps After Deployment

1. ✅ Test all features thoroughly
2. ✅ Change default admin password
3. ✅ Set up custom domain (optional)
4. ✅ Configure SSL certificate (auto on Render/Railway)
5. ✅ Set up monitoring/alerts
6. ✅ Create backup strategy
7. ✅ Document API endpoints
8. ✅ Add analytics (Google Analytics, etc.)
9. ✅ Implement email notifications
10. ✅ Add more features!

---

## Support & Resources

- **Render Docs:** https://render.com/docs
- **Railway Docs:** https://docs.railway.app
- **Spring Boot Docs:** https://spring.io/projects/spring-boot
- **Vite Docs:** https://vitejs.dev

---

## Quick Reference Commands

```bash
# Build everything
prepare-deployment.bat

# Push to GitHub
git add .
git commit -m "Deploy"
git push origin main

# Test backend locally
java -jar backend/target/appointment-1.0.0.jar

# Test frontend locally
cd frontend && npx serve -s dist

# View logs (Heroku)
heroku logs --tail

# Restart service (Heroku)
heroku restart
```

---

Your project is now production-ready! 🚀

Follow **QUICK_DEPLOY.md** for fastest deployment.
