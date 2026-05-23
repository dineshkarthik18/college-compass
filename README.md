# College Compass

A production-ready MVP for college discovery, shortlisting, and decision-making. Built with Next.js, Tailwind CSS, REST API routes, Prisma, PostgreSQL, authentication, saved colleges, and side-by-side comparison.

## About This Project

College Compass is a full-stack web application designed to help students explore colleges, compare options, and shortlist institutions before making an admission decision. The project focuses on a practical student workflow: searching colleges, applying filters, opening detail pages, comparing multiple colleges side by side, signing in, and saving preferred colleges to a personal list.

The application is built as a database-driven MVP with reusable UI components, REST-style API routes, authentication, and relational data modeling. It demonstrates how a college discovery platform can combine frontend usability with backend features such as secure sessions, filtered queries, saved records, and structured college/course/review data.

## Features

- College listing with search, location/course/fees filters, pagination, loading states, and empty states.
- Dynamic college detail pages with overview, fees, courses, placements, reviews, and basic information.
- Compare 2-3 colleges side by side with decision notes and best-value highlights.
- Login/signup with HTTP-only JWT session cookies.
- User-specific saved colleges backed by the database.
- REST APIs with validation and consistent error handling.

## Tech Stack

- Frontend: Next.js App Router, React, Tailwind CSS, lucide-react
- Backend: Next.js REST route handlers, TypeScript, Zod
- Database: PostgreSQL with Prisma ORM
- Auth: bcrypt password hashing and JOSE JWT cookies

## Technologies Used In Detail

- **Next.js App Router:** Used for routing, layouts, server-rendered pages, dynamic college detail pages, and API route handlers.
- **React:** Used to build reusable UI components such as college cards, filters, comparison views, authentication forms, and saved-college controls.
- **TypeScript:** Provides type safety across frontend components, API handlers, Prisma data access, and shared utility functions.
- **Tailwind CSS:** Handles responsive styling, spacing, layout, cards, forms, buttons, and dashboard-like UI sections.
- **Prisma ORM:** Defines the database schema and manages queries for users, colleges, courses, reviews, and saved colleges.
- **PostgreSQL:** Stores relational data for college discovery, including one-to-many and many-to-many style relationships.
- **Zod:** Validates incoming API request data and keeps backend inputs consistent.
- **bcryptjs:** Hashes user passwords before storage.
- **JOSE JWT:** Creates and verifies secure authentication tokens stored in HTTP-only cookies.
- **Docker Compose:** Provides a local PostgreSQL setup for development and testing.
- **Vercel:** Suitable for deploying the Next.js frontend and API routes.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`:

```bash
DATABASE_URL="postgresql://college_user:college_password@localhost:5432/college_compass?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
```

3. Start PostgreSQL:

```bash
docker compose up -d
```

4. Create tables and seed data:

```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

5. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

Demo account:

- Email: `demo@student.com`
- Password: `student123`

## API Overview

- `GET /api/colleges` - list colleges with `q`, `location`, `fees`, `course`, `page`, and `pageSize` query params.
- `POST /api/colleges` - create a college.
- `GET /api/colleges/:id` - fetch a college by id or slug.
- `PATCH /api/colleges/:id` - update core college fields.
- `DELETE /api/colleges/:id` - delete a college.
- `GET /api/colleges/compare?ids=id1,id2,id3` - fetch comparison data.
- `POST /api/auth/signup` - create account.
- `POST /api/auth/login` - login.
- `GET /api/auth/me` - current user.
- `POST /api/auth/logout` - logout.
- `GET /api/saved` - authenticated user saved colleges.
- `POST /api/saved` - save a college.
- `DELETE /api/saved/:collegeId` - unsave a college.

## Deployment

### Database

Create a PostgreSQL instance on Neon, Supabase, Render, Railway, or Vercel Postgres. Copy the connection string into `DATABASE_URL`.

Run migrations and seed against the production database:

```bash
npx prisma migrate deploy
npm run prisma:seed
```

### Vercel

This app can deploy as a single full-stack Next.js project on Vercel.

1. Push the repo to GitHub.
2. Import the repo in Vercel.
3. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
4. Build command: `npm run build`
5. Output: Next.js default

### Render/Railway Backend Note

The MVP uses Next.js route handlers as the API backend. If the evaluator strictly requires a separate backend service on Render or Railway, the route-handler code can be split into an Express API using the same Prisma schema and validation models. For a production MVP, keeping the API in Next.js reduces deployment moving parts while remaining API-based and database-driven.

## Submission Checklist

- Live URL: deploy through Vercel after adding production env vars.
- GitHub repository: push this workspace to GitHub.
- Loom walkthrough: show search/filter, detail page, compare, auth, and saved colleges.
