#!/usr/bin/env python3
"""
Test script to verify database and authentication setup
"""
import sys
sys.path.insert(0, '.')

from app.db.database import engine, SessionLocal
from app.models.user import User
from sqlalchemy import text

def test_database_connection():
    """Test database connection"""
    print("Testing database connection...")
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✓ Connected to PostgreSQL: {version.split(',')[0]}")
            return True
    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        return False

def test_tables_exist():
    """Test if tables are created"""
    print("\nChecking database tables...")
    try:
        with engine.connect() as connection:
            result = connection.execute(text(
                "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
            ))
            tables = [row[0] for row in result.fetchall()]

            if 'users' in tables:
                print(f"✓ Tables created: {', '.join(tables)}")
                return True
            else:
                print(f"✗ 'users' table not found. Existing tables: {', '.join(tables) if tables else 'None'}")
                return False
    except Exception as e:
        print(f"✗ Error checking tables: {e}")
        return False

def test_user_model():
    """Test creating a user"""
    print("\nTesting user model...")
    db = SessionLocal()
    try:
        # Check if test user exists
        test_user = db.query(User).filter(User.email == "test@example.com").first()

        if not test_user:
            # Create test user
            test_user = User(
                email="test@example.com",
                name="Test User",
                google_id="test_google_id_123",
                picture="https://example.com/picture.jpg"
            )
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
            print(f"✓ Created test user: {test_user.email} (ID: {test_user.id})")
        else:
            print(f"✓ Test user already exists: {test_user.email} (ID: {test_user.id})")

        # Count users
        user_count = db.query(User).count()
        print(f"✓ Total users in database: {user_count}")
        return True
    except Exception as e:
        print(f"✗ Error with user model: {e}")
        db.rollback()
        return False
    finally:
        db.close()

def test_jwt_token():
    """Test JWT token creation"""
    print("\nTesting JWT token generation...")
    try:
        from app.core.security import create_access_token, verify_token

        # Create token
        token_data = {"sub": "test@example.com", "user_id": 1}
        token = create_access_token(token_data)
        print(f"✓ JWT token created: {token[:50]}...")

        # Verify token
        payload = verify_token(token)
        if payload and payload.get("sub") == "test@example.com":
            print(f"✓ JWT token verified: {payload}")
            return True
        else:
            print("✗ JWT token verification failed")
            return False
    except Exception as e:
        print(f"✗ Error with JWT: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 60)
    print("PostgreSQL Integration Test")
    print("=" * 60)

    tests = [
        test_database_connection,
        test_tables_exist,
        test_user_model,
        test_jwt_token,
    ]

    results = []
    for test in tests:
        try:
            results.append(test())
        except Exception as e:
            print(f"✗ Test failed with exception: {e}")
            results.append(False)

    print("\n" + "=" * 60)
    passed = sum(results)
    total = len(results)
    print(f"Results: {passed}/{total} tests passed")
    print("=" * 60)

    if all(results):
        print("\n✓ All tests passed! Setup is complete.")
        print("\nNext steps:")
        print("1. Start the backend: uvicorn app.main:app --reload")
        print("2. Test Google OAuth: http://127.0.0.1:8000/auth/google")
        print("3. Check API docs: http://127.0.0.1:8000/docs")
        return 0
    else:
        print("\n✗ Some tests failed. Please check the errors above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())

