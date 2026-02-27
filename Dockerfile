FROM node:18


WORKDIR /app


COPY package*.json ./
RUN npm install


COPY . .


RUN cd insa-react && npm install && npm run build


EXPOSE 3000


CMD ["node", "server.js"]