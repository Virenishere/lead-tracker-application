# Lead Tracker — Frontend

A production-oriented Lead Tracker frontend built with **React, TypeScript, Vite, TanStack Query, React Hook Form, Zod, and Tailwind CSS**.

The frontend provides a responsive interface for creating leads, viewing leads, searching, filtering, paginating, and updating lead statuses.

---

## Live Application

**Production URL:**
`TODO: Add Vercel URL`

**Backend API:**
`TODO: Add backend URL`

---

# Features

## Core Features

* [ ] Create Lead
* [ ] List Leads
* [ ] Search Leads
* [ ] Filter Leads by Status
* [ ] Update Lead Status
* [ ] View Lead Details
* [ ] Pagination
* [ ] Sorting
* [ ] Responsive UI

## User Experience

* [ ] Loading states
* [ ] Skeleton loading
* [ ] Empty states
* [ ] Search empty state
* [ ] API error states
* [ ] Form validation
* [ ] Success feedback
* [ ] Error feedback
* [ ] Disabled submit while request is in progress
* [ ] Debounced search
* [ ] Responsive layout

---

# Technology Stack

| Technology            | Purpose                                  |
| --------------------- | ---------------------------------------- |
| React                 | UI development                           |
| TypeScript            | Static typing                            |
| Vite                  | Development and production build tooling |
| TanStack Query        | Server-state management                  |
| React Hook Form       | Form state management                    |
| Zod                   | Runtime validation                       |
| Tailwind CSS          | UI styling                               |
| Vitest                | Unit testing                             |
| React Testing Library | Component testing                        |

---

# Why These Technologies?

## React

React is used to build the application's interactive UI.

The application contains multiple independent UI states:

* Lead creation
* Search
* Filtering
* Pagination
* Status updates
* Loading
* Errors
* Empty results

React's component-based architecture makes these concerns easier to isolate and maintain.

---

## TypeScript

TypeScript is used throughout the frontend to provide compile-time type safety.

Types are defined for:

* Lead objects
* Lead statuses
* API responses
* API request payloads
* Pagination metadata
* Form values

This reduces runtime errors and keeps the frontend API integration predictable.

---

## Vite

Vite is used as the frontend build tool.

It provides:

* Fast development startup
* Fast Hot Module Replacement
* Simple configuration
* Optimized production builds

A larger frontend framework is unnecessary for the scope of this application.

---

## TanStack Query

TanStack Query manages server state.

Without a server-state library, components would need to manually manage:

```text
loading
error
data
refetching
cache
mutation state
```

TanStack Query centralizes these concerns.

Example:

```text
Create Lead
    ↓
POST /api/v1/leads
    ↓
Invalidate leads query
    ↓
Lead list refreshes
```

This keeps API-related logic separate from presentation logic.

---

## React Hook Form

React Hook Form is used for lead creation forms.

It provides efficient form state management and works well with schema validation.

---

## Zod

Zod provides runtime validation for frontend form data.

Example:

```text
User enters invalid email
        ↓
Zod validation
        ↓
Show validation message
```

Frontend validation improves user experience.

However, frontend validation is **not considered a security boundary**. The backend validates requests again.

---

## Tailwind CSS

Tailwind CSS is used for styling the application.

It allows the UI to maintain consistent:

* Spacing
* Typography
* Responsive layouts
* Component states
* Status indicators

---

# Frontend Architecture

The frontend follows a feature-oriented structure.

```text
                    React Application
                           │
                           ▼
                       Pages
                           │
                           ▼
                    Feature Components
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
          UI State                 Server State
              │                         │
       React Hook Form           TanStack Query
              │                         │
              ▼                         ▼
             Zod                    API Client
                                        │
                                        ▼
                                  Backend REST API
```

---

# Project Structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   └── leads/
│   │
│   ├── features/
│   │   └── leads/
│   │       ├── api/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── schemas/
│   │       ├── types/
│   │       └── utils/
│   │
│   ├── pages/
│   │   └── LeadsPage.tsx
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   └── queryClient.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
│
├── tests/
├── public/
├── .env.example
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

# Lead Feature Structure

The lead-related code is kept together:

```text
features/
└── leads/
    ├── api/
    │   └── lead.api.ts
    │
    ├── components/
    │   ├── LeadTable.tsx
    │   ├── LeadRow.tsx
    │   ├── CreateLeadForm.tsx
    │   ├── SearchBar.tsx
    │   ├── StatusFilter.tsx
    │   ├── StatusBadge.tsx
    │   └── Pagination.tsx
    │
    ├── hooks/
    │   ├── useLeads.ts
    │   ├── useCreateLead.ts
    │   └── useUpdateLeadStatus.ts
    │
    ├── schemas/
    │   └── lead.schema.ts
    │
    └── types/
        └── lead.types.ts
```

This prevents the application from becoming a large collection of unrelated components and hooks.

---

# API Integration

The frontend communicates with the backend using REST APIs.

## Endpoints

```text
GET    /api/v1/leads
POST   /api/v1/leads
GET    /api/v1/leads/:id
PATCH  /api/v1/leads/:id/status
GET    /api/v1/health
```

---

# List Leads

Example request:

```http
GET /api/v1/leads?page=1&limit=20
```

Search:

```http
GET /api/v1/leads?search=john
```

Filter:

```http
GET /api/v1/leads?status=CONTACTED
```

Sorting:

```http
GET /api/v1/leads?sortBy=createdAt&sortOrder=desc
```

---

# Search Behavior

Search input is debounced.

Instead of making a request for every character:

```text
j       → API
jo      → API
joh     → API
john    → API
```

The application waits briefly after the user stops typing:

```text
john
  ↓
300ms
  ↓
API request
```

This reduces unnecessary network requests.

---

# Pagination

The frontend uses server-side pagination.

Example response:

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

The frontend does not load the entire database into memory.

---

# UI States

Each API-driven screen should explicitly handle:

```text
Loading
   ↓
Success
   ↓
Empty
```

and:

```text
Loading
   ↓
Error
```

Examples:

### Loading

Display skeleton/table loading state.

### Empty

```text
No leads found.

Create your first lead.
```

### Search Empty

```text
No leads match "john".
```

### Error

```text
Unable to load leads.

Try again.
```

---

# Form Validation

Create Lead form:

```text
Name
Email
Phone
```

Validation should include:

* Name required
* Name minimum length
* Name maximum length
* Valid email
* Phone validation
* Maximum phone length

Validation occurs before making the API request.

The backend performs validation again.

---

# Status Management

Supported statuses:

```text
NEW
CONTACTED
QUALIFIED
CONVERTED
LOST
```

The UI should display statuses consistently using status badges.

Example:

```text
NEW
CONTACTED
QUALIFIED
CONVERTED
LOST
```

Status updates use:

```http
PATCH /api/v1/leads/:id/status
```

---

# Performance Considerations

The frontend uses:

### Server-side pagination

Prevents loading large datasets.

### Debounced search

Reduces unnecessary API requests.

### TanStack Query caching

Avoids unnecessary duplicate requests.

### Small components

Keeps rendering responsibilities isolated.

### API-driven filtering

Prevents downloading the entire dataset just to filter it in the browser.

---

# Error Handling

The frontend should never expose raw backend errors directly.

Instead:

```text
Backend
   ↓
Structured API error
   ↓
API client
   ↓
User-friendly message
```

For example:

```json
{
  "success": false,
  "error": {
    "code": "LEAD_ALREADY_EXISTS",
    "message": "A lead with this email already exists"
  }
}
```

The UI can display:

```text
A lead with this email already exists.
```

---

# Accessibility

The UI should include:

* [ ] Proper labels
* [ ] Keyboard-accessible controls
* [ ] Button states
* [ ] Focus states
* [ ] Semantic HTML
* [ ] Accessible form errors
* [ ] Sufficient text contrast
* [ ] `aria` attributes where necessary

Accessibility is considered part of the UI implementation rather than an afterthought.

---

# Testing

Testing uses:

* Vitest
* React Testing Library

## Component Tests

Test:

* [ ] Lead table rendering
* [ ] Empty state
* [ ] Search
* [ ] Create lead form
* [ ] Form validation
* [ ] Status update
* [ ] Error state

## Example

```text
User opens application
        ↓
Leads are displayed

User searches "john"
        ↓
API query updates

User creates lead
        ↓
Success
        ↓
Lead appears in list
```

Tests should focus on user behavior rather than implementation details.

---

# Environment Variables

Create `.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

Production:

```env
VITE_API_URL=https://your-backend.vercel.app
```

Never commit real environment variables.

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

Build production bundle:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

# Deployment

The frontend is deployed using Vercel.

Deployment steps:

1. Push repository to GitHub.
2. Import the frontend project into Vercel.
3. Configure `VITE_API_URL`.
4. Deploy.
5. Verify the production application.
6. Verify API requests.
7. Test create/search/update flows.

---

# Frontend Definition of Done

* [ ] React + TypeScript configured
* [ ] Vite configured
* [ ] Tailwind configured
* [ ] TanStack Query configured
* [ ] API client implemented
* [ ] Lead types implemented
* [ ] Lead form implemented
* [ ] Zod validation implemented
* [ ] Lead table implemented
* [ ] Search implemented
* [ ] Status filter implemented
* [ ] Pagination implemented
* [ ] Status update implemented
* [ ] Loading states implemented
* [ ] Empty states implemented
* [ ] Error states implemented
* [ ] Responsive UI implemented
* [ ] Accessibility reviewed
* [ ] Tests written
* [ ] Production build verified
* [ ] Vercel deployment verified

---

# Future Improvements

Potential future frontend improvements:

* Authentication
* Role-based UI
* Lead ownership
* Bulk lead actions
* CSV import/export
* Advanced filtering
* Lead activity timeline
* Dark mode
* Virtualized tables for very large datasets
* Offline support



frontend ideas using magic ui 


using pointer for mouse pointer looks goods
AnimatedThemeToggler for dark and light mode looks cools
want to use Interactive Hover Button over on hero section 
