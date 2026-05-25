# One-to-One Technical Master Blueprint

This document provides a comprehensive technical guide for developing the **Order Handling System**, bridging the current glassmorphic frontend with a scalable production-ready backend.

---

## 1. System Architecture Overview

The system follows a **Service-Oriented Architecture (SOA)**, transitioning from a `localStorage` mock layer to a secure REST/GraphQL backend.

### The "Bridge" Strategy

1. **Frontend**: Next.js (React) + Tailwind CSS + Lucide Icons.
2. **Current Layer**: Mock Services (e.g., [orderService.ts](file:///c:/Users/siddh/New%20folder/frontend/src/services/orderService.ts), `authService.ts`).
3. **Future Layer**: [Supabase](https://supabase.com/) or [PostgreSQL](https://postgresql.org/) via [Prisma ORM](https://prisma.io/).

---

## 2. Recommended Tech Stack (Sources)

For a professional, scalable deployment, use the following "Sources":

| Component | Technology | Documentation Source |
| :--- | :--- | :--- |
| **Backend** | Next.js API Routes / Node.js | [Next.js Docs](https://nextjs.org/docs) |
| **Database** | PostgreSQL + Supabase | [Supabase Docs](https://supabase.com/docs) |
| **ORM** | Prisma | [Prisma Docs](https://www.prisma.io/docs) |
| **Auth** | Auth.js (NextAuth) | [Auth.js Docs](https://authjs.dev/docs) |
| **Real-time** | Ably or Supabase Realtime | [Ably Docs](https://ably.com/docs) |
| **State Sync** | TanStack Query (React Query) | [TanStack Docs](https://tanstack.com/query/latest) |
| **Media** | Cloudinary / AWS S3 | [Cloudinary Docs](https://cloudinary.com/documentation) |

---

## 3. Core API Roadmap

To support the **7-Step Order Lifecycle**, implement the following endpoints:

### A. Authentication & KYC

- `POST /api/auth/login`: Issue JWT and resolve role (`admin`, `salesman`, `farmer`, `business`).
- `GET /api/profile/{id}`: Fetch rich profile metadata + verification status.
- `POST /api/admin/verify`: Approve/Reject KYC with automated SMS notification triggers.

### B. Order Execution (The Core Flow)

- `POST /api/orders`: Salesman creates demand request.
- `GET /api/orders/admin`: Unified queue for admin oversight.
- `PATCH /api/orders/{id}/assign`: Admin assigns Farmers to specific orders.
- `POST /api/orders/{id}/status`: Track lifecycle from [Pending](file:///c:/Users/siddh/New%20folder/frontend/src/services/farmerRegistrationService.ts#82-90) → `Assigned` → `Completed`.

---

## 4. Database Schema Design (PostgreSQL)

```prisma
// schema.prisma snippet
model User {
  id           String        @id @default(uuid())
  mobile       String        @unique
  role         Role          @default(FARMER)
  kycStatus    Status        @default(PENDING)
  orders       Order[]       // As Salesman
  assignments  Assignment[]  // As Farmer
}

model Order {
  id           String        @id @default(uuid())
  crop         String
  quantity     Float
  status       OrderStatus   @default(PENDING)
  assignedBy   User          @relation(fields: [adminId], references: [id])
}
```

---

## 5. UI/UX Philosophy & Accessibility

- **Glassmorphism**: High transparency sidebar (`backdrop-blur-2xl`) for immersive navigation.
- **Identity Awareness**: Role-specific themes (Green for Farmer, Blue for Salesman, Black for Admin).
- **Responsive PWA**: Offline capabilities for rural users via [Next-PWA](https://www.npmjs.com/package/next-pwa).
- **Security**: Strict role-based routing (e.g., `AdminGuard.tsx`) to protect sensitive verification data.

---

## 6. Implementation Checklist

- [ ] Connect `Prisma` to a live PostgreSQL (Supabase/Neon) instance.
- [ ] Implement `JWT` security on all `/api` routes.
- [ ] Replace `localStorage` setters with [fetch()](file:///c:/Users/siddh/New%20folder/frontend/src/components/shared/KYCStatusBanner.tsx#28-38) calls using `TanStack Query`.
- [ ] Configure `AWS S3` or `Cloudinary` buckets for secure document storage.
