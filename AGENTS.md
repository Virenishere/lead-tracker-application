# AGENTS.md

## AI Assistance & Development Notes

This project was developed with the help of multiple AI assistants for research, debugging, architecture discussions, and development support.

AI tools were used primarily to speed up research and troubleshooting. The resulting code and implementation were reviewed, adapted, and integrated into the project manually.

---

# OpenAI ChatGPT

## 1. TypeScript Backend Setup

Used ChatGPT to understand and set up TypeScript for the Node.js/Express backend.

Topics discussed:

* TypeScript configuration
* `tsconfig.json`
* TypeScript project structure
* TypeScript with Express
* Development and production configuration

---

## 2. Running TypeScript During Development

Used ChatGPT to understand how to run TypeScript files during development in a workflow similar to `nodemon`.

This helped with setting up a development workflow using TypeScript execution/watch tooling so that changes to backend source files automatically restart the development server.

---

## 3. Prisma 7 Database Setup

Used the Prisma documentation along with ChatGPT to understand the Prisma 7 setup and integrate Prisma with the backend.

Topics included:

* Prisma 7 configuration
* Prisma schema setup
* PostgreSQL configuration
* Neon PostgreSQL
* Prisma client generation
* Database connection setup
* Running basic database queries
* Understanding the Prisma 7 adapter-based setup

The final database configuration was adapted to the project's backend structure.

---

## 4. Backend Architecture

Used ChatGPT to discuss scalable backend architecture and ways to improve the initial project structure.

Topics included:

* Modular Express architecture
* Controllers
* Services
* Routes
* Middleware
* Validation
* Database access
* Separation of responsibilities
* API versioning
* Maintainability and scalability

The suggestions were used as architectural references while implementing the backend.

---

## 5. Backend Performance

Used ChatGPT to discuss ways to avoid unnecessary database and network operations.

Topics included:

* Pagination
* Maximum page size
* Server-side search
* Selective database fields
* Database indexes
* Efficient API responses
* Database connection management

These considerations were incorporated into the lead APIs.

---

# Claude

## 1. Security Review & Architecture

Used Claude to review the project's backend technology stack and discuss security considerations.

The project architecture was also shared as a technology-stack diagram to get feedback on the overall structure.

Topics included:

* Backend security
* API security
* Express security practices
* HTTP security headers
* CORS
* Rate limiting
* Authentication
* Backend architecture

---

## 2. Backend Optimization & Database Efficiency

Used Claude to discuss ways to optimize the backend while maintaining security.

Topics included:

* Avoiding unnecessary database queries
* Efficient database operations
* Pagination
* Search optimization
* Database indexes
* API response optimization
* Request limits
* Security middleware
* Production considerations

The suggestions were evaluated and applied where relevant to the project.

---

# Gemini

## 1. Debugging Existing Authentication Code

Gemini was used to help identify breakpoints and integration issues in authentication code that had previously been developed in an older personal codebase.

Instead of implementing authentication from scratch, the existing authentication implementation was reused and adapted for this assignment.

Gemini was primarily used to:

* Locate integration issues
* Identify broken sections
* Understand errors
* Suggest fixes
* Help adapt the existing authentication code to the new project structure

Reusing the existing implementation reduced development time and allowed more time to be spent on the main assignment requirements such as lead management, API design, database operations, security, and performance.

---

# AI Usage Principles

AI assistance was used as a development aid rather than as a replacement for implementation and decision-making.

The general workflow was:

```text
Identify Problem
      │
      ▼
Research / Ask AI
      │
      ▼
Understand Suggested Approach
      │
      ▼
Review & Validate
      │
      ▼
Adapt to Project
      │
      ▼
Implement
      │
      ▼
Test
      │
      ▼
Fix Issues
```

AI-generated suggestions were not blindly copied into the project. They were reviewed and modified according to the project's requirements, existing codebase, and deployment environment.

---

# AI Tools Used

| Tool           | Primary Usage                                                               |
| -------------- | --------------------------------------------------------------------------- |
| OpenAI ChatGPT | TypeScript setup, development workflow, Prisma 7, architecture, performance |
| Claude         | Security review, architecture, backend optimization, database efficiency    |
| Gemini         | Debugging and adapting existing authentication code                         |

---

# Human Implementation

The final project implementation includes manual development, integration, debugging, testing, and deployment verification.

Key areas implemented and verified include:

* Frontend architecture
* React Router
* Authentication context
* Protected routes
* Lead management UI
* API client
* Search
* Status filtering
* Zod validation
* Loading/error/empty states
* Responsive UI
* Backend architecture
* Express APIs
* Prisma 7
* Neon PostgreSQL
* Lead schema
* Controllers
* Services
* Security middleware
* Rate limiting
* Pagination
* Database indexes
* Server-side search
* API response optimization
* Tests
* Production builds
* Vercel deployment
* Render deployment
