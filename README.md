# 3D Resume Portfolio

A full-stack 3D interactive resume website built with React, React Three Fiber, Tailwind CSS, Express, MongoDB, and JWT authentication.

## Features

- Immersive 3D resume scene with clickable sections and animated camera moves
- Dynamic GitHub project sync with MongoDB fallback
- Admin dashboard with JWT login and live resume/project editing
- Dark/light mode, particles, loading states, typing intro, and responsive layout

## Folder Structure

```text
client/
server/
server/controllers/
server/models/
server/routes/
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment files:

- `cp server/.env.example server/.env`
- `cp client/.env.example client/.env`

3. Update the MongoDB and JWT values in the env files.

4. Start the backend:

```bash
npm run dev:server
```

5. Start the frontend in another terminal:

```bash
npm run dev:client
```

## Default Admin

The server seeds an admin user on first run using:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Change those values in `server/.env` before first launch.

## API Routes

- `POST /api/login`
- `GET /api/resume`
- `PUT /api/resume`
- `GET /api/projects`
- `POST /api/projects`
- `DELETE /api/projects/:id`

## Deployment

### Frontend on Vercel

- Set `VITE_API_BASE_URL` to your deployed backend URL plus `/api`
- Build command: `npm run build --workspace client`
- Output directory: `client/dist`

### Backend on Render or Railway

- Root directory: `server`
- Start command: `npm start`
- Add all values from `server/.env.example`

### MongoDB Atlas

- Create a cluster
- Add your IP or deploy platform IP range
- Put the Atlas URI into `MONGODB_URI`

## Notes

- If the GitHub API rate-limits or fails, the app automatically serves stored manual projects from MongoDB.
- The frontend expects the backend under `/api` by default.
