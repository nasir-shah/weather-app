<!-- .github/copilot-instructions.md - Guidance for AI coding agents working on this project -->

# Weather App — Copilot Instructions

Purpose: help an AI coding agent be immediately productive in this small Express/HBS weather app.

- **Big picture**: This is a single-process Express server (`src/app.js`) that serves static assets from `public/`, renders Handlebars views from `templates/views`, and exposes a JSON endpoint `/weather` used by client JS at `public/js/app.js`.

- **Request flow**: Client hits `/weather?address=...` -> `src/app.js` calls `geocode(location, callback)` (in `src/utils/geocode.js`) -> extract `longitude`, `latitude`, `place` from Mapbox response -> call `forecast(lon,lat,callback)` (in `src/utils/forecast.js`) -> return JSON with `temperature`, `place`, `feels_like`.

- **Key files**:
  - `src/app.js`: app entry, routes, view/partial registration, static dir. Example: the `/weather` route expects `req.query.address`.
  - `src/utils/geocode.js`: calls Mapbox Geocoding API using `request`; returns full `response` in callback.
  - `src/utils/forecast.js`: calls OpenWeatherMap using `request`; returns `response.body.main` (contains `temp`, `feels_like`).
  - `public/js/app.js`: client fetch to `/weather?address=` and updates `#message-1`/`#message-2`.
  - `templates/views/*.hbs` and `templates/partials/*`: Handlebars views and shared header/footer.

- **Dependencies & run**:
  - Start the app: `npm start` (runs `node src/app.js`).
  - Main deps in `package.json`: `express`, `hbs`, `request`, `node-fetch` (note: code uses `request`).

- **Project-specific conventions / patterns**:
  - Views are in `templates/views` and partials in `templates/partials`; `app.js` sets these custom paths (not the default `views/`).
  - Static assets served from `public/` via `express.static(...)`; client script path in `index.hbs` is `./js/app.js` relative to served root.
  - The code uses Node-style callbacks (error-first) in utility modules instead of Promises/async-await.
  - Route handlers send either `res.render(view, ...)` for pages or `res.send({...})` for JSON API responses.

- **Data shapes & examples**:
  - `/weather` success response (example):
    ```json
    { "temperature": 23.5, "place": "Erlangen", "feels_like": 22.1 }
    ```
  - If `geocode` or `forecast` fail, the route returns `{ error: '...' }`.

- **Integration points / external deps**:
  - Mapbox Geocoding API: token is currently hard-coded in `src/utils/geocode.js`.
  - OpenWeatherMap API: appid is currently hard-coded in `src/utils/forecast.js`.
  - Both APIs are called with `request` library and expect JSON responses.

- **Security / maintenance notes (discoverable in code)**:
  - API keys/tokens are committed in source; prefer moving to environment variables (e.g., `process.env.MAPBOX_TOKEN`, `process.env.OWM_KEY`).
  - `request` is used; it's deprecated upstream — consider migrating utilities to `node-fetch` or `axios` if making edits.

- **Debugging & developer workflow**:
  - App uses `process.env.PORT || 3000` — set `PORT` when running on a host.
  - Startup command: `npm start` (no test suite present). Use `console.log` statements (already used in `src/app.js`) for quick debugging.

- **When modifying code, follow these patterns**:
  - Preserve callback-style in `src/utils/*` unless you refactor all call sites to Promises/async-await.
  - Keep view variables consistent with current templates: `index.hbs` expects `title`, partials expect `name`.
  - Client expects `#message-1` and `#message-2` IDs in rendered pages — changes to DOM must maintain these selectors or update `public/js/app.js` accordingly.

- **Examples of safe edits**:
  - Replace hard-coded API keys with `process.env` lookups and add a short migration note in README.
  - Switch `request` to `node-fetch` inside `src/utils/*`, but update the callback signatures or add a thin wrapper to keep existing routes working.

If anything here is unclear or you want me to add operational steps (like Dockerfile or CI), tell me which area to expand. Feedback welcome before I push any refactors.
