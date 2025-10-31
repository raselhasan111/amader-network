# app/main.py
from fastapi import FastAPI

from .api import auth

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to Amader Network API"}

# Include auth routes
app.include_router(auth.router)