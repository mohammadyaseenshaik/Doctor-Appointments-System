# 🏥 MedBook — Doctor Appointment System

A full-stack Doctor Appointment System built with **React 18** (frontend) and **Spring Boot 3** (backend), secured with **JWT authentication**.

---

## 📋 Quick Start

### Prerequisites
- ✅ **Node.js** (v18+) — for React frontend
- ✅ **Java 17+** — for Spring Boot backend
- ✅ **Maven 3.8+** — for building the backend ([Download Maven](https://maven.apache.org/download.cgi))

### 1. Start the Backend
```bash
cd backend
java -jar target\appointment-1.0.0.jar

```
Backend runs on: **http://localhost:8080**
H2 Console (database UI): **http://localhost:8080/h2-console**

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on: **http://localhost:5173**

### Or use the batch scripts (Windows):
- Double-click **`start-backend.bat`** → starts Spring Boot
- Double-click **`start-frontend.bat`** → starts React

---

## 🔐 Demo Credentials

| Role    | Email                   | Password   |
|---------|------------------------|------------|
| Admin   | admin@hospital.com     | admin123   |
| Patient | patient@example.com    | patient123 |

---

## 🏗️ Project Structure

```
hcl project/
├── backend/                          ← Spring Boot 3 Maven project
│   └── src/main/java/com/doctor/appointment/
│       ├── config/                   ← Security, CORS, DataInitializer
│       ├── controller/               ← AuthController, DoctorController, AppointmentController, PaymentController
│       ├── dto/                      ← ApiResponse, AuthRequest/Response, DoctorDTO, AppointmentDTO
│       ├── entity/                   ← User, Doctor, Appointment (JPA Entities)
│       ├── exception/                ← GlobalExceptionHandler, custom exceptions
│       ├── repository/               ← Spring Data JPA Repositories
│       ├── security/                 ← JwtUtil, JwtAuthFilter, UserDetailsServiceImpl
│       └── service/                  ← AuthService, DoctorService, AppointmentService, PaymentService
├── frontend/                         ← React 18 + Vite app
│   └── src/
│       ├── api/                      ← axiosInstance + API modules
│       ├── components/               ← Navbar, ProtectedRoute, DoctorCard, PaymentModal
│       ├── context/                  ← AuthContext (JWT state management)
│       └── pages/                    ← Login, Dashboard, DoctorsList, BookAppointment, AppointmentHistory, AdminDashboard
├── start-backend.bat                 ← Windows startup script (backend)
├── start-frontend.bat                ← Windows startup script (frontend)
└── README.md
```

---

## 🌐 API Endpoints

| Method | Endpoint                   | Auth     | Role    |
|--------|---------------------------|----------|---------|
| POST   | /auth/register            | No       | Public  |
| POST   | /auth/login               | No       | Public  |
| GET    | /doctors                  | No       | Public  |
| GET    | /doctors/{id}             | No       | Public  |
| POST   | /doctors                  | JWT      | ADMIN   |
| PUT    | /doctors/{id}             | JWT      | ADMIN   |
| DELETE | /doctors/{id}             | JWT      | ADMIN   |
| POST   | /appointments             | JWT      | PATIENT |
| GET    | /appointments/user/{id}   | JWT      | PATIENT |
| GET    | /appointments/admin       | JWT      | ADMIN   |
| PUT    | /appointments/{id}/status | JWT      | ADMIN   |
| POST   | /payments/simulate        | JWT      | PATIENT |

---

## 🔧 Technology Stack

### Backend
- **Spring Boot 3.2** — application framework
- **Spring Security 6** — JWT auth + role-based access
- **Spring Data JPA** — ORM / database layer
- **H2 (in-memory)** — development database (zero config)
- **JJWT 0.11.5** — JWT token generation/validation
- **Lombok** — boilerplate reduction

### Frontend
- **React 18** — UI framework
- **React Router 6** — client-side routing
- **Axios** — HTTP client with JWT interceptor
- **Bootstrap 5** + custom CSS — styling
- **React Hot Toast** — notifications
- **React Icons** — icon library
- **Vite** — build tool

---

## 📊 Database Tables

### Users
| Column   | Type    | Description          |
|----------|---------|---------------------|
| id       | BIGINT  | Primary key         |
| name     | VARCHAR | Full name           |
| email    | VARCHAR | Unique email        |
| password | VARCHAR | BCrypt hash         |
| role     | ENUM    | PATIENT or ADMIN    |

### Doctors
| Column         | Type    | Description              |
|----------------|---------|--------------------------|
| id             | BIGINT  | Primary key              |
| name           | VARCHAR | Doctor's name            |
| specialization | VARCHAR | Medical specialty        |
| experience     | INT     | Years of experience      |
| fee            | DOUBLE  | Consultation fee (INR)   |
| availableSlots | TEXT    | Comma-separated times     |
| available      | BOOLEAN | Is accepting appointments |

### Appointments
| Column        | Type     | Description                          |
|---------------|----------|--------------------------------------|
| id            | BIGINT   | Primary key                          |
| user_id       | BIGINT   | Foreign key → Users                  |
| doctor_id     | BIGINT   | Foreign key → Doctors                |
| date          | DATE     | Appointment date                     |
| time          | VARCHAR  | Time slot (e.g., "10:00")           |
| status        | ENUM     | PENDING/APPROVED/REJECTED/COMPLETED  |
| paymentStatus | ENUM     | PENDING/PAID/FAILED                   |
| notes         | TEXT     | Patient notes                        |

---

## 🔑 Key Features

### Patient Features
- 📝 Register / Login with JWT
- 🔍 Browse doctors by specialization
- 📅 Book appointments with date + time slot selection
- ✅ Availability check before booking (no double booking)
- 💳 Dummy payment simulation (80% success rate)
- 📋 View appointment history with status tracking

### Admin Features
- 🏥 Add / Edit / Delete doctors
- 📊 View ALL appointments from all patients
- ✅ Approve / Reject / Mark Complete appointments
- 🔧 Full system overview with stats

---

## 🐛 Switching to MySQL

1. Uncomment MySQL dependency in `backend/pom.xml`
2. Update `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/doctor_appointment_db?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
   spring.jpa.hibernate.ddl-auto=update
   ```
3. Comment out H2 datasource properties
