# Culex Module-wise Project Report (Combined)

This single Markdown file consolidates all five module reports.

- Module 1: Project Overview and Goals
- Module 2: Technical Architecture and Environment
- Module 3: Features and API Documentation
- Module 4: Development Plan, Testing, and Performance
- Module 5: Security, Deployment, Risks, and Maintenance

---

# Module 1: Project Overview and Goals

## 1.1 Project Overview
- Name: Culex Marketplace
- Description: A full-stack marketplace application inspired by OLX for university communities, enabling classified advertisements within the university ecosystem.

## 1.2 Target Users
- University students
- Faculty members
- University staff

## 1.3 Project Goals
- Create a secure, user-friendly marketplace platform
- Enable students to buy/sell items within their university community
- Provide JWT-based authentication and authorization
- Implement a modern, responsive user interface
- Ensure scalable architecture for future enhancements

## 1.4 System Diagram
```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   React SPA     │◄───────────────►│   Spring Boot   │
│   (Port 5173)   │                 │   (Port 8080)   │
└─────────────────┘                 └─────────────────┘
                                            │
                                            │ MongoDB Driver
                                            ▼
                                    ┌─────────────────┐
                                    │    MongoDB      │
                                    │   (Port 27017)  │
                                    └─────────────────┘
```

## 1.5 Current Status Summary
- Core auth, ads CRUD, and UI flows are implemented
- Security hardened with JWT, BCrypt, and stateless sessions
- Clear roadmap for image upload, search, messaging, and deployment

---

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

---

# Module 3: Features and API Documentation

## 3.1 Current Implementation Status
### Completed
- Authentication & Authorization: register, login, JWT, BCrypt, protected routes
- Advertisement Management: create, list all, list my ads, delete
- UI: responsive, navigation with auth state, validation, loading states
- Security: CORS, JWT validation, stateless sessions, Spring Validation, authorization checks

### In Progress
- Enhanced error handling
- User profile management
- Search and filtering

### Pending
- Image upload
- Categories/tags
- Real-time messaging
- Email notifications
- Admin panel
- Mobile app

## 3.2 API Documentation
### Base
- Development: http://localhost:8080

### Auth
- Register: POST /api/auth/register
- Login: POST /api/auth/login

Example Register Request
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

Example Register Success Response
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "message": "User registered successfully"
}
```

Example Login Request
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Example Login Success Response
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "message": "Login successful"
}
```

### Advertisements
- Get All: GET /api/ads
- Get My Ads: GET /api/ads/my-ads (Bearer token)
- Create: POST /api/ads (Bearer token)
- Delete: DELETE /api/ads/{adId} (Bearer token)

Example Ad Object
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "iPhone 13",
  "description": "Excellent condition iPhone 13 for sale",
  "address": "123 University Ave",
  "phoneNumber": "+1234567890",
  "userId": "user@example.com",
  "createdAt": "2024-01-15T10:30:00"
}
```

### Error Response Shape
```json
{
  "message": "Error description",
  "status": 400,
  "timestamp": "2024-01-15T10:30:00"
}
```

---

# Module 4: Development Plan, Testing, and Performance

## 4.1 Development Plan
### Phase 1 (Weeks 1-2)
- Image Upload System (backend validation, frontend preview, storage)
- Enhanced Error Handling (global handler, user-friendly messages)
- Search and Filter (backend search, frontend UI, DB text indexes)

### Phase 2 (Weeks 3-4)
- Real-time Messaging (WebSocket, chat UI, persistence)
- Email Notifications (SendGrid/SES, messages, expiry reminders)
- Advanced Search (location, price, sort)

### Phase 3 (Weeks 5-6)
- Production Deployment (Docker, cloud, env configs)
- Admin Panel (user mgmt, moderation, analytics)
- Performance Optimization (indexes, Redis cache, CDN)

### Phase 4 (Weeks 7-8)
- Analytics & Reporting
- Multi-tenancy Support

## 4.2 Testing Strategy
- Backend: JUnit 5, Mockito, Testcontainers; unit and integration tests
- Frontend: Jest, React Testing Library; E2E with Cypress/Playwright
- API Testing: Postman/Newman, RestAssured

Example Backend Tests
```java
@ExtendWith(MockitoExtension.class)
class AdServiceTest {
    // Service layer tests
}

@SpringBootTest
@Testcontainers
class AdControllerIntegrationTest {
    // Full context tests
}
```

Example Frontend Test
```javascript
import { render, screen } from '@testing-library/react';

test('renders advertisement card', () => {
  render(<AdCard ad={mockAd} />);
  expect(screen.getByText('iPhone 13')).toBeInTheDocument();
});
```

## 4.3 Performance Considerations
- Bottlenecks: missing indexes, no image optimization/CDN, no caching, bundle size

### Optimizations
- DB Indexes: text, userId, createdAt; unique email on users
- Frontend: code splitting, image optimization (lazy, query params)
- Caching: Spring Cache for frequent reads

### Metrics
- Page Load < 3s
- API < 500ms
- Query < 100ms
- Bundle < 500KB gzipped

---

# Module 5: Security, Deployment, Risks, and Maintenance

## 5.1 Security Implementation
- Password Encryption: BCrypt with salt rounds
- JWT: HS512, 24-hour expiry, secret-managed
- CORS: development origins allowed
- Validation: Spring Validation for inputs
- Session: Stateless JWT
- Access Rules: public /api/auth/**, /api/test, GET /api/ads; others secured

### Auth Flow
1. POST /api/auth/login with credentials
2. Validate against MongoDB
3. Issue JWT with email as subject
4. Return token (24h)
5. Client stores token (localStorage)
6. Send Authorization: Bearer <token>

## 5.2 Deployment Guide
### Requirements
- Linux server, OpenJDK 21+, MongoDB 7+
- Reverse proxy (Nginx/Apache), SSL (Let’s Encrypt)

### Docker
Backend Dockerfile
```dockerfile
FROM openjdk:21-jdk-slim
COPY target/culex-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

Frontend Dockerfile
```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

### Production Environment Variables
```bash
JWT_SECRET=<64+ char secret>
SPRING_DATA_MONGODB_URI=mongodb://username:password@host:port/database
SPRING_PROFILES_ACTIVE=production
VITE_API_BASE_URL=https://api.yoursite.com
```

## 5.3 Risk Assessment
- MongoDB Connection: medium probability, high impact → pooling, retries
- JWT Security: low probability, high impact → secret mgmt, rotation
- File Upload Vulnerabilities: medium probability → validation, scanning
- Performance Degradation: high probability → monitoring, caching, optimization

## 5.4 Monitoring and Maintenance
### Logging
```properties
logging.level.com.culex=DEBUG
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
logging.file.name=logs/culex-application.log
```

### Health Checks
```java
@Component
public class CustomHealthIndicator implements HealthIndicator {
    @Override
    public Health health() {
        // Database connectivity check
        // External service availability
        return Health.up().build();
    }
}
```

### Metrics
- User: registrations, active users, retention
- Application: response times, error rates
- Business: ads created, engagement

---

Document Version: 1.0
Last Updated: August 25, 2025
Next Review: September 25, 2025
