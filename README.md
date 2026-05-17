# social-blogging-app

A full-stack social blogging application built with React + Vite on the frontend and Express + TypeScript on the backend.

## Repository structure

- `client/` - React + Vite frontend
- `server/` - Express + TypeScript backend

## Requirements

- Node.js 18+ / npm
- PostgreSQL
- Redis

## Setup

### 1. Install dependencies

From the repository root:

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

#### Server

Create a `.env` file in `server/` with the following variables:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_SSL=false
REDIS_LOCALHOST=redis://localhost:6379
REDIS_PASSWORD=
```

Notes:
- `PORT` defaults to `5000` when not set.
- `DB_SSL=true` enables SSL for Postgres, otherwise it is disabled.
- `REDIS_PASSWORD` can remain empty for a local Redis instance without auth.

#### Client

Create a `.env` file in `client/` with the API base URL:

```env
VITE_SOCIAL_BLOGGING_API_BASE_URL=http://localhost:5000/api
```

### 3. Start the apps

Start the backend in one terminal:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

The frontend should be available at `http://localhost:5173` and will call the backend at `http://localhost:5000/api`.

## Useful scripts

### Server

- `npm run dev` - start backend with `nodemon`
- `npm run start` - run backend with `ts-node`
- `npm run build` - compile TypeScript to `dist`
- `npm run serve` - run built backend from `dist`

### Client

- `npm run dev` - start Vite development server
- `npm run build` - build the frontend for production
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint

## Notes

- The backend uses PostgreSQL via Sequelize.
- Redis is used for caching and requires `REDIS_LOCALHOST` in the server `.env`.
- The client reads the API base URL from `VITE_SOCIAL_BLOGGING_API_BASE_URL`.
- If you change the frontend port, update `CLIENT_URL` in the server `.env`.
