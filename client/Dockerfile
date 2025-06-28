# client/Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# expose dev server port (for local dev)
EXPOSE 5173
ENV VITE_API_URL=http://localhost:3000
CMD ["npm", "run", "dev"]