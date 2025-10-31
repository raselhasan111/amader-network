from fastapi import APIRouter, Request
from starlette.responses import RedirectResponse
from ..core.oauth import oauth

router = APIRouter()

@router.get("/login")
async def login(request: Request):
    redirect_uri = request.url_for("auth")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth")
async def auth(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user = await oauth.google.parse_id_token(request, token)
    # Here you would typically create a user session or JWT token
    # Todo: Save user to database if not exists
    return {"user": user}