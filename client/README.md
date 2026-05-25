# One-to-One - Full Stack

The modern, high-performance digital assistant for the One-to-One platform, built with Next.js 15, Tailwind CSS 4, and Prisma.

## 🚀 Quick Start

### 1. Installation

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install
```

### 2. Database Setup (SQLite)

We use SQLite for local development. Follow these steps to initialize your database:

```bash
# Generate Prisma Client
npx prisma generate

# Create the database and sync schema
npx prisma db push

# Seed initial data (Farmers, Mandi Prices, Crops)
npx prisma db seed
```

### 3. Running the App

```bash
# Start the development server (Frontend + Backend APIs)
npm run dev
```

---

## 📡 Data Fetching (Frontend ↔ Backend)

To fetch data from the backend APIs, use the integrated `apiRequest` utility:

```typescript
import { apiRequest } from '@/lib/api';

// Example: Fetching active crops
const data = await apiRequest('/api/crops/active');
```

### Simulation vs. Real API

Toggle between mock data and real database data using the `.env` file:

- `NEXT_PUBLIC_REAL_API=true`: Connects to real Next.js API routes and Prisma DB.
- `NEXT_PUBLIC_REAL_API=false`: Uses frontend simulations (safe for offline testing).

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database**: [Prisma](https://www.prisma.io/) with **SQLite**
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Languages**: Multilingual support for **English, Hindi, Punjabi, Marathi, Telugu**.

## 📂 Project Structure

```text
frontend/
├── prisma/             # Database schema and seeding
├── src/
│   ├── app/api/        # Backend API Routes (Auth, AI, Weather, Crops)
│   ├── app/            # Pages and layouts
│   ├── services/       # Frontend service layers
│   ├── lib/api.ts      # Unified fetch utility
│   └── context/        # Auth and Language state
```

## 🎨 Key Features

- **AI Analytics**: Crop recommendations and yield predictions.
- **Market Price Sync**: Real-time mandi price tracking.
- **Weather Insights**: Precision forecasts for agricultural operations.
- **Multi-Role Support**: Customer, Salesman, and Admin dashboards.

---

## 📤 Exporting & Deployment

1. **Static Export**: Run `npm run build` after adding `output: 'export'` to `next.config.ts`.
2. **Production Build**: Standard `npm run build` generates optimized files in the `.next/` folder.
3. **Source Code**: ZIP the `frontend` folder (excluding `node_modules`).

---

## 📄 License

Private Project - FarmerAssistant Team.
