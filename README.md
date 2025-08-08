# Culex

Full-stack app with Spring Boot (MongoDB) and React + Vite (Tailwind).

## Prerequisites
- Java 21+ (Java 24 used here)
- Node.js 22.12+ (or >=20.19.0). See `.nvmrc`.
- MongoDB running on `mongodb://localhost:27017`

## Backend (Spring Boot)
- Configure JWT secret (at least 64 chars):
  - Windows PowerShell: `$env:JWT_SECRET = "your_super_long_secret"`
  - Bash: `export JWT_SECRET=your_super_long_secret`
- Run:
  - Bash: `./mvnw spring-boot:run`
  - Windows cmd: `mvnw.cmd spring-boot:run`
- API base: `http://localhost:8080`

## Frontend (Vite + React)
- Create `culex-frontend/.env` (optional):
  - `VITE_API_BASE_URL=http://localhost:8080`
- Install deps and run dev server:
  - `cd culex-frontend`
  - `npm ci`
  - `npm run dev`
- App runs at `http://localhost:5173`

## Auth Endpoints
- `POST /api/auth/register` { email, password, firstName, lastName, phoneNumber? }
- `POST /api/auth/login` { email, password }

## Production Notes
- Set `JWT_SECRET` via environment (never commit real secrets).
- Tighten CORS and Security rules in `SecurityConfig` before production.

## CI
- GitHub Actions workflow builds backend and frontend under `.github/workflows/ci.yml`.
