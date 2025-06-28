# Vacation Portal

This mono‑repo contains both the **Backend API** and the **Frontend React** application for the Vacation Portal assignment.

---

## Table of Contents

* [Overview](#overview)
* [Prerequisites](#prerequisites)
* [Environment Variables](#environment-variables)
* [Backend (server)](#backend-server)

  * [Setup](#setup)
  * [Running](#running)
  * [Testing](#testing)
* [Frontend (client)](#frontend-client)

  * [Setup](#setup-1)
  * [Running](#running-1)
* [Docker Development](#docker-development)
* [Project Structure](#project-structure)

---

## Overview

A full‑stack vacation management portal:

* **Backend**: Node.js HTTP server (no framework) with routing, JWT auth, Knex migrations & seeds, SQLite storage.
* **Frontend**: React (Vite) app with login, manager & employee dashboards, and Bootstrap styling.

This README provides step‑by‑step instructions to set up, run, and test the project.

---

## Prerequisites

* **Node.js** v18+ (LTS)
* **npm** (bundled with Node)
* **Docker** & **docker-compose** (optional, for containerized development)

---

## Environment Variables

Copy `.env.example` in each folder and provide real values:

* **server/.env.example**

  ```dotenv
  PORT=3000
  DB_FILE=./data.sqlite
  JWT_SECRET=your-secret-key
  ```

* **client/.env.example**

  ```bash
  VITE_API_URL=http://localhost:3000
  ```

---

## Backend (server)

### Setup

```bash
# from repo root
cd server
npm install
cp .env.example .env       # fill in values
```

### Running

```bash
# run migrations & seeds, then start server:
npm run migrate
npm run seed
npm run dev
```

Server listens on `http://localhost:3000`.

### Testing

```bash
npm test    # runs Vitest + Supertest integration tests
```

---

## Frontend (client)

### Setup

```bash
# from repo root
cd client
npm install
cp .env.example .env       # ensure VITE_API_URL is set
```

### Running

```bash
npm run dev
```

App runs at `http://localhost:5173`.

---

## Docker Development

To run both services in containers:

```bash
# from repo root
docker-compose up --build
```

* **API** available at `http://localhost:3000`
* **Web** available at `http://localhost:5173`

Database file `server/data.sqlite` persists on host.

---

## Project Structure

```
vacation-portal/
├── client/          # React + Vite frontend
│   ├── src/
│   ├── static/
│   ├── Dockerfile
│   ├── package.json
│   └── ...
├── server/          # Node.js API
│   ├── migrations/
│   ├── seeds/
│   ├── src/
│   ├── Dockerfile
│   ├── knexfile.js
│   └── package.json
├── docker-compose.yml
└── README.md        # this file
```

---

## Aknowledgements

Thank you for checking out this project.  
Contributions or feedback are appreciated.  
Developed by *Christos Gkaldanidis*.
