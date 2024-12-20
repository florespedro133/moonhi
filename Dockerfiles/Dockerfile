FROM node:18

WORKDIR /usr/src/app

COPY ../package*.json ./
RUN npm install -g nodemon && npm install --production

COPY ../ ./

EXPOSE 3000

CMD ["npm", "run", "dev"]