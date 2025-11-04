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
