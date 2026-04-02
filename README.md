# TT Assessment — Full-Stack Developer Technical Assessment

NestJS + TypeORM + PostgreSQL solution covering middleware, interceptors, entities, query builder, and paginated endpoints.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | v18+ |
| npm | v9+ |
| PostgreSQL | v14+ |
| NestJS CLI | latest |

Install NestJS CLI globally:
```bash
npm install -g @nestjs/cli
```

---

## Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/tt-assessment.git
cd tt-assessment
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create the database
```bash
psql -U postgres
CREATE DATABASE transforma_db;
\q
```

### 4. Configure environment
Copy the example file and fill in your credentials:
```bash
cp .env.example .env
```

Edit `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_NAME=transforma_db
PORT=3000
```

### 5. Run the server
```bash
npm run start:dev
```

TypeORM will automatically create all tables on first run (`synchronize: true`).

Server starts at: **http://localhost:3000**

---

## API Endpoints

All endpoints (except `/health`) require the `x-tenant-id` header.

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/health` | Health check (no auth needed) |
| GET | `/employees` | Paginated employee list |
| GET | `/employees/:id` | Single employee by ID |
| GET | `/employees/stats/departments` | Active employee count per department |
| GET | `/employees/stats/on-leave` | Employees on leave in a date range |
| GET | `/employees/stats/top-earners` | Top 3 highest-paid per department |

### Query parameters for `GET /employees`

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page |
| `search` | string | — | Search by name or email |
| `department` | string | — | Filter by department |
| `sortBy` | string | createdAt | Sort field |
| `order` | ASC/DESC | DESC | Sort direction |

### Example requests
```bash
# Health check (no header needed)
curl http://localhost:3000/health

# List employees (header required)
curl -H "x-tenant-id: tenant1" http://localhost:3000/employees

# Paginated + search + sort
curl -H "x-tenant-id: tenant1" \
  "http://localhost:3000/employees?page=1&limit=5&search=ali&sortBy=salary&order=DESC"

# Filter by department
curl -H "x-tenant-id: tenant1" \
  "http://localhost:3000/employees?department=Engineering"

# Missing header → 400 error (expected behaviour)
curl http://localhost:3000/employees

# Employees on leave in a date range
curl -H "x-tenant-id: tenant1" \
  "http://localhost:3000/employees/stats/on-leave?startDate=2025-04-01&endDate=2025-04-07"

# Top earners per department
curl -H "x-tenant-id: tenant1" \
  http://localhost:3000/employees/stats/top-earners
```

---

## Response Format

All successful responses are wrapped automatically (Q2 — TransformInterceptor):
```json
{
  "success": true,
  "data": {},
  "timestamp": "2025-03-26T10:30:00.000Z",
  "path": "/employees"
}
```

All errors follow this format (Q2 — HttpExceptionFilter):
```json
{
  "success": false,
  "error": "Tenant ID is required",
  "statusCode": 400,
  "timestamp": "2025-03-26T10:30:00.000Z",
  "path": "/employees"
}
```

---

## Project Structure
```
src/
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts     # Q2 - error formatter
│   ├── interceptors/
│   │   └── transform.interceptor.ts     # Q2 - response wrapper
│   └── middleware/
│       └── tenant.middleware.ts         # Q1 - tenant validation
├── employees/
│   ├── dto/
│   │   └── get-employees-query.dto.ts   # Q5 - query params DTO
│   ├── entities/
│   │   ├── employee.entity.ts           # Q3 - Employee entity
│   │   └── leave-request.entity.ts      # Q3 - LeaveRequest entity
│   ├── employees.controller.ts          # Q4, Q5 - routes
│   ├── employees.module.ts
│   └── employees.service.ts             # Q4, Q5 - business logic
├── app.controller.ts                    # /health route
├── app.module.ts                        # global wiring
└── main.ts                              # bootstrap
```

---

## Scripts
```bash
npm run start:dev    # development with hot reload
npm run start:prod   # production build
npm run build        # compile TypeScript
npm run test         # unit tests
```

---

## Assessment Coverage

| Question | Topic | File |
|----------|-------|------|
| Q1 | Multi-tenant middleware | `common/middleware/tenant.middleware.ts` |
| Q2 | Response interceptor + error filter | `common/interceptors/` + `common/filters/` |
| Q3 | TypeORM entities with enums & cascade | `employees/entities/` |
| Q4 | QueryBuilder — dept counts, leave overlap, top earners | `employees.service.ts` |
| Q5 | Paginated endpoint with search/filter/sort | `employees.controller.ts` + `employees.service.ts` |
| Q6 | Pipes explanation | README / PDF |
| Q7 | Database indexes explanation | README / PDF |
| Q8 | JavaScript array functions | README / PDF |
| Q9 | TypeORM relations | README / PDF |
| Q10 | NestJS decorators | `employees.controller.ts` |