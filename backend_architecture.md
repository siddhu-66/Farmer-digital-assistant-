# Backend Architecture & API Roadmap

This document outlines the current state of the One-to-One data layer and provides a strategic roadmap for migrating from `localStorage` mocks to a production-ready RESTful/GraphQL backend.

## 1. Current "Mock Bridge" Architecture

The frontend currently uses a **Service-Oriented Architecture (SOA)** where React components interact with `Services` instead of direct API calls. These services currently persist data in `localStorage` to simulate a real database.

### Core Services

- `authService`: Handles role-based session persistence.
- `orderService`: Manages the lifecycle of customer orders (Salesman → Admin → Farmer).
- `farmerRegistrationService`: Manages KYC and verification status for farmers.
- `businessRegistrationService`: Manages KYC and verification status for corporate partners.
- `b2bService`: Handles the marketplace and contract bidding.
- `cropService`: Provides the master catalog of 25+ agricultural products.

---

## 2. API Roadmap (REST Requirements)

To transition to a live backend, the following API endpoints are required:

### A. Authentication & Roles

- `POST /api/auth/login`: Validates credentials (Username/OTP) and returns a JWT + Role.
- `GET /api/auth/me`: Validates JWT and returns current user context.

### B. KYC & Verification (Admin Control)

- `GET /api/verifications/pending`: Retrieves all pending farmer and business applications.
- `POST /api/verifications/{id}/verify`:
  - Body: `{ action: 'approve' | 'reject', reason: string }`
  - Logic: Updates status and notifies the user via push/SMS.
- `GET /api/profile/{role}/{id}`: Retrieves rich profile data for verified entities.

### C. Order Handling System (7-Step Flow)

- `POST /api/orders`: Salesman creates a new demand request.
- `GET /api/orders/admin`: Admin views all orders for fulfillment.
- `PATCH /api/orders/{id}/assign`: Admin assigns one or more farmers to an order.
- `GET /api/orders/farmer`: Farmers view their assigned requirements.
- `POST /api/orders/{id}/respond`: Farmers Accept/Reject an assignment.
- `PATCH /api/orders/{id}/status`: Updates progress from 'in-progress' to 'completed'.

---

## 3. Database Schema (Draft)

### Tables

- **Users**: `id, mobile, password_hash, role (admin|salesman|farmer|business), kyc_status`
- **Profiles**: `user_id, name, location, gps_coords, documents (JSON_URLs)`
- **Orders**: `id, salesman_id, crop_id, qty, status, assigned_farmers (M2M)`
- **Crops**: `id, name, category, base_price`

---

## 4. Unique Technical Features

- **PWA Capabilities**: Offline service for rural areas with low connectivity.
- **ML Quality Shield**: Image-based quality assessment of crops before admin approval.
- **Role-Based Sandbox**: Ensuring that only Admins can handle critical verification requests while Farmers and Salesmen operate in a task-focused environment.
