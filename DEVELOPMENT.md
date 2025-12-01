# Development Notes

Personal reference for alternative ways to run the project.

---

## Manual Setup (Without Docker)

### Prerequisites

* **Node.js** v18+ (LTS)
* **npm** (bundled with Node)

### Environment Variables

Create `.env` files in each folder:

* **server/.env**

  ```dotenv
  PORT=3000
  DB_FILE=./data.sqlite
  JWT_SECRET=your-secret-key
  ```

* **client/.env**

  ```bash
  VITE_API_URL=http://localhost:3000
  ```

### Backend Setup

```bash
# from repo root
cd server
npm install
cp .env.example .env       # fill in values

# run migrations & seeds, then start server:
npm run migrate
npm run seed
npm run dev
```

Server listens on `http://localhost:3000`.

### Frontend Setup

```bash
# from repo root
cd client
npm install
cp .env.example .env       # ensure VITE_API_URL is set

# start dev server
npm run dev
```

App runs at `http://localhost:5173`.

---

## Testing

### Backend Tests

```bash
cd server
npm test    # runs Vitest + Supertest integration tests
```

---

## Docker Notes

### Build and Run
```bash
docker-compose up --build
```

### Stop Containers
```bash
docker-compose down
```

### Stop and Remove Volumes
```bash
docker-compose down -v
```

### View Logs
```bash
docker-compose logs -f
docker-compose logs -f api
docker-compose logs -f web
```

### Rebuild Specific Service
```bash
docker-compose up --build api
docker-compose up --build web
```

---

## Troubleshooting

### Issue: Packages not found
- Make sure local `node_modules` are deleted
- Let Docker handle all dependencies

### Issue: SQLite errors
- Check that db-data volume is properly mounted
- Verify DB_FILE path in docker-compose.yml

### Issue: Port conflicts
- Check if ports 3000 or 5173 are already in use
- Modify ports in docker-compose.yml if needed

