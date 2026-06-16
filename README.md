# MarketMind Labs

Probability and market structure analysis platform for Indian traders (NIFTY, BANKNIFTY, SENSEX).

## Live URLs (Render)

| Service | URL |
|---------|-----|
| **Frontend** | https://marketmind-frontend.onrender.com |
| **Backend API** | https://marketmind-api.onrender.com |
| **API Docs** | https://marketmind-api.onrender.com/docs |
| **Health Check** | https://marketmind-api.onrender.com/api/health |
| **Render Blueprint** | `exs-d8l494mgvqtc73ahtbhg` |
| **Render Dashboard** | https://dashboard.render.com/blueprint/exs-d8l494mgvqtc73ahtbhg |

> **Note:** Free-tier Render services spin down after inactivity and may show as suspended until resumed from the dashboard.

## Project Structure

```
marketmind-labs/
├── backend/          # FastAPI API (Python 3.11)
├── frontend/         # Next.js 14 app (Node 20)
├── deploy/           # Docker Compose + nginx (self-hosted option)
└── render.yaml       # Render Blueprint (one-click deploy)
```

## Local Development

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API runs at http://localhost:8000 — docs at http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
set NEXT_PUBLIC_API_URL=http://localhost:8000   # Windows
npm run dev
```

App runs at http://localhost:3000

### Tests

```bash
cd backend
pip install -r requirements.txt
pytest tests/ -v
```

## Environment Variables

Copy `backend/.env.example` to `backend/.env` for local overrides.

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL (Render) or SQLite locally |
| `SECRET_KEY` | JWT signing key |
| `FRONTEND_URL` | Frontend origin for API metadata |
| `CORS_ORIGINS` | Comma-separated allowed origins |
| `NEXT_PUBLIC_API_URL` | Backend URL used by the frontend |

## Deploy to Render

1. Push to https://github.com/vpsgr8/marketmind-labs
2. Open the [Render Blueprint](https://dashboard.render.com/blueprint/exs-d8l494mgvqtc73ahtbhg)
3. Resume services if they show as suspended
4. Trigger a manual deploy after pushing changes

## GitHub

https://github.com/vpsgr8/marketmind-labs
