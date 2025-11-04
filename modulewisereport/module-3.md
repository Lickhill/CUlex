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
