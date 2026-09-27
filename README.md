# Lead Tracker Application

A production-oriented **Lead Tracker Application** built with React, TypeScript, Node.js, Express, Prisma, and PostgreSQL.

The application is designed to efficiently manage, search, filter, and display large numbers of leads while following scalable frontend and backend architecture patterns.

---

## 🚀 Tech Stack

### Frontend

* React
* TypeScript
* React Router
* TanStack Query
* React Hook Form
* Zod
* Shadcn UI
* Magic UI
* `next-themes`
* Vercel

### Backend

* Node.js
* TypeScript
* Express.js
* Zod
* Prisma ORM
* PostgreSQL
* Neon PostgreSQL
* Helmet
* CORS
* Express Rate Limit
* Structured Logging
* Render

---

# 📁 Project Structure

```text
lead-tracker-application/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── lib/
│   │   └── ...
│   │
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── schemas/
│   │   ├── lib/
│   │   └── ...
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   └── ...
│
└── README.md
```

---

# ✨ Features

## Frontend

### React Setup

Created the frontend using React and TypeScript with a scalable project structure suitable for production development.

### Production-Oriented Architecture

The frontend architecture was designed with maintainability and scalability in mind, particularly for handling and displaying a large number of leads efficiently.

### Routing

Implemented React Router with separate routes for application pages and authentication-protected pages.

### Authentication

Added an authentication context to manage authentication state throughout the application.

Protected routes prevent unauthenticated users from accessing dashboard functionality.

### UI

Built the UI using:

* Shadcn UI
* Magic UI
* Custom responsive components
* Animations

### Theme Support

Implemented:

* Dark mode
* Light mode
* Theme persistence

using `next-themes`.

### Homepage

Created a responsive homepage using Magic UI and Shadcn UI components with animations and modern UI patterns.

### Loading Screen

Added an initial loading screen using Magic UI animations to provide visual feedback while the application initializes.

### Dashboard

Implemented the main dashboard with:

* Lead listing
* Basic animations
* Search
* Status filtering
* Loading states
* Empty states
* Error states
* Responsive layout

### API Client

Implemented a dedicated API client for communicating with the backend REST APIs.

### Search

Implemented server-side lead search to avoid unnecessarily transferring large amounts of data to the frontend.

### Status Filtering

Implemented lead status filtering through the API.

### Form Validation

Implemented Zod validation for frontend form validation.

### Responsive UI

The application is designed to work across different screen sizes.

### Production Verification

* Production build verified
* Vercel deployment verified

---

# ⚙️ Backend

## Backend Setup

Created a Node.js and Express backend using TypeScript with a modular architecture.

## Production-Oriented Architecture

The backend follows a modular structure separating responsibilities between:

* Routes
* Controllers
* Services
* Validation
* Middleware
* Database access

This makes the application easier to maintain and extend.

## Database

Implemented Prisma ORM with Neon PostgreSQL.

The database schema includes a dedicated `Lead` model for storing and managing lead information.

## Prisma + Neon

Database communication is handled through Prisma, with PostgreSQL hosted using Neon.

Basic database queries were tested to verify that schemas and records are correctly persisted.

## Health API

Added a modular health-check API to verify that the backend is running correctly.

Example:

```http
GET /api/v1/health
```

## HTTP Security

Implemented Helmet to add common HTTP security headers.

## CORS

Configured CORS to control which frontend origins can communicate with the backend API.

## Rate Limiting

Added `express-rate-limit` to protect APIs from excessive requests and reduce the risk of API abuse.

## Structured Logging

Implemented structured logging to make backend activity and errors easier to monitor and debug.

## Authentication

Reused an existing authentication implementation from a previous project and adapted it for this application.

The authentication implementation was reviewed and modified to fix integration issues and make it work with the current project architecture.

## API Security

Reviewed and fixed security vulnerabilities in the API implementation.

## Lead Schema

Created the database schema for leads and implemented the corresponding:

* Routes
* Controllers
* Services
* Validation
* Database operations

---

# 📈 Performance Considerations

The backend is designed to avoid unnecessary database queries, network transfers, and excessive response sizes.

## Pagination

Pagination prevents the API from returning the entire lead table in a single request.

Instead, the client requests a limited number of records per page.

Example:

```http
GET /api/v1/leads?page=1&limit=20
```

## Database Indexes

Database indexes are used to improve common lookup and filtering operations.

This becomes particularly important as the number of leads increases.

## Server-Side Search

Search operations are performed on the backend rather than downloading the entire dataset and filtering it in the browser.

This reduces:

* Network usage
* Browser memory usage
* Frontend processing

## Maximum Page Size

The API limits the maximum number of records that can be requested in a single response.

This prevents clients from accidentally requesting extremely large datasets.

## Selective Responses

API responses return only the fields required by the frontend instead of unnecessarily returning the entire database record.

## Connection Management

Database connections are configured with serverless deployment considerations in mind, particularly for the Neon PostgreSQL environment.

---

# 🧪 Testing

Tests have been written for the application to verify important functionality and prevent regressions.

The project has also been tested through production builds.

### Verification

* Tests written
* Production build verified
* Backend Render build verified
* Frontend Vercel deployment verified

---

# 🏗️ Architecture

```text
┌─────────────────────────────────┐
│            FRONTEND             │
│                                 │
│ React + TypeScript              │
│ TanStack Query                  │
│ React Hook Form                 │
│ Zod                             │
│ React Router                    │
│ Shadcn UI + Magic UI            │
└────────────────┬────────────────┘
                 │
                 │ HTTP / REST API
                 ▼
┌─────────────────────────────────┐
│             BACKEND             │
│                                 │
│ Node.js + TypeScript            │
│ Express                         │
│ Zod                             │
│ Prisma                          │
│ Helmet                          │
│ CORS                            │
│ Rate Limiting                   │
└────────────────┬────────────────┘
                 │
                 │
                 ▼
┌─────────────────────────────────┐
│        NEON POSTGRESQL          │
│                                 │
│             Leads               │
└─────────────────────────────────┘
```

---

# 🔐 Test Account

A test account can be used to access the application.

```json
{
  "name": "virender",
  "email": "test123@gmail.com",
  "password": "Test@123"
}
```

> **Note:** This account is intended only for assignment/demo purposes.

---

# 🌐 Deployment

The application has been verified using production builds and deployed environments.

### Frontend

Hosted on:

**Vercel**

### Backend

Hosted on:

**Render**

### Database

Hosted on:

**Neon PostgreSQL**

---

# 🔮 Future Improvements

The following features can be added in future iterations:

### Authentication Improvements

* Enhanced authentication flows
* Password reset
* Session management
* Role-based access control

### Lead Management

* Lead ownership
* Bulk lead actions
* CSV import
* CSV export
* Lead activity timeline

### Advanced Search

* Advanced filtering
* Multiple filter combinations
* Sorting
* Date-range filtering
* More lead statuses

### Performance

* Virtualized tables for very large datasets
* Further database query optimization
* Caching
* Optimistic UI updates

### Offline Support

* Offline data access
* Request synchronization
* Retry mechanisms
* Local caching

---

# 🎯 Assignment Goals

The main goals of this project were to demonstrate:

* Production-oriented React architecture
* Scalable lead management
* REST API design
* Authentication
* API validation
* Database design
* PostgreSQL integration
* Prisma ORM usage
* API security
* Rate limiting
* Server-side search
* Pagination
* Responsive UI development
* Error and loading state handling
* Production deployment

---

# 📌 Current Status

### Frontend

* [x] React setup
* [x] Production-oriented architecture
* [x] React Router
* [x] Authentication context
* [x] Protected routes
* [x] API client
* [x] Search
* [x] Status filtering
* [x] Loading states
* [x] Empty states
* [x] Error states
* [x] Zod validation
* [x] Responsive UI
* [x] Dark/light theme
* [x] Homepage
* [x] Dashboard
* [x] Loading screen
* [x] Production build
* [x] Vercel deployment

### Backend

* [x] Node.js + Express setup
* [x] TypeScript
* [x] Modular architecture
* [x] Prisma
* [x] Neon PostgreSQL
* [x] Health API
* [x] Helmet
* [x] CORS
* [x] Structured logging
* [x] Rate limiting
* [x] Authentication
* [x] API security improvements
* [x] Lead schema
* [x] Lead controllers
* [x] Lead services
* [x] Pagination
* [x] Database indexes
* [x] Server-side search
* [x] Maximum page size
* [x] Selective API responses
* [x] Tests
* [x] Production build
* [x] Render deployment verification

---

# 👨‍💻 Author

**Virender Prasad**

Full-Stack / JavaScript Developer

GitHub: `VirenderPrasad`

