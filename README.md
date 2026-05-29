# Farmer Digital Assistant

Production-ready monorepo with:
- `client`: Next.js frontend (App Router)
- `server`: Express + MongoDB backend API

## Final project structure

```text
Farmer-Digital-Assistant/
├── client/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── lib/
│   │   └── styles/
│   ├── public/
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.js
│   └── .env.local
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── prisma/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validations/
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/
│   ├── tests/
│   ├── package.json
│   └── .env
├── package.json
└── README.md
```

## Environment setup

### `server/.env`

```env
PORT=5000
MONGO_URI=
JWT_SECRET=
```

### `client/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

## Install

From repository root:

```bash
npm install
npm --prefix server install
npm --prefix client install
```

## Run in development

```bash
# both apps
npm run dev

# backend only
npm run dev:server

# frontend only
npm run dev:client
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- Health route: `http://localhost:5000/api/health`

## Build and verify

```bash
# backend tests
npm --prefix server test

# frontend type/build checks
npm --prefix client run lint
npm --prefix client run build
```

## Core features

- Role-based flows: Farmer, Business, Admin
- Auth with cookie + token fallback support
- Sell-request workflow (`PENDING` → `FORWARDED_TO_BUSINESS` → business decision)
- Crop listings, bids, orders, schemes, partner and market/weather modules
- Centralized API client and env-driven API base URLs
