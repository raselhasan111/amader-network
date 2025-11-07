# Amader Network

A modern social networking platform built with FastAPI, PostgreSQL, Next.js.

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
  - [Option A: Docker (recommended)](#option-a-docker-recommended)
  - [Option B: Local development](#option-b-local-development)
- [Environment Variables](#environment-variables)
- [Run Services](#run-services)
- [Architecture & Auth Flow](#architecture--auth-flow)
- [API Endpoints](#api-endpoints)
- [Frontend Integration](#frontend-integration)
- [Database Schema & Verification](#database-schema--verification)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)
- [Useful Commands](#useful-commands)
- [Security Notes](#security-notes)
- [License](#license)

---

## Overview
Amader Network is a full-stack app with a FastAPI backend and a Next.js frontend. It supports Google OAuth login, persists users in PostgreSQL, and issues short-lived JWT tokens that the frontend can store and use for authenticated calls.

Key features:
- Google OAuth 2.0 authentication
- PostgreSQL persistence via SQLAlchemy ORM
- JWT token generation and verification
- "Get or create" user on first login
- CORS configured for the Next.js frontend
- Docker Compose for local development

## Prerequisites
- Docker 20+ and Docker Compose v2 (for the Docker workflow)
- Python 3.11+
- Node.js 18+ and pnpm (for the frontend)

Install pnpm if needed:
```bash
npm i -g pnpm
```

## Quick Start

### Option A: Docker (recommended)
1) Start PostgreSQL:
```bash
docker compose up -d db
```
2) Wait for DB to become healthy:
```bash
docker compose ps
```

### Option B: Local development
1) Create and activate a virtual environment, then install deps:
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```
2) Start a local PostgreSQL or run the DB via Docker:
```bash
docker compose up -d db
```
3) (Optional) Smoke test the setup:
```bash
python3 test_setup.py
```
4) Run the backend:
```bash
uvicorn app.main:app --reload
```
5) Start the frontend in a separate terminal:
```bash
cd frontend
pnpm install
pnpm dev
```

## Environment Variables
Create `backend/.env` (there’s also a `.env.example` you can copy). Example values shown as placeholders:
```env
# App
SECRET_KEY=<generate-with: python -c "import secrets; print(secrets.token_urlsafe(32))">
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database (local dev)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/amader_network
# Database (when backend runs in Docker, the host becomes the service name "db")
# DATABASE_URL=postgresql://postgres:postgres@db:5432/amader_network

# Google OAuth (must match Google Cloud Console)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_REDIRECT_URI=http://127.0.0.1:8000/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000
```
Notes:
- Ensure GOOGLE_REDIRECT_URI exactly matches the authorized redirect URI in Google Cloud Console.
- Prefer 127.0.0.1 over localhost for consistency.

## Run Services
Backend (dev):
```bash
cd backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Frontend (dev):
```bash
cd frontend
pnpm dev
```
PostgreSQL via Docker:
```bash
docker compose up -d db
```

## Architecture & Auth Flow
```
User → Frontend → Backend → Google OAuth → Backend → Database
                                    ↓
                    JWT Token → Frontend → Authenticated Requests
```
High-level OAuth steps:
1. User clicks "Login with Google" (frontend navigates to /auth/google)
2. Backend redirects to Google
3. Google authenticates the user and redirects back to the backend callback
4. Backend exchanges the code, fetches user info, and gets/creates the user in DB
5. Backend issues a JWT token and redirects to the frontend with token in the URL

## API Endpoints
- GET `/` – Health/Welcome
- GET `/auth/google` – Initiate Google OAuth
- GET `/auth/google/callback` – OAuth callback; saves user, issues JWT, redirects to frontend
- GET `/docs` – Interactive API docs

Quick curl checks:
```bash
curl -s http://127.0.0.1:8000/
curl -s http://127.0.0.1:8000/openapi.json | head -50
```

## Frontend Integration

The frontend uses **cookie-based authentication** with **Redux Toolkit (RTK)** for global state management.

### Key Features Implemented:
- ✅ JWT tokens stored in HTTP cookies (30-min expiry)
- ✅ Redux store with user profile slice
- ✅ Protected routes with automatic redirect
- ✅ Token expiration checking
- ✅ Google OAuth callback handler
- ✅ Sign-in page with Google button
- ✅ Home page with user profile

### Routes:
- `/` - Root (redirects based on auth status)
- `/signin` - Sign in page with Google OAuth button
- `/auth/callback` - OAuth callback handler (stores token, populates Redux, redirects to /home)
- `/home` - Protected home page (requires authentication)

### Authentication Flow:
1. User visits `/signin` and clicks "Sign in with Google"
2. Backend handles OAuth flow and redirects to `/auth/callback?token={JWT}`
3. Frontend stores token in cookie and decodes it
4. User profile populated in Redux store
5. User redirected to `/home`
6. Protected routes check token expiration automatically

## Project Structure
```
amader-network/
├── docker-compose.yml          # Services orchestration
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI app (CORS + Session)
│   │   ├── api/
│   │   │   └── auth.py         # OAuth routes
│   │   ├── core/
│   │   │   ├── config.py       # Env config
│   │   │   ├── oauth.py        # Google OAuth
│   │   │   └── security.py     # JWT utilities
│   │   ├── db/
│   │   │   └── database.py     # DB connection & Session
│   │   ├── models/
│   │   │   └── user.py         # SQLAlchemy User model
│   │   ├── schemas/
│   │   │   └── user.py         # Pydantic schemas
│   │   └── services/
│   │       └── user_service.py # User CRUD utilities
│   ├── requirements.txt
│   ├── test_setup.py           # Setup verification
│   └── init_db.sh              # DB initialization helper
└── frontend/
    ├── app/                    # Next.js pages
    ├── components/             # React components
    ├── lib/                    # Utilities
    └── services/               # API services
```

## Useful Commands

### Local Backend Setup
Create virtual environment:
```bash
cd backend
python -m venv venv
```

Activate virtual environment:
```bash
# Linux/macOS
source venv/bin/activate

# Windows
venv\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```
Run backend:
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Run verification script:
```bash
./verify.sh
```

Freeze current deps:
```bash
pip freeze > requirements.txt
```

### Local Frontend Setup
Install dependencies:
```bash
cd frontend
pnpm install
```

Run development server:
```bash
pnpm dev
```

Build for production:
```bash
pnpm build
```

Start production server:
```bash
pnpm start
```

### Seeding Data
To populate the database with sample users, run the seeder script from the project root. You can configure the target API URL via the `API_URL` environment variable.

```bash
# Make sure your backend virtual environment is activated if running locally
export API_URL="proto://host:port/users"
python backend/scripts/seed_users.py
```
By default, this creates 100 users. You can easily modify the script to change this number.

## Security Notes
- JWT tokens default to 30-minute expiry (configurable)
- Keep SECRET_KEY and OAuth credentials in .env (never commit secrets)
- CORS restricted to the configured FRONTEND_URL
- OAuth uses OpenID Connect metadata
- Use Alembic for schema migrations in team environments

## License
This project is licensed under the terms of the [LICENSE](./LICENSE) file.
