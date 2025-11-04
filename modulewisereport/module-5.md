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
