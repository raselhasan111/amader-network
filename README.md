# Amader Network

## Project Structure

```
amader-network/
├── docker-compose.yml
├── LICENSE
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── __pycache__/
│       │   ├── main.cpython-311.pyc
│       │   └── main.cpython-312.pyc
│       ├── api/
│       ├── core/
│       ├── db/
│       ├── models/
│       ├── schemas/
│       └── services/
└── frontend/
    ├── Dockerfile.dev
    ├── eslint.config.mjs
    ├── next-env.d.ts
    ├── next.config.ts
    ├── package.json
    ├── pnpm-lock.yaml
    ├── postcss.config.mjs
    ├── README.md
    ├── tsconfig.json
    ├── app/
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    └── public/
        ├── file.svg
        ├── globe.svg
        ├── next.svg
        ├── vercel.svg
        └── window.svg
```

Activate virtual environment and install dependencies for backend:

```
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
```

To run the backend server:

```
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload    
```

To start (build and run) the dockerized application(both frontend and backend):

```
docker compose up --build
```
