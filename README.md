A production-grade backend for financial data processing and role-based access control, built with **Node.js**, **TypeScript**, **Express**, **Prisma 7**, and **SQLite**.

---

## Live API Link
**API Base URL**: `https://assignment-1090357889526.asia-south1.run.app/api/v1`  
**Health Check**: [https://assignment-1090357889526.asia-south1.run.app/health](https://assignment-1090357889526.asia-south1.run.app/health)

> **Note for Evaluators**: This live API is deployed on **Google Cloud Run**. For demonstration purposes, the application is configured to automatically migrate and seed the SQLite database on startup. This ensures the API is always in a ready-to-test state with predefined credentials even in the ephemeral cloud environment.

---

## Design Decisions & Assumptions

### Why SQLite?

SQLite was chosen **intentionally** for this assessment project:

- **Zero-config**: No database server installation required. Clone → install → run.
- **Portable**: The entire database is a single file (`dev.db`), easy to version or reset.
- **Prisma-swappable**: The schema and all queries are fully compatible with **PostgreSQL**. To switch, change `provider = "sqlite"` to `"postgresql"` in `schema.prisma` and update `prisma.config.ts` with a PostgreSQL connection string.

### Authentication1

- Uses **bcrypt** for password hashing (salt rounds: 10).
- JWT-based authentication with configurable expiry.
- Seed script creates test users with hashed passwords and prints credentials to console.

### Architecture

Layered architecture: **Controller → Service → Repository**

- **Controller**: Request parsing, input validation (Zod), response formatting. No business logic.
- **Service**: Business rules, data transformation, access control checks.
- **Repository**: Pure Prisma queries. No business logic.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (LTS) |
| Language | TypeScript (strict mode) |
| Framework | Express |
| ORM | Prisma 7 |
| Database | SQLite (via `@prisma/adapter-better-sqlite3`) |
| Validation | Zod |
| Auth | JWT + bcrypt |
| Security | helmet, cors, express-rate-limit |
| Testing | Vitest + Supertest |

---

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/NikhilDhaliya/assignment
cd assignment-zorvyn
npm install
```

### 2. Environment

```bash
cp .env.example .env
```

### 3. Database Setup

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Seed Database (creates users + sample records)

```bash
npm run db:seed
```

This prints a credentials table:

```
┌────────────────────────────────────────────────────────────────┐
│                    LOGIN CREDENTIALS                          │
├──────────┬────────────────────────┬──────────────┬────────────┤
│ Role     │ Email                  │ Password     │ Status     │
├──────────┼────────────────────────┼──────────────┼────────────┤
│ ADMIN    │ admin@finance.com      │ admin123     │ ACTIVE     │
│ ANALYST  │ analyst@finance.com    │ analyst123   │ ACTIVE     │
│ VIEWER   │ viewer@finance.com     │ viewer123    │ ACTIVE     │
└──────────┴────────────────────────┴──────────────┴────────────┘
```

### 5. Run

```bash
npm run dev
```

Server starts at `http://localhost:3000`.

---

## API Reference

**Base URL**: `http://localhost:3000/api/v1`

All protected endpoints require: `Authorization: Bearer <token>`

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/login` | Public | Login with email + password. Returns JWT. |
| GET | `/auth/me` | Authenticated | Get current user profile. |

**Login Request:**
```json
{ "email": "admin@finance.com", "password": "admin123" }
```

**Login Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJ...",
    "user": { "id": "...", "name": "Admin User", "email": "admin@finance.com", "role": "ADMIN" }
  }
}
```

---

### Users (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users` | Create a new user |
| GET | `/users` | List users (paginated, searchable) |
| GET | `/users/:id` | Get user by ID |
| PATCH | `/users/:id` | Update user role/status |

**Query params (GET /users):** `page`, `limit`, `role`, `status`, `search`

---

### Records

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/records` | All roles | List records with filtering, search, pagination |
| GET | `/records/:id` | All roles | Get single record |
| POST | `/records` | Admin | Create financial record |
| PATCH | `/records/:id` | Admin | Update record |
| DELETE | `/records/:id` | Admin | Soft delete record |

**Query params (GET /records):** `page`, `limit`, `type` (INCOME/EXPENSE), `category`, `dateFrom`, `dateTo`, `search`, `sortBy` (date/amount/createdAt), `sortOrder` (asc/desc)

**Create Record:**
```json
{
  "amount": 5000,
  "type": "INCOME",
  "category": "Salary",
  "date": "2026-03-15T00:00:00.000Z",
  "notes": "Monthly salary"
}
```

---

### Dashboard

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/dashboard/summary` | All roles | Total income, expenses, net balance, record count |
| GET | `/dashboard/category-summary` | All roles | Category-wise income/expense breakdown |
| GET | `/dashboard/trends` | All roles | Monthly trends (last 12 months) |
| GET | `/dashboard/recent` | All roles | Last 10 transactions |

**Summary Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 19350,
    "totalExpenses": 7015,
    "netBalance": 12335,
    "totalRecords": 20
  }
}
```

---

## Access Control (RBAC)

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| View dashboard | Yes | Yes | Yes |
| View records | Yes | Yes | Yes |
| Create records | No | No | Yes |
| Update records | No | No | Yes |
| Delete records | No | No | Yes |
| Manage users | No | No | Yes |

Implemented via middleware: `authenticate` → `requireRole('ADMIN')`.

---

## Project Structure

```
src/
├── app.ts                          # Express app setup
├── server.ts                       # Entry point
├── config/
│   └── env.ts                      # Zod-validated environment config
├── constants/
│   └── roles.ts                    # Role, RecordType, UserStatus enums
├── generated/prisma/               # Prisma 7 generated client
├── lib/
│   └── prisma.ts                   # PrismaClient singleton (adapter-based)
├── middleware/
│   ├── auth.middleware.ts           # JWT verification
│   ├── role.middleware.ts           # RBAC guard
│   ├── validate.middleware.ts       # Zod validation
│   ├── error.middleware.ts          # Central error handler
│   └── rateLimit.middleware.ts      # Rate limiting
├── modules/
│   ├── auth/                       # Login, /me
│   ├── user/                       # User CRUD (schema, types, repo, service, controller, routes)
│   ├── record/                     # Financial records (CRUD + filters + search + soft delete)
│   └── dashboard/                  # Summary, category breakdown, trends, recent
├── routes/
│   └── index.ts                    # Route aggregator
├── types/
│   └── global.d.ts                 # Express type extensions
└── utils/
    ├── errors.ts                   # Custom error hierarchy
    └── response.ts                 # Consistent JSON response helpers

prisma/
├── schema.prisma                   # Data model
├── seed.ts                         # Seed script with credentials
└── migrations/                     # Migration history

prisma.config.ts                    # Prisma 7 CLI configuration
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | TypeScript compilation |
| `npm run start` | Run compiled production build |
| `npm run db:seed` | Seed database with test data |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:reset` | Reset database and re-seed |
| `npm run db:studio` | Open Prisma Studio (GUI) |
| `npm run test` | Run tests |
| `npm run lint` | TypeScript type check |

---

## Error Response Format

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Description of what went wrong",
  "code": "ERROR_CODE",
  "errors": { "field": ["Validation message"] }
}
```

**HTTP Status Codes Used:** 200, 201, 400, 401, 403, 404, 409, 422, 429, 500
