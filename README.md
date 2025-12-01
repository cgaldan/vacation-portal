# Vacation Portal

This mono‑repo contains both the **Backend API** and the **Frontend React** application for the Vacation Portal assignment.

---

## Table of Contents

* [Overview](#overview)
* [Prerequisites](#prerequisites)
* [Getting Started](#getting-started)
* [Default Seeded Users](#default-seeded-users)
* [Project Structure](#project-structure)

---

## Overview

A full‑stack vacation management portal:

* **Backend**: Node.js HTTP server (no framework) with routing, JWT auth, Knex migrations & seeds, SQLite storage.
* **Frontend**: React (Vite) app with login, manager & employee dashboards, and Bootstrap styling.

---

## Prerequisites

* **Docker** & **Docker Compose**

---

## Getting Started

Run both services with a single command:

```bash
docker-compose up --build
```

That's it! The application will:
- Install all dependencies
- Run database migrations and seeds
- Start both backend and frontend services

Access the application at:
* **Frontend**: `http://localhost:5173`
* **Backend API**: `http://localhost:3000`

To stop the services:
```bash
docker-compose down
```

---

## Default Seeded Users

By default the database seed creates two users. You can login with these credentials:

| Role     | Username   | Email                    | Password  |
|----------|------------|--------------------------|-----------|
| Manager  | John_Doe   | john.doe@example.com     | password  |
| Employee | Jane_Doe   | jane.doe@example.com     | password  |

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
│   ├── tests/
│   ├── Dockerfile
│   ├── knexfile.js
│   └── package.json
├── docker-compose.yml
├── README.md        # this file
└── DEVELOPMENT.md   # alternative setup methods & dev notes
```

---

## Acknowledgements

Thank you for checking out this project.  
Contributions or feedback are appreciated.  
Developed by *Christos Gkaldanidis*.

> **Note for developers**: See [DEVELOPMENT.md](DEVELOPMENT.md) for alternative setup methods, testing instructions, and troubleshooting tips.
