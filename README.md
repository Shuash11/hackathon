# Full-Stack Foundation

A concept-agnostic application foundation with a Nuxt 3 frontend and Django REST API. The code is organized around focused modules so feature apps, pages, and stores can be added without restructuring authentication, API, or layout concerns.

## Architecture

- `backend/`: Django 5, DRF, PostgreSQL configuration, custom email user model, and versioned API.
- `frontend/`: Nuxt 3, Vue 3, TypeScript, Tailwind, Pinia, and reusable layout/common components.
- `backend/apps/core`: shared abstractions such as `TimeStampedModel` and health reporting.
- `backend/apps/users`: custom user model, manager, serializer, admin configuration, and migration.
- `backend/apps/authentication`: Google verification boundary, account-linking service, JWT cookie service, authentication class, and API views.

The frontend only calls the API through `composables/useApi.ts`. Pinia stores session user state only; JWTs are never exposed to JavaScript or persisted in local storage.

## Prerequisites

- Python 3.12+
- Node.js 22+
- Docker Desktop (recommended for local PostgreSQL), or a reachable PostgreSQL 16+ instance
- A Google Cloud OAuth 2.0 Web application client for sign-in

## Local setup

Commands use Unix-style paths below. On Windows PowerShell, activate the virtual environment with `.venv\Scripts\Activate.ps1` and use `Copy-Item` instead of `cp`.

### 1. Start PostgreSQL

```sh
docker compose up -d postgres
```

The development defaults in `backend/.env.example` match this container. Stop it later with `docker compose down`; add `-v` only when intentionally deleting local database data.

### 2. Configure and run the backend

```sh
cd backend
cp .env.example .env
python -m venv .venv
. .venv/bin/activate
python -m pip install -r requirements/dev.txt
python manage.py migrate
python manage.py runserver
```

The test settings always use an in-memory SQLite database, so tests do not require Docker. Development uses `config.settings.dev`; deployment should set `DJANGO_SETTINGS_MODULE=config.settings.prod`.

### 3. Configure and run the frontend

```sh
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:3000`. Set `NUXT_PUBLIC_API_BASE_URL` to the backend API root, normally `http://localhost:8000/api/v1`.

## Google Cloud Console configuration

1. Create or select a Google Cloud project and configure its OAuth consent screen.
2. Create an **OAuth client ID** of type **Web application**.
3. Add `http://localhost:3000` to Authorized JavaScript origins for local development. Add each HTTPS production frontend origin separately.
4. Copy the client ID into both `backend/.env` (`GOOGLE_CLIENT_ID`) and `frontend/.env` (`NUXT_PUBLIC_GOOGLE_CLIENT_ID`).
5. Store the client secret and redirect URI in the backend environment when an OAuth redirect flow is later added; the current Google Identity credential flow verifies an ID token and does not send this secret to the browser.

The implementation is ready to verify Google credentials once a real client ID and allowed origins are configured. It cannot authenticate against Google with the safe example values.

## Environment variables

Backend (`backend/.env`):

| Variable | Purpose |
| --- | --- |
| `DEBUG`, `SECRET_KEY`, `ALLOWED_HOSTS` | Django runtime and host security |
| `DATABASE_URL` | PostgreSQL URL, e.g. `postgres://foundation:foundation@localhost:5432/foundation` |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` | Google OAuth configuration |
| `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS` | permitted browser origins |
| `JWT_ACCESS_COOKIE`, `JWT_REFRESH_COOKIE`, `JWT_COOKIE_SECURE`, `JWT_COOKIE_SAMESITE` | cookie names and delivery policy |

Frontend (`frontend/.env`):

| Variable | Purpose |
| --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | Versioned backend API base URL |
| `NUXT_PUBLIC_GOOGLE_CLIENT_ID` | public Google web client ID |

Only copy and edit the `.env.example` files locally. Do not commit real `.env` files or OAuth secrets.

## API

All endpoints are versioned below `/api/v1/`.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health/` | Public health response; also supplies the browser CSRF cookie |
| `POST` | `/auth/google/` | Accepts a Google Identity `credential`, verifies it, creates/links a local account, and sets JWT cookies |
| `GET` | `/auth/me/` | Returns the authenticated local user |
| `POST` | `/auth/refresh/` | Exchanges the HttpOnly refresh cookie for a new access cookie |
| `POST` | `/auth/logout/` | Clears JWT cookies |

## Cookie and CSRF model

Access and refresh JWTs are sent as `HttpOnly` cookies with configurable `Secure` and `SameSite` attributes. The frontend has no token state. `CookieJWTAuthentication` reads only the access cookie and performs Django CSRF validation for unsafe authenticated calls. Google login, refresh, and logout additionally use Django's CSRF protection. The login page first calls the public health endpoint to obtain a readable `csrftoken`; the centralized API client sends it as `X-CSRFToken` for unsafe requests and retries a failed request at most once after a refresh. Configure HTTPS, production allowed hosts, CORS origins, and trusted CSRF origins before deployment.

## Verification commands

Run these after dependencies are installed:

```sh
# backend
cd backend
pytest
ruff check .

# frontend
cd frontend
npm run test
npm run typecheck
npm run build
```

## Extending the foundation

Add a future Django feature as a dedicated app under `backend/apps/` with its own models, serializers, services, permissions, and URL module. Add matching Nuxt pages/components and a focused Pinia store only where client state is truly needed. Keep HTTP access in `useApi.ts` and keep product-specific business logic out of core and authentication modules.
