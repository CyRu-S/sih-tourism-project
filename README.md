# Voyage

An Expo SDK 54 tourism app with a Spring Boot backend, Supabase PostgreSQL database, live crowd-aware recommendations, and route support.

## Project layout

- `frontend/` — Expo SDK 54 mobile/web application.
- `backend/` — Spring Boot API and merged recommendation engine.
- `database/` — Supabase schema, indexes, and safe demo seed scripts.

## Run locally

Install the Expo SDK 54 dependencies:

```sh
cd frontend
npm ci
```

Optionally copy `frontend/.env.example` to `frontend/.env`. By default, the browser uses `http://localhost:8010` and the Android emulator uses `http://10.0.2.2:8010`; a physical phone must use the computer's LAN address.

Copy `backend/.env.example` to `backend/.env`, add the Supabase JDBC details, then start the API:

```sh
cd backend
mvn spring-boot:run
```

In another terminal, start the app:

```sh
cd frontend
npx expo start
```

`npm run web` is also supported. Native Android keeps the interactive map; web presents compatible recommendation and route-summary screens.

## Database setup

Execute the scripts in `database/sql/` in numeric order. They are safe to rerun and include the merged Member 3 data plus a small Kolkata demo set used by the frontend. Member 5 data is not included or changed.

## API endpoints

- `GET /api/v1/health`
- `POST /api/v1/recommendations`
- `GET /api/v1/places/{id}?originLat=...&originLng=...`
- `GET /api/v1/places/{id}/route?originLat=...&originLng=...&mode=foot-walking`

Recommendations are scored by the merged AI engine using distance, interests, hiddenness, crowd, accessibility, and curation. Distance affects rank but is deliberately not a hard filter, so the complete active dataset remains available. Crowd estimates come from the `crowd_profiles` table for the current India time bucket. If `ORS_API_KEY` is absent, route requests return a usable straight-line estimate instead of failing.

Never commit `.env` files, database passwords, Supabase URLs, or API keys.
