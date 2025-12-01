# server/Dockerfile
FROM node:20

# set working directory
WORKDIR /app

# copy package defs and install deps
COPY package*.json ./
RUN npm install

# copy rest of server code
COPY . .

# expose port and start
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "./entrypoint.sh"]