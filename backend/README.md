# Lead Tracker — Backend

A production-oriented REST API for the Lead Tracker application built with **Node.js, TypeScript, Express, PostgreSQL, Drizzle ORM, and Zod**.

The backend provides APIs for creating, retrieving, searching, filtering, paginating, and updating leads.

The implementation focuses on clear separation of responsibilities, database integrity, validation, error handling, security, testing, and maintainability.

---

# Live API

**Production API:**
`TODO: Add Vercel backend URL`

**Health Check:**
`TODO: Add /api/v1/health URL` -- done ✅

---

# Features

## Lead Management

* [x] Create Lead -- done ✅
* [x] Get Lead -- done ✅
* [x] List Leads -- done ✅
* [x] Search Leads -- done ✅
* [x] Filter Leads -- done ✅
* [x] Sort Leads -- done ✅
* [x] Paginate Leads -- done ✅
* [x] Update Lead Status -- done ✅

## API Quality

* [x] REST API -- done ✅
* [x] API versioning -- done ✅
* [x] Request validation -- done ✅
* [x] Database constraints -- done ✅
* [x] Consistent response format -- done ✅
* [x] Centralized error handling -- done ✅
* [x] Structured logging -- done ✅
* [x] Health endpoint -- done ✅

## Security

* [x] CORS -- done ✅
* [x] Helmet -- done ✅
* [x] Rate limiting -- done ✅
* [x] Request size limits -- done ✅
* [x] JWT Authentication & User Ownership -- done ✅
* [x] Environment variables -- done ✅
* [x] Parameterized database queries -- done ✅
* [x] Production error sanitization -- done ✅

## Testing

* [ ] Unit tests
* [ ] API integration tests
* [ ] Validation tests
* [ ] Error handling tests
* [ ] Edge case tests

---

# Technology Stack

| Technology  | Purpose                   |
| ----------- | ------------------------- |
| Node.js     | Backend runtime           |
| TypeScript  | Static typing             |
| Express     | HTTP API framework        |
| PostgreSQL  | Relational database       |
| Drizzle ORM | Type-safe database access |
| Zod         | Runtime validation        |
| Pino        | Structured logging        |
| Vitest s     | Testing                   |
| Supertest   | HTTP API testing          |

---

# Why These Technologies?

## Node.js

Node.js is suitable for this application because the API is primarily I/O-bound.

Most operations involve:

```text
HTTP Request
     ↓
Validation -- done ✅
     ↓
Database Query
     ↓
HTTP Response
```

Node.js handles this workload efficiently without introducing unnecessary infrastructure.

---

# Why TypeScript?

TypeScript provides compile-time safety for:

* API request objects
* API response objects
* Database models
* Service functions
* Repository functions
* Configuration

Strict typing also makes refactoring safer.

---

# Why Express?

Express is intentionally used instead of a larger framework.

The application has a relatively small domain and only a few resources.

Express allows the request lifecycle to remain explicit:

```text
Request
   ↓
Middleware
   ↓
Validation
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
PostgreSQL
```

This keeps the implementation understandable without adding unnecessary framework abstractions.

---

# Why PostgreSQL?

PostgreSQL is used because lead data is structured and benefits from relational database guarantees.

Important requirements include:

* Unique email
* Valid status
* Required fields
* Indexed queries
* Consistent timestamps

PostgreSQL provides these features through database-level constraints.

Database constraints are important because application-level validation alone cannot guarantee data integrity under concurrent requests.

---

# Why Drizzle?

Drizzle provides a type-safe database layer while keeping SQL concepts visible.

It provides:

* Type-safe queries
* Schema definitions
* Migrations
* PostgreSQL support
* TypeScript integration

The goal is to avoid hiding important database behavior behind unnecessary abstraction.

---

# Why Zod?

Zod validates untrusted API input at runtime.

Example:

```text
POST /api/v1/leads
        ↓
Zod validation
        ↓
Valid request
        ↓
Controller
```

Invalid requests are rejected before business logic or database operations execute.

---

# Why Pino?

Pino provides structured logging.

Instead of:

```text
console.log("something happened")
```

the application can produce structured request logs such as:

```text
POST /api/v1/leads 201 32ms
GET /api/v1/leads 200 15ms
PATCH /api/v1/leads/:id 404 8ms
```

This makes production debugging easier.

---

# Architecture

The backend follows a modular layered architecture.

```text
                    HTTP Request
                         │
                         ▼
                       Router
                         │
                         ▼
                  Validation Middleware
                         │
                         ▼
                     Controller
                         │
                         ▼
                       Service
                         │
                         ▼
                     Repository
                         │
                         ▼
                    PostgreSQL
```

---

# Responsibilities

## Routes

Routes define HTTP endpoints.

Example:

```text
POST /api/v1/leads
GET  /api/v1/leads
GET  /api/v1/leads/:id
PATCH /api/v1/leads/:id/status
```

Routes should not contain business logic.

---

## Validation Middleware

Validation is responsible for verifying request data before it reaches application logic.

Example:

```text
Request
  ↓
Zod schema
  ↓
Valid → Controller
Invalid → 400
```

---

## Controllers

Controllers handle HTTP-specific concerns.

They are responsible for:

* Reading request data
* Calling services
* Returning HTTP responses
* Mapping service results to API responses

Controllers should remain thin.

---

## Services

Services contain business logic.

Examples:

```text
createLead()
getLead()
getLeads()
updateLeadStatus()
```

A service can handle decisions such as:

```text
Does this email already exist?
Is this status valid?
Does the requested lead exist?
```

---

## Repositories

Repositories contain database access.

Examples:

```text
findLeadById()
findLeadByEmail()
findLeads()
createLead()
updateLeadStatus()
```

This keeps database logic separate from business logic.

---

# Project Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── env.ts
│   │
│   ├── controllers/
│   │   └── lead.controller.ts
│   │
│   ├── db/
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   └── migrations/
│   │
│   ├── errors/
│   │   ├── AppError.ts
│   │   └── errorHandler.ts
│   │
│   ├── middleware/
│   │   ├── validate.ts
│   │   ├── requestLogger.ts
│   │   └── ...
│   │
│   ├── repositories/
│   │   └── lead.repository.ts
│   │
│   ├── routes/
│   │   └── lead.routes.ts
│   │
│   ├── schemas/
│   │   └── lead.schema.ts
│   │
│   ├── services/
│   │   └── lead.service.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── tests/
│   ├── leads.test.ts
│   ├── health.test.ts
│   └── ...
│
├── .env.example
├── package.json
├── tsconfig.json
└── drizzle.config.ts
```

---

# Database Schema

The main entity is `leads`.

```text
leads
────────────────────
id
name
email
phone
status
created_at
updated_at
```

## Status

```text
NEW
CONTACTED
QUALIFIED
CONVERTED
LOST
```

---

# Database Constraints

The database should enforce important invariants.

```text
id
    → Primary Key

name
    → NOT NULL

email
    → NOT NULL
    → UNIQUE

status
    → NOT NULL
    → Valid status

created_at
    → NOT NULL

updated_at
    → NOT NULL
```

Application validation improves the API experience, while database constraints provide the final integrity boundary.

---

# Database Indexes

Indexes should be added for common query patterns.

Potential indexes:

```text
email
status
created_at
```

Indexes should be based on actual query requirements rather than adding indexes to every column.

---

# API Versioning

All application APIs are versioned:

```text
/api/v1/...
```

Example:

```text
GET /api/v1/leads
```

Versioning allows future API changes without immediately breaking existing clients.

---

# API Endpoints

## Health

```http
GET /api/v1/health
```

Response:

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

---

# Create Lead

```http
POST /api/v1/leads
```

Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919999999999"
}
```

Success:

```http
201 Created
```

---

# List Leads

```http
GET /api/v1/leads
```

Supported query parameters:

```text
page
limit
search
status
sortBy
sortOrder
```

Example:

```http
GET /api/v1/leads?page=1&limit=20
```

---

# Search

```http
GET /api/v1/leads?search=john
```

Search can match:

```text
name
email
phone
```

Search is performed server-side.

This avoids downloading all leads to the frontend.

---

# Filter

```http
GET /api/v1/leads?status=CONTACTED
```

---

# Sorting

```http
GET /api/v1/leads?sortBy=createdAt&sortOrder=desc
```

Only supported fields should be accepted.

The API should not directly interpolate arbitrary user-provided values into SQL.

---

# Pagination

Example:

```http
GET /api/v1/leads?page=2&limit=20
```

The API should enforce a maximum page size.

For example:

```text
minimum limit = 1
default limit = 20
maximum limit = 100
```

If the client sends:

```text
limit=100000
```

the API should reject or safely clamp the value.

---

# Get Lead

```http
GET /api/v1/leads/:id
```

If the lead does not exist:

```http
404 Not Found
```

---

# Update Lead Status

```http
PATCH /api/v1/leads/:id/status
```

Request:

```json
{
  "status": "CONTACTED"
}
```

Only supported statuses are accepted.

---

# API Response Format

Success:

```json
{
  "success": true,
  "data": {}
}
```

List response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": []
  }
}
```

Keeping a consistent response format makes frontend integration simpler.

---

# Error Handling

The backend uses centralized error handling.

Expected errors include:

```text
400 Bad Request
401 Unauthorized        # future
403 Forbidden            # future
404 Not Found
409 Conflict
429 Too Many Requests
500 Internal Server Error
```

Example:

```text
Database error
     ↓
Repository
     ↓
Service
     ↓
Error middleware
     ↓
Safe API response
```

Internal stack traces and database implementation details should not be exposed in production.

---

# Duplicate Leads

Email is treated as unique.

If an existing email is submitted:

```http
409 Conflict
```

Example:

```json
{
  "success": false,
  "error": {
    "code": "LEAD_ALREADY_EXISTS",
    "message": "A lead with this email already exists"
  }
}
```

The uniqueness constraint exists at the database level as well.

This protects against race conditions where two requests arrive simultaneously.

---

# Security

The backend implements basic API security.

## CORS

Only configured frontend origins should be allowed in production.

## Helmet

Security-related HTTP headers are enabled.

## Rate Limiting

Rate limiting protects endpoints from excessive requests.

## Request Size Limits

Large unexpected request bodies are rejected.

## Validation

All externally supplied data is validated.

## Database Queries

Queries are parameterized through Drizzle rather than constructed using raw user input.

## Environment Variables

Secrets are stored in environment variables.

---

# Input Validation

Create Lead:

```text
name
    required
    minimum length
    maximum length

email
    required
    valid email

phone
    optional
    validated length/format
```

Status:

```text
NEW
CONTACTED
QUALIFIED
CONVERTED
LOST
```

Query parameters should also be validated.

---

# Production Edge Cases

## Create Lead

* [ ] Missing name
* [ ] Empty name
* [ ] Very long name
* [ ] Invalid email
* [ ] Duplicate email
* [ ] Invalid phone
* [ ] Missing email

## Get Lead

* [ ] Invalid ID
* [ ] Non-existing ID

## Update Status

* [ ] Invalid status
* [ ] Non-existing lead
* [ ] Missing status

## Search

* [ ] Empty search
* [ ] No results
* [ ] Long search string
* [ ] Special characters

## Pagination

* [ ] Page less than 1
* [ ] Limit less than 1
* [ ] Limit above maximum
* [ ] Page beyond available data

## Database

* [ ] Connection failure
* [ ] Unique constraint failure
* [ ] Unexpected database error

---

# Testing

Testing uses:

* Vitest
* Supertest

## API Tests

```text
POST /leads
    ✓ creates lead
    ✓ rejects invalid input
    ✓ rejects duplicate email

GET /leads
    ✓ returns leads
    ✓ searches leads
    ✓ filters by status
    ✓ paginates results

GET /leads/:id
    ✓ returns lead
    ✓ returns 404 for missing lead

PATCH /leads/:id/status
    ✓ updates status
    ✓ rejects invalid status
    ✓ returns 404 for missing lead
```

---

# Environment Variables

Create `.env`:

```env
DATABASE_URL=
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

Production:

```env
DATABASE_URL=
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
```

Never commit `.env`.

Commit:

```text
.env.example
```

---

# Local Development

Install dependencies:

```bash
npm install
```

Run database migrations:

```bash
npm run db:migrate
```

Start development server:

```bash
npm run dev
```

Run tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Typecheck:

```bash
npm run typecheck
```

Build:

```bash
npm run build
```

Start production build:

```bash
npm start
```

---

# Database Development

The project uses migrations rather than manually modifying the production database.

Typical workflow:

```text
Modify schema
     ↓
Generate migration
     ↓
Review migration
     ↓
Run migration
     ↓
Database updated
```

Migration files are committed to Git.

---

# Deployment

The backend is deployed using Vercel.

Production deployment requires:

```text
DATABASE_URL
NODE_ENV
CORS_ORIGIN
```

Deployment checklist:

* [ ] Production PostgreSQL created
* [ ] Production database URL configured
* [ ] Migrations executed
* [ ] Backend deployed to Vercel
* [ ] Environment variables configured
* [ ] CORS configured
* [ ] Health endpoint verified
* [ ] Create lead tested
* [ ] Search tested
* [ ] Status update tested
* [ ] Error responses tested

---

# Why Docker Is Not Required

Docker is intentionally not part of the deployment architecture.

The backend is deployed using Vercel and PostgreSQL is provided by a managed PostgreSQL service.

Adding Docker would introduce additional configuration without providing significant value for this small assignment.

Docker can be introduced later if:

* Self-hosting becomes necessary
* Multiple services are introduced
* Local environment parity becomes important
* Container-based deployment is required

---

# Why CI/CD Is Not Required

The project is deployed using Vercel's deployment workflow.

A dedicated CI/CD pipeline is outside the core scope of the assignment.

The priority is:

```text
Correctness
   ↓
Architecture
   ↓
Testing
   ↓
Deployment
```

A GitHub Actions workflow can be added later for:

```text
Lint
Typecheck
Tests
Build
Deployment gates
```

---

# Performance Considerations

The backend is designed to avoid unnecessary database and network work.

### Pagination

Prevents returning the entire lead table.

### Database indexes

Support common lookup and filtering operations.

### Server-side search

Avoids transferring unnecessary records.

### Maximum page size

Prevents clients from requesting extremely large datasets.

### Selective responses

Only required fields should be returned.

### Connection management

Database connections should be configured appropriately for the serverless deployment environment.

---

# Architectural Trade-offs

## PostgreSQL vs MongoDB

PostgreSQL was selected because the lead data is structured and benefits from:

* Constraints
* Unique fields
* Indexes
* Transactions
* Relational querying

---

## Express vs NestJS

Express was selected because the application is small and does not require the additional abstractions of NestJS.

The application still maintains separation through:

```text
Controller
Service
Repository
```

---

## REST vs GraphQL

REST was selected because the application has a small number of resource-oriented operations.

GraphQL would introduce unnecessary complexity for this use case.

---

## Drizzle vs Raw SQL

Drizzle provides type safety while keeping SQL concepts visible.

Raw SQL could provide more direct control, but Drizzle reduces repetitive database code while retaining explicit query behavior.

---

## No Redis

Redis is unnecessary at the current scale.

Potential future use cases include:

* Caching
* Rate limiting
* Background jobs
* Distributed locks

---

## No Elasticsearch

PostgreSQL search is sufficient for the expected lead volume.

A dedicated search engine would only be introduced if search requirements or dataset size justified it.

---

## No Microservices

The backend is intentionally a modular monolith.

The application has a small domain and does not currently benefit from distributed services.

Keeping the system as one deployable application reduces operational complexity.

---

# Backend Definition of Done

## Project Setup

* [x] Node.js configured -- done ✅
* [x] TypeScript configured -- done ✅
* [x] Strict TypeScript enabled -- done ✅
* [x] Environment validation configured -- done ✅

## Database

* [x] PostgreSQL configured -- done ✅
* [x] Prisma configured -- done ✅
* [x] Lead schema created -- done ✅
* [x] User schema created -- done ✅
* [x] Unique email constraint -- done ✅
* [x] Status constraint -- done ✅
* [x] Indexes added -- done ✅

## API

* [x] `/api/v1/health` -- done ✅
* [x] `POST /api/v1/auth/register` -- done ✅
* [x] `POST /api/v1/auth/login` -- done ✅
* [x] `GET /api/v1/auth/me` -- done ✅
* [x] `POST /api/v1/leads` -- done ✅
* [x] `GET /api/v1/leads` -- done ✅
* [x] `GET /api/v1/leads/:id` -- done ✅
* [x] `PATCH /api/v1/leads/:id` -- done ✅
* [x] `PATCH /api/v1/leads/:id/status` -- done ✅
* [x] `DELETE /api/v1/leads/:id` -- done ✅
* [x] Search -- done ✅
* [x] Filtering -- done ✅
* [x] Sorting -- done ✅
* [x] Pagination -- done ✅

## Validation

* [x] Request schemas -- done ✅
* [x] Query parameter validation -- done ✅
* [x] Status validation -- done ✅
* [x] ID validation -- done ✅
* [x] Database constraints -- done ✅

## Errors

* [x] AppError -- done ✅
* [x] ErrorList -- done ✅
* [x] ValidationError -- done ✅
* [x] Centralized error middleware -- done ✅
* [x] Consistent error responses -- done ✅
* [x] Production error logging & sanitization -- done ✅

## Security

* [x] CORS -- done ✅
* [x] Helmet -- done ✅
* [x] Rate limiting -- done ✅
* [x] Request size limits -- done ✅
* [x] No secrets in Git -- done ✅
* [x] Parameterized queries -- done ✅
* [x] JWT Authentication & User Ownership -- done ✅

## Future Improvements

* [x] Authentication -- done ✅
* [x] Lead ownership -- done ✅
* [ ] Notes
* [ ] CSV import/export
* [ ] Advanced search
* [ ] Redis caching
* [ ] Audit logs
* [ ] Observability
* [ ] Lead activity history
* [ ] Background jobs
* [ ] Bulk operations
* [ ] Email notifications
* [ ] CI/CD
* [ ] Horizontal scaling



<!-- $$$$ -->
<!-- rough work  -->



```
enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  CONVERTED
  LOST
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  leads     Lead[]

  @@map("users")
}

model Lead {
  id        String     @id @default(uuid())
  name      String
  email     String
  phone     String
  status    LeadStatus @default(NEW)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  userId    String
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([userId, status])
  @@map("leads")
}
```

<br />
<br />
<br />
<br />


# 1. getLeads({search,filters,sortBy,sortOrder,page,limit})
# 2. createLead()
# 3. getLeadById()
# 4. searchLeads()
# 5. updateLeadStatus()

