# Local development

## URLs

| Service | URL |
|---------|-----|
| Client (Next.js) | http://localhost:3000 |
| Server (Express) | http://localhost:5000 |
| Health check | http://localhost:5000/api/health |

Use **localhost** (not `127.0.0.1`) in the browser so cookies and CORS match `FRONTEND_ORIGIN`.

## Prerequisites

1. **Node.js** 20+
2. **MongoDB** running locally

### Start MongoDB

Default connection (from `server/.env`):

```
mongodb://localhost:27017/farmer_assistant
```

Examples:

- **Windows:** `net start MongoDB`
- **macOS:** `brew services start mongodb-community`
- **Docker:** `docker run -d -p 27017:27017 --name farmer-mongo mongo:7`

If MongoDB is not running, the server prints a short message and exits.

## Environment variables

### `server/.env` (copy from `server/.env.example`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Yes (dev) | Must be `5000` in local development |
| `MONGO_URI` | Yes | MongoDB connection string |
| `FRONTEND_ORIGIN` | Yes | `http://localhost:3000` |
| `JWT_SECRET` | Dev optional | Min 16 characters |
| `OPENWEATHER_API_KEY` | Optional | Live weather; fallback data if unset |

### `client/.env.local` (copy from `client/.env.example`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:5000` |
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` |
| `BACKEND_URL` | `http://localhost:5000` (Next.js rewrites / socket) |

## Run both apps

From the repository root:

```bash
npm install
npm run dev
```

Or separately:

```bash
npm run dev:server   # http://localhost:5000
npm run dev:client   # http://localhost:3000
```

## Verify connection

```bash
curl http://localhost:5000/api/health
```

Expected:

```json
{ "success": true, "message": "Backend connected", "status": "OK" }
```

In the browser: http://localhost:3000/test-api → **Test Backend Connection**

## Weather architecture

| Use case | Route | Handler |
|----------|-------|---------|
| Analytics dashboard | `/api/weather?type=current` | Next.js → OpenWeather |
| Pincode (`WeatherCard`) | `/api/weather/by-pincode/:pincode` | Next rewrite → Express |
| Socket updates | Server `/api/weather` | Express |

## Port conflicts

If port **5000** is busy, free it (do not change `PORT` in development):

```bash
# Windows
netstat -ano | findstr :5000
taskkill /F /PID <PID>
```
