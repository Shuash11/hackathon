# Project Skeleton & Architecture Requirements

> This document defines the baseline technical architecture and folder structure for this project.
> It is intentionally **concept-agnostic** — once the actual app idea/concept is finalized, it should
> be easy to plug the business logic, models, and pages into this skeleton without restructuring
> the foundation.

---

## 1. Tech Stack Summary

| Layer          | Technology                                   |
|----------------|-----------------------------------------------|
| Frontend       | Nuxt.js (Vue 3)                               |
| Styling        | Tailwind CSS                                  |
| Backend        | Python — Django + Django REST Framework (DRF) |
| Database       | PostgreSQL                                    |
| Authentication | SSO — Google Auth (OAuth 2.0)                 |
| Config         | Environment variables (`.env`)                |
| Version Control| Git                                           |
| Design         | Responsive, mobile-first, component-based     |

---

## 2. Guiding Principles

- **Separation of concerns** — frontend and backend are fully decoupled; frontend consumes the backend only via REST API.
- **Component-based architecture** — UI is built from small, reusable, composable components (Nuxt/Vue components) rather than monolithic pages.
- **Environment-driven config** — no secrets, keys, or environment-specific values hardcoded anywhere. Everything sensitive/configurable lives in `.env` files.
- **Responsive by default** — every component/page must be designed mobile-first and tested across breakpoints (sm, md, lg, xl).
- **Concept-agnostic core** — auth, API structure, layout shell, and DB conventions are built first, so any future app concept snaps into this scaffold.

---

## 3. High-Level Repository Structure

```
project-root/
├── backend/                   # Django + DRF project
├── frontend/                  # Nuxt.js project
├── .gitignore
├── README.md
└── PROJECT_SKELETON.md        # (this file)
```

---

## 4. Backend Structure (Django + DRF)

```
backend/
├── config/                    # Django project settings package
│   ├── __init__.py
│   ├── settings/
│   │   ├── base.py            # shared settings
│   │   ├── dev.py             # local/dev overrides
│   │   └── prod.py            # production overrides
│   ├── urls.py                # root URL router
│   ├── wsgi.py
│   └── asgi.py
│
├── apps/                      # all Django "apps" (feature modules) live here
│   ├── users/                 # custom user model, profile, roles
│   ├── authentication/        # Google SSO (OAuth) + JWT/session handling
│   └── core/                  # shared utilities, base models, permissions
│       # NOTE: additional feature apps (e.g. "products", "bookings")
│       # get added here once the real concept is defined.
│
├── manage.py
├── requirements/
│   ├── base.txt
│   ├── dev.txt
│   └── prod.txt
├── .env.example                # documents required env vars (no real secrets)
└── pytest.ini / tests/         # test config & shared test fixtures
```

### Backend conventions
- Each Django app follows: `models.py`, `serializers.py`, `views.py` (or `viewsets.py`), `urls.py`, `permissions.py`, `tests/`.
- API versioning under `/api/v1/...`.
- DRF ViewSets + Routers preferred for standard CRUD resources.
- Custom User model from day one (`apps/users/models.py`) to support SSO-linked accounts cleanly.
- All settings read from environment variables via `django-environ` or `python-decouple`.

---

## 5. Frontend Structure (Nuxt.js)

```
frontend/
├── assets/                    # tailwind.css, images, fonts
├── components/                 # reusable, dumb/presentational components
│   ├── common/                 # buttons, inputs, modals, cards
│   └── layout/                 # header, footer, nav, sidebar
├── composables/                 # reusable logic (useAuth, useApi, etc.)
├── layouts/                     # page layout shells (default, auth, dashboard)
├── middleware/                  # route guards (e.g. auth.js)
├── pages/                       # file-based routing (concept-specific pages added later)
├── plugins/                     # axios/fetch client, Google auth plugin, etc.
├── stores/                      # state management (Pinia)
├── utils/                       # helper functions/constants
├── nuxt.config.ts
├── tailwind.config.ts
├── .env.example
└── package.json
```

### Frontend conventions
- Tailwind utility-first styling; shared design tokens defined in `tailwind.config.ts`.
- Pinia for state management (auth state, user session, app state).
- API calls centralized through a single composable/client (`composables/useApi.ts`) — no scattered `fetch()` calls.
- Components split by responsibility: **presentational** (`components/common`) vs **container/page-level** (`pages/`).
- Route-level auth guarding via Nuxt `middleware/auth.js`.

---

## 6. Authentication — Google SSO

- OAuth 2.0 "Sign in with Google" flow.
- Backend (`apps/authentication/`) handles:
  - Verifying Google ID token / OAuth callback.
  - Creating or linking a local `User` record.
  - Issuing session/JWT for subsequent API calls.
- Frontend handles:
  - Google Sign-In button/flow (via Nuxt plugin or Google Identity Services script).
  - Storing auth state in Pinia + persisting token (httpOnly cookie preferred over localStorage).
- Required environment variables (see §7):
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `GOOGLE_REDIRECT_URI`

---

## 7. Environment Variables

### Backend `.env.example`
```
DEBUG=
SECRET_KEY=
ALLOWED_HOSTS=

DATABASE_URL=postgres://user:password@host:5432/dbname
# or split form:
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

CORS_ALLOWED_ORIGINS=
```

### Frontend `.env.example`
```
NUXT_PUBLIC_API_BASE_URL=
NUXT_PUBLIC_GOOGLE_CLIENT_ID=
```

> Real `.env` files are **never** committed — only `.env.example` templates are tracked in Git.

---

## 8. Database (PostgreSQL)

- One PostgreSQL instance/database per environment (dev, staging, prod).
- Django migrations are the single source of truth for schema.
- Naming convention: snake_case for tables/columns (Django default).
- Base/abstract models (e.g. `TimeStampedModel` with `created_at`/`updated_at`) defined in `apps/core/models.py` for reuse across future feature apps.

---

## 9. Git & Version Control

- `main` — production-ready branch.
- `develop` — integration branch (optional, if using Git Flow).
- Feature branches: `feature/<short-description>`.
- `.gitignore` excludes: `.env`, `node_modules/`, `__pycache__/`, `*.pyc`, `venv/`, `.nuxt/`, `dist/`, DB dumps, IDE folders.
- Commit convention (recommended): Conventional Commits — `feat:`, `fix:`, `chore:`, `docs:`, etc.

---

## 10. What Gets Added Once the Concept Is Defined

This skeleton intentionally omits business logic. Once the real app concept is approved, the following slot into the existing structure without changes to the foundation:

- New Django apps under `backend/apps/` (models, serializers, viewsets, urls).
- New Nuxt pages under `frontend/pages/` and matching components under `frontend/components/`.
- Concept-specific Pinia stores.
- Any additional third-party integrations (payment, email, storage) — added as new env vars + service modules.

---

## 11. Status

- [x] Backend scaffold initialized
- [x] Frontend scaffold initialized
- [x] Google SSO implementation-ready (real Google client credentials and Console origins are still required)
- [x] PostgreSQL local configuration provided (start the container and run migrations to connect)
- [x] Tailwind configured
- [x] `.gitignore` added (repository commits remain a maintainer action)
- [x] `.env.example` files provided for both frontend and backend
