#!/bin/bash

# Complete Verification Script for Amader Network
# Run this to verify all components are working

echo "================================================"
echo "🔍 Amader Network - Complete Verification"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check PostgreSQL
echo "1. Checking PostgreSQL..."
if docker ps | grep -q amader-network-db-1; then
    echo -e "${GREEN}✓${NC} PostgreSQL container is running"

    # Check database
    if docker exec amader-network-db-1 psql -U postgres -d amader_network -c "\dt" &> /dev/null; then
        echo -e "${GREEN}✓${NC} Database 'amader_network' exists"

        # Check users table
        USER_COUNT=$(docker exec amader-network-db-1 psql -U postgres -d amader_network -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' ')
        if [ ! -z "$USER_COUNT" ]; then
            echo -e "${GREEN}✓${NC} Users table exists with $USER_COUNT user(s)"
        else
            echo -e "${RED}✗${NC} Users table not found"
        fi
    else
        echo -e "${RED}✗${NC} Database 'amader_network' not found"
    fi
else
    echo -e "${RED}✗${NC} PostgreSQL container not running"
    echo -e "${YELLOW}→${NC} Run: docker compose up -d db"
fi

echo ""

# Check Backend
echo "2. Checking Backend API..."
if curl -s http://127.0.0.1:8000/ &> /dev/null; then
    RESPONSE=$(curl -s http://127.0.0.1:8000/)
    if echo "$RESPONSE" | grep -q "Welcome to Amader Network"; then
        echo -e "${GREEN}✓${NC} Backend API is running on http://127.0.0.1:8000"

        # Check endpoints
        if curl -s http://127.0.0.1:8000/openapi.json | grep -q "auth/google"; then
            echo -e "${GREEN}✓${NC} OAuth endpoints are registered"
        fi
    else
        echo -e "${RED}✗${NC} Backend API returned unexpected response"
    fi
else
    echo -e "${RED}✗${NC} Backend API is not running"
    echo -e "${YELLOW}→${NC} Run: cd backend && uvicorn app.main:app --reload"
fi

echo ""

# Check Environment Variables
echo "3. Checking Environment Configuration..."
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC} .env file exists"

    # Check required variables
    REQUIRED_VARS=("SECRET_KEY" "DATABASE_URL" "GOOGLE_CLIENT_ID" "GOOGLE_CLIENT_SECRET" "GOOGLE_REDIRECT_URI")
    MISSING_VARS=()

    for VAR in "${REQUIRED_VARS[@]}"; do
        if grep -q "^${VAR}=" backend/.env; then
            echo -e "${GREEN}✓${NC} $VAR is configured"
        else
            echo -e "${RED}✗${NC} $VAR is missing"
            MISSING_VARS+=("$VAR")
        fi
    done

    if [ ${#MISSING_VARS[@]} -gt 0 ]; then
        echo -e "${YELLOW}→${NC} Add missing variables to backend/.env"
    fi
else
    echo -e "${RED}✗${NC} .env file not found"
    echo -e "${YELLOW}→${NC} Copy backend/.env.example to backend/.env"
fi

echo ""

# Check Python Dependencies
echo "4. Checking Python Dependencies..."
cd backend
if python3 -c "import sqlalchemy, psycopg2, jose, passlib" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} All Python dependencies installed"
else
    echo -e "${RED}✗${NC} Some dependencies missing"
    echo -e "${YELLOW}→${NC} Run: pip install -r requirements.txt"
fi
cd ..

echo ""

# Summary
echo "================================================"
echo "📊 Verification Summary"
echo "================================================"
echo ""
echo "If all checks passed, you can:"
echo "1. Visit http://127.0.0.1:8000/docs for API documentation"
echo "2. Test OAuth: http://127.0.0.1:8000/auth/google"
echo "3. Check database: docker exec amader-network-db-1 psql -U postgres -d amader_network -c 'SELECT * FROM users;'"
echo ""
echo "For detailed guides, see:"
echo "- QUICKSTART.md"
echo "- INTEGRATION_SUMMARY.md"
echo "- backend/SETUP.md"
echo ""

