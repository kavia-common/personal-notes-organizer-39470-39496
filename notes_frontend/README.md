# Personal Notes - Ocean Professional Theme

A modern, lightweight React app to create, edit, and organize personal notes. Features a responsive layout with a sidebar, notes list, and editor. Supports optional backend integration via environment variables and falls back to local storage when no backend is configured.

## Quick Start

- `npm start` — runs at http://localhost:3000
- `npm test` — minimal sanity tests
- `npm run build` — production build

## Environment Variables

The UI respects the following if present (do not commit secrets):
- `REACT_APP_API_BASE`: Base URL for the backend API (e.g., https://api.example.com). If not set, the app uses local storage/in-memory fallback.
- `REACT_APP_BACKEND_URL`, `REACT_APP_FRONTEND_URL`, `REACT_APP_WS_URL`, `REACT_APP_NODE_ENV`, `REACT_APP_NEXT_TELEMETRY_DISABLED`, `REACT_APP_ENABLE_SOURCE_MAPS`, `REACT_APP_PORT`, `REACT_APP_TRUST_PROXY`, `REACT_APP_LOG_LEVEL`, `REACT_APP_HEALTHCHECK_PATH`, `REACT_APP_FEATURE_FLAGS`, `REACT_APP_EXPERIMENTS_ENABLED`: Reserved for platform configuration.

Create a `.env` file (example):
```
REACT_APP_API_BASE=
```

## Ocean Professional Style

Primary: #2563EB
Secondary: #F59E0B
Error: #EF4444
Background: #f9fafb
Surface: #ffffff
Text: #111827

The layout uses subtle gradients, rounded corners, and shadows with smooth transitions.

## Functionality

- Create, select, edit, and delete notes
- Tag/category management
- Search and tag filtering
- Local-only mode when no backend is configured

Backend endpoints expected if provided:
- GET/POST /notes
- GET/PUT/DELETE /notes/:id
- GET/POST/DELETE /tags
