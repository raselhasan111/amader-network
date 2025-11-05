# app/main.py
from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware

from .api import auth
from .core.config import config

app = FastAPI()

# Add SessionMiddleware - required for OAuth
app.add_middleware(SessionMiddleware, secret_key=config('SECRET_KEY'))

@app.get("/")
def read_root():
    return {"message": "Welcome to Amader Network API"}

# Include auth routes
app.include_router(auth.router)