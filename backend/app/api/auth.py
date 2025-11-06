from fastapi import APIRouter, Request, Depends
from starlette.responses import RedirectResponse
from sqlalchemy.orm import Session

from ..core.config import GOOGLE_REDIRECT_URI, FRONTEND_URL
from ..core.oauth import oauth
from ..core.security import create_access_token
from ..db.database import get_db
from ..schemas.user import UserCreate
from ..services.user_service import get_or_create_user

router = APIRouter()

@router.get("/auth/google")
async def login(request: Request):
    """Initiate Google OAuth login"""
    redirect_uri = GOOGLE_REDIRECT_URI
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth/google/callback")
async def auth(request: Request, db: Session = Depends(get_db)):
    """
    Handle Google OAuth callback, create/update user, and redirect to frontend with token
    """
    # Get the OAuth token from Google
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")

    # Extract user data from Google
    google_id = user_info.get("sub")
    email = user_info.get("email")
    name = user_info.get("name")
    picture = user_info.get("picture")

    # Create user data schema
    user_data = UserCreate(
        email=email,
        name=name,
        picture=picture,
        google_id=google_id
    )

    # Get or create user in database
    user, created = get_or_create_user(db, user_data)

    # Create JWT access token
    access_token = create_access_token(
        data={"email": user.email, "id": user.id, "picture": user.picture}
    )

    # Redirect to frontend with access token
    redirect_url = f"{FRONTEND_URL}/auth/callback?token={access_token}"
    return RedirectResponse(url=redirect_url)
