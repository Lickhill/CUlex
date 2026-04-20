# Culex - Full Stack Architecture & System Design Guide

## Table of Contents
1. [Installation & Setup](#installation--setup)
2. [Project Overview](#project-overview)
3. [Current Architecture](#current-architecture)
4. [Application Flow](#application-flow)
5. [System Design & Scalability](#system-design--scalability)
6. [Message Queuing Integration](#message-queuing-integration)
7. [CAP Theorem Implementation](#cap-theorem-implementation)
8. [Production Deployment](#production-deployment)

---

## Installation & Setup

### Prerequisites

Before setting up Culex, ensure you have the following installed:

#### 1. Java Development Kit (JDK)

**Minimum Version**: Java 17 (Java 21+ recommended)

**Windows:**
```powershell
# Download and install from: https://adoptium.net/
# Verify installation
java -version
```

**Linux/macOS:**
```bash
# Using Homebrew (macOS)
brew install openjdk@21

# Using apt (Ubuntu)
sudo apt-get install openjdk-21-jdk

# Verify
java -version
```

#### 2. Maven

**Installation:**

**Windows:**
- Download from: https://maven.apache.org/download.cgi
- Extract to `C:\Program Files\apache-maven-3.9.x`
- Add to PATH: `C:\Program Files\apache-maven-3.9.x\bin`

```powershell
# Verify
mvn -v
```

**Linux/macOS:**
```bash
# Using Homebrew
brew install maven

# Or download and extract
wget https://archive.apache.org/dist/maven/maven-3/3.9.11/binaries/apache-maven-3.9.11-bin.tar.gz
tar -xzf apache-maven-3.9.11-bin.tar.gz
mv apache-maven-3.9.11 /usr/local/maven

# Add to PATH in ~/.bashrc or ~/.zshrc
export PATH="/usr/local/maven/bin:$PATH"

# Verify
mvn -v
```

#### 3. MongoDB

**Docker (Recommended):**
```bash
# Pull and run MongoDB container
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7
```

**Local Installation:**

**Windows:**
- Download: https://www.mongodb.com/try/download/community
- Run installer and follow setup wizard
- MongoDB will run on `localhost:27017`

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
# Ubuntu
curl -fsSL https://pgp.mongodb.com/server-4.4.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**Verify MongoDB:**
```bash
# Should connect without errors
mongosh mongodb://localhost:27017 -u admin -p password
```

#### 4. Node.js & npm

**Minimum Version**: Node 20.19.0 (Node 22+ recommended)

**Download:** https://nodejs.org/

**Verify:**
```bash
node --version
npm --version
```

#### 5. Git

```bash
# Windows: Download from https://git-scm.com/download/win
# macOS: brew install git
# Linux: sudo apt-get install git

# Verify
git --version
```

#### 6. Docker (Optional but Recommended)

Download from: https://www.docker.com/products/docker-desktop

### Project Setup

#### Step 1: Clone the Repository

```bash
git clone https://github.com/Lickhill/CUlex.git
cd CUlex
```

#### Step 2: Backend Setup (Spring Boot)

**Navigate to backend directory:**
```bash
cd culex
```

**Set JWT Secret Environment Variable:**

**Windows PowerShell:**
```powershell
$env:JWT_SECRET = "mySecretKeyForJWTTokenSigningMustBeAtLeast64CharactersLongForHS512Algorithm1234567890"
```

**Windows CMD:**
```cmd
set JWT_SECRET=mySecretKeyForJWTTokenSigningMustBeAtLeast64CharactersLongForHS512Algorithm1234567890
```

**Linux/macOS Bash:**
```bash
export JWT_SECRET="mySecretKeyForJWTTokenSigningMustBeAtLeast64CharactersLongForHS512Algorithm1234567890"
```

**Update application.properties (if needed):**

Edit `src/main/resources/application.properties`:
```properties
spring.application.name=culex

# MongoDB Configuration
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=culex_db
# For Docker MongoDB: spring.data.mongodb.uri=mongodb://admin:password@localhost:27017/culex_db

# JWT Configuration
jwt.secret=${JWT_SECRET:mySecretKeyForJWTTokenSigningMustBeAtLeast64CharactersLongForHS512Algorithm1234567890}
jwt.expiration=86400000

# Server Configuration
server.port=8080
```

**Build Backend:**
```bash
# Using Maven wrapper (no Maven installation needed)
./mvnw clean compile
```

**Run Backend:**
```bash
# Windows CMD
mvnw.cmd spring-boot:run

# Windows PowerShell/Git Bash
./mvnw spring-boot:run

# Linux/macOS
./mvnw spring-boot:run
```

**Expected Output:**
```
Started CulexApplication in 2.687 seconds (process running for 2.966)
Tomcat started on port 8080 (http) with context path '/'
```

**Verify Backend is Running:**
```bash
# Test endpoint
curl http://localhost:8080/api/test
```

#### Step 3: Frontend Setup (React + Vite)

**Open new terminal and navigate to frontend:**
```bash
cd culex-frontend
```

**Install Dependencies:**
```bash
# Using npm
npm install

# Or using npm ci for clean install
npm ci
```

**Create Environment File (Optional):**

Create `culex-frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8080
```

**Run Frontend Development Server:**
```bash
npm run dev
```

**Expected Output:**
```
  VITE v7.1.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

**Access Application:**

Open browser and navigate to: `http://localhost:5173`

### Verify Full Installation

#### Checklist:

- [ ] Java is installed: `java -version` shows Java 17+
- [ ] Maven is installed: `mvnw -v` works
- [ ] MongoDB is running: Can connect via `mongosh`
- [ ] Node.js is installed: `node --version` and `npm --version` work
- [ ] Backend running at `http://localhost:8080`
- [ ] Frontend running at `http://localhost:5173`
- [ ] Can navigate to dashboard and see all ads
- [ ] Can register and login

#### Test Workflow:

1. **Register Account:**
   - Go to `http://localhost:5173/register`
   - Fill form with test data
   - Click Register

2. **Login:**
   - Navigate to Login page
   - Use registered credentials
   - Should see Dashboard

3. **Create Ad:**
   - Click "Post an Ad" button
   - Fill ad details
   - Click Submit
   - Should see ad in "Recent Listings"

4. **View My Ads:**
   - Click "My Ads" button
   - Should see only your created ads

5. **Profile Management:**
   - Click "Profile" link
   - Edit profile information
   - Change password (optional)
   - Click Save

### Troubleshooting

#### Issue: MongoDB Connection Error
```
Error: Failed to connect to MongoDB at localhost:27017
```

**Solutions:**
- Ensure MongoDB is running: `docker ps` should show MongoDB container
- Check connection string in `application.properties`
- Try restarting MongoDB: `docker restart mongodb`
- Verify port 27017 is not blocked by firewall

#### Issue: JWT Token Validation Error
```
JWT Token validation error: JWT signature does not match
```

**Solutions:**
- Ensure JWT_SECRET environment variable is set
- Restart the application after setting environment variable
- Clear browser localStorage and login again
- Verify secret is at least 64 characters

#### Issue: Backend Port Already in Use
```
error: Address already in use: bind
```

**Solutions:**
```bash
# Change port in application.properties
server.port=9090

# Or kill process using port 8080
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/macOS:
lsof -ti:8080 | xargs kill -9
```

#### Issue: Frontend Can't Connect to Backend
```
Failed to connect to http://localhost:8080
```

**Solutions:**
- Ensure backend is running on port 8080
- Check CORS settings in `SecurityConfig.java`
- Verify .env file has correct API_BASE_URL
- Check browser console for CORS errors

#### Issue: Node Modules Installation Error
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**
```bash
# Use npm legacy peer deps
npm install --legacy-peer-deps

# Or clear npm cache
npm cache clean --force
npm install
```

### Development Tools Setup (Optional)

#### IDE Setup

**IntelliJ IDEA (Recommended for Java):**
1. Download: https://www.jetbrains.com/idea/
2. Install
3. Open `culex` folder
4. Configure JDK: File → Project Structure → Project → Select JDK 21
5. Enable annotations processing: File → Settings → Build → Annotation Processors

**VS Code (For Frontend/Full Stack):**
1. Download: https://code.visualstudio.com/
2. Install extensions:
   - Extension Pack for Java
   - Spring Boot Extension Pack
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense

#### Database Tools

**MongoDB Compass (GUI):**
```bash
# Download from: https://www.mongodb.com/products/compass
# Or use Docker:
docker run -p 6273:6273 -d --name mongodb-compass mongodb/mongodb-compass
# Access at http://localhost:6273
```

**View Data:**
```bash
# Using mongosh CLI
mongosh mongodb://localhost:27017 -u admin -p password
use culex_db
db.users.find()
db.ads.find()
```

### Docker Compose Setup (All-in-One)

**Create `docker-compose.yml` in project root:**
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:7
    container_name: culex-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    networks:
      - culex-network

  backend:
    build:
      context: ./culex
      dockerfile: Dockerfile
    container_name: culex-backend
    environment:
      JWT_SECRET: mySecretKeyForJWTTokenSigningMustBeAtLeast64CharactersLongForHS512Algorithm1234567890
      SPRING_DATA_MONGODB_URI: mongodb://admin:password@mongodb:27017/culex_db
      SERVER_PORT: 8080
    ports:
      - "8080:8080"
    depends_on:
      - mongodb
    networks:
      - culex-network

  frontend:
    build:
      context: ./culex-frontend
      dockerfile: Dockerfile
    container_name: culex-frontend
    environment:
      VITE_API_BASE_URL: http://localhost:8080
    ports:
      - "5173:5173"
    depends_on:
      - backend
    networks:
      - culex-network

volumes:
  mongo_data:

networks:
  culex-network:
    driver: bridge
```

**Run Everything:**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Quick Start Commands Summary

```bash
# Terminal 1: Backend
cd culex
export JWT_SECRET="your_secret_key_here"
./mvnw spring-boot:run

# Terminal 2: Frontend
cd culex-frontend
npm install
npm run dev

# Access at: http://localhost:5173
```

---

---

## Project Overview

**Culex** is a university marketplace platform (similar to OLX) built with modern technologies for buying and selling items among students and faculty.

### Tech Stack
- **Backend**: Spring Boot 3.5.4 (Java 17+)
- **Database**: MongoDB (NoSQL)
- **Frontend**: React 19.1.1 with Vite 7.1.0
- **Authentication**: JWT with Spring Security + BCrypt
- **Styling**: Tailwind CSS
- **Build**: Maven 3.9.11

### Key Features
- User authentication (Register/Login)
- Create, read, update, delete advertisements
- User-specific ad management
- Profile management with password change
- CORS-enabled REST API

---

## Current Architecture

### Layered Architecture Pattern

```
┌─────────────────────────────────────────┐
│         Frontend (React + Vite)         │
│   - Dashboard (All Ads)                 │
│   - MyAds (User-specific)               │
│   - Profile Management                  │
│   - Authentication UI                   │
└────────────────┬────────────────────────┘
                 │ HTTP/REST
                 ▼
┌─────────────────────────────────────────┐
│     API Layer (AdController)            │
│     (AuthController)                    │
│   - Request/Response Handling           │
│   - JWT Authentication                  │
│   - CORS Management                     │
└────────────────┬────────────────────────┘
                 │ Service Calls
                 ▼
┌─────────────────────────────────────────┐
│    Business Logic Layer (AdService)     │
│    (AuthService)                        │
│   - Business Rules                      │
│   - Data Validation                     │
│   - Transaction Management              │
└────────────────┬────────────────────────┘
                 │ Repository Operations
                 ▼
┌─────────────────────────────────────────┐
│  Data Access Layer (AdRepository)       │
│  (UserRepository)                       │
│   - MongoDB Queries                     │
│   - CRUD Operations                     │
└────────────────┬────────────────────────┘
                 │ Database Driver
                 ▼
┌─────────────────────────────────────────┐
│          MongoDB Database               │
│  - Collections: ads, users              │
│  - Indexes for fast queries             │
└─────────────────────────────────────────┘
```

### Component Breakdown

| Component | Responsibility | Examples |
|-----------|----------------|----------|
| **Controller** | HTTP endpoints, request validation | AdController, AuthController |
| **Service** | Business logic, validations | AdService, AuthService |
| **Repository** | Database operations | AdRepository, UserRepository |
| **Model/Entity** | Data representation | Ad, User |
| **DTO** | Data transfer objects | AuthResponse, UpdateProfileRequest |
| **Util** | Helper functions | JwtUtil for token management |
| **Config** | Configuration beans | SecurityConfig, JwtAuthenticationFilter |

---

## Application Flow

### 1. User Registration Flow

```
Frontend (Register.jsx)
    │ POST /api/auth/register
    │ { email, password, firstName, lastName, phoneNumber }
    ▼
AuthController.register()
    │ Validates input
    ▼
AuthService.register()
    │ Hash password using BCrypt
    │ Check if user exists
    ▼
UserRepository.save()
    │ Stores user in MongoDB
    ▼
JwtUtil.generateToken()
    │ Creates JWT token
    ▼
AuthResponse { token, email, firstName, lastName }
    │ HTTP 200
    ▼
Frontend stores token in localStorage
Frontend redirects to Dashboard
```

### 2. Login Flow

```
Frontend (Login.jsx)
    │ POST /api/auth/login
    │ { email, password }
    ▼
AuthController.login()
    ▼
AuthService.login()
    │ Find user by email
    │ Compare passwords using BCryptPasswordEncoder
    ▼
JwtUtil.generateToken()
    ▼
AuthResponse with token
    │
Frontend stores token: localStorage.setItem('token', token)
```

### 3. Create Ad Flow (Authenticated)

```
Frontend (Dashboard.jsx)
    │ POST /api/ads
    │ Headers: { Authorization: "Bearer <JWT_TOKEN>" }
    │ Body: { name, description, address, phoneNumber }
    ▼
JwtAuthenticationFilter
    │ Extracts token from Authorization header
    │ Validates JWT signature
    │ Sets SecurityContext
    ▼
AdController.createAd()
    │ Receives JWT token
    ▼
JwtUtil.getEmailFromToken()
    │ Extracts user email from JWT
    ▼
Ad.setUserId(email)
    │ Associates ad with user
    ▼
AdService.createAd()
    │ Sets createdAt timestamp
    ▼
AdRepository.save()
    │ Stores in MongoDB
    ▼
HTTP 201 Created
Frontend updates UI with new ad
```

### 4. Get My Ads Flow

```
Frontend (MyAds.jsx)
    │ GET /api/ads/my-ads
    │ Headers: { Authorization: "Bearer <JWT_TOKEN>" }
    ▼
JwtAuthenticationFilter (validates token)
    ▼
AdController.getMyAds()
    │ Extract user email from JWT
    ▼
AdService.getAdsByUserId(email)
    ▼
AdRepository.findByUserId(email)
    │ MongoDB query: db.ads.find({ userId: email })
    ▼
Returns List<Ad> filtered by user
    ▼
Frontend renders user's ads with Edit/Delete options
```

### 5. Delete Ad Flow

```
Frontend (MyAds.jsx)
    │ DELETE /api/ads/{adId}
    │ Headers: { Authorization: "Bearer <JWT_TOKEN>" }
    ▼
JwtAuthenticationFilter (validates token)
    ▼
AdController.deleteAd(token, adId)
    │ Extract user email from JWT
    ▼
AdService.deleteAdByIdAndUserId(adId, email)
    │ Find ad by ID
    │ Verify userId matches current user
    │ If matches: delete ad
    │ If not: return false (ownership check)
    ▼
AdRepository.deleteById()
    ▼
HTTP 200 OK
Frontend removes ad from UI
```

### 6. Update Profile Flow

```
Frontend (Profile.jsx)
    │ PUT /api/profile
    │ Headers: { Authorization: "Bearer <JWT_TOKEN>" }
    │ Body: { firstName, lastName, phoneNumber, currentPassword, newPassword }
    ▼
AuthController.updateProfile()
    │ Extract email from JWT
    ▼
AuthService.updateProfile(email, request)
    │ Find user
    │ Validate current password
    │ Hash new password if provided
    │ Update fields
    ▼
UserRepository.save()
    ▼
AuthResponse { message: "Profile updated successfully" }
    ▼
Frontend updates localStorage with new user data
```

---

## System Design & Scalability

### Current Limitations
- **Single Database**: Single MongoDB instance (single point of failure)
- **No Caching**: Every request hits the database
- **Synchronous Processing**: All operations are blocking
- **No Load Balancing**: Single server instance
- **Monolithic**: All features in one application

### Scaling Strategy

#### Phase 1: Immediate Improvements (Horizontal Scaling)

```
┌──────────────┐         ┌──────────────┐
│   Culex      │         │   Culex      │
│  Instance 1  │         │  Instance 2  │
└──────┬───────┘         └──────┬───────┘
       │                        │
       └────────┬───────────────┘
                │
           ┌────▼─────┐
           │ Load      │
           │ Balancer  │
           │(Nginx)    │
           └────▼─────┘
                │
        ┌───────┴───────┐
        │               │
   ┌────▼────┐    ┌────▼────┐
   │ MongoDB  │    │  Cache  │
   │ Primary  │    │ Redis   │
   └─────────┘    └────────┘
```

**Implementation:**
```yaml
# docker-compose.yml for scaling
version: '3.8'
services:
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    
  app1:
    image: culex:latest
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - SPRING_DATA_MONGODB_URI=mongodb://mongo:27017/culex_db
    
  app2:
    image: culex:latest
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - SPRING_DATA_MONGODB_URI=mongodb://mongo:27017/culex_db
    
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

#### Phase 2: Caching Layer

Add Redis for caching frequently accessed data:

```java
// AdService.java with caching
@Service
public class AdService {
    @Autowired
    private AdRepository adRepository;
    
    @Autowired
    private RedisTemplate<String, List<Ad>> redisTemplate;
    
    private static final String CACHE_KEY_ALL_ADS = "all_ads";
    private static final long CACHE_TIMEOUT = 300; // 5 minutes
    
    public List<Ad> getAllAds() {
        // Try to get from cache
        List<Ad> cachedAds = redisTemplate.opsForValue()
            .get(CACHE_KEY_ALL_ADS);
        
        if (cachedAds != null) {
            return cachedAds;
        }
        
        // If not in cache, fetch from DB and cache it
        List<Ad> ads = adRepository.findAll();
        redisTemplate.opsForValue()
            .set(CACHE_KEY_ALL_ADS, ads, 
                 Duration.ofSeconds(CACHE_TIMEOUT));
        
        return ads;
    }
    
    public Ad createAd(Ad ad) {
        Ad savedAd = adRepository.save(ad);
        // Invalidate cache
        redisTemplate.delete(CACHE_KEY_ALL_ADS);
        return savedAd;
    }
}
```

#### Phase 3: Asynchronous Processing with Message Queues

---

## Message Queuing Integration

### Why Use Message Queues?

For operations that don't need immediate response:
- Email notifications
- Ad indexing for search
- Analytics/logging
- User activity tracking

### Option 1: RabbitMQ Integration

**Add Dependency to `pom.xml`:**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

**Configuration:**

```java
// RabbitMQConfig.java
@Configuration
public class RabbitMQConfig {
    
    public static final String AD_CREATED_QUEUE = "ad.created";
    public static final String AD_CREATED_EXCHANGE = "ad.exchange";
    public static final String AD_CREATED_ROUTING_KEY = "ad.created.key";
    
    @Bean
    public Queue adCreatedQueue() {
        return new Queue(AD_CREATED_QUEUE, true);
    }
    
    @Bean
    public Exchange adExchange() {
        return new TopicExchange(AD_CREATED_EXCHANGE, true, false);
    }
    
    @Bean
    public Binding binding(Queue adCreatedQueue, Exchange adExchange) {
        return BindingBuilder.bind(adCreatedQueue)
            .to(adExchange)
            .with(AD_CREATED_ROUTING_KEY);
    }
}
```

**Producer (Send message when ad is created):**

```java
// AdService.java
@Service
public class AdService {
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    public Ad createAd(Ad ad) {
        Ad savedAd = adRepository.save(ad);
        
        // Send async notification
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.AD_CREATED_EXCHANGE,
            RabbitMQConfig.AD_CREATED_ROUTING_KEY,
            new AdCreatedEvent(savedAd)
        );
        
        return savedAd;
    }
}
```

**Consumer (Listen for messages):**

```java
// AdNotificationService.java
@Service
public class AdNotificationService {
    
    @Autowired
    private EmailService emailService;
    
    @RabbitListener(queues = RabbitMQConfig.AD_CREATED_QUEUE)
    public void handleAdCreated(AdCreatedEvent event) {
        // Send email to user
        emailService.sendAdCreatedConfirmation(event.getAd());
        
        // Index ad for search
        searchService.indexAd(event.getAd());
        
        // Log analytics
        analyticsService.trackAdCreated(event.getAd());
    }
}
```

**application.properties:**

```properties
spring.rabbitmq.host=localhost
spring.rabbitmq.port=5672
spring.rabbitmq.username=guest
spring.rabbitmq.password=guest
```

### Option 2: Apache Kafka Integration

**Add Dependency:**

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```

**Configuration:**

```java
// KafkaConfig.java
@Configuration
public class KafkaConfig {
    
    public static final String AD_CREATED_TOPIC = "ad-created";
    
    @Bean
    public NewTopic adCreatedTopic() {
        return TopicBuilder.name(AD_CREATED_TOPIC)
            .partitions(3)
            .replicas(1)
            .build();
    }
}
```

**Producer:**

```java
// AdService.java
@Service
public class AdService {
    
    @Autowired
    private KafkaTemplate<String, AdCreatedEvent> kafkaTemplate;
    
    public Ad createAd(Ad ad) {
        Ad savedAd = adRepository.save(ad);
        
        // Send async event
        kafkaTemplate.send(
            KafkaConfig.AD_CREATED_TOPIC,
            savedAd.getId(),
            new AdCreatedEvent(savedAd)
        );
        
        return savedAd;
    }
}
```

**Consumer:**

```java
// AdNotificationService.java
@Service
public class AdNotificationService {
    
    @KafkaListener(topics = KafkaConfig.AD_CREATED_TOPIC, 
                   groupId = "ad-service-group")
    public void handleAdCreated(AdCreatedEvent event) {
        emailService.sendAdCreatedConfirmation(event.getAd());
        searchService.indexAd(event.getAd());
    }
}
```

**application.properties:**

```properties
spring.kafka.bootstrap-servers=localhost:9092
spring.kafka.consumer.group-id=culex-service
```

### RabbitMQ vs Kafka Comparison

| Feature | RabbitMQ | Kafka |
|---------|----------|-------|
| **Use Case** | Traditional messaging | Event streaming |
| **Throughput** | Lower | Higher |
| **Latency** | Lower | Higher |
| **Persistence** | Optional | Persistent |
| **Scalability** | Vertical | Horizontal |
| **Learning Curve** | Easier | Harder |
| **Best For** | Task queues, notifications | Analytics, logs, events |

**Recommendation for Culex:**
- Start with **RabbitMQ** (simpler)
- Migrate to **Kafka** if you need high-throughput analytics

---

## CAP Theorem Implementation

### Understanding CAP Theorem

The CAP theorem states that a distributed system can guarantee at most two of:
- **Consistency (C)**: All nodes have the same data
- **Availability (A)**: System always responds
- **Partition Tolerance (P)**: System works despite network failures

In practice, you MUST have P, so you choose between **CA** or **AP**:

```
     ┌────────────────────────┐
     │   CA Systems           │
     │   (Traditional RDBMS)  │
     │   - Strong Consistency │
     │   - No Partitions      │
     │   - Less Scalable      │
     └────────────────────────┘
     
     ┌────────────────────────┐
     │   CP Systems           │
     │   (HBase, MongoDB)     │
     │   - Consistent         │
     │   - Tolerates Partition│
     │   - Limited Availability│
     └────────────────────────┘
     
     ┌────────────────────────┐
     │   AP Systems           │
     │   (Cassandra, DynamoDB)│
     │   - Available          │
     │   - Tolerates Partition│
     │   - Eventual Consistency
     └────────────────────────┘
```

### Culex Current State: CA (Monolithic MongoDB)

```
Current Architecture:
├── Single MongoDB Instance
├── Single Server Instance
└── No Replication
```

**Consistency**: ✅ Strong (all queries read latest data)
**Availability**: ❌ Low (single point of failure)
**Partition Tolerance**: ❌ None

### Recommended: CP + Caching for Read Availability

Implement **MongoDB Replication** (CP) with **Redis Cache** (for read availability):

```
┌─────────────────────────────────────────────────┐
│             Load Balancer (Nginx)               │
└────────┬──────────────────────────────────┬──────┘
         │                                  │
   ┌─────▼────┐                      ┌─────▼────┐
   │ Culex App │                      │ Culex App│
   │ Instance1 │                      │ Instance2│
   └─────┬────┘                      └─────┬────┘
         │                                  │
         └──────────────┬───────────────────┘
                        │
           ┌────────────┴────────────┐
           │   Redis Cache (Reads)   │
           │   Distributed Cache     │
           └────────────┬────────────┘
                        │
         ┌──────────────┴──────────────┐
         │                             │
    ┌────▼─────┐              ┌───────▼──┐
    │ MongoDB   │              │ MongoDB  │
    │ Primary   │◄─────────────│ Secondary│
    │ (Write)   │ Replication  │ (Read)   │
    └──────────┘              └──────────┘
```

**Implementation:**

```yaml
# MongoDB Replication Setup
version: '3.8'
services:
  mongodb-primary:
    image: mongo:7
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    ports:
      - "27017:27017"
    command: mongod --replSet rs0
    
  mongodb-secondary:
    image: mongo:7
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    ports:
      - "27018:27017"
    command: mongod --replSet rs0
    depends_on:
      - mongodb-primary
      
  mongodb-init:
    image: mongo:7
    command: >
      mongosh --host mongodb-primary:27017 -u admin -p password
      --eval "rs.initiate({ _id: 'rs0', members: [ { _id: 0, host: 'mongodb-primary:27017' }, { _id: 1, host: 'mongodb-secondary:27017' } ] })"
    depends_on:
      - mongodb-primary
```

**Application Configuration:**

```java
// MongoConfig.java
@Configuration
public class MongoConfig {
    
    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create(
            MongoClientSettings.builder()
                .applyConnectionString(new ConnectionString(
                    "mongodb+srv://admin:password@localhost/culex_db?" +
                    "replicaSet=rs0&readPreference=secondaryPreferred"
                ))
                .build()
        );
    }
}
```

**CAP Guarantee with This Setup:**

| Property | Guarantee |
|----------|-----------|
| **Consistency** | ✅ Strong (via replication) |
| **Availability** | ✅ High (multiple instances, cache) |
| **Partition Tolerance** | ✅ Partial (replication handles some failures) |

---

## Production Deployment

### Docker Containerization

**Dockerfile:**

```dockerfile
# Multi-stage build
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/culex-0.0.1-SNAPSHOT.jar app.jar

ENV JWT_SECRET=${JWT_SECRET}
ENV SPRING_DATA_MONGODB_URI=${SPRING_DATA_MONGODB_URI}

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**docker-compose.yml (Production):**

```yaml
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app1
      - app2
      - app3

  app1:
    image: culex:latest
    restart: always
    environment:
      JWT_SECRET: ${JWT_SECRET}
      SPRING_DATA_MONGODB_URI: mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/culex_db
      SPRING_PROFILES_ACTIVE: production
      LOGGING_LEVEL_ROOT: INFO
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/test"]
      interval: 30s
      timeout: 10s
      retries: 3

  app2:
    image: culex:latest
    restart: always
    environment:
      JWT_SECRET: ${JWT_SECRET}
      SPRING_DATA_MONGODB_URI: mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/culex_db
      SPRING_PROFILES_ACTIVE: production

  app3:
    image: culex:latest
    restart: always
    environment:
      JWT_SECRET: ${JWT_SECRET}
      SPRING_DATA_MONGODB_URI: mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/culex_db
      SPRING_PROFILES_ACTIVE: production

  redis:
    image: redis:7-alpine
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

volumes:
  redis_data:
```

### Monitoring & Logging

**Add Prometheus & ELK Stack:**

```xml
<!-- pom.xml -->
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-logging</artifactId>
</dependency>
```

**application-production.properties:**

```properties
# Monitoring
management.endpoints.web.exposure.include=health,metrics,prometheus
management.metrics.export.prometheus.enabled=true

# Logging
logging.level.root=INFO
logging.level.com.culex=DEBUG
logging.file.name=/var/log/culex/application.log
logging.file.max-size=10MB
logging.file.max-history=10
```

### CI/CD Pipeline

**GitHub Actions (.github/workflows/ci.yml):**

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Backend
        run: |
          cd culex
          mvn clean package -DskipTests
      
      - name: Build Frontend
        run: |
          cd culex-frontend
          npm ci
          npm run build
      
      - name: Build Docker Image
        run: |
          docker build -t culex:latest .
          docker tag culex:latest ${{ secrets.REGISTRY }}/culex:latest
      
      - name: Push to Registry
        run: |
          docker login -u ${{ secrets.DOCKER_USER }} -p ${{ secrets.DOCKER_PASSWORD }}
          docker push ${{ secrets.REGISTRY }}/culex:latest
      
      - name: Deploy to Production
        run: |
          ssh ${{ secrets.DEPLOY_HOST }} 'docker pull ${{ secrets.REGISTRY }}/culex:latest && docker-compose up -d'
```

---

## Key Takeaways

### When to Scale
1. **Single instance hitting 80%+ CPU/Memory** → Add load balancer + multiple instances
2. **Database queries taking >100ms** → Add Redis caching
3. **High-frequency events (ads created)** → Add message queue (RabbitMQ/Kafka)
4. **Need for geographic distribution** → Use CDN + multi-region deployment

### Architecture Decision Matrix

| Scenario | Solution |
|----------|----------|
| Small (< 1k users) | Current monolithic setup |
| Growing (1k - 10k users) | Add Redis cache + Load balancer |
| Scaling (10k - 100k users) | Add message queue + Database replication |
| Large (100k+ users) | Microservices + Advanced caching |

### Recommended Roadmap
1. **Phase 1 (Now)**: Deploy current monolithic with proper monitoring
2. **Phase 2 (Month 1-2)**: Add Redis caching + Load balancer
3. **Phase 3 (Month 3-4)**: Add MongoDB replication + RabbitMQ
4. **Phase 4 (Month 6+)**: Consider microservices if needed

---

## References
- [CAP Theorem](https://en.wikipedia.org/wiki/CAP_theorem)
- [MongoDB Replication](https://docs.mongodb.com/manual/replication/)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
- [Spring Boot Microservices](https://spring.io/projects/spring-cloud)
