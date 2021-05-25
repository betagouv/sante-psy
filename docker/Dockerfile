FROM cypress/base:14

WORKDIR /app 

COPY .env.sample .env
COPY . /app 

EXPOSE 8080

RUN npm install
RUN npm run scalingo-prebuild
RUN npm run scalingo-postbuild

CMD ["node", "dist/index.js"]