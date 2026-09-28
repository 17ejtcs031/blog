# WriteSpace Blog Platform

WriteSpace is a full-stack blog platform built with Next.js, Prisma, and SQLite. It supports public browsing for readers and authenticated author workflows for creating and managing posts.

## Features

- Public blog homepage with published posts
- User authentication with login and registration
- Protected dashboard for authors to create, draft, publish, archive, and delete posts
- Post preview and editor experience
- Like and comment support for logged-in readers
- Prisma schema with users, categories, posts, tags, likes, and comments
- Seeded demo data for local testing

## Tech Stack

- Next.js 16 App Router
- React 19
- Prisma ORM with SQLite
- Tailwind CSS
- JWT-based session cookies
- shadcn-style UI components

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create the environment file:

```bash
cp .env.example .env
```

3. Generate the database and seed demo data:

```bash
npx prisma db push
npm run seed
```

4. Start the app:

```bash
npm run dev
```

5. Open http://localhost:3000

## Demo Credentials

- Email: demo@example.com
- Password: Demo@123

## Product Screens

- Public homepage: http://localhost:3000/
- Login: http://localhost:3000/login
- Dashboard: http://localhost:3000/dashboard
- Posts management: http://localhost:3000/posts
- Editor: http://localhost:3000/editor

## Project Structure

```bash
src/
  app/
    api/            # Authentication and blog APIs
    (auth)/         # Login, register, forgot password screens
    (dashboard)/   # Protected author dashboard pages
  components/      # Reusable UI
  lib/             # Auth, validations, utilities, Prisma config
prisma/
  schema.prisma     # Database model
  seed.ts           # Demo content
```

## API Overview

### Public endpoints

- GET /api/posts/public
  - Returns published posts, optionally filtered by slug
- GET /api/posts/[id]
  - Returns a published post or an author-owned post for authenticated users

### Authenticated endpoints

- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout
- GET /api/auth/session

### Blog interaction endpoints

- POST /api/posts/[id]/comments
- GET /api/posts/[id]/comments
- POST /api/posts/[id]/like

## Demo Recording Guidance

To create the 2-minute walkthrough, run the app locally and capture:

1. Public homepage browsing
2. Registration or login flow
3. Writing a new draft post in the dashboard
4. Publishing the post
5. Opening the public blog post and adding a like/comment

## Architecture Summary

The project follows a standard Next.js App Router structure:

- Public pages are accessible without authentication and display published content.
- Protected dashboard routes enforce session validation via middleware and JWT cookies.
- Prisma serves as the database layer for users, categories, posts, tags, likes, and comments.
- Blog read/write actions are split between public browsing routes and protected author APIs.

For the full technical design and API contracts, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
