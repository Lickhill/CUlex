# Culex - Technical README

## Technical Architecture Overview

Culex is a full-stack marketplace application built with modern web technologies, designed for university communities to facilitate classified advertisements.

### Tech Stack Summary
```
Frontend: React 19 + Vite 7 + Tailwind CSS 4
Backend:  Spring Boot 3.5 + Java 24 + MongoDB
Auth:     JWT + Spring Security
Build:    Maven (Backend) + npm (Frontend)
CI/CD:    GitHub Actions
```

## Project Structure

```
culex/
├── src/main/java/com/culex/culex/          # Backend Java source
│   ├── config/                             # Configuration classes
│   │   └── SecurityConfig.java             # Security & CORS config
│   ├── controller/                         # REST Controllers
│   │   ├── AdController.java               # Advertisement endpoints
│   │   ├── AuthController.java             # Authentication endpoints
│   │   └── TestController.java             # Health check endpoint
│   ├── dto/                                # Data Transfer Objects
│   │   ├── AuthResponse.java               # Authentication response
│   │   ├── LoginRequest.java               # Login request payload
│   │   └── RegisterRequest.java            # Registration request payload
│   ├── exception/                          # Exception handling
│   │   └── GlobalExceptionHandler.java     # Global exception handler
│   ├── model/                              # Database entities
│   │   ├── Ad.java                         # Advertisement model
│   │   └── User.java                       # User model
│   ├── repository/                         # Data access layer
│   │   ├── AdRepository.java               # Advertisement repository
│   │   └── UserRepository.java             # User repository
│   ├── service/                            # Business logic layer
│   │   ├── AdService.java                  # Advertisement service
│   │   └── AuthService.java                # Authentication service
│   └── util/                               # Utility classes
│       └── JwtUtil.java                    # JWT token utilities
├── src/main/resources/
│   └── application.properties              # Spring configuration
├── culex-frontend/                         # Frontend React application
│   ├── src/
│   │   ├── components/                     # React components
│   │   │   ├── Dashboard.jsx               # Main dashboard view
│   │   │   ├── Login.jsx                   # Login form
│   │   │   ├── Register.jsx                # Registration form
│   │   │   └── MyAds.jsx                   # User's advertisements
│   │   ├── App.jsx                         # Main app component
│   │   ├── main.jsx                        # Application entry point
│   │   └── index.css                       # Global styles
│   ├── package.json                        # Frontend dependencies
│   └── vite.config.js                      # Vite configuration
├── pom.xml                                 # Maven configuration
├── README.md                               # Basic setup instructions
└── PROJECT_REPORT.md                       # Comprehensive project report
```

## Database Schema

### MongoDB Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required, bcrypt hashed),
  phoneNumber: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

#### Ads Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String (required),
  address: String (required),
  phoneNumber: String (required),
  userId: String (required, email of creator),
  createdAt: Date
}
```

### Indexing Strategy
```javascript
// Recommended indexes for production
db.users.createIndex({ "email": 1 }, { unique: true })
db.ads.createIndex({ "userId": 1 })
db.ads.createIndex({ "createdAt": -1 })
db.ads.createIndex({ "name": "text", "description": "text" })
```

## API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | User registration | ❌ |
| POST | `/api/auth/login` | User login | ❌ |

### Advertisement Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/ads` | Get all advertisements | ❌ |
| GET | `/api/ads/my-ads` | Get user's advertisements | ✅ |
| POST | `/api/ads` | Create new advertisement | ✅ |
| DELETE | `/api/ads/{id}` | Delete advertisement | ✅ |

### Health Check
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/test` | Backend health check | ❌ |

## Security Implementation

### JWT Configuration
```properties
# application.properties
jwt.secret=${JWT_SECRET:fallback_secret_for_development}
jwt.expiration=86400000  # 24 hours in milliseconds
```

### Password Security
- **Algorithm**: BCrypt with default salt rounds (10)
- **Strength**: Minimum 8 characters (enforced on frontend)
- **Storage**: Only hashed passwords stored in database

### CORS Configuration
```java
// Development CORS settings
.setAllowedOriginPatterns(Arrays.asList(
    "http://localhost:*",
    "http://127.0.0.1:*"
));
```

### Route Protection
```java
// Public endpoints
.requestMatchers("/api/auth/**", "/api/test", "/api/ads").permitAll()
// Protected endpoints
.anyRequest().authenticated()
```

## Frontend Architecture

### Component Hierarchy
```
App
├── Router
    ├── Dashboard (/)
    │   ├── Header (with navigation)
    │   ├── AdForm (conditional)
    │   └── AdList
    ├── Login (/login)
    ├── Register (/register)
    └── MyAds (/myads)
        ├── Header (with navigation)
        └── UserAdsList
```

### State Management
- **Local State**: React useState hooks for component state
- **Authentication**: localStorage for token persistence
- **Form State**: Controlled components with validation

### Routing Configuration
```javascript
// React Router routes
/          → Dashboard (public + authenticated view)
/login     → Login (redirect to / if authenticated)
/register  → Register (redirect to / if authenticated)
/myads     → MyAds (requires authentication)
```

## Development Workflow

### Backend Development
```bash
# Run with hot reload
./mvnw spring-boot:run

# Run tests
./mvnw test

# Build for production
./mvnw clean package -DskipTests
```

### Frontend Development
```bash
# Install dependencies
npm ci

# Development server with hot reload
npm run dev

# Lint code
npm run lint

# Build for production
npm run build
```

### Environment Variables

#### Backend (.env or system environment)
```bash
JWT_SECRET=your_super_long_secure_secret_key_64_characters_minimum
SPRING_DATA_MONGODB_URI=mongodb://localhost:27017/culex_db
SPRING_PROFILES_ACTIVE=development
```

#### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:8080
```

## Testing Strategy

### Backend Testing
```java
// Unit tests for services
@ExtendWith(MockitoExtension.class)
class AdServiceTest {
    @Mock
    private AdRepository adRepository;
    
    @InjectMocks
    private AdService adService;
    
    @Test
    void shouldCreateAd() {
        // Test implementation
    }
}

// Integration tests for controllers
@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class AdControllerIntegrationTest {
    @Test
    void shouldCreateAdWithValidToken() {
        // Test implementation
    }
}
```

### Frontend Testing
```javascript
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

test('should render login form', () => {
  render(
    <BrowserRouter>
      <Login setIsAuthenticated={jest.fn()} />
    </BrowserRouter>
  );
  
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});
```

## Performance Optimization

### Backend Optimizations
```java
// Connection pooling
spring.data.mongodb.connection-pool.max-size=50
spring.data.mongodb.connection-pool.min-size=5

// Caching (future implementation)
@Cacheable("advertisements")
public List<Ad> getAllAds() {
    return adRepository.findAll();
}
```

### Frontend Optimizations
```javascript
// Code splitting
const MyAds = lazy(() => import('./components/MyAds'));

// Memoization for expensive calculations
const memoizedAdList = useMemo(() => {
  return ads.filter(ad => ad.name.includes(searchTerm));
}, [ads, searchTerm]);
```

### Build Optimizations
```javascript
// Vite configuration
export default defineConfig({
  build: {
    target: 'es2015',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
});
```

## Deployment Configurations

### Docker Setup
```dockerfile
# Multi-stage build for frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY culex-frontend/package*.json ./
RUN npm ci
COPY culex-frontend/ ./
RUN npm run build

# Backend with frontend assets
FROM openjdk:21-jdk-slim
COPY target/culex-*.jar app.jar
COPY --from=frontend-build /app/frontend/dist /static
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Production Environment
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - SPRING_DATA_MONGODB_URI=mongodb://mongo:27017/culex_db
    depends_on:
      - mongo

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongo:
        image: mongo:7
        ports: ['27017:27017']
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '21'
      
      - name: Backend tests
        env:
          JWT_SECRET: test_secret_key_64_characters_minimum_length_required
        run: ./mvnw clean verify
      
      - name: Frontend tests
        working-directory: culex-frontend
        run: |
          npm ci
          npm run build
```

## Monitoring and Logging

### Application Logging
```properties
# Logging configuration
logging.level.com.culex=INFO
logging.level.org.springframework.security=DEBUG
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
logging.file.name=logs/culex-application.log

# Audit logging
logging.level.org.springframework.web=DEBUG
```

### Health Monitoring
```java
// Custom health indicator
@Component
public class DatabaseHealthIndicator implements HealthIndicator {
    @Autowired
    private MongoTemplate mongoTemplate;
    
    @Override
    public Health health() {
        try {
            mongoTemplate.getDb().runCommand(new Document("ping", 1));
            return Health.up()
                .withDetail("database", "MongoDB connection successful")
                .build();
        } catch (Exception e) {
            return Health.down()
                .withDetail("database", "MongoDB connection failed")
                .withException(e)
                .build();
        }
    }
}
```

## Troubleshooting Guide

### Common Issues

#### Backend Issues
```bash
# MongoDB connection issues
Error: Unable to connect to MongoDB at localhost:27017
Solution: Ensure MongoDB is running and accessible

# JWT secret issues
Error: JWT secret key must be at least 64 characters
Solution: Set JWT_SECRET environment variable

# Port already in use
Error: Port 8080 is already in use
Solution: Kill process using port or change server.port in application.properties
```

#### Frontend Issues
```bash
# CORS errors
Error: CORS policy blocks request
Solution: Check backend CORS configuration in SecurityConfig.java

# Build failures
Error: Module not found
Solution: Run npm ci to install dependencies

# API connection issues
Error: Network Error or timeout
Solution: Verify backend is running on correct port
```

### Development Tips

#### Backend Development
```java
// Enable debug logging for development
logging.level.com.culex=DEBUG
logging.level.org.springframework.web=DEBUG

// Hot reload with DevTools (add to pom.xml)
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

#### Frontend Development
```javascript
// Debug API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
});

// Request interceptor for debugging
api.interceptors.request.use(request => {
  console.log('Starting Request:', request);
  return request;
});
```

## Code Quality Standards

### Backend Code Style
```java
// Follow Spring Boot conventions
@RestController
@RequestMapping("/api/ads")
@CrossOrigin(origins = {"http://localhost:5173"})
public class AdController {
    
    @Autowired
    private AdService adService;
    
    // Use ResponseEntity for all endpoints
    @GetMapping
    public ResponseEntity<List<Ad>> getAllAds() {
        List<Ad> ads = adService.getAllAds();
        return ResponseEntity.ok(ads);
    }
}
```

### Frontend Code Style
```javascript
// Use functional components with hooks
const Dashboard = ({ isAuthenticated, setIsAuthenticated }) => {
  const [ads, setAds] = useState([]);
  
  useEffect(() => {
    fetchAllAds();
  }, []);
  
  const fetchAllAds = async () => {
    try {
      const response = await axios.get('/api/ads');
      setAds(response.data);
    } catch (error) {
      console.error('Failed to fetch ads:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Component JSX */}
    </div>
  );
};
```

## Performance Benchmarks

### Target Metrics
- **Page Load Time**: < 2 seconds (first contentful paint)
- **API Response Time**: < 300ms (95th percentile)
- **Database Query Time**: < 100ms (average)
- **Bundle Size**: < 300KB (gzipped)

### Monitoring Tools
- **Backend**: Spring Boot Actuator endpoints
- **Frontend**: Lighthouse performance audits
- **Database**: MongoDB Compass profiling
- **Network**: Browser DevTools network tab

---

**Last Updated**: August 25, 2025  
**Version**: 1.0
