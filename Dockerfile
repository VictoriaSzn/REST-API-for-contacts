FROM node:14.20
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "node", "server" ] 