# Vacation Portal

## Monorepo layout

- `/server` — Node.js + Knex API  
- `/client` — React (Vite) frontend  

## Getting Started

### Prerequisites

- Node.js v16+  
- npm (or yarn)  

### Backend

```bash
cd server
npm install
cp .env.example .env
# edit .env to set DB_FILE and JWT_SECRET
npx knex migrate:latest
npx knex seed:run
npm run dev
