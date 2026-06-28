# Student OS

A MERN stack personal hub for students — manage todos, classes, events, and hackathons in one place.

## Stack

- **Frontend:** React (Vite), Tailwind CSS, shadcn-style UI — deployed on **Vercel**
- **Backend:** Node.js, Express — deployed on **Render**
- **Database:** MongoDB Atlas (Mongoose)
- **Auth:** JWT email + password, **Google OAuth**

## Features

- Student registration and login (email or Google)
- **Dashboard** — overview of todos, classes, events, and hackathons
- **Calendar** — month view of recurring classes and one-off events
- **Todos** — tasks with priorities, due dates, and browser reminders
- **Classes** — weekly schedule with color-coded courses
- **Events** — workshops, meetups, career fairs, and more
- **Hackathons** — track competitions with status
- **Profile** — avatar, major, year, notification preferences

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- MongoDB Atlas cluster (or local MongoDB)
- Google OAuth Client ID (optional, for Google sign-in)

## Setup

### 1. Install dependencies

```powershell
npm.cmd run install:all
```

### 2. Configure environment

**Backend** — copy `backend/.env.example` to `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-long-random-secret
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your-google-client-id
```

**Frontend** — copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

Leave `VITE_API_URL` empty for local dev (Vite proxies `/api` to port 5000).

### 3. Run the app

```powershell
npm.cmd run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## Deployment

See **[DEPLOY.md](./DEPLOY.md)** for step-by-step instructions to deploy on Render + Vercel + MongoDB Atlas.

## API routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/google` | Google OAuth sign-in |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| CRUD | `/api/todos` | Manage todos |
| CRUD | `/api/classes` | Manage classes |
| CRUD | `/api/events` | Manage events |
| CRUD | `/api/hackathons` | Manage hackathons |

All resource routes require a `Bearer` token in the `Authorization` header.
