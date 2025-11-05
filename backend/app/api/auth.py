from fastapi import APIRouter, Request

from ..core.config import config
from ..core.oauth import oauth

router = APIRouter()

@router.get("/auth/google")
async def login(request: Request):
    redirect_uri = config("GOOGLE_REDIRECT_URI")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth/google/callback")
async def auth(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user = token.get("userinfo")
    # Here you would typically create a user session or JWT token
    # Todo: Save user to database if not exists
    return {"user": user}