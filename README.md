# MarketMind Labs

Probability and market structure analysis platform for Indian traders (NIFTY, BANKNIFTY, SENSEX).

## Live URLs

| Service | Custom domain | Render fallback |
|---------|---------------|-----------------|
| **Frontend** | https://www.logictrade.site | https://marketmind-frontend-s0zl.onrender.com |
| **Backend API** | https://api.logictrade.site | https://marketmind-api-pdn0.onrender.com |
| **API Docs** | https://api.logictrade.site/docs | https://marketmind-api-pdn0.onrender.com/docs |
| **Health Check** | https://api.logictrade.site/api/health | https://marketmind-api-pdn0.onrender.com/api/health |
| **Render Blueprint** | `exs-d8l494mgvqtc73ahtbhg` | |
| **Render Dashboard** | https://dashboard.render.com/blueprint/exs-d8l494mgvqtc73ahtbhg | |

> **Note:** Free-tier Render services spin down after inactivity and may show as suspended until resumed from the dashboard.

## Custom domain: logictrade.site (Namecheap)

### 1. Render — add custom domains

In the [Render dashboard](https://dashboard.render.com/blueprint/exs-d8l494mgvqtc73ahtbhg):

**Frontend service** (`marketmind-frontend` → `marketmind-frontend-s0zl.onrender.com`) → Settings → Custom Domains → add:
- `logictrade.site`
- `www.logictrade.site`

**Backend service** (`marketmind-api` → `marketmind-api-pdn0.onrender.com`) → Settings → Custom Domains → add:
- `api.logictrade.site`

Render will verify DNS and issue HTTPS automatically (usually 15–60 minutes).

### 2. Namecheap — Advanced DNS

Log in to Namecheap → Domain List → **logictrade.site** → **Manage** → **Advanced DNS**.

Remove any conflicting `URL Redirect` or parking records for `@` and `www`, then add:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| **A Record** | `@` | `216.24.57.1` | Automatic |
| **CNAME Record** | `www` | `marketmind-frontend-s0zl.onrender.com` | Automatic |
| **CNAME Record** | `api` | `marketmind-api-pdn0.onrender.com` | Automatic |

Use the exact CNAME targets Render shows in your dashboard if they differ from the table above.

> **Important:** If `api.logictrade.site` still points to the old `marketmind-api.onrender.com` hostname, calculators on the site will fail. Update the `api` CNAME to `marketmind-api-pdn0.onrender.com`. Until DNS propagates, set `NEXT_PUBLIC_API_URL=https://marketmind-api-pdn0.onrender.com` on the frontend service in Render and redeploy.

### 3. Verify

After DNS propagates, test:

- https://www.logictrade.site
- https://logictrade.site
- https://api.logictrade.site/api/health

### 4. Optional — Google OAuth

If using Google login, add these in [Google Cloud Console](https://console.cloud.google.com/) → Credentials → Authorized JavaScript origins:

- `https://logictrade.site`
- `https://www.logictrade.site`

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
