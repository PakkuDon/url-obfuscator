FROM node:12

WORKDIR /usr/src/app

COPY package.json ./
COPY app.js ./
COPY db.js ./
COPY README.md ./

RUN yarn
EXPOSE 3000
CMD ["node", "app.js"]
