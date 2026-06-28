# Deployment Guide — Student OS

Deploy the **backend on Render**, the **frontend on Vercel**, and use **MongoDB Atlas** for the database.

## 1. MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster.
2. Create a database user and note the username/password.
3. Under **Network Access**, allow `0.0.0.0/0` (or Render's IP range for production).
4. Copy your connection string, e.g.:
   ```
   mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/student-os
   ```

## 2. Google OAuth (optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials.
2. Create an **OAuth 2.0 Client ID** (Web application).
3. Add authorized JavaScript origins:
   - `http://localhost:5173`
   - `https://your-app.vercel.app`
4. Copy the **Client ID** — use the same value for both backend and frontend env vars.

## 3. Deploy backend (Render)

1. Push this repo to GitHub.
2. Go to [Render](https://render.com) → **New → Web Service**.
3. Connect your repo. Render will detect `render.yaml`, or configure manually:
   - **Root directory:** `backend`
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Set environment variables:

   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | Your Atlas connection string |
   | `JWT_SECRET` | Long random string |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLIENT_URL` | `https://your-app.vercel.app` |
   | `GOOGLE_CLIENT_ID` | Your Google client ID |

5. Deploy. Note your API URL, e.g. `https://student-os-api.onrender.com`.

## 4. Deploy frontend (Vercel)

1. Go to [Vercel](https://vercel.com) → **New Project** → import your repo.
2. Set **Root Directory** to `frontend`.
3. Set environment variables:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://student-os-api.onrender.com/api` |
   | `VITE_GOOGLE_CLIENT_ID` | Same Google client ID |

4. Deploy. Vercel will run `npm run build` automatically.

## 5. Final checks

- Visit your Vercel URL and register / sign in.
- If CORS errors appear, confirm `CLIENT_URL` on Render exactly matches your Vercel URL (no trailing slash).
- For Google login, both origins must be listed in Google Cloud Console.
- Render free tier sleeps after inactivity — first request may take ~30s to wake up.

## Local development

```powershell
# Backend .env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=local-dev-secret
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your-client-id

# Frontend .env
VITE_API_URL=
VITE_GOOGLE_CLIENT_ID=your-client-id
```

Leave `VITE_API_URL` empty locally — Vite proxies `/api` to `localhost:5000`.

Run with:

```powershell
npm.cmd run dev
```
