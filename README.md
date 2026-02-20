# Codex Blog (MERN + TailwindCSS)

A full-stack blog website built with the MERN stack and styled with TailwindCSS.

## Features

- User registration and login (JWT auth)
- Protected routes for creating/editing/deleting posts
- Public home page with search
- Post detail page
- Author-only post management
- Attractive responsive UI with TailwindCSS

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- Frontend: React (Vite), React Router, TailwindCSS

## Project Structure

- `backend/` Express API + MongoDB models/routes
- `frontend/` React client + Tailwind UI

## Setup

### 1) Backend

```bash
cd backend
npm install
copy .env.example .env
```

Update `.env` with your MongoDB connection string and JWT secret.

Run backend:

```bash
npm run dev
```

### 2) Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173` and API on `http://localhost:5000`.

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/posts`
- `GET /api/posts/:id`
- `POST /api/posts`
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`

## Notes

- You must run MongoDB locally or provide a cloud connection URI.
- Only the post author can edit/delete their posts.
