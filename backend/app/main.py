# app/main.py
from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware

from .api import auth
from .core.config import SECRET_KEY, FRONTEND_URL
from .db.database import engine
from .models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Amader Network API")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add SessionMiddleware - required for OAuth
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

@app.get("/")
def read_root():
    return {"message": "Welcome to Amader Network API"}

# Include auth routes
app.include_router(auth.router)