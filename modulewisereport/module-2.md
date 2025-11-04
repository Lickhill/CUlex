# Module 2: Technical Architecture and Environment

## 2.1 Technology Stack
### Backend
- Framework: Spring Boot 3.5.4
- Language: Java 24
- Database: MongoDB (NoSQL)
- Authentication: JWT
- Security: Spring Security
- Build Tool: Maven 3.9.11
- API Style: REST

### Frontend
- Framework: React 19.1.1
- Build Tool: Vite 7.1.0
- Styling: Tailwind CSS 4.1.11
- HTTP Client: Axios 1.11.0
- Routing: React Router DOM 7.8.0
- Language: JavaScript (ES6+)

### Tooling
- Code Quality: ESLint 9.32.0
- Package Manager: npm
- CI/CD: GitHub Actions

## 2.2 Development Environment
- Java 21+ (Java 24 used)
- Node.js 22.12+
- MongoDB 7+
- Maven 3.9+ (wrapper provided)

### Setup Steps (Summary)
- Backend: set JWT_SECRET, run mvnw spring-boot:run
- Frontend: npm ci, optional .env with VITE_API_BASE_URL, npm run dev

### Development URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- MongoDB: mongodb://localhost:27017/culex_db

## 2.3 Security Implementation
- BCrypt password hashing
- JWT HS512 with configurable secret and 24h expiry
- CORS for development origins
- Input validation via Spring Validation
- Stateless session management
- Endpoint access rules: permit /api/auth/**, /api/test, GET /api/ads; others require auth

## 2.4 Deployment Overview
- Backend Dockerfile (OpenJDK 21, run jar)
- Frontend Dockerfile (Node build -> Nginx serve)
- Production env vars for JWT, MongoDB URI, profiles
- CI/CD builds and artifacts for backend and frontend
