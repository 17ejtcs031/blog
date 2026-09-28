# WriteSpace Architecture and API Documentation

## Overview

WriteSpace is a user-specific blog platform in which anonymous visitors can browse published posts, while authenticated users can create, manage, and publish their own content. Readers who are logged in can also like posts and leave comments.

## Architecture

### Frontend

- Next.js App Router
- React 19 components
- Tailwind CSS styling
- shadcn-style reusable UI primitives

### Backend

- Next.js route handlers under src/app/api
- Prisma ORM connected to SQLite for local development
- JWT session cookies for auth

### Data model

Key entities:

- User
  - id, name, email, password, profile metadata
- Post
  - title, slug, subtitle, content, excerpt, status, category, tags, likes, comments
- Category
  - blog taxonomy for posts
- Comment
  - reader feedback attached to a post
- Like
  - one like per user per post
- Idea
  - saved concept records for author planning
- Media
  - uploaded images/assets

## Authentication flows

1. User registers through /register.
2. Server hashes password and creates a session cookie.
3. Middleware protects dashboard routes and enforces JWT checks.
4. Authenticated users are redirected away from login/register pages.

## Public vs protected experience

Public routes:

- /
- /blog/[slug]
- /login
- /register

Protected author routes:

- /dashboard
- /posts
- /editor
- /analytics
- /settings
- /profile

## Core API contracts

### GET /api/posts/public

Optional query param:

- slug: fetch a specific published post by slug

Returns:

- published post object or array of posts

### GET /api/posts/[id]

Returns a post by ID, as long as:

- the post is published, or
- the authenticated session belongs to the author

### POST /api/posts/[id]/comments

Authenticated only.

Request body:

```json
{
  "content": "I enjoyed this article."
}
```

Response:

```json
{
  "comment": {
    "id": "...",
    "content": "I enjoyed this article.",
    "author": {
      "id": "...",
      "name": "Jane",
      "avatar": null
    }
  }
}
```

### POST /api/posts/[id]/like

Authenticated only.

Toggles the current user's like status.

Response:

```json
{
  "liked": true,
  "likes": 42
}
```

### POST /api/auth/login

Request body:

```json
{
  "email": "demo@example.com",
  "password": "Demo@123"
}
```

Response:

```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "Alex Johnson",
    "email": "demo@example.com"
  }
}
```

### POST /api/auth/register

Request body:

```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "StrongPass!123",
  "confirmPassword": "StrongPass!123"
}
```

## Local development workflow

1. Install dependencies:
   npm install
2. Copy environment file:
   cp .env.example .env
3. Push Prisma schema:
   npx prisma db push
4. Seed demo data:
   npm run seed
5. Launch app:
   npm run dev

## Demo flow for the assignment

Suggested 2-minute walkthrough:

1. Open home page and browse published blogs.
2. Click login and authenticate with demo credentials.
3. Open the dashboard and create a draft post.
4. Publish the post and review the preview.
5. Return to the public blog page, like the post, and add a comment.

## Deployment notes

- Replace SQLite with Postgres or MySQL in production.
- Set a secure AUTH_SECRET in production.
- Use HTTPS and secure cookies for production sessions.
- Validate environment variables before deployment.
