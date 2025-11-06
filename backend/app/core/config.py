from starlette.config import Config
from pathlib import Path

# Get the backend directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent
config = Config(str(BASE_DIR / ".env"))

# App settings
SECRET_KEY = config("SECRET_KEY")
ALGORITHM = config("ALGORITHM", default="HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = config("ACCESS_TOKEN_EXPIRE_MINUTES", cast=int, default=30)

# Database settings
DATABASE_URL = config("DATABASE_URL", default="postgresql://postgres:postgres@localhost:5432/amader_network")

# OAuth settings
GOOGLE_CLIENT_ID = config("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = config("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = config("GOOGLE_REDIRECT_URI")

# Frontend URL
FRONTEND_URL = config("FRONTEND_URL", default="http://localhost:3000")
