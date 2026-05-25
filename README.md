# Farmer Assistant

Monorepo: **Express + MongoDB** API server and **Next.js** web client.

## Folder structure

```
.
├── client/                 # Next.js frontend (port 3000)
│   ├── public/
│   ├── src/
│   │   ├── app/            # Pages & API routes (Next)
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/            # apiClient, auth, API base URL
│   │   └── services/
│   ├── package.json
│   └── .env.local          # copy from .env.example
├── server/                 # Express API (port 5000)
│   ├── src/
│   │   ├── app.js          # Express app
│   │   ├── server.js       # Entry point
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── tests/
│   ├── package.json
│   └── .env                # copy from .env.example
├── ml-service/             # Optional Python ML helpers
├── docs/
├── package.json            # Root scripts (dev, ci)
└── README.md
```

## Install

From the repository root:

```bash
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

Or install each package once:

```bash
npm --prefix server install
npm --prefix client install
```

## Environment variables

### `server/.env` (copy from `server/.env.example`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Yes (dev) | Must be `5000` locally |
| `MONGO_URI` | Yes | MongoDB connection string |
| `FRONTEND_ORIGIN` | Yes | `http://localhost:3000` (CORS) |
| `JWT_SECRET` | Dev optional | Min 16 characters |
| `OPENWEATHER_API_KEY` | Optional | Live pincode weather |

### `client/.env.local` (copy from `client/.env.example`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:5000` |
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` |
| `BACKEND_URL` | `http://localhost:5000` (Next rewrites) |

Use **localhost** (not `127.0.0.1`) so cookies and CORS match.

## Development

Start MongoDB, then from the repo root:

```bash
npm run dev
```

| Command | Description |
|---------|-------------|
| `npm run dev` | Client + server together |
| `npm run dev:client` | http://localhost:3000 |
| `npm run dev:server` | http://localhost:5000 |
| `npm run build` | Production Next.js build |
| `npm run ci` | Server tests + client build + lint |

Health check: http://localhost:5000/api/health

More detail: **[docs/LOCAL_DEVELOPMENT.md](docs/LOCAL_DEVELOPMENT.md)**
