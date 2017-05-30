FROM node:7.5.0

ENV APP_HOME /usr/src/app

RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME

COPY package.json $APP_HOME

ENV NODE_ENV production

RUN npm install -g node-gyp pm2
RUN npm install

COPY . $APP_HOME

EXPOSE 3000
CMD ["pm2-docker", "process.json"]