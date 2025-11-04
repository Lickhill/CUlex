# Culex Marketplace - Project Report & Development Plan

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [Current Implementation Status](#current-implementation-status)
4. [API Documentation](#api-documentation)
5. [Development Environment](#development-environment)
6. [Security Implementation](#security-implementation)
7. [Development Plan](#development-plan)
8. [Deployment Guide](#deployment-guide)
9. [Testing Strategy](#testing-strategy)
10. [Performance Considerations](#performance-considerations)

---

## Project Overview

### Project Name: Culex
**Description**: A full-stack marketplace application inspired by OLX for university students, enabling classified advertisements within the university community.

### Project Goals
- Create a secure, user-friendly marketplace platform
- Enable students to buy/sell items within their university community
- Provide JWT-based authentication and authorization
- Implement a modern, responsive user interface
- Ensure scalable architecture for future enhancements

### Target Users
- University students
- Faculty members
- University staff

---

## Technical Architecture

### Architecture Pattern
**Monolithic Full-Stack Application** with clear separation between frontend and backend services.

### Technology Stack

#### Backend
- **Framework**: Spring Boot 3.5.4
- **Language**: Java 24
- **Database**: MongoDB (NoSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Spring Security
- **Build Tool**: Maven 3.9.11
- **API Style**: RESTful APIs

#### Frontend
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.0
- **Styling**: Tailwind CSS 4.1.11
- **HTTP Client**: Axios 1.11.0
- **Routing**: React Router DOM 7.8.0
- **Language**: JavaScript (ES6+)

#### Development Tools
- **Code Quality**: ESLint 9.32.0
- **Package Manager**: npm
- **Version Control**: Git
- **CI/CD**: GitHub Actions

### System Architecture Diagram
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

---

## Current Implementation Status

### ✅ Completed Features

#### Authentication & Authorization
- User registration with email, password, first name, last name, and optional phone number
- User login with email and password
- JWT token-based authentication
- Secure password hashing using BCrypt
- Protected routes and API endpoints

#### Advertisement Management
- Create new advertisements (authenticated users only)
- View all public advertisements
- View user's own advertisements (`/myads` page)
- Delete user's own advertisements
- Advertisement fields: name, description, address, phone number, creator email

#### User Interface
- Responsive design with Tailwind CSS
- Modern, clean interface
- Navigation with authenticated/unauthenticated states
- Form validation and error handling
- Loading states and user feedback

#### Security Features
- CORS configuration for development
- JWT token validation
- Stateless session management
- Input validation using Spring Validation
- Authorization checks for advertisement operations

### 🔄 In Progress Features
- Enhanced error handling
- User profile management
- Search and filtering capabilities

### ❌ Pending Features
- Image upload for advertisements
- Categories and tags
- Real-time messaging between users
- Email notifications
- Admin panel
- Mobile application

---

## API Documentation

### Base URL
- **Development**: `http://localhost:8080`
- **Production**: TBD

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890" // Optional
}
```

**Response (Success - 200)**:
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "message": "User registered successfully"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (Success - 200)**:
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "message": "Login successful"
}
```

### Advertisement Endpoints

#### Get All Advertisements
```http
GET /api/ads
```

**Response (Success - 200)**:
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "iPhone 13",
    "description": "Excellent condition iPhone 13 for sale",
    "address": "123 University Ave",
    "phoneNumber": "+1234567890",
    "userId": "user@example.com",
    "createdAt": "2024-01-15T10:30:00"
  }
]
```

#### Get User's Advertisements
```http
GET /api/ads/my-ads
Authorization: Bearer <JWT_TOKEN>
```

#### Create Advertisement
```http
POST /api/ads
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Textbook - Computer Science",
  "description": "CS101 textbook in good condition",
  "address": "Campus Bookstore",
  "phoneNumber": "+1234567890"
}
```

#### Delete Advertisement
```http
DELETE /api/ads/{adId}
Authorization: Bearer <JWT_TOKEN>
```

### Error Responses
```json
{
  "message": "Error description",
  "status": 400,
  "timestamp": "2024-01-15T10:30:00"
}
```

---

## Development Environment

### Prerequisites
- **Java**: 21+ (Java 24 currently used)
- **Node.js**: 22.12+ (see `.nvmrc`)
- **MongoDB**: 7+ running on `mongodb://localhost:27017`
- **Maven**: 3.9+ (included via wrapper)

### Environment Setup

#### Backend Setup
1. **Set JWT Secret** (minimum 64 characters):
   ```bash
   # Windows PowerShell
   $env:JWT_SECRET = "your_super_long_secure_secret_key_that_is_at_least_64_characters_long"
   
   # Linux/macOS
   export JWT_SECRET="your_super_long_secure_secret_key_that_is_at_least_64_characters_long"
   ```

2. **Run Backend**:
   ```bash
   # Linux/macOS
   ./mvnw spring-boot:run
   
   # Windows
   mvnw.cmd spring-boot:run
   ```

#### Frontend Setup
1. **Navigate to frontend directory**:
   ```bash
   cd culex-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm ci
   ```

3. **Optional - Create environment file**:
   ```bash
   # culex-frontend/.env
   VITE_API_BASE_URL=http://localhost:8080
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

### Development URLs
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:8080`
- **MongoDB**: `mongodb://localhost:27017/culex_db`

---

## Security Implementation

### Authentication Flow
1. User submits credentials to `/api/auth/login`
2. Backend validates credentials against MongoDB
3. JWT token generated with user email as subject
4. Token returned to client with 24-hour expiration
5. Client stores token in localStorage
6. Subsequent requests include `Authorization: Bearer <token>` header

### Security Features
- **Password Encryption**: BCrypt with salt rounds
- **JWT Security**: HS512 algorithm with configurable secret
- **CORS Protection**: Configured for development origins
- **Input Validation**: Spring Validation annotations
- **SQL Injection Prevention**: MongoDB NoSQL (BSON) queries
- **Session Management**: Stateless JWT approach

### Security Configuration
```java
// SecurityConfig.java highlights
- CSRF disabled for API usage
- Stateless session management
- Permit all: /api/auth/**, /api/test, /api/ads (GET)
- Require authentication: All other endpoints
```

---

## Development Plan

### Phase 1: Core Enhancements (Weeks 1-2)
#### Priority: HIGH
- [ ] **Image Upload System**
  - Backend: File upload endpoint with validation
  - Frontend: Image preview and upload component
  - Storage: Local filesystem or cloud storage integration

- [ ] **Enhanced Error Handling**
  - Global exception handler improvements
  - User-friendly error messages
  - Network error handling in frontend

- [ ] **Search and Filter System**
  - Backend: Search by name, description, location
  - Frontend: Search bar and filter controls
  - Database: Text indexing for performance

#### Priority: MEDIUM
- [ ] **User Profile Management**
  - View/edit user profile
  - Change password functionality
  - Profile picture upload

- [ ] **Advertisement Categories**
  - Category model and CRUD operations
  - Frontend category selection
  - Filter by category functionality

### Phase 2: Advanced Features (Weeks 3-4)
#### Priority: HIGH
- [ ] **Real-time Messaging**
  - WebSocket implementation
  - Chat interface between buyers/sellers
  - Message history persistence

- [ ] **Email Notifications**
  - Email service integration (SendGrid/SES)
  - New message notifications
  - Advertisement expiry reminders

#### Priority: MEDIUM
- [ ] **Advanced Search**
  - Location-based search
  - Price range filtering
  - Sort by date, price, relevance

- [ ] **User Reviews and Ratings**
  - User rating system
  - Review submission and display
  - Trust score calculation

### Phase 3: Scalability & Production (Weeks 5-6)
#### Priority: HIGH
- [ ] **Production Deployment**
  - Docker containerization
  - Cloud deployment (AWS/GCP/Azure)
  - Environment-specific configurations

- [ ] **Admin Panel**
  - User management interface
  - Advertisement moderation
  - Analytics dashboard

#### Priority: MEDIUM
- [ ] **Performance Optimization**
  - Database indexing strategy
  - Caching implementation (Redis)
  - CDN for static assets

- [ ] **Mobile Application**
  - React Native development
  - Cross-platform compatibility
  - Push notifications

### Phase 4: Enterprise Features (Weeks 7-8)
- [ ] **Analytics and Reporting**
  - User engagement metrics
  - Advertisement performance tracking
  - Revenue analytics (if monetized)

- [ ] **Multi-tenancy Support**
  - Multiple university support
  - Organization-based isolation
  - Custom branding per institution

---

## Deployment Guide

### Production Environment Requirements
- **Server**: Linux-based server (Ubuntu 20.04+ recommended)
- **Java Runtime**: OpenJDK 21+
- **Database**: MongoDB 7+ (Atlas or self-hosted)
- **Reverse Proxy**: Nginx or Apache
- **SSL Certificate**: Let's Encrypt or commercial

### Docker Deployment
```dockerfile
# Backend Dockerfile
FROM openjdk:21-jdk-slim
COPY target/culex-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

```dockerfile
# Frontend Dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

### Environment Variables (Production)
```bash
# Backend
JWT_SECRET=<64+ character secure secret>
SPRING_DATA_MONGODB_URI=mongodb://username:password@host:port/database
SPRING_PROFILES_ACTIVE=production

# Frontend
VITE_API_BASE_URL=https://api.yoursite.com
```

### CI/CD Pipeline
Current GitHub Actions workflow:
- Automated testing on push/PR
- MongoDB service for integration tests
- Separate build jobs for backend and frontend
- Artifact generation for deployment

---

## Testing Strategy

### Current Testing Coverage
- **Backend**: Basic Spring Boot test structure
- **Frontend**: ESLint configuration for code quality

### Recommended Testing Approach

#### Backend Testing
```java
// Unit Tests
@ExtendWith(MockitoExtension.class)
class AdServiceTest {
    // Service layer testing
}

// Integration Tests
@SpringBootTest
@Testcontainers
class AdControllerIntegrationTest {
    // Full application context testing
}
```

#### Frontend Testing
```javascript
// Component Tests (Jest + React Testing Library)
import { render, screen } from '@testing-library/react';

test('renders advertisement card', () => {
  render(<AdCard ad={mockAd} />);
  expect(screen.getByText('iPhone 13')).toBeInTheDocument();
});

// E2E Tests (Cypress or Playwright)
describe('Advertisement Flow', () => {
  it('should create and view advertisement', () => {
    // User journey testing
  });
});
```

### Testing Tools to Implement
- **Backend**: JUnit 5, Mockito, Testcontainers
- **Frontend**: Jest, React Testing Library, Cypress/Playwright
- **API Testing**: Postman/Newman, RestAssured

---

## Performance Considerations

### Current Bottlenecks
1. **Database Queries**: No indexing strategy implemented
2. **File Handling**: No image optimization or CDN
3. **Caching**: No caching mechanism in place
4. **Bundle Size**: Frontend bundle not optimized

### Optimization Strategies

#### Database Optimization
```javascript
// MongoDB Indexes
db.ads.createIndex({ "name": "text", "description": "text" })
db.ads.createIndex({ "userId": 1 })
db.ads.createIndex({ "createdAt": -1 })
db.users.createIndex({ "email": 1 }, { unique: true })
```

#### Frontend Optimization
```javascript
// Code splitting
const MyAds = lazy(() => import('./components/MyAds'));

// Image optimization
<img 
  src={`${imageUrl}?w=300&h=200&q=80`} 
  loading="lazy"
  alt="Advertisement"
/>
```

#### Caching Strategy
```java
// Spring Cache
@Cacheable("advertisements")
public List<Ad> getAllAds() {
    return adRepository.findAll();
}
```

### Performance Metrics to Monitor
- **Page Load Time**: < 3 seconds
- **API Response Time**: < 500ms
- **Database Query Time**: < 100ms
- **Bundle Size**: < 500KB gzipped

---

## Risk Assessment

### Technical Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| MongoDB Connection Issues | Medium | High | Connection pooling, retry logic |
| JWT Token Security | Low | High | Secure secret management, token rotation |
| File Upload Vulnerabilities | Medium | Medium | File type validation, virus scanning |
| Performance Degradation | High | Medium | Monitoring, caching, optimization |

### Business Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Low User Adoption | Medium | High | User research, MVP validation |
| Scalability Issues | Medium | High | Performance testing, scalable architecture |
| Security Breaches | Low | High | Security audits, penetration testing |

---

## Monitoring and Maintenance

### Logging Strategy
```properties
# application.properties
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

### Metrics to Track
- **User Metrics**: Registration rate, active users, retention
- **Application Metrics**: API response times, error rates
- **Business Metrics**: Advertisement creation rate, user engagement

---

## Conclusion

The Culex marketplace project demonstrates a solid foundation with modern technologies and best practices. The current implementation provides core functionality for a university marketplace, with a clear roadmap for scalability and feature enhancement.

### Key Strengths
- Modern, scalable technology stack
- Security-first approach with JWT authentication
- Clean separation of concerns between frontend and backend
- Responsive, user-friendly interface
- Comprehensive CI/CD pipeline

### Next Steps
1. **Immediate**: Implement image upload and enhanced search functionality
2. **Short-term**: Add real-time messaging and advanced user features
3. **Long-term**: Scale for multiple universities and mobile applications

### Success Metrics
- **Technical**: 99.9% uptime, <500ms API responses
- **User**: 80% user retention rate, 95% user satisfaction
- **Business**: 100+ daily active users, 50+ ads posted daily

---

**Document Version**: 1.0  
**Last Updated**: August 25, 2025  
**Next Review**: September 25, 2025
