# Smart Logistics (Clean)

This repository contains a cleaned split of the Smart Logistics project into separate apps for shippers, drivers, and the API layer.

Based on the current codebase, the repo contains:

- `apps/web-shipper`: shipper-facing React app for requesting, tracking, and paying for shipments
- `apps/web-driver`: driver-facing React app for login, dashboard views, shipment handling, and map-based tracking
- `services/api`: Node.js + Express API with MongoDB, JWT auth, shipment routes, and Stripe payment handling

Tailwind CSS is not present in the current repo. Both frontend apps are Create React App projects.

## Tech Stack

- Frontend: React 18, Create React App, Axios
- Frontend UI: Sass, Bootstrap / React Bootstrap, Material UI, styled-components
- Frontend state: Redux Toolkit and redux-persist in `web-shipper`
- Maps: Google Maps JavaScript API via `@react-google-maps/api`
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Auth: JWT, bcrypt
- Payments: Stripe

## Repository Structure

```text
smart-logistics-clean/
├── apps/
│   ├── web-driver/
│   │   ├── public/
│   │   └── src/
│   └── web-shipper/
│       ├── public/
│       └── src/
├── services/
│   └── api/
│       ├── models/
│       └── routes/
├── docs/
└── scripts/
```

Notes:

- `docs/` and `scripts/` are currently empty.
- There is no root `package.json`; installs and commands are run per app/service.

## Prerequisites

- Node.js and npm
- MongoDB connection string
- Google Maps API key for map-enabled screens
- Stripe keys if the payment flow is required

Node.js version is `To be confirmed` because no version file or engines field is currently defined.

## Environment Variables

No `.env.example` files are included in the repo right now.

### Backend: `services/api`

Required by the current code:

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGO_URL` | Yes | MongoDB connection string used in `services/api/index.js` |
| `JWT_SEC` | Yes | JWT signing/verification secret used in auth middleware and routes |
| `STRIPE_SECRET_KEY` | Yes for payments | Secret key used by `services/api/routes/stripe.js` |
| `PORT` | No | API port, defaults to `5000` |

### Frontend: `apps/web-shipper`

Required by the current code:

| Variable | Required | Purpose |
| --- | --- | --- |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Yes | Google Maps loader key |
| `REACT_APP_STRIPE` | Yes for payments | Stripe publishable key used in the payment page |

Notes:

- The shipper app does not currently use an environment variable for the API base URL.
- Multiple shipper pages call `http://localhost:5000` directly in source code, so production API configuration is still `To be confirmed`.

### Frontend: `apps/web-driver`

Required by the current code:

| Variable | Required | Purpose |
| --- | --- | --- |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Yes | Google Maps loader key |

Notes:

- The driver app does not currently use an environment variable for the API base URL.
- API requests are currently pointed at `http://localhost:5000` in source code.

## Local Setup

Install dependencies for each app separately:

```bash
cd services/api
npm install

cd ../../apps/web-shipper
npm install

cd ../web-driver
npm install
```

Create environment files or set environment variables for:

- `services/api`
- `apps/web-shipper`
- `apps/web-driver`

The exact file naming can follow standard Node.js / CRA conventions such as `.env`, but the repo does not currently provide templates.

## Run Locally

### Backend

There is no `start` or `dev` script in `services/api/package.json` yet.

Run the API from `services/api` with:

```bash
node index.js
```

Optional for local development:

```bash
npx nodemon index.js
```

The API listens on `PORT` or falls back to `5000`.

### Shipper Frontend

From `apps/web-shipper`:

```bash
npm start
```

### Driver Frontend

From `apps/web-driver`:

```bash
npm start
```

Both frontend apps are Create React App projects and default to port `3000`. If you run both at the same time, the second app will need a different port.

## Build Commands

### Shipper Frontend

From `apps/web-shipper`:

```bash
npm run build
```

Output: `apps/web-shipper/build`

### Driver Frontend

From `apps/web-driver`:

```bash
npm run build
```

Output: `apps/web-driver/build`

### Backend

No build step is defined. The API is a plain Node.js service and currently runs directly from source.

## Third-Party Services

The current repo directly depends on:

- MongoDB
- Google Maps JavaScript API with Places library
- Stripe

## Deployment Notes

This repo is not yet fully deployment-ready without a small amount of configuration cleanup.

Checklist before deployment:

- Set backend env vars: `MONGO_URL`, `JWT_SEC`, `STRIPE_SECRET_KEY` if payments are enabled
- Set frontend env vars for Google Maps and Stripe where needed
- Replace hardcoded `http://localhost:5000` API URLs in both frontend apps with environment-driven configuration
- Decide where each frontend will be hosted; the backend does not currently serve frontend build assets
- Restrict CORS for production origins; the API currently uses open `cors()` configuration
- Add a backend `start` script if the deployment platform expects one
- Confirm how secrets and environment files will be managed because no `.env.example` files are included

## Known Limitations / To Be Confirmed

- No root workspace scripts are provided
- No backend npm `start` or `dev` script is defined
- Frontend API base URLs are hardcoded to localhost instead of env-based values
- No checked-in env templates are available
- A separate admin frontend was not found in this clean repo, although admin role handling exists in backend auth routes

