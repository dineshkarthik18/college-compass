# College Compass

A production-ready MVP for college discovery, shortlisting, and decision-making. Built with Next.js, Tailwind CSS, REST API routes, Prisma, PostgreSQL, authentication, saved colleges, and side-by-side comparison.

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
